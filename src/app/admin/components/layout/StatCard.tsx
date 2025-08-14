import React from "react";

type Props = {
  title: string;
  data: number;
  icon: React.ReactNode;
};
export default function StatCard({ title, data, icon }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {data}
          </p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}
