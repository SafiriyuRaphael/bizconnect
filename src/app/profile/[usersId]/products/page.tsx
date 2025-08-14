"use client";
import useProductsApi from "@/hook/useProductsApi";
import { useEditProfileStore } from "@/store/useEditProfileStore";
import { useProductStore } from "@/store/useProductsStore";
import {
  Edit3,
  Eye,
  Plus,
  Trash2,
  Shield,
  ShieldCheck,
  AlertCircle,
  Tag,
  Clock,
  DollarSign,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

import React, { useState } from "react";
import AddProducts from "./modals/AddProducts";
import Loader from "@/app/components/ui/Loader";
import EditProducts from "./modals/EditProducts";
import ViewProduct from "./modals/ViewProduct";
import DeleteProduct from "./modals/DeleteProduct";
import { useRouter } from "next/navigation";

export default function page() {
  const router = useRouter();
  const { profile, editMode } = useEditProfileStore();
  const {
    showAddProduct,
    setShowAddProduct,
    showViewProduct,
    showEditProduct,
    showDeleteProduct,
    selectedProduct,
    handleViewProduct,
  } = useProductStore();

  const {
    handleEditProduct,
    queryLoading,
    handleDeleteProduct,
    fetchedProducts,
  } = useProductsApi();

  if (!profile || editMode) return;

  if (queryLoading)
    return <Loader size="lg" text="Loading Products/Services" />;

  console.log(profile);

  // Only show for business users
  if (profile.userType !== "business") {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Business Account Required
          </h3>
          <p className="text-gray-600 mb-6">
            You need a business account to manage products and services.
          </p>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors">
            Upgrade to Business
          </button>
        </div>
      </div>
    );
  }

  const isVerified = profile.verifiedBusiness;

  return (
    <div className="space-y-6">
      {showAddProduct && <AddProducts />}
      {showEditProduct && selectedProduct && <EditProducts />}
      {showViewProduct && selectedProduct && <ViewProduct />}
      {showDeleteProduct && selectedProduct && <DeleteProduct />}
      {/* Header Section */}
      <div className="bg-indigo-50 rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">
                My Products & Services
              </h3>
              {isVerified ? (
                <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Shield className="w-3 h-3" />
                  <span>Unverified</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 max-w-2xl">
              Manage your products and services.{" "}
              {!isVerified &&
                "Get verified to enable escrow payments and build customer trust."}
            </p>

            {!isVerified && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-yellow-900 mb-1">
                      Verification Required for Escrow
                    </h4>
                    <p className="text-yellow-800 text-sm mb-3">
                      Verify your business to enable secure escrow payments and
                      increase customer confidence.
                    </p>
                    <button
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      onClick={() => router.push("/profile/verify")}
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Get Verified Now</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowAddProduct(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">
                {fetchedProducts?.stats.totalItems}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="text-2xl font-bold text-green-600">
                {fetchedProducts?.items.filter((p) => p.isAvailable).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Price</p>
              <p className="text-2xl font-bold text-purple-600">
                ₦{fetchedProducts?.stats.avgPrice}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Escrow Enabled
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {fetchedProducts?.items.filter((p) => p.useEscrow).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fetchedProducts?.items.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 truncate">
                    {product.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="text-xs text-gray-400">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    product.isAvailable ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </p>
                  {product.deliveryTime && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{product.deliveryTime} days delivery</span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit item"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {fetchedProducts?.items.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-10 h-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by adding your first product or service to begin selling.
            </p>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Item</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
