import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo/initDB";
import { WalletTransaction } from "@/model/WalletTransaction";
import User from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import mongoose from "mongoose";

type TransactionType =
    | "deposit"
    | "withdrawal"
    | "escrow_lock"
    | "escrow_release"
    | "refund"
    | "all";

type DateRange = "all" | "today" | "week" | "month";

interface TransactionFilter {
    userId: string; // always filter by logged-in user
    type?: Exclude<TransactionType, "all">;
    createdAt?: { $gte: Date; $lt?: Date } | { $gte: Date };
}

export async function GET(req: NextRequest) {
    await connectToDatabase();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(req.url);

    const type = (searchParams.get("type") || "all") as TransactionType;
    const dateRange = (searchParams.get("dateRange") || "all") as DateRange;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const filter: TransactionFilter = { userId: session.user.id };

    if (type !== "all") {
        filter.type = type;
    }

    const now = new Date();
    if (dateRange === "today") {
        filter.createdAt = {
            $gte: new Date(now.setHours(0, 0, 0, 0)),
            $lt: new Date(now.setHours(23, 59, 59, 999)),
        };
    } else if (dateRange === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filter.createdAt = { $gte: weekAgo };
    } else if (dateRange === "month") {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        filter.createdAt = { $gte: monthAgo };
    }


    let query = WalletTransaction.find(filter)
        .populate({
            path: "userId",
            model: User,
            select: "fullName email username __t businessName",
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    let transactions = await query.exec();

    if (search) {
        const lowerSearch = search.toLowerCase();
        transactions = transactions.filter((tx: any) => {
            const user = tx.userId || {};
            return (
                tx.reference?.toLowerCase().includes(lowerSearch) ||
                user.email?.toLowerCase().includes(lowerSearch) ||
                user.fullName?.toLowerCase().includes(lowerSearch) ||
                user.username?.toLowerCase().includes(lowerSearch) ||
                (user.__t === "Business" &&
                    user.businessName?.toLowerCase().includes(lowerSearch))
            );
        });
    }

    // Count + Sum
    const total = await WalletTransaction.countDocuments(filter);
    const totalValueAgg = await WalletTransaction.aggregate([
        { $match: { ...filter, userId: new mongoose.Types.ObjectId(session.user.id) } },
        { $group: { _id: null, totalValue: { $sum: "$amount" } } },
    ]);

    const totalValue = totalValueAgg.length > 0 ? totalValueAgg[0].totalValue : 0;

    return NextResponse.json({
        success: true,
        page,
        limit,
        total,
        totalValue,
        count: transactions.length,
        transactions: transactions.map((tx: any) => ({
            id: tx._id,
            type: tx.type,
            amount: tx.amount,
            balanceAfter: tx.balanceAfter,
            reference: tx.reference,
            createdAt: tx.createdAt,
            user: tx.userId
                ? {
                    id: tx.userId._id,
                    email: tx.userId.email,
                    fullName: tx.userId.fullName,
                    username: tx.userId.username,
                    businessName:
                        tx.userId.__t === "Business" ? tx.userId.businessName : null,
                }
                : null,
        })),
    });
}
