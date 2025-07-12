import React, { useState } from "react";
import SectionHeader from "./SectionHeader";
import InfoCard from "./InfoCard";
import {
  Building2,
  Calendar,
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
import RatingDisplay from "./RatingDisplay";
import VerificationBadge from "./VerificationBadge";
import { AnyUser } from "../../../../../types";

type Props = {
  profile: AnyUser;
  userType: string;
};

export default function ProfileDisplay({ profile, userType }: Props) {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    personal: true,
    business: true,
    account: true,
  });

  const averageRating = profile.reviews?.length
    ? (
        profile.reviews.reduce((sum, review) => sum + review.rating, 0) /
        profile.reviews.length
      ).toFixed(1)
    : "0.0";
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 ">
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SectionHeader
            title="Basic Information"
            icon={User}
            section="basic"
            badge="Essential"
            setExpandedSections={setExpandedSections}
            expandedSections={expandedSections}
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
        {userType === "customer" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHeader
              title="Personal Information"
              icon={User}
              section="personal"
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
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
        {userType === "business" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHeader
              title="Business Information"
              icon={Building2}
              section="business"
              badge="Professional"
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
            />

            {expandedSections.business && (
              <div className="mt-6 space-y-6 animate-fadeIn">
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
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
          />

          {expandedSections.account && (
            <div className="mt-6 space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex items-center justify-center">
                  <VerificationBadge verified={profile.verified} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
