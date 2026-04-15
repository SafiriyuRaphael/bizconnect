import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";
import { BusinessReviewsProps } from "../../../../../types";

export async function POST(req: Request) {
    try {
        const { businessId, userId } = await req.json();

        if (!businessId || !userId) {
            return NextResponse.json({ message: "Missing parameters", success: false }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId).select("reviews");

        if (!business) {
            return NextResponse.json({ message: "Business not found", success: false }, { status: 404 });
        }

        const review: BusinessReviewsProps = business.reviews.find((r: BusinessReviewsProps) => r.userId.toString() === userId);

        if (!review) {
            return NextResponse.json({ message: "No review found", success: true }, { status: 204 });
        }

        return NextResponse.json({ review, status: "success" }, { status: 200 });
    } catch (err) {
        console.error("[USER_REVIEW_ERROR]", err);

        return NextResponse.json({ error: "Failed to get user review. Try again.", success: false }, { status: 500 });
    }
}
