import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import Message from "@/model/Message";
import { auth } from "@/auth";

// /api/messages?recipientId=123
export async function GET(req: Request) {
    await connectToDatabase();

    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get("recipientId");
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "20", 10);

        if (!recipientId) {
            return NextResponse.json({ error: "Missing recipientId" }, { status: 400 });
        }

        const query = {
            $or: [
                { sender: session.user.id, recipient: recipientId },
                { sender: recipientId, recipient: session.user.id },
            ],
        };

        const total = await Message.countDocuments(query);
        const messages = await Message.find(query)
            .populate("sender", "fullName logo")
            .populate("recipient", "fullName logo")
            .sort({ createdAt: -1 }) // newest first
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            messages,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
    }
}
