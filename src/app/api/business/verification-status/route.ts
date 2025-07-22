import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Verification } from "@/model/Verification";

export async function GET(req: Request) {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { message: "Missing userId" },
            { status: 400 }
        );
    }

    try {
        const verification = await Verification.findOne({ userId });

        if (!verification) {
            return NextResponse.json({ status: "not_submitted" });
        }

        return NextResponse.json({
            status: verification.status,
            submittedAt: verification.submittedAt,
            verifiedAt: verification.verifiedAt,
            reason: verification.reason || null,
        });
    } catch (err) {
        console.error("Verification status check failed:", err);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
