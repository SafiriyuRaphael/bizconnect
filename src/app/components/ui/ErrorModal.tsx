import React, { useState, useEffect, MouseEvent, KeyboardEvent } from "react";
import {
  X,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Info,
  CheckCircle,
} from "lucide-react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  type?: "error" | "warning" | "info" | "success";
  actions?: React.ReactNode;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showIcon?: boolean;
  closable?: boolean;
}

interface IconAndColors {
  icon: React.ComponentType<any>;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  messageColor: string;
  progressColor: string;
  glowColor: string;
}

export default function EnhancedMessageModal({
  isOpen,
  onClose,
  title = "Notification",
  message = "Something happened that requires your attention.",
  type = "info",
  actions = null,
  autoClose = false,
  autoCloseDelay = 5000,
  showIcon = true,
  closable = true,
}: MessageModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && autoClose) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, autoCloseDelay - elapsed);
        setProgress((remaining / autoCloseDelay) * 100);

        if (remaining <= 0) {
          clearInterval(interval);
          onClose();
        }
      }, 16);

      return () => clearInterval(interval);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const getIconAndColors = (): IconAndColors => {
    switch (type) {
      case "error":
        return {
          icon: XCircle,
          bgGradient: "from-red-50 via-white to-red-50/30",
          borderColor: "border-red-200/60",
          iconBg: "bg-gradient-to-br from-red-500 to-red-600",
          iconColor: "text-white",
          titleColor: "text-red-900",
          messageColor: "text-red-700",
          progressColor: "bg-gradient-to-r from-red-500 to-red-600",
          glowColor: "shadow-red-500/20",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          bgGradient: "from-amber-50 via-white to-amber-50/30",
          borderColor: "border-amber-200/60",
          iconBg: "bg-gradient-to-br from-amber-500 to-amber-600",
          iconColor: "text-white",
          titleColor: "text-amber-900",
          messageColor: "text-amber-700",
          progressColor: "bg-gradient-to-r from-amber-500 to-amber-600",
          glowColor: "shadow-amber-500/20",
        };
      case "success":
        return {
          icon: CheckCircle,
          bgGradient: "from-emerald-50 via-white to-emerald-50/30",
          borderColor: "border-emerald-200/60",
          iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600",
          iconColor: "text-white",
          titleColor: "text-emerald-900",
          messageColor: "text-emerald-700",
          progressColor: "bg-gradient-to-r from-emerald-500 to-emerald-600",
          glowColor: "shadow-emerald-500/20",
        };
      case "info":
        return {
          icon: Info,
          bgGradient: "from-blue-50 via-white to-blue-50/30",
          borderColor: "border-blue-200/60",
          iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
          iconColor: "text-white",
          titleColor: "text-blue-900",
          messageColor: "text-blue-700",
          progressColor: "bg-gradient-to-r from-blue-500 to-blue-600",
          glowColor: "shadow-blue-500/20",
        };
      default:
        return {
          icon: AlertCircle,
          bgGradient: "from-slate-50 via-white to-slate-50/30",
          borderColor: "border-slate-200/60",
          iconBg: "bg-gradient-to-br from-slate-500 to-slate-600",
          iconColor: "text-white",
          titleColor: "text-slate-900",
          messageColor: "text-slate-700",
          progressColor: "bg-gradient-to-r from-slate-500 to-slate-600",
          glowColor: "shadow-slate-500/20",
        };
    }
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && closable) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && closable) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const handler = (e: any) => handleKeyDown(e);
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handler);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, closable]);

  if (!isVisible) return null;

  const {
    icon: Icon,
    bgGradient,
    borderColor,
    iconBg,
    iconColor,
    titleColor,
    messageColor,
    progressColor,
    glowColor,
  } = getIconAndColors();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isAnimating
          ? "bg-black/40 backdrop-blur-md"
          : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md transform transition-all duration-300 ease-out ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-90 opacity-0 translate-y-8"
        }`}
      >
        <div
          className={`relative bg-gradient-to-br ${bgGradient} ${borderColor} border backdrop-blur-xl rounded-2xl shadow-2xl ${glowColor} overflow-hidden`}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-start justify-between p-6 pb-4">
            <div className="flex items-start space-x-4">
              {showIcon && (
                <div
                  className={`flex-shrink-0 ${iconBg} p-3 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-105`}
                >
                  <Icon size={20} className={iconColor} />
                </div>
              )}
              <div className="flex-1 pt-1">
                <h3 className={`text-xl font-bold ${titleColor} leading-tight`}>
                  {title}
                </h3>
              </div>
            </div>
            {closable && (
              <button
                onClick={onClose}
                className="flex-shrink-0 p-2 rounded-xl hover:bg-black/5 active:bg-black/10 transition-all duration-200 hover:scale-110 active:scale-95 group"
              >
                <X
                  size={18}
                  className="text-slate-400 group-hover:text-slate-600 transition-colors"
                />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="relative px-6 pb-6">
            <p
              className={`text-base ${messageColor} leading-relaxed font-medium`}
            >
              {message}
            </p>
          </div>

          {/* Actions */}
          {actions && (
            <div className="relative px-6 py-4 border-t border-white/20 bg-white/30 backdrop-blur-sm">
              <div className="flex justify-end space-x-3">{actions}</div>
            </div>
          )}

          {/* Auto-close progress bar */}
          {autoClose && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 overflow-hidden">
              <div
                className={`h-full ${progressColor} transition-all duration-75 ease-linear shadow-sm`}
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          )}

          {/* Animated border glow */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
              animation: "shimmer 3s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          50% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
          100% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}

// Demo component to showcase the modal
function ModalDemo() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (type: string) => setActiveModal(type);
  const closeModal = () => setActiveModal(null);

  const actionButtons = (
    <>
      <button
        onClick={closeModal}
        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={closeModal}
        className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200"
      >
        Confirm
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Enhanced Message Modal
          </h1>
          <p className="text-lg text-slate-600">
            Click the buttons below to test different modal types
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => openModal("error")}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-red-100 hover:border-red-200 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <XCircle className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Error Modal
            </h3>
            <p className="text-sm text-slate-600">Show error messages</p>
          </button>

          <button
            onClick={() => openModal("warning")}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-amber-100 hover:border-amber-200 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Warning Modal
            </h3>
            <p className="text-sm text-slate-600">Show warning messages</p>
          </button>

          <button
            onClick={() => openModal("success")}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-emerald-100 hover:border-emerald-200 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <CheckCircle className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Success Modal
            </h3>
            <p className="text-sm text-slate-600">Show success messages</p>
          </button>

          <button
            onClick={() => openModal("info")}
            className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-100 hover:border-blue-200 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
              <Info className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Info Modal
            </h3>
            <p className="text-sm text-slate-600">Show info messages</p>
          </button>
        </div>

        <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Additional Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => openModal("autoClose")}
              className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Auto-Close Modal (3s)
            </button>
            <button
              onClick={() => openModal("withActions")}
              className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:from-indigo-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Modal with Actions
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EnhancedMessageModal
        isOpen={activeModal === "error"}
        onClose={closeModal}
        type="error"
        title="Operation Failed"
        message="We encountered an error while processing your request. Please check your connection and try again."
      />

      <EnhancedMessageModal
        isOpen={activeModal === "warning"}
        onClose={closeModal}
        type="warning"
        title="Warning"
        message="This action may have unintended consequences. Please review your settings before proceeding."
      />

      <EnhancedMessageModal
        isOpen={activeModal === "success"}
        onClose={closeModal}
        type="success"
        title="Success!"
        message="Your changes have been saved successfully. You can now continue with your workflow."
      />

      <EnhancedMessageModal
        isOpen={activeModal === "info"}
        onClose={closeModal}
        type="info"
        title="Information"
        message="We've updated our privacy policy. Please take a moment to review the changes that affect how we handle your data."
      />

      <EnhancedMessageModal
        isOpen={activeModal === "autoClose"}
        onClose={closeModal}
        type="info"
        title="Auto-Closing Modal"
        message="This modal will automatically close in 3 seconds. You can still close it manually if needed."
        autoClose={true}
        autoCloseDelay={3000}
      />

      <EnhancedMessageModal
        isOpen={activeModal === "withActions"}
        onClose={closeModal}
        type="warning"
        title="Confirm Action"
        message="Are you sure you want to delete this item? This action cannot be undone."
        actions={actionButtons}
      />
    </div>
  );
}

export { ModalDemo };
