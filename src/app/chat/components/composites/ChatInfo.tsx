// import React, { useState } from "react";
// import {
//   X,
//   Phone,
//   Video,
//   Mail,
//   MapPin,
//   Star,
//   AlertTriangle,
//   Camera,
//   FileText,
//   Image,
//   Download,
//   Calendar,
//   Clock,
//   Building2,
//   User,
//   Globe,
//   MessageSquare,
//   Shield,
//   Bell,
//   Archive,
//   Trash2,
//   Settings,
// } from "lucide-react";
// import ProfileImage from "@/shared/components/composites/ProfileImage";

// const ChatInfo = ({
//   activeChat,
//   onClose,
//   onReport,
//   onStar,
//   onBlock,
//   messages = [],
// }) => {
//   const [activeTab, setActiveTab] = useState("info");

//   // Get shared media from messages
//   const getSharedMedia = () => {
//     const mediaMessages = messages.filter(
//       (msg) =>
//         msg.type === "image" || msg.type === "file" || msg.type === "document"
//     );

//     return {
//       images: mediaMessages.filter((msg) => msg.type === "image"),
//       files: mediaMessages.filter(
//         (msg) => msg.type === "file" || msg.type === "document"
//       ),
//       total: mediaMessages.length,
//     };
//   };

//   const sharedMedia = getSharedMedia();

//   const formatJoinDate = (date) => {
//     if (!date) return "Unknown";
//     return new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   const getLastSeen = () => {
//     if (activeChat?.online) return "Online now";
//     if (activeChat?.lastSeen) {
//       const lastSeen = new Date(activeChat.lastSeen);
//       const now = new Date();
//       const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

//       if (diffInMinutes < 1) return "Just now";
//       if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//       if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//       return `${Math.floor(diffInMinutes / 1440)}d ago`;
//     }
//     return "Unknown";
//   };

//   return (
//     <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-gray-900">Chat Info</h3>
//         <button
//           onClick={onClose}
//           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//         >
//           <X className="w-5 h-5 text-gray-500" />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto">
//         {/* Profile Section */}
//         <div className="p-4 text-center border-b border-gray-100">
//           <div className="relative inline-block mb-3">
//             <ProfileImage
//               className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg"
//               user={{
//                 businessName: activeChat?.name,
//                 fullName: activeChat?.name,
//               }}
//               logo={activeChat?.avatar}
//             />
//             <div
//               className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white shadow-sm ${
//                 activeChat?.online ? "bg-green-500" : "bg-gray-400"
//               }`}
//             />
//           </div>

//           <h2 className="text-xl font-semibold text-gray-900 mb-1">
//             {activeChat?.name}
//           </h2>

//           <div className="space-y-1">
//             <p className="text-sm text-gray-600 flex items-center justify-center">
//               <Building2 className="w-4 h-4 mr-1" />
//               {activeChat?.company}
//             </p>

//             {activeChat?.location && (
//               <p className="text-sm text-gray-500 flex items-center justify-center">
//                 <MapPin className="w-4 h-4 mr-1" />
//                 {activeChat.location}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-100">
//           <button
//             onClick={() => setActiveTab("info")}
//             className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
//               activeTab === "info"
//                 ? "text-blue-600 border-blue-600"
//                 : "text-gray-500 border-transparent hover:text-gray-700"
//             }`}
//           >
//             Info
//           </button>
//           <button
//             onClick={() => setActiveTab("media")}
//             className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
//               activeTab === "media"
//                 ? "text-blue-600 border-blue-600"
//                 : "text-gray-500 border-transparent hover:text-gray-700"
//             }`}
//           >
//             Media
//           </button>

//         </div>

//         {/* Tab Content */}
//         {activeTab === "info" && (
//           <div className="p-4 space-y-4">
//             {/* About Section */}
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-2">
//                 About
//               </h4>
//               <p className="text-sm text-gray-600 leading-relaxed">
//                 {activeChat?.bio || "No bio available"}
//               </p>
//             </div>

