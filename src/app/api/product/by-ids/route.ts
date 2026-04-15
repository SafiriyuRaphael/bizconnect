import { connectToDatabase } from "@/lib/mongo/initDB";
import { Item } from "@/model/Item";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { AnyUser, ProductsItemsPageProps } from "../../../../../types";

type ItemWithUser = ProductsItemsPageProps & {
    userId?: AnyUser | null;
};

export async function GET(req: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid or missing item ID.", success: false }, { status: 400 });
        }

        const item = await Item.findById(id)
            .populate({
                path: "userId",
                select: "logo fullName businessName reviews username email verified",
                match: { deleted: false },
                model: "Business",
            })
            .lean<ItemWithUser>();

        if (!item) {
            return NextResponse.json({ message: "Item not found.", success: false }, { status: 404 });
        }

        const user = item.userId;

        // Compute average rating
        const reviews = user?.reviews || [];
        const totalReviews = reviews.length;
        const totalRating = reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0);
        const avgRating = totalReviews > 0 ? totalRating / totalReviews : null;

        // Clean user info
        const userInfo = {
            logo: user?.logo || "",
            fullName: user?.fullName || "",
            businessName: user?.businessName || "",
            username: user?.username || "",
            email: user?.email || "",
            verified: user?.verified || "",
            averageRating: avgRating,
            totalReviews,
        };

        return NextResponse.json({ item: { ...item, user: userInfo } }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch item:", error);
        return NextResponse.json({ message: "Failed to fetch item", success: false }, { status: 500 });
    }
}
