import { Save } from "lucide-react";
import React, { useState } from "react";
import { AnyUser, ProfileData } from "../../../../../types";
import { BUSINESSCATEGORIES } from "@/constants/business";
// import { BASEURL } from "@/constants/url";

type Props = {
  formData: ProfileData;
  userType: string;
  errors: ProfileData;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleNestedChange: <
    Parent extends keyof ProfileData,
    Field extends keyof NonNullable<ProfileData[Parent]>
  >(
    parent: Parent,
    field: Field,
    value: NonNullable<ProfileData[Parent]>[Field]
  ) => void;
  handleCancel: () => void;
  loading: boolean;
};

export default function EditProfile({
  errors,
  formData,
  userType,
  handleCancel,
  handleInputChange,
  handleNestedChange,
  handleSubmit,
  loading,
}: Props) {
  // Cancel edit mode
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData?.fullName || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors?.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors?.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors?.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors?.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors?.email && (
              <p className="mt-1 text-sm text-red-600">{errors?.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData?.phone || ""}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors?.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {errors?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors?.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData?.username || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              placeholder="Username"
            />
            {errors?.username && (
              <p className="mt-1 text-sm text-red-600">{errors?.username}</p>
            )}
          </div>
        </div>
      </div>

      {/* Customer-specific fields */}
      {userType === "customer" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <input
                type="text"
                name="deliveryAddress"
                value={formData?.deliveryAddress || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your delivery address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData?.gender || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData?.dateOfBirth || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.dateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors?.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">
                  {errors?.dateOfBirth}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Business-specific fields */}
      {userType === "business" && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Business Information
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData?.businessName || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.businessName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter business name"
                />
                {errors?.businessName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors?.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Category *
                </label>
                <select
                  name="businessCategory"
                  value={formData?.businessCategory || ""}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.businessCategory
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select category</option>
                  {BUSINESSCATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors?.businessCategory && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors?.businessCategory}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address *
              </label>
              <input
                type="text"
                name="businessAddress"
                value={formData?.businessAddress || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.businessAddress ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter business address"
              />
              {errors?.businessAddress && (
                <p className="mt-1 text-sm text-red-600">
                  {errors?.businessAddress}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Description
              </label>
              <textarea
                name="businessDescription"
                value={formData?.businessDescription || ""}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe your business"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData?.website || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors?.website ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="https://your-website.com"
              />
              {errors?.website && (
                <p className="mt-1 text-sm text-red-600">{errors?.website}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData?.priceRange?.min || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "priceRange",
                      "min",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.priceRange?.min
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="0"
                />
                {errors?.priceRange?.min && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors?.priceRange.min}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData?.priceRange?.max || ""}
                  onChange={(e) =>
                    handleNestedChange(
                      "priceRange",
                      "max",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.priceRange?.max
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="100"
                />
                {errors?.priceRange?.max && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors?.priceRange.max}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Time (days)
                </label>
                <input
                  type="number"
                  min="0"
                  name="deliveryTime"
                  value={formData?.deliveryTime || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
