import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  AlertCircle,
  Eye,
  Clock,
  User,
  Building,
  Phone,
  MapPin,
  FileText,
  Camera,
  CreditCard,
  ExternalLink,
  Calendar,
  Shield,
  XCircle,
} from "lucide-react";
import {
  BusinessVerificationType,
  VerificationLogType,
} from "../../../../../types";
import verifyBusiness from "@/lib/admin/verifyBusiness";
import getVerificationDetails from "@/lib/business/getVerificationDetails";
import formatDate from "@/lib/static/formatDate";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onVerificationUpdate: () => void;
  verification: BusinessVerificationType;
  verificationLogs?: VerificationLogType;
  verifiedBusiness?: boolean;
};

export default function VerificationAdminModal({
  isOpen,
  onClose,
  onVerificationUpdate,
  verification,
  verificationLogs,
  verifiedBusiness,
}: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  console.log(verificationLogs);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await verifyBusiness({
        verificationId: verification._id,
        action: "approve",
      });
      console.log("Verification approved");
      onVerificationUpdate?.();
      onClose();
    } catch (error) {
      console.error("Error approving verification:", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setProcessing(true);
    try {
      await verifyBusiness({
        verificationId: verification._id,
        action: "reject",
        reason: rejectReason,
      });
      console.log("Verification rejected:", rejectReason);
      onVerificationUpdate?.();
      setShowRejectModal(false);
      setRejectReason("");
      onClose();
    } catch (error) {
      console.error("Error rejecting verification:", error);
    } finally {
      setProcessing(false);
    }
  };

  const formatIdType = (type: string) => {
    const types = {
      driver_license: "Driver's License",
      national_id_card: "National ID Card",
      voters_card: "Voter's Card",
      international_passport: "International Passport",
    };
    return types[type as keyof typeof types] || type;
  };

  if (!isOpen) return null;

  const business = { verifiedBusiness, verificationData: verification };

  let verifiedLog: boolean;
  verifiedLog = verificationLogs?.status === "approved" ? true : false;

  const verificationLogStatus = {
    verifiedBusiness: verifiedLog,
    verificationData: verificationLogs,
  };

  const statusConfig = getVerificationDetails(business);

  const logStatusConfig = getVerificationDetails(verificationLogStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Business Verification Review
              </h2>
              <p className="text-sm text-gray-600">
                ID: {verification._id?.slice(-8) || "N/A"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${statusConfig.color}`}
            >
              {statusConfig.icon}
              <span className="font-medium text-sm">{statusConfig.text}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {verification ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
              {[
                { id: "overview", label: "Overview", icon: Eye },
                { id: "documents", label: "Documents", icon: FileText },
                {
                  id: "verificationlogs",
                  label: `Verification Log (${verificationLogs ? "1" : "0"})`,
                  icon: Clock,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600 bg-blue-50"
                      : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              {activeTab === "overview" && (
                <div className="p-6 space-y-8">
                  {/* Status & Timing */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Submitted
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(verification.submittedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Status
                          </p>
                          <p className="text-sm text-gray-600">
                            {statusConfig.text}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Documents
                          </p>
                          <p className="text-sm text-gray-600">
                            {
                              [
                                verification.idDocument?.idUrl,
                                verification.selfieUrl,
                                verification.businessLogo,
                                verification.documentUrl,
                              ].filter(Boolean).length
                            }{" "}
                            files
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Personal Information
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <p className="text-gray-900 font-medium">
                            {verification.fullName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ID Type
                          </label>
                          <p className="text-gray-900">
                            {formatIdType(
                              verification.idDocument?.idType || ""
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Business Information */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Building className="w-5 h-5 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Business Information
                        </h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Name
                          </label>
                          <p className="text-gray-900 font-medium">
                            {verification.businessName || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            Address
                          </label>
                          <p className="text-gray-900">
                            {verification.businessAddress || "Not provided"}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            Phone Number
                          </label>
                          <p className="text-gray-900">
                            {verification.businessPhone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {verification.status === "rejected" &&
                    verification.reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-red-900 mb-2">
                              Rejection Reason
                            </h4>
                            <p className="text-red-800">
                              {verification.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  {/* Acceptance Reason */}
                  {verification.status === "approved" &&
                    verification.reason && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Approval Reason
                            </h4>
                            <p className="text-gray-800">
                              {verification.reason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}

              {activeTab === "documents" && (
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Submitted Documents
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* ID Document */}
                    {verification.idDocument?.idUrl && (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-50 relative overflow-hidden">
                          <img
                            src={verification.idDocument.idUrl}
                            alt="ID Document"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                              ID Document
                            </h4>
                            <a
                              href={verification.idDocument.idUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatIdType(verification.idDocument.idType)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Selfie */}
                    {verification.selfieUrl && (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-50 relative overflow-hidden">
                          <img
                            src={verification.selfieUrl}
                            alt="Selfie"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <Camera className="w-4 h-4 mr-2 text-green-600" />
                              Identity Selfie
                            </h4>
                            <a
                              href={verification.selfieUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-600">
                            Video verification
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Business Logo */}
                    {verification.businessLogo && (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                          <img
                            src={verification.businessLogo}
                            alt="Business Logo"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <Building className="w-4 h-4 mr-2 text-purple-600" />
                              Business Logo
                            </h4>
                            <a
                              href={verification.businessLogo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-600">
                            Company branding
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Supporting Document */}
                    {verification.documentUrl && (
                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-50 relative overflow-hidden flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900 flex items-center">
                              <FileText className="w-4 h-4 mr-2 text-orange-600" />
                              Supporting Document
                            </h4>
                            <a
                              href={verification.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-600">
                            Additional documentation
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {![
                    verification.idDocument?.idUrl,
                    verification.selfieUrl,
                    verification.businessLogo,
                    verification.documentUrl,
                  ].some(Boolean) && (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No documents uploaded</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "verificationlogs" && (
                <div className="p-6 space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Verification Timeline
                  </h3>

                  {verificationLogs ? (
                    <div className="space-y-4">
                      <div className="relative pl-8">
                        <div className="absolute left-2 top-2 w-4 h-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              verificationLogs.status === "approved"
                                ? "bg-green-500"
                                : verificationLogs.status === "rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          />
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className={`flex items-center space-x-2 px-2 py-1 rounded text-xs font-medium ${logStatusConfig.color}`}
                            >
                              {logStatusConfig.icon}
                              <span>{logStatusConfig.text}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(verificationLogs.modifiedAt)}
                            </span>
                          </div>

                          {/* Display actual verification data */}
                          <div className="text-sm text-gray-600 space-y-1">
                            {verificationLogs.fullName && (
                              <p>
                                <strong>Name:</strong>{" "}
                                {verificationLogs.fullName}
                              </p>
                            )}
                            {verificationLogs.businessName && (
                              <p>
                                <strong>Business:</strong>{" "}
                                {verificationLogs.businessName}
                              </p>
                            )}
                            {verificationLogs.idDocument?.idType && (
                              <p>
                                <strong>ID Type:</strong>{" "}
                                {verificationLogs.idDocument.idType
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </p>
                            )}
                            {verificationLogs.submittedAt && (
                              <p>
                                <strong>Submitted:</strong>{" "}
                                {formatDate(verificationLogs.submittedAt)}
                              </p>
                            )}
                            {verificationLogs.verifiedAt && (
                              <p>
                                <strong>Verified:</strong>{" "}
                                {formatDate(verificationLogs.verifiedAt)}
                              </p>
                            )}
                          </div>

                          {verificationLogs.reason && (
                            <p className="text-gray-700 text-sm mt-2 p-2 bg-gray-50 rounded">
                              <strong>Note:</strong> {verificationLogs.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        No verificationlogs logs found
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}

            {(verification.status === "pending" ||
              verification.status === "approved") && (
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Review all information carefully before making a decision
                </div>
                {verification.status === "pending" && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={processing}
                      className="px-6 py-2.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={handleApprove}
                      disabled={processing}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center font-medium"
                    >
                      {processing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Check className="w-4 h-4 mr-2" />
                      )}
                      Approve Application
                    </button>
                  </div>
                )}
                {verification.status === "approved" && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={processing}
                      className="px-6 py-2.5 text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                    >
                      Revoke Verification
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-500">Failed to load verification data</p>
            </div>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-sm p-4 bg-black/60">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Reject Application
              </h3>
              <p className="text-gray-600 mt-1">
                Please provide a clear reason for rejecting this verification
                request.
              </p>
            </div>
            <div className="p-6">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this application is being rejected..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {rejectReason.length}/500 characters
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim() || processing}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center font-medium transition-colors"
              >
                {processing ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
