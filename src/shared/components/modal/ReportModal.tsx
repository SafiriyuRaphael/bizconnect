import { REPORT_CATEGORIES } from "@/shared/constants/report";
import useReport from "@/shared/hooks/useReport";
import { X, Flag, Shield } from "lucide-react";
import { useCallback, useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUser: {
    _id: string;
    fullName: string;
    businessName?: string;
    username: string;
    userType: "business" | "customer";
  };
}
export default function ReportModal({
  isOpen,
  onClose,
  reportedUser,
}: ReportModalProps) {
  const { createReportMutation } = useReport();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [details, setDetails] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!selectedCategory || createReportMutation.isPending) return;
    try {
      const category = REPORT_CATEGORIES.find(
        (cat) => cat.id === selectedCategory
      );
      if (!category) return;
      createReportMutation.mutate({
        title: category?.label,
        reason: details.trim(),
        targetId: reportedUser._id,
        targetType: "user",
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  }, [
    selectedCategory,
    details,
    reportedUser._id,
    onClose,
    createReportMutation.isPending,
  ]);

  const handleClose = useCallback(() => {
    if (createReportMutation.isPending) return;
    onClose();
    // Reset state after animation
    setTimeout(() => {
      setSelectedCategory("");
      setDetails("");
      createReportMutation.reset();
    }, 300);
  }, [onClose, createReportMutation.isPending]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-white md:rounded-2xl shadow-2xl w-full md:max-w-lg mx-4 animate-in zoom-in-95 duration-300 h-screen md:max-h-[90vh] overflow-y-scroll thin-scroll ${
          createReportMutation.isSuccess ? "hide-scroll" : ""
        }`}
      >
        {createReportMutation.isSuccess ? (
          // Success State
          <div className="p-8 text-center ">
            <div
              role="button"
              tabIndex={0}
              className="text-red-400 hover:text-red-300 cursor-pointer justify-self-end "
              onClick={handleClose}
            >
              <X />
            </div>

            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Report Submitted
            </h3>
            <p className="text-gray-600 mb-4">
              Thanks for helping keep our community safe. We'll review your
              report and take appropriate action.
            </p>
            <div className="w-full bg-green-500 h-1 rounded-full animate-pulse" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Report{" "}
                  {reportedUser.userType === "business" ? "Business" : "User"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Report @{reportedUser.username}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={createReportMutation.isPending}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">
                  What's the issue?
                </h3>
                <div className="space-y-2">
                  {REPORT_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        disabled={createReportMutation.isPending}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 disabled:opacity-50 ${
                          isSelected
                            ? "border-red-300 bg-red-50 shadow-sm"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected ? "bg-red-100" : "bg-gray-100"
                            }`}
                          >
                            <Icon
                              className={`w-4 h-4 ${
                                isSelected ? "text-red-600" : "text-gray-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className={`font-medium ${
                                isSelected ? "text-red-900" : "text-gray-900"
                              }`}
                            >
                              {category.label}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedCategory && (
                <div className="animate-in slide-in-from-top duration-300">
                  <label className="block font-medium text-gray-900 mb-2">
                    Additional Details (Optional)
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={createReportMutation.isPending}
                    placeholder="Provide any additional context that might help us understand the issue..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none disabled:opacity-50"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Help us understand what happened
                    </p>
                    <span className="text-xs text-gray-500">
                      {details.length}/500
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
              <button
                onClick={handleClose}
                disabled={createReportMutation.isPending}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedCategory || createReportMutation.isPending}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {createReportMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
