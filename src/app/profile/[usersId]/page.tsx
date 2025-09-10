"use client";
import React, { useState } from "react";
import VerificationBadge from "../components/display-profile/VerificationBadge";
import { useEditProfileStore } from "@/shared/store/useEditProfileStore";
import {
  Building2,
  Calendar,
  Camera,
  Clock,
  DollarSign,
  Globe,
  Mail,
  MapPin,
  Phone,
  Shield,
  TrendingUp,
  User,
} from "lucide-react";
import SectionHeader from "../components/display-profile/SectionHeader";
import { BusinessDisplayPicsProps } from "../../../../types";
import InfoCard from "../components/display-profile/InfoCard";
import DisplayPictureSection from "../components/display-profile/DisplayPictureSection";
import RatingDisplay from "../components/display-profile/RatingDisplay";

export default function page() {
  const {
    profile,
    setBusinessPictures,
    businessPictures,
    expandedSections,
    editMode,
  } = useEditProfileStore();

  const handleUpdatePictures = (pictures: BusinessDisplayPicsProps[]) => {
    setBusinessPictures(pictures);
  };

  if (!profile || editMode) return null;

  const averageRating = profile.reviews?.length
    ? (
        profile.reviews.reduce(
          (sum: any, review: any) => sum + review.rating,
          0
        ) / profile.reviews.length
      ).toFixed(1)
    : "0.0";
  return (
    <div className="max-w-6xl mx-auto  bg-gray-50 ">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SectionHeader
            title="Basic Information"
            icon={User}
            section="basic"
            badge="Essential"
          />

          {expandedSections.basic && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <InfoCard
                icon={Mail}
                label="Email Address"
                value={profile.email}
              />
              <InfoCard
                icon={Phone}
                label="Phone Number"
                value={profile.phone}
              />
            </div>
          )}
        </div>

        {/* Customer-specific information */}
        {profile.userType === "customer" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHeader
              title="Personal Information"
              icon={User}
              section="personal"
            />

            {expandedSections.personal && (
              <div className="mt-6 space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.deliveryAddress && (
                    <InfoCard
                      icon={MapPin}
                      label="Delivery Address"
                      value={profile.deliveryAddress}
                    />
                  )}
                  {profile.gender && (
                    <InfoCard
                      icon={User}
                      label="Gender"
                      value={profile.gender}
                      className="capitalize"
                    />
                  )}
                </div>
                {profile.dateOfBirth && (
                  <InfoCard
                    icon={Calendar}
                    label="Date of Birth"
                    value={new Date(profile.dateOfBirth).toLocaleDateString()}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Business-specific information */}
        {profile.userType === "business" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHeader
              title="Business Information"
              icon={Building2}
              section="business"
              badge="Professional"
            />

            {expandedSections.business && (
              <div className="mt-6 space-y-6 animate-fadeIn">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Business Display Pictures
                  </h4>
                  <DisplayPictureSection
                    pictures={businessPictures}
                    onUpdatePictures={handleUpdatePictures}
                    businessId={profile._id}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    icon={Building2}
                    label="Business Name"
                    value={profile.businessName}
                  />
                  <InfoCard
                    icon={TrendingUp}
                    label="Category"
                    value={profile.businessCategory}
                    className="capitalize"
                  />
                </div>

                <InfoCard
                  icon={MapPin}
                  label="Business Address"
                  value={profile.businessAddress}
                />

                {profile.businessDescription && (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      Business Description
                    </p>
                    <p className="text-gray-900 leading-relaxed">
                      {profile.businessDescription}
                    </p>
                  </div>
                )}

                {profile.website && (
                  <InfoCard
                    icon={Globe}
                    label="Website"
                    value={profile.website}
                    isLink={true}
                    href={profile.website}
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  <InfoCard
                    icon={DollarSign}
                    label="Price Range"
                    value={`₦${profile.priceRange?.min} - ₦${profile.priceRange?.max}`}
                  />
                  <InfoCard
                    icon={Clock}
                    label="Delivery Time"
                    value={`${profile.deliveryTime} days`}
                  />
                  <div className="md:col-span-2 xl:col-span-1">
                    <RatingDisplay
                      averageRating={averageRating}
                      profile={profile}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SectionHeader
            title="Account Information"
            icon={Shield}
            section="account"
          />

          {expandedSections.account && (
            <div className="mt-6 space-y-6 animate-fadeIn">
              {/* Member Since - Always full width */}
              <div className="w-full">
                <InfoCard
                  icon={Calendar}
                  label="Member Since"
                  value={
                    profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"
                  }
                />
              </div>

              {/* Verification Badge - Separate section for business users */}
              {profile.userType === "business" && (
                <div className="w-full">
                  <VerificationBadge
                    verified={profile.verifiedBusiness}
                    userId={profile._id}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
