import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";

export async function GET() {
  try {
    await connectToDatabase();

    const lastBusinessUser = await Business.find()
      .sort({ createdAt: -1 })
      .limit(1);

    if (!lastBusinessUser || lastBusinessUser.length === 0) {
      return NextResponse.json({ message: "No business user found" }, { status: 404 });
    }

    return NextResponse.json(lastBusinessUser[0]);
  } catch (error) {
    console.error("💥 Error fetching last business user:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
