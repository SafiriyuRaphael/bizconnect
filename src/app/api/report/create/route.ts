import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/options"
import { connectToDatabase } from "@/lib/mongo/initDB"
import Report from "@/model/Reports"

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase()
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            )
        }

        const body = await req.json()
        const { reason, title, targetType, targetId } = body

        if (!title || !targetType || !targetId) {
            return NextResponse.json(
                { success: false, message: "Please fill in all required fields." },
                { status: 400 }
            )
        }

        const report = await Report.create({
            reporter: session.user.id,
            reason,
            title,
            targetType,
            targetId,
        })

        return NextResponse.json(
            {
                success: true,
                message: "Report created successfully",
                data: report,
            },
            { status: 201 }
        )
    } catch (err: any) {
        console.error("Error creating report:", err)
        return NextResponse.json(
            {
                success: false,
                message:
                    "Failed to create report",
            },
            { status: 500 }
        )
    }
}
