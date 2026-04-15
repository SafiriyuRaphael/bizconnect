import React from "react";
import useUserDashboardActions from "../../hooks";
import { useUserDashboardStore } from "../../store";
import { useProductStore } from "@/shared/store/useProductsStore";
import { ProductsItem } from "../../../../../types";
import Favorites from "@/shared/components/ui/Favorites";
import { ShoppingBag } from "lucide-react";
import formatPrice from "@/shared/utils/formatPrice";
import generateDefaultLogoDataUrl from "@/shared/utils/generateDefaultLogoDataUrl";

export default function ListCard({ item }: { item: ProductsItem }) {
  const { handleViewItem } = useUserDashboardActions();
  const { user } = useUserDashboardStore();
  const { setShowPaymentModal, setItemData } = useProductStore();

  if (!user) return null;

  const itemdata = {
    _id: item._id,
    title: item.title,
    description: item.description,
    userId: user._id,
    price: item.price,
    media: item.media,
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
    <div
      key={item._id}
      className="relative bg-white border border-gray-200 rounded-2xl p-3 sm:p-6 hover:shadow-lg transition-shadow"
    >
      {/* Wishlist Button */}
      <button className="absolute top-3 right-3">
        <Favorites
          businessId={itemdata._id}
          showText={false}
          type="wishlist"
          variant="compact"
        />
      </button>

      <div className="flex space-x-3 sm:space-x-6">
        {/* Image */}
        <div className="shrink-0 relative">
          {item.media && item.media.length > 0 ? (
            <img
              src={item.media[0].url}
              alt={item.title}
              className="w-20 h-16 sm:w-32 sm:h-24 object-cover rounded-xl"
            />
          ) : (
            <div className="w-20 h-16 sm:w-32 sm:h-24 bg-gray-100 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
            </div>
          )}

          {/* Mobile Status Badge */}
          <div className="sm:hidden absolute -top-2 -right-2">
            {item.isAvailable ? (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                Available
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                Unavailable
              </span>
            )}
          </div>

          {/* Mobile Price */}
          <div className="sm:hidden mt-2 text-lg font-bold text-green-600">
            {formatPrice(Number(item.price))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8 sm:pr-12">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1 pr-2">
              {item.title}
            </h3>

            {/* Desktop Status and Type Badges */}
            <div className="hidden sm:flex items-center space-x-2 shrink-0">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.type === "product"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {item.type}
              </span>
              {item.isAvailable ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Available
                </span>
              ) : (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                  Unavailable
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between">
            {/* Desktop Price */}
            <div className="hidden sm:flex text-xl font-bold text-green-600">
              {formatPrice(Number(item.price))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewItem(item._id, item.title)}
                className="px-2 sm:px-4 py-1 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs sm:text-sm"
              >
                View
              </button>
              {item.isAvailable && (
                <button
                  className="px-2 sm:px-4 py-1 sm:py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
                  onClick={() => {
                    setItemData(itemdata);
                    setShowPaymentModal(true);
                  }}
                >
                  {item.useEscrow ? "Buy Now" : "Contact"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
