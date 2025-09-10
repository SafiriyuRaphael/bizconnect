import { AlertCircle, CheckCircle, Eye, XCircle } from "lucide-react";

export default function getDisputeStatusConfig(status: string) {
    switch (status) {
        case "open":
            return { color: "text-orange-600 bg-orange-100", icon: AlertCircle };
        case "in_review":
            return { color: "text-blue-600 bg-blue-100", icon: Eye };
        case "resolved":
            return { color: "text-green-600 bg-green-100", icon: CheckCircle };
        case "rejected":
            return { color: "text-red-600 bg-red-100", icon: XCircle };
        default:
            return { color: "text-gray-600 bg-gray-100", icon: AlertCircle };
    }
};