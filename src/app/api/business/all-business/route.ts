import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/initDB';
import { Business } from '@/model/Business';
import { Item } from '@/model/Item';
import User from '@/model/User';
import { getServerSession } from "next-auth"; // if you’re using next-auth
import { AnyUser } from '../../../../../types';

export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);

        // Session / logged-in user
        const session = await getServerSession();
        let userLocation: string | null = null;

        if (session?.user?.email) {
            const user = await User.findOne({ email: session.user.email }).lean<AnyUser>();
            if (user?.deliveryAddress || user?.businessAddress) {
                userLocation = user.deliveryAddress || user.businessAddress || null;
            }
        }

        const category = searchParams.get('category') || null;
        const search = searchParams.get('search') || "";
        const sort = searchParams.get('sort') || "best";
        const deliveryTime = parseInt(searchParams.get('deliveryTime') || "0");
        const rating = parseFloat(searchParams.get('rating') || "0");

        const page = parseInt(searchParams.get('page') || "1");
        const limit = parseInt(searchParams.get('limit') || "10");
        const skip = (page - 1) * limit;

        // Build filter
        const filter: any = {};
        if (category && category !== "all") {
            filter.businessCategory = category;
        }

        if (deliveryTime && deliveryTime !== 0) {
            filter.deliveryTime = { $lte: deliveryTime };
        }

        if (search) {
            filter.$or = [
                { businessName: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } },
                { businessDescription: { $regex: search, $options: "i" } },
                { businessAddress: { $regex: search, $options: "i" } },
            ];

            //  Find businesses by item name OR tags
            const items = await Item.find({
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } },
                ]
            }).distinct("userId");

            if (items.length > 0) {
                filter.$or.push({ _id: { $in: items } });
            }
        }

        if (!isNaN(rating) && rating > 0) {
            filter["reviews.rating"] = { $gte: rating };
        }

        // Price range filtering
        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "1000000");

        filter["priceRange.min"] = { $lte: maxPrice };
        filter["priceRange.max"] = { $gte: minPrice };
        filter.deleted = { $ne: true };

        // Sorting logic
        let sortOption: any = {};
        switch (sort) {
            case "newest":
                sortOption.createdAt = -1;
                break;
            case "rating":
                sortOption["averageRating"] = -1;
                break;
            case "price-low":
                sortOption["priceRange.min"] = 1;
                break;
            case "price-high":
                sortOption["priceRange.max"] = -1;
                break;
            case "best":
                sortOption.relevance = -1;
                break;
            default:
                sortOption.createdAt = -1;
        }

        // Pipeline
        let pipeline: any[] = [
            { $match: filter },
            {
                $addFields: {
                    averageRating: { $avg: "$reviews.rating" },
                    relevance: search ? {
                        $cond: [
                            { $regexMatch: { input: "$businessName", regex: search, options: "i" } },
                            2,
                            {
                                $cond: [
                                    { $regexMatch: { input: "$businessDescription", regex: search, options: "i" } },
                                    1,
                                    0
                                ]
                            }
                        ]
                    } : 0,
                    locationBoost: userLocation ? {
                        $cond: [
                            { $regexMatch: { input: "$businessAddress", regex: userLocation, options: "i" } },
                            5,
                            0
                        ]
                    } : 0
                }
            },
            {
                $addFields: {
                    totalScore: { $add: ["$relevance", "$locationBoost"] }
                }
            },
            { $sort: sort === "best" ? { totalScore: -1, averageRating: -1 } : sortOption },
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
                    createdAt: 1,
                    updatedAt: 1,
                    displayPics: 1,
                    totalScore: 1
                }
            }
        ];

        const total = await Business.countDocuments(filter);
        const entrepreneurs = await Business.aggregate(pipeline);

        return NextResponse.json({ entrepreneurs, status: "success", total }, { status: 200 });
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
