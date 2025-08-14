// components/ui/Loader.tsx
import React from "react";

interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "dots" | "pulse" | "bars";
  color?: "blue" | "purple" | "green" | "red" | "gray";
}

export default function Loader({
  fullScreen = false,
  text = "Loading...",
  size = "md",
  variant = "default",
  color = "blue",
}: LoaderProps) {
  // Size configurations for different variants
  const sizeConfig = {
    sm: {
      spinner: "h-4 w-4 border-2",
      dots: "h-1.5 w-1.5",
      pulse: "h-4 w-4",
      bars: "h-6 w-1",
      text: "text-xs",
    },
    md: {
      spinner: "h-8 w-8 border-3",
      dots: "h-2 w-2",
      pulse: "h-8 w-8",
      bars: "h-8 w-1.5",
      text: "text-sm",
    },
    lg: {
      spinner: "h-12 w-12 border-4",
      dots: "h-3 w-3",
      pulse: "h-12 w-12",
      bars: "h-10 w-2",
      text: "text-base",
    },
  };

  // Color configurations
  const colorConfig = {
    blue: {
      spinner: "border-blue-500 border-t-blue-200",
      dots: "bg-blue-500",
      pulse: "bg-blue-500",
      bars: "bg-blue-500",
      text: "text-blue-600",
    },
    purple: {
      spinner: "border-purple-500 border-t-purple-200",
      dots: "bg-purple-500",
      pulse: "bg-purple-500",
      bars: "bg-purple-500",
      text: "text-purple-600",
    },
    green: {
      spinner: "border-green-500 border-t-green-200",
      dots: "bg-green-500",
      pulse: "bg-green-500",
      bars: "bg-green-500",
      text: "text-green-600",
    },
    red: {
      spinner: "border-red-500 border-t-red-200",
      dots: "bg-red-500",
      pulse: "bg-red-500",
      bars: "bg-red-500",
      text: "text-red-600",
    },
    gray: {
      spinner: "border-gray-400 border-t-gray-200",
      dots: "bg-gray-500",
      pulse: "bg-gray-500",
      bars: "bg-gray-500",
      text: "text-gray-600",
    },
  };

  // Render different loader variants
  const renderLoader = () => {
    const config = sizeConfig[size];
    const colors = colorConfig[color];

    switch (variant) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${config.dots} ${colors.dots} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <div
            className={`${config.pulse} ${colors.pulse} rounded-full animate-pulse opacity-75`}
          />
        );

      case "bars":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${config.bars} ${colors.bars} animate-pulse`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );

      case "default":
      default:
        return (
          <div
            className={`${config.spinner} ${colors.spinner} rounded-full animate-spin border-solid`}
          />
        );
    }
  };

  // Container classes
  const containerClass = fullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
    : "flex items-center justify-center py-4";

  const textClass = `${sizeConfig[size].text} ${colorConfig[color].text} mt-3 font-medium`;

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center">
        {renderLoader()}
        {text && <p className={textClass}>{text}</p>}
      </div>
    </div>
  );
}
