"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Shield,
  Clock,
  Tag,
  User,
  Star,
  Heart,
  Share2,
  MessageCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { ProductsItemsPageProps } from "../../../../types";
import ProfileImage from "@/shared/components/composites/ProfileImage";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/shared/store/useProductsStore";
import PaymentModal from "@/shared/components/modal/Payment";
import formatPrice from "@/shared/utils/formatPrice";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import Favorites from "@/shared/components/ui/Favorites";

const ItemPage = ({ productItem }: { productItem: ProductsItemsPageProps }) => {
  const router = useRouter();
  const { showPaymentModal, setShowPaymentModal } = useProductStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const userProfile = {
    businessName: productItem.user.businessName,
    fullName: productItem.user.businessName,
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/item/${productItem._id}`;
      const shareText = `🔥 Check this out!  
  ${productItem.type}: ${productItem.title}  
  
  Tap the link to see more 👉`;

      if (navigator.share) {
        await navigator.share({
          title: productItem.title,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert("✅ Link copied! Share it anywhere.");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!productItem) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              {productItem.media && productItem.media?.length > 0 ? (
                <CldImage
                  src={productItem.media[currentImageIndex]?.url}
                  width={1000}
                  height={1000}
                  alt={productItem.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
                />
              ) : (
                <Image
                  src={"/fallbackproduct.png"}
                  alt={productItem.title}
                  width={1000}
                  height={1000}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl"
                />
              )}
              <div className="absolute top-4 right-4 ">
                {/* <Heart className="w-5 h-5 text-gray-600" />
                 */}
                <Favorites
                  businessId={productItem._id}
                  showText={false}
                  variant="floating"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {productItem.media &&
                productItem.media?.length > 1 &&
                productItem.media.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <CldImage
                      src={image.url}
                      alt={image.name}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              {productItem.tags && (
                <div className="flex items-center gap-2 mb-2">
                  {productItem.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}{" "}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {productItem.title}
              </h1>
              {/* Seller Info */}
              <div
                className="flex items-center gap-3 mb-6 cursor-pointer"
                onClick={() => router.push(`/${productItem.user.username}`)}
              >
                <ProfileImage
                  logo={productItem.user.logo}
                  user={userProfile}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {productItem?.user.businessName}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">
                        {productItem?.user.averageRating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(Number(productItem.price))}
                </span>
                {productItem.useEscrow && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Escrow Protected</span>
                  </div>
                )}
              </div>
              {productItem.deliveryTime && (
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <Clock className="w-5 h-5" />
                  <span>Delivery in {productItem.deliveryTime} days</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {productItem.description}
              </p>
            </div>

            {/* Purchase Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {productItem.useEscrow && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        What is Escrow Protection?
                      </h4>
                      <p className="text-sm text-blue-800">
                        Your payment is held securely by our platform until you
                        confirm you've received the item and are satisfied with
                        it. This protects both buyers and sellers from fraud.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {productItem.useEscrow && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={!productItem.isAvailable}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {productItem.type === "product" ? (
                      <>Buy Now</>
                    ) : (
                      <>Pay Now</>
                    )}
                  </button>
                )}

                <button
                  className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    router.push(`/chats?recipientId=${productItem.userId}`)
                  }
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact Seller
                </button>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  Share this item
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure Payment</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Quality Guaranteed</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal quantity={quantity} productItem={productItem} />
      )}
    </div>
  );
};

export default ItemPage;
