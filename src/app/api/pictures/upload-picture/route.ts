
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";
import { BusinessDisplayPicsProps } from "../../../../../types";

export async function POST(req: Request) {
    try {
        const { businessId, pictures } = await req.json();

        if (!businessId || !Array.isArray(pictures)) {
            return NextResponse.json({ error: "Missing or invalid data" }, { status: 400 });
        }

        await connectToDatabase();
        const business = await Business.findById(businessId);

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        const currentPicCount = business.displayPics?.length || 0;

        const incomingPicCount = pictures.length;

        if (currentPicCount >= 10) {
            return NextResponse.json(
                { error: "Maximum number of pictures reached (10)" },
                { status: 400 }
            );
        }

        if (currentPicCount + incomingPicCount > 10) {
            return NextResponse.json(
                {
                    error: `Only ${10 - currentPicCount} picture(s) allowed to reach max of 10`,
                },
                { status: 400 }
            );
        }

        const formattedPics = pictures.map((pic: BusinessDisplayPicsProps) => ({
            url: pic.url,
            name: pic.name,
            uploadedAt: new Date(),
            public_id: pic.public_id
        }));
        if (!Array.isArray(business.displayPics)) {
            business.displayPics = [];
        }
        business.displayPics.push(...formattedPics);
        await business.save();

        return NextResponse.json({ message: "Pictures uploaded", pics: business.displayPics }, { status: 200 });
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
