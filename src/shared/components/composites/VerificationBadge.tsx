import React from "react";
import { Award, Shield, CheckCircle, Star, Crown } from "lucide-react";
import { GoVerified } from "react-icons/go";

type BadgeVariant = "default" | "premium" | "elite" | "compact" | "minimal" | "classic";
type BadgeSize = "sm" | "md" | "lg";

type VerificationBadgeProps = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  showText?: boolean;
  customText?: string;
  className?: string;
};

export default function VerificationBadge({
  variant = "default",
  size = "md",
  showText = true,
  customText,
  className = "",
}: VerificationBadgeProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      text: "text-xs",
      padding: "px-2 py-1",
      icon: "w-3 h-3",
      gap: "mr-1",
    },
    md: {
      text: "text-sm",
      padding: "px-3 py-1.5",
      icon: "w-4 h-4",
      gap: "mr-1.5",
    },
    lg: {
      text: "text-base",
      padding: "px-4 py-2",
      icon: "w-5 h-5",
      gap: "mr-2",
    },
  };

  // Variant configurations
  const variantConfig = {
    default: {
      container: "bg-green-100 text-green-800 border border-green-200",
      icon: CheckCircle,
      text: customText || "Verified Business",
      gradient: false,
    },
    premium: {
      container:
        "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200 shadow-sm",
      icon: Award,
      text: customText || "Premium Verified",
      gradient: true,
    },
    elite: {
      container:
        "bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 text-purple-800 border border-purple-200 shadow-md",
      icon: Crown,
      text: customText || "Elite Partner",
      gradient: true,
    },
    compact: {
      container: "bg-green-500 text-white border border-green-600",
      icon: Shield,
      text: customText || "Verified",
      gradient: false,
    },
    minimal: {
      container: "bg-gray-100 text-gray-700 border border-gray-200",
      icon: CheckCircle,
      text: customText || "Verified",
      gradient: false,
    },
    classic: {
      container: "bg-green-100 text-green-800 border border-green-200",
      icon: GoVerified,
      text: customText || "Verified Business",
      gradient: false,
    },
  };

  const config = variantConfig[variant];
  const sizes = sizeConfig[size];
  const IconComponent = config.icon;

  const badgeClasses = `
    ${config.container}
    ${sizes.text}
    ${sizes.padding}
    rounded-full
    flex
    items-center
    justify-center
    font-medium
    transition-all
    duration-300
    hover:scale-105
    hover:shadow-lg
    ${className}
  `
    .trim()
    .replace(/\s+/g, " ");

  const iconClasses = `
    ${sizes.icon}
    ${showText ? sizes.gap : ""}`;

  return (
    <span className={badgeClasses}>
      <IconComponent className={iconClasses} />
      {showText && (
        <span className="font-semibold tracking-wide">{config.text}</span>
      )}
      {variant === "premium" && (
        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-75" />
      )}
      {variant === "elite" && (
        <div className="absolute -top-0.5 -right-0.5">
          <Star className="w-3 h-3 text-yellow-500 fill-current animate-pulse" />
        </div>
      )}
    </span>
  );
}

