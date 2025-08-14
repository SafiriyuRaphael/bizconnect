import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff, User, Building2 } from "lucide-react";
import { BUSINESSCATEGORIES } from "@/constants/business";
import { AnyUser } from "../../../../../types";
import useEditProfile from "@/hook/useEditProfile";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: AnyUser;
}

export default function EditUserModal({
  isOpen,
  onClose,
  userData,
}: EditUserModalProps) {
  const {
    formData,
    handleInputChange,
    errors,
    handleSubmit,
    loading: isSubmitting,
    handleNestedChange,
    setFormData,
  } = useEditProfile(userData);
  const [selectedUserType, setSelectedUserType] = useState<
    "customer" | "business"
  >("customer");

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData(userData);
      setSelectedUserType(userData?.userType);
    }
  }, [userData, selectedUserType]);

  if (!isOpen) return null;

  const isBusiness = selectedUserType === "business";

  return (
    <div className="fixed inset-0 backdrop-blur-sm  bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <div>
            <h2 className="text-3xl font-bold">
              {"Edit"} {isBusiness ? "Business" : "Customer"}
            </h2>
            <p className="text-sm opacity-90 mt-1">
              {`Editing: ${
                isBusiness
                  ? (formData as AnyUser).businessName || formData.fullName
                  : formData.fullName
              }`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form className="p-6" onSubmit={handleSubmit}>
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
                  value={formData.fullName || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500                 } ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500                 } ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500                 } ${
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
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500                 } ${
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
                  {"New Password (leave blank to keep current)"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password || ""}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${
                      isBusiness
                        ? "focus:ring-blue-500"
                        : "focus:ring-green-500"
                    } ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter new password (optional)"
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
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}

                <p className="text-gray-500 text-xs mt-1">
                  Only enter a password if you want to change it
                </p>
              </div>
            </div>

            {/* Conditional Second Column */}
            <div className="space-y-4">
              {isBusiness ? (
                <>
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
                      value={(formData as AnyUser).businessName || ""}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.businessName
                          ? "border-red-500"
                          : "border-gray-300"
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
                      value={(formData as AnyUser).businessCategory || ""}
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
                      value={(formData as AnyUser).businessAddress || ""}
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
                      value={(formData as AnyUser).businessDescription || ""}
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
                      value={(formData as AnyUser).website || ""}
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
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                    Customer Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Address
                    </label>
                    <textarea
                      name="deliveryAddress"
                      value={(formData as AnyUser).deliveryAddress || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter delivery address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={(formData as AnyUser).gender || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={(formData as AnyUser).dateOfBirth || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Business Price Range and Delivery Time */}
          {isBusiness && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={(formData as AnyUser).priceRange?.min || ""}
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
                {errors.priceRange?.min && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priceRange?.min}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={(formData as AnyUser).priceRange?.max || ""}
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
                {errors.priceRange?.max && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priceRange?.max}
                  </p>
                )}
                {errors.priceRange && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priceRange.max || errors.priceRange.max}
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
                  value={(formData as AnyUser).deliveryTime || ""}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          )}

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
              className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500
               ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting
                ? "Saving..."
                : `${"Update"} ${isBusiness ? "Business" : "Customer"}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
