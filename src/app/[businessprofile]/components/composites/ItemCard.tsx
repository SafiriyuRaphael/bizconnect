import generateDefaultLogoDataUrl from "@/shared/utils/generateDefaultLogoDataUrl";
import { AnyUser, ProductsItem } from "../../../../../types";
import {
  CheckCircle,
  Clock,
  CreditCard,
  Eye,
  Heart,
  MessageCircle,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Users,
  XCircle,
} from "lucide-react";
import formatPrice from "@/shared/utils/formatPrice";
import useUserDashboardActions from "../../hooks";
import { useProductStore } from "@/shared/store/useProductsStore";
import { useUserDashboardStore } from "../../store";
import Favorites from "@/shared/components/ui/Favorites";

export default function ItemCard({ item }: { item: ProductsItem }) {
  const { handleViewItem, handleChatClick } = useUserDashboardActions();
  const { user } = useUserDashboardStore();
  const { setShowPaymentModal, setItemData } = useProductStore();

  if (!user) return null;

  const itemdata = {
    _id: item._id,
    title: item.title,
    description: item.description,
    price: item.price,
    media: item.media,
    userId: user._id,
    type: item.type,
    deliveryTime: item.deliveryTime,
    useEscrow: item.useEscrow,
    isAvailable: item.isAvailable,
    user: {
      ...user,
      displayPics: user.displayPics || [],
      logo: user.logo || generateDefaultLogoDataUrl(user.username),
      averageRating: "4.8",
      totalReviews: "127",
    },
  };

  return (
    <div className="h-full w-full flex flex-col bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-gray-300 transition-all duration-300 relative group overflow-hidden min-h-full sm:min-h-[600px] lg:min-h-[650px]">
      {/* Item Status Badge */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10">
        {item.isAvailable ? (
          <span className="bg-green-100/90 backdrop-blur-sm text-green-800 text-[10px] sm:text-xs px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-full flex items-center shadow-sm">
            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="hidden sm:inline">Available</span>
            <span className="sm:hidden">✓</span>
          </span>
        ) : (
          <span className="bg-red-100/90 backdrop-blur-sm text-red-800 text-[10px] sm:text-xs px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-full flex items-center shadow-sm">
            <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
            <span className="hidden sm:inline">Unavailable</span>
            <span className="sm:hidden">✗</span>
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
        <Favorites
          businessId={itemdata._id}
          showText={false}
          type="wishlist"
          variant="compact"
        />
      </div>

      {/* Image Section - Responsive Height */}
      <div className="relative overflow-hidden flex-shrink-0">
        {item.media && item.media.length > 0 ? (
          <img
            src={item.media[0].url}
            alt={item.title}
            className="w-full object-cover group-hover:scale-105 transition-transform duration-500 h-40 xs:h-44 sm:h-48 md:h-56 lg:h-64"
          />
        ) : null}

        {/* Fallback for no image or image error */}
        <div
          className={`w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center h-40 xs:h-44 sm:h-48 md:h-56 lg:h-64 ${
            item.media && item.media.length > 0 ? "hidden" : "flex"
          }`}
        >
          <div className="text-gray-400 text-center">
            <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 opacity-50" />
            <span className="text-xs sm:text-sm font-medium">No Image</span>
          </div>
        </div>

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content Section - Responsive Padding */}
      <div className="flex-1 flex flex-col p-3 sm:p-4 md:p-5 lg:p-6">
        {/* Item Type and Escrow Badges */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4 flex-shrink-0 gap-2">
          <span
            className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center font-medium ${
              item.type === "product"
                ? "bg-purple-100 text-purple-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {item.type === "product" ? (
              <ShoppingBag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
            ) : (
              <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
            )}
            <span className=" sm:inline">
              {item.type === "product" ? "Product" : "Service"}
            </span>
            <span className="sm:hidden">
              {item.type === "product" ? "P" : "S"}
            </span>
          </span>
          {item.useEscrow && (
            <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center font-medium">
              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
              <span className="hidden sm:inline">Escrow</span>
              <span className="sm:hidden">E</span>
            </span>
          )}
        </div>

        {/* Title - Responsive Text Size */}
        <div className="mb-2 sm:mb-3 flex-shrink-0">
          <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] flex items-start">
            {item.title}
          </h3>
        </div>

        {/* Description - Responsive and Adaptive */}
        <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0">
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Tags - Responsive Layout */}
        <div className="mb-2 sm:mb-3 md:mb-4 flex-shrink-0 min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem] flex items-start">
          {item.tags && item.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {item.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 text-[10px] sm:text-xs px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center hover:bg-gray-200 transition-colors"
                >
                  <Tag className="w-2 h-2 sm:w-2.5 sm:h-2.5 mr-0.5 sm:mr-1" />
                  {tag.length > 12 ? `${tag.substring(0, 12)}...` : tag}
                </span>
              ))}
              {item.tags.length > 2 && (
                <span className="text-gray-500 text-[10px] sm:text-xs flex items-center px-1 sm:px-2">
                  +{item.tags.length - 2}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full" />
          )}
        </div>

        {/* Spacer to push bottom content down */}
        <div className="flex-1" />

        {/* Price and Delivery - Responsive Layout */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 flex-shrink-0 gap-2">
          <div className="flex items-baseline">
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
              {formatPrice(Number(item.price))}
            </span>
          </div>
          {item.deliveryTime && (
            <div className="flex items-center text-xs sm:text-sm text-gray-600 bg-gray-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              <span className="font-medium">
                {item.deliveryTime}
                <span className="hidden sm:inline">
                  {" "}
                  day{Number(item.deliveryTime) !== 1 ? "s" : ""}
                </span>
                <span className="sm:hidden">d</span>
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons - Responsive Stack */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => handleViewItem(item._id, item.title)}
            className="w-full sm:flex-1 border-2 border-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center group-hover:border-gray-400"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">View</span>
          </button>

          {item.isAvailable && item.useEscrow && (
            <button
              onClick={() => {
                setItemData(itemdata);
                setShowPaymentModal(true);
              }}
              className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {item.type === "product" ? (
                <>
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Buy Now</span>
                  <span className="sm:hidden">Buy</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Pay Now</span>
                  <span className="sm:hidden">Pay</span>
                </>
              )}
            </button>
          )}

          {item.isAvailable && !item.useEscrow && (
            <button
              onClick={() => handleChatClick(user)}
              className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-xs sm:text-sm font-medium flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Chat</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
