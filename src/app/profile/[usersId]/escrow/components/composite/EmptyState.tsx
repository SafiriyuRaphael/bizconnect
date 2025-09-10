import { Package } from "lucide-react";
import React from "react";

export default function EmptyState() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No escrows found
      </h3>
      <p className="text-gray-500">
        Try adjusting your search filters or check back later.
      </p>
    </div>
  );
}
