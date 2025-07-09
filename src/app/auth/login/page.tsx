"use client";
import {
  User,
  ArrowRight,
  AlertCircle,

} from "lucide-react";
import Facebook from "../../../../public/icons/Facebook";
import Google from "../../../../public/icons/Google";
import { InputField } from "@/app/components/ui/InputField";
import { PasswordField } from "@/app/components/ui/PasswordField";
import { CheckboxField } from "@/app/components/ui/CheckBoxField";
import useLogin from "@/hook/useLogin";

export default function BizconnectLogin() {
  const {
    errors,
    formData,
    handleInputChange,
    rememberMe,
    isLoading,
    handleSubmit,
    handleSocialLogin,
    router,
    handleForgotPassword
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8 pt-28">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your Bizconnect account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            {/* General Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email or Username Input */}
              <div>
                <InputField
                  label="Email or Username"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  placeholder="Enter your email or username"
                  error={errors.emailOrUsername}
                  required
                  //   disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div>
                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  error={errors.password}
                  required
                />
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <CheckboxField
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={handleInputChange}
                >
                  Remember me
                </CheckboxField>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:underline font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Google />
                <span className="text-sm text-gray-700">Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin("facebook")}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Facebook />
                <span className="text-sm text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Register Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={() => router.push("/auth/register")}
                >
                  Create account
                </button>
              </p>
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
