import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";
import { BusinessReviewsProps } from "../../../../../types";

export async function POST(req: Request) {
    try {
        const { businessId, userId } = await req.json();

        if (!businessId || !userId) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId).select("reviews");

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        const review: BusinessReviewsProps = business.reviews.find((r: BusinessReviewsProps) => r.userId.toString() === userId);

        if (!review) {
            return NextResponse.json({ error: "No review found" }, { status: 404 });
        }

        return NextResponse.json({ review, status:"success" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
    }
}
