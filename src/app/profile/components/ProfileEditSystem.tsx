// "use client";
// import React, { useState } from "react";
// import {
//   Building2,
//   Calendar,
//   Camera,
//   Clock,
//   DollarSign,
//   Globe,
//   Mail,
//   MapPin,
//   Phone,
//   Shield,
//   TrendingUp,
//   User,
//   Plus,
//   Package,
//   Eye,
//   Edit3,
//   Trash2,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Clock3,
//   BarChart3,
//   Activity,
//   Star,
//   ShoppingCart,
//   Wallet,
//   MessageSquare,
//   Upload,
//   X,
// } from "lucide-react";
// import useEditProfile from "@/hook/useEditProfile";
// import { AnyUser } from "../../../../types";
// import EditProfile from "./edit-profile";
// import ProfileDisplay from "./display-profile";
// import { signOut } from "next-auth/react";
// import ChangePasswordModal from "@/shared/components/modal/ChangePassword";
// import InputPasswordModal from "@/shared/components/modal/InputPassword";
// import ProfileImage from "@/shared/components/composites/ProfileImage";

// // Mock data - replace with real data
// const mockUser = {
//   _id: "user123",
//   fullName: "John Doe",
//   username: "johndoe",
//   email: "john@example.com",
//   phone: "+234 801 234 5678",
//   userType: "business",
//   businessName: "Tech Solutions Ltd",
//   businessCategory: "technology",
//   businessAddress: "123 Lagos Street, Victoria Island, Lagos",
//   businessDescription:
//     "We provide cutting-edge technology solutions for businesses",
//   website: "https://techsolutions.com",
//   priceRange: { min: 5000, max: 50000 },
//   deliveryTime: 7,
//   verifiedBusiness: true,
//   verified: true,
//   logo: null,
//   createdAt: "2023-01-15T00:00:00Z",
//   displayPics: [],
//   reviews: [{ rating: 5 }, { rating: 4 }, { rating: 5 }],
// };

// const mockProducts = [
//   {
//     _id: "prod1",
//     title: "Web Development Service",
//     description: "Complete web development solution",
//     category: "Web Development",
//     type: "service",
//     price: 25000,
//     deliveryTime: 14,
//     media: [],
//     isAvailable: true,
//     createdAt: "2024-01-01T00:00:00Z",
//   },
//   {
//     _id: "prod2",
//     title: "Mobile App Design",
//     description: "Professional mobile app UI/UX design",
//     category: "Design",
//     type: "service",
//     price: 15000,
//     deliveryTime: 7,
//     media: [],
//     isAvailable: true,
//     createdAt: "2024-01-15T00:00:00Z",
//   },
// ];

// const mockEscrows = [
//   {
//     _id: "esc1",
//     itemId: { title: "Web Development Service" },
//     buyerId: { fullName: "Alice Johnson" },
//     price: 25000,
//     status: "funded",
//     isDisputed: false,
//     createdAt: "2024-08-01T00:00:00Z",
//   },
//   {
//     _id: "esc2",
//     itemId: { title: "Mobile App Design" },
//     buyerId: { fullName: "Bob Smith" },
//     price: 15000,
//     status: "disputed",
//     isDisputed: true,
//     createdAt: "2024-07-15T00:00:00Z",
//   },
// ];

// const mockAnalytics = {
//   totalRevenue: 150000,
//   totalOrders: 12,
//   avgRating: 4.7,
//   completionRate: 95,
//   monthlyData: [
//     { month: "Jan", revenue: 25000, orders: 2 },
//     { month: "Feb", revenue: 30000, orders: 3 },
//     { month: "Mar", revenue: 35000, orders: 3 },
//     { month: "Apr", revenue: 20000, orders: 2 },
//     { month: "May", revenue: 40000, orders: 2 },
//   ],
// };

// export default function EnhancedProfilePage({ user }: { user: AnyUser }) {
//   const {
//     activeModal,
//     closeModal,
//     handleChangePassword,
//     handleDeleteModal,
//     profile,
//     editMode,
//     setEditMode,
//     uploading,
//     errors,
//     formData,
//     openModal,
//     handleDeletePassword,
//     handleLogoUpload,
//     setFormData,
//     handleSubmit,
//     handleInputChange,
//     handleNestedChange,
//     handleCancel,
//     loading,
//   } = useEditProfile(user);

//   if (!profile) return;
//   const [activeTab, setActiveTab] = useState("overview");
//   // const [profile] = useState(mockUser);
//   const [products, setProducts] = useState(mockProducts);
//   const [escrows] = useState(mockEscrows);
//   const [showAddProduct, setShowAddProduct] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [selectedDispute, setSelectedDispute] = useState(null);

