import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/initDB';
import { Item } from '@/model/Item';
import { Business } from '@/model/Business';
import { auth } from "@/auth";
import { redirect } from 'next/navigation';

export async function PATCH(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await auth();

        if (!session?.user) {
            redirect("/auth/login");
        }

        const body = await req.json();
        const {
            _id,
            title,
            description,
            tags,
            type,
            price,
            deliveryTime,
            useEscrow = true,
            media,
            isAvailable = true,
        } = body;

        if (!_id || !title || !price || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const item = await Item.findById(_id);
        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        if (item.userId.toString() !== session?.user.id) {
            return NextResponse.json({ error: 'Unauthorized to edit this item' }, { status: 403 });
        }

        const businessUser = await Business.findById(session?.user.id);
        if (useEscrow && !businessUser?.verifiedBusiness) {
            return NextResponse.json({ error: 'Only verified businesses can enable escrow' }, { status: 403 });
        }


        item.title = title;
        item.description = description;
        item.tags = tags;
        item.type = type;
        item.price = price;
        item.deliveryTime = deliveryTime;
        item.useEscrow = useEscrow;
        item.media = media;
        item.isAvailable = isAvailable;

        await item.save();

        return NextResponse.json(item, { status: 200 });
    } catch (err) {
        console.error('[ITEM_EDIT_ERROR]', err);
        return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
}
