// File: /app/api/auth/get-user-by-username/route.ts

import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username } = await req.json();
        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const user = await User.findOne({ username }).lean();

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
