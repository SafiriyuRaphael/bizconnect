import generateDefaultLogoDataUrl from "@/shared/utils/generateDefaultLogoDataUrl";
import {
  Building,
  Calendar,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Flag,
  Globe,
  Heart,
  ImageIcon,
  Mail,
  MapPin,
  Package,
  Phone,
  Send,
  StarIcon,
} from "lucide-react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import React from "react";
import RenderRatingInput from "../composites/RenderRatingInput";
import Loader from "@/shared/components/ui/Loader";
import { useUserDashboardStore } from "../../store";
import { SessionUser } from "../../../../../types";
import formatDate from "@/lib/static/formatDate";
import RenderStars from "../composites/RenderStars";
import useUserDashboardActions from "../../hooks";
import ProductGrid from "@/app/[businessprofile]/components/composites/ProductsItem";
import useProductsApi from "@/app/profile/[usersId]/products/hooks/useProductsApi";

type Props = {
  session: SessionUser;
};

export default function Main({ session }: Props) {
  const {
    comments,
    isEditable,
    openFullGallery,
    setOpenFullGallery,
    newComment,
    setNewComment,
    setIsEditable,
    user,
  } = useUserDashboardStore();

  const {
    openImageModal,
    submitReview,
    helpfulToggle,
    handleSubmitComment,
    handleToggleHelpFul,
    userReview
  } = useUserDashboardActions();

  const { fetchedItems, isFetchingItems } = useProductsApi();

  if (!user) return null;

  const canRate = session.id !== user._id;

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Business Items Section - Only for businesses */}
      {user.userType === "business" && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-600" />
              Products & Services
            </h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {fetchedItems?.stats.activeItems} Available
            </span>
          </div>

          {/* <Loader size="lg" text="Checking business items" variant="bars" /> */}

          {fetchedItems?.stats.totalItems === 0 && !isFetchingItems ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No items listed yet</p>
              <p className="text-gray-400 text-sm">
                This business hasn't added any products or services.
              </p>
            </div>
          ) : (
            <ProductGrid />
          )}
        </div>
      )}

      {/* Business Gallery */}
      {user.userType === "business" &&
        user.displayPics &&
        user.displayPics.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gallery</h2>
              {user.displayPics.length > 6 && (
                <button
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  onClick={() => setOpenFullGallery(!openFullGallery)}
                >
                  {!openFullGallery
                    ? `View all (${user.displayPics.length})`
                    : "View less"}
                </button>
              )}
            </div>
            {!openFullGallery ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.displayPics.slice(0, 6).map((image, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={image.url}
                      alt={`Business image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onClick={() => openImageModal(index)}
                    />
                    <div
                      className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center"
                      onClick={() => openImageModal(index)}
                    >
                      <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.displayPics.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={image.url}
                      alt={`Business image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onClick={() => openImageModal(index)}
                    />
                    <div
                      className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center"
                      onClick={() => openImageModal(index)}
                    >
                      <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* About Section */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
          About {user.userType === "business" ? "Business" : "User"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="text-sm sm:text-base">{user.email}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Phone className="w-5 h-5 text-green-600" />
            <span className="text-sm sm:text-base">{user.phone}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm sm:text-base">
              Joined {formatDate(user.createdAt, true)}
            </span>
          </div>
          {user.userType === "business" && (
            <div className="flex items-center space-x-3 text-gray-600">
              <MapPin className="w-5 h-5 text-red-600" />
              <span className="text-sm sm:text-base">
                {user.businessAddress}
              </span>
            </div>
          )}
          {user.userType === "business" && user.website && (
            <div className="flex items-center space-x-3 text-gray-600 sm:col-span-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <a
                href={user.website}
                className="text-blue-600 hover:underline text-sm sm:text-base flex items-center"
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          )}
        </div>
        {user.userType === "business" && user.businessDescription && (
          <div className="mt-6 pt-4 border-t">
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {user.businessDescription}
            </p>
          </div>
        )}
      </div>

      {/* Business Details */}
      {user.userType === "business" && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
            Business Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Building className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-gray-900">Category</span>
              </div>
              <p className="text-gray-700 capitalize text-sm sm:text-base">
                {user.businessCategory}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Price Range</span>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                ${user.priceRange?.min} - ${user.priceRange?.max}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-gray-900">Delivery</span>
              </div>
              <p className="text-gray-700 text-sm sm:text-base">
                {user.deliveryTime} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section - Only for businesses */}
      {user.userType === "business" && (
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">
            Reviews & Ratings
          </h2>

          {/* Review Form - Only if user can rate */}
          {canRate && (
            <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEditable ? "Write a Review" : "Your Review"}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <RenderRatingInput canRate={canRate} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Experience
                </label>
                {isEditable ? (
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience with this business..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                    rows={4}
                  />
                ) : (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-800 text-sm sm:text-base">
                      {newComment}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {isEditable ? (
                  <button
                    onClick={() => handleSubmitComment({ session, user })}
                    disabled={submitReview.isPending || !newComment.trim() || userReview.isPending}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {submitReview.isPending ? "Posting..." : "Post Review"}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditable(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Review</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-12">
                <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm">
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              comments.map((comment) => {
                const fallbackAlt = comment.fullName || "User";
                const fallbackSrc = generateDefaultLogoDataUrl(fallbackAlt);
                return (
                  <div
                    key={comment.userId}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start space-x-4">
                      {comment.displayPic ? (
                        <CldImage
                          alt={fallbackAlt}
                          src={comment.displayPic}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                          crop={{
                            type: "thumb",
                            source: true,
                          }}
                          priority={true}
                        />
                      ) : (
                        <Image
                          src={fallbackSrc}
                          alt={fallbackAlt}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                          priority={true}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                              {comment.username}
                            </span>
                            <div className="flex items-center space-x-1">
                              <RenderStars rating={comment.rating} />
                            </div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                            {formatDate(comment.createdAt, true)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                          {comment.comment}
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <button
                            onClick={() =>
                              handleToggleHelpFul({
                                businessId: user._id,
                                userId: session.id,
                                reviewId: comment._id || "",
                              })
                            }
                            className="text-gray-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
                            disabled={helpfulToggle.isPending || !session.id}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                comment?.helpful?.voters.includes(session.id)
                                  ? "text-red-500 fill-current"
                                  : ""
                              }`}
                            />
                            <span>Helpful ({comment.helpful?.count || 0})</span>
                          </button>
                          <button className="text-gray-500 hover:text-red-600 flex items-center space-x-1 transition-colors">
                            <Flag className="w-4 h-4" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
