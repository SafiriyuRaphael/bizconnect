import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { UserCollection } from "@/model/UserCollection";

export async function POST(req: NextRequest) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { refId, type } = await req.json();

    if (!refId || !type) {
      return NextResponse.json(
        { error: "refId and type are required" },
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
    return NextResponse.json(
      { error: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}