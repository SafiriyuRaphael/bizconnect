
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Item } from "@/model/Item";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDatabase();

        const items = await Item.find({}).select("_id title").lean<{ _id: string; title: string }[]>();

        const ids = items.map((item) => ({
            id: item._id.toString(),
            title: item.title,
        }));

        return NextResponse.json({ ids }, { status: 200 });
    } catch (error) {
        console.error("Error fetching item IDs:", error);
        return NextResponse.json({ message: "Error getting item IDs", success: false }, { status: 500 });
    }
}
