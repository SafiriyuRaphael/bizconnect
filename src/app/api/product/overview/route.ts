// /api/items/overview/route.ts

import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { Item } from "@/model/Item";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    await connectToDatabase();



    const business = await Business.findById(userId);

    if (!business) {
        return NextResponse.json({ error: 'Access denied. Business users only.' }, { status: 403 });
    }



    try {
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
        console.error("Failed to fetch overview:", error);
        return new Response(JSON.stringify({ success: false, error }), { status: 500 });
    }
}
