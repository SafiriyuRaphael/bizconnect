import { useSocketStore } from "@/shared/store/useSocketStore";
import { Session } from "next-auth";

export default async function fetchMessages(recipientId: string, page = 1, limit = 20, session: Session) {
    try {
        useSocketStore.getState().setIsLoadingInitialMessage(true)

        const res = await fetch(`/api/chat/messages?recipientId=${recipientId}&page=${page}&limit=${limit}`);
        const { messages, pagination } = await res.json();


        // format
        const formatted = messages.map((msg: any) => ({
            id: msg._id,
            sender: msg.sender._id,
            recipient: msg.recipient._id,
            content: msg.content,
            file: msg.file,
            type: msg.type || "text",
            callDetails: msg.callDetails,
            timestamp: msg.createdAt,
            displayTime: new Date(msg.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Africa/Lagos",
            }),
            isOwn: msg.sender._id === session?.user.id,
            isSeen: msg.isSeen,
            seenAt: msg.seenAt
                ? new Date(msg.seenAt).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "Africa/Lagos",
                })
                : undefined,
            avatar: msg.sender.logo || "",
        })).reverse();

        // update store
        if (page === 1) {
            useSocketStore.getState().setMessages(formatted);
        } else {
            useSocketStore.getState().prependMessages(formatted);
        }

        useSocketStore.getState().setPagination(pagination);
    } catch (err) {
        console.error("Error fetching messages:", err);
        useSocketStore.getState().setError("Failed to load messages");
    } finally {
        useSocketStore.getState().setIsLoadingInitialMessage(false)
    }
}

