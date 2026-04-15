import apiService from '@/lib/service/apiService'

export default async function toggleStar(contactId: string) {
    const { response } = await apiService({
        endpoint: "/api/chat/star",
        method: "POST",
        body: { contactId }
    })
    return response.data
}
