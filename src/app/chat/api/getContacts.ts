import apiService from '@/lib/service/apiService'
import { Contact } from '../../../../types'

export default async function getContacts(search: string) {

    const { response } = await apiService<ContactsResponse>({
        endpoint: "/api/chat/contacts",
        method: "GET",
        params: search ? { q: search } : {}
    })

    const data: Contact[] = response.data.map((contact) => ({
        ...contact,
        timestamp: contact.createdAt || new Date().toISOString(),
        displayTime: new Date(
            contact.createdAt || Date.now()
        ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Africa/Lagos",
        }),
        unread: contact.unread || 0,
        online: contact.online || false,
        starred: contact.starred || false
    }))

    return data
}
