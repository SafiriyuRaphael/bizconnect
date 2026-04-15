// components/ui/Loader.tsx
import React from "react";

interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "puzzle" | "network" | "pulse" | "bars";
  color?: "blue" | "purple" | "green" | "red" | "gray";
}

export default function Loader({
  fullScreen = false,
  text = "Loading...",
  size = "md",
  variant = "puzzle",
  color = "blue",
}: LoaderProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      spinner: "h-6 w-6 border-2",
      text: "text-xs mt-3",
      bars: "h-4 w-1",
      dot: "w-1.5 h-1.5",
      centerDot: "w-2 h-2",
    },
    md: {
      container: "w-12 h-12",
      spinner: "h-8 w-8 border-2",
      text: "text-sm mt-4",
      bars: "h-6 w-1.5",
      dot: "w-2 h-2",
      centerDot: "w-3 h-3",
    },
    lg: {
      container: "w-16 h-16",
      spinner: "h-12 w-12 border-3",
      text: "text-base mt-5",
      bars: "h-8 w-2",
      dot: "w-2.5 h-2.5",
      centerDot: "w-4 h-4",
    },
  };

  // Clean color configurations
  const colorConfig = {
    blue: {
      primary: "bg-blue-500",
      secondary: "bg-blue-400",
      tertiary: "bg-blue-600",
      border: "border-blue-500",
      text: "text-blue-600",
      bg: "from-slate-50 to-blue-50",
    },
    purple: {
      primary: "bg-purple-500",
      secondary: "bg-purple-400",
      tertiary: "bg-purple-600",
      border: "border-purple-500",
      text: "text-purple-600",
      bg: "from-slate-50 to-purple-50",
    },
    green: {
      primary: "bg-emerald-500",
      secondary: "bg-emerald-400",
      tertiary: "bg-emerald-600",
      border: "border-emerald-500",
      text: "text-emerald-600",
      bg: "from-slate-50 to-emerald-50",
    },
    red: {
      primary: "bg-red-500",
      secondary: "bg-red-400",
      tertiary: "bg-red-600",
      border: "border-red-500",
      text: "text-red-600",
      bg: "from-slate-50 to-red-50",
    },
    gray: {
      primary: "bg-gray-500",
      secondary: "bg-gray-400",
      tertiary: "bg-gray-600",
      border: "border-gray-500",
      text: "text-gray-600",
      bg: "from-slate-50 to-gray-50",
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  // Sleek Default Spinner - Minimal dual ring
  const DefaultLoader = () => (
    <div className={`relative ${config.container}`}>
      <div
        className={`absolute inset-0 ${config.spinner} border-gray-200 rounded-full`}
      ></div>
      <div
        className={`${config.spinner} ${colors.border} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );

  // Minimalist Puzzle - Clean dots forming square
  const PuzzleLoader = () => (
    <div
      className={`relative ${config.container} flex items-center justify-center`}
    >
      <div className="relative w-full h-full">
        {[
          { top: "25%", left: "25%", delay: "0ms" },
          { top: "25%", right: "25%", delay: "150ms" },
          { bottom: "25%", left: "25%", delay: "300ms" },
          { bottom: "25%", right: "25%", delay: "450ms" },
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${config.dot} ${colors.primary} rounded-full`}
            style={{
              ...pos,
              animation: `pulse 1.2s ease-in-out infinite`,
              animationDelay: pos.delay,
            }}
          />
        ))}
      </div>
    </div>
  );

  // Clean Network - Orbiting dots
  const NetworkLoader = () => (
    <div
      className={`relative ${config.container} flex items-center justify-center`}
    >
      <div
        className={`${config.centerDot} ${colors.primary} rounded-full animate-pulse`}
      ></div>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`absolute ${config.dot} ${colors.secondary} rounded-full animate-spin origin-center`}
          style={{
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) rotate(${
              i * 72
            }deg) translateY(-${
              size === "sm" ? "12px" : size === "md" ? "16px" : "20px"
            }) rotate(-${i * 72}deg)`,
            animationDuration: "2s",
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  // Modern Pulse - Expanding rings
  const PulseLoader = () => (
    <div
      className={`relative ${config.container} flex items-center justify-center`}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`absolute inset-0 ${colors.primary} rounded-full animate-ping opacity-30`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1.5s",
          }}
        />
      ))}
      <div
        className={`relative ${config.centerDot} ${colors.tertiary} rounded-full`}
      ></div>
    </div>
  );

  // Perfect Bars - Your favorite (keeping it clean)
  const BarsLoader = () => (
    <div className="flex items-end justify-center space-x-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${config.bars} ${
            i % 2 === 0 ? colors.primary : colors.secondary
          } rounded-sm`}
          style={{
            animation: `bars 1.2s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );

  // Render loader variants
  const renderLoader = () => {
    switch (variant) {
      case "puzzle":
        return <PuzzleLoader />;
      case "network":
        return <NetworkLoader />;
      case "pulse":
        return <PulseLoader />;
      case "bars":
        return <BarsLoader />;
      case "default":
      default:
        return <DefaultLoader />;
    }
  };

  const containerClass = fullScreen
    ? `fixed inset-0 bg-gradient-to-br ${colors.bg} backdrop-blur-sm z-50 flex items-center justify-center`
    : "flex items-center justify-center py-4";

  const textClass = `${config.text} ${colors.text} font-medium`;

  return (
    <>
      <div className={containerClass}>
        <div className="flex flex-col items-center">
          <div className="relative">{renderLoader()}</div>
          {text && <p className={`${textClass} animate-pulse`}>{text}</p>}
        </div>
      </div>
    </>
  );
}
