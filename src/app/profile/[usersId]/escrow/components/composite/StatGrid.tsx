import React from "react";
import { StatProps } from "../../types/escrow";
export default function StatGrid({
  icon,
  title,
  value,
  iconBgColor,
  valueColor,
}: StatProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p
            className={`text-2xl font-semibold mt-1 ${
              valueColor ? valueColor : "text-gray-900"
            }`}
          >
            {value}
          </p>
        </div>
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            iconBgColor ? iconBgColor : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
