// types/analytics.ts

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

interface RevenueTrendItem {
    label: string;   // e.g. "Jan 2025", "W 2025-08-31"
    revenue: number;
}

interface OrdersVsCustomersItem {
    label: string;
    orders: number;
    customers: number;
}

interface TransactionTypeItem {
    type: "deposit" | "withdrawal" | "escrow_lock" | "escrow_release" | "refund";
    count: number;
    total: number;
    percentage: number;
}

interface MonthlyPerformanceItem {
    label: string; // "Jan 2025" etc
    revenue: number;
    orders: number;
    customers: number;
    avgRating: number;
    growth: number | null;
}

interface RecentTransaction {
    _id: string;
    walletId: string;
    userId: string;
    type: "deposit" | "withdrawal" | "escrow_lock" | "escrow_release" | "refund";
    amount: number;
    balanceAfter?: number;
    reference?: string;
    metadata?: Record<string, any>;
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

interface AnalyticsData {
    period: "weekly" | "monthly" | "yearly";
    range: number;
    summary: AnalyticsSummary;
    trends: {
        revenueTrend: RevenueTrendItem[];
        ordersVsCustomers: OrdersVsCustomersItem[];
        transactionTypes: TransactionTypeItem[];
    };
    monthlyPerformance: MonthlyPerformanceItem[];
    recentTransactions: RecentTransaction[];
}
interface AnalyticsResponse {
    data: AnalyticsData;
    message: "success"
}


type AnalyticsPeriod = "weekly" | "monthly" | "yearly";

interface AnalyticsQueryParams {
    period?: AnalyticsPeriod;
    range?: number;
    sellerId?: string;
}

interface AnalyticsCard {
    title: string;
    value: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
    growth: number | null;
    trend: "up" | "down";
}


interface ComponentProps {
    allTransactions: AnalyticsData | undefined;
};