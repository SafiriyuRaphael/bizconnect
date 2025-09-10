import ProfileImage from "@/shared/components/composites/ProfileImage";
import { AnyUser } from "../../../../../types";
import {
  Calendar,
  Edit3,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  UserPlus,
  Video,
} from "lucide-react";

export default function UserCard({
  user,
  activeUsers,
  handleDeleteModal,
  handleEdit,
  handleView,
  handleAudioCall,
  handleChat,
  handleVideoCall,
}: {
  user: AnyUser;
  activeUsers: string[];
  handleView: (bus: AnyUser) => void;
  handleEdit: (bus: AnyUser) => void;
  handleDeleteModal: (userId: string) => void;
  handleChat: (bus: AnyUser) => void;
  handleVideoCall: (userId: string) => void;
  handleAudioCall: (userId: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="relative">
            <ProfileImage
              logo={user.logo}
              user={user}
              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100"
            />
            {activeUsers.includes(user._id) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {user.businessName || user.fullName}
            </h3>
            <p className="text-sm text-gray-600">{user.username}</p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            activeUsers.includes(user._id)
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {activeUsers.includes(user._id) ? "Online" : "Offline"}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2" />
          {user.username}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <UserPlus className="w-4 h-4 mr-2" />
          {user.userType}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date(user.createdAt).toLocaleDateString() || "Recently joined"}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            onClick={() => {
              handleChat(user);
            }}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            onClick={() => {
              handleAudioCall(user._id);
            }}
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            onClick={() => handleVideoCall(user._id)}
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            <Eye className="w-4 h-4" onClick={() => handleView(user)} />
          </button>
          <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4" onClick={() => handleEdit(user)} />
          </button>
          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2
              className="w-4 h-4"
              onClick={() => handleDeleteModal(user._id)}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
