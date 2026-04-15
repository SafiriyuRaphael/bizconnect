import apiService from "@/lib/service/apiService"

export default async function fetchContacts(recipientId?: string) {
    const endpoint = recipientId
        ? `/api/chat/contacts?recipientId=${recipientId}`
        : `/api/chat/contacts`;

    const { response } = await apiService<GetContactsResponse>({
        endpoint,
        method: "GET",
    })
    return response.data
}
