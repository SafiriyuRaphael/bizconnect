import { ArrowDownRight, ArrowUpRight, DollarSign, RefreshCw, Wallet } from "lucide-react";

export default function getTransactionTypeIcon(
  type: "deposit" | "withdrawal" | "escrow_lock" | "escrow_release" | "refund"
) {
  switch (type) {
    case "deposit":
      return <ArrowDownRight className="w-4 h-4 text-green-600" />;
    case "withdrawal":
      return <ArrowUpRight className="w-4 h-4 text-red-600" />;
    case "escrow_lock":
      return <Wallet className="w-4 h-4 text-yellow-600" />;
    case "escrow_release":
      return <Wallet className="w-4 h-4 text-blue-600" />;
    case "refund":
      return <RefreshCw className="w-4 h-4 text-purple-600" />;
    default:
      return <DollarSign className="w-4 h-4 text-gray-600" />;
  }
}
