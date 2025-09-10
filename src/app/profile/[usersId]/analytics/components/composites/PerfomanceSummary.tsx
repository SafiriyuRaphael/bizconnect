import { ArrowDownRight, ArrowUpRight, Star } from "lucide-react";
import React from "react";

export default function PerfomanceSummary({ allTransactions }: ComponentProps) {
  return (
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
            {allTransactions?.monthlyPerformance.map((month, index) => {
              return (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {month.label}
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
                      <span className="font-medium">{month.avgRating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        month.growth && month.growth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {month.growth && month.growth >= 0 ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      {month.growth || 0}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
