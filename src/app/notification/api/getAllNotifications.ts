import apiService from '@/lib/service/apiService'

export default async function getAllNotifications({ signal, params }: { signal?: AbortSignal; params: NotificationQueryParams }) {
    const { response } = await apiService<{ notifications: Notification[] }>({
        endpoint: "api/notification/get-notifications",
        method: "GET",
        requiresAuth: true,
        signal,
        params: params as Record<string, string | number | boolean>
    })
    return response.data.notifications
}
