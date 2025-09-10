import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  Search,
  Filter,
  Heart,
  Grid,
  List,
  ChevronDown,
} from "lucide-react";
import { AnyUser, ProductsItem } from "../../../../../types";
import formatPrice from "@/shared/utils/formatPrice";
import useUserDashboardActions from "@/app/[businessprofile]/hooks";
import ItemCard from "./ItemCard";
import { useProductStore } from "@/shared/store/useProductsStore";
import { useUserDashboardStore } from "../../store";
import generateDefaultLogoDataUrl from "@/shared/utils/generateDefaultLogoDataUrl";

const ProductGrid = ({ items }: { items: ProductsItem[] }) => {
  const { handleViewItem } = useUserDashboardActions();
  const { user } = useUserDashboardStore();
  const { setShowPaymentModal, setItemData } = useProductStore();

  const [currentView, setCurrentView] = useState("grid"); // 'grid' or 'all'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name', 'price-low', 'price-high', 'availability'
  const [filterBy, setFilterBy] = useState("all"); // 'all', 'product', 'service', 'available', 'unavailable'
  const [wishlist, setWishlist] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 6;

  if (!items || items.length < 1) return null;

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterBy === "all" ||
        (filterBy === "product" && item.type === "product") ||
        (filterBy === "service" && item.type === "service") ||
        (filterBy === "available" && item.isAvailable) ||
        (filterBy === "unavailable" && !item.isAvailable);

      return matchesSearch && matchesFilter;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "price-low":
          return Number(a.price) - Number(b.price);
        case "price-high":
          return Number(b.price) - Number(a.price);
        case "availability":
          return b.isAvailable - a.isAvailable;
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, searchQuery, sortBy, filterBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredAndSortedItems.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleWishlist = (itemId: string) => {
    setWishlist((prev) => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(itemId)) {
        newWishlist.delete(itemId);
      } else {
        newWishlist.add(itemId);
      }
      return newWishlist;
    });
  };

  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === "number" && setCurrentPage(page)}
            disabled={page === "..."}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              page === currentPage
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
    const displayItems = items?.slice(0, 2);
    const hasMore = items.length > 1;

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayItems.map((item) => (
            <div key={item._id} className="relative">
              <ItemCard item={item} />
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center">
            <button
              onClick={() => setCurrentView("list")}
              className="inline-flex items-center px-8 py-3 bg-indigo-500 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All {items.length} Items
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
                  All Items ({filteredAndSortedItems.length})
                </span>
                <span className="sm:hidden">
                  Items ({filteredAndSortedItems.length})
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Filters and Sort - Desktop */}
            <div className="hidden lg:flex space-x-3">
              {/* Filter Dropdown */}
              <div className="relative">
                <select
                  value={filterBy}
                  onChange={(e) => {
                    setFilterBy(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
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
                    value={filterBy}
                    onChange={(e) => {
                      setFilterBy(e.target.value);
                      setCurrentPage(1);
                    }}
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
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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

        {/* Items Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {paginatedItems.map((item) => (
              <ItemCard item={item} />
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {paginatedItems.map((item) => {
              if (!user) return null;
              const itemdata = {
                id: item._id,
                title: item.title,
                description: item.description,
                price: item.price,
                media: item.media,
                type: item.type,
                deliveryTime: item.deliveryTime,
                useEscrow: item.useEscrow,
                isAvailable: item.isAvailable,
                user: {
                  ...user,
                  displayPics: user?.displayPics || [],
                  logo: user?.logo || generateDefaultLogoDataUrl(user.username),
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
                  <button
                    onClick={() => toggleWishlist(item._id)}
                    className={`absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors z-10 ${
                      wishlist.has(item._id)
                        ? "bg-red-100 text-red-600"
                        : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-600"
                    } shadow-md`}
                  >
                    <Heart
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        wishlist.has(item._id) ? "fill-current" : ""
                      }`}
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
                            onClick={() => handleViewItem(item._id)}
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
            })}
          </div>
        )}

        {/* No Results */}
        {filteredAndSortedItems.length === 0 && (
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto  py-6">
        {currentView === "grid" ? <GridView /> : <AllItemsView />}
      </div>
    </div>
  );
};

export default ProductGrid;
