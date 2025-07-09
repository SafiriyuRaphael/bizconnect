"use client";
import React, { useState } from "react";
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
} from "lucide-react";

const UserProfilePage = () => {
  // Sample user data - in real app, this would come from props/API
  const [userData, setUserData] = useState({
    _id: "507f1f77bcf86cd799439011",
    userType: "business",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    username: "janedoe_boutique",
    fullName: "Jane Doe",
    verified: true,
    logo: "https://images.unsplash.com/photo-1494790108755-2616c9c8ffe2?w=150&h=150&fit=crop&crop=face",
    createdAt: "2024-01-15T10:30:00.000Z",
    businessName: "Jane's Fashion Boutique",
    businessCategory: "fashion",
    businessAddress: "123 Fashion Street, New York, NY 10001",
    businessDescription:
      "Premium fashion boutique offering curated collections of contemporary and designer clothing for modern women.",
    website: "https://janesfashionboutique.com",
    priceRange: { min: 50, max: 500 },
    deliveryTime: 3,
    verifiedBusiness: true,
    reviews: [
      {
        _id: "1",
        userId: "507f1f77bcf86cd799439012",
        username: "fashion_lover",
        rating: 5,
        comment:
          "Amazing quality and fast delivery! The dress I ordered was exactly as described.",
        createdAt: "2024-06-15T14:30:00.000Z",
        helpful: 12,
      },
      {
        _id: "2",
        userId: "507f1f77bcf86cd799439013",
        username: "sarah_m",
        rating: 4,
        comment:
          "Great selection and customer service. Would definitely shop here again.",
        createdAt: "2024-06-10T09:15:00.000Z",
        helpful: 8,
      },
    ],
  });

  const [comments, setComments] = useState([
    {
      id: "1",
      userId: "507f1f77bcf86cd799439014",
      username: "mike_reviewer",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      comment: "Great business! Highly recommend their services.",
      rating: 5,
      createdAt: "2024-07-01T16:45:00.000Z",
      helpful: 3,
    },
    {
      id: "2",
      userId: "507f1f77bcf86cd799439015",
      username: "anna_k",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      comment:
        "Professional and reliable. Had a great experience shopping here.",
      rating: 4,
      createdAt: "2024-06-28T11:20:00.000Z",
      helpful: 5,
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate average rating
  const averageRating =
    comments.length > 0
      ? comments.reduce((acc, comment) => acc + comment.rating, 0) /
        comments.length
      : 0;

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const comment = {
        id: Date.now().toString(),
        userId: "current_user_id",
        username: "current_user",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
        comment: newComment,
        rating: newRating,
        createdAt: new Date().toISOString(),
        helpful: 0,
      };

      setComments([comment, ...comments]);
      setNewComment("");
      setNewRating(5);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleHelpful = (commentId: any) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, helpful: comment.helpful + 1 }
          : comment
      )
    );
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: any) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const renderRatingInput = () => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              i < newRating
                ? "text-yellow-400 fill-current"
                : "text-gray-300 hover:text-yellow-300"
            }`}
            onClick={() => setNewRating(i + 1)}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({newRating}/5)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={userData.logo}
                  alt={userData.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {userData.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.userType === "business"
                    ? userData.businessName
                    : userData.fullName}
                </h1>
                <p className="text-gray-600">@{userData.username}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    {renderStars(Math.floor(averageRating))}
                    <span className="text-sm text-gray-600">
                      {averageRating.toFixed(1)} ({comments.length} reviews)
                    </span>
                  </div>
                  {userData.userType === "business" &&
                    userData.verifiedBusiness && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Verified Business
                      </span>
                    )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-4 h-4 inline mr-2" />
                Follow
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-5 h-5" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>Joined {formatDate(userData.createdAt)}</span>
                </div>
                {userData.userType === "business" && (
                  <>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{userData.businessAddress}</span>
                    </div>
                    {userData.website && (
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Globe className="w-5 h-5" />
                        <a
                          href={userData.website}
                          className="text-blue-600 hover:underline"
                        >
                          {userData.website}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
              {userData.userType === "business" &&
                userData.businessDescription && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-gray-700">
                      {userData.businessDescription}
                    </p>
                  </div>
                )}
            </div>

            {/* Business Details */}
            {userData.userType === "business" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Business Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        Category
                      </span>
                    </div>
                    <p className="text-gray-600 capitalize">
                      {userData.businessCategory}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        Price Range
                      </span>
                    </div>
                    <p className="text-gray-600">
                      ${userData.priceRange.min} - ${userData.priceRange.max}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-900">
                        Delivery Time
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {userData.deliveryTime} days
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Reviews & Comments
              </h2>

              {/* Comment Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Your Rating
                  </div>
                  {renderRatingInput()}
                </div>
                <div className="mb-4">
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Your Comment
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleSubmitComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Posting..." : "Post Comment"}</span>
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border-b border-gray-200 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={comment.avatar}
                        alt={comment.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.username}
                          </span>
                          <div className="flex items-center space-x-1">
                            {renderStars(comment.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.comment}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleHelpful(comment.id)}
                            className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Helpful ({comment.helpful})</span>
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1">
                            <Flag className="w-4 h-4" />
                            <span>Report</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Reviews</span>
                  <span className="font-semibold text-gray-900">
                    {comments.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Rating</span>
                  <span className="font-semibold text-gray-900">
                    {averageRating.toFixed(1)}/5
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">
                    {formatDate(userData.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Rating Breakdown
              </h3>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = comments.filter((c) => c.rating === stars).length;
                const percentage =
                  comments.length > 0 ? (count / comments.length) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center space-x-3 mb-2">
                    <span className="text-sm text-gray-600 w-8">{stars}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
