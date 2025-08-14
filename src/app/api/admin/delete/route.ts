import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import User from "@/model/User";
import { connectToDatabase } from "@/lib/mongo/initDB";

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const isAdmin = session?.user.userRole === "admin"


        if (!isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }



        const body = await req.json();
        const { userId } = body;


        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(userId)

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.deleted) {
            return NextResponse.json({ message: "User is already deleted" }, { status: 400 });
        }

        await User.findByIdAndUpdate(user, {
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
