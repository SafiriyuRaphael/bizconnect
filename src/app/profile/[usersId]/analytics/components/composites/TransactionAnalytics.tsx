import React from "react";
import getTransactionTypeColor from "../../utils/getTransactionColor";
import getTimeAgo from "../../utils/getTimeAgo";

import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import getTransactionTypePieColor from "../../utils/getTransactionPieColor";

export default function TransactionAnalytics({
  allTransactions,
  handleAllTransactionView,
}: ComponentProps & { handleAllTransactionView: () => void }) {
  return (
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
                data={allTransactions?.trends.transactionTypes}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="total"
                label={(props) => `${props.type} ${props.percentage || 0}%`}
              >
                {allTransactions?.trends.transactionTypes.map(
                  (entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getTransactionTypePieColor(entry.type)}
                    />
                  )
                )}
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
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={handleAllTransactionView}
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {allTransactions?.recentTransactions.map((transaction) => (
            <div
              key={transaction?._id}
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
                  <p className="text-sm text-gray-500">
                    {getTimeAgo(transaction?.createdAt)}
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
  );
}
