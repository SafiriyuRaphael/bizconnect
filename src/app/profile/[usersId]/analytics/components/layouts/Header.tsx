import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";
import React from "react";

type Props = {
  setAnalyticsQuery: React.Dispatch<React.SetStateAction<AnalyticsQueryParams>>;
  analyticsQuery: AnalyticsQueryParams;
  isFetchingTransactions: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<AnalyticsData, Error>>;
};

export default function Header({
  analyticsQuery,
  isFetchingTransactions,
  refetch,
  setAnalyticsQuery,
}: Props) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your business performance and wallet transactions
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={analyticsQuery.period}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setAnalyticsQuery((prev) => ({
              ...prev,
              period: e.target.value as AnalyticsPeriod,
            }))
          }
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly" selected>
            Monthly
          </option>
          <option value="yearly">Yearly</option>
        </select>
        <button
          onClick={() => refetch()}
          disabled={isFetchingTransactions}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              isFetchingTransactions ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>
    </div>
  );
}
