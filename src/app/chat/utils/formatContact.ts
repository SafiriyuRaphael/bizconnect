import { Contact } from "../../../../types";

export default function formatContact(raw: ContactResponse): Contact {
    const timestamp = raw.timestamp || new Date().toISOString();

    return {
        id: String(raw.id),
        name: raw.name || "Unknown",
        company: raw.company || "Customer",
        lastMessage: raw.lastMessage || "",
        timestamp,
        displayTime: new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }),
        avatar: raw.avatar || "",
        online: Boolean(raw.online),
        unread: raw.unread ?? 0,
        username: raw.username || "",
        starred: raw.starred || false
    };
}
