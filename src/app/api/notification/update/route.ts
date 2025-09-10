// app/api/notifications/bulk/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import Notification from "@/model/Notification";

export async function PATCH(req: Request) {
    try {
        await connectToDatabase();
        const { ids, action } = await req.json(); // 

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "IDs required" }, { status: 400 });
        }

        if (!["read", "unread"].includes(action)) {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const updated = await Notification.updateMany(
            { _id: { $in: ids } },
            { $set: { isRead: action === "read" } }
        );

        return NextResponse.json({ success: true, updated });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
