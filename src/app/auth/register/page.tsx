"use client";
import React from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ArrowRight,
} from "lucide-react";
import useRegister from "@/hook/useRegister";

// Import the components (adjust paths as needed)
import { InputField } from "@/app/components/ui/InputField";
import { PasswordField } from "@/app/components/ui/PasswordField";
import { TextAreaField } from "@/app/components/ui/TextAreaField";
import { SelectField } from "@/app/components/ui/SelectField";
import { FileUploadField } from "@/app/components/ui/FileUploadField";
import { CheckboxField } from "@/app/components/ui/CheckBoxField";
import { FormSection } from "@/app/components/ui/FormSection";
import Facebook from "../../../../public/icons/Facebook";
import Google from "../../../../public/icons/Google";
import MessageModal from "@/app/components/ui/MessageModal";

export default function BizconnectRegister() {
  const {
    setUserType,
    userType,
    handleSubmit,
    formData,
    handleInputChange,
    handleLogoUpload,
    logoFile,
    errors,
    businessCategories,
    router,
    modalMessage,
    isModalOpen,
    onClose,
    isSubmitting,
    modalType
  } = useRegister();

  // Transform business categories for SelectField
  const categoryOptions = businessCategories.map((category) => ({
    value: category.value,
    label: category.category,
  }));

  // Gender options
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      <MessageModal
        isOpen={isModalOpen}
        onClose={onClose}
        message={modalMessage}
        type={modalType}
        autoClose
        autoCloseDelay={4000}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Join Bizconnect
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Your reliable, central platform for seamless business connections.
            Choose your account type to get started.
          </p>
        </div>

        {/* User Type Toggle */}
        <div className="max-w-md mx-auto mb-8">
          <div className="bg-white p-2 rounded-xl shadow-sm border">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUserType("customer")}
                className={`px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
                  userType === "customer"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Customer
              </button>
              <button
                type="button"
                onClick={() => setUserType("business")}
                className={`px-4 py-3 cursor-pointer rounded-lg font-medium transition-all duration-300 ${
                  userType === "business"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Business
              </button>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white">
                {userType === "business"
                  ? "Create Business Account"
                  : "Register as Customer"}
              </h2>
              <p className="text-blue-100 mt-1">
                {userType === "business"
                  ? "Set up your online storefront and start selling"
                  : "Join thousands of satisfied customers"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Personal Information */}
              <FormSection title="Personal Information">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  error={errors.fullName}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    icon={Mail}
                    error={errors.email}
                    required
                  />

                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 xxx xxx xxxx"
                    icon={Phone}
                    error={errors.phone}
                    required
                  />
                </div>
              </FormSection>

              {/* Business Information (only for business users) */}
              {userType === "business" && (
                <FormSection title="Business Information">
                  <InputField
                    label="Business Name"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your Business Name"
                    icon={Building2}
                    error={errors.businessName}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Business Category"
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleInputChange}
                      options={categoryOptions}
                      placeholder="Select category"
                      tooltip="Choose the category that best describes your business"
                      error={errors.businessCategory}
                      required
                    />

                    <FileUploadField
                      label="Business Logo"
                      name="logo"
                      onChange={handleLogoUpload}
                      accept="image/*"
                      fileName={logoFile?.name}
                      error={errors.logo}
                    />
                  </div>

                  <TextAreaField
                    label="Business Address"
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your complete business address"
                    icon={MapPin}
                    error={errors.businessAddress}
                    required
                    rows={3}
                  />

                  <TextAreaField
                    label="Business Description"
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    placeholder="Briefly describe your business, products, or services..."
                    rows={4}
                  />

                  <InputField
                    label="Website/Social Media"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://yourwebsite.com or social media links"
                    icon={Globe}
                  />
                </FormSection>
              )}

              {/* Customer Specific Fields */}
              {userType === "customer" && (
                <FormSection title="Additional Information">
                  <TextAreaField
                    label="Delivery Address (Optional)"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address for faster checkout"
                    icon={MapPin}
                    rows={2}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                      label="Gender (Optional)"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      options={genderOptions}
                      placeholder="Select gender"
                    />

                    <InputField
                      label="Date of Birth (Optional)"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>
                </FormSection>
              )}

              {/* Account Setup */}
              <FormSection title="Account Setup">
                <InputField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a unique username"
                  icon={User}
                  error={errors.username}
                  tooltip="This will be your unique identifier on Bizconnect"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    error={errors.password}
                    required
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              </FormSection>

              {/* Terms and Conditions */}
              <CheckboxField
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleInputChange}
                error={errors.agreedToTerms}
              >
                I agree to the{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                  onClick={() => router.push("/terms-and-condition")}
                >
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                  onClick={() => router.push("/privacy-policy")}
                >
                  Privacy Policy
                </button>{" "}
                of Bizconnect
              </CheckboxField>

              {/* Submit Button */}
              <div className="space-y-4">
                <button
                  type="submit"
                  className={`
    w-full 
    bg-gradient-to-r 
    text-white 
    font-semibold 
    py-4 px-6 
    rounded-lg 
    focus:ring-4 
    focus:ring-blue-200 
    transition-all 
    duration-300 
    flex 
    items-center 
    justify-center 
    gap-2 
    group
    ${
      isSubmitting
        ? "from-gray-400 to-gray-500 cursor-not-allowed opacity-75"
        : "from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
    }
  `}
                  disabled={isSubmitting}
                >
                  {userType === "business"
                    ? "Create Business Account"
                    : "Register as Customer"}
                  <ArrowRight
                    className={`w-5 h-5 transition-transform ${
                      isSubmitting ? "" : "group-hover:translate-x-1"
                    }`}
                  />
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-blue-600 hover:underline font-medium cursor-pointer"
                      onClick={() => router.push("/auth/login")}
                      disabled={isSubmitting}
                    >
                      Login here
                    </button>
                  </p>
                </div>

                {/* Social Sign-up for Customers */}
                {userType === "customer" && (
                  <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Facebook />
                        Facebook
                      </button>
                      <button
                        type="button"
                        className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Google />
                        Google
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2025 Bizconnect. All rights reserved.</p>
          <p className="mt-1">
            Simplifying transactions, fostering connections.
          </p>
        </div>
      </div>
    </div>
  );
}
