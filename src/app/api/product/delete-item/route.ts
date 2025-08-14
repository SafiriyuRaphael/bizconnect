import { connectToDatabase } from '@/lib/mongo/initDB';
import { NextRequest, NextResponse } from 'next/server';
import { Item } from '@/model/Item';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { deleteFromCloudinary } from '@/lib/cloudinary/deleteFromCloudinary';
import { BusinessDisplayPicsProps } from '../../../../../types';

export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get('id');

        if (!itemId || !itemId.match(/^[0-9a-fA-F]{24}$/)) {
            return NextResponse.json({ error: 'Invalid or missing item ID' }, { status: 400 });
        }

        const item = await Item.findById(itemId);
        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        if (item.userId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Not authorized to delete this item' }, { status: 403 });
        }


        const deletionPromises = item.media.map((media: BusinessDisplayPicsProps) =>
            deleteFromCloudinary(media.public_id)
        );
        await Promise.all(deletionPromises);


        await Item.findByIdAndDelete(itemId);

        return NextResponse.json({ success: true, message: 'Item and media deleted' }, { status: 200 });

    } catch (error) {
        console.error('[DELETE_ITEM_ERROR]', error);
        return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
}
