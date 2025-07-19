"use client";
import React, { useState, useEffect } from "react";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordField } from "@/app/components/ui/PasswordField";

interface FormErrors {
  [key: string]: string;
}

interface FormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<FormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Get token from URL parameters
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const emailParam = searchParams.get("email");

    if (tokenParam) {
      setToken(tokenParam);
      // Verify token validity (optional - you can skip this if you want to verify only on submit)
      verifyToken(tokenParam, emailParam);
    } else {
      setIsValidToken(false);
    }
  }, [searchParams]);

  const verifyToken = async (token: string, email: string | null) => {
    try {
      const response = await fetch("/api/auth/validate-reset-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email }),
      });
      setIsValidToken(response.ok);
    } catch (_) {
      setIsValidToken(false);
    }
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear confirm password error if passwords now match
    if (
      name === "password" &&
      formData.confirmPassword &&
      value === formData.confirmPassword
    ) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
    if (
      name === "confirmPassword" &&
      formData.password &&
      value === formData.password
    ) {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: formData.password,
          }),
        });

        if (response.ok) {
          setIsPasswordReset(true);
        } else {
          const errorData = await response.json();
          setErrors({
            general:
              errorData.message ||
              "Failed to reset password. Please try again.",
          });
        }
      } catch (_) {
        setErrors({
          general: "Network error. Please check your connection and try again.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/login");
  };

  const handleRequestNewLink = () => {
    router.push("/auth/forgot-password");
  };

  // Show success state
  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 pt-28">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Password Reset Successful
            </h1>
            <p className="text-gray-600">
              Your password has been successfully reset
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    You can now sign in with your new password.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Sign In Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>&copy; 2025 Bizconnect. All rights reserved.</p>
            <p className="mt-1">
              Simplifying transactions, fostering connections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show invalid token state
  if (isValidToken === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 pt-28">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600">
              This password reset link is invalid or has expired
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="text-center space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    The reset link may have expired or been used already. Please
                    request a new password reset link.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleRequestNewLink}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    Request New Reset Link
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="w-full text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>&copy; 2025 Bizconnect. All rights reserved.</p>
            <p className="mt-1">
              Simplifying transactions, fostering connections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while verifying token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Show reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Reset Password Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div>
                <PasswordField
                  label="New Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  error={errors.password}
                  required
                  //   disabled={isLoading}
                />
                <div className="mt-2 text-xs text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <PasswordField
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  error={errors.confirmPassword}
                  required
                  //   disabled={isLoading}
                />
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                disabled={isLoading}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>&copy; 2025 Bizconnect. All rights reserved.</p>
          <p className="mt-1">
            Simplifying transactions, fostering connections.
          </p>
        </div>
      </div>
    </div>
  );
}
