import { Star } from "lucide-react";
import React from "react";
import { AnyUser } from "../../../../../types";

type Props = {
  averageRating: string;
  profile: AnyUser;
};

export default function RatingDisplay({ averageRating, profile }: Props) {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
          <Star className="w-5 h-5 text-white fill-current" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.floor(Number(averageRating))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-900">{averageRating}/5</span>
            <span className="text-sm text-gray-500">
              ({profile.reviews?.length} reviews)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
