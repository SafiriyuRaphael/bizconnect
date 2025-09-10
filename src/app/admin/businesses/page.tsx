"use client";
import React from "react";
import {
  Building2,
  Plus,
  Search,
  Users,
  CheckCircle,
  Grid3X3,
  List,
  Download,
} from "lucide-react";
import getAllBusiness from "@/lib/admin/getAllBusiness";
import useDashboard from "@/shared/hooks/useDashboard";
import AddBusinessModal from "../components/modals/AddBusinessModal";
import EditBusinessModal from "../components/modals/EditBusinessModal";
import AdminBusinessModal from "../components/modals/ViewBusinessModal";
import { useSocketStore } from "@/shared/store/useSocketStore";
import { BUSINESSCATEGORIES } from "@/shared/constants/business";
import BusinessTable from "./components/BusinessTable";
import StatCard from "../components/layout/StatCard";
import BusinessCard from "./components/BusinessCard";
import useAdminModal from "../hooks/useAdminModal";

export default function BusinessDashboard() {
  const {
    filteredBusinesses,
    searchQuery,
    handleSearchChange,
    setSelectedCategory,
    setCurrentPage,
    selectedCategory,
    handlePageChange,
    currentPage,
    total,
  } = useDashboard(getAllBusiness);

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
  } = useAdminModal();

  const { activeUsers } = useSocketStore();

  const activeBusinessCount = filteredBusinesses.filter((biz) =>
    activeUsers.includes(biz._id)
  ).length;

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const stats = [
    {
      title: "Total Businesses",
      data: filteredBusinesses.length,
      icon: <Building2 className="w-6 h-6 text-blue-600" />,
    },
    {
      title: "Active Now",
      data: activeBusinessCount,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    },
    {
      title: "Verified",
      data: filteredBusinesses.filter(
        (b) => b.verificationStatus === "approved"
      ).length,
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: "Total Contacts",
      data: filteredBusinesses.reduce((acc, b) => acc + b?.contactCount, 0),
      icon: <Users className="w-6 h-6 text-purple-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <AddBusinessModal isOpen={isOpen === "add"} onClose={onClose} />
      <EditBusinessModal
        isOpen={isOpen === "edit"}
        businessData={modalData}
        onClose={onClose}
      />
      <AdminBusinessModal
        isOpen={isOpen === "view"}
        business={modalData}
        onClose={onClose}
      />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Business Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor all your businesses
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setIsOpen("add")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Business
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
                  placeholder="Search businesses, emails, or contacts..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {BUSINESSCATEGORIES.map((cat) => {
                  return (
                    <option value={cat.value} key={cat.value}>
                      {cat.name}
                    </option>
                  );
                })}
              </select>
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
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
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business._id}
                business={business}
                activeUsers={activeUsers}
                handleDeleteModal={handleDeleteModal}
                handleEdit={handleEdit}
                handleView={handleView}
              />
            ))}
          </div>
        ) : (
          <BusinessTable
            activeUsers={activeUsers}
            handleEdit={handleEdit}
            filteredBusinesses={filteredBusinesses}
            handleView={handleView}
            handleDeleteModal={handleDeleteModal}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            total={total}
            limit={12}
          />
        )}

        {filteredBusinesses.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No businesses found
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
