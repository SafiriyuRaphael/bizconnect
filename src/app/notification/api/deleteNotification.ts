import apiService from '@/lib/service/apiService'

export default async function deleteNotification({ ids }: { ids: string[] }) {
    const { response } = await apiService<
        { message: string; status: string },
        { ids: string[] }
    >({
        endpoint: "/api/notification/delete",
        method: "POST",
        requiresAuth: true,
        body: { ids },
    });
    return response.data
}
