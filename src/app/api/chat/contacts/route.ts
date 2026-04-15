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
        const search = searchParams.get("q")?.trim().toLowerCase();

        // Fetch current user to check starredContacts
        const currentUser = await User.findById(session.user.id).select("starredContacts");

        // If recipientId is provided, return single contact
        if (recipientId) {
            const user = await User.findById(recipientId).select(
                "fullName logo userType businessName username deleted"
            );

            if (!user || user.deleted) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const contact = {
                id: user._id.toString(),
                name: user.userType === "business" ? user.businessName : user.fullName,
                username: user.username,
                company: user.userType === "business" ? user.businessName : "Customer",
                lastMessage: "",
                timestamp: "",
                avatar: user.logo || "",
                online: false,
                unread: 0,
                starred: currentUser.starredContacts.some(
                    (cId: any) => cId.toString() === user._id.toString()
                ),
            };

            return NextResponse.json(contact, { status: 200 });
        }

        // Fetch all messages involving current user
        const messages = await Message.find({
            $or: [{ sender: session.user.id }, { recipient: session.user.id }],
        })
            .populate("sender", "fullName logo userType businessName username")
            .populate("recipient", "fullName logo userType businessName username")
            .sort({ createdAt: -1 });

        const contactMap = new Map();

        messages.forEach((msg) => {
            const otherUser =
                msg.sender._id.toString() === session.user.id ? msg.recipient : msg.sender;

            const key = otherUser._id.toString();

            if (!contactMap.has(key)) {
                contactMap.set(key, {
                    id: key,
                    name: otherUser.userType === "business" ? otherUser.businessName : otherUser.fullName,
                    company: otherUser.userType === "business" ? otherUser.businessName : "Customer",
                    username: otherUser.username,
                    lastMessage: msg.content || (msg.file ? msg.file.name : ""),
                    timestamp: new Date(msg.createdAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                    }),
                    avatar:
                        otherUser.logo ||
                        "",
                    online: false,
                    unread: messages.filter(
                        (m) =>
                            m.recipient._id.toString() === session.user.id &&
                            m.sender._id.toString() === key &&
                            !m.isSeen
                    ).length,
                    starred: currentUser.starredContacts.some(
                        (cId: any) => cId.toString() === otherUser._id.toString()
                    ),
                });
            }
        });

        // Convert to array and sort starred contacts first
        const contacts = Array.from(contactMap.values()).sort((a, b) => {
            if (a.starred && !b.starred) return -1;
            if (!a.starred && b.starred) return 1;
            return 0;
        });

        let results = contacts;

        // If search query exists, filter
        if (search) {
            results = contacts.filter(
                (c) =>
                    c.name.toLowerCase().includes(search) ||
                    c.username.toLowerCase().includes(search) ||
                    c.company.toLowerCase().includes(search)
            );
        }

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

