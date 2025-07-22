import {
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Shield,
  Award,
  SearchSlash,
} from "lucide-react";
import { VerificationStatusProps } from "../../../../../types";
import { useEffect, useState } from "react";
import getVerificationStatus from "@/lib/business/getVerificationStatus";
import { useRouter } from "next/navigation";

export default function VerificationBadge({
  verified,
  userId,
}: {
  verified: boolean | undefined;
  userId: string;
}) {
  const [verification, setVerification] = useState<
    VerificationStatusProps | string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchVerificationStatus();
  }, [userId]);

  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getVerificationStatus(userId);
      setVerification(status);
    } catch (error) {
      console.error("Failed to fetch verification status:", error);
      setVerification(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm">
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <span className="text-sm font-medium text-gray-700">
          Verifying credentials...
        </span>
      </div>
    );
  }

  // Determine status
  const isVerified =
    verified &&
    typeof verification === "object" &&
    verification?.status === "approved";

  const isPending =
    !verified &&
    typeof verification === "object" &&
    verification?.status === "pending";

  const isRejected =
    !verified &&
    typeof verification === "object" &&
    verification?.status === "rejected";

  const handleUpdateVerification = () => {
    if (isPending) return;
    router.push(`${userId}/verify`);
  };

  const getStatusConfig = () => {
    if (isVerified) {
      return {
        containerClass:
          "bg-white border-2 border-blue-700 shadow-lg ring-4 ring-blue-100",
        textColor: "text-blue-900",
        iconColor: "text-blue-700",
        icon: Shield,
        text: "OFFICIALLY VERIFIED",
        subtitle: "Authenticated Account",
        clickable: true,
        hoverEffect:
          "hover:shadow-xl hover:ring-blue-200 cursor-pointer transition-all duration-200",
        isOfficial: true,
      };
    }

    if (isPending) {
      return {
        containerClass: "bg-amber-50 border-2 border-amber-400 shadow-md",
        textColor: "text-amber-900",
        iconColor: "text-amber-700",
        icon: Clock,
        text: "VERIFICATION PENDING",
        subtitle: "Under Official Review",
        clickable: false,
        hoverEffect: "cursor-not-allowed",
        isOfficial: false,
      };
    }

    if (isRejected) {
      return {
        containerClass: "bg-red-50 border-2 border-red-400 shadow-md",
        textColor: "text-red-900",
        iconColor: "text-red-700",
        icon: XCircle,
        text: "VERIFICATION DENIED",
        subtitle: "Requires Re-submission",
        clickable: true,
        hoverEffect:
          "hover:bg-red-100 cursor-pointer transition-colors duration-200",
        isOfficial: false,
      };
    }

    return {
      containerClass: "bg-gray-50 border-2 border-gray-300 shadow-sm",
      textColor: "text-gray-800",
      iconColor: "text-gray-600",
      icon: AlertCircle,
      text: "UNVERIFIED ACCOUNT",
      subtitle: "Identity Not Confirmed",
      clickable: true,
      hoverEffect:
        "hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all duration-200",
      isOfficial: false,
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="space-y-4">
      {/* Official Verification Badge */}
      <div
        className={`relative flex items-center space-x-4 px-6 py-4 rounded-lg transition-all duration-200 ${config.containerClass} ${config.hoverEffect}`}
        onClick={config.clickable ? handleUpdateVerification : undefined}
        role={config.clickable ? "button" : undefined}
        tabIndex={config.clickable ? 0 : -1}
        onKeyDown={(e) => {
          if (config.clickable && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleUpdateVerification();
          }
        }}
      >
        {/* Official Seal for Verified */}
        {isVerified && (
          <div className="absolute top-2 right-2">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
        )}

        {/* Main Icon */}
        <div
          className={`flex-shrink-0 p-2 rounded-full ${
            isVerified ? "bg-blue-100" : "bg-gray-100"
          }`}
        >
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3
            className={`text-sm font-bold tracking-wide ${config.textColor} uppercase`}
          >
            {config.text}
          </h3>
          <p
            className={`text-xs font-medium ${config.textColor} opacity-80 mt-1`}
          >
            {config.subtitle}
          </p>
        </div>

        {/* Action Indicator */}
        {config.clickable && !isPending && (
          <div className="text-xs font-medium opacity-60">
            <span className={config.textColor}>
              {isVerified ? "Manage" : isRejected ? "Reapply" : "Apply"}
            </span>
          </div>
        )}
      </div>

      {/* Official Status Details */}
      {isRejected &&
        typeof verification === "object" &&
        verification?.reason && (
          <div className="bg-white border border-red-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 mb-2">
                  OFFICIAL DENIAL NOTICE
                </h4>
                <p className="text-sm text-red-800 mb-2">
                  <span className="font-medium">Reason:</span>{" "}
                  {verification.reason}
                </p>
                <p className="text-xs text-red-600">
                  Decision Date:{" "}
                  {new Date(
                    verification.verifiedAt || verification.submittedAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

      {isPending && typeof verification === "object" && (
        <div className="bg-white border border-amber-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">
                VERIFICATION IN PROGRESS
              </h4>
              <p className="text-sm text-amber-800 mb-2">
                Your application is currently under official review by our
                verification team.
              </p>
              <p className="text-xs text-amber-600">
                Submitted:{" "}
                {new Date(verification.submittedAt).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
              <p className="text-xs text-amber-600">
                Expected completion: 24-48 business hours
              </p>
            </div>
          </div>
        </div>
      )}

      {isVerified &&
        typeof verification === "object" &&
        verification.verifiedAt && (
          <div className="bg-white border border-blue-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  OFFICIAL VERIFICATION CERTIFICATE
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  This account has been officially verified and authenticated by
                  our security team.
                </p>
                <p className="text-xs text-blue-600">
                  Verification Date:{" "}
                  {new Date(verification.verifiedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
                <p className="text-xs text-blue-600">
                  Certificate ID: VER-{userId.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
