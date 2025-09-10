import { useSocketStore } from "@/shared/store/useSocketStore";
import { Bell, Filter, Search, Settings } from "lucide-react";
import React from "react";
import useNotification from "../../hooks";

type Props = {
  handleParamsChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  notificationParams: NotificationQueryParams;
};

export default function Header({
  handleParamsChange,
  notificationParams,
}: Props) {
  const { markAllNotificationsRead } = useSocketStore();
  const { showFilters, setShowFilters, unreadCount } = useNotification();
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Bell size={28} className="text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount && unreadCount > 0
                  ? `${unreadCount} unread messages`
                  : "All caught up!"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={markAllNotificationsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 rounded-lg"
            >
              Mark all read
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search notifications?..."
              value={notificationParams.search}
              name="search"
              onChange={handleParamsChange}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-lg transition-all ${
              showFilters
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter size={18} />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  onChange={handleParamsChange}
                  name="status"
                  value={notificationParams.status}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All notifications</option>
                  <option value="unread">Unread only</option>
                  <option value="read">Read only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  value={notificationParams.priority}
                  onChange={handleParamsChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All priorities</option>
                  <option value="high">High priority</option>
                  <option value="normal">Normal priority</option>
                  <option value="low">Low priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  name="sortBy"
                  onChange={handleParamsChange}
                  value={notificationParams.sortBy}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="priority">By priority</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
