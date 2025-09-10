import Loader from "@/shared/components/ui/Loader";
import formatTimeAgo from "@/shared/utils/formatTimeAgo";
import getNotificationIcon from "@/shared/utils/getNotificationIcon";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Tag,
} from "lucide-react";
import React from "react";
import useNotification from "../../hooks";
import { useSocketStore } from "@/shared/store/useSocketStore";

type Props = {
  handleSelectNotification: (id: string) => void;
  handleSelectAll: () => void;
  notificationParams: NotificationQueryParams;
  selectedIds: Set<string>;
};

export default function Main({
  handleSelectAll,
  handleSelectNotification,
  notificationParams,
  selectedIds,
}: Props) {
  const { isFetchingNotification } = useNotification();
  const { markNotificationRead, notifications } = useSocketStore();
  return (
    <>
      {isFetchingNotification ? (
        <div className="h-[80vh] flex items-center justify-center max-w-6xl mx-auto px-4 py-6">
          <Loader size="lg" text="Getting notifications" variant="bars" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-6">
          {!notifications || notifications?.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bell size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {notificationParams
                  ? "No notifications match your filters"
                  : "No notifications yet"}
              </h3>
              <p className="text-gray-600">
                {notificationParams
                  ? "Try adjusting your search or filter criteria"
                  : "We'll notify you when something important happens"}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Select All Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:border-blue-500 transition-colors"
                  >
                    {selectedIds.size === notifications?.length && (
                      <CheckCircle2 size={16} className="text-blue-600" />
                    )}
                  </button>
                  <span className="text-sm text-gray-600 font-medium">
                    {notifications?.length} notification
                    {notifications?.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Notifications List */}
              <div>
                {notifications?.map((notification, index) => (
                  <div
                    key={index}
                    className={`px-6 py-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer border-l-4 group ${
                      notification.isRead
                        ? "bg-white border-l-transparent"
                        : notification.priority === "HIGH"
                        ? "bg-red-50/30 border-l-red-400"
                        : notification.priority === "NORMAL"
                        ? "bg-blue-50/30 border-l-blue-400"
                        : "bg-gray-50/30 border-l-gray-400"
                    } ${selectedIds.has(notification._id) ? "bg-blue-50" : ""}`}
                  >
                    <div className="flex items-start space-x-4">
                      <button
                        onClick={() =>
                          handleSelectNotification(notification._id)
                        }
                        className="flex items-center justify-center w-5 h-5 border border-gray-300 rounded hover:border-blue-500 transition-colors mt-0.5"
                      >
                        {selectedIds.has(notification._id) && (
                          <CheckCircle2 size={16} className="text-blue-600" />
                        )}
                      </button>

                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div
                          className="flex items-start justify-between gap-4"
                          onClick={() => markNotificationRead(notification._id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3
                                className={`text-base font-semibold leading-tight ${
                                  notification.isRead
                                    ? "text-gray-700"
                                    : "text-gray-900"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              {notification.priority === "HIGH" &&
                                !notification.isRead && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <AlertTriangle size={12} className="mr-1" />
                                    Urgent
                                  </span>
                                )}
                            </div>
                            {notification.message && (
                              <p
                                className={`text-sm leading-relaxed ${
                                  notification.isRead
                                    ? "text-gray-500"
                                    : "text-gray-600"
                                }`}
                              >
                                {notification.message}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-3">
                              <span
                                className={`text-xs flex items-center space-x-1 ${
                                  notification.isRead
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                <Calendar size={12} />
                                <span>
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                              </span>
                              <span
                                className={`text-xs flex items-center space-x-1 capitalize ${
                                  notification.isRead
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                <Tag size={12} />
                                <span>{notification.entityType}</span>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                            )}
                            {notification.link && (
                              <button
                                onClick={() =>
                                  console.log(
                                    `Navigate to: ${notification.link}`
                                  )
                                }
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Open link"
                              >
                                <ExternalLink size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
