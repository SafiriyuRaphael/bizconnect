// app/api/notifications/delete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { connectToDatabase } from "@/lib/mongo/initDB";
import Notification from "@/model/Notification";

export async function POST(req: Request) {
    await connectToDatabase()

    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { success: false, message: "No notification IDs provided" },
                { status: 400 }
            );
        }

       
        const result = await Notification.deleteMany({
            _id: { $in: ids },
            userId: session.user.id,
        });

        return NextResponse.json({
            success: true,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error("Delete notifications error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete notifications" },
            { status: 500 }
        );
    }
}
