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
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");

        const skip = (page - 1) * limit;
        const userId = searchParams.get('id');

        await connectToDatabase();

        const items = await Item.find({ userId }).sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Item.countDocuments({ userId });
        const active = await Item.countDocuments({ userId, isAvailable: true });
        const escrow = await Item.countDocuments({ userId, useEscrow: true });

        const prices = await Item.find({ userId }).select("price").lean();
        const totalPrice = prices.reduce((sum, i) => sum + (i.price || 0), 0);
        const avgPrice = prices.length > 0 ? totalPrice / prices.length : 0;

        return new Response(JSON.stringify({
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
        }), { status: 200 });
    } catch (error) {
        console.error('[USER_ITEMS_ERROR]', error);
        return NextResponse.json({ error: 'Failed to fetch user items' }, { status: 500 });
    }
}
