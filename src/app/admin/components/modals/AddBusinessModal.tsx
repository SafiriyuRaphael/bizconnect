import React, { useEffect, useState } from "react";
import { X, Upload, Eye, EyeOff } from "lucide-react";
import useRegister from "@/app/auth/register/hook/useRegister";
import { BUSINESSCATEGORIES } from "@/shared/constants/business";

export default function AddBusinessModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formData,
    errors,
    handleInputChange,
    handleLogoUpload,
    handleSubmit,
    isSubmitting,
    handleNestedChange,
    logoFile,
    setUserType,
  } = useRegister();

  useEffect(() => {
    if (isOpen && formData.userType !== "business") {
      setUserType("business");
    }
  }, [isOpen, formData.userType, setUserType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-scroll flex flex-col">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to to-blue-800 text-white">
            <h2 className="text-3xl font-bold text-white">Add New Business</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  User Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter phone number"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Upload
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="logo"
                      onChange={handleLogoUpload}
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {logoFile ? "Change Logo" : "Upload Logo"}
                    </label>
                  </div>
                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-1">{errors.logo}</p>
                  )}
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Business Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.businessName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter business name"
                  />
                  {errors.businessName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category *
                  </label>
                  <select
                    name="businessCategory"
                    value={formData.businessCategory}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.businessCategory
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">Select a category</option>
                    {BUSINESSCATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.businessCategory && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessCategory}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Address *
                  </label>
                  <textarea
                    name="businessAddress"
                    value={formData.businessAddress}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.businessAddress
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter business address"
                  />
                  {errors.businessAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.businessAddress}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description
                  </label>
                  <textarea
                    name="businessDescription"
                    value={formData.businessDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter business description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.website ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.website && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Price Range and Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  name="priceRange.min"
                  value={formData?.priceRange?.min || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "priceRange",
                      "min",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  name="priceRange.max"
                  value={formData?.priceRange?.max || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "priceRange",
                      "max",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
                {errors.priceRange && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priceRange}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time (days)
                </label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Verified Business */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="verifiedBusiness"
                  checked={formData.verifiedBusiness}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Add as verified business
                </span>
              </label>
              {errors.verifiedBusiness && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreedToTerms}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleInputChange}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the terms and conditions
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agreedToTerms}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Business"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
