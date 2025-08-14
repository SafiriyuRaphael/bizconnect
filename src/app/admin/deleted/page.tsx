"use client";
import {
  Search,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Users,
  Filter,
  Calendar,
  Download,
} from "lucide-react";
import React, { useState } from "react";
import StatCard from "../components/layout/StatCard";
import DeletedUsersTable from "./components/DeletedTable";

export default function DeletedUsersPage() {
  // const {
  //   filteredUsers,
  //   pagination,
  //   handlePageChange,
  //   handleRestore,
  //   handlePermanentDelete,
  //   stats
  // } = useDeletedUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserType, setSelectedUserType] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleRestoreClick = (user: any) => {
    setSelectedUser(user);
    setShowRestoreModal(true);
  };

  const handlePermanentDeleteClick = (user: any) => {
    setSelectedUser(user);
    setShowPermanentDeleteModal(true);
  };

  const handleConfirmRestore = () => {
    if (selectedUser) {
      //   handleRestore(selectedUser);
      setShowRestoreModal(false);
      setSelectedUser(null);
    }
  };

  const handleConfirmPermanentDelete = () => {
    if (selectedUser) {
      //   handlePermanentDelete(selectedUser);
      setShowPermanentDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const deletedUserStats = [
    {
      title: "Total Deleted Users",
      data: 0,
      icon: <Trash2 className="w-6 h-6 text-red-600" />,
    },
    {
      title: "Deleted This Month",
      data: 0,
      icon: <Calendar className="w-6 h-6 text-orange-600" />,
    },
    {
      title: "Restored This Month",
      data: 0,
      icon: <RotateCcw className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Permanently Deleted",
      data: 0,
      icon: <AlertTriangle className="w-6 h-6 text-red-800" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Modals */}
      {/* <RestoreUserModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleConfirmRestore}
        user={selectedUser}
      />
      <PermanentDeleteModal
        isOpen={showPermanentDeleteModal}
        onClose={() => setShowPermanentDeleteModal(false)}
        onConfirm={handleConfirmPermanentDelete}
        user={selectedUser}
      /> */}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Deleted Users</h1>
            <p className="text-gray-600 mt-1">
              Manage and restore deleted user accounts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Deleted Users
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deletedUserStats.map((stat) => (
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
                  placeholder="Search deleted users by name, username, or email..."
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
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Important Notice
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Deleted users are kept for 30 days before permanent deletion.
                You can restore users during this period. Permanently deleted
                users cannot be recovered.
              </p>
            </div>
          </div>
        </div>

        {/* Deleted Users Table */}
        <DeletedUsersTable
          filteredUsers={[]}
          currentPage={1}
          limit={10}
          onPageChange={() => {}}
          total={0}
          handleView={() => {}}
          handleRestore={handleRestoreClick}
          handlePermanentDelete={handlePermanentDeleteClick}
        />

        {/* Empty State */}
        {/* {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No deleted users found
            </h3>
            <p className="text-gray-600">
              {searchTerm || selectedUserType !== "all" || dateFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No users have been deleted yet"}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
