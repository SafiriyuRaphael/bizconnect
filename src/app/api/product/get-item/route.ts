import { connectToDatabase } from '@/lib/mongo/initDB';
import { Item } from '@/model/Item';
import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        const user = session?.user?.id;

        if (!user) {
            return NextResponse.json(
                { message: 'Unauthorized', success: false },
                { status: 401 }
            );
        }


        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 1), 100);
        const skip = (page - 1) * limit;
        const userId = searchParams.get('id');
        const searchQuery = searchParams.get("q") || "";
        const filterBy = searchParams.get("filterBy") || "all";
        const sortBy = searchParams.get("sortBy") || "createdAt";

        if (!userId) {
            return NextResponse.json({ message: "Missing user ID", success: false }, { status: 400 });
        }

        await connectToDatabase();

        // ✅ Build query properly
        const query: any = { userId };

        // ✅ Search across title, description, tags
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
                { tags: { $in: [new RegExp(searchQuery, "i")] } }
            ];
        }

        // ✅ Apply filters
        if (filterBy === "product") query.type = "product";
        if (filterBy === "service") query.type = "service";
        if (filterBy === "available") query.isAvailable = true;
        if (filterBy === "unavailable") query.isAvailable = false;

        // ✅ Sorting
        const sort: Record<string, 1 | -1> = {};
        switch (sortBy) {
            case "name":
                sort.title = 1;
                break;
            case "price-low":
                sort.price = 1;
                break;
            case "price-high":
                sort.price = -1;
                break;
            case "availability":
                sort.isAvailable = -1;
                break;
            default:
                sort.createdAt = -1;
        }


        const [items, totalFiltered, totalItems, active, escrow, totalProducts, totalServices] = await Promise.all([
            Item.find(query).sort(sort).skip(skip).limit(limit).lean(),
            Item.countDocuments(query),
            Item.countDocuments({ userId }),
            Item.countDocuments({ userId, isAvailable: true }),
            Item.countDocuments({ userId, useEscrow: true }),
            Item.countDocuments({ userId, type: "product" }),
            Item.countDocuments({ userId, type: "service" }),
        ]);

        const priceStats = await Item.aggregate([
            { $match: query },
            { $group: { _id: null, totalPrice: { $sum: "$price" }, avgPrice: { $avg: "$price" } } }
        ]);

        const { totalPrice = 0, avgPrice = 0 } = priceStats[0] || {};

        return NextResponse.json({
            items,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalFiltered / limit),
                total: totalFiltered,
            },
            stats: {
                totalItems,
                filteredItems: totalFiltered,
                activeItems: active,
                avgPrice: Math.round(avgPrice),
                totalPrice,
                escrowEnabled: escrow,
                totalProducts,
                totalServices
            },
        });
    } catch (error) {
        console.error('[USER_ITEMS_ERROR]', error);
        return NextResponse.json(
            { message: 'Failed to fetch user items', success: false },
            { status: 500 }
        );
    }
}
