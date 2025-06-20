// lib/failed-attempts.ts
import { MongoClient } from 'mongodb';

interface FailedAttempt {
  ip: string;
  count: number;
  lastAttempt: Date;
}

export async function trackFailedAttempt(ip: string): Promise<void> {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  try {
    const db = client.db("auth");
    await db.collection<FailedAttempt>("failedAttempts").updateOne(
      { ip },
      { $inc: { count: 1 }, $set: { lastAttempt: new Date() } },
      { upsert: true }
    );
  } finally {
    await client.close();
  }
}

export async function getFailedAttempts(ip: string): Promise<number> {
  const client = await MongoClient.connect(process.env.MONGODB_URI!);
  try {
    const db = client.db("auth");
    const doc = await db.collection<FailedAttempt>("failedAttempts").findOne({ ip });
    return doc?.count || 0;
  } finally {
    await client.close();
  }
}

// // Usage in authorize():
// const attempts = await getFailedAttempts(ip);
// if (attempts > 5) {
//   throw new Error("Account locked. Try again in 15 minutes.");
// }