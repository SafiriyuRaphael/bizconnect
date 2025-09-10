import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import getAllNotifications from "../api/getAllNotifications";
import deleteNotification from "../api/deleteNotification";
import updateNotification from "../api/updateNotification";
import { useSocketStore } from "@/shared/store/useSocketStore";

export default function useNotification() {
  const { setNotifications, setUnreadCount } = useSocketStore();
  const queryClient = useQueryClient();

  const [notificationParams, setNotificationParams] =
    useState<NotificationQueryParams>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { data: notifications, isLoading: isFetchingNotification } = useQuery<
    Notification[],
    Error
  >({
    queryKey: ["get-notification", notificationParams],
    queryFn: () => getAllNotifications({ params: notificationParams }),
  });

  const deleteMutation = useMutation<
    { message: string; status: string },
    Error,
    { ids: string[] }
  >({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notification"] });
      setSelectedIds(new Set());
    },
  });

  const updateMutation = useMutation<
    { message: string; updated: Notification[] },
    Error,
    { ids: string[]; action: "read" | "unread" }
  >({
    mutationFn: updateNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-notification"] });
      setSelectedIds(new Set());
    },
  });

  const handleParamsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name === "search") {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          setNotificationParams((prev) => ({
            ...prev,
            search: value,
          }));
        }, 500);
      } else {
        setNotificationParams((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const unreadCount = notifications?.filter((n) => !n.isRead).length;

  const handleSelectAll = () => {
    if (selectedIds.size === notifications?.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifications?.map((n) => n._id)));
    }
  };

  const handleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleUpdate = (action: "read" | "unread") => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    updateMutation.mutate({ ids, action });
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    deleteMutation.mutate({ ids });
  };

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setNotifications(notifications);
      setUnreadCount(unreadCount || 0);
    }
  }, [notifications]);

  return {
    notifications,
    isFetchingNotification,
    handleParamsChange,
    notificationParams,
    deleteMutation,
    updateMutation,
    handleDelete,
    handleUpdate,
    showFilters,
    setShowFilters,
    unreadCount,
    handleSelectNotification,
    handleSelectAll,
    selectedIds,
    setSelectedIds,
  };
}
