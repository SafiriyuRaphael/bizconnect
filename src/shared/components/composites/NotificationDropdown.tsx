import { Bell, AlertTriangle, ExternalLink } from "lucide-react";
import { useSocketStore } from "@/shared/store/useSocketStore";
import getNotificationIcon from "@/shared/utils/getNotificationIcon";
import formatTimeAgo from "@/shared/utils/formatTimeAgo";
import useShared from "@/shared/hooks/useShared";
import { useRouter } from "next/navigation";

const NotificationDropdown = () => {
  const router = useRouter();
  const { dropdownRef, isOpen, setIsOpen } = useShared();

  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadCount,
  } = useSocketStore();

  const displayNotifications = notifications.slice(0, 8);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-lg group"
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse shadow-lg">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 xl:w-90 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center space-x-2">
              <Bell size={18} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 px-2 py-1 hover:bg-blue-50 rounded-md"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell size={40} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">
                  No notifications yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  We'll notify you when something happens
                </p>
              </div>
            ) : (
              <div>
                {displayNotifications.map((notification, i) => (
                  <div
                    key={i}
                    className={`px-4 py-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 group ${
                      notification.isRead
                        ? "bg-white border-l-transparent"
                        : notification.priority === "HIGH"
                        ? "bg-red-50/50 border-l-red-400"
                        : notification.priority === "NORMAL"
                        ? "bg-blue-50/50 border-l-blue-400"
                        : "bg-gray-50/50 border-l-gray-400"
                    }`}
                    onClick={() => {
                      markNotificationRead(notification._id);
                      if (notification.link) {
                        router.push(notification.link);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p
                              className={`text-sm font-medium leading-tight ${
                                notification.isRead
                                  ? "text-gray-700"
                                  : "text-gray-900"
                              }`}
                            >
                              {notification.title}
                            </p>
                            {notification.message && (
                              <p
                                className={`text-sm mt-1 leading-relaxed ${
                                  notification.isRead
                                    ? "text-gray-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.message}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span
                              className={`text-xs ${
                                notification.isRead
                                  ? "text-gray-400"
                                  : "text-gray-500"
                              }`}
                            >
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        {notification.priority === "HIGH" &&
                          !notification.isRead && (
                            <div className="flex items-center mt-2">
                              <AlertTriangle
                                size={14}
                                className="text-red-500 mr-1.5"
                              />
                              <span className="text-xs text-red-600 font-medium">
                                Urgent
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - View All */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <button
              onClick={() => {
                router.push("/notification");
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-all duration-200 py-2.5 px-4 rounded-lg hover:bg-blue-50 group"
            >
              <span>View all notifications</span>
              <ExternalLink
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
