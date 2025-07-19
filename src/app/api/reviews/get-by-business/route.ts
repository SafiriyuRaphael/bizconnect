import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { businessId } = await req.json();

        if (!businessId) {
            return NextResponse.json({ error: "Business ID is required" }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId).lean() as any;

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        return NextResponse.json({
            reviews: business.reviews || [],
            status: "success",
        }, { status: 200 });

    } catch (err) {
        return NextResponse.json({
            error: "Server error",
            details:
                process.env.NODE_ENV === "development"
                    ? err instanceof Error
                        ? err.message
                        : String(err)
                    : undefined,
        }, { status: 500 });
    }
}
