import { useCallback, useMemo } from "react";
import { useUserDashboardStore } from "@/app/[businessprofile]/store";
import useCollections from "@/shared/hooks/useCollections";
import { Heart } from "lucide-react";
import { useTailwindBreakpoints } from "@/shared/hooks/useWindowScreenSize";

interface FavoritesProps {
  showText?: boolean;
  businessId: string;
  variant?: "default" | "compact" | "floating";
  disabled?: boolean;
  type?: "favorite" | "wishlist";
}

export default function Favorites({
  showText = true,
  businessId,
  variant = "default",
  disabled = false,
  type = "favorite",
}: FavoritesProps) {
  const { isSm } = useTailwindBreakpoints();
  const { toggleFavorite, collections } = useCollections();

  const isFavorited = useMemo(
    () => collections?.some((c) => c.refId === businessId) ?? false,
    [collections, businessId]
  );

  const handleClick = useCallback(() => {
    if (disabled) return;

    toggleFavorite({
      refId: businessId,
      type: type,
    });
  }, [businessId, disabled, toggleFavorite]);

  // Memoize button text logic
  const buttonText = useMemo(() => {
    if (!showText) return "";

    if (!isSm) return "Save";
    return isFavorited ? "Saved" : "Save";
  }, [showText, isSm, isFavorited]);

  // Memoize styling classes with modern design
  const buttonClasses = useMemo(() => {
    const baseClasses =
      "group relative flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95";

    let sizeClasses, designClasses;

    if (variant === "floating") {
      sizeClasses = "p-3 rounded-full shadow-lg";
      designClasses = isFavorited
        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 focus:ring-pink-500"
        : "bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-700 hover:bg-white hover:shadow-xl hover:scale-105 focus:ring-gray-500";
    } else if (variant === "compact") {
      sizeClasses = "px-3 py-2 rounded-xl text-sm";
      designClasses = isFavorited
        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm hover:shadow-md hover:from-pink-600 hover:to-rose-600 focus:ring-pink-500"
        : "bg-gray-50/80 border border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-sm focus:ring-gray-500";
    } else {
      sizeClasses =
        "flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 rounded-xl text-sm";
      designClasses = isFavorited
        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-sm hover:shadow-md hover:from-pink-600 hover:to-rose-600 transform hover:-translate-y-0.5 focus:ring-pink-500"
        : "bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transform hover:-translate-y-0.5 focus:ring-gray-500";
    }

    const disabledClasses = disabled
      ? "opacity-50 cursor-not-allowed transform-none hover:transform-none"
      : "cursor-pointer";

    return `${baseClasses} ${sizeClasses} ${designClasses} ${disabledClasses}`;
  }, [variant, isFavorited, disabled]);

  const heartClasses = useMemo(() => {
    const baseSize = variant === "floating" ? "w-5 h-5" : "w-4 h-4";
    const baseClasses = `${baseSize} transition-all duration-300 ease-out`;

    const stateClasses = isFavorited
      ? "fill-current scale-110"
      : "group-hover:scale-110 group-hover:text-pink-500";

    return `${baseClasses} ${stateClasses}`;
  }, [isFavorited, variant]);

  const textClasses = useMemo(() => {
    const baseClasses = "transition-all duration-200";
    const responsiveClasses = variant === "compact" ? "hidden sm:inline" : "";

    return `${baseClasses} ${responsiveClasses}`;
  }, [variant]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Animated background for unfavorited state */}
      {!isFavorited && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}

      <Heart className={heartClasses} />

      {buttonText && <span className={textClasses}>{buttonText}</span>}

      {/* Subtle glow effect for favorited state */}
      {isFavorited && variant !== "compact" && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl blur opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-300" />
      )}
    </button>
  );
}
