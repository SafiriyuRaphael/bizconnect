import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongo/initDB"
import { UserCollection } from "@/model/UserCollection"
import { auth } from "@/auth";

export async function GET(
    req: NextRequest
) {
    try {
        await connectToDatabase()

        const session = await auth();
        if (!session) return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });

        const userId = session?.user.id

        const favorites = await UserCollection.find({
            userId,
        }).lean()

        return NextResponse.json(favorites, { status: 200 })
    } catch (err: any) {
        console.error("Error fetching favorites:", err)
        return NextResponse.json(
            { message: "Failed to fetch favorites", success: false },
            { status: 500 }
        )
    }
}
