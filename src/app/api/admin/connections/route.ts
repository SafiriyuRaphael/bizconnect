import { startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import Message from '@/model/Message';
import { connectToDatabase } from '@/lib/mongo/initDB';

export async function GET() {
  await connectToDatabase();

  const now = new Date();
  const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
  const endOfThisWeek = endOfWeek(now, { weekStartsOn: 1 });
  const startOfLastWeek = subWeeks(startOfThisWeek, 1);
  const endOfLastWeek = subWeeks(endOfThisWeek, 1);

  const countConnectionsInRange = async (start: Date, end: Date) => {
    const connections = await Message.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $project: {
          pair: {
            $cond: [
              { $lt: ["$sender", "$recipient"] },
              ["$sender", "$recipient"],
              ["$recipient", "$sender"],
            ],
          },
        },
      },
      {
        $group: {
          _id: "$pair",
        },
      },
      {
        $count: "count",
      },
    ]);

    return connections[0]?.count || 0;
  };

  // 🔢 All-time total connections
  const totalConnectionsAllTime = await Message.aggregate([
    {
      $project: {
        pair: {
          $cond: [
            { $lt: ["$sender", "$recipient"] },
            ["$sender", "$recipient"],
            ["$recipient", "$sender"],
          ],
        },
      },
    },
    {
      $group: {
        _id: "$pair",
      },
    },
    {
      $count: "count",
    },
  ]);

  const allTime = totalConnectionsAllTime[0]?.count || 0;

  const thisWeek = await countConnectionsInRange(startOfThisWeek, endOfThisWeek);
  const lastWeek = await countConnectionsInRange(startOfLastWeek, endOfLastWeek);


  const previousTotal = allTime - thisWeek;
  const percentageChange =
    previousTotal === 0 ? 100 : ((allTime - previousTotal) / previousTotal) * 100;

  return Response.json({
    totalConnections: allTime,
    thisWeekConnections: thisWeek,
    lastWeekConnections: lastWeek,
    percentageIncrease: Math.round(percentageChange),
  });
}
