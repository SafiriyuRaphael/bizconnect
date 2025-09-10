import formatPrice from "@/shared/utils/formatPrice";
import { AlertTriangle, Upload, X, ChevronDown, Trash2 } from "lucide-react";
import React, { useState, useRef } from "react";
import { useEscrowStore } from "../../store";
import getFileIcon from "@/shared/components/composites/getFileIcon";
import formatFileSize from "@/shared/utils/formatFileSize";
import { ALLOWED_TYPES, DISPUTE_REASONS, MAX_FILE_SIZE } from "../../constants";
import useEscrow from "../../hooks";

export default function DisputeModal() {
  const {
    selectedDispute,
    setIsDropdownOpen,
    setDisputeEvidence,
    disputeEvidence,
    disputeReason,
    uploadedFiles,
    handleClose,
    isDropdownOpen,
    isUploading,
    uploadError,
  } = useEscrowStore();
  const {
    removeFile,
    handleDisputeFileUpload,
    handleReasonSelect,
    disputeMutation,
    fileInputRef,
    handleDisputeSubmit,
  } = useEscrow();

  if (!selectedDispute) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              {selectedDispute.isDisputed ? "Dispute Response" : "Open Dispute"}
            </h4>
            <p className="text-gray-500">
              {selectedDispute.isDisputed
                ? "Respond to Dispute"
                : "Transaction requires attention"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-red-900 mb-2">
                  {selectedDispute.isDisputed
                    ? "Disputed Transaction"
                    : "Opening Dispute"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-red-800">
                      <strong>Project:</strong> {selectedDispute.itemId.title}
                    </p>
                    <p className="text-red-800">
                      <strong>Amount:</strong>{" "}
                      {formatPrice(selectedDispute.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-red-800">
                      <strong>Buyer:</strong> {selectedDispute.buyerId.fullName}
                    </p>
                    <p className="text-red-800">
                      <strong>Seller:</strong>{" "}
                      {selectedDispute.sellerId.fullName}
                    </p>
                  </div>
                </div>
                {!selectedDispute.isDisputed && (
                  <p className="text-sm text-red-700 mt-3 p-2 bg-red-100 rounded">
                    <strong>Note:</strong> Opening a dispute will suspend
                    auto-release and require manual resolution.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dispute Reason Dropdown */}
          {!selectedDispute.isDisputed && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispute Reason *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-left flex items-center justify-between"
                >
                  <span
                    className={
                      disputeReason ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {disputeReason
                      ? DISPUTE_REASONS.find((r) => r.value === disputeReason)
                          ?.label
                      : "Select a reason..."}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {DISPUTE_REASONS.map((reason) => (
                      <button
                        key={reason.value}
                        type="button"
                        onClick={() => handleReasonSelect(reason.value)}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                          reason.value === ""
                            ? "text-gray-500"
                            : "text-gray-900"
                        } ${
                          disputeReason === reason.value
                            ? "bg-red-50 text-red-900"
                            : ""
                        }`}
                        disabled={reason.value === ""}
                      >
                        {reason.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedDispute.isDisputed
                ? "Response & Evidence"
                : "Additional Details"}
            </label>
            <textarea
              value={disputeEvidence}
              onChange={(e) => setDisputeEvidence(e.target.value)}
              placeholder={
                selectedDispute.isDisputed
                  ? "Share your side of the story. Include evidence links, screenshots, message refs, timestamps—anything that supports your response..."
                  : "Provide additional details about the issue, include relevant information, screenshots, or evidence that supports your dispute..."
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={5}
            />
          </div>

          {/* File Upload Section */}
          <div>
            <div
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload
                className={`w-5 h-5 ${
                  isUploading ? "text-blue-500" : "text-gray-500"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {isUploading ? "Uploading..." : "Upload Supporting Documents"}
                </p>
                <p className="text-xs text-gray-500">
                  Screenshots, communications, contracts, or other evidence (Max
                  10MB each)
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
              onChange={handleDisputeFileUpload}
              className="hidden"
              disabled={isUploading}
            />

            {uploadError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {uploadError}
              </div>
            )}

            {/* Uploaded Files Display */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Uploaded Files ({uploadedFiles.length})
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-8 h-8 object-cover rounded flex-shrink-0"
                          />
                        ) : (
                          getFileIcon({ fileName: file.type })
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleDisputeSubmit(selectedDispute)}
              disabled={
                isUploading ||
                (selectedDispute.isDisputed
                  ? !disputeEvidence.trim()
                  : !disputeReason || !disputeEvidence.trim()) ||
                disputeMutation.isPending
              }
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isUploading || disputeMutation.isPending
                ? "Uploading..."
                : selectedDispute.isDisputed
                ? "Submit Resolution"
                : "Open Dispute"}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg border border-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
