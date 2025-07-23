"use client";
import React, { useEffect, useState } from "react";
import {
  Star,
  Send,
  MapPin,
  Globe,
  Calendar,
  Building,
  Mail,
  Phone,
  Shield,
  Clock,
  DollarSign,
  Edit,
  Heart,
  Flag,
  Edit2,
  MessageCircle,
  FlagTriangleRight,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  ExternalLink,
  Users,
  Award,
  TrendingUp,
  MapIcon,
  PhoneCall,
  MessageSquare,
  StarIcon,
  ImageIcon,
  Clipboard,
  ClipboardCheck,
} from "lucide-react";
import {
  AnyUser,
  BusinessDisplayPicsProps,
  BusinessReviewsProps,
  SessionUser,
} from "../../../../types";
import getUserReviews from "@/lib/reviews/getUserReviews";
import addReview from "@/lib/reviews/addReview";
import MessageModal from "@/app/components/ui/MessageModal";
import { useRouter } from "next/navigation";
import getBusinessReviews from "@/lib/reviews/getBusinessReviews";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import toggleUserHelpful from "@/lib/reviews/toggleUserHelpful";
import { BASEURL } from "@/constants/url";

const UsersProfile = ({
  user,
  session,
}: {
  user: AnyUser;
  session: SessionUser;
}) => {
  const [modalType, setIsModalType] = useState<
    "error" | "warning" | "info" | "success"
  >("success");
  const [message, setMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [comments, setComments] = useState<BusinessReviewsProps[]>(
    user.reviews || []
  );
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  const [openFullGallery, setOpenFullGallery] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isToggleHelpful, setIsToggleHelpful] = useState(false);

  const router = useRouter();

  const generateDefaultLogoDataUrl = (name: string): string => {
    const svg = generateDefaultLogo(name);
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  // Check if user can rate (only for business profiles)
  const canRate = session.id !== user._id;

  // Calculate average rating
  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, comment) => acc + comment.rating, 0) /
        comments.length
      : 0;

  // Handle responsive design
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !canRate) return;

    setIsSubmitting(true);
    const businessName = session.businessName;
    const name = session.name;
    try {
      const newReviews = await addReview({
        businessId: user._id,
        userId: session.id,
        displayPic: session?.logo || "",
        username: session?.username,
        rating: newRating,
        comment: newComment,
        fullName: businessName || name,
      });
      setComments(newReviews?.reviews || []);
      setIsModalType("success");
      setMessage("Review posted successfully!");
      setOpenModal(true);
    } catch (err) {
      setIsModalType("error");
      setMessage("Failed to post review");
      setOpenModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleHelpful = async ({
    businessId,
    reviewId,
    userId,
  }: {
    businessId: string;
    reviewId: string;
    userId: string;
  }) => {
    setIsToggleHelpful(true);
    try {
      const helpfulToggle = await toggleUserHelpful({
        reviewId,
        userId,
        businessId,
      });
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === reviewId
            ? {
                ...comment,
                helpful: helpfulToggle?.helpful,
              }
            : comment
        )
      );
    } catch (err) {
      setIsModalType("error");
      setMessage("Failed to toggle helpful");
      setOpenModal(true);
    } finally {
      setIsToggleHelpful(false);
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const nextImage = () => {
    if (
      selectedImageIndex !== null &&
      user.displayPics &&
      selectedImageIndex < user.displayPics.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleDirection = (address: string | undefined) => {
    if (!address) return;
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, "_blank");
  };

  const handleChatClick = () => {
    router.push(`/chat?recipientId=${user._id}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.businessName ?? user.fullName}'s Profile`,
          text: `Check out ${user.businessName ?? user.fullName}'s profile`,
          url: `${BASEURL}/${user.username}`,
        });
        console.log("Shared successfully");
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      alert("Sharing not supported in your browser 😢");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${BASEURL}/${user.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (canRate) {
          const userReview = await getUserReviews({
            businessId: user._id,
            userId: session.id,
          });

          if (userReview) {
            setIsEditable(false);
            setNewRating(userReview?.review.rating);
            setNewComment(userReview?.review.comment);
          } else {
            setIsEditable(true);
          }
        }

        if (user.userType === "business") {
          const reviews = await getBusinessReviews({
            businessId: user._id,
          });
          setComments(reviews?.reviews || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    })();
  }, []);

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number, size: string = "w-4 h-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderRatingInput = () => {
    if (!canRate) return null;

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 cursor-pointer transition-colors ${
              i < newRating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 hover:text-yellow-300"
            }`}
            onClick={() => (isEditable ? setNewRating(i + 1) : null)}
          />
        ))}
        <span className="ml-3 text-sm font-medium text-gray-700">
          ({newRating}/5)
        </span>
      </div>
    );
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MessageModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        message={message}
        type={modalType}
        autoClose
        autoCloseDelay={5000}
        showIcon
      />

      {/* Image Modal */}
      {selectedImageIndex !== null && user.displayPics && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={user.displayPics[selectedImageIndex].url}
              alt={`Business image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {user.displayPics.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={selectedImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={selectedImageIndex === user.displayPics.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 disabled:opacity-50"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {selectedImageIndex + 1} / {user.displayPics.length}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={user.logo || generateDefaultLogoDataUrl(user.fullName)}
                  alt={user.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  {user.userType === "business"
                    ? user.businessName
                    : user.fullName}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  @{user.username}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                  {user.userType === "business" && (
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.floor(averageRating))}
                      <span
                        className={`text-sm font-semibold ${getRatingColor(
                          averageRating
                        )}`}
                      >
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({comments.length} review
                        {comments.length !== 1 ? "s" : ""})
                      </span>
                    </div>
                  )}
                  {user.userType === "business" && user.verifiedBusiness && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      Verified Business
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-initial bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={handleChatClick}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                {isMobile ? "Message" : "Send Message"}
              </button>
              <button className="flex-1 sm:flex-initial border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Heart className="w-4 h-4 inline mr-2" />
                {isMobile ? "Save" : "Add to Favorite"}
              </button>
              <button className="border border-red-300 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm">
                <FlagTriangleRight className="w-4 h-4 inline mr-2" />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Gallery */}
            {user.userType === "business" &&
              user.displayPics &&
              user.displayPics.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Gallery
                    </h2>
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
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                        >
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
                        <div
                          key={index}
                          className="relative group cursor-pointer"
                        >
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
                    Joined {formatDate(user.createdAt)}
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
                      <span className="font-semibold text-gray-900">
                        Category
                      </span>
                    </div>
                    <p className="text-gray-700 capitalize text-sm sm:text-base">
                      {user.businessCategory}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-gray-900">
                        Price Range
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base">
                      ${user.priceRange?.min} - ${user.priceRange?.max}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">
                        Delivery
                      </span>
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
                      {renderRatingInput()}
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
                          onClick={handleSubmitComment}
                          disabled={isSubmitting || !newComment.trim()}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                        >
                          <Send className="w-4 h-4" />
                          <span>
                            {isSubmitting ? "Posting..." : "Post Review"}
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
                      const fallbackSrc =
                        generateDefaultLogoDataUrl(fallbackAlt);
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
                              />
                            ) : (
                              <Image
                                src={fallbackSrc}
                                alt={fallbackAlt}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                                    {comment.username}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    {renderStars(comment.rating)}
                                  </div>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-3 text-sm sm:text-base leading-relaxed">
                                {comment.comment}
                              </p>
                              <div className="flex items-center space-x-4 text-sm">
                                <button
                                  onClick={() =>
                                    handleToggleHelpful({
                                      businessId: user._id,
                                      userId: session.id,
                                      reviewId: comment._id || "",
                                    })
                                  }
                                  className="text-gray-500 hover:text-red-600 flex items-center space-x-1 transition-colors"
                                  disabled={isToggleHelpful}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      comment?.helpful?.voters.includes(
                                        session.id
                                      )
                                        ? "text-red-500 fill-current"
                                        : ""
                                    }`}
                                  />
                                  <span>
                                    Helpful ({comment.helpful?.count || 0})
                                  </span>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  onClick={handleChatClick}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
                {user.userType === "business" && (
                  <>
                    <button
                      className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      onClick={handleChatClick}
                    >
                      <PhoneCall className="w-5 h-5" />
                      <span>Call Business</span>
                    </button>
                    <button
                      className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                      onClick={() =>
                        handleDirection(
                          user.businessAddress || user.deliveryAddress
                        )
                      }
                    >
                      <MapIcon className="w-5 h-5" />
                      <span>Get Directions</span>
                    </button>
                  </>
                )}
                {isMobile ? (
                  <button
                    className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share Profile</span>
                  </button>
                ) : (
                  <button
                    className="w-full border border-gray-300 text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                    onClick={handleCopy}
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

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {user.userType === "business"
                  ? "Business Stats"
                  : "Profile Stats"}
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
                        className={`font-semibold ${getRatingColor(
                          averageRating
                        )}`}
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
                    {formatDate(user.createdAt)}
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
                    const count = comments.filter(
                      (c) => c.rating === stars
                    ).length;
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
                      {renderStars(Math.floor(averageRating), "w-5 h-5")}
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
                      <p className="text-sm font-medium text-gray-900">
                        Address
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.businessAddress}
                      </p>
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
                        <p className="text-sm font-medium text-gray-900">
                          Website
                        </p>
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
        </div>
      </div>
    </div>
  );
};

export default UsersProfile;
