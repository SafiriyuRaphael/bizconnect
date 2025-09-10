import React from "react";
import {
  X,
  Flag,
  User,
  MessageSquare,
  Star,
  Shield,
  Calendar,
  AlertTriangle,
  FileText,
  Image,
  Paperclip,
} from "lucide-react";
import ProfileImage from "@/shared/components/composites/ProfileImage";

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

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export default function ViewReportModal({
  isOpen,
  onClose,
  report,
}: ViewReportModalProps) {
  if (!isOpen || !report) return null;

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-5 h-5" />;
      case "message":
        return <MessageSquare className="w-5 h-5" />;
      case "review":
        return <Star className="w-5 h-5" />;
      case "business":
        return <Shield className="w-5 h-5" />;
      default:
        return <Flag className="w-5 h-5" />;
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
        return "text-red-600 bg-red-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              {getReportTypeIcon(report.reportType)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {report.reportType} Report Details
              </h2>
              <p className="text-sm text-gray-600">Report ID: {report._id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(
                  report.status
                )}`}
              >
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">
                Priority:
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getPriorityColor(
                  report.priority
                )}`}
              >
                {report.priority.charAt(0).toUpperCase() +
                  report.priority.slice(1)}
              </span>
            </div>
          </div>

          {/* Report Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reporter Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4" />
                Reported By
              </h3>
              <div className="flex items-center gap-3">
                <ProfileImage
                  logo={report.reportedBy.logo}
                  user={report.reportedBy}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {report.reportedBy.fullName}
                  </div>
                  <div className="text-sm text-gray-600">
                    @{report.reportedBy.username}
                  </div>
                </div>
              </div>
            </div>

            {/* Reported User/Content */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Reported {report.reportedUser ? "User" : "Content"}
              </h3>
              {report.reportedUser ? (
                <div className="flex items-center gap-3">
                  <ProfileImage
                    logo={report.reportedUser.logo}
                    user={report.reportedUser}
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {report.reportedUser.fullName}
                    </div>
                    <div className="text-sm text-gray-600">
                      @{report.reportedUser.username}
                    </div>
                  </div>
                </div>
              ) : report.reportedContent ? (
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    Content Type: {report.reportedContent.type}
                  </div>
                  <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                    {report.reportedContent.content}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No specific user or content reported
                </div>
              )}
            </div>
          </div>

          {/* Report Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Report Category
              </h3>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {report.reportCategory}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Reason
              </h3>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {report.reason}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Description
              </h3>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                {report.description || "No additional description provided"}
              </div>
            </div>
          </div>

          {/* Evidence Section */}
          {report.evidence &&
            (report.evidence.screenshots?.length > 0 ||
              report.evidence.attachments?.length > 0) && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Evidence
                </h3>
                <div className="space-y-3">
                  {report.evidence.screenshots &&
                    report.evidence.screenshots.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                          <Image className="w-3 h-3" />
                          Screenshots ({report.evidence.screenshots.length})
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {report.evidence.screenshots.map(
                            (screenshot, index) => (
                              <img
                                key={index}
                                src={screenshot}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
                              />
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {report.evidence.attachments &&
                    report.evidence.attachments.length > 0 && (
                      <div>
                        <h4 className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          Attachments ({report.evidence.attachments.length})
                        </h4>
                        <div className="space-y-1">
                          {report.evidence.attachments.map(
                            (attachment, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                <Paperclip className="w-3 h-3" />
                                <a
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Attachment {index + 1}
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

          {/* Admin Notes */}
          {report.adminNotes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Admin Notes
              </h3>
              <div className="text-sm text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-lg">
                {report.adminNotes}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Report Created
                  </div>
                  <div className="text-xs text-gray-600">
                    {new Date(report.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>

              {report.updatedAt !== report.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Last Updated
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(report.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {report.resolvedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Resolved {report.resolvedBy && `by ${report.resolvedBy}`}
                    </div>
                    <div className="text-xs text-gray-600">
                      {new Date(report.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
