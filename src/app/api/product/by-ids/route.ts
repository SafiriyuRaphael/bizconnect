import { connectToDatabase } from "@/lib/mongo/initDB";
import { Item } from "@/model/Item";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid or missing item ID." }, { status: 400 });
        }

        const item: any = await Item.findById(id)
            .populate({
                path: "userId",
                select: "logo fullName businessName reviews username email verified",
                model: "Business",
            })
            .lean();

        if (!item) {
            return NextResponse.json({ error: "Item not found." }, { status: 404 });
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
            username: user.username || "",
            email: user.email || "",
            verified: user.verified || "",
            averageRating: avgRating,
            totalReviews,
        };

        return NextResponse.json({ item: { ...item, user: userInfo } }, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch item:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
