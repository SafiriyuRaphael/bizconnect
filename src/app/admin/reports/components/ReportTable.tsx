import React from "react";
import {
  Column,
  GenericTable,
  GenericTableProps,
} from "../../components/layout/GenericTable";
import ProfileImage from "@/shared/components/composites/ProfileImage";
import {
  Flag,
  User,
  MessageSquare,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Ban,
  Shield,
} from "lucide-react";

export interface Report {
  _id: string;
  reportType: "user" | "message" | "review" | "business" | "content";
  reportCategory: string;
  reportedBy: {
    _id: string;
    fullName: string;
    username: string;
    logo?: string;
  };
  reportedUser?: {
    _id: string;
    fullName: string;
    username: string;
    logo?: string;
  };
  reportedContent?: {
    _id: string;
    content: string;
    type: string;
  };
  reason: string;
  description: string;
  status: "pending" | "investigating" | "resolved" | "dismissed" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  adminNotes?: string;
  evidence?: {
    screenshots: string[];
    attachments: string[];
  };
}

interface ReportsTableProps
  extends Omit<GenericTableProps<Report>, "activeUsers"> {
  filteredReports: Report[];
  handleResolve?: (report: Report) => void;
  handleDismiss?: (report: Report) => void;
  handleEscalate?: (report: Report) => void;
  handleInvestigate?: (report: Report) => void;
  handleViewContent?: (report: Report) => void;
  handleBanUser?: (report: Report) => void;
}

export default function ReportsTable({
  filteredReports,
  handleView,
  handleEdit,
  handleDeleteModal,
  total,
  limit,
  currentPage,
  onPageChange,
  handleResolve,
  handleDismiss,
  handleEscalate,
  handleInvestigate,
  handleViewContent,
  handleBanUser,
}: ReportsTableProps) {
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-4 h-4" />;
      case "message":
        return <MessageSquare className="w-4 h-4" />;
      case "review":
        return <Star className="w-4 h-4" />;
      case "business":
        return <Shield className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "dismissed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "escalated":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const columns: Column<Report>[] = [
    {
      header: "REPORT",
      accessor: "reportType",
      render: (report) => (
        <div className="flex items-center">
          <div className="relative mr-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {getReportTypeIcon(report.reportType)}
            </div>
            <div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(
                report.priority
              )}`}
            ></div>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 capitalize">
              {report.reportType} Report
            </div>
            <div className="text-xs text-gray-600">
              ID: {report._id.slice(-8)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "REPORTED BY",
      accessor: "reportedBy",
      render: (report) => (
        <div className="flex items-center">
          <ProfileImage
            logo={report.reportedBy.logo}
            user={report.reportedBy}
            className="w-8 h-8 rounded-lg object-cover border border-gray-200 mr-2"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {report.reportedBy.fullName}
            </div>
            <div className="text-xs text-gray-600">
              @{report.reportedBy.username}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "REPORTED USER/CONTENT",
      accessor: "reportedUser",
      render: (report) => (
        <div>
          {report.reportedUser ? (
            <div className="flex items-center">
              <ProfileImage
                logo={report.reportedUser.logo}
                user={report.reportedUser}
                className="w-8 h-8 rounded-lg object-cover border border-gray-200 mr-2"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {report.reportedUser.fullName}
                </div>
                <div className="text-xs text-gray-600">
                  @{report.reportedUser.username}
                </div>
              </div>
            </div>
          ) : report.reportedContent ? (
            <div className="max-w-48">
              <div className="text-sm text-gray-900 truncate">
                {report.reportedContent.content}
              </div>
              <div className="text-xs text-gray-600 capitalize">
                {report.reportedContent.type}
              </div>
            </div>
          ) : (
            <span className="text-sm text-gray-500">N/A</span>
          )}
        </div>
      ),
    },
    {
      header: "CATEGORY & REASON",
      accessor: "reason",
      render: (report) => (
        <div>
          <div className="text-sm font-medium text-gray-900">
            {report.reportCategory}
          </div>
          <div className="text-xs text-gray-600 max-w-32 truncate">
            {report.reason}
          </div>
        </div>
      ),
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (report) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
            report.status
          )}`}
        >
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </span>
      ),
    },
    {
      header: "PRIORITY",
      accessor: "priority",
      render: (report) => (
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${getPriorityColor(
              report.priority
            )}`}
          ></div>
          <span className="text-sm capitalize text-gray-700">
            {report.priority}
          </span>
        </div>
      ),
    },
    {
      header: "REPORTED DATE",
      accessor: "createdAt",
      render: (report) => (
        <div>
          <span className="text-sm text-gray-700">
            {new Date(report.createdAt).toLocaleDateString()}
          </span>
          <div className="text-xs text-gray-500">
            {new Date(report.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
  ];

  // Custom action buttons for reports
  const customActions = (report: Report) => (
    <div className="flex items-center gap-1">
      {handleViewContent && (
        <button
          onClick={() => handleViewContent(report)}
          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Content"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      {report.status === "pending" && handleInvestigate && (
        <button
          onClick={() => handleInvestigate(report)}
          className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors"
          title="Start Investigation"
        >
          <Clock className="w-4 h-4" />
        </button>
      )}

      {(report.status === "pending" || report.status === "investigating") &&
        handleResolve && (
          <button
            onClick={() => handleResolve(report)}
            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
            title="Resolve Report"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}

      {(report.status === "pending" || report.status === "investigating") &&
        handleDismiss && (
          <button
            onClick={() => handleDismiss(report)}
            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
            title="Dismiss Report"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}

      {report.priority === "high" ||
        (report.priority === "critical" && handleEscalate && (
          <button
            onClick={() => handleEscalate(report)}
            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Escalate Report"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        ))}

      {report.reportedUser && handleBanUser && (
        <button
          onClick={() => handleBanUser(report)}
          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          title="Ban User"
        >
          <Ban className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const getRowClassName = (report: Report) => {
    let baseClass = "hover:bg-gray-50 transition-colors";

    if (report.priority === "critical") {
      baseClass += " border-l-4 border-red-500";
    } else if (report.priority === "high") {
      baseClass += " border-l-4 border-orange-500";
    }

    if (report.status === "resolved") {
      baseClass += " opacity-75";
    }

    return baseClass;
  };

  return (
    <GenericTable
      data={filteredReports}
      columns={columns}
      total={total}
      limit={limit}
      currentPage={currentPage}
      onPageChange={onPageChange}
      handleView={handleView}
      handleEdit={handleEdit}
      handleDeleteModal={handleDeleteModal}
    />
  );
}
