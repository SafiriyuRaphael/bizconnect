import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongo/initDB';
import { Item } from '@/model/Item';
import User from '@/model/User';
import { Business } from '@/model/Business'; 

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const {
      userId,
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

  
    if (!userId || !title || !price || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const businessUser = await Business.findById(userId);
    if (useEscrow && !businessUser?.verifiedBusiness) {
      return NextResponse.json({ error: 'Only verified businesses can enable escrow' }, { status: 403 });
    }

    const newItem = await Item.create({
      userId,
      title,
      description,
      tags,
      type,
      price,
      deliveryTime,
      useEscrow,
      media,
      isAvailable,
    });

    return NextResponse.json(newItem, { status: 201 });

  } catch (err) {
    console.error('[ITEM_POST_ERROR]', err);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}
