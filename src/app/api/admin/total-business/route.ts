import { connectToDatabase } from "@/lib/mongo/initDB";
import { Business } from "@/model/Business";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  const now = new Date();
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7); 


  const total = await Business.countDocuments();


  const recent = await Business.countDocuments({
    createdAt: { $gte: lastWeek },
  });


  const previous = await Business.countDocuments({
    createdAt: { $lt: lastWeek },
  });

  // Calculate the % change
  let change = 0;
  if (previous > 0) {
    change = ((recent - previous) / previous) * 100;
  } else if (recent > 0) {
    change = 100;
  }

  const formattedChange =
    change === 0
      ? "0%"
      : change > 0
      ? `+${change.toFixed(1)}%`
      : `${change.toFixed(1)}%`;

  return NextResponse.json({ count: total, change: formattedChange });
}
