"use client";
import React, { useState } from "react";
import {
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { InputField } from "@/app/components/ui/InputField";

interface FormErrors {
  [key: string]: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await fetch("/api/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          setIsEmailSent(true);
        } else {
          const errorData = await response.json();
          setErrors({
            general:
              errorData.message ||
              "Failed to send reset email. Please try again.",
          });
        }
      } catch (error) {
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

  const handleResendEmail = () => {
    setIsEmailSent(false);
    setEmail("");
    setErrors({});
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 pt-32">
        <div className="w-full max-w-md">
          {/* Success State */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">We've sent a password reset link to</p>
            <p className="text-gray-800 font-medium">{email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-8">
              <div className="text-center space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">
                    Please check your inbox and click the reset link to create a
                    new password.
                  </p>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="text-blue-600 hover:underline font-medium transition-colors cursor-pointer"
                  >
                    try a different email address
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Forgot Password Form */}
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
              {/* Email Input */}
              <div>
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  error={errors.email}
                  required
                  //   disabled={isLoading}
                />
              </div>

              {/* Send Reset Link Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
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
