"use client";
import ProfileImage from "@/app/components/layout/ProfileImage";
import { useEditProfileStore } from "@/store/useEditProfileStore";
import { Edit3, Shield, Star } from "lucide-react";

export default function ProfileHeader() {
  const {
    profile,
    editMode,
    uploading,
    setEditMode,
    handleLogoUpload,
    errors,
  } = useEditProfileStore();
  if (!profile) return;
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl mb-8">
      <div className="flex items-center space-x-6 space-y-2">
        <ProfileImage
          user={profile}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center"
          logo={profile?.logo}
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{profile.fullName}</h1>
          <p className="text-indigo-100 text-lg">@{profile.username}</p>
          <div className="flex items-center space-x-4 mt-2">
            {profile.verified && (
              <div className="flex items-center space-x-1 text-green-200">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Verified</span>
              </div>
            )}
            {profile.verifiedBusiness && (
              <div className="flex items-center space-x-1 text-yellow-200">
                <Star className="w-4 h-4" />
                <span className="text-sm">Verified Business</span>
              </div>
            )}
          </div>
        </div>
        <button
          className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
          onClick={() => setEditMode(!editMode)}
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
  );
}
