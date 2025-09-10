import formatPrice from "@/shared/utils/formatPrice";
import { Eye } from "lucide-react";
import React from "react";
import { useEscrowStore } from "../../store";
import { IEscrow, IStatusConfig } from "../../types/escrow";

export default function ListView({
  escrow,
  statusConfig,
}: {
  escrow: IEscrow;
  statusConfig: IStatusConfig;
}) {
  const { setSelectedEscrow, setShowDetailsModal } = useEscrowStore();
  return (
    <div
      key={escrow._id}
      className="bg-white rounded-lg border border-gray-200 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className={`w-3 h-3 rounded-full ${statusConfig.dot}`}></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {escrow.itemId.title}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {escrow.buyerId.businessName || escrow.buyerId.fullName} →{" "}
              {escrow.sellerId.businessName || escrow.sellerId.fullName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-right">
            <p className="font-semibold text-gray-900">
              {formatPrice(escrow.price)}
            </p>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${statusConfig.color}`}
            >
              {escrow.isDisputed ? "Disputed" : escrow.status}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedEscrow(escrow);
              setShowDetailsModal(true);
            }}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
