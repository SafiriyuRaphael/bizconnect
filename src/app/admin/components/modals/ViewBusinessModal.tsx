import React, { useState } from "react";
import {
  X,
  Mail,
  Phone,
  User,
  Building2,
  MapPin,
  Globe,
  Clock,
  DollarSign,
  Star,
  Calendar,
  CheckCircle,
  FileText,
  Shield,
  Eye,
  ExternalLink,
  Award,
  TrendingUp,
} from "lucide-react";
import { AllBusinessProps, BusinessReviewsProps } from "../../../../../types";
import { getBusinessCategoryDetails } from "@/lib/business/getBusinessCategoryDetails";

export default function AdminBusinessModal({
  business,
  isOpen,
  onClose,
  onViewVerificationLog,
}: {
  business: AllBusinessProps | null;
  isOpen: boolean;
  onClose: () => void;
  onViewVerificationLog?: (businessId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "media">(
    "overview"
  );

  if (!isOpen || !business) return null;

  const formatDate = (date?: Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      fashion: "bg-pink-100 text-pink-800 border-pink-200",
      electronics: "bg-blue-100 text-blue-800 border-blue-200",
      beauty: "bg-purple-100 text-purple-800 border-purple-200",
      food: "bg-orange-100 text-orange-800 border-orange-200",
      home: "bg-green-100 text-green-800 border-green-200",
      health: "bg-red-100 text-red-800 border-red-200",
      automotive: "bg-gray-100 text-gray-800 border-gray-200",
      sports: "bg-yellow-100 text-yellow-800 border-yellow-200",
      books: "bg-indigo-100 text-indigo-800 border-indigo-200",
      art: "bg-teal-100 text-teal-800 border-teal-200",
      other: "bg-slate-100 text-slate-800 border-slate-200",
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const getAverageRating = (reviews: BusinessReviewsProps[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getVerificationStatus = () => {
    if (business.verifiedBusiness) {
      return {
        text: "Verified Business",
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }
    return {
      text: "Pending Verification",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  };

  const verificationStatus = getVerificationStatus();

  const TabButton = ({
    tab,
    label,
    isActive,
    onClick,
  }: {
    tab: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? "bg-blue-600 text-white shadow-md"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={business.logo}
                  alt={business.businessName}
                  className="h-16 w-16 rounded-full border-4 border-white/20 object-cover shadow-lg"
                />
                {business.verifiedBusiness && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{business.businessName}</h2>
                <p className="text-blue-100">@{business.username}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                      business.businessCategory
                    )}`}
                  >
                    {getBusinessCategoryDetails(business.businessCategory).name}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">
                      {getAverageRating(business.reviews)}
                    </span>
                    <span className="text-xs text-blue-200">
                      ({business.reviews?.length || 0})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {onViewVerificationLog && (
                <button
                  onClick={() => onViewVerificationLog(business._id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm border border-white/20"
                >
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Verification Log</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    business.verified ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">
                  Email {business.verified ? "Verified" : "Unverified"}
                </span>
              </div>
              <div
                className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${verificationStatus.bgColor} ${verificationStatus.borderColor}`}
              >
                <Shield className={`h-3 w-3 ${verificationStatus.color}`} />
                <span
                  className={`text-xs font-medium ${verificationStatus.color}`}
                >
                  {verificationStatus.text}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="h-3 w-3 text-purple-500" />
                <span className="text-sm text-gray-600 capitalize">
                  {business.userType} Account
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Member since</p>
              <p className="text-sm font-medium text-gray-700">
                {formatDate(business.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex space-x-2">
            <TabButton
              tab="overview"
              label="Overview"
              isActive={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            />
            <TabButton
              tab="reviews"
              label={`Reviews (${business.reviews?.length || 0})`}
              isActive={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
            />
            <TabButton
              tab="media"
              label={`Media (${business.displayPics?.length || 0})`}
              isActive={activeTab === "media"}
              onClick={() => setActiveTab("media")}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="p-6 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">
                        Price Range
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {formatPrice(business.priceRange.min)} -{" "}
                        {formatPrice(business.priceRange.max)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
                        Delivery
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        {business.deliveryTime}{" "}
                        {business.deliveryTime === 1 ? "day" : "days"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-yellow-600 font-medium uppercase tracking-wide">
                        Rating
                      </p>
                      <p className="text-lg font-bold text-yellow-900">
                        {getAverageRating(business.reviews)}/5.0
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">
                        Reviews
                      </p>
                      <p className="text-lg font-bold text-purple-900">
                        {business.reviews?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Business Information */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building2 className="h-5 w-5 text-gray-500 mr-2" />
                      Business Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <User className="h-4 w-4 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Owner</p>
                          <p className="font-medium text-gray-900">
                            {business.fullName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-900">
                            {business.businessAddress}
                          </p>
                        </div>
                      </div>

                      {business.businessDescription && (
                        <div className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-gray-400 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="font-medium text-gray-900 leading-relaxed">
                              {business.businessDescription}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Account Timeline */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                      Account Timeline
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Account Created
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(business.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">
                          Last Updated
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(business.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-2" />
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900">
                            {business.email}
                          </p>
                        </div>
                        {business.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="font-medium text-gray-900">
                            {business.phone}
                          </p>
                        </div>
                      </div>

                      {business.website && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Globe className="h-4 w-4 text-gray-500" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Website</p>
                            <div className="flex items-center space-x-2">
                              <a
                                href={business.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800 truncate"
                              >
                                {business.website}
                              </a>
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="p-6">
              {business.reviews && business.reviews.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Customer Reviews
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-bold">
                        {getAverageRating(business.reviews)}
                      </span>
                      <span className="text-gray-500">
                        ({business.reviews.length} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {business.reviews.map((review, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-700">
                              {review.rating}/5
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Reviews Yet
                  </h3>
                  <p className="text-gray-500">
                    This business hasn't received any reviews yet.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "media" && (
            <div className="p-6">
              {business.displayPics && business.displayPics.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Business Gallery
                    </h3>
                    <span className="text-sm text-gray-500">
                      {business.displayPics.length} images
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {business.displayPics.map((pic, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={pic.url}
                          alt={`Business image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-12 w-12 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Images
                  </h3>
                  <p className="text-gray-500">
                    This business hasn't uploaded any display pictures yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Business ID: {business._id}</span>
            <span>•</span>
            <span>Last activity: {formatDate(business.updatedAt)}</span>
          </div>
          <div className="flex space-x-3">
            {onViewVerificationLog && (
              <button
                onClick={() => onViewVerificationLog(business._id)}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>View Verification Log</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
