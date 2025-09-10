"use client";
import {
  Activity,
  DollarSign,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  Eye,
  RefreshCw,
} from "lucide-react";

import React, { useState } from "react";
import useAnalytics from "./hooks";
import Loader from "@/shared/components/ui/Loader";

import Header from "./components/layouts/Header";
import AnalyticsCard from "./components/composites/AnalyticsCard";
import ChartSection from "./components/composites/ChartSection";
import TransactionAnalytics from "./components/composites/TransactionAnalytics";
import PerfomanceSummary from "./components/composites/PerfomanceSummary";
import { useEditProfileStore } from "@/shared/store/useEditProfileStore";

// Interface for analytics cards

export default function AnalyticsDashboard() {
  const {
    allTransactions,
    isFetchingTransactions,
    analyticsQuery,
    setAnalyticsQuery,
    refetch,
    handleAllTransactionView
  } = useAnalytics();

  const { editMode } = useEditProfileStore();

  if (isFetchingTransactions) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader text="Getting transactions analysis" size="lg" variant="bars" />
      </div>
    );
  }

  if (!allTransactions) return null;

  // Analytics cards configuration
  const analyticsCards: AnalyticsCard[] = [
    {
      title: "Total Revenue",
      value: `₦${allTransactions?.summary.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
      growth: allTransactions?.summary.totalRevenueChange || 0,
      trend:
        allTransactions.summary.totalRevenueChange &&
        allTransactions?.summary.totalRevenueChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Total Orders",
      value: allTransactions?.summary.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      growth: allTransactions?.summary.totalOrdersChange || 0,
      trend:
        allTransactions?.summary.totalOrdersChange &&
        allTransactions?.summary.totalOrdersChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Average Rating",
      value: allTransactions?.summary.avgRating.toFixed(1),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      growth: allTransactions?.summary.avgRatingChange || 0,
      trend:
        allTransactions?.summary.avgRatingChange &&
        allTransactions?.summary.avgRatingChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Completion Rate",
      value: `${allTransactions?.summary.completionRate}%`,
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      growth: allTransactions?.summary.completionRateChange || 0,
      trend:
        allTransactions?.summary.completionRateChange &&
        allTransactions?.summary.completionRateChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Total Customers",
      value: allTransactions?.summary.totalCustomers.toLocaleString(),
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      growth: allTransactions?.summary.customersChange || 0,
      trend:
        allTransactions?.summary.customersChange &&
        allTransactions?.summary.customersChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Conversion Rate",
      value: `${allTransactions?.summary.conversionRate}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      growth: allTransactions?.summary.conversionChange || 0,
      trend:
        allTransactions?.summary.conversionChange &&
        allTransactions?.summary.conversionChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Avg Order Value",
      value: `₦${allTransactions?.summary.avgOrderValue.toLocaleString()}`,
      icon: Eye,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      growth: allTransactions?.summary.avgOrderValueChange || 0,
      trend:
        allTransactions?.summary.avgOrderValueChange &&
        allTransactions?.summary.avgOrderValueChange > 0
          ? "up"
          : "down",
    },
    {
      title: "Return Rate",
      value: `${allTransactions?.summary.returnRate}%`,
      icon: RefreshCw,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      growth: allTransactions?.summary.returnRateChange || 0,
      trend:
        allTransactions?.summary.returnRateChange &&
        allTransactions?.summary.returnRateChange > 0
          ? "up"
          : "down",
    },
  ];

  if (editMode) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <Header
          analyticsQuery={analyticsQuery}
          isFetchingTransactions={isFetchingTransactions}
          refetch={refetch}
          setAnalyticsQuery={setAnalyticsQuery}
        />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {analyticsCards.map((card, index) => {
            return <AnalyticsCard card={card} key={index} />;
          })}
        </div>
        <ChartSection allTransactions={allTransactions} />

        <TransactionAnalytics allTransactions={allTransactions} handleAllTransactionView={handleAllTransactionView} />

        <PerfomanceSummary allTransactions={allTransactions} />
      </div>
    </div>
  );
}
