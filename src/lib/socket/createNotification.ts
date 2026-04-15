import Notification from '@/model/Notification';
import { AxiosHeaders } from 'axios';
import apiService from '../service/apiService';

export default async function createNotification({
    userId,
    senderId = null,
    type,
    title,
    message,
    entityId = null,
    entityType = null,
    priority = "NORMAL",
    link = null
}: {
    userId: string;
    senderId?: string | null;
    type: "NEW_ESCROW" |
    "ESCROW_RELEASED" |
    "ESCROW_DISPUTED" |
    "ESCROW_UPDATED" |
    "PAYMENT_HELD" |
    "PAYMENT_RELEASED" |
    "PAYMENT_FAILED" |
    "REVIEW_RECEIVED" |
    "SYSTEM"
    title: string;
    message: string;
    entityId?: string | null;
    entityType?: "OFFER" | "ESCROW" | "PAYMENT" | "REVIEW" | "SYSTEM" | null;
    priority?: "LOW" | "NORMAL" | "HIGH";
    link?: string | null;
}) {

    try {
        const notification = new Notification({
            userId,
            senderId: senderId ? senderId : null,
            type,
            title,
            message,
            entityId: entityId ? entityId : null,
            entityType,
            priority,
            link,
        });
        await notification.save();

        await apiService({
            endpoint: `/api/notify`,
            method: 'POST',
            body: {
                id: notification._id,
                userId,
                senderId,
                type,
                title,
                message,
                entityId,
                entityType,
                priority,
                link,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
            },
            headers: new AxiosHeaders({
                "x-api-key": process.env.NEXT_PUBLIC_NOTIFY_API_KEY!,
            }),
            baseUrl: process.env.NEXT_PUBLIC_API_URL,
            requiresAuth: false,
        })
    } catch (error) {
        console.error("Error creating notification:", error);
    }

}
