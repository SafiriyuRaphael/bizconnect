import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { businessId } = await req.json();

        if (!businessId) {
            return NextResponse.json({ message: "Business ID is required", success: false }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId).lean() as any;

        if (!business) {
            return NextResponse.json({ message: "Business not found", success: false }, { status: 404 });
        }

        return NextResponse.json({
            reviews: business.reviews || [],
            status: "success",
        }, { status: 200 });

    } catch (err) {
        console.error('BUSINESS_REVIEW_ERROR]', err);
        return NextResponse.json({
            message: "Failed to get business reviews",
            success: false,
        }, { status: 500 });
    }
}
