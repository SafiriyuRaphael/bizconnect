import { InputField } from "@/shared/components/ui/InputField";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";
import { FormErrors } from "../../../../../../types";

export default function Form({
  isLoading,
  errors,
  handleSubmit,
  handleInputChange,
  email,
  handleBackToLogin,
}: {
  isLoading: boolean;
  handleSubmit: (e?: React.FormEvent | React.MouseEvent) => Promise<void>;
  errors: FormErrors;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
  handleBackToLogin: () => void;
}) {
  return (
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
  );
}
