import { connectToDatabase } from '@/lib/mongo/initDB';
import { Item } from '@/model/Item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const user = session?.user?.id;

        if (!user) {
            return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const userId = searchParams.get('id');
        const searchQuery = searchParams.get("q") || "";
        const filterBy = searchParams.get("filterBy") || "all";
        const sortBy = searchParams.get("sortBy") || "createdAt";

        await connectToDatabase();

        // Base query
        const query: any = { userId };

        // Search filter
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { description: { $regex: searchQuery, $options: "i" } },
            ];
        }

        // Availability / type filters
        if (filterBy === "product") query.type = "product";
        if (filterBy === "service") query.type = "service";
        if (filterBy === "available") query.isAvailable = true;
        if (filterBy === "unavailable") query.isAvailable = false;

        // Sorting
        let sort: any = {};
        switch (sortBy) {
            case "name":
                sort.title = 1; // alphabetical
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
                sort.createdAt = -1; // latest first
        }

        // Query DB
        const [items, total, active, escrow, prices] = await Promise.all([
            Item.find(query).sort(sort).skip(skip).limit(limit).lean(),
            Item.countDocuments({ userId }),
            Item.countDocuments({ userId, isAvailable: true }),
            Item.countDocuments({ userId, useEscrow: true }),
            Item.find({ userId }).select("price").lean(),
        ]);

        const totalPrice = prices.reduce((sum, i) => sum + (i.price || 0), 0);
        const avgPrice = prices.length > 0 ? totalPrice / prices.length : 0;

        return NextResponse.json({
            items,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                total,
            },
            stats: {
                totalItems: total,
                activeItems: active,
                avgPrice: Math.round(avgPrice),
                escrowEnabled: escrow,
            },
        });
    } catch (error) {
        console.error('[USER_ITEMS_ERROR]', error);
        return NextResponse.json({ message: 'Failed to fetch user items', success: false }, { status: 500 });
    }
}
