"use client";
import { Search, Grid, List, SlidersHorizontal, X } from "lucide-react";
import ServiceCard from "./components/Service";
import { BUSINESSCATEGORIES } from "@/constants/business";
import useDashboard from "@/hook/useDashboard";
import FilterSidebar from "./components/FilterSideBar";

export default function BizConnectBuyerPage() {
  const {
    searchQuery,
    handleSearchChange,
    setShowMobileFilters,
    showMobileFilters,
    selectedCategory,
    filteredBusinesses,
    loading,
    sortBy,
    handleSortChange,
    setViewMode,
    viewMode,
    error,
    debouncedFetchBusinesses,
    setSelectedServices,
    selectedServices,
    clearAllFilters,
    handleLoadMore,
    total,
    priceRange,
    setPriceRange,
    setDeliveryRange,
    setSelectedRating,
    setCurrentPage,
    setSelectedCategory,
    selectedRating,
    handleChat,
  } = useDashboard();
  // Filter sidebar component

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Find the Perfect Service
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Connect with trusted professionals and get things done. From tech to
            home services, we&apos;ve got you covered.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-gray-900 bg-white rounded-xl sm:rounded-l-xl sm:rounded-r-none border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-base sm:text-lg"
                />
              </div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-l-none sm:rounded-r-xl font-semibold transition-colors mt-3 sm:mt-0">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <FilterSidebar
              BUSINESSCATEGORIES={BUSINESSCATEGORIES}
              clearAllFilters={clearAllFilters}
              priceRange={priceRange}
              selectedCategory={selectedCategory}
              selectedRating={selectedRating}
              setCurrentPage={setCurrentPage}
              setDeliveryRange={setDeliveryRange}
              setPriceRange={setPriceRange}
              setSelectedCategory={setSelectedCategory}
              setSelectedRating={setSelectedRating}
              setShowMobileFilters={setShowMobileFilters}
            />
          </div>

          {/* Mobile Sidebar Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto h-full pb-20">
                  <FilterSidebar
                    BUSINESSCATEGORIES={BUSINESSCATEGORIES}
                    clearAllFilters={clearAllFilters}
                    priceRange={priceRange}
                    selectedCategory={selectedCategory}
                    selectedRating={selectedRating}
                    setCurrentPage={setCurrentPage}
                    setDeliveryRange={setDeliveryRange}
                    setPriceRange={setPriceRange}
                    setSelectedCategory={setSelectedCategory}
                    setSelectedRating={setSelectedRating}
                    setShowMobileFilters={setShowMobileFilters}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                  {selectedCategory === "all"
                    ? "All Services"
                    : BUSINESSCATEGORIES.find(
                        (c) => c.value === selectedCategory
                      )?.name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  {filteredBusinesses.length} services found
                  {loading && " (Loading...)"}
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base min-w-0 flex-1 sm:flex-none"
                >
                  <option value="best">Best Match</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                  <option value="newest">Newest</option>
                </select>

                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm sm:text-base">Error: {error}</p>
                <button
                  onClick={() =>
                    debouncedFetchBusinesses({
                      category: selectedCategory,
                      search: searchQuery,
                    })
                  }
                  className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading services...</p>
              </div>
            )}

            {/* Services Grid */}
            <div
              className={`grid gap-4 sm:gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredBusinesses.map((service) => (
                <ServiceCard
                  handleChat={handleChat}
                  key={service._id}
                  service={service}
                  setSelectedServices={setSelectedServices}
                  selectedServices={selectedServices}
                />
              ))}
            </div>

            {/* No Results */}
            {!loading && filteredBusinesses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No services found matching your criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Load More */}
            {!loading &&
              filteredBusinesses.length > 0 &&
              filteredBusinesses.length < total && (
                <div className="text-center mt-8 sm:mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className={`px-6 sm:px-8 py-3 rounded-lg font-medium transition-all w-full sm:w-auto ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                    }`}
                  >
                    {loading ? "Loading..." : "Load More Services"}
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                BizConnect
              </h3>
              <p className="text-gray-400 mb-4">
                Simplifying transactions, fostering connections.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Trust & Safety
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sell Your Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BizConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
