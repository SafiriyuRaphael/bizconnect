import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { businessId, reviewId, userId } = await req.json();

        if (!businessId || !reviewId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId);

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        const review = business.reviews.id(reviewId);
        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        const alreadyVoted = review.helpful.voters.some((voter: any) =>
            voter.toString() === userId
        );

        if (alreadyVoted) {
            // Undo helpful
            review.helpful.voters = review.helpful.voters.filter(
                (voter: any) => voter.toString() !== userId
            );
            review.helpful.count = review.helpful.count - 1;
        } else {
            // Add helpful
            review.helpful.voters.push(userId);
            review.helpful.count = review.helpful.count + 1;
        }

        await business.save();

        return NextResponse.json({
            message: "Helpful updated",
            helpful: review.helpful,
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({
            error: "Server error",
            details:
                process.env.NODE_ENV === "development"
                    ? err instanceof Error ? err.message : String(err)
                    : undefined,
        }, { status: 500 });
    }
}
