"use client";
import useUser from "@/hook/useUser";
import {
  Edit3,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Trash2,
  Users,
  Video,
  Download,
  CheckCircle,
  UserPlus,
  Mail,
  Calendar,
  List,
  Grid3X3,
} from "lucide-react";
import React, { useState } from "react";
import UserTable from "./components/UsersTable";
import { useSocketStore } from "@/store/useSocketStore";
import StatCard from "../components/layout/StatCard";
import UserCard from "./components/UserCard";
import useAdminModal from "../hooks/useAdminModal";
import AddUserModal from "../components/modals/AddUserModal";
import EditUserModal from "../components/modals/EditUserModal";
import ViewUserModal from "../components/modals/ViewUserModal";
import { AnyUser } from "../../../../types";
import ChatModal from "./components/ChatModal";

export default function page() {
  const { filteredUsers, pagination, handlePageChange } = useUser();
  const {
    isOpen,
    modalData,
    onClose,
    setIsOpen,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    handleDeleteModal,
    handleEdit,
    handleView,
    handleAudioCall,
    handleChat,
    handleVideoCall,
    handleSendMessage,
    selectedUser,
  } = useAdminModal();
  const { activeUsers } = useSocketStore();
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUserType, setSelectedUserType] = useState("all");

  const stats = [
    {
      title: "Total Customers",
      data: pagination.customers,
      icon: <Users className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Total Business Owners",
      data: pagination.business,
      icon: <UserPlus className="w-6 h-6 text-purple-600" />,
    },
    {
      title: "Active Now",
      data: activeUsers.length,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Total Contacts",
      data: 0,
      icon: <Users className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <AddUserModal isOpen={isOpen === "add"} onClose={onClose} />
      <EditUserModal
        isOpen={isOpen === "edit"}
        userData={modalData}
        onClose={onClose}
      />
      <ViewUserModal
        isOpen={isOpen === "view"}
        user={modalData}
        onClose={onClose}
      />
      <ChatModal
        handleSendMessage={handleSendMessage}
        isOpen={isOpen === "chat"}
        onClose={onClose}
        selectedUser={selectedUser}
      />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all registered users
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
              onClick={() => setIsOpen("add")}
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              data={stat.data}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, username, or email..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
              >
                <option value="all">All User Types</option>
                <option value="Business Owner">Business Owners</option>
                <option value="Professional">Professionals</option>
              </select>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                activeUsers={activeUsers}
                key={user._id}
                user={user}
                handleAudioCall={handleAudioCall}
                handleChat={handleChat}
                handleDeleteModal={handleDeleteModal}
                handleEdit={handleEdit}
                handleVideoCall={handleVideoCall}
                handleView={handleView}
              />
            ))}
          </div>
        ) : (
          <UserTable
            activeUsers={activeUsers}
            filteredUsers={filteredUsers}
            currentPage={pagination.page}
            limit={pagination.limit}
            onPageChange={handlePageChange}
            total={pagination.total}
            handleAudioCall={handleAudioCall}
            handleChat={handleChat}
            handleDeleteModal={handleDeleteModal}
            handleEdit={handleEdit}
            handleView={handleView}
            handleVideoCall={handleVideoCall}
          />
        )}

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
