// app/api/analytics/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongo/initDB";
import mongoose from "mongoose";
import { Escrow } from "@/model/Escrow";
import { WalletTransaction } from "@/model/WalletTransaction";
import { Business } from "@/model/Business";
import User from "@/model/User";
import { AllBusinessProps, IWallet } from "../../../../../types";
import { Wallet } from "@/model/Wallet";

type Period = "weekly" | "monthly" | "yearly";
type PeriodRange = { start: Date; end: Date; label: string };

interface AnalyticsSummary {
    totalRevenue: number;
    totalRevenueChange: number | null;
    totalOrders: number;
    totalOrdersChange: number | null;
    avgRating: number;
    avgRatingChange: number | null;
    completionRate: number;
    completionRateChange: number | null;
    totalCustomers: number;
    customersThisPeriod: number;
    customersChange: number | null;
    conversionRate: number;
    conversionChange: number | null;
    avgOrderValue: number;
    avgOrderValueChange: number | null;
    returnRate: number;
    returnRateChange: number | null;
}

interface MonthlyPerformanceItem {
    label: string;
    revenue: number;
    orders: number;
    customers: number;
    avgRating: number;
    growth: number | null;
}

/**
 * Calculate percentage change between two values
 */
function calculatePercentageChange(current: number, previous: number): number | null {
    return previous === 0 ? null : Number((((current - previous) / previous) * 100).toFixed(2));
}

/**
 * Get the start of the current period
 */
function startOfCurrentPeriod(now: Date, period: Period): Date {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    switch (period) {
        case "weekly":
            // ISO week: Monday as start
            const day = (now.getDay() + 6) % 7;
            start.setDate(now.getDate() - day);
            return start;

        case "yearly":
            return new Date(now.getFullYear(), 0, 1);

        case "monthly":
        default:
            return new Date(now.getFullYear(), now.getMonth(), 1);
    }
}

/**
 * Get the start of the previous period
 */
function startOfPreviousPeriod(now: Date, period: Period): Date {
    const currentStart = startOfCurrentPeriod(now, period);

    switch (period) {
        case "weekly":
            const prev = new Date(currentStart);
            prev.setDate(prev.getDate() - 7);
            return prev;

        case "yearly":
            return new Date(currentStart.getFullYear() - 1, 0, 1);

        case "monthly":
        default:
            return new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, 1);
    }
}

/**
 * Get the end of the previous period
 */
function endOfPreviousPeriod(now: Date, period: Period): Date {
    const currentStart = startOfCurrentPeriod(now, period);
    return new Date(currentStart.getTime() - 1);
}

/**
 * Format period label based on period type
 */
function formatPeriodLabel(date: Date, period: Period): string {
    switch (period) {
        case "weekly":
            return `W ${date.toISOString().slice(0, 10)}`;
        case "yearly":
            return date.getFullYear().toString();
        case "monthly":
        default:
            return `${date.toLocaleString("en-US", { month: "short" })} ${date.getFullYear()}`;
    }
}

/**
 * Generate date ranges for trend analysis
 */
function generatePeriodBuckets(now: Date, period: Period, range: number): PeriodRange[] {
    const buckets: PeriodRange[] = [];

    for (let i = range - 1; i >= 0; i--) {
        let start: Date;
        let end: Date;

        switch (period) {
            case "weekly":
                const monday = startOfCurrentPeriod(now, "weekly");
                start = new Date(monday);
                start.setDate(monday.getDate() - i * 7);
                start.setHours(0, 0, 0, 0);
                end = new Date(start);
                end.setDate(start.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                break;

            case "yearly":
                const year = now.getFullYear() - i;
                start = new Date(year, 0, 1);
                end = new Date(year, 11, 31, 23, 59, 59, 999);
                break;

            case "monthly":
            default:
                const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
                start = new Date(targetMonth);
                start.setHours(0, 0, 0, 0);
                end = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0, 23, 59, 59, 999);
                break;
        }

        buckets.push({
            start,
            end,
            label: formatPeriodLabel(start, period)
        });
    }

    return buckets;
}

/**
 * Calculate revenue and order metrics for current and previous periods
 */
