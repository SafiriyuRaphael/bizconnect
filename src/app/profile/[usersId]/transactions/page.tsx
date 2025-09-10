"use client";
import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  User,
  Wallet,
  Hash,
  Clock,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useTransactions from "./hooks";
import formatDate from "@/lib/static/formatDate";
import getTransactionTypeColor from "../analytics/utils/getTransactionColor";
import formatAmount from "./utils/formatAmount";
import getTransactionTypeIcon from "./utils/getTransactionTypeIcon";
import Loader from "@/shared/components/ui/Loader";
import { useEditProfileStore } from "@/shared/store/useEditProfileStore";

export default function AllTransactionsPage() {
  const router = useRouter();
  const {
    allTransactions,
    error,
    isFetchingTransactions,
    refetch,
    transactionsQuery,
    handleExport,
    handleInputChange,
    handlePageChange,
  } = useTransactions();
  const { editMode } = useEditProfileStore();

  const totalPages = Math.ceil(
    allTransactions?.total || 0 / transactionsQuery?.limit
  );

  if (editMode) return null;

  return (
    <div
      className={`${isFetchingTransactions ? "" : "min-h-screen"} bg-gray-50`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="hover:text-gray-500" onClick={() => router.back()}>
              <ArrowLeft />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Transactions History
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all wallet transactions across your platform
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetchingTransactions}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isFetchingTransactions ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name, email, reference, or ID..."
                value={transactionsQuery.search}
                onChange={handleInputChange}
                name="search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <select
              value={transactionsQuery.type}
              onChange={handleInputChange}
              name="type"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="escrow_lock">Escrow Lock</option>
              <option value="escrow_release">Escrow Release</option>
              <option value="refund">Refund</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={transactionsQuery.dateRange}
              onChange={handleInputChange}
              name="dateRange"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Page Size */}
            <select
              value={transactionsQuery.limit}
              onChange={handleInputChange}
              name="limit"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {allTransactions?.count} of {allTransactions?.total}{" "}
              transactions
            </p>
            <div className="text-sm text-gray-500">
              Total Value: ₦{allTransactions?.totalValue}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        {isFetchingTransactions ? (
          <div className="flex items-center justify-center h-[40vh]">
            <Loader text="Getting all transactions" size="lg" variant="bars" />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">
                      User
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">
                      Type
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-600">
                      Amount
                    </th>
                    <th className="text-right py-4 px-6 font-medium text-gray-600">
                      Balance After
                    </th>
                    <th className="text-left py-4 px-6 font-medium text-gray-600">
                      Reference
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allTransactions?.transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.user?.businessName ||
                              transaction.user?.fullName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction?.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getTransactionTypeIcon(transaction.type)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getTransactionTypeColor(
                              transaction.type
                            )}`}
                          >
                            {transaction.type.replace("_", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        {formatAmount(transaction.amount, transaction.type)}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-gray-900">
                        ₦{transaction?.balanceAfter?.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {transaction.reference}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {allTransactions?.transactions.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {transactionsQuery.page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={transactionsQuery.page === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    handlePageChange((prev) => Math.max(1, prev - 1))
                  }
                  disabled={transactionsQuery.page === 1}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700">
                  {transactionsQuery.page}
                </span>
                <button
                  onClick={() =>
                    handlePageChange((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={transactionsQuery.page === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={transactionsQuery.page === totalPages}
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
