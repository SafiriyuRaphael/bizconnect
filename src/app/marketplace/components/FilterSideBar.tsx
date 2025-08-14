import React, { Dispatch, SetStateAction, useState } from "react";
import { BusinessCategory } from "../../../../types";
import { SlidersHorizontal, Star } from "lucide-react";

type Props = {
  BUSINESSCATEGORIES: BusinessCategory[];
  priceRange: number;
  setPriceRange: Dispatch<SetStateAction<number>>;
  setDeliveryRange: Dispatch<SetStateAction<number[]>>;
  selectedCategory: string;
  clearAllFilters: () => void;
  setSelectedRating: Dispatch<SetStateAction<number | null>>;
  isMobile?: boolean;
  setSelectedCategory: Dispatch<SetStateAction<string>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setShowMobileFilters: Dispatch<SetStateAction<boolean>>;
  selectedRating: number | null;
};

export default function FilterSidebar({
  isMobile = false,
  BUSINESSCATEGORIES,
  clearAllFilters,
  priceRange,
  selectedCategory,
  setDeliveryRange,
  setPriceRange,
  setSelectedRating,
  selectedRating,
  setCurrentPage,
  setSelectedCategory,
  setShowMobileFilters
}: Props) {
  const [showFilters, setShowFilters] = useState(false);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setDeliveryRange((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowMobileFilters(false); // Close mobile filters after selection
  };
  return (
    <div className={`space-y-4 ${isMobile ? "space-y-6" : ""}`}>
      {/* Categories */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2">
          {BUSINESSCATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg transition-colors text-left ${
                  selectedCategory === category.value
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">
                    {category.name}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {!isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range: $0 - ${priceRange}
            </label>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange}
              onChange={handlePriceChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rating
            </label>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedRating === rating}
                    onChange={() =>
                      setSelectedRating(
                        selectedRating === rating ? null : rating
                      )
                    }
                    className="flex-shrink-0"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
                      />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">& Up</span>
                </label>
              ))}
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Delivery Time
            </label>
            <div className="space-y-2">
              {[
                { time: "Same day", value: 0 },
                { time: "1-3 days", value: 3 },
                { time: "1 week", value: 7 },
                { time: "2+ weeks", value: 1000 },
              ].map((time) => (
                <label
                  key={time.time}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 flex-shrink-0"
                    name="deliveryTime"
                    value={time.value}
                    onChange={handleDeliveryChange}
                  />
                  <span className="text-sm text-gray-600">{time.time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear filters button for mobile */}
          {isMobile && (
            <button
              onClick={clearAllFilters}
              className="w-full mt-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
