import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import User from "@/model/User";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { compare } from "bcrypt";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { password } = body;

        if (!password) {
            return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id).select("+password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isValid = await compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }


        await User.findByIdAndUpdate(session.user.id, {
            $set: {
                deleted: true,
                email: `deleted-${Date.now()}-${user.email}`,
                username: `deleted-${user.username}`
            }
        });



        return NextResponse.json({ status: "Account deleted" }, { status: 200 });
    } catch (err) {
        console.error("Account delete error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
