import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const users = await User.find({ deleted: false }, "_id");
        const usersId = users.map((user) => user._id);

        return NextResponse.json(
            { usersId, status: "success" },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error fetching userId:", err);

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
