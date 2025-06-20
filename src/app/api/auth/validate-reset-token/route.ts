// /app/api/validate-reset-token/route.ts (for Next.js 13+ App Router)

import { NextResponse } from 'next/server'
import User from '@/model/User'
import { connectToDatabase } from '@/lib/mongo/initDB'

export async function POST(req: Request) {
    try {
        const { token, email } = await req.json()
        if (!token) {
            return NextResponse.json({ message: "Token is required" }, { status: 400 })
        }
        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 })
        }

        await connectToDatabase()

        const user = await User.findOne({
            email,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // not expired
        })

        if (!user) {
            return NextResponse.json({ valid: false, message: "Invalid or expired token" }, { status: 401 })
        }

        return NextResponse.json({ valid: true, email: user.email })
    } catch (error) {
        console.error("Token validation error:", error)
        return NextResponse.json({ valid: false, message: "Internal error" }, { status: 500 })
    }
}
