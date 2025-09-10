import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Escrow } from "@/model/Escrow";
import mongoose from "mongoose";
import createNotification from "@/lib/socket/createNotification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function PATCH(req: Request) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { escrowId, note } = await req.json();



    if (!escrowId || !mongoose.Types.ObjectId.isValid(escrowId)) {
      return NextResponse.json(
        { error: "Valid escrowId is required." },
        { status: 400 }
      );
    }

    if (!note || typeof note !== "string" || note.trim().length === 0) {
      return NextResponse.json(
        { error: "Note is required and must be a non-empty string." },
        { status: 400 }
      );
    }

    //  Push note into escrow
    const escrow = await Escrow.findByIdAndUpdate(
      escrowId,
      { $push: { notes: note.trim() } },
      { new: true }
    );


    if (!escrow) {
      return NextResponse.json(
        { error: "Escrow not found." },
        { status: 404 }
      );
    }

    let notificationRecipientId = escrow.sellerId === session.user.id ? escrow.buyerId : escrow.sellerId;


    createNotification({
      userId: notificationRecipientId,
      senderId: session.user.id,
      type: "ESCROW_UPDATED",
      entityType: "ESCROW",
      entityId: escrow._id,
      title: "New Note Added",
      message: `A new note has been added to your escrow transaction.`,
      link: `/profile/${notificationRecipientId}/escrow`,
    });

    return NextResponse.json(
      { message: "Note added successfully", escrow },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding note:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
