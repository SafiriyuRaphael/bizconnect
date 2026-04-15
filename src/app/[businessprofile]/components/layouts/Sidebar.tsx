import {
  Calendar,
  CheckCircle,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  Globe,
  Mail,
  MapIcon,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  PhoneCall,
  Share2,
  Shield,
  ShoppingBag,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";
import RenderStars from "../composites/RenderStars";
import useUserDashboardActions from "../../hooks";
import { useUserDashboardStore } from "../../store";
import handleDirection from "../../utils/handleDirection";
import formatDate from "@/lib/static/formatDate";
import handleShare from "../../utils/handleShare";
import getRatingColor from "@/shared/utils/getRatingColor";
import { useTailwindBreakpoints } from "@/shared/hooks/useWindowScreenSize";
import useProductsApi from "@/app/profile/[usersId]/products/hooks/useProductsApi";
import { useSocketStore } from "@/shared/store/useSocketStore";

export default function Sidebar() {
  const { handleChatClick, handleCopy } = useUserDashboardActions();
  const { comments, copied, user, averageRating } = useUserDashboardStore();
  const { isMd } = useTailwindBreakpoints();
  const { fetchedItems } = useProductsApi();
  const { startCall } = useSocketStore();

  if (!user) return null;
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="space-y-3">
          <button
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            onClick={() => handleChatClick(user)}
          >
            <MessageSquare className="w-5 h-5" />
            <span>Send Message</span>
          </button>
          {user.userType === "business" && (
            <>
              <button
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                onClick={() => startCall("audio", user._id)}
              >
                <PhoneCall className="w-5 h-5" />
                <span>Call Business</span>
              </button>
              <button
                className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                onClick={() =>
                  handleDirection(user.businessAddress || user.deliveryAddress)
                }
              >
                <MapIcon className="w-5 h-5" />
                <span>Get Directions</span>
              </button>
            </>
          )}
          {isMd ? (
            <button
              className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              onClick={() => handleShare(user)}
            >
              <Share2 className="w-5 h-5" />
              <span>Share Profile</span>
            </button>
          ) : (
            <button
              className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              onClick={() => handleCopy(user.username)}
            >
              {!copied ? (
                <Clipboard className="w-5 h-5" />
              ) : (
                <ClipboardCheck className="w-5 h-5" />
              )}
              <span>
                {!copied ? "Copy Profile Link" : "Profile Link Copied"}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Items Quick Stats - Only for businesses with items */}
      {user.userType === "business" && fetchedItems?.stats?.totalItems && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Items Overview
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Package className="w-4 h-4 mr-2 text-blue-500" />
                Total Items
              </span>
              <span className="font-semibold text-gray-900">
                {fetchedItems?.stats.totalItems}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Available
              </span>
              <span className="font-semibold text-green-600">
                {fetchedItems?.stats.activeItems}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <ShoppingBag className="w-4 h-4 mr-2 text-purple-500" />
                Products
              </span>
              <span className="font-semibold text-gray-900">
                {fetchedItems?.stats.totalProducts}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2 text-orange-500" />
                Services
              </span>
              <span className="font-semibold text-gray-900">
                {fetchedItems.stats.totalServices}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-500" />
                With Escrow
              </span>
              <span className="font-semibold text-gray-900">
                {fetchedItems?.stats.escrowEnabled}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {user.userType === "business" ? "Business Stats" : "Profile Stats"}
        </h3>
        <div className="space-y-4">
          {user.userType === "business" && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Total Reviews
                </span>
                <span className="font-semibold text-gray-900">
                  {comments.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                  Average Rating
                </span>
                <span
                  className={`font-semibold ${getRatingColor(averageRating)}`}
                >
                  {averageRating.toFixed(1)}/5
                </span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-blue-500" />
              Member Since
            </span>
            <span className="font-semibold text-gray-900">
              {formatDate(user.createdAt, true)}
            </span>
          </div>
          {user.userType === "business" && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2 text-purple-500" />
                Category
              </span>
              <span className="font-semibold text-gray-900 capitalize">
                {user.businessCategory}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rating Breakdown - Only for businesses */}
      {user.userType === "business" && comments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rating Breakdown
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = comments.filter((c) => c.rating === stars).length;
              const percentage =
                comments.length > 0 ? (count / comments.length) * 100 : 0;

              return (
                <div key={stars} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 w-12">
                    <span className="text-sm font-medium text-gray-600">
                      {stars}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-8 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Rating Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                <RenderStars rating={averageRating} size="w-5 h-5" />
              </div>
              <div className="text-sm text-gray-600">
                Based on {comments.length} review
                {comments.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info - Only for businesses */}
      {user.userType === "business" && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Address</p>
                <p className="text-sm text-gray-600">{user.businessAddress}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <a
                  href={`tel:${user.phone}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {user.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <a
                  href={`mailto:${user.email}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {user.email}
                </a>
              </div>
            </div>
            {user.website && (
              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center"
                  >
                    Visit Website
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
