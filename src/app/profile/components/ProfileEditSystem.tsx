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
import useEditProfile from "@/hook/useEditProfile";

export default function ProfileComponent({ user }: { user: AnyUser }) {
  const {
    activeModal,
    closeModal,
    handleChangePassword,
    message,
    modalType,
    autoClose,
    title,
    actions,
    handleDeleteModal,
    fallbackAlt,
    fallbackSrc,
    profile,
    editMode,
    setEditMode,
    uploading,
    errors,
    formData,
    openModal,
    handleDeletePassword,
    handleLogoUpload,
    setFormData,
    setIsModalType,
    handleSubmit,
    handleInputChange,
    handleNestedChange,
    handleCancel,
    loading,
  } = useEditProfile(user);

  if (!profile) return;

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
                handleCancel={handleCancel}
                handleInputChange={handleInputChange}
                handleNestedChange={handleNestedChange}
                handleSubmit={handleSubmit}
                loading={loading}
                errors={errors}
                formData={formData}
                userType={profile.userType}
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
