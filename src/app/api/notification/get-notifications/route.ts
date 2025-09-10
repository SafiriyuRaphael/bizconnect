import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import Notification from "@/model/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function GET(req: Request) {
    const user = await getServerSession(authOptions)
    const userId = user?.user.id
    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDatabase()

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const sortBy = searchParams.get("sortBy") || "newest";

    let query: any = { userId };

    if (status === "read") query.isRead = true;
    if (status === "unread") query.isRead = false;

    if (priority !== "all") query.priority = priority.toUpperCase();

    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { message: { $regex: search, $options: "i" } },
        ];
    }

    let sort: any = {};
    if (sortBy === "oldest") sort.createdAt = 1;
    else if (sortBy === "priority") sort.priority = -1;
    else sort.createdAt = -1;

    try {
        const notifications = await Notification.find(query).sort(sort).lean();
        return NextResponse.json({ notifications });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
