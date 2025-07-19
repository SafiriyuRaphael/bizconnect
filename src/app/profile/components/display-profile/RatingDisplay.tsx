import { Star } from "lucide-react";
import React from "react";
import { AnyUser } from "../../../../../types";

type Props = {
  averageRating: string | number;
  profile: AnyUser;
  showReviewCount?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function RatingDisplay({ 
  averageRating, 
  profile, 
  showReviewCount = true,
  size = "md",
  className = ""
}: Props) {
  // Convert to number and handle edge cases
  const rating = Math.max(0, Math.min(5, Number(averageRating) || 0));
  const reviewCount = profile.reviews?.length || 0;
  
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "p-3",
      iconContainer: "w-8 h-8",
      mainIcon: "w-4 h-4",
      stars: "w-3 h-3",
      spacing: "space-x-2",
      starSpacing: "space-x-0.5",
      textSize: "text-sm",
      reviewTextSize: "text-xs"
    },
    md: {
      container: "p-4",
      iconContainer: "w-10 h-10",
      mainIcon: "w-5 h-5",
      stars: "w-4 h-4",
      spacing: "space-x-3",
      starSpacing: "space-x-1",
      textSize: "text-base",
      reviewTextSize: "text-sm"
    },
    lg: {
      container: "p-5",
      iconContainer: "w-12 h-12",
      mainIcon: "w-6 h-6",
      stars: "w-5 h-5",
      spacing: "space-x-4",
      starSpacing: "space-x-1",
      textSize: "text-lg",
      reviewTextSize: "text-base"
    }
  };

  const config = sizeConfig[size];

  // Format rating display
  const formatRating = (rating: number): string => {
    return rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
  };

  // Generate stars with partial filling support
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFullStar = starNumber <= Math.floor(rating);
      const isPartialStar = starNumber === Math.ceil(rating) && rating % 1 !== 0;
      
      return (
        <div key={starNumber} className="relative">
          <Star
            className={`${config.stars} text-gray-300`}
            aria-hidden="true"
          />
          {(isFullStar || isPartialStar) && (
            <Star
              className={`${config.stars} text-yellow-400 fill-current absolute top-0 left-0`}
              style={
                isPartialStar 
                  ? { 
                      clipPath: `polygon(0 0, ${(rating % 1) * 100}% 0, ${(rating % 1) * 100}% 100%, 0% 100%)` 
                    }
                  : undefined
              }
              aria-hidden="true"
            />
          )}
        </div>
      );
    });
  };

  // Handle no reviews case
  if (reviewCount === 0) {
    return (
      <div className={`bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl ${config.container} border border-gray-200 ${className}`}>
        <div className={`flex items-center ${config.spacing}`}>
          <div className={`${config.iconContainer} bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center`}>
            <Star className={`${config.mainIcon} text-white`} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <div className={`flex ${config.starSpacing}`}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`${config.stars} text-gray-300`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className={`font-medium text-gray-500 ${config.textSize}`}>
                No reviews yet
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl ${config.container} border border-yellow-200 ${className}`}
      role="img"
      aria-label={`Average rating: ${formatRating(rating)} out of 5 stars based on ${reviewCount} review${reviewCount !== 1 ? 's' : ''}`}
    >
      <div className={`flex items-center ${config.spacing}`}>
        <div className={`${config.iconContainer} bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center`}>
          <Star className={`${config.mainIcon} text-white fill-current`} />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <div className={`flex ${config.starSpacing}`} role="img" aria-label={`${formatRating(rating)} out of 5 stars`}>
              {renderStars()}
            </div>
            <span className={`font-bold text-gray-900 ${config.textSize}`}>
              {formatRating(rating)}/5
            </span>
            {showReviewCount && (
              <span className={`text-gray-500 ${config.reviewTextSize}`}>
                ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}