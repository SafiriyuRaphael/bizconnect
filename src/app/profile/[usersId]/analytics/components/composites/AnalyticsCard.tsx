import { ArrowDownRight, ArrowUpRight, LucideProps } from "lucide-react";
import React from "react";

type Props = {
  card: AnalyticsCard;
};

export default function AnalyticsCard({ card }: Props) {
  const IconComponent = card.icon;
  const TrendIcon = card.trend === "up" ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
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
        <p className="text-2xl font-bold text-gray-900">{card.value}</p>
      </div>
    </div>
  );
}
