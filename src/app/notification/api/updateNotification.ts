import apiService from "@/lib/service/apiService";

export default async function updateNotification(payload: {
    ids: string[];
    action: "read" | "unread";
}) {
    const { response } = await apiService<
        { message: string; updated: Notification[] },
        { ids: string[]; action: "read" | "unread" }
    >({
        endpoint: "/api/notification/update",
        method: "PATCH",
        requiresAuth: true,
        body: payload,
    });

    return response.data;
}
