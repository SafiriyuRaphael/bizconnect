import useProductsApi from "@/app/profile/[usersId]/products/hooks/useProductsApi";
import getBaseType from "@/shared/utils/getBaseType";
import { useEditProfileStore } from "@/shared/store/useEditProfileStore";
import { useMessageModalStore } from "@/shared/store/useMessageModalStore";
import { useProductStore } from "@/shared/store/useProductsStore";
import {
  Plus,
  Shield,
  X,
  Upload,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import React, { useRef } from "react";

export default function AddProducts() {
  const {
    setShowAddProduct,
    loading,
    newProduct,
    setNewProduct,
    tagInput,
    setTagInput,
    addTag,
    removeTag,
    handleKeyPress,
    image,
    appendImages,
  } = useProductStore();

  const { profile } = useEditProfileStore();
  const { handleAddProduct, addMutation } = useProductsApi();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isVerified = profile.verifiedBusiness;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    if (files.length > 5 || files.length + image.length > 5) {
      useMessageModalStore.getState().onOpen({
        title: "Upload Failed",
        message: "Max Image upload is 5",
        type: "error",
      });
      return;
    }

    for (const file of files) {
      const mime = file.type;
      const fileType = getBaseType(mime);
      if (fileType !== "image") {
        useMessageModalStore.getState().onOpen({
          title: "Upload Failed",
          message: "Invalid image formats",
          type: "error",
        });
        return;
      }
    }

    // Preview images
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    appendImages(newImages);
  };

  // Remove image
  const removeImage = (imageId: number) => {
    const updatedImages = image.filter((img) => img.id !== imageId);
    useProductStore.getState().setImage(updatedImages);
  };

  // Reorder images
  const moveImageToFront = (imageId: number) => {
    const imageIndex = image.findIndex((img) => img.id === imageId);
    if (imageIndex > 0) {
      const reorderedImages = [...image];
      const [movedImage] = reorderedImages.splice(imageIndex, 1);
      reorderedImages.unshift(movedImage);
      useProductStore.getState().setImage(reorderedImages);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-xl font-semibold text-gray-900">
              Add New {newProduct.type === "service" ? "Service" : "Product"}
            </h4>
            <button
              onClick={() => setShowAddProduct(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setNewProduct({ ...newProduct, type: "service" })
                }
                className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-sm ${
                  newProduct.type === "service"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-base">Service</div>
                <div className="text-sm text-gray-600 mt-1">
                  Digital services, consulting, freelance work
                </div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewProduct({ ...newProduct, type: "product" })
                }
                className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-sm ${
                  newProduct.type === "product"
                    ? "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-medium text-base">Product</div>
                <div className="text-sm text-gray-600 mt-1">
                  Physical items, software, digital products
                </div>
              </button>
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Product Images
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  First image will be the main display image
                </div>
              </div>
            </div>

            {/* Image Preview Grid */}
            {(image || []).length > 0 && (
              <div className="grid grid-cols-5 gap-3 mb-4">
                {image.map((image, index) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-2 -left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        Main
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveImageToFront(image.id)}
                          className="bg-white text-gray-700 p-1 rounded text-xs hover:bg-gray-100"
                          title="Make main image"
                        >
                          Main
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
            >
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm font-medium text-gray-700 mb-1">
                Click to upload images
              </div>
              <div className="text-xs text-gray-500">
                PNG, JPG up to 5MB each • Max 5 images • First image will be
                main
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              placeholder="Enter a clear, descriptive title"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({ ...newProduct, title: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-base"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe your service/product in detail. Include features, benefits, and what customers can expect."
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-base resize-none"
              rows={5}
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="group relative">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Tags help customers find your product in search
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Add relevant keywords to help customers discover your{" "}
              {newProduct.type === "service" ? "service" : "product"}
            </div>

            {/* Tag Display */}
            {newProduct.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg">
                {newProduct.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 text-sm rounded-full font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-indigo-600 hover:text-indigo-800 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Input */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. web design, mobile app, logo, branding..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-base"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!tagInput.trim()}
                className="px-6 py-2.5 bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 text-indigo-700 rounded-lg transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>

          {/* Price and Delivery Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                  ₦
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-base"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Time (days)
              </label>
              <input
                type="number"
                placeholder="7"
                value={newProduct.deliveryTime}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    deliveryTime: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-base"
              />
              <div className="text-sm text-gray-500 mt-1">
                Estimated time to complete and deliver
              </div>
            </div>
          </div>

          {/* Escrow Option */}
          <div className="border border-gray-200 rounded-lg p-5 bg-gray-50">
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id="useEscrow"
                checked={newProduct.useEscrow && isVerified}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    useEscrow: e.target.checked,
                  })
                }
                disabled={!isVerified}
                className="mt-1 w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
              />
              <div className="flex-1">
                <label
                  htmlFor="useEscrow"
                  className={`font-medium text-base ${
                    !isVerified ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  Use Escrow Protection
                </label>
                <p
                  className={`text-sm mt-1 ${
                    !isVerified ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {isVerified
                    ? "Secure payments through escrow service (recommended for customer trust)"
                    : "Requires business verification to enable escrow payments"}
                </p>
                {!isVerified && (
                  <p className="text-sm text-indigo-600 mt-1 font-medium">
                    Complete business verification to enable this feature
                  </p>
                )}
              </div>
              <Shield
                className={`w-6 h-6 mt-1 ${
                  !isVerified ? "text-gray-400" : "text-indigo-600"
                }`}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleAddProduct}
              disabled={
                loading ||
                !newProduct.title?.trim() ||
                !newProduct.price ||
                addMutation.isPending
              }
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              {loading || addMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>
                    Add {newProduct.type === "service" ? "Service" : "Product"}
                  </span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddProduct(false)}
              disabled={loading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 py-3.5 px-6 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
