"use client";
import React, { useState } from "react";
import {
  Search,
  Filter,
  Flag,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Download,
  Eye,
  Ban,
  XCircle,
  User,
  MessageSquare,
  Star,
  Shield,
} from "lucide-react";
import ReportsTable from "./components/ReportTable";
import StatCard from "../components/layout/StatCard";
// import useReports from "../hooks/useReports"; // You'll need to create this hook
import ViewReportModal from "./components/ViewReportModal";
import ResolveReportModal from "./components/ResolveReportModa";
// import BanUserModal from "../components/modals/BanUserModal";

export default function ReportsPage() {
  //   const {
  //     filteredReports,
  //     pagination,
  //     handlePageChange,
  //     handleResolve,
  //     handleDismiss,
  //     handleEscalate,
  //     handleInvestigate,
  //     handleBanUser,
  //     stats,
  //   } = useReports();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReportType, setSelectedReportType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  const handleViewContent = (report: Report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleResolveClick = (report: Report) => {
    setSelectedReport(report);
    setShowResolveModal(true);
  };

  const handleBanUserClick = (report: Report) => {
    setSelectedReport(report);
    setShowBanModal(true);
  };

  const stats: any = [];

  const reportsStats: any = [
    {
      title: "Total Reports",
      data: 0,
      icon: <Flag className="w-6 h-6 text-blue-600" />,
      //   trend: stats?.totalReportsTrend || 0,
    },
    {
      title: "Pending Reports",
      data: 0,
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      //   trend: stats?.pendingReportsTrend || 0,
    },
    {
      title: "Resolved Today",
      data: 0,
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      trend: 0,
    },
    {
      title: "Critical Reports",
      data: 0,
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      //   trend: stats?.criticalReportsTrend || 0,
    },
  ];

  const reportTypeOptions = [
    { value: "all", label: "All Types", icon: Flag },
    { value: "user", label: "User Reports", icon: User },
    { value: "message", label: "Message Reports", icon: MessageSquare },
    { value: "review", label: "Review Reports", icon: Star },
    { value: "business", label: "Business Reports", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Modals */}
      <ViewReportModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        report={selectedReport}
      />
      <ResolveReportModal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        onConfirm={(resolution) => {
          if (selectedReport) {
            // handleResolve(selectedReport, resolution);
            setShowResolveModal(false);
            setSelectedReport(null);
          }
        }}
        report={selectedReport}
      />
      {/* <BanUserModal
        isOpen={showBanModal}
        onClose={() => setShowBanModal(false)}
        onConfirm={(banDetails) => {
          if (selectedReport) {
            handleBanUser(selectedReport, banDetails);
            setShowBanModal(false);
            setSelectedReport(null);
          }
        }}
        report={selectedReport}
      /> */}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reports & Moderation
            </h1>
            <p className="text-gray-600 mt-1">
              Review, investigate, and resolve user reports
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border border-gray-200 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Reports
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportsStats.map((stat:any) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              data={stat.data}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Priority Reports Alert */}
        {/* {stats?.criticalReports > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Critical Reports Require Attention
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  You have {stats.criticalReports} critical report
                  {stats.criticalReports !== 1 ? "s" : ""} that need immediate
                  review.
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by reporter, reported user, or content..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
              >
                {reportTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
                <option value="escalated">Escalated</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Urgent Action Required
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Reports awaiting review
                </p>
              </div>
              <div className="text-2xl font-bold text-red-600">
                {stats?.urgentReports || 0}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  In Progress
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Currently investigating
                </p>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {stats?.investigatingReports || 0}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Resolved Today
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Successfully handled
                </p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {stats?.resolvedToday || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <ReportsTable
          filteredReports={[]}
          currentPage={ 1}
          limit={ 10}
          onPageChange={() => {}}
          total={ 0}
          handleView={() => {}}
          handleResolve={() => {}}
          handleDismiss={() => {}}
          handleEscalate={() => {}}
          handleInvestigate={() => {}}
          handleViewContent={() => {}}
          handleBanUser={() => {}}
        />

        {/* Empty State
        {filteredReports.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Flag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600">
              {searchTerm ||
              selectedReportType !== "all" ||
              selectedStatus !== "all"
                ? "Try adjusting your search or filter criteria"
                : "No reports have been submitted yet"}
            </p>
          </div>
        )} */}
      </div>
    </div>
  );
}