async function calculateRevenueMetrics(
    sellerObjId: mongoose.Types.ObjectId,
    currentStart: Date,
    now: Date,
    prevStart: Date,
    prevEnd: Date
) {
    // Current period revenue
    const [currentRevenue] = await Escrow.aggregate([
        {
            $match: {
                sellerId: sellerObjId,
                status: "released",
                releaseDate: { $gte: currentStart, $lte: now },
            },
        },
        {
            $group: {
                _id: null,
                revenue: { $sum: { $multiply: ["$price", { $ifNull: ["$quantity", 1] }] } },
                count: { $sum: 1 },
            },
        },
    ]);

    // Previous period revenue
    const [prevRevenue] = await Escrow.aggregate([
        {
            $match: {
                sellerId: sellerObjId,
                status: "released",
                releaseDate: { $gte: prevStart, $lte: prevEnd },
            },
        },
        {
            $group: {
                _id: null,
                revenue: { $sum: { $multiply: ["$price", { $ifNull: ["$quantity", 1] }] } },
            },
        },
    ]);

    const totalRevenue = currentRevenue?.revenue || 0;
    const previousRevenue = prevRevenue?.revenue || 0;
    const revenueChange = calculatePercentageChange(totalRevenue, previousRevenue);

    return { totalRevenue, revenueChange };
}

/**
 * Calculate order metrics for current and previous periods
 */
async function calculateOrderMetrics(
    sellerObjId: mongoose.Types.ObjectId,
    currentStart: Date,
    now: Date,
    prevStart: Date,
    prevEnd: Date
) {
    const [ordersCurrent, ordersPrev] = await Promise.all([
        Escrow.countDocuments({
            sellerId: sellerObjId,
            createdAt: { $gte: currentStart, $lte: now },
        }),
        Escrow.countDocuments({
            sellerId: sellerObjId,
            createdAt: { $gte: prevStart, $lte: prevEnd },
        }),
    ]);

    const ordersChange = calculatePercentageChange(ordersCurrent, ordersPrev);

    return { ordersCurrent, ordersPrev, ordersChange };
}

/**
 * Calculate rating metrics from business reviews
 */
function calculateRatingMetrics(
    business: AllBusinessProps | null,
    currentStart: Date,
    now: Date,
    prevStart: Date,
    prevEnd: Date
) {
    if (!business?.reviews?.length) {
        return { avgRating: 0, avgRatingChange: null };
    }

    // Current period ratings
    const currentRatings = business.reviews.filter((r: any) => {
        const reviewDate = new Date(r.createdAt);
        return reviewDate >= currentStart && reviewDate <= now;
    });

    // Previous period ratings
    const prevRatings = business.reviews.filter((r: any) => {
        const reviewDate = new Date(r.createdAt);
        return reviewDate >= prevStart && reviewDate <= prevEnd;
    });

    const avgRating = currentRatings.length
        ? currentRatings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / currentRatings.length
        : 0;

    const avgRatingPrev = prevRatings.length
        ? prevRatings.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / prevRatings.length
        : 0;

    const avgRatingChange = calculatePercentageChange(avgRating, avgRatingPrev);

    return { avgRating, avgRatingChange };
}

/**
 * Calculate completion rate metrics
 */
async function calculateCompletionMetrics(
    sellerObjId: mongoose.Types.ObjectId,
    currentStart: Date,
    now: Date,
    prevStart: Date,
    prevEnd: Date,
    ordersCurrent: number,
    ordersPrev: number
) {
    const [releasedCountCurrent, releasedCountPrev] = await Promise.all([
        Escrow.countDocuments({
            sellerId: sellerObjId,
            status: "released",
            releaseDate: { $gte: currentStart, $lte: now },
        }),
        Escrow.countDocuments({
            sellerId: sellerObjId,
            status: "released",
            releaseDate: { $gte: prevStart, $lte: prevEnd },
        }),
    ]);

    const completionRate = ordersCurrent > 0 ? (releasedCountCurrent / ordersCurrent) * 100 : 0;
    const completionRatePrev = ordersPrev > 0 ? (releasedCountPrev / ordersPrev) * 100 : 0;
    const completionRateChange = calculatePercentageChange(completionRate, completionRatePrev);

    return { completionRate, completionRateChange };
}

/**
 * Calculate customer metrics
 */
