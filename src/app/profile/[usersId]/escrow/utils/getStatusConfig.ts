import { AlertCircle, CheckCircle, Clock, DollarSign, Package, XCircle } from "lucide-react";
import { EscrowStatus } from "../types/escrow";

export default function getStatusConfig(status: EscrowStatus, isDisputed = false) {
    const configs = {
        pending: {
            icon: Clock,
            color: "text-amber-600 bg-amber-50 border-amber-200",
            dot: "bg-amber-400",
        },
        funded: {
            icon: DollarSign,
            color: "text-blue-600 bg-blue-50 border-blue-200",
            dot: "bg-blue-400",
        },
        delivered: {
            icon: Package,
            color: isDisputed
                ? "text-red-600 bg-red-50 border-red-200"
                : "text-purple-600 bg-purple-50 border-purple-200",
            dot: isDisputed ? "bg-red-400" : "bg-purple-400",
        },
        disputed: {
            icon: AlertCircle,
            color: "text-red-600 bg-red-50 border-red-200",
            dot: "bg-red-400",
        },
        released: {
            icon: CheckCircle,
            color: "text-green-600 bg-green-50 border-green-200",
            dot: "bg-green-400",
        },
        refunded: {
            icon: XCircle,
            color: "text-orange-600 bg-orange-50 border-orange-200",
            dot: "bg-orange-400",
        },
    };
    return configs[status] || configs.pending;
};