// /api/reset-password
import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectToDatabase();
    const { token, newPassword } = await req.json();

    const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

    user.password = await hash(newPassword, 12);
    user.resetToken = undefined;
    user.resetTokenExpirys = undefined;
    await user.save();

    return NextResponse.json({ msg: "Password reset successful" });
}
