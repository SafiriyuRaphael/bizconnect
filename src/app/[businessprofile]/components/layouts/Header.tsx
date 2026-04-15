import {
  Award,
  FlagTriangleRight,
  Heart,
  MessageCircle,
  Shield,
} from "lucide-react";
import React, { useState } from "react";
import RenderStars from "../composites/RenderStars";
import { useUserDashboardStore } from "../../store";
import useUserDashboardActions from "../../hooks";
import getRatingColor from "@/shared/utils/getRatingColor";
import ProfileImage from "@/shared/components/composites/ProfileImage";
import VerificationBadge from "@/shared/components/composites/VerificationBadge";
import Favorites from "@/shared/components/ui/Favorites";
import ReportModal from "@/shared/components/modal/ReportModal";
import { useTailwindBreakpoints } from "@/shared/hooks/useWindowScreenSize";

export default function Header() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { comments, user, averageRating } = useUserDashboardStore();
  const { isMd } = useTailwindBreakpoints();
  const { handleChatClick } = useUserDashboardActions();

  if (!user) return null;

  return (
    <>
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ProfileImage
                  user={{
                    businessName: user.businessName,
                    fullName: user.fullName,
                  }}
                  logo={user.logo}
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
                      <RenderStars rating={Math.floor(averageRating)} />
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
                    <VerificationBadge variant="classic" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
              <button
                className="flex-1 sm:flex-initial bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                onClick={() => handleChatClick(user)}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                {!isMd ? "Message" : "Send Message"}
              </button>
              <Favorites businessId={user._id} />

              <button
                className="border border-red-300 text-red-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
                onClick={() => setIsReportModalOpen(true)}
              >
                <FlagTriangleRight className="w-4 h-4 inline mr-2" />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>
      <ReportModal
        reportedUser={user}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
}
