// app/error.tsx (Next.js 13+ app directory)
"use client"; // Error components must be Client Components

import React, { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

interface ErrorPageProps extends ErrorProps {
  variant?: "default" | "minimal" | "detailed";
  color?: "blue" | "purple" | "green" | "red" | "gray";
  showErrorDetails?: boolean;
}

export default function Error({
  error,
  reset,
  variant = "default",
  color = "red",
  showErrorDetails = false,
}: ErrorPageProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("BizConnect Error:", error);
  }, [error]);

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
      danger: "from-blue-500 to-red-500",
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
      danger: "from-purple-500 to-red-500",
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
      danger: "from-emerald-500 to-red-500",
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
      danger: "from-red-500 to-red-700",
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
      danger: "from-gray-500 to-red-500",
    },
  };

  const colors = colorConfig[color];

  // Exploding/breaking puzzle pieces for error
  const ErrorPuzzleIcon = () => (
    <div className="relative w-40 h-40 mx-auto mb-8">
      {/* Central explosion effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div
          className={`w-4 h-4 bg-gradient-to-br ${colors.danger} rounded-full animate-pulse-intense shadow-lg`}
        >
          {/* Explosion rings */}
          <div className="absolute inset-0 w-8 h-8 border-2 border-red-400 rounded-full animate-ping-slow -top-2 -left-2 opacity-60"></div>
          <div className="absolute inset-0 w-12 h-12 border border-red-300 rounded-full animate-ping-slower -top-4 -left-4 opacity-40"></div>
        </div>
      </div>

      {/* Flying puzzle pieces */}
      <div className="absolute top-2 left-4 w-10 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg shadow-lg animate-explode-1 transform rotate-45">
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
      </div>

      <div className="absolute top-4 right-0 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded shadow-lg animate-explode-2 transform -rotate-30">
        <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full"></div>
      </div>

      <div className="absolute bottom-4 left-0 w-12 h-10 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg shadow-lg animate-explode-3 transform rotate-12">
        <div className="absolute -top-0.5 left-1/4 w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
        <div className="absolute -top-0.5 right-1/4 w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
      </div>

      <div className="absolute bottom-2 right-4 w-9 h-7 bg-gradient-to-br from-gray-600 to-gray-800 rounded shadow-lg animate-explode-4 transform -rotate-60">
        <div className="absolute -left-0.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
      </div>

      <div className="absolute top-8 left-12 w-6 h-5 bg-gradient-to-br from-gray-400 to-gray-600 rounded shadow-lg animate-explode-5 transform rotate-75">
        <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
      </div>

      <div className="absolute bottom-8 right-12 w-7 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded shadow-lg animate-explode-6 transform -rotate-45">
        <div className="absolute -bottom-0.5 right-1/2 transform translate-x-1/2 w-1.5 h-1.5 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
      </div>

      {/* Sparks/debris */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-1 bg-gradient-to-br ${colors.danger} rounded-full animate-spark opacity-80`}
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${20 + Math.random() * 60}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );

  // Circuit break/electrical error icon
  const CircuitBreakIcon = () => (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Circuit board base */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg shadow-lg opacity-80">
        {/* Circuit traces (broken) */}
        <div className="absolute top-4 left-2 right-2 h-0.5 bg-gradient-to-r from-green-400 via-transparent to-red-400 animate-flicker"></div>
        <div className="absolute top-8 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-400 via-transparent to-orange-400 animate-flicker-delayed"></div>
        <div className="absolute bottom-8 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-400 via-transparent to-yellow-400 animate-flicker-slow"></div>

        {/* Vertical traces */}
        <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-cyan-400 via-transparent to-red-400 animate-flicker"></div>
        <div className="absolute right-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-green-400 via-transparent to-orange-400 animate-flicker-delayed"></div>
      </div>

      {/* Error indicators */}
      <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-blink shadow-lg"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-orange-500 rounded-full animate-blink-delayed shadow-lg"></div>

      {/* Central error symbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-8 h-8">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${colors.danger} rounded-full animate-pulse-intense shadow-lg`}
          ></div>
          <div className="absolute inset-2 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Get user-friendly error message
  const getErrorMessage = (error: Error) => {
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return {
        title: "Network Connection Error",
        description:
          "Unable to connect to our servers. Please check your internet connection.",
        icon: "network",
      };
    }

    if (message.includes("timeout")) {
      return {
        title: "Request Timeout",
        description:
          "The operation took too long to complete. Please try again.",
        icon: "time",
      };
    }

    if (message.includes("permission") || message.includes("unauthorized")) {
      return {
        title: "Permission Denied",
        description: "You don't have permission to access this resource.",
        icon: "lock",
      };
    }

    if (message.includes("not found") || message.includes("404")) {
      return {
        title: "Resource Not Found",
        description: "The requested resource could not be found.",
        icon: "search",
      };
    }

    return {
      title: "System Error",
      description: "Something went wrong with the business connection system.",
      icon: "error",
    };
  };

  const errorInfo = getErrorMessage(error);

  const renderIcon = () => {
    switch (variant) {
      case "minimal":
        return <CircuitBreakIcon />;
      case "detailed":
      case "default":
      default:
        return <ErrorPuzzleIcon />;
    }
  };

  const renderContent = () => {
    switch (variant) {
      case "minimal":
        return (
          <div className="text-center">
            <CircuitBreakIcon />
            <h1 className="text-6xl font-bold text-gray-400 mb-4">Error</h1>
          </div>
        );

      case "detailed":
        return (
          <div className="text-center">
            <ErrorPuzzleIcon />
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Technical Details
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Error:</strong> {error.name}
              </p>
              {error.digest && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Error ID:</strong> {error.digest}
                </p>
              )}
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Show error message
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-800 overflow-auto max-h-32">
                  {error.message}
                </pre>
              </details>
            </div>
          </div>
        );

      case "default":
      default:
        return (
          <div className="text-center">
            <ErrorPuzzleIcon />
            {/* Error code display */}
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>System Error</span>
                {error.digest && <span>#{error.digest.slice(0, 8)}</span>}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center relative overflow-hidden`}
      >
        {/* Background floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-2 h-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-float-bg-1"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full animate-float-bg-2"></div>
          <div className="absolute bottom-32 left-32 w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-red-700 rounded-full animate-float-bg-3"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-float-bg-4"></div>
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          {renderContent()}

          {/* Content */}
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {errorInfo.title}
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              {errorInfo.description}
            </p>
            <p className="text-gray-500 mb-8">
              Don't worry, our business connection experts are on it! Try the
              actions below.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={reset}
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Try Again</span>
              </button>

              <button
                onClick={() => (window.location.href = "/")}
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Go Home</span>
              </button>
            </div>

            {/* Help section */}
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Need Immediate Help?
              </h3>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
                  <div
                    className={`w-8 h-8 ${colors.accent} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">
                      Check Status
                    </div>
                    <div className="text-gray-600">System status page</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
                  <div
                    className={`w-8 h-8 ${colors.accent} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
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
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">
                      Live Support
                    </div>
                    <div className="text-gray-600">Chat with us now</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg">
                  <div
                    className={`w-8 h-8 ${colors.accent} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">
                      Documentation
                    </div>
                    <div className="text-gray-600">Browse help docs</div>
                  </div>
                </div>
              </div>

              {process.env.NODE_ENV === "development" && showErrorDetails && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                  <h4 className="text-sm font-semibold text-red-800 mb-2">
                    Development Error Details:
                  </h4>
                  <pre className="text-xs text-red-700 overflow-auto max-h-32 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes explode-1 {
          0% {
            transform: rotate(45deg) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: rotate(65deg) translate(-30px, -40px);
            opacity: 0;
          }
        }
        @keyframes explode-2 {
          0% {
            transform: rotate(-30deg) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: rotate(-50deg) translate(40px, -30px);
            opacity: 0;
          }
        }
        @keyframes explode-3 {
          0% {
            transform: rotate(12deg) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: rotate(30deg) translate(-40px, 35px);
            opacity: 0;
          }
        }
        @keyframes explode-4 {
          0% {
            transform: rotate(-60deg) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: rotate(-80deg) translate(35px, 30px);
            opacity: 0;
          }
        }
        @keyframes explode-5 {
          0% {
            transform: rotate(75deg) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: rotate(95deg) translate(-20px, -35px);
            opacity: 0;
          }
        }
        @keyframes explode-6 {
          0% {
            transform: rotate(-45deg) translate(0, 0);
            opacity: 1;
          }
          100% {
            transform: rotate(-65deg) translate(25px, 40px);
            opacity: 0;
          }
        }
        @keyframes spark {
          0% {
            opacity: 1;
            transform: scale(1) translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: scale(0.5)
              translate(var(--random-x, 20px), var(--random-y, -20px));
          }
        }
        @keyframes pulse-intense {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.3;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }
        @keyframes flicker {
          0%,
          100% {
            opacity: 0.8;
          }
          25% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.9;
          }
          75% {
            opacity: 0.1;
          }
        }
        @keyframes flicker-delayed {
          0%,
          100% {
            opacity: 0.6;
          }
          33% {
            opacity: 0.9;
          }
          66% {
            opacity: 0.1;
          }
        }
        @keyframes flicker-slow {
          0%,
          100% {
            opacity: 0.7;
          }
          50% {
            opacity: 0.3;
          }
        }
        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0.3;
          }
        }
        @keyframes blink-delayed {
          0%,
          30% {
            opacity: 0.3;
          }
          31%,
          80% {
            opacity: 1;
          }
          81%,
          100% {
            opacity: 0.3;
          }
        }
        @keyframes float-bg-1 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          33% {
            transform: translate(25px, -25px);
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
            transform: translate(-30px, 15px);
          }
        }
        @keyframes float-bg-3 {
          0%,
          100% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(15px, -30px);
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
            transform: translate(20px, -10px);
          }
        }

        .animate-explode-1 {
          animation: explode-1 3s ease-out infinite;
        }
        .animate-explode-2 {
          animation: explode-2 2.8s ease-out infinite 0.2s;
        }
        .animate-explode-3 {
          animation: explode-3 3.2s ease-out infinite 0.4s;
        }
        .animate-explode-4 {
          animation: explode-4 2.9s ease-out infinite 0.6s;
        }
        .animate-explode-5 {
          animation: explode-5 3.1s ease-out infinite 0.1s;
        }
        .animate-explode-6 {
          animation: explode-6 2.7s ease-out infinite 0.3s;
        }
        .animate-spark {
          animation: spark 2s ease-out infinite;
        }
        .animate-pulse-intense {
          animation: pulse-intense 1.5s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
        .animate-ping-slower {
          animation: ping-slower 3s ease-out infinite;
        }
        .animate-flicker {
          animation: flicker 2s linear infinite;
        }
        .animate-flicker-delayed {
          animation: flicker-delayed 2.5s linear infinite;
        }
        .animate-flicker-slow {
          animation: flicker-slow 3s linear infinite;
        }
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
        .animate-blink-delayed {
          animation: blink-delayed 1.2s ease-in-out infinite;
        }
        .animate-float-bg-1 {
          animation: float-bg-1 18s ease-in-out infinite;
        }
        .animate-float-bg-2 {
          animation: float-bg-2 15s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
