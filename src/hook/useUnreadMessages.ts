"use client";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Contact } from "../../types";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout | null = null;
    return ((...args: any[]) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
}

export function useUnreadMessages() {
    const { data: session } = useSession();
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const socketRef = useRef<Socket | null>(null);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`/api/chat/contacts`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to fetch contacts");
            const data = await res.json();
            const formattedContacts = data.map((contact: any) => ({
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
            }));
            setContacts(formattedContacts);
            setUnreadMessages(
                formattedContacts.reduce((sum: number, c: Contact) => sum + c.unread, 0)
            );
        } catch (error) {
            console.error("Error fetching contacts:", error);
        }
    };


    useEffect(() => {
        if (!session?.user.id) return;

        socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);
        socketRef.current.emit("register", session.user.id);

        fetchContacts();

        socketRef.current.on("newMessage", (message: any) => {
            if (
                message.recipient === session?.user.id &&
                !message.isSeen &&
                message.sender !== session?.user.id
            ) {
                setContacts((prev) =>
                    prev.map((contact) =>
                        contact.id === message.sender
                            ? {
                                ...contact,
                                lastMessage:
                                    message.content ||
                                    (message.file
                                        ? message.file.name
                                        : message.type === "call"
                                            ? `${message.callDetails?.callType} call ${message.callDetails?.status}`
                                            : ""),
                                timestamp: message.timestamp || new Date().toISOString(),
                                displayTime: new Date(
                                    message.timestamp || Date.now()
                                ).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                    timeZone: "Africa/Lagos",
                                }),
                                unread: contact.unread + 1,
                            }
                            : contact
                    )
                );
                setUnreadMessages((prev) => prev + 1);
            }
        });

        socketRef.current.on("messageSeen", async ({ messageId }: { messageId: string }) => {
            try {
                const res = await fetch(`/api/chat/messages/${messageId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) throw new Error("Failed to fetch message");
                const message = await res.json();
                setContacts((prev) =>
                    prev.map((contact) =>
                        contact.id === message.sender
                            ? { ...contact, unread: Math.max(0, contact.unread - 1) }
                            : contact
                    )
                );
                setUnreadMessages((prev) => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Error updating messageSeen:", error);
                // Fallback to re-fetching contacts
                fetchContacts();
            }
        });

        return () => {
            socketRef.current?.off("newMessage");
            socketRef.current?.off("messageSeen");

            socketRef.current?.disconnect();
        };
    }, [session?.user.id]);

    return { unreadMessages, contacts };
}