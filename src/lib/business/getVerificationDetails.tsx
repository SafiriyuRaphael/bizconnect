import { CheckCircle, Clock, XCircle } from "lucide-react";
import {
  AllBusinessProps,
  BusinessVerificationType,
  VerificationLogType,
} from "../../../types";

export default function getVerificationDetails(business: {
  verifiedBusiness?: boolean;
  verificationData?: BusinessVerificationType | VerificationLogType;
}) {
  if (
    business.verifiedBusiness &&
    business.verificationData &&
    business.verificationData.status === "approved"
  ) {
    return {
      text: "Verified Business",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      icon: <CheckCircle className="w-4 h-4 text-green-500" />,
    };
  } else if (
    !business.verifiedBusiness &&
    business.verificationData &&
    business.verificationData.status === "pending"
  ) {
    return {
      text: "Pending Verification",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      icon: <Clock className="w-4 h-4 text-yellow-500" />,
    };
  } else if (
    !business.verifiedBusiness &&
    business.verificationData &&
    business.verificationData.status === "rejected"
  ) {
    return {
      text: "Rejected Verification",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      icon: <XCircle className="w-4 h-4 text-red-500" />,
    };
  } else
    return {
      text: "No Verification",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      icon: <Clock className="w-4 h-4 text-gray-500" />,
    };
}
