"use client";
import React, { useState, useEffect, MouseEvent, KeyboardEvent } from "react";
import {
  X,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Info,
  CheckCircle,
  LucideIcon,
} from "lucide-react";
import { useMessageModalStore } from "@/shared/store/useMessageModalStore";

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
  icon: LucideIcon;
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  titleColor: string;
  messageColor: string;
  progressColor: string;
  glowColor: string;
}

export default function MessageModal() {
  const {
    isOpen,
    onClose,
    title,
    message,
    type,
    actions,
    autoClose,
    autoCloseDelay,
    showIcon,
    closable,
  } = useMessageModalStore();
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
      const handler = (e: KeyboardEvent<HTMLDivElement>) => handleKeyDown(e);
      document.addEventListener("keydown", handler as unknown as EventListener);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener(
          "keydown",
          handler as unknown as EventListener
        );
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, closable, handleKeyDown]);

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
      className={`fixed inset-0 z-[80] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
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
