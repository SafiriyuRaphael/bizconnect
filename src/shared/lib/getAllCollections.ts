import apiService from '@/lib/service/apiService'

export default async function getAllCollections({ signal }: { signal?: AbortSignal }) {
    const { response } = await apiService<{
        id: string;
        userId: string;
        refId: string;
    }[]>({
        endpoint: "api/user-collections/get-collections",
        method: "GET",
        requiresAuth: true,
        signal: signal
    })

    return response.data
}
