import getVerificationDetails from "@/lib/business/getVerificationDetails";
import { AllBusinessProps } from "../../../../../types";
import ProfileImage from "@/app/components/layout/ProfileImage";
import getCategoryColor from "@/lib/business/getCategoryColor";
import { getBusinessCategoryDetails } from "@/lib/business/getBusinessCategoryDetails";
import { Edit3, Eye, Mail, MapPin, Phone, Trash2, Users } from "lucide-react";

export default function BusinessCard({
  business,
  handleDeleteModal,
  handleEdit,
  handleView,
  activeUsers,
}: {
  business: AllBusinessProps;
  activeUsers: string[];
  handleView: (bus: AllBusinessProps) => void;
  handleEdit: (bus: AllBusinessProps) => void;
  handleDeleteModal: (userId: string) => void;
}) {
  const verification = getVerificationDetails(business);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ProfileImage
                logo={business.logo}
                user={business}
                className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100"
              />
              {activeUsers.includes(business._id) && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {business.businessName}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {verification.icon}
                <span className="text-sm text-gray-600 capitalize">
                  {business.verificationStatus}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(
                business.businessCategory
              )}`}
            >
              {getBusinessCategoryDetails(business.businessCategory).name}
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2" />
            {business.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2" />
            {business.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {business.businessAddress}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {business.contactCount}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleView(business)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEdit(business)}
              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              onClick={() => handleDeleteModal(business._id)}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
