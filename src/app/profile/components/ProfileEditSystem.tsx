"use client";
import React, { useState, useEffect } from "react";
import { Edit3, Star, Shield } from "lucide-react";
import { AnyUser, ProfileData } from "../../../../types";
import ProfileDisplay from "./display-profile";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import EditProfile from "./edit-profile";
import ProfileImage from "@/app/components/layout/ProfileImage";
import MessageModal from "@/app/components/ui/MessageModal";
import ChangePasswordModal from "@/app/components/modals/ChangePassword";
import InputPasswordModal from "@/app/components/modals/InputPassword";
import { signOut } from "next-auth/react";

export default function ProfileComponent({ user }: { user: AnyUser }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({});
  const [modalType, setIsModalType] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<ProfileData>({});
  const [autoClose, setAutoClose] = useState(true);
  const [actions, setActions] = useState<React.JSX.Element | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const openModal = (type: string) => setActiveModal(type);

  const closeModal = () => setActiveModal(null);

  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(user);

  // Initialize form data when entering edit mode

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      console.log(profile);

      const logo_url = await uploadCloudinary(file);

      if (logo_url) {
        // hit your API to save the new logo
        const res = await fetch("/api/profile/updates", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: profile._id,
            updates: { logo: logo_url.imageUrl },
          }),
        });

        const data: { user: AnyUser; status: string } = await res.json();

        if (data?.user) {
          setProfile(data.user);
        } else {
          setErrors({ logo: "failed to upload picture" });
        }
      }
    } catch (err) {
      setErrors({ logo: "failed to upload picture" });
    } finally {
      setUploading(false);
    }
  };

  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const actionButtons = (
    <>
      <button
        onClick={closeModal}
        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={() => openModal("inputPassword")}
        className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
      >
        Confirm
      </button>
    </>
  );

  const handleDeleteModal = () => {
    setAutoClose(false);
    setTitle("Confirm Delete");
    setIsModalType("warning");
    setMessage(
      "Are you sure you want to delete this item? This action cannot be undone."
    );
    setActions(actionButtons);
    openModal("message");
  };

  const handleDeletePassword = async ({ password }: { password: string }) => {
    const res = await fetch(`/api/profile/delete`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete failed");
    }

    signOut({ callbackUrl: "/auth/login" });
  };

  const handleChangePassword = async ({
    currentPassword,
    newPassword,
  }: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const res = await fetch(`/api/profile/change-password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Delete failed");
    }

    setTimeout(() => {
      setActions(null);
      setAutoClose(true);
      setTitle("Password Changed");
      setIsModalType("success");
      setMessage("Password Changed Successfully");
      openModal("message");
    }, 500);
  };


  const fallbackAlt = profile?.businessName || profile?.fullName || "User";
  const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 pt-20">
      <ChangePasswordModal
        isOpen={activeModal === "changePassword"}
        onClose={closeModal}
        onSubmit={handleChangePassword}
      />

      <MessageModal
        isOpen={activeModal === "message"}
        onClose={closeModal}
        message={message}
        type={modalType}
        autoClose={autoClose}
        autoCloseDelay={5000}
        showIcon
        title={title}
        actions={actions}
      />

      <InputPasswordModal
        isOpen={activeModal === "inputPassword"}
        onClose={closeModal}
        onSubmit={handleDeletePassword}
        blurIntensity="medium"
        showGlow={false}
        variant="warning"
        size="md"
        showPattern={false}
      />
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
                <ProfileImage
                  fallbackAlt={fallbackAlt}
                  fallbackSrc={fallbackSrc}
                  logo={profile?.logo}
                />
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
                    {profile.userType === "business" &&
                      profile.verifiedBusiness && (
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
                userType={profile.userType}
                openModal={openModal}
                setIsModalType={setIsModalType}
                setAutoClose={setAutoClose}
                setActions={setActions}
                setProfile={setProfile}
              />
            ) : (
              // Display Mode
              <ProfileDisplay profile={profile} userType={profile.userType} />
            )}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => openModal("changePassword")}
            >
              Change Password
            </button>
            <button
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Log Out
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              Download Data
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={handleDeleteModal}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
