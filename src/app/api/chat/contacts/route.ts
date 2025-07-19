import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { connectToDatabase } from "@/lib/mongo/initDB";
import Message from "@/model/Message";
import User from "@/model/User";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const recipientId = searchParams.get("recipientId");

        // If recipientId is provided, return contact info for one user
        if (recipientId) {
            const user = await User.findById(recipientId).select(
                "fullName logo userType businessName username"
            );

            if (!user || user.deleted) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const contact = {
                id: user._id.toString(),
                name:
                    user.userType === "business"
                        ? user.businessName
                        : user.fullName,
                username: user.username,
                company:
                    user.userType === "business"
                        ? user.businessName
                        : "Customer",
                lastMessage: "",
                timestamp: "",
                avatar:
                    user.logo ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                online: false,
                unread: 0,
            };

            return NextResponse.json(contact, { status: 200 });
        }

        // Fetch all messages where current user is involved
        const messages = await Message.find({
            $or: [
                { sender: session.user.id },
                { recipient: session.user.id },
            ],
        })
            .populate("sender", "fullName logo userType businessName username")
            .populate("recipient", "fullName logo userType businessName username")
            .sort({ createdAt: -1 }); // timestamps option auto adds createdAt

        const contactMap = new Map();

        messages.forEach((msg) => {
            const otherUser =
                msg.sender._id.toString() === session.user.id
                    ? msg.recipient
                    : msg.sender;

            const key = otherUser._id.toString();

            if (!contactMap.has(key)) {
                contactMap.set(key, {
                    id: key,
                    name:
                        otherUser.userType === "business"
                            ? otherUser.businessName
                            : otherUser.fullName,
                    company:
                        otherUser.userType === "business"
                            ? otherUser.businessName
                            : "Customer",
                    username: otherUser.username,
                    lastMessage: msg.content || (msg.file ? msg.file.name : ""),
                    timestamp: new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }),
                    avatar:
                        otherUser.logo ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
                    online: false,
                    unread: messages.filter(
                        (m) =>
                            m.recipient._id.toString() === session.user.id &&
                            m.sender._id.toString() === key &&
                            !m.isSeen
                    ).length,
                });
            }
        });

        const contacts = Array.from(contactMap.values());
        return NextResponse.json(contacts, { status: 200 });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
