// /app/api/reviews/upsert/route.ts
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";
import { BusinessReviewsProps } from "../../../../../types";

export async function POST(req: Request) {
    try {
        const { businessId, userId, username, displayPic, rating, comment, fullName } = await req.json();

        if (comment.length > 2000) {
            return NextResponse.json({ error: "Comment too long" }, { status: 400 });
        }

        if (!businessId || !userId || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId);

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }


        const existingReviewIndex = business.reviews.findIndex((r: BusinessReviewsProps) =>
            r.userId.toString() === userId
        );

        const existingReview = business.reviews[existingReviewIndex];


        const newReview = {
            userId,
            username,
            displayPic,
            rating,
            comment,
            fullName,
            createdAt: new Date(),
        };

        if (existingReviewIndex !== -1) {
            Object.assign(business.reviews[existingReviewIndex], {
                username,
                displayPic,
                rating,
                comment,
                fullName,
                updatedAt: new Date(),
            });
        } else {
            business.reviews.unshift({
                userId,
                username,
                displayPic,
                rating,
                comment,
                fullName,
                createdAt: new Date(),
            });
        }




        await business.save();

        return NextResponse.json({
            message: "Review saved",
            status: "success",
            reviews: business.reviews,
        }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: "Server error", details: err }, { status: 500 });
    }
}