//             {/* Contact Information */}
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-3">
//                 Contact Information
//               </h4>
//               <div className="space-y-3">
//                 {activeChat?.email && (
//                   <div className="flex items-center space-x-3">
//                     <Mail className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-900">
//                         {activeChat.email}
//                       </p>
//                       <p className="text-xs text-gray-500">Email</p>
//                     </div>
//                   </div>
//                 )}

//                 {activeChat?.phone && (
//                   <div className="flex items-center space-x-3">
//                     <Phone className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-900">
//                         {activeChat.phone}
//                       </p>
//                       <p className="text-xs text-gray-500">Phone</p>
//                     </div>
//                   </div>
//                 )}

//                 {activeChat?.website && (
//                   <div className="flex items-center space-x-3">
//                     <Globe className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <p className="text-sm text-gray-900">
//                         {activeChat.website}
//                       </p>
//                       <p className="text-xs text-gray-500">Website</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Statistics */}
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-3">
//                 Statistics
//               </h4>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-3 bg-gray-50 rounded-lg">
//                   <MessageSquare className="w-5 h-5 text-blue-500 mx-auto mb-1" />
//                   <p className="text-lg font-semibold text-gray-900">
//                     {messages.length}
//                   </p>
//                   <p className="text-xs text-gray-500">Messages</p>
//                 </div>
//                 <div className="text-center p-3 bg-gray-50 rounded-lg">
//                   <Image className="w-5 h-5 text-green-500 mx-auto mb-1" />
//                   <p className="text-lg font-semibold text-gray-900">
//                     {sharedMedia.total}
//                   </p>
//                   <p className="text-xs text-gray-500">Media</p>
//                 </div>
//               </div>
//             </div>

//             {/* Join Date */}
//             <div>
//               <h4 className="text-sm font-semibold text-gray-900 mb-2">
//                 Member Since
//               </h4>
//               <div className="flex items-center space-x-2 text-sm text-gray-600">
//                 <Calendar className="w-4 h-4" />
//                 <span>{formatJoinDate(activeChat?.joinedAt)}</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "media" && (
//           <div className="p-4">
//             <div className="mb-4">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   Shared Media ({sharedMedia.total})
//                 </h4>
//               </div>

//               {sharedMedia.total === 0 ? (
//                 <div className="text-center py-8">
//                   <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                   <p className="text-sm text-gray-500">No shared media yet</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {/* Images */}
//                   {sharedMedia.images.length > 0 && (
//                     <div>
//                       <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
//                         Images ({sharedMedia.images.length})
//                       </h5>
//                       <div className="grid grid-cols-3 gap-2">
//                         {sharedMedia.images.slice(0, 6).map((image, index) => (
//                           <div
//                             key={index}
//                             className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
//                           >
//                             <img
//                               src={image.content}
//                               alt=""
//                               className="w-full h-full object-cover hover:opacity-75 transition-opacity cursor-pointer"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                       {sharedMedia.images.length > 6 && (
//                         <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
//                           View all {sharedMedia.images.length} images
//                         </button>
//                       )}
//                     </div>
//                   )}

//                   {/* Files */}
//                   {sharedMedia.files.length > 0 && (
//                     <div>
//                       <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
//                         Files ({sharedMedia.files.length})
//                       </h5>
//                       <div className="space-y-2">
//                         {sharedMedia.files.slice(0, 5).map((file, index) => (
//                           <div
//                             key={index}
//                             className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
//                           >
//                             <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium text-gray-900 truncate">
//                                 {file.fileName || "Unknown file"}
//                               </p>
//                               <p className="text-xs text-gray-500">
//                                 {file.fileSize || "Unknown size"} •{" "}
//                                 {formatJoinDate(file.createdAt)}
//                               </p>
//                             </div>
//                             <button className="p-1 hover:bg-gray-200 rounded">
//                               <Download className="w-4 h-4 text-gray-500" />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                       {sharedMedia.files.length > 5 && (
//                         <button className="text-xs text-blue-600 hover:text-blue-700 mt-2">
//                           View all {sharedMedia.files.length} files
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default ChatInfo;
