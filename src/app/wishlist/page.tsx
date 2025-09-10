"use client";
import React, { useState, useEffect } from "react";
import {
  Heart,
  Star,
  ShoppingBag,
  Building2,
  Clock,
  DollarSign,
  MapPin,
  Globe,
  Phone,
  Mail,
  Trash2,
  Eye,
  Share2,
  Filter,
  Search,
  Grid,
  List,
} from "lucide-react";

// Mock data - replace with your actual API calls
const mockFavorites = [
  {
    _id: "1",
    businessName: "Fashion Forward",
    businessCategory: "fashion",
    businessAddress: "123 Fashion Street, Lagos",
    businessDescription:
      "Premium fashion boutique offering latest trends and custom designs",
    website: "https://fashionforward.com",
    priceRange: { min: 5000, max: 50000 },
    deliveryTime: 3,
    displayPics: [
      {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        alt: "Fashion store",
      },
    ],
    verifiedBusiness: true,
    reviews: [{ rating: 4.5 }, { rating: 5 }, { rating: 4 }],
    averageRating: 4.5,
  },
  {
    _id: "2",
    businessName: "Tech Hub Nigeria",
    businessCategory: "electronics",
    businessAddress: "456 Tech Avenue, Abuja",
    businessDescription:
      "Leading electronics retailer with latest gadgets and accessories",
    website: "https://techhub.ng",
    priceRange: { min: 10000, max: 500000 },
    deliveryTime: 2,
    displayPics: [
      {
        url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        alt: "Electronics store",
      },
    ],
    verifiedBusiness: true,
    reviews: [{ rating: 4.8 }, { rating: 5 }, { rating: 4.7 }],
    averageRating: 4.8,
  },
];

const mockWishlist = [
  {
    _id: "1",
    title: "Premium Leather Handbag",
    description: "Handcrafted genuine leather handbag with premium finish",
    tags: ["fashion", "leather", "handbag", "premium"],
    type: "product",
    price: 25000,
    deliveryTime: 5,
    useEscrow: true,
    media: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        alt: "Leather handbag",
      },
    ],
    isAvailable: true,
    business: {
      businessName: "Fashion Forward",
      verifiedBusiness: true,
    },
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    _id: "2",
    title: "Web Development Service",
    description: "Professional web development service for modern businesses",
    tags: ["web", "development", "business", "digital"],
    type: "service",
    price: 150000,
    deliveryTime: 14,
    useEscrow: false,
    media: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
        alt: "Web development",
      },
    ],
    isAvailable: true,
    business: {
      businessName: "Tech Solutions Pro",
      verifiedBusiness: true,
    },
    createdAt: "2024-01-20T14:20:00Z",
  },
];

const BizConnectFavoritesWishlist = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [favorites, setFavorites] = useState(mockFavorites);
  const [wishlist, setWishlist] = useState(mockWishlist);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and search logic
  const filteredFavorites = favorites.filter((business) => {
    const matchesSearch =
      business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.businessDescription
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || business.businessCategory === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredWishlist = wishlist.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-NG");
  };

  const removeFromFavorites = (businessId) => {
    setFavorites((prev) =>
      prev.filter((business) => business._id !== businessId)
    );
  };

  const removeFromWishlist = (itemId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== itemId));
  };

  const BusinessCard = ({ business, onRemove }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={business.displayPics[0]?.url || "/api/placeholder/400/200"}
          alt={business.displayPics[0]?.alt || business.businessName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          {business.verifiedBusiness && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Verified
            </span>
          )}
          <button
            onClick={() => onRemove(business._id)}
            className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{business.businessName}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {business.businessDescription}
        </p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2" />
            {business.businessAddress}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <DollarSign className="w-4 h-4 mr-2" />
            {formatPrice(business.priceRange.min)} -{" "}
            {formatPrice(business.priceRange.max)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            {business.deliveryTime} days delivery
          </div>
          {business.website && (
            <div className="flex items-center text-sm text-blue-500">
              <Globe className="w-4 h-4 mr-2" />
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm text-gray-600 ml-1">
              {business.averageRating} ({business.reviews.length} reviews)
            </span>
          </div>
          <div className="flex gap-2">
            <button className="text-blue-500 hover:text-blue-600 p-1">
              <Eye className="w-4 h-4" />
            </button>
            <button className="text-gray-500 hover:text-gray-600 p-1">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ItemCard = ({ item, onRemove }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img
          src={item.media[0]?.url || "/api/placeholder/400/200"}
          alt={item.media[0]?.alt || item.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              item.type === "product"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {item.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          {item.useEscrow && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
              Escrow
            </span>
          )}
          <button
            onClick={() => onRemove(item._id)}
            className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
          >
            <ShoppingBag className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="text-gray-500 text-xs">
              +{item.tags.length - 3} more
            </span>
          )}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg text-green-600">
              {formatPrice(item.price)}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {item.deliveryTime} days
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Building2 className="w-4 h-4 mr-2" />
            {item.business.businessName}
            {item.business.verifiedBusiness && (
              <Star className="w-3 h-3 ml-1 text-blue-500 fill-current" />
            )}
          </div>
          <div className="text-xs text-gray-400">
            Added on {formatDate(item.createdAt)}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold">
            Contact Seller
          </button>
          <button className="text-gray-500 hover:text-gray-600 p-2">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            My Collections
          </h1>
          <p className="text-gray-600">
            Manage your favorite businesses and wishlist items
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white p-1 rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-colors ${
              activeTab === "favorites"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Favorite Businesses ({favorites.length})
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 py-3 px-4 rounded-md font-semibold transition-colors ${
              activeTab === "wishlist"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <ShoppingBag className="w-5 h-5 inline mr-2" />
            Wishlist Items ({wishlist.length})
          </button>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {activeTab === "favorites" ? (
                  <>
                    <option value="fashion">Fashion</option>
                    <option value="electronics">Electronics</option>
                    <option value="beauty">Beauty</option>
                    <option value="food">Food</option>
                    <option value="home">Home</option>
                  </>
                ) : (
                  <>
                    <option value="product">Products</option>
                    <option value="service">Services</option>
                  </>
                )}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {activeTab === "favorites" ? (
            filteredFavorites.length > 0 ? (
              filteredFavorites.map((business) => (
                <BusinessCard
                  key={business._id}
                  business={business}
                  onRemove={removeFromFavorites}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No favorite businesses yet
                </h3>
                <p className="text-gray-500">
                  Start exploring and add businesses to your favorites
                </p>
              </div>
            )
          ) : filteredWishlist.length > 0 ? (
            filteredWishlist.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onRemove={removeFromWishlist}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-500">
                Browse products and services to add them to your wishlist
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BizConnectFavoritesWishlist;
