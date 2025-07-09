"use client";
import React, { useState, useEffect } from "react";
import { Edit3, Star, Shield } from "lucide-react";
import { AnyUser, ProfileData } from "../../../../types";
import ProfileDisplay from "./display-profile";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import EditProfile from "./edit-profile";

export default function ProfileComponent({ user }: { user: AnyUser }) {
  const [userType, setUserType] = useState("customer");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({});

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ProfileData>({});

  const [uploading, setUploading] = useState(false);

  console.log(`this is user: ${JSON.stringify(user, null, 2)}`);
  const profile = user;

  useEffect(() => {
    setUserType(profile.userType);
    setEditMode(false);
    setFormData({});
    setErrors({});
    setMessage("");
  }, [profile.userType]);

  // Initialize form data when entering edit mode

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    {
      message;
    }

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          logo: "File size must be less than 5MB",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, logo: "Please upload an image file" }));
        return;
      }
      setErrors((prev) => ({ ...prev, logo: "" }));
    }

    try {
      setUploading(true);

      const logo_url = await uploadCloudinary(file);

      if (logo_url) {
        // hit your API to save the new logo
        await fetch("/api/profile/updates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: profile.username,
            updates: { logo: logo_url },
          }),
        });

        // optionally reload the page or update state
        window.location.reload(); // or useRouter().refresh() if on App Router
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const fallbackAlt = profile.businessName || profile.fullName || "User";
  const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Management
          </h1>
          <p className="text-gray-600">
            Manage your BizConnect profile information
          </p>
        </div>
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {profile.logo ? (
                  <CldImage
                    alt={fallbackAlt}
                    src={profile.logo}
                    width={40}
                    height={40}
                    className="rounded-full hover:scale-110 transition-transform duration-300"
                    crop={{
                      type: "thumb",
                      source: true,
                    }}
                  />
                ) : (
                  <Image
                    src={fallbackSrc}
                    alt={fallbackAlt}
                    width={40}
                    height={40}
                    className="rounded-full hover:scale-110 transition-transform duration-300"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                  <p className="text-blue-100">@{profile.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {profile.verified && (
                      <div className="flex items-center space-x-1 text-green-200">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                    {userType === "business" && profile.verifiedBusiness && (
                      <div className="flex items-center space-x-1 text-yellow-200">
                        <Star className="w-4 h-4" />
                        <span className="text-sm">Verified Business</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>{editMode ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>
            <div className="flex flex-col items-start">
              <label
                htmlFor="logo-upload"
                className="text-xs underline cursor-pointer hover:text-blue-300"
              >
                {uploading ? "Uploading..." : "Change Picture"}
              </label>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
            {errors?.logo && (
              <p className="mt-1 text-sm text-red-600">{errors?.logo}</p>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {editMode ? (
              // Edit Form
              <EditProfile
                errors={errors}
                formData={formData}
                setEditMode={setEditMode}
                setErrors={setErrors}
                setFormData={setFormData}
                setMessage={setMessage}
                user={user}
                userType={userType}
              />
            ) : (
              // Display Mode
              <ProfileDisplay profile={profile} userType={userType} />
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Change Password
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
              Download Data
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Privacy Settings
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
