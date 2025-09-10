import { ArrowLeft, CheckCircle } from "lucide-react";
import React from "react";

export default function EmailSuccess({
  email,
  handleBackToLogin,
  handleResendEmail,
}: {
  email: string;
  handleBackToLogin: () => void;
  handleResendEmail: () => void;
}) {
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
          <p className="text-gray-600">
            We&apos;ve sent a password reset link to
          </p>
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
                <p>Didn&apos;t receive the email? Check your spam folder or</p>
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
