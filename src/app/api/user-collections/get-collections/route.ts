import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongo/initDB"
import { UserCollection } from "@/model/UserCollection"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"

export async function GET(
    req: NextRequest
) {
    try {
        await connectToDatabase()

        const session = await getServerSession(authOptions)
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
