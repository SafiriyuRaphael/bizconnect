"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Contact } from "../../../types";
import { useSocketStore } from "@/shared/store/useSocketStore";

export function useUnreadMessages() {
  const { data: session } = useSession();
  const { contacts, socket, setError } = useSocketStore();
  const [unreadMessages, setUnreadMessages] = useState(0);

  // const fetchContacts = async () => {
  //   try {
  //     const res = await fetch(`/api/chat/contacts`, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (!res.ok) throw new Error("Failed to fetch contacts");
  //     const data = await res.json();
  //     const formattedContacts = data.map((contact: any) => ({
  //       ...contact,
  //       timestamp: contact.createdAt || new Date().toISOString(),
  //       displayTime: new Date(
  //         contact.createdAt || Date.now()
  //       ).toLocaleTimeString("en-US", {
  //         hour: "numeric",
  //         minute: "2-digit",
  //         hour12: true,
  //         timeZone: "Africa/Lagos",
  //       }),
  //       unread: contact.unread || 0,
  //       online: contact.online || false,
  //     }));

  //     setUnreadMessages(
  //       formattedContacts.reduce((sum: number, c: Contact) => sum + c.unread, 0)
  //     );
  //   } catch (error) {
  //     console.error("Error fetching contacts:", error);
  //     setError("Failed to fetch contacts");
  //   }
  // };

  // useEffect(() => {
  //   if (!session?.user?.id) return;
  //   fetchContacts();

  //   // socket?.on("newMessage", (message: any) => {
  //   //   if (
  //   //     message.recipient === session?.user.id &&
  //   //     !message.isSeen &&
  //   //     message.sender !== session?.user.id
  //   //   ) {
  //   //     useSocketStore.setState((state) => ({
  //   //       contacts: state.contacts.map((contact) =>
  //   //         contact.id === message.sender
  //   //           ? {
  //   //             ...contact,
  //   //             lastMessage:
  //   //               message.content ||
  //   //               (message.file
  //   //                 ? message.file.name
  //   //                 : message.type === "call"
  //   //                   ? `${message.callDetails?.callType} call ${message.callDetails?.status}`
  //   //                   : ""),
  //   //             timestamp: message.timestamp || new Date().toISOString(),
  //   //             displayTime: new Date(
  //   //               message.timestamp || Date.now()
  //   //             ).toLocaleTimeString("en-US", {
  //   //               hour: "numeric",
  //   //               minute: "2-digit",
  //   //               hour12: true,
  //   //               timeZone: "Africa/Lagos",
  //   //             }),
  //   //             unread: contact.unread + 1,
  //   //           }
  //   //           : contact
  //   //       ),
  //   //     }));
  //   //     setUnreadMessages((prev) => prev + 1);
  //   //   }
  //   // });

  //   // socket?.on("messageSeen", async ({ messageId }: { messageId: string }) => {
  //   //   try {
  //   //     const res = await fetch(`/api/chat/messages/${messageId}`, {
  //   //       method: "GET",
  //   //       headers: { "Content-Type": "application/json" },
  //   //     });
  //   //     if (!res.ok) throw new Error("Failed to fetch message");
  //   //     const message = await res.json();
  //   //     useSocketStore.setState((state) => ({
  //   //       contacts: state.contacts.map((contact) =>
  //   //         contact.id === message.sender
  //   //           ? { ...contact, unread: Math.max(0, contact.unread - 1) }
  //   //           : contact
  //   //       ),
  //   //     }));
  //   //     setUnreadMessages((prev) => Math.max(0, prev - 1));
  //   //   } catch (error) {
  //   //     console.error("Error updating messageSeen:", error);
  //   //     fetchContacts();
  //   //   }
  //   // });

  //   return () => {
  //     socket?.off("newMessage");
  //     socket?.off("messageSeen");
  //   };
  // }, [session?.user?.id, socket, setError]);

  return { unreadMessages, contacts };
}