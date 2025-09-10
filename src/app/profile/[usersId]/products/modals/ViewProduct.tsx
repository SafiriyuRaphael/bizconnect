import useProductsApi from "@/app/profile/[usersId]/products/hooks/useProductsApi";
import { useProductStore } from "@/shared/store/useProductsStore";
import {
  Clock,
  Edit3,
  Shield,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for demonstration - replace with your actual imports

export default function ViewProduct() {
  const {
    setShowViewProduct,
    selectedProduct,
    toggleProductAvailability,
    loading,
  } = useProductStore();
  const {
    handleEditProduct,
    handleDeleteProduct,
    handleToggleAvailable,
    editMutation,
  } = useProductsApi();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  if (!selectedProduct) return null;

  const currentImage =
    selectedProduct.media && selectedProduct.media.length > 0
      ? selectedProduct.media[currentImageIndex]
      : null;

  const nextImage = () => {
    const media = selectedProduct.media ?? [];

    if (media.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % media.length);
    }
  };

  const prevImage = () => {
    const media = selectedProduct.media ?? [];

    if (media.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? media.length - 1 : prev - 1
      );
    }
  };

  const openImageModal = () => setShowImageModal(true);
  const closeImageModal = () => setShowImageModal(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-xl">
            <div className="flex justify-between items-center">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                Product Details
              </h4>
              <button
                onClick={() => setShowViewProduct(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-6">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Media */}
                <div className="space-y-4">
                  {selectedProduct.media && selectedProduct.media.length > 0 ? (
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                        <img
                          src={currentImage?.url}
                          alt={currentImage?.name || selectedProduct.title}
                          className="w-full h-full object-cover"
                        />

                        {/* Zoom Button */}
                        <button
                          onClick={openImageModal}
                          className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>

                        {/* Navigation Arrows */}
                        {selectedProduct.media.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        {selectedProduct.media.length > 1 && (
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} /{" "}
                            {selectedProduct.media.length}
                          </div>
                        )}
                      </div>

                      {/* Thumbnail Navigation */}
                      {selectedProduct.media.length > 1 && (
                        <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
                          {selectedProduct.media.map((media, index) => (
                            <button
                              key={media.public_id || index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                index === currentImageIndex
                                  ? "border-indigo-600"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <img
                                src={media.url}
                                alt={media.name || `Image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">📷</span>
                        </div>
                        <p>No images available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Product Info */}
                <div className="space-y-6">
                  {/* Title and Price */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      {selectedProduct.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                          selectedProduct.type === "service"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {selectedProduct.type}
                      </span>

                      {selectedProduct.useEscrow && (
                        <div className="flex items-center space-x-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                          <Shield className="w-4 h-4" />
                          <span>Escrow Protected</span>
                        </div>
                      )}

                      <div
                        className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                          selectedProduct.isAvailable
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedProduct.isAvailable
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <span>
                          {selectedProduct.isAvailable
                            ? "Available"
                            : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                        ₦{selectedProduct.price.toLocaleString()}
                      </div>

                      {selectedProduct.deliveryTime && (
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {selectedProduct.deliveryTime} days delivery
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Description
                      </h4>
                      <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Product Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Type:</span>
                      <span className="text-gray-900 capitalize font-medium">
                        {selectedProduct.type}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Price:</span>
                      <span className="text-gray-900 font-medium">
                        ₦{selectedProduct.price.toLocaleString()}
                      </span>
                    </div>
                    {selectedProduct.deliveryTime && (
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Delivery Time:</span>
                        <span className="text-gray-900 font-medium">
                          {selectedProduct.deliveryTime} days
                        </span>
                      </div>
                    )}
                    {selectedProduct.media &&
                      selectedProduct.media.length > 0 && (
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Images:</span>
                          <span className="text-gray-900 font-medium">
                            {selectedProduct.media?.length} image
                            {selectedProduct.media?.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Escrow:</span>
                      <span
                        className={`font-medium ${
                          selectedProduct.useEscrow
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {selectedProduct.useEscrow ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${
                          selectedProduct.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedProduct.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Created:</span>
                      <span className="text-gray-900 font-medium">
                        {selectedProduct.createdAt
                          ? new Date(
                              selectedProduct.createdAt
                            ).toLocaleDateString()
                          : "Date unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowViewProduct(false);
                    handleEditProduct(selectedProduct);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Product</span>
                </button>

                <button
                  disabled={loading || editMutation.isPending}
                  onClick={handleToggleAvailable}
                  className={`sm:flex-shrink-0 px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:bg-gray-100 text-gray-300 ${
                    selectedProduct.isAvailable
                      ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                      : "bg-green-100 hover:bg-green-200 text-green-800"
                  }`}
                >
                  {selectedProduct.isAvailable
                    ? "Mark Unavailable"
                    : "Mark Available"}
                </button>

                <button
                  onClick={() => {
                    setShowViewProduct(false);
                    handleDeleteProduct(selectedProduct);
                  }}
                  className="sm:flex-shrink-0 px-6 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && currentImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60 p-4">
          <div className="relative max-w-full max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={currentImage.url}
              alt={currentImage.name || selectedProduct.title}
              className="max-w-full max-h-full object-contain"
            />

            {selectedProduct.media && selectedProduct.media.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {selectedProduct.media?.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
