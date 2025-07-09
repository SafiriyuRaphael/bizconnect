import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const users = await User.find({}, "username"); // get only usernames
        const usernames = users.map((user) => user.username);

        return NextResponse.json(
            { usernames, status: "success" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error fetching usernames:", err);

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
