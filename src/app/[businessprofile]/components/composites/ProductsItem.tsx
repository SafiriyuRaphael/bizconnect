import React, { useState } from "react";
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
} from "lucide-react";
import ItemCard from "./ItemCard";
import { useProductStore } from "@/shared/store/useProductsStore";
import { useUserDashboardStore } from "../../store";
import useProductsApi from "@/app/profile/[usersId]/products/hooks/useProductsApi";
import Loader from "@/shared/components/ui/Loader";
import ListCard from "./ListCard";

const ProductGrid = () => {
  const { currentView, setCurrentView, viewMode, setViewMode } =
    useUserDashboardStore();
  const { userItemsQuery, setUserItemsQuery } = useProductStore();
  const { handleInputChange, isFetchingItems, fetchedItems } = useProductsApi();

  const [showFilters, setShowFilters] = useState(false);

  const Pagination = () => {
    if (!fetchedItems || isFetchingItems) return null;
    if (fetchedItems.pagination.totalPages <= 1) return null;

    const getVisiblePages = () => {
      const currentPage = userItemsQuery.page;
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, Number(currentPage) - delta);
        i <=
        Math.min(
          fetchedItems.pagination.totalPages - 1,
          Number(currentPage) + delta
        );
        i++
      ) {
        range.push(i);
      }

      if (Number(currentPage) - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (
        Number(currentPage) + delta <
        fetchedItems.pagination.totalPages - 1
      ) {
        rangeWithDots.push("...", fetchedItems.pagination.totalPages);
      } else if (fetchedItems.pagination.totalPages > 1) {
        rangeWithDots.push(fetchedItems.pagination.totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() =>
              typeof page === "number" &&
              setUserItemsQuery({ page: String(page) })
            }
            disabled={page === "..."}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              page === Number(userItemsQuery.page)
                ? "bg-indigo-600 text-white"
                : page === "..."
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  const GridView = () => {
    const displayItems = fetchedItems?.items.slice(0, 2);
    const hasMore = Number(fetchedItems?.pagination.total) > 2;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayItems?.map((item) => (
            <div key={item._id} className="relative">
              <ItemCard item={item} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center">
            <button
              onClick={() => setCurrentView("all")}
              className="inline-flex items-center px-8 py-3 bg-indigo-500 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All {fetchedItems?.pagination.total} Items
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const AllItemsView = () => {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100">
          {/* Top Row - Back button and Title */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView("grid")}
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                <span className="hidden sm:inline">Back to Featured</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
                <span className="hidden sm:inline">
                  All Items ({fetchedItems?.pagination.total || 0})
                </span>
                <span className="sm:hidden">
                  Items ({fetchedItems?.pagination.total || 0})
                </span>
              </h2>
            </div>

            {/* View Mode Toggle - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-indigo-600"
                    : "text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search items..."
                value={userItemsQuery.q}
                name="q"
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filters and Sort - Desktop */}
            <div className="hidden lg:flex space-x-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={userItemsQuery.filterBy}
                  onChange={handleInputChange}
                  name="filterBy"
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Items</option>
                  <option value="product">Products</option>
                  <option value="service">Services</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={userItemsQuery.sortBy}
                  onChange={handleInputChange}
                  name="sortBy"
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="availability">Availability</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Mobile Filters Toggle */}
            <div className="flex lg:hidden justify-between items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* View Mode Toggle - Mobile */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-indigo-600"
                      : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="lg:hidden flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="relative flex-1">
                  <select
                    value={userItemsQuery.filterBy}
                    onChange={handleInputChange}
                    name="filterBy"
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Items</option>
                    <option value="product">Products</option>
                    <option value="service">Services</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                <div className="relative flex-1">
                  <select
                    value={userItemsQuery.sortBy}
                    onChange={handleInputChange}
                    name="sortBy"
                    className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="availability">Availability</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        </div>

        {isFetchingItems && (
          <Loader
            size="lg"
            text="Getting products/services ..."
            variant="bars"
          />
        )}

        {/* Items Display */}
        {viewMode === "grid" && !isFetchingItems ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {fetchedItems?.items.map((item) => (
              <ItemCard item={item} key={item._id} />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {fetchedItems?.items.map((item) => {
              if (isFetchingItems) return null;

              return <ListCard item={item} />;
            })}
          </div>
        )}

        {/* No Results */}
        {!isFetchingItems && fetchedItems?.items.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Pagination */}
        <Pagination />
      </div>
    );
  };

  return (
    <div
      className={` ${
        isFetchingItems || fetchedItems?.items.length === 0
          ? "min-h-[70vh]"
          : "min-h-screen"
      } bg-gradient-to-br from-gray-50 to-gray-100`}
    >
      <div className="max-w-7xl mx-auto py-6">
        {currentView === "grid" ? <GridView /> : <AllItemsView />}{" "}
      </div>
    </div>
  );
};

export default ProductGrid;
