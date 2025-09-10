
type NotificationType =
    | "NEW_OFFER"
    | "OFFER_ACCEPTED"
    | "ORDER_PLACED"
    | "ORDER_UPDATED"
    | "PAYMENT_HELD"
    | "PAYMENT_RELEASED"
    | "PAYMENT_FAILED"
    | "REVIEW_RECEIVED"
    | "SYSTEM";

type EntityType =
    | "OFFER"
    | "ORDER"
    | "PAYMENT"
    | "REVIEW"
    | "SYSTEM";

type Priority = "LOW" | "NORMAL" | "HIGH";

interface Notification {
    _id: string
    userId: string
    senderId?: string | null;
    type: NotificationType;
    title: string;
    message?: string;
    entityId?: string
    entityType?: EntityType;
    isRead: boolean;
    priority: Priority;
    link?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

type NotificationStatus = "all" | "read" | "unread";

type NotificationPriority = "all" | "LOW" | "NORMAL" | "HIGH";

type NotificationSort = "newest" | "oldest" | "priority";

interface NotificationQueryParams {
    search?: string;
    status?: NotificationStatus;
    priority?: NotificationPriority;
    sortBy?: NotificationSort;
}
