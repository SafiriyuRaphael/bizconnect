import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongo/initDB";
import User from "@/model/User";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const session = await auth();
        if (!session) {
            return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
        }

        const { contactId } = await req.json();
        if (!contactId) {
            return NextResponse.json({ message: "Missing contactId", success: false }, { status: 400 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
        }

        const alreadyStarred = user.starredContacts.includes(contactId);

        if (alreadyStarred) {
            user.starredContacts = user.starredContacts.filter(
                (id: any) => id.toString() !== contactId
            );
        } else {
            if (user.starredContacts.length >= 3) {
                return NextResponse.json(
                    { message: "You can only star up to 3 contacts", success: false },
                    { status: 400 }
                );
            }
            user.starredContacts.push(contactId);
        }

        await user.save();
        return NextResponse.json({ success: true, starredContacts: user.starredContacts });
    } catch (error) {
        console.error("Error starring contact:", error);
        return NextResponse.json({ message: "Failed to star contact", success: false }, { status: 500 });
    }
}
