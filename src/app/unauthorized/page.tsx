// components/UnauthorizedPage.tsx
// Usage: Import and use in your protected routes or create app/unauthorized/page.tsx
"use client"
import React from "react";
import Link from "next/link";

interface UnauthorizedProps {
  variant?: "default" | "minimal" | "business";
  color?: "blue" | "purple" | "green" | "red" | "gray";
  reason?: "login" | "permission" | "subscription" | "verification" | "custom";
  customMessage?: string;
  showLoginButton?: boolean;
  showContactSupport?: boolean;
  redirectPath?: string;
}

export default function UnauthorizedPage({
  variant = "default",
  color = "red",
  reason = "permission",
  customMessage,
  showLoginButton = true,
  showContactSupport = true,
  redirectPath = "/login",
}: UnauthorizedProps) {
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
      light: "bg-blue-50",
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
      light: "bg-purple-50",
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
      light: "bg-emerald-50",
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
      light: "bg-red-50",
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
      light: "bg-gray-50",
    },
  };

  const colors = colorConfig[color];

  // Lock and security-themed icon
  const LockedPuzzleIcon = () => (
    <div className="relative w-32 h-32 mx-auto mb-8">
      {/* Locked puzzle pieces */}
      <div className="absolute top-4 left-8 w-8 h-6 bg-gradient-to-br from-gray-300 to-gray-500 rounded-lg shadow-lg animate-lock-shake">
        <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
        {/* Lock icon on piece */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="absolute top-6 right-4 w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded shadow-lg animate-lock-bounce">
        <div className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-2.5 h-2.5 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 w-10 h-8 bg-gradient-to-br from-gray-500 to-gray-700 rounded-lg shadow-lg animate-lock-pulse">
        <div className="absolute -top-0.5 left-1/4 w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
        <div className="absolute -top-0.5 right-1/4 w-2 h-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-red-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <div className="absolute bottom-4 right-8 w-7 h-5 bg-gradient-to-br from-gray-600 to-gray-800 rounded shadow-lg animate-lock-float">
        <div className="absolute -left-0.5 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-3 h-3 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Central security barrier */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg animate-pulse"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {/* Security rings */}
          <div className="absolute inset-0 w-16 h-16 border-2 border-red-300 rounded-full animate-ping-security -top-2 -left-2 opacity-40"></div>
          <div className="absolute inset-0 w-20 h-20 border border-red-200 rounded-full animate-ping-security-slow -top-4 -left-4 opacity-30"></div>
        </div>
      </div>

      {/* Access denied barriers */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-barrier-flash"></div>
        <div className="absolute bottom-6 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-barrier-flash-delayed"></div>
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-red-500 to-transparent animate-barrier-flash-slow"></div>
        <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-red-500 to-transparent animate-barrier-flash-delayed"></div>
      </div>
    </div>
  );

  // Business access gate icon
  const BusinessGateIcon = () => (
    <div className="relative w-28 h-28 mx-auto mb-6">
      {/* Gate structure */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-20 border-4 border-gray-400 rounded-lg relative bg-gradient-to-br from-gray-100 to-gray-300">
          {/* Gate bars */}
          <div className="absolute inset-2 flex space-x-1">
            <div className="flex-1 bg-gradient-to-b from-gray-300 to-gray-500 rounded animate-gate-close"></div>
            <div className="flex-1 bg-gradient-to-b from-gray-300 to-gray-500 rounded animate-gate-close-delayed"></div>
            <div className="flex-1 bg-gradient-to-b from-gray-300 to-gray-500 rounded animate-gate-close"></div>
            <div className="flex-1 bg-gradient-to-b from-gray-300 to-gray-500 rounded animate-gate-close-delayed"></div>
            <div className="flex-1 bg-gradient-to-b from-gray-300 to-gray-500 rounded animate-gate-close"></div>
          </div>

          {/* Lock mechanism */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-6 bg-gradient-to-br from-red-500 to-red-700 rounded shadow-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Access denied indicators */}
      <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-blink-warning shadow-lg flex items-center justify-center">
        <svg
          className="w-2.5 h-2.5 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );

  // Get content based on reason
  const getContent = () => {
    switch (reason) {
      case "login":
        return {
          title: "Login Required",
          description:
            "You need to sign in to access this business connection.",
          subtitle: "Please log in with your BizConnect account to continue.",
          icon: "login",
        };

      case "subscription":
        return {
          title: "Premium Feature",
          description:
            "This business connection requires a premium subscription.",
          subtitle: "Upgrade your plan to unlock advanced networking features.",
          icon: "premium",
        };

      case "verification":
        return {
          title: "Account Verification Required",
          description:
            "Your business account needs verification to access this feature.",
          subtitle:
            "Complete your business verification to establish trusted connections.",
          icon: "verify",
        };

      case "custom":
        return {
          title: "Access Restricted",
          description:
            customMessage || "You don't have permission to view this content.",
          subtitle: "Contact your administrator or upgrade your access level.",
          icon: "custom",
        };

      case "permission":
      default:
        return {
          title: "Access Denied",
          description:
            "You don't have permission to access this business resource.",
          subtitle:
            "This area is restricted to authorized business partners only.",
          icon: "lock",
        };
    }
  };

  const content = getContent();

  const renderIcon = () => {
    switch (variant) {
      case "business":
        return <BusinessGateIcon />;
      case "minimal":
        return (
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "default":
      default:
        return <LockedPuzzleIcon />;
    }
  };

  const renderMainContent = () => {
    if (variant === "minimal") {
      return (
        <div className="text-center">
          {renderIcon()}
          <h1 className="text-6xl font-bold text-gray-400 mb-4">403</h1>
        </div>
      );
    }

    return (
      <div className="text-center">
        {renderIcon()}
        {/* Status code */}
        <div className="mb-6">
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>403 Forbidden</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`min-h-screen bg-gradient-to-br ${colors.bg} flex items-center justify-center relative overflow-hidden`}
      >
        {/* Background floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-20 left-20 w-2 h-2 bg-gradient-to-br from-red-400 to-red-600 rounded-full animate-float-bg-1"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-gradient-to-br from-orange-400 to-red-500 rounded-full animate-float-bg-2"></div>
          <div className="absolute bottom-32 left-32 w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-red-700 rounded-full animate-float-bg-3"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-gradient-to-br from-red-600 to-red-800 rounded-full animate-float-bg-4"></div>
        </div>

        <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
          {renderMainContent()}

          {/* Content */}
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {content.title}
            </h2>
            <p className="text-lg text-gray-600 mb-2">{content.description}</p>
            <p className="text-gray-500 mb-8">{content.subtitle}</p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              {showLoginButton && reason === "login" && (
                <Link
                  href={redirectPath}
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Sign In</span>
                </Link>
              )}

              {reason === "subscription" && (
                <Link
                  href="/pricing"
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Upgrade Plan</span>
                </Link>
              )}

              {reason === "verification" && (
                <Link
                  href="/verify"
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Verify Account</span>
                </Link>
              )}

              <Link
                href="/"
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
              </Link>
            </div>

            {/* Help section */}
            <div
              className={`p-6 ${colors.light} backdrop-blur-sm rounded-lg border border-gray-200`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Need Access?
              </h3>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                {reason === "login" && (
                  <>
                    <div className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg">
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">
                          Create Account
                        </div>
                        <div className="text-gray-600">Join BizConnect</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg">
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
                            d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2m-6 4h6"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">
                          Reset Password
                        </div>
                        <div className="text-gray-600">Forgot credentials?</div>
                      </div>
                    </div>
                  </>
                )}

                {reason === "subscription" && (
                  <>
                    <div className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg">
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">
                          Premium Plans
                        </div>
                        <div className="text-gray-600">View pricing</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg">
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-800">
                          Free Trial
                        </div>
                        <div className="text-gray-600">
                          Try premium features
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {showContactSupport && (
                  <div className="flex items-center space-x-2 p-3 bg-white/70 rounded-lg">
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
                        Contact Support
                      </div>
                      <div className="text-gray-600">
                        Get help from our team
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-white/50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <strong>Questions about access?</strong> Our business
                  connection specialists are here to help.
                </p>
                <div className="mt-2 flex justify-center space-x-4 text-sm">
                  <Link
                    href="/help"
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Help Center</span>
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
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes lock-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px) rotate(-1deg);
          }
          75% {
            transform: translateX(2px) rotate(1deg);
          }
        }
        @keyframes lock-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        @keyframes lock-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        @keyframes lock-float {
          0%,
          100% {
            transform: translateY(0) rotate(-12deg);
          }
          50% {
            transform: translateY(-6px) rotate(-8deg);
          }
        }
        @keyframes ping-security {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        @keyframes ping-security-slow {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        @keyframes barrier-flash {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        @keyframes barrier-flash-delayed {
          0%,
          30% {
            opacity: 0.2;
          }
          50%,
          80% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.2;
          }
        }
        @keyframes barrier-flash-slow {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes gate-close {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.8);
          }
        }
        @keyframes gate-close-delayed {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.9);
          }
        }
        @keyframes blink-warning {
          0%,
          50% {
            opacity: 1;
            background-color: rgb(239 68 68);
          }
          51%,
          100% {
            opacity: 0.4;
            background-color: rgb(185 28 28);
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

        .animate-lock-shake {
          animation: lock-shake 3s ease-in-out infinite;
        }
        .animate-lock-bounce {
          animation: lock-bounce 2s ease-in-out infinite 0.5s;
        }
        .animate-lock-pulse {
          animation: lock-pulse 2.5s ease-in-out infinite 1s;
        }
        .animate-lock-float {
          animation: lock-float 3s ease-in-out infinite 1.5s;
        }
        .animate-ping-security {
          animation: ping-security 2s ease-out infinite;
        }
        .animate-ping-security-slow {
          animation: ping-security-slow 3s ease-out infinite;
        }
        .animate-barrier-flash {
          animation: barrier-flash 1.5s linear infinite;
        }
        .animate-barrier-flash-delayed {
          animation: barrier-flash-delayed 2s linear infinite;
        }
        .animate-barrier-flash-slow {
          animation: barrier-flash-slow 2.5s linear infinite;
        }
        .animate-gate-close {
          animation: gate-close 2s ease-in-out infinite;
        }
        .animate-gate-close-delayed {
          animation: gate-close-delayed 2.2s ease-in-out infinite;
        }
        .animate-blink-warning {
          animation: blink-warning 1s ease-in-out infinite;
        }
        .animate-float-bg-1 {
          animation: float-bg-1 18s ease-in-out infinite;
        }
        .animate-float-bg-2 {
          animation: float-bg-2 15s ease-in-out infinite;
        }
        .animate-float-bg-3 {
          animation: float-bg-3 22s ease-in-out infinite;
        }
        .animate-float-bg-4 {
          animation: float-bg-4 16s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