//   const [newProduct, setNewProduct] = useState({
//     title: "",
//     description: "",
//     category: "",
//     type: "service",
//     price: "",
//     deliveryTime: "",
//     media: [],
//   });

//   const tabs = [
//     { id: "overview", label: "Overview", icon: User },
//     { id: "products", label: "Products/Services", icon: Package },
//     { id: "escrow", label: "Transactions", icon: Shield },
//     ...(profile.verifiedBusiness
//       ? [{ id: "analytics", label: "Analytics", icon: BarChart3 }]
//       : []),
//   ];

//   const handleAddProduct = () => {
//     if (!newProduct.title || !newProduct.price) return;

//     const product = {
//       _id: `prod${Date.now()}`,
//       ...newProduct,
//       userId: profile._id,
//       price: parseFloat(newProduct.price),
//       deliveryTime: parseInt(newProduct.deliveryTime) || null,
//       isAvailable: true,
//       createdAt: new Date().toISOString(),
//     };

//     setProducts([...products, product]);
//     setNewProduct({
//       title: "",
//       description: "",
//       category: "",
//       type: "service",
//       price: "",
//       deliveryTime: "",
//       media: [],
//     });
//     setShowAddProduct(false);
//   };

//   const handleDeleteProduct = (productId) => {
//     setProducts(products.filter((p) => p._id !== productId));
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "text-yellow-600 bg-yellow-100";
//       case "funded":
//         return "text-blue-600 bg-blue-100";
//       case "delivered":
//         return "text-green-600 bg-green-100";
//       case "disputed":
//         return "text-red-600 bg-red-100";
//       case "released":
//         return "text-green-600 bg-green-100";
//       case "refunded":
//         return "text-orange-600 bg-orange-100";
//       default:
//         return "text-gray-600 bg-gray-100";
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return Clock3;
//       case "funded":
//         return CheckCircle;
//       case "delivered":
//         return CheckCircle;
//       case "disputed":
//         return AlertCircle;
//       case "released":
//         return CheckCircle;
//       case "refunded":
//         return XCircle;
//       default:
//         return Clock3;
//     }
//   };

//   const ProfileHeader = () => (
//     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl mb-8">
//       <div className="flex items-center space-x-6 space-y-2">
//         <ProfileImage
//           user={profile}
//           className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center"
//           logo={profile?.logo}
//         />
//         <div className="flex-1">
//           <h1 className="text-3xl font-bold">{profile.fullName}</h1>
//           <p className="text-indigo-100 text-lg">@{profile.username}</p>
//           <div className="flex items-center space-x-4 mt-2">
//             {profile.verified && (
//               <div className="flex items-center space-x-1 text-green-200">
//                 <Shield className="w-4 h-4" />
//                 <span className="text-sm">Verified</span>
//               </div>
//             )}
//             {profile.verifiedBusiness && (
//               <div className="flex items-center space-x-1 text-yellow-200">
//                 <Star className="w-4 h-4" />
//                 <span className="text-sm">Verified Business</span>
//               </div>
//             )}
//           </div>
//         </div>
//         <button
//           className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
//           onClick={() => setEditMode(!editMode)}
//         >
//           <Edit3 className="w-4 h-4" />
//           <span>{editMode ? "Cancel" : "Edit Profile"}</span>
//         </button>
//       </div>
//       <div className="flex flex-col items-start">
//         <label
//           htmlFor="logo-upload"
//           className="text-xs underline cursor-pointer hover:text-blue-300"
//         >
//           {uploading ? "Uploading..." : "Change Picture"}
//         </label>
//         <input
//           id="logo-upload"
//           type="file"
//           accept="image/*"
//           onChange={handleLogoUpload}
//           className="hidden"
//         />
//       </div>
//       {errors?.logo && (
//         <p className="mt-1 text-sm text-red-600">{errors?.logo}</p>
//       )}
//     </div>
//   );

//   const TabNavigation = () => (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-8">
//       <div className="flex space-x-1">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
//                 activeTab === tab.id
//                   ? "bg-indigo-100 text-indigo-700"
//                   : "text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               <Icon className="w-4 h-4" />
//               <span className="font-medium">{tab.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );

//   const OverviewTab = () => (
//     <div className="space-y-6">
//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Products</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {products.length}
//               </p>
//             </div>
//             <Package className="w-8 h-8 text-indigo-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Active Transactions</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {escrows.length}
//               </p>
//             </div>
//             <Shield className="w-8 h-8 text-green-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Average Rating</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {mockAnalytics.avgRating}
//               </p>
//             </div>
//             <Star className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//       </div>

