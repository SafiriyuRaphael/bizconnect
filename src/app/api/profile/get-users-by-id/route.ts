
import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { _id } = await req.json();
        if (!_id) {
            return NextResponse.json(
                { error: "user id is required" },
                { status: 400 }
            );
        }
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        await connectToDatabase();
        const user = await User.findOne({ _id, deleted: false }).lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { user, status: "success" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error fetching data:", err);

        return NextResponse.json(
            {
                error: "Internal server error",
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
