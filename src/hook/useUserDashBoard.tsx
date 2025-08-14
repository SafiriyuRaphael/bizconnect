import { BASEURL } from "@/constants/url";
import { generateDefaultLogo } from "@/lib/Image/generateDefaultLogo";
import getBusinessReviews from "@/lib/reviews/getBusinessReviews";
import getUserReviews from "@/lib/reviews/getUserReviews";
import toggleUserHelpful from "@/lib/reviews/toggleUserHelpful";
import { useMessageModalStore } from "@/store/useMessageModalStore";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AnyUser, BusinessReviewsProps, SessionUser } from "../../types";
import addReview from "@/lib/reviews/addReview";

export default function useUserDashBoard({
  user,
  session,
}: {
  user: AnyUser;
  session: SessionUser;
}) {

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
      useMessageModalStore.getState().onOpen({
        title: "Success",
        message: "Review posted successfully!",
        type: "success",
      });
    } catch (err) {
      useMessageModalStore.getState().onOpen({
        title: "Review error",
        message: "Failed to post review",
        type: "error",
      });
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
      useMessageModalStore.getState().onOpen({
        title: "Error",
        message: "Failed to toggle helpful",
        type: "error",
      });
    } finally {
      setIsToggleHelpful(false);
    }
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
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
          ({newRating} / 5)
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
  return {
    selectedImageIndex,
    generateDefaultLogoDataUrl,
    renderStars,
    averageRating,
    comments,
    handleChatClick,
    isMobile,
    router,
    setOpenFullGallery,
    openFullGallery,
    openImageModal,
    isEditable,
    canRate,
    renderRatingInput,
    setNewComment,
    newComment,
    handleSubmitComment,
    isSubmitting,
    setIsEditable,
    handleToggleHelpful,
    isToggleHelpful,
    handleShare,
    handleCopy,
    copied,
    getRatingColor,
    setSelectedImageIndex,
    handleDirection,
  };
}
