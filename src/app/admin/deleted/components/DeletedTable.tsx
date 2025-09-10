import { AnyUser } from "../../../../../types";
import {
  Column,
  GenericTable,
  GenericTableProps,
} from "../../components/layout/GenericTable";
import ProfileImage from "@/shared/components/composites/ProfileImage";
import { RotateCcw, AlertCircle } from "lucide-react";

interface DeletedUser extends AnyUser {
  deletedAt: string;
  deletedBy?: string;
  deletionReason?: string;
}

export default function DeletedUsersTable({
  filteredUsers,
  handleView,
  handleEdit,
  handleDeleteModal,
  total,
  limit,
  currentPage,
  onPageChange,
  handleRestore,
  handlePermanentDelete,
}: GenericTableProps<DeletedUser> & {
  filteredUsers: DeletedUser[];
  handleRestore?: (user: DeletedUser) => void;
  handlePermanentDelete?: (user: DeletedUser) => void;
}) {
  const columns: Column<DeletedUser>[] = [
    {
      header: "USER",
      accessor: "fullName",
      render: (user) => (
        <div className="flex items-center">
          <div className="relative mr-4">
            <ProfileImage
              logo={user.logo}
              user={user}
              className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200 opacity-60"
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white">
              <AlertCircle className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700">
              {user.businessName || user.fullName}
            </div>
            <div className="text-sm text-gray-500">{user.username}</div>
          </div>
        </div>
      ),
    },
    {
      header: "USER TYPE",
      accessor: "userType",
      render: (user) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full opacity-75 ${
            user.userType === "business"
              ? "bg-purple-100 text-purple-600"
              : "bg-emerald-100 text-emerald-600"
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
          className={`px-2 py-1 text-xs font-medium rounded-full border opacity-75 ${
            user.role === "admin"
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-yellow-50 text-yellow-600 border-yellow-200"
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
        <span className="text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "DELETED DATE",
      accessor: "deletedAt",
      render: (user) => (
        <div>
          <span className="text-sm text-red-600 font-medium">
            {new Date(user.deletedAt).toLocaleDateString()}
          </span>
          <div className="text-xs text-gray-500">
            {new Date(user.deletedAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      header: "DELETED BY",
      accessor: "deletedBy",
      render: (user) => (
        <span className="text-sm text-gray-600">
          {user.deletedBy || "System"}
        </span>
      ),
    },
    {
      header: "REASON",
      accessor: "deletionReason",
      render: (user) => (
        <span className="text-sm text-gray-600 max-w-32 truncate block">
          {user.deletionReason || "No reason provided"}
        </span>
      ),
    },
  ];

  // Custom action buttons for deleted users
  const customActions = (user: DeletedUser) => (
    <div className="flex items-center gap-2">
      {handleRestore && (
        <button
          onClick={() => handleRestore(user)}
          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
          title="Restore User"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      )}
      {handlePermanentDelete && (
        <button
          onClick={() => handlePermanentDelete(user)}
          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          title="Permanently Delete"
        >
          <AlertCircle className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <GenericTable
      data={filteredUsers}
      columns={columns}
      total={total}
      limit={limit}
      currentPage={currentPage}
      onPageChange={onPageChange}
      handleView={handleView}
    />
  );
}