async function calculateCustomerMetrics(
    sellerObjId: mongoose.Types.ObjectId,
    currentStart: Date,
    now: Date,
    prevStart: Date,
    prevEnd: Date
) {
    const [uniqueBuyersAll, uniqueBuyersThisPeriod, uniqueBuyersPrevPeriod, totalRegisteredCustomers] = await Promise.all([
        Escrow.distinct("buyerId", { sellerId: sellerObjId }),
        Escrow.distinct("buyerId", {
            sellerId: sellerObjId,
            createdAt: { $gte: currentStart, $lte: now },
        }),
        Escrow.distinct("buyerId", {
            sellerId: sellerObjId,
            createdAt: { $gte: prevStart, $lte: prevEnd },
        }),
        User.countDocuments({ userType: "customer" }),
    ]);

    const totalCustomers = uniqueBuyersAll.length;
    const customersChange = calculatePercentageChange(uniqueBuyersThisPeriod.length, uniqueBuyersPrevPeriod.length);

    const conversionRate = totalRegisteredCustomers > 0 ? (totalCustomers / totalRegisteredCustomers) * 100 : 0;
    const conversionPrev = totalRegisteredCustomers > 0 ? (uniqueBuyersPrevPeriod.length / totalRegisteredCustomers) * 100 : 0;
    const conversionChange = calculatePercentageChange(conversionRate, conversionPrev);

    return {
        totalCustomers,
        customersThisPeriod: uniqueBuyersThisPeriod.length,
        customersChange,
        conversionRate,
        conversionChange,
    };
}

/**
 * Calculate return rate metrics
 */
async function calculateReturnMetrics(
    sellerObjId: mongoose.Types.ObjectId,
    currentStart: Date,
    now: Date,
    prevStart: Date,
    prevEnd: Date,
    ordersCurrent: number,
    ordersPrev: number
) {
    const [refundsCurrent, refundsPrev] = await Promise.all([
        Escrow.countDocuments({
            sellerId: sellerObjId,
            status: "refunded",
            updatedAt: { $gte: currentStart, $lte: now },
        }),
        Escrow.countDocuments({
            sellerId: sellerObjId,
            status: "refunded",
            updatedAt: { $gte: prevStart, $lte: prevEnd },
        }),
    ]);

    const returnRate = ordersCurrent > 0 ? (refundsCurrent / ordersCurrent) * 100 : 0;
    const returnRatePrev = ordersPrev > 0 ? (refundsPrev / ordersPrev) * 100 : 0;
    const returnRateChange = calculatePercentageChange(returnRate, returnRatePrev);

    return { returnRate, returnRateChange };
}

/**
 * Generate performance data for each period bucket
 */
async function generateMonthlyPerformance(
    sellerObjId: mongoose.Types.ObjectId,
    buckets: PeriodRange[],
    business: AllBusinessProps | null
): Promise<MonthlyPerformanceItem[]> {
    const performance: MonthlyPerformanceItem[] = [];

    for (const bucket of buckets) {
        // Single aggregation to get revenue, orders, and customer data
        const [aggregatedData] = await Escrow.aggregate([
            {
                $match: {
                    sellerId: sellerObjId,
                    $or: [
                        {
                            $and: [
                                { status: "released" },
                                { releaseDate: { $gte: bucket.start, $lte: bucket.end } }
                            ]
                        },
                        { createdAt: { $gte: bucket.start, $lte: bucket.end } }
                    ],
                },
            },
            {
                $group: {
                    _id: null,
                    revenue: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$status", "released"] },
                                        { $gte: ["$releaseDate", bucket.start] },
                                        { $lte: ["$releaseDate", bucket.end] }
                                    ]
                                },
                                { $multiply: ["$price", { $ifNull: ["$quantity", 1] }] },
                                0,
                            ],
                        },
                    },
                    orders: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$createdAt", bucket.start] },
                                        { $lte: ["$createdAt", bucket.end] }
                                    ]
                                },
                                1,
                                0
                            ]
                        }
                    },
                    uniqueBuyers: {
                        $addToSet: {
                            $cond: [
                                {
                                    $and: [
                                        { $gte: ["$createdAt", bucket.start] },
                                        { $lte: ["$createdAt", bucket.end] }
                                    ]
                                },
                                "$buyerId",
                                null
                            ]
                        }
                    },
                },
            },
            {
                $project: {
                    revenue: 1,
                    orders: 1,
                    customers: {
                        $size: {
                            $filter: {
                                input: "$uniqueBuyers",
                                as: "buyer",
                                cond: { $ne: ["$$buyer", null] }
                            }
                        }
                    },
                },
            },
        ]);

        // Calculate average rating for this bucket
        let avgRating = 0;
        if (business?.reviews?.length) {
            const relevantReviews = business.reviews.filter((r: any) => {
                const reviewDate = new Date(r.createdAt);
                return reviewDate >= bucket.start && reviewDate <= bucket.end;
            });

            if (relevantReviews.length > 0) {
                avgRating = relevantReviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / relevantReviews.length;
            }
        }

        performance.push({
            label: bucket.label,
            revenue: aggregatedData?.revenue || 0,
            orders: aggregatedData?.orders || 0,
            customers: aggregatedData?.customers || 0,
            avgRating: Number(avgRating.toFixed(2)),
            growth: 0, // Will be calculated below
        });
    }

    // Calculate growth percentages
    for (let i = 1; i < performance.length; i++) {
        const current = performance[i].revenue;
        const previous = performance[i - 1].revenue;
        performance[i].growth = calculatePercentageChange(current, previous);
    }

    return performance;
}

