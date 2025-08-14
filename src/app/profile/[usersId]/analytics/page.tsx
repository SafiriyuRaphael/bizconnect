"use client";
import {
  Activity,
  DollarSign,
  ShoppingCart,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  PieLabel,
} from "recharts";
import React, { useState, ComponentType } from "react";

// Define TypeScript interfaces for mockAnalytics
interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
  rating: number;
}

interface TransactionType {
  name: string;
  value: number;
  color: string;
}

interface RecentTransaction {
  id: string;
  type: "deposit" | "withdrawal" | "escrow_lock" | "escrow_release" | "refund";
  amount: number;
  user: string;
  time: string;
}

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  avgRating: number;
  completionRate: number;
  totalCustomers: number;
  conversionRate: number;
  avgOrderValue: number;
  returnRate: number;
  monthlyData: MonthlyData[];
  transactionTypes: TransactionType[];
  recentTransactions: RecentTransaction[];
}

// Interface for analytics cards
interface AnalyticsCard {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  growth: string;
  trend: "up" | "down";
}

// Mock analytics data (unchanged)
const mockAnalytics: AnalyticsData = {
  totalRevenue: 2850000,
  totalOrders: 1247,
  avgRating: 4.8,
  completionRate: 97.5,
  totalCustomers: 8420,
  conversionRate: 12.4,
  avgOrderValue: 2285,
  returnRate: 2.1,
  monthlyData: [
    { month: "Jan", revenue: 245000, orders: 98, customers: 1200, rating: 4.6 },
    {
      month: "Feb",
      revenue: 320000,
      orders: 124,
      customers: 1450,
      rating: 4.7,
    },
    {
      month: "Mar",
      revenue: 385000,
      orders: 156,
      customers: 1680,
      rating: 4.8,
    },
    {
      month: "Apr",
      revenue: 290000,
      orders: 118,
      customers: 1320,
      rating: 4.7,
    },
    {
      month: "May",
      revenue: 450000,
      orders: 187,
      customers: 1890,
      rating: 4.9,
    },
    {
      month: "Jun",
      revenue: 520000,
      orders: 215,
      customers: 2100,
      rating: 4.8,
    },
    {
      month: "Jul",
      revenue: 480000,
      orders: 198,
      customers: 1980,
      rating: 4.8,
    },
    {
      month: "Aug",
      revenue: 155000,
      orders: 151,
      customers: 1800,
      rating: 4.8,
    },
  ],
  transactionTypes: [
    { name: "Deposits", value: 45, color: "#10B981" },
    { name: "Withdrawals", value: 25, color: "#EF4444" },
    { name: "Escrow Lock", value: 20, color: "#F59E0B" },
    { name: "Escrow Release", value: 8, color: "#8B5CF6" },
    { name: "Refunds", value: 2, color: "#6B7280" },
  ],
  recentTransactions: [
    {
      id: "1",
      type: "deposit",
      amount: 25000,
      user: "John Doe",
      time: "2 mins ago",
    },
    {
      id: "2",
      type: "withdrawal",
      amount: 15000,
      user: "Jane Smith",
      time: "5 mins ago",
    },
    {
      id: "3",
      type: "escrow_lock",
      amount: 50000,
      user: "Mike Johnson",
      time: "10 mins ago",
    },
    {
      id: "4",
      type: "escrow_release",
      amount: 35000,
      user: "Sarah Wilson",
      time: "15 mins ago",
    },
    {
      id: "5",
      type: "refund",
      amount: 8000,
      user: "David Brown",
      time: "20 mins ago",
    },
  ],
};

