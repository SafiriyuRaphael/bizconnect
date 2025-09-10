"use client";
import useForgetPassword from "./hooks";
import EmailSuccess from "./components/composite/EmailSuccess";
import Header from "./components/layout/Header";
import Form from "./components/layout/Form";
import Footer from "./components/layout/Footer";

export default function ForgotPassword() {
  const {
    email,
    errors,
    handleSubmit,
    isLoading,
    isEmailSent,
    handleInputChange,
    handleBackToLogin,
    handleResendEmail,
  } = useForgetPassword();

  if (isEmailSent) {
    return (
      <EmailSuccess
        email={email}
        handleBackToLogin={handleBackToLogin}
        handleResendEmail={handleResendEmail}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <Header />

        {/* Forgot Password Form */}
        <Form
          email={email}
          errors={errors}
          handleBackToLogin={handleBackToLogin}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