/**
 * Get transaction type analytics
 */
async function getTransactionTypeAnalytics(
    walletId: mongoose.Types.ObjectId | string,
    startDate: Date,
    endDate: Date
) {
    const txTypesAgg = await WalletTransaction.aggregate([
        {
            $match: {
                walletId,
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: "$type",
                count: { $sum: 1 },
                total: { $sum: "$amount" },
            },
        },
        {
            $sort: { count: -1 }, // Sort by count descending
        },
    ]);

    const totalTxCount = txTypesAgg.reduce((sum: number, tx: any) => sum + tx.count, 0);

    return txTypesAgg.map((tx: any) => ({
        type: tx._id,
        count: tx.count,
        total: Number(tx.total.toFixed(2)),
        percentage: totalTxCount > 0 ? Number(((tx.count / totalTxCount) * 100).toFixed(2)) : 0,
    }));
}

/**
 * Validate query parameters
 */
function validateQueryParams(url: URL) {
    const period = (url.searchParams.get("period") || "monthly").toLowerCase() as Period;
    const range = Number(url.searchParams.get("range") || "8");

    // Validate period
    if (!["weekly", "monthly", "yearly"].includes(period)) {
        throw new Error("Invalid period. Must be 'weekly', 'monthly', or 'yearly'");
    }

    // Validate range
    if (isNaN(range) || range < 1 || range > 24) {
        throw new Error("Invalid range. Must be a number between 1 and 24");
    }

    return { period, range };
}

