import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import Message from "@/model/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

// /api/messages?recipientId=123
export async function GET(req: Request) {
    await connectToDatabase();


    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get("recipientId");

        if (!recipientId) {
            return NextResponse.json({ error: "Missing recipientId" }, { status: 400 });
        }

        const messages = await Message.find({
            $or: [ 
                { sender: session.user.id, recipient: recipientId },
                { sender: recipientId, recipient: session.user.id },
            ],
        })
            .populate("sender", "fullName logo")
            .populate("recipient", "fullName logo")
            .sort({ createdAt: 1 });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
    }
}
