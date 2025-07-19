// /app/api/business/pictures/delete/route.ts
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { BusinessDisplayPicsProps } from "../../../../../types";

export async function POST(req: Request) {
    try {
        const { businessId, public_id } = await req.json();

        if (!businessId || !public_id) {
            return NextResponse.json(
                { error: "Business ID and public_id required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const business = await Business.findById(businessId);

        if (!business || !Array.isArray(business.displayPics)) {
            return NextResponse.json(
                { error: "Business not found" },
                { status: 404 }
            );
        }


        await cloudinary.uploader.destroy(public_id);

        // Remove from DB
        const originalLength = business.displayPics.length;
        business.displayPics = business.displayPics.filter(
            (pic: BusinessDisplayPicsProps) => pic.public_id !== public_id
        );

        if (business.displayPics.length === originalLength) {
            return NextResponse.json(
                { error: "Picture not found in DB" },
                { status: 404 }
            );
        }

        await business.save();

        return NextResponse.json(
            { message: "Picture deleted", pics: business.displayPics },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json(
            {
                error: "Server error",
                details:
                    process.env.NODE_ENV === "development"
                        ? err instanceof Error
                            ? err.message
                            : String(err)
                        : undefined,
            },
            { status: 500 }
        );
    }
}
