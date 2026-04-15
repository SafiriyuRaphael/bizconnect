import React from "react";
import {
  User,
  ArrowRight,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { CheckboxField } from "@/shared/components/ui/CheckBoxField";
import { PasswordField } from "@/shared/components/ui/PasswordField";
import { InputField } from "@/shared/components/ui/InputField";
import { FormSection } from "@/shared/components/ui/FormSection";
import { SelectField } from "@/shared/components/ui/SelectField";
import { TextAreaField } from "@/shared/components/ui/TextAreaField";
import { FileUploadField } from "@/shared/components/ui/FileUploadField";
import { BUSINESSCATEGORIES } from "@/shared/constants/business";
import { RegisterData } from "../../../../../../types";

export default function Form({
  handleSubmit,
  formData,
  handleInputChange,
  userType,
  handleLogoUpload,
  logoFile,
  errors,
  router,
  isSubmitting,
}: {
  handleSubmit: (e: React.FormEvent) => void;
  formData: RegisterData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  userType: "customer" | "business";
  handleLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  logoFile?: File | null;
  errors: Record<string, string>;
  router: { push: (path: string) => void };
  isSubmitting: boolean;
}) {
  const categoryOptions = BUSINESSCATEGORIES.map((category) => ({
    value: category.value,
    label: category.name,
  }));

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  return (
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
          </div>
        </form>
      </div>
    </div>
  );
}
