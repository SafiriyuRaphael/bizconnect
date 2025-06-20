"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  ShoppingCart,
  User,
  ArrowRight,
  Grid,
  List,
  SlidersHorizontal,
  Briefcase,
  Home,
  Wrench,
  Palette,
  Camera,
  Code,
  Truck,
  CheckCircle,
  MessageCircle,
} from "lucide-react";

export default function BizConnectBuyerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedServices, setSelectedServices] = useState([]);

  // Mock data for services
  const categories = [
    { id: "all", name: "All Services", icon: Briefcase, count: 156 },
    { id: "home", name: "Home Services", icon: Home, count: 45 },
    { id: "tech", name: "Tech & Digital", icon: Code, count: 38 },
    { id: "design", name: "Design & Creative", icon: Palette, count: 29 },
    { id: "photography", name: "Photography", icon: Camera, count: 22 },
    { id: "repair", name: "Repair & Maintenance", icon: Wrench, count: 18 },
    { id: "delivery", name: "Delivery & Transport", icon: Truck, count: 14 },
  ];

  const services = [
    {
      id: 1,
      title: "Professional Web Development",
      provider: "TechSolutions Pro",
      rating: 4.9,
      reviews: 127,
      price: 299,
      location: "Lagos, Nigeria",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      category: "tech",
      featured: true,
      description: "Custom websites built with modern technologies",
      deliveryTime: "7-14 days",
      verified: true,
    },
    {
      id: 2,
      title: "Home Cleaning Service",
      provider: "CleanPro Services",
      rating: 4.8,
      reviews: 89,
      price: 45,
      location: "Abuja, Nigeria",
      image:
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
      category: "home",
      featured: false,
      description: "Deep cleaning for homes and offices",
      deliveryTime: "Same day",
      verified: true,
    },
    {
      id: 3,
      title: "Logo Design & Branding",
      provider: "Creative Studio",
      rating: 4.7,
      reviews: 156,
      price: 89,
      location: "Port Harcourt, Nigeria",
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop",
      category: "design",
      featured: true,
      description: "Professional logo and brand identity design",
      deliveryTime: "3-5 days",
      verified: true,
    },
    {
      id: 4,
      title: "Wedding Photography",
      provider: "Moments Photography",
      rating: 5.0,
      reviews: 67,
      price: 450,
      location: "Lagos, Nigeria",
      image:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
      category: "photography",
      featured: false,
      description: "Capture your special moments beautifully",
      deliveryTime: "1-2 weeks",
      verified: true,
    },
    {
      id: 5,
      title: "AC Repair & Installation",
      provider: "CoolTech Repairs",
      rating: 4.6,
      reviews: 94,
      price: 75,
      location: "Kano, Nigeria",
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
      category: "repair",
      featured: false,
      description: "Professional AC repair and maintenance",
      deliveryTime: "24-48 hours",
      verified: true,
    },
    {
      id: 6,
      title: "Food Delivery Service",
      provider: "QuickDeliver",
      rating: 4.5,
      reviews: 203,
      price: 15,
      location: "Lagos, Nigeria",
      image:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      category: "delivery",
      featured: false,
      description: "Fast and reliable food delivery",
      deliveryTime: "30-45 mins",
      verified: true,
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    const matchesPrice =
      service.price >= priceRange[0] && service.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleFavorite = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const ServiceCard = ({ service }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {service.featured && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1 absolute top-4 left-4 rounded-full z-10">
          Featured
        </div>
      )}

      <div className="relative overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={() => toggleFavorite(service.id)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            selectedServices.includes(service.id)
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={selectedServices.includes(service.id) ? "white" : "none"}
          />
        </button>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {service.title}
          </h3>
          {service.verified && (
            <CheckCircle className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">{service.provider}</span>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-900">
            {service.rating}
          </span>
          <span className="text-sm text-gray-500">
            ({service.reviews} reviews)
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {service.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{service.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{service.deliveryTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xl font-bold text-gray-900">
              ${service.price}
            </span>
          </div>

          <div className="flex gap-2">
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 text-sm font-medium">
              <ShoppingCart className="w-4 h-4" />
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BizConnect
              </h1>
              <nav className="hidden md:flex items-center gap-6 text-sm">
                <a href="#" className="text-blue-600 font-medium">
                  Browse Services
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  How it Works
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Become a Seller
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <Heart className="w-5 h-5" />
                <span className="hidden sm:inline">Wishlist</span>
                {selectedServices.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedServices.length}
                  </span>
                )}
              </button>
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Find the Perfect Service
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Connect with trusted professionals and get things done. From tech to
            home services, we've got you covered.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="What service are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-l-xl border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg"
                />
              </div>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-r-xl font-semibold transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div
                className={`space-y-6 ${
                  showFilters ? "block" : "hidden lg:block"
                }`}
              >
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
                          className="rounded text-blue-600"
                        />
                        <div className="flex items-center gap-1">
                          {[...Array(rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                            />
                          ))}
                          {[...Array(5 - rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-gray-300" />
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
                    {["Same day", "1-3 days", "1 week", "2+ weeks"].map(
                      (time) => (
                        <label
                          key={time}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded text-blue-600"
                          />
                          <span className="text-sm text-gray-600">{time}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory === "all"
                    ? "All Services"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600">
                  {filteredServices.length} services found
                </p>
              </div>

              <div className="flex items-center gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>Best Match</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                  <option>Newest</option>
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
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium">
                Load More Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
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
