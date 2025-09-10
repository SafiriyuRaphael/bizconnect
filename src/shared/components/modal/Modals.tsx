import { X, Sparkles, Heart, Star, Zap, Info } from "lucide-react";
import React, { useState, useEffect, MouseEvent, KeyboardEvent } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  variant?: "default" | "premium" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg" | "xl";
  showPattern?: boolean;
  showGlow?: boolean;
  blurIntensity?: "light" | "medium" | "heavy";
}

export default function Modals({
  isOpen,
  onClose,
  title,
  children,
  variant = "default",
  size = "md",
  showPattern = true,
  showGlow = true,
  blurIntensity = "medium",
}: ModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "unset";
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown as any);
      return () =>
        document.removeEventListener("keydown", handleKeyDown as any);
    }
  }, [isOpen]);

  const getVariantStyles = () => {
    switch (variant) {
      case "premium":
        return {
          background:
            "bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-pink-900/95",
          border: "border-purple-400/30",
          headerGradient: "from-purple-600 via-indigo-600 to-pink-600",
          textColor: "text-white",
          glow: "shadow-purple-500/25",
          pattern: "from-purple-400/10 via-indigo-400/10 to-pink-400/10",
        };
      case "success":
        return {
          background:
            "bg-gradient-to-br from-emerald-50/95 via-green-50/95 to-teal-50/95",
          border: "border-emerald-300/40",
          headerGradient: "from-emerald-500 via-green-500 to-teal-500",
          textColor: "text-emerald-900",
          glow: "shadow-emerald-500/20",
          pattern: "from-emerald-400/15 via-green-400/15 to-teal-400/15",
        };
      case "warning":
        return {
          background:
            "bg-gradient-to-br from-amber-50/95 via-yellow-50/95 to-orange-50/95",
          border: "border-amber-300/40",
          headerGradient: "from-amber-500 via-yellow-500 to-orange-500",
          textColor: "text-amber-900",
          glow: "shadow-amber-500/20",
          pattern: "from-amber-400/15 via-yellow-400/15 to-orange-400/15",
        };
      case "error":
        return {
          background:
            "bg-gradient-to-br from-red-50/95 via-rose-50/95 to-pink-50/95",
          border: "border-red-300/40",
          headerGradient: "from-red-500 via-rose-500 to-pink-500",
          textColor: "text-red-900",
          glow: "shadow-red-500/20",
          pattern: "from-red-400/15 via-rose-400/15 to-pink-400/15",
        };
      default:
        return {
          background:
            "bg-gradient-to-br from-slate-50/95 via-gray-50/95 to-zinc-50/95",
          border: "border-slate-300/40",
          headerGradient: "from-slate-600 via-gray-600 to-zinc-600",
          textColor: "text-slate-900",
          glow: "shadow-slate-500/20",
          pattern: "from-slate-400/15 via-gray-400/15 to-zinc-400/15",
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-2xl";
      default:
        return "max-w-md";
    }
  };

  const getBlurStyles = () => {
    switch (blurIntensity) {
      case "light":
        return "backdrop-blur-sm";
      case "medium":
        return "backdrop-blur-md";
      case "heavy":
        return "backdrop-blur-xl";
      default:
        return "backdrop-blur-md";
    }
  };

  if (!isVisible) return null;

  const styles = getVariantStyles();

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ease-out ${
        isAnimating
          ? `bg-black/60 ${getBlurStyles()}`
          : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full ${getSizeStyles()} transform transition-all duration-500 ease-out ${
          isAnimating
            ? "scale-100 opacity-100 translate-y-0 rotate-0"
            : "scale-75 opacity-0 translate-y-12 rotate-1"
        }`}
        onMouseMove={handleMouseMove}
      >
        <div
          className={`relative ${styles.background} ${
            styles.border
          } border-2 ${getBlurStyles()} rounded-3xl ${
            showGlow ? `shadow-2xl ${styles.glow}` : "shadow-2xl"
          } overflow-hidden`}
          style={{
            background:
              variant === "premium"
                ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, transparent 50%), linear-gradient(135deg, rgba(139,69,19,0.1) 0%, rgba(75,0,130,0.95) 25%, rgba(30,144,255,0.95) 75%, rgba(255,20,147,0.95) 100%)`
                : undefined,
          }}
        >
          {/* Dynamic Background Pattern */}
          {showPattern && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 60% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
                  radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 0%, transparent 50%)
                `,
                animation: "float 6s ease-in-out infinite alternate",
              }}
            />
          )}

          {/* Animated Border */}
          <div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: `conic-gradient(from 0deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
              animation: "spin 8s linear infinite",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              padding: "2px",
            }}
          />

          {/* Header */}
          <div className="relative p-8 pb-6">
            <div
              className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${styles.headerGradient} opacity-10 blur-2xl`}
            />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`p-3 bg-gradient-to-r ${styles.headerGradient} rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-12`}
                >
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold ${styles.textColor} leading-tight`}
                  >
                    {title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-3 rounded-2xl hover:bg-white/20 active:bg-white/30 transition-all duration-300 hover:scale-110 active:scale-95 group ${
                  variant === "premium"
                    ? "text-white/80 hover:text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ animation: "pulse 3s ease-in-out infinite" }}
              >
                <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative px-8 pb-8">
            <div className="relative z-10">{children}</div>
          </div>

          {/* Interactive Glow Effect */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3) 0%, transparent 60%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