export async function GET(req: Request) {
    try {
        // Authentication
        const session = await auth();
        const sessionUserId = session?.user?.id;

        if (!sessionUserId) {
            return NextResponse.json(
                { error: "Unauthorized", message: "Please log in to access analytics" },
                { status: 401 }
            );
        }

        // Validate query parameters
        const url = new URL(req.url);
        const { period, range } = validateQueryParams(url);

        // Database connection
        await connectToDatabase();

        const sellerObjId = new mongoose.Types.ObjectId(sessionUserId);

        // Get seller's wallet
        const sellerWallet = await Wallet.findOne({ userId: sellerObjId }).lean<IWallet>();
        if (!sellerWallet) {
            return NextResponse.json(
                { error: "Wallet not found", message: "No wallet found for the current user" },
                { status: 404 }
            );
        }

        // Date calculations
        const now = new Date();
        const currentStart = startOfCurrentPeriod(now, period);
        const prevStart = startOfPreviousPeriod(now, period);
        const prevEnd = endOfPreviousPeriod(now, period);

        // Get business data for reviews
        const business = await Business.findOne({ _id: sellerObjId }).lean<AllBusinessProps>();

        // Calculate independent metrics first
        const [
            { totalRevenue, revenueChange },
            { ordersCurrent, ordersPrev, ordersChange },
            { avgRating, avgRatingChange },
            customerMetrics,
        ] = await Promise.all([
            calculateRevenueMetrics(sellerObjId, currentStart, now, prevStart, prevEnd),
            calculateOrderMetrics(sellerObjId, currentStart, now, prevStart, prevEnd),
            Promise.resolve(calculateRatingMetrics(business, currentStart, now, prevStart, prevEnd)),
            calculateCustomerMetrics(sellerObjId, currentStart, now, prevStart, prevEnd),
        ]);

        // Calculate metrics that depend on order counts
        const [
            { completionRate, completionRateChange },
            { returnRate, returnRateChange },
        ] = await Promise.all([
            calculateCompletionMetrics(sellerObjId, currentStart, now, prevStart, prevEnd, ordersCurrent, ordersPrev),
            calculateReturnMetrics(sellerObjId, currentStart, now, prevStart, prevEnd, ordersCurrent, ordersPrev),
        ]);

        // Calculate average order value
        const avgOrderValue = ordersCurrent > 0 ? totalRevenue / ordersCurrent : 0;
        const prevRevenueData = await calculateRevenueMetrics(sellerObjId, prevStart, prevEnd, prevStart, prevEnd);
        const avgOrderValuePrev = ordersPrev > 0 ? prevRevenueData.totalRevenue / ordersPrev : 0;
        const avgOrderValueChange = calculatePercentageChange(avgOrderValue, avgOrderValuePrev);

        // Generate trend data
        const buckets = generatePeriodBuckets(now, period, range);
        const [monthlyPerformance, transactionTypes, recentTransactions] = await Promise.all([
            generateMonthlyPerformance(sellerObjId, buckets, business),
            getTransactionTypeAnalytics(sellerWallet._id, buckets[0].start, buckets[buckets.length - 1].end),
            WalletTransaction.find({ walletId: sellerWallet._id })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
        ]);

        // Prepare summary
        const summary: AnalyticsSummary = {
            totalRevenue: Number(totalRevenue.toFixed(2)),
            totalRevenueChange: revenueChange,
            totalOrders: ordersCurrent,
            totalOrdersChange: ordersChange,
            avgRating: Number(avgRating.toFixed(2)),
            avgRatingChange,
            completionRate: Number(completionRate.toFixed(2)),
            completionRateChange,
            totalCustomers: customerMetrics.totalCustomers,
            customersThisPeriod: customerMetrics.customersThisPeriod,
            customersChange: customerMetrics.customersChange,
            conversionRate: Number(customerMetrics.conversionRate.toFixed(2)),
            conversionChange: customerMetrics.conversionChange,
            avgOrderValue: Number(avgOrderValue.toFixed(2)),
            avgOrderValueChange,
            returnRate: Number(returnRate.toFixed(2)),
            returnRateChange,
        };

        // Prepare trends
        const trends = {
            revenueTrend: monthlyPerformance.map((item) => ({
                label: item.label,
                revenue: item.revenue,
                growth: item.growth,
            })),
            ordersVsCustomers: monthlyPerformance.map((item) => ({
                label: item.label,
                orders: item.orders,
                customers: item.customers,
            })),
            transactionTypes,
        };

        return NextResponse.json({
            success: true,
            data: {
                period,
                range,
                summary,
                trends,
                monthlyPerformance,
                recentTransactions: recentTransactions.map(tx => ({
                    ...tx,
                    amount: Number(tx.amount.toFixed(2)),
                })),
            },
            metadata: {
                generatedAt: now.toISOString(),
                sellerWalletId: sellerWallet._id,
                periodsAnalyzed: buckets.length,
            },
        });

    } catch (error: any) {
        console.error("Analytics API Error:", {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
        });

        // Return appropriate error response based on error type
        if (error.message.includes("Invalid")) {
            return NextResponse.json(
                {
                    error: "Bad Request",
                    message: error.message,
                    success: false
                },
                { status: 400 }
            );
        }

        if (error.name === "CastError" || error.name === "ValidationError") {
            return NextResponse.json(
                {
                    error: "Invalid Data",
                    message: "Invalid data format in request",
                    success: false
                },
                { status: 422 }
            );
        }

        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: "An unexpected error occurred while generating analytics",
                success: false
            },
            { status: 500 }
        );
    }
}