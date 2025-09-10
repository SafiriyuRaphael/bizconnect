import { AnyUser } from "../../../../../types";
import {
  Column,
  GenericTable,
  GenericTableProps,
} from "../../components/layout/GenericTable";
import ProfileImage from "@/shared/components/composites/ProfileImage";

export default function UserTable({
  filteredUsers,
  activeUsers,
  handleView,
  handleEdit,
  handleDeleteModal,
  total,
  limit,
  currentPage,
  onPageChange,
  handleAudioCall,
  handleVideoCall,
  handleChat,
}: GenericTableProps<AnyUser> & {
  filteredUsers: AnyUser[];
  activeUsers: string[];
}) {
  const columns: Column<AnyUser>[] = [
    {
      header: "USER",
      accessor: "fullName",
      render: (user) => (
        <div className="flex items-center">
          <div className="relative mr-4">
            <ProfileImage
              logo={user.logo}
              user={user}
              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-100"
            />
            {activeUsers.includes(user._id) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {user.businessName || user.fullName}
            </div>
            <div className="text-sm text-gray-600">{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      header: "USER TYPE",
      accessor: "userType",
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            user.userType === "business"
              ? "bg-purple-100 text-purple-800"
              : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {user.userType}
        </span>
      ),
    },
    {
      header: "ROLE",
      accessor: "role",
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${
            user.role === "admin"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-yellow-50 text-yellow-700 border-yellow-200"
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      header: "JOINED DATE",
      accessor: "createdAt",
      render: (user) => (
        <span className="text-sm text-gray-700">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <GenericTable
      data={filteredUsers}
      columns={columns}
      total={total}
      limit={limit}
      currentPage={currentPage}
      onPageChange={onPageChange}
      activeUsers={activeUsers}
      handleView={handleView}
      handleEdit={handleEdit}
      handleDeleteModal={handleDeleteModal}
      handleAudioCall={handleAudioCall}
      handleVideoCall={handleVideoCall}
      handleChat={handleChat}
    />
  );
}
