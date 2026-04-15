import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { UserCollection } from "@/model/UserCollection";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Please sign in to continue." }, { status: 401 });
  }

  try {
    const { refId, type } = await req.json();

    if (!refId || !type) {
      return NextResponse.json(
        { message: "refId and type are required", success: false },
        { status: 400 }
      );
    }

    const existing = await UserCollection.findOne({
      userId: session.user.id,
      refId,
      type,
    });

    if (existing) {
      await UserCollection.deleteOne({ _id: existing._id });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      const newEntry = await UserCollection.create({
        userId: session.user.id,
        refId,
        type,
      });
      return NextResponse.json({ success: true, action: "added", data: newEntry });
    }
  } catch (err: any) {
    console.error('[FAVORITES_UPSERT_ERROR]', err);
    return NextResponse.json(
      { message: "Failed to toggle favorite, please try again ...", success: false },
      { status: 500 }
    );
  }
}