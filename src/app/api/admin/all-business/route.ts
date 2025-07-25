import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/initDB';
import { Business } from '@/model/Business';
import Message from '@/model/Message'; 
import { Verification } from '@/model/Verification';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);

        const category = searchParams.get('category') || null;
        const search = searchParams.get('search') || "";
        const sort = searchParams.get('sort') || "best";
        const deliveryTime = parseInt(searchParams.get('deliveryTime') || "0");
        const rating = parseFloat(searchParams.get('rating') || "0");

        const page = parseInt(searchParams.get('page') || "1");
        const limit = parseInt(searchParams.get('limit') || "10");
        const skip = (page - 1) * limit;

        const filter: any = {};

        if (category && category !== "all") filter.businessCategory = category;
        if (deliveryTime && deliveryTime !== 0) filter.deliveryTime = deliveryTime;
        if (search) {
            filter.$or = [
                { businessName: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ];
        }
        if (!isNaN(rating) && rating > 0) filter["reviews.rating"] = { $gte: rating };

        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");

        filter["priceRange.min"] = { $lte: maxPrice };
        filter["priceRange.max"] = { $gte: minPrice };
        filter.deleted = { $ne: true };

        let sortOption: any = {};
        switch (sort) {
            case "newest": sortOption.createdAt = -1; break;
            case "rating": sortOption["averageRating"] = -1; break;
            case "price-low": sortOption["priceRange.min"] = 1; break;
            case "price-high": sortOption["priceRange.max"] = -1; break;
            case "best": sortOption.relevance = -1; break;
            default: sortOption.createdAt = -1;
        }

        const total = await Business.countDocuments(filter);

        const entrepreneurs = await Business.aggregate([
            { $match: filter },
            { $addFields: { averageRating: { $avg: "$reviews.rating" } } },
            { $sort: sortOption },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    businessName: 1,
                    businessCategory: 1,
                    businessAddress: 1,
                    businessDescription: 1,
                    website: 1,
                    logo: 1,
                    email: 1,
                    phone: 1,
                    username: 1,
                    fullName: 1,
                    reviews: 1,
                    priceRange: 1,
                    deliveryTime: 1,
                    verified: 1,
                    averageRating: 1,
                    verifiedBusiness: 1,
                }
            }
        ]);

        const enriched = await Promise.all(entrepreneurs.map(async (biz) => {
            const contactAgg = await Message.aggregate([
                { $match: { $or: [{ sender: biz._id }, { recipient: biz._id }] } },
                {
                    $group: {
                        _id: null,
                        contacts: {
                            $addToSet: {
                                $cond: [
                                    { $ne: ["$sender", biz._id] },
                                    "$sender",
                                    "$recipient"
                                ]
                            }
                        }
                    }
                },
                { $project: { count: { $size: "$contacts" } } }
            ]);

            const contactCount = contactAgg[0]?.count || 0;

            const verification = await Verification.findOne({ userId: biz._id });



            return {
                ...biz,
                contactCount,
                verificationStatus: verification?.status ?? "unverified"
            };
        }));

        return NextResponse.json({ entrepreneurs: enriched, status: "success", total }, { status: 200 });

    } catch (error) {
        console.error('Entrepreneur error:', error);
        return NextResponse.json(
            {
                error: "Internal server error",
                details: process.env.NODE_ENV === 'development'
                    ? error instanceof Error ? error.message : String(error)
                    : undefined
            },
            { status: 500 }
        );
    }
}
