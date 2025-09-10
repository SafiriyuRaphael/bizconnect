import {
  AlertTriangle,
  Bell,
  CheckCircle,
  DollarSign,
  Package,
  Star,
} from "lucide-react";

export default function getNotificationIcon(type: string) {
  switch (type) {
    case "NEW_ESCROW":
    case "ESCROW_RELEASED":
      return <DollarSign size={18} className="text-green-500" />;
    case "ESCROW_UPDATED":
      return <Package size={18} className="text-blue-500" />;
    case "PAYMENT_HELD":
    case "PAYMENT_RELEASED":
      return <CheckCircle size={18} className="text-green-500" />;
    case "PAYMENT_FAILED":
    case "ESCROW_DISPUTED": 
      return <AlertTriangle size={18} className="text-red-500" />;
    case "REVIEW_RECEIVED":
      return <Star size={18} className="text-yellow-500" />;
    case "SYSTEM":
      return <Bell size={18} className="text-gray-500" />;
    default:
      return <Bell size={18} className="text-gray-500" />;
  }
}
