import { authOptions } from "@/lib/auth/options";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Item } from "@/model/Item";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const itemIds = await Item.find({}).select("_id").lean();

        const ids = itemIds.map((item) => item._id);

        return NextResponse.json({ ids }, { status: 200 });
    } catch (error) {
        console.error("Error fetching item IDs:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
