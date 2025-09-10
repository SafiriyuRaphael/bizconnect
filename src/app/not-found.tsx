
"use client";
import React from "react";
import Link from "next/link";

interface NotFoundProps {
  variant?: "default" | "minimal" | "animated";
  color?: "blue" | "purple" | "green" | "red" | "gray";
}

export default function NotFound({
  variant = "animated",
  color = "blue",
}: NotFoundProps) {
  // Color configurations matching your loader
  const colorConfig = {
    blue: {
      primary: "from-blue-400 to-blue-600",
      secondary: "from-blue-500 to-blue-700",
      tertiary: "from-blue-600 to-blue-800",
      accent: "bg-blue-500",
      ring: "border-blue-200",
      text: "text-blue-700",
      bg: "from-slate-50 to-blue-50",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    purple: {
      primary: "from-purple-400 to-purple-600",
      secondary: "from-purple-500 to-purple-700",
      tertiary: "from-purple-600 to-purple-800",
      accent: "bg-purple-500",
      ring: "border-purple-200",
      text: "text-purple-700",
      bg: "from-slate-50 to-purple-50",
      button: "bg-purple-600 hover:bg-purple-700",
    },
    green: {
      primary: "from-emerald-400 to-emerald-600",
      secondary: "from-emerald-500 to-emerald-700",
      tertiary: "from-emerald-600 to-emerald-800",
      accent: "bg-emerald-500",
      ring: "border-emerald-200",
      text: "text-emerald-700",
      bg: "from-slate-50 to-emerald-50",
      button: "bg-emerald-600 hover:bg-emerald-700",
    },
    red: {
      primary: "from-red-400 to-red-600",
      secondary: "from-red-500 to-red-700",
      tertiary: "from-red-600 to-red-800",
      accent: "bg-red-500",
      ring: "border-red-200",
      text: "text-red-700",
      bg: "from-slate-50 to-red-50",
      button: "bg-red-600 hover:bg-red-700",
    },
    gray: {
      primary: "from-gray-400 to-gray-600",
      secondary: "from-gray-500 to-gray-700",
      tertiary: "from-gray-600 to-gray-800",
      accent: "bg-gray-500",
      ring: "border-gray-200",
      text: "text-gray-700",
      bg: "from-slate-50 to-gray-50",
      button: "bg-gray-600 hover:bg-gray-700",
    },
  };

  const colors = colorConfig[color];

  // Broken puzzle pieces for 404
  const BrokenPuzzleIcon = () => (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Scattered puzzle pieces */}
      <div className="absolute top-0 left-8 w-8 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg shadow-lg animate-float-1 transform rotate-12">
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
      </div>

      <div className="absolute top-4 right-2 w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded shadow-lg animate-float-2 transform -rotate-6">
        <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full"></div>
      </div>

      <div className="absolute bottom-8 left-2 w-10 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg shadow-lg animate-float-3 transform rotate-6">
        <div className="absolute -top-0.5 left-1/4 w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
        <div className="absolute -top-0.5 right-1/4 w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
      </div>

      <div className="absolute bottom-2 right-8 w-7 h-5 bg-gradient-to-br from-gray-600 to-gray-800 rounded shadow-lg animate-float-4 transform -rotate-12">
        <div className="absolute -left-0.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
      </div>

      {/* Missing center piece indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-dashed border-gray-400 rounded-lg animate-pulse opacity-50"></div>

      {/* Connecting lines (broken) */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-6 left-1/2 w-16 h-0.5 bg-gradient-to-r from-gray-400 to-transparent transform -translate-x-1/2 rotate-45"></div>
        <div className="absolute bottom-6 left-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent to-gray-400 transform -translate-x-1/2 -rotate-45"></div>
      </div>
    </div>
  );

  // Large 404 with business styling
  const AnimatedNotFound = () => (
    <div className="text-center">
      <div className="relative mb-8">
        {/* Main 404 text */}
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-300 via-gray-500 to-gray-700 select-none">
          404
        </h1>

        {/* Floating business elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-4 left-1/4 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-float-bg-1 opacity-60"></div>
          <div className="absolute top-8 right-1/4 w-2 h-2 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full animate-float-bg-2 opacity-70"></div>
          <div className="absolute bottom-8 left-1/3 w-4 h-4 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-float-bg-3 opacity-50"></div>
          <div className="absolute bottom-4 right-1/3 w-2.5 h-2.5 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-float-bg-4 opacity-80"></div>
        </div>
      </div>

      <BrokenPuzzleIcon />
    </div>
  );

  // Network disconnected icon
  const DisconnectedIcon = () => (
    <div className="relative w-24 h-24 mx-auto mb-6">
      {/* Central hub (disconnected) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full shadow-lg opacity-50"></div>

      {/* Disconnected nodes */}
      {[0, 1, 2, 3].map((i) => {
        const angle = i * 90 * (Math.PI / 180);
        const radius = 32;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-4 h-4 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full shadow animate-disconnect opacity-40"
            style={{
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        );
      })}

      {/* Broken connection lines */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-gradient-to-r from-gray-400 to-transparent transform -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-6 h-0.5 bg-gradient-to-l from-gray-400 to-transparent transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 h-6 w-0.5 bg-gradient-to-t from-gray-400 to-transparent transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 h-6 w-0.5 bg-gradient-to-b from-gray-400 to-transparent transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (variant) {
      case "minimal":
        return (
          <div className="text-center">
            <h1 className="text-8xl font-bold text-gray-400 mb-4">404</h1>
            <DisconnectedIcon />
          </div>
        );

      case "animated":
      default:
        return <AnimatedNotFound />;
    }
  };

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center relative overflow-hidden`}
      >
        {/* Background floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-2 h-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full animate-float-bg-1"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full animate-float-bg-2"></div>
          <div className="absolute bottom-32 left-32 w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full animate-float-bg-3"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-float-bg-4"></div>
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          {renderContent()}

          {/* Content */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Connection Lost
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              The business connection you're looking for has been disconnected.
            </p>
            <p className="text-gray-500 mb-8">
              This page might have moved, been removed, or the link might be
              broken.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/"
                className={`${colors.button} text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Return Home</span>
              </Link>

              <button
                onClick={() => window.history.back()}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-400 flex items-center space-x-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Go Back</span>
              </button>
            </div>

            {/* Help text */}
            <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Need help?</strong> Try searching for what you need or
                contact our support team.
              </p>
              <div className="mt-3 flex justify-center space-x-4 text-sm">
                <Link
                  href="/search"
                  className={`${colors.text} hover:underline flex items-center space-x-1`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span>Search</span>
                </Link>
                <Link
                  href="/contact"
                  className={`${colors.text} hover:underline flex items-center space-x-1`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <span>Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations matching your loader style */}
      <style jsx>{`
        @keyframes float-1 {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(15deg);
          }
        }
        @keyframes float-2 {
          0%,
          100% {
            transform: translateY(0px) rotate(-6deg);
          }
          50% {
            transform: translateY(-8px) rotate(-3deg);
          }
        }
        @keyframes float-3 {
          0%,
          100% {
            transform: translateY(0px) rotate(6deg);
          }
          50% {
            transform: translateY(-12px) rotate(9deg);
          }
        }
        @keyframes float-4 {
          0%,
          100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(-6px) rotate(-9deg);
          }
        }
        @keyframes disconnect {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.2;
          }
        }
        @keyframes float-bg-1 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          33% {
            transform: translate(30px, -30px);
          }
          66% {
            transform: translate(-20px, -15px);
          }
        }
        @keyframes float-bg-2 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(-35px, 20px);
          }
        }
        @keyframes float-bg-3 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(20px, -35px);
          }
          75% {
            transform: translate(-25px, -20px);
          }
        }
        @keyframes float-bg-4 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          50% {
            transform: translate(25px, -15px);
          }
        }

        .animate-float-1 {
          animation: float-1 4s ease-in-out infinite;
        }
        .animate-float-2 {
          animation: float-2 3s ease-in-out infinite 0.5s;
        }
        .animate-float-3 {
          animation: float-3 5s ease-in-out infinite 1s;
        }
        .animate-float-4 {
          animation: float-4 3.5s ease-in-out infinite 1.5s;
        }
        .animate-disconnect {
          animation: disconnect 2s ease-in-out infinite;
        }
        .animate-float-bg-1 {
          animation: float-bg-1 20s ease-in-out infinite;
        }
        .animate-float-bg-2 {
          animation: float-bg-2 15s ease-in-out infinite;
        }
        .animate-float-bg-3 {
          animation: float-bg-3 25s ease-in-out infinite;
        }
        .animate-float-bg-4 {
          animation: float-bg-4 18s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
