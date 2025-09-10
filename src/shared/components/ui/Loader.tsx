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
  // Size configurations for different variants
  const sizeConfig = {
    sm: {
      container: "w-8 h-8",
      puzzle: "w-8 h-8",
      network: "w-8 h-8",
      spinner: "h-6 w-6 border-2",
      dots: "h-1.5 w-1.5",
      pulse: "h-6 w-6",
      bars: "h-4 w-1",
      text: "text-xs mt-2",
      orbital: "w-12 h-12",
    },
    md: {
      container: "w-16 h-16",
      puzzle: "w-16 h-16",
      network: "w-16 h-16",
      spinner: "h-10 w-10 border-3",
      dots: "h-2 w-2",
      pulse: "h-10 w-10",
      bars: "h-6 w-1.5",
      text: "text-sm mt-3",
      orbital: "w-20 h-20",
    },
    lg: {
      container: "w-24 h-24",
      puzzle: "w-24 h-24",
      network: "w-24 h-24",
      spinner: "h-16 w-16 border-4",
      dots: "h-3 w-3",
      pulse: "h-16 w-16",
      bars: "h-8 w-2",
      text: "text-base mt-4",
      orbital: "w-32 h-32",
    },
  };

  // Color configurations with gradients for business theme
  const colorConfig = {
    blue: {
      primary: "from-blue-400 to-blue-600",
      secondary: "from-blue-500 to-blue-700",
      tertiary: "from-blue-600 to-blue-800",
      accent: "bg-blue-500",
      ring: "border-blue-200",
      text: "text-blue-700",
      bg: "from-slate-50 to-blue-50",
    },
    purple: {
      primary: "from-purple-400 to-purple-600",
      secondary: "from-purple-500 to-purple-700",
      tertiary: "from-purple-600 to-purple-800",
      accent: "bg-purple-500",
      ring: "border-purple-200",
      text: "text-purple-700",
      bg: "from-slate-50 to-purple-50",
    },
    green: {
      primary: "from-emerald-400 to-emerald-600",
      secondary: "from-emerald-500 to-emerald-700",
      tertiary: "from-emerald-600 to-emerald-800",
      accent: "bg-emerald-500",
      ring: "border-emerald-200",
      text: "text-emerald-700",
      bg: "from-slate-50 to-emerald-50",
    },
    red: {
      primary: "from-red-400 to-red-600",
      secondary: "from-red-500 to-red-700",
      tertiary: "from-red-600 to-red-800",
      accent: "bg-red-500",
      ring: "border-red-200",
      text: "text-red-700",
      bg: "from-slate-50 to-red-50",
    },
    gray: {
      primary: "from-gray-400 to-gray-600",
      secondary: "from-gray-500 to-gray-700",
      tertiary: "from-gray-600 to-gray-800",
      accent: "bg-gray-500",
      ring: "border-gray-200",
      text: "text-gray-700",
      bg: "from-slate-50 to-gray-50",
    },
  };

  const config = sizeConfig[size];
  const colors = colorConfig[color];

  // Puzzle pieces loader (signature BizConnect style)
  const PuzzleLoader = () => (
    <div className={`relative ${config.puzzle}`}>
      {/* Top piece */}
      <div
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
          size === "sm" ? "w-3 h-2" : size === "md" ? "w-5 h-3" : "w-7 h-4"
        } bg-gradient-to-br ${
          colors.primary
        } rounded-lg shadow-lg animate-puzzle-float-1`}
      >
        <div
          className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 ${
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
          } bg-gradient-to-br ${colors.secondary} rounded-full`}
        ></div>
      </div>

      {/* Left piece */}
      <div
        className={`absolute top-1/3 left-0 ${
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
        } bg-gradient-to-br ${
          colors.secondary
        } rounded shadow-lg animate-puzzle-float-2`}
      >
        <div
          className={`absolute -right-0.5 top-1/2 transform -translate-y-1/2 ${
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
          } bg-gradient-to-br ${colors.tertiary} rounded-full`}
        ></div>
      </div>

      {/* Right piece */}
      <div
        className={`absolute top-1/3 right-0 ${
          size === "sm" ? "w-3 h-2" : size === "md" ? "w-4 h-3" : "w-5 h-4"
        } bg-gradient-to-br ${
          colors.tertiary
        } rounded shadow-lg animate-puzzle-float-3`}
      >
        <div
          className={`absolute -left-0.5 top-1/2 transform -translate-y-1/2 ${
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
          } bg-gradient-to-br ${colors.secondary} rounded-full`}
        ></div>
      </div>

      {/* Bottom piece */}
      <div
        className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${
          size === "sm" ? "w-4 h-3" : size === "md" ? "w-6 h-4" : "w-8 h-5"
        } bg-gradient-to-br ${
          colors.tertiary
        } rounded-lg shadow-lg animate-puzzle-float-4`}
      >
        <div
          className={`absolute -top-0.5 left-1/4 ${
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
          } bg-gradient-to-br ${colors.primary} rounded-full`}
        ></div>
        <div
          className={`absolute -top-0.5 right-1/4 ${
            size === "sm" ? "w-1 h-1" : "w-1.5 h-1.5"
          } bg-gradient-to-br ${colors.primary} rounded-full`}
        ></div>
      </div>

      {/* Center connection point */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
        } ${colors.accent} rounded-full animate-pulse shadow-lg`}
      ></div>
    </div>
  );

  // Network connection loader
  const NetworkLoader = () => (
    <div className={`relative ${config.network}`}>
      {/* Central hub */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
          size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"
        } bg-gradient-to-br ${
          colors.primary
        } rounded-full shadow-lg animate-pulse`}
      ></div>

      {/* Connection nodes */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = i * 72 * (Math.PI / 180);
        const radius = size === "sm" ? 12 : size === "md" ? 20 : 28;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className={`absolute top-1/2 left-1/2 ${
              size === "sm"
                ? "w-2 h-2"
                : size === "md"
                ? "w-2.5 h-2.5"
                : "w-3 h-3"
            } bg-gradient-to-br ${
              i % 2 === 0 ? colors.secondary : colors.tertiary
            } rounded-full shadow animate-network-node`}
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        );
      })}

      {/* Connecting lines (simulated with pseudo elements) */}
      <div className="absolute inset-0 animate-spin-slow opacity-30">
        <div
          className={`absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r ${colors.primary} transform -translate-y-1/2 origin-left rotate-0`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r ${colors.secondary} transform -translate-y-1/2 origin-left rotate-45`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 w-full h-0.5 bg-gradient-to-r ${colors.tertiary} transform -translate-y-1/2 origin-left rotate-90`}
        ></div>
      </div>
    </div>
  );

  // Render different loader variants
  const renderLoader = () => {
    switch (variant) {
      case "puzzle":
        return <PuzzleLoader />;

      case "network":
        return <NetworkLoader />;

      case "pulse":
        return (
          <div
            className={`${config.pulse} bg-gradient-to-br ${colors.primary} rounded-full animate-pulse opacity-75 shadow-lg`}
          />
        );

      case "bars":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`${config.bars} bg-gradient-to-t ${
                  i % 2 === 0 ? colors.primary : colors.secondary
                } animate-pulse shadow-sm rounded-sm`}
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        );

      case "default":
      default:
        return (
          <div className="relative">
            <div
              className={`${config.spinner} border-transparent border-t-current bg-gradient-to-br ${colors.primary} bg-clip-text text-transparent rounded-full animate-spin`}
            />
            {/* Orbital rings */}
            <div
              className={`absolute inset-0 ${config.orbital} ${colors.ring} rounded-full animate-spin-slow opacity-30`}
              style={{ border: "1px solid", animationDuration: "3s" }}
            ></div>
          </div>
        );
    }
  };

  // Container classes
  const containerClass = fullScreen
    ? `fixed inset-0 bg-gradient-to-br ${colors.bg} backdrop-blur-sm z-50 flex items-center justify-center`
    : "flex items-center justify-center py-4";

  const textClass = `${config.text} ${colors.text} font-medium`;

  return (
    <>
      <div className={containerClass}>
        <div className="flex flex-col items-center">
          <div className="relative">
            {renderLoader()}
            {/* Background floating elements for full screen */}
            {fullScreen && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                  className={`absolute top-10 left-10 w-2 h-2 ${colors.accent} opacity-20 rounded-full animate-float-bg-1`}
                ></div>
                <div
                  className={`absolute top-20 right-20 w-1.5 h-1.5 ${colors.accent} opacity-30 rounded-full animate-float-bg-2`}
                ></div>
                <div
                  className={`absolute bottom-20 left-20 w-2.5 h-2.5 ${colors.accent} opacity-25 rounded-full animate-float-bg-3`}
                ></div>
                <div
                  className={`absolute bottom-10 right-10 w-1 h-1 ${colors.accent} opacity-40 rounded-full animate-float-bg-4`}
                ></div>
              </div>
            )}
          </div>
          {text && <p className={textClass}>{text}</p>}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes puzzle-float-1 {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-6px) rotate(2deg);
          }
        }
        @keyframes puzzle-float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-4px) rotate(-2deg);
          }
        }
        @keyframes puzzle-float-3 {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-5px) rotate(1deg);
          }
        }
        @keyframes puzzle-float-4 {
          0%,
          100% {
            transform: translateX(-50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateX(-50%) translateY(-8px) rotate(-1deg);
          }
        }
        @keyframes network-node {
          0%,
          100% {
            transform: translate(-50%, -50%) translateX(var(--x))
              translateY(var(--y)) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translate(-50%, -50%) translateX(var(--x))
              translateY(var(--y)) scale(1.2);
            opacity: 1;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes float-bg-1 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          33% {
            transform: translate(20px, -20px);
          }
          66% {
            transform: translate(-15px, -10px);
          }
        }
        @keyframes float-bg-2 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(-25px, 15px);
          }
        }
        @keyframes float-bg-3 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(15px, -25px);
          }
          75% {
            transform: translate(-20px, -15px);
          }
        }
        @keyframes float-bg-4 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(18px, -10px);
          }
        }

        .animate-puzzle-float-1 {
          animation: puzzle-float-1 3s ease-in-out infinite;
        }
        .animate-puzzle-float-2 {
          animation: puzzle-float-2 3s ease-in-out infinite 0.5s;
        }
        .animate-puzzle-float-3 {
          animation: puzzle-float-3 3s ease-in-out infinite 1s;
        }
        .animate-puzzle-float-4 {
          animation: puzzle-float-4 3s ease-in-out infinite 1.5s;
        }
        .animate-network-node {
          animation: network-node 2s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-float-bg-1 {
          animation: float-bg-1 15s ease-in-out infinite;
        }
        .animate-float-bg-2 {
          animation: float-bg-2 12s ease-in-out infinite;
        }
        .animate-float-bg-3 {
          animation: float-bg-3 18s ease-in-out infinite;
        }
        .animate-float-bg-4 {
          animation: float-bg-4 10s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
