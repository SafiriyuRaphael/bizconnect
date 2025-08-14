import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";

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

interface ResolveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolution: {
    action: string;
    reason: string;
    adminNotes: string;
    followUpRequired: boolean;
  }) => void;
  report: Report | null;
}

export default function ResolveReportModal({
  isOpen,
  onClose,
  onConfirm,
  report,
}: ResolveReportModalProps) {
  const [selectedAction, setSelectedAction] = useState("");
  const [reason, setReason] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);

  if (!isOpen || !report) return null;

  const resolutionActions = [
    {
      value: "no_violation",
      label: "No Violation Found",
      description: "Report reviewed - no policy violation detected",
      color: "text-green-700 bg-green-50 border-green-200",
    },
    {
      value: "warning_issued",
      label: "Warning Issued",
      description: "User warned about policy violation",
      color: "text-yellow-700 bg-yellow-50 border-yellow-200",
    },
    {
      value: "content_removed",
      label: "Content Removed",
      description: "Violating content has been removed",
      color: "text-orange-700 bg-orange-50 border-orange-200",
    },
    {
      value: "user_suspended",
      label: "User Suspended",
      description: "User account temporarily suspended",
      color: "text-red-700 bg-red-50 border-red-200",
    },
    {
      value: "user_banned",
      label: "User Banned",
      description: "User account permanently banned",
      color: "text-red-800 bg-red-100 border-red-300",
    },
    {
      value: "escalated",
      label: "Escalated to Senior Team",
      description: "Requires higher-level review",
      color: "text-purple-700 bg-purple-50 border-purple-200",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction || !reason.trim()) return;

    onConfirm({
      action: selectedAction,
      reason: reason.trim(),
      adminNotes: adminNotes.trim(),
      followUpRequired,
    });

    // Reset form
    setSelectedAction("");
    setReason("");
    setAdminNotes("");
    setFollowUpRequired(false);
  };

  const handleClose = () => {
    setSelectedAction("");
    setReason("");
    setAdminNotes("");
    setFollowUpRequired(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Resolve Report
              </h2>
              <p className="text-sm text-gray-600">
                Report ID: {report._id.slice(-8)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Report Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Report Summary
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Type:</span> {report.reportType}
              </div>
              <div>
                <span className="font-medium">Category:</span>{" "}
                {report.reportCategory}
              </div>
              <div>
                <span className="font-medium">Reason:</span> {report.reason}
              </div>
            </div>
          </div>

          {/* Resolution Action */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Resolution Action *
            </label>
            <div className="space-y-2">
              {resolutionActions.map((action) => (
                <label
                  key={action.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAction === action.value
                      ? action.color
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="action"
                    value={action.value}
                    checked={selectedAction === action.value}
                    onChange={(e) => setSelectedAction(e.target.value)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {action.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Resolution Reason *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain the reasoning behind this resolution..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              required
            />
          </div>

          {/* Admin Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Internal Admin Notes
              <span className="text-gray-500 font-normal"> (Optional)</span>
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add any internal notes for future reference..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={2}
            />
          </div>

          {/* Follow-up Required */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="followUp"
              checked={followUpRequired}
              onChange={(e) => setFollowUpRequired(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="followUp" className="text-sm text-gray-700">
              <span className="font-medium">Follow-up required</span>
              <div className="text-xs text-gray-600 mt-1">
                Check this if additional monitoring or action may be needed
              </div>
            </label>
          </div>

          {/* Warning for severe actions */}
          {(selectedAction === "user_suspended" ||
            selectedAction === "user_banned") && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    Severe Action Warning
                  </h4>
                  <p className="text-sm text-red-700 mt-1">
                    This action will significantly impact the user's account.
                    Please ensure you have thoroughly reviewed the evidence and
                    followed proper escalation procedures.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedAction || !reason.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Resolve Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
