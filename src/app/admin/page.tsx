"use client"
import React, { useState } from "react";
import {
  Users,
  Building2,
  MessageCircle,
  Phone,
  Video,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Settings,
  BarChart3,
  Shield,
  Bell,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Sample data
  const businesses = [
    {
      id: 1,
      name: "Tech Solutions Inc",
      category: "Technology",
      status: "Active",
      members: 25,
      verified: true,
    },
    {
      id: 2,
      name: "Green Energy Co",
      category: "Energy",
      status: "Active",
      members: 12,
      verified: true,
    },
    {
      id: 3,
      name: "Marketing Hub",
      category: "Marketing",
      status: "Pending",
      members: 8,
      verified: false,
    },
    {
      id: 4,
      name: "Finance Plus",
      category: "Finance",
      status: "Active",
      members: 15,
      verified: true,
    },
  ];

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Business Owner",
      status: "Online",
      lastActive: "2 min ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Professional",
      status: "Offline",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Business Owner",
      status: "Online",
      lastActive: "Just now",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Professional",
      status: "Away",
      lastActive: "5 min ago",
    },
  ];

  const stats = [
    {
      label: "Total Businesses",
      value: "1,234",
      change: "+12%",
      color: "text-blue-600",
    },
    {
      label: "Active Users",
      value: "5,678",
      change: "+8%",
      color: "text-green-600",
    },
    {
      label: "Connections Made",
      value: "3,456",
      change: "+15%",
      color: "text-purple-600",
    },
    {
      label: "Active Calls",
      value: "23",
      change: "+5%",
      color: "text-orange-600",
    },
  ];

  const ChatModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Chat with {selectedUser?.name}
          </h3>
          <button
            onClick={() => setShowChatModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="border rounded-lg p-4 h-48 overflow-y-auto mb-4 bg-gray-50">
          <div className="space-y-2">
            <div className="bg-blue-100 p-2 rounded-lg max-w-xs">
              <p className="text-sm">Hello! How can I help you today?</p>
            </div>
            <div className="bg-gray-200 p-2 rounded-lg max-w-xs ml-auto">
              <p className="text-sm">
                I need assistance with my business profile.
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm"
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const CallModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Phone className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Calling {selectedUser?.name}
          </h3>
          <p className="text-gray-600 mb-6">Connecting...</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowCallModal(false)}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              End Call
            </button>
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700">
              Mute
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VideoModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="text-center">
          <div className="w-full h-48 bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
            <Video className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Video Call with {selectedUser?.name}
          </h3>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              End Call
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              Mute
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Camera
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`text-sm font-medium ${stat.color}`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">
                New business registered: Tech Solutions Inc
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">
                User John Doe initiated a video call
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">
                Connection made between Marketing Hub and Finance Plus
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Chat Service</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Voice Calls</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Video Calls</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <span className="text-green-600 text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const BusinessView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Business
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businesses.map((business) => (
                <tr key={business.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {business.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {business.verified ? "✓ Verified" : "Unverified"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        business.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {business.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {business.members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const UserView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "Online"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Away"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowChatModal(true);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowCallModal(true);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        className="text-purple-600 hover:text-purple-900"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowVideoModal(true);
                        }}
                      >
                        <Video className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "businesses", label: "Businesses", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">
                  BizConnect Admin
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <RefreshCw className="w-6 h-6" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <nav className="flex space-x-8 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <main>
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "businesses" && <BusinessView />}
          {activeTab === "users" && <UserView />}
          {activeTab === "settings" && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {showChatModal && <ChatModal />}
      {showCallModal && <CallModal />}
      {showVideoModal && <VideoModal />}
    </div>
  );
};

export default AdminDashboard;
