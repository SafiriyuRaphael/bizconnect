import useProductsApi from "@/hook/useProductsApi";
import { useProductStore } from "@/store/useProductsStore";
import { Trash2 } from "lucide-react";
import React from "react";

export default function DeleteProduct() {
  const { setShowDeleteProduct, selectedProduct, loading } = useProductStore();

  const { confirmDelete, deleteMutation } = useProductsApi();
  if (!selectedProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Product
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete "
            <strong>{selectedProduct.title}</strong>"? This action cannot be
            undone.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={confirmDelete}
              disabled={loading || deleteMutation.isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:bg-red-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading || deleteMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <span>Yes, Delete</span>
                </>
              )}
            </button>
            <button
              onClick={() => setShowDeleteProduct(false)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