// Calculate growth percentages
const calculateGrowth = (
  current: number | undefined,
  previous: number | undefined
): string => {
  if (!current || !previous) return "0.0";
  return (((current - previous) / previous) * 100).toFixed(1);
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate growth percentages
  const currentMonth =
    mockAnalytics.monthlyData[mockAnalytics.monthlyData.length - 1];
  const previousMonth =
    mockAnalytics.monthlyData[mockAnalytics.monthlyData.length - 2];

  const revenueGrowth = calculateGrowth(
    currentMonth?.revenue,
    previousMonth?.revenue
  );
  const ordersGrowth = calculateGrowth(
    currentMonth?.orders,
    previousMonth?.orders
  );

  // Analytics cards configuration
  const analyticsCards: AnalyticsCard[] = [
    {
      title: "Total Revenue",
      value: `₦${mockAnalytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      growth: revenueGrowth,
      trend: parseFloat(revenueGrowth) > 0 ? "up" : "down",
    },
    {
      title: "Total Orders",
      value: mockAnalytics.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      growth: ordersGrowth,
      trend: parseFloat(ordersGrowth) > 0 ? "up" : "down",
    },
    {
      title: "Average Rating",
      value: mockAnalytics.avgRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      growth: "+2.1",
      trend: "up",
    },
    {
      title: "Completion Rate",
      value: `${mockAnalytics.completionRate}%`,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      growth: "+1.2",
      trend: "up",
    },
    {
      title: "Total Customers",
      value: mockAnalytics.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      growth: "+15.8",
      trend: "up",
    },
    {
      title: "Conversion Rate",
      value: `${mockAnalytics.conversionRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      growth: "+0.8",
      trend: "up",
    },
    {
      title: "Avg Order Value",
      value: `₦${mockAnalytics.avgOrderValue.toLocaleString()}`,
      icon: Eye,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      growth: "+5.2",
      trend: "up",
    },
    {
      title: "Return Rate",
      value: `${mockAnalytics.returnRate}%`,
      icon: RefreshCw,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      growth: "-0.3",
      trend: "down",
    },
  ];

  const getTransactionTypeColor = (type: RecentTransaction["type"]): string => {
    const colors: Record<RecentTransaction["type"], string> = {
      deposit: "text-green-600 bg-green-50",
      withdrawal: "text-red-600 bg-red-50",
      escrow_lock: "text-yellow-600 bg-yellow-50",
      escrow_release: "text-purple-600 bg-purple-50",
      refund: "text-gray-600 bg-gray-50",
    };
    return colors[type] || "text-gray-600 bg-gray-50";
  };

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Track your business performance and wallet transactions
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={timeRange}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setTimeRange(e.target.value as "weekly" | "monthly" | "yearly")
              }
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button
              onClick={refreshData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {analyticsCards.map((card, index) => {
            const IconComponent = card.icon;
            const TrendIcon =
              card.trend === "up" ? ArrowUpRight : ArrowDownRight;

            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      card.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendIcon className="w-4 h-4" />
                    {card.growth}%
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue Trend
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                Last 8 months
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickFormatter={(value: number) => `₦${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `₦${value.toLocaleString()}`,
                      "Revenue",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders vs Customers Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Orders vs Customers
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Customers</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar
                    dataKey="customers"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transaction Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transaction Types Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Transaction Types
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockAnalytics.transactionTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(props: {
                      name: string;
                      percent?: number;
                    }): string =>
                      `${props.name} ${
                        props.percent !== undefined
                          ? (props.percent * 100).toFixed(0)
                          : 0
                      }%`
                    }
                  >
                    {mockAnalytics.transactionTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Transactions
              </h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mockAnalytics.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTransactionTypeColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.type.replace("_", " ")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.user}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.time}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "withdrawal" ||
                      transaction.type === "refund"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "withdrawal" ||
                    transaction.type === "refund"
                      ? "-"
                      : "+"}
                    ₦{transaction.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Monthly Performance Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    Month
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Orders
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Customers
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Avg Rating
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockAnalytics.monthlyData.map((month, index) => {
                  const prevMonth = mockAnalytics.monthlyData[index - 1];
                  const growth = prevMonth
                    ? calculateGrowth(month.revenue, prevMonth.revenue)
                    : "0.0";

                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {month.month}
                      </td>
                      <td className="py-3 px-4 text-right text-green-600 font-semibold">
                        ₦{month.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-blue-600 font-semibold">
                        {month.orders}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-900">
                        {month.customers.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{month.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-medium ${
                            parseFloat(growth) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {parseFloat(growth) >= 0 ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          {growth}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
