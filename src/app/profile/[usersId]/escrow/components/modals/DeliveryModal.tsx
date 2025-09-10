import formatPrice from "@/shared/utils/formatPrice";
import { Package, Timer, X, Upload, Link } from "lucide-react";
import { useEscrowStore } from "../../store";
import formatFileSize from "@/shared/utils/formatFileSize";
import getFileIcon from "@/shared/components/composites/getFileIcon";
import useEscrow from "../../hooks";

export default function DeliveryModal() {
  const {
    deliveryProof,
    selectedEscrow,
    setDeliveryProof,
    deliveryFiles,
    proofType,
    setProofType,
    removeFile,
    resetModal,
    loading,
  } = useEscrowStore();

  const { handleFileUpload, handleConfirmDelivery, updateMutation } =
    useEscrow();

  if (!selectedEscrow) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              Mark as Delivered
            </h4>
            <p className="text-gray-500">
              Confirm delivery and provide proof of completion
            </p>
          </div>
          <button
            onClick={resetModal}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Package className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-blue-900 mb-2">
                  Project: {selectedEscrow?.itemId.title}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-blue-800">
                      <strong>Amount:</strong>{" "}
                      {formatPrice(selectedEscrow?.price)}
                    </p>
                    <p className="text-blue-800">
                      <strong>Buyer:</strong> {selectedEscrow.buyerId.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-800">
                      <strong>Current Status:</strong> Funded
                    </p>
                    <p className="text-blue-800">
                      <strong>Auto-release:</strong> 5 days after delivery
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start space-x-3">
              <Timer className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-900 mb-1">
                  Important: Auto-release Policy
                </p>
                <p className="text-sm text-amber-800">
                  Once marked as delivered, the buyer will have{" "}
                  <strong>5 days</strong> to review and either confirm or
                  dispute the delivery. If no action is taken, funds will
                  automatically be released to you.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Proof{" "}
              <span className="text-gray-500">(optional but recommended)</span>
            </label>

            {/* Proof Type Selector */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setProofType("url")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  proofType === "url"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Link className="w-4 h-4" />
                <span className="text-sm">Link/URL</span>
              </button>
              <button
                type="button"
                onClick={() => setProofType("file")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  proofType === "file"
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload Files</span>
              </button>
            </div>

            {/* URL Input */}
            {proofType === "url" && (
              <div>
                <input
                  type="url"
                  value={deliveryProof}
                  onChange={(e) => setDeliveryProof([e.target.value])}
                  placeholder="https://github.com/repo, https://drive.google.com/file, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a link to the completed work, repository, files, or
                  other proof of delivery
                </p>
              </div>
            )}

            {/* File Upload */}
            {proofType === "file" && (
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    Images, PDFs, documents up to 10MB each (max 3 files)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
                </div>

                {/* File List */}
                {deliveryFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Selected Files ({deliveryFiles.length})
                    </p>
                    {deliveryFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          {getFileIcon({ fileName: file.name })}
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleConfirmDelivery}
              disabled={
                (proofType === "url" &&
                  !deliveryProof &&
                  deliveryFiles.length === 0) ||
                loading ||
                updateMutation.isPending
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {loading ? "Marking as Delivered..." : "Confirm Delivery"}
            </button>
            <button
              onClick={resetModal}
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