//       {/* Basic Information */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//         <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
//           <User className="w-5 h-5 mr-2" />
//           Basic Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="flex items-center space-x-3">
//             <Mail className="w-5 h-5 text-gray-400" />
//             <div>
//               <p className="text-sm text-gray-600">Email</p>
//               <p className="font-medium">{profile.email}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-3">
//             <Phone className="w-5 h-5 text-gray-400" />
//             <div>
//               <p className="text-sm text-gray-600">Phone</p>
//               <p className="font-medium">{profile.phone}</p>
//             </div>
//           </div>
//           {profile.userType === "business" && (
//             <>
//               <div className="flex items-center space-x-3">
//                 <Building2 className="w-5 h-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Business Name</p>
//                   <p className="font-medium">{profile.businessName}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <TrendingUp className="w-5 h-5 text-gray-400" />
//                 <div>
//                   <p className="text-sm text-gray-600">Category</p>
//                   <p className="font-medium capitalize">
//                     {profile.businessCategory}
//                   </p>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const ProductsTab = () => (
//     <div className="space-y-6">
//       {/* Add Product Button */}
//       {profile.userType === "business" && (
//         <div className="flex justify-between items-center">
//           <h3 className="text-xl font-semibold text-gray-900">
//             My Products & Services
//           </h3>
//           <button
//             onClick={() => setShowAddProduct(true)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             <span>Add Product</span>
//           </button>
//         </div>
//       )}

//       {/* Add Product Modal */}
//       {showAddProduct && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h4 className="text-lg font-semibold">Add New Product/Service</h4>
//               <button onClick={() => setShowAddProduct(false)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Title"
//                 value={newProduct.title}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, title: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <textarea
//                 placeholder="Description"
//                 value={newProduct.description}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, description: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 rows={3}
//               />
//               <input
//                 type="text"
//                 placeholder="Category"
//                 value={newProduct.category}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, category: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <select
//                 value={newProduct.type}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, type: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="service">Service</option>
//                 <option value="product">Product</option>
//               </select>
//               <input
//                 type="number"
//                 placeholder="Price (₦)"
//                 value={newProduct.price}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, price: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <input
//                 type="number"
//                 placeholder="Delivery Time (days)"
//                 value={newProduct.deliveryTime}
//                 onChange={(e) =>
//                   setNewProduct({ ...newProduct, deliveryTime: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <div className="flex space-x-3">
//                 <button
//                   onClick={handleAddProduct}
//                   className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition-colors"
//                 >
//                   Add Product
//                 </button>
//                 <button
//                   onClick={() => setShowAddProduct(false)}
//                   className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {products.map((product) => (
//           <div
//             key={product._id}
//             className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//           >
//             <div className="flex justify-between items-start mb-4">
//               <div className="flex-1">
//                 <h4 className="font-semibold text-gray-900 mb-1">
//                   {product.title}
//                 </h4>
//                 <p className="text-sm text-gray-600 mb-2">
//                   {product.description}
//                 </p>
//                 <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
//                   {product.category}
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">
//                   ₦{product.price.toLocaleString()}
//                 </p>
//                 {product.deliveryTime && (
//                   <p className="text-sm text-gray-600">
//                     {product.deliveryTime} days delivery
//                   </p>
//                 )}
//               </div>
//               <div className="flex space-x-2">
//                 <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
//                   <Eye className="w-4 h-4" />
//                 </button>
//                 <button className="p-2 text-gray-400 hover:text-yellow-600 transition-colors">
//                   <Edit3 className="w-4 h-4" />
//                 </button>
//                 <button
//                   onClick={() => handleDeleteProduct(product._id)}
//                   className="p-2 text-gray-400 hover:text-red-600 transition-colors"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   const EscrowTab = () => (
//     <div className="space-y-6">
//       <h3 className="text-xl font-semibold text-gray-900">
//         Transaction Management
//       </h3>

//       <div className="space-y-4">
//         {escrows.map((escrow) => {
//           const StatusIcon = getStatusIcon(escrow.status);
//           return (
//             <div
//               key={escrow._id}
//               className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-3 mb-2">
//                     <h4 className="font-semibold text-gray-900">
//                       {escrow.itemId.title}
//                     </h4>
//                     <span
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
//                         escrow.status
//                       )}`}
//                     >
//                       <StatusIcon className="w-3 h-3 mr-1" />
//                       {escrow.status.replace("_", " ").toUpperCase()}
//                     </span>
//                   </div>
//                   <p className="text-gray-600 mb-2">
//                     Customer: {escrow.buyerId.fullName}
//                   </p>
//                   <p className="text-2xl font-bold text-gray-900 mb-2">
//                     ₦{escrow.price.toLocaleString()}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Created: {new Date(escrow.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="flex flex-col space-y-2">
//                   {escrow.isDisputed && (
//                     <button
//                       onClick={() => setSelectedDispute(escrow)}
//                       className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-2"
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                       <span>Handle Dispute</span>
//                     </button>
//                   )}
//                   {escrow.status === "funded" && (
//                     <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
//                       Mark as Delivered
//                     </button>
//                   )}
//                   <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
//                     <MessageSquare className="w-4 h-4" />
//                     <span>Contact</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Dispute Modal */}
//       {selectedDispute && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h4 className="text-lg font-semibold text-red-700">
//                 Dispute Resolution
//               </h4>
//               <button onClick={() => setSelectedDispute(null)}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <p className="text-gray-600">
//                 Transaction: {selectedDispute.itemId.title}
//               </p>
//               <p className="text-gray-600">
//                 Amount: ₦{selectedDispute.price.toLocaleString()}
//               </p>
//               <textarea
//                 placeholder="Describe the issue and provide evidence..."
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 rows={4}
//               />
//               <div className="flex space-x-3">
//                 <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors">
//                   Submit Evidence
//                 </button>
//                 <button
//                   onClick={() => setSelectedDispute(null)}
//                   className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );

//   const AnalyticsTab = () => (
//     <div className="space-y-6">
//       <h3 className="text-xl font-semibold text-gray-900">
//         Business Analytics
//       </h3>

//       {/* Analytics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Revenue</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 ₦{mockAnalytics.totalRevenue.toLocaleString()}
//               </p>
//             </div>
//             <DollarSign className="w-8 h-8 text-green-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Total Orders</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {mockAnalytics.totalOrders}
//               </p>
//             </div>
//             <ShoppingCart className="w-8 h-8 text-blue-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Average Rating</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {mockAnalytics.avgRating}
//               </p>
//             </div>
//             <Star className="w-8 h-8 text-yellow-600" />
//           </div>
//         </div>
//         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-600">Completion Rate</p>
//               <p className="text-2xl font-bold text-gray-900">
//                 {mockAnalytics.completionRate}%
//               </p>
//             </div>
//             <Activity className="w-8 h-8 text-purple-600" />
//           </div>
//         </div>
//       </div>

//       {/* Monthly Performance Chart */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
//         <h4 className="text-lg font-semibold text-gray-900 mb-4">
//           Monthly Performance
//         </h4>
//         <div className="space-y-4">
//           {mockAnalytics.monthlyData.map((month, index) => (
//             <div key={index} className="flex items-center justify-between">
//               <span className="text-gray-600 font-medium">{month.month}</span>
//               <div className="flex items-center space-x-4">
//                 <span className="text-green-600 font-semibold">
//                   ₦{month.revenue.toLocaleString()}
//                 </span>
//                 <span className="text-blue-600 font-semibold">
//                   {month.orders} orders
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const renderActiveTab = () => {
//     switch (activeTab) {
//       case "overview":
//         return <ProfileDisplay profile={profile} userType={profile.userType} />;
//       case "products":
//         return <ProductsTab />;
//       case "escrow":
//         return <EscrowTab />;
//       case "analytics":
//         return <AnalyticsTab />;
//       default:
//         return <ProfileDisplay profile={profile} userType={profile.userType} />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Profile Management
//           </h1>
//           <p className="text-gray-600">
//             Manage your BizConnect profile information
//           </p>
//         </div>
//         <ProfileHeader />
//         <ChangePasswordModal
//           isOpen={activeModal === "changePassword"}
//           onClose={closeModal}
//           onSubmit={handleChangePassword}
//         />

//         <InputPasswordModal
//           isOpen={activeModal === "inputPassword"}
//           onClose={closeModal}
//           onSubmit={handleDeletePassword}
//           blurIntensity="medium"
//           showGlow={false}
//           variant="warning"
//           size="md"
//           showPattern={false}
//         />
//         {editMode && (
//           <div className="p-6 border rounded-xl border-gray-300">
//             <EditProfile
//               handleCancel={handleCancel}
//               handleInputChange={handleInputChange}
//               handleNestedChange={handleNestedChange}
//               handleSubmit={handleSubmit}
//               loading={loading}
//               errors={errors}
//               formData={formData}
//               userType={profile.userType}
//             />
//           </div>
//         )}
//         {!editMode && (
//           <>
//             {" "}
//             <TabNavigation /> {renderActiveTab()}
//           </>
//         )}

//         <div className="mt-6 bg-white rounded-lg shadow-md p-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Account Actions
//           </h3>
//           <div className="flex flex-wrap gap-3">
//             <button
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               onClick={() => openModal("changePassword")}
//             >
//               Change Password
//             </button>
//             <button
//               className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
//               onClick={() => signOut({ callbackUrl: "/auth/login" })}
//             >
//               Log Out
//             </button>
//             <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
//               Download Data
//             </button>
//             <button
//               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//               onClick={handleDeleteModal}
//             >
//               Delete Account
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
