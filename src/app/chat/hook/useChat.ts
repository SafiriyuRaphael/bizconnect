"use client";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import getBaseType from "@/shared/utils/getBaseType";
import { Contact, Message } from "../../../../types";
import { useSocketStore } from "@/shared/store/useSocketStore";


export default function useChat() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    socket,
    messages,
    contacts,
    activeChat,
    isTyping,
    error,
    caller,
    receiving,
    callStatus,
    callType,
    setError,
    setActiveChat,
    setLocalVideo,
    setRemoteVideo,
    setRemoteAudio,
    setIsTyping,
    handleAcceptCall,
    handleDeclineCall,
    endCall,
    startCall: startCallStore,
  } = useSocketStore();
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket
  useEffect(() => {
    if (session?.user?.id) {
      useSocketStore.getState().initSocket();
    }
    return () => {
      useSocketStore.getState().clearSocket();
    };
  }, [session?.user?.id]);

  // Fetch contacts and set active chat
  useEffect(() => {
    const fetchContactsAndRecipient = async () => {
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
        }));
        useSocketStore.setState({ contacts: formattedContacts });

        const recipientId = searchParams.get("recipientId");
        if (recipientId) {
          let contact = formattedContacts.find((c: Contact) => c.id === recipientId);
          if (!contact) {
            const recipientRes = await fetch(
              `/api/chat/contacts?recipientId=${recipientId}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!recipientRes.ok) throw new Error("Failed to fetch recipient");
            const recipientData = await recipientRes.json();
            contact = {
              ...recipientData,
              timestamp: recipientData.createdAt || new Date().toISOString(),
              displayTime: new Date(
                recipientData.createdAt || Date.now()
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Africa/Lagos",
              }),
            };
            useSocketStore.setState((state) => ({
              contacts: [...state.contacts, contact],
            }));
          }
          if (contact) {
            setActiveChat(contact);
            setShowMobileChat(true);
          }
        } else if (formattedContacts.length > 0) {
          setActiveChat(formattedContacts[0]);
        }
      } catch (error) {
        console.error("Error fetching contacts or recipient:", error);
        setError("Failed to load contacts");
      }
    };
    fetchContactsAndRecipient();
  }, [session?.user?.id, searchParams, setActiveChat, setError]);

  // Fetch messages for active chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const res = await fetch(
          `/api/chat/messages?recipientId=${activeChat.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        useSocketStore.setState({
          messages: data
            .filter(
              (msg: any) => msg.createdAt && typeof msg.createdAt === "string"
            )
            .map((msg: any) => ({
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
              avatar:
                msg.sender.logo ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            })),
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages");
      }
    };
    if (activeChat && session?.user?.id) {
      fetchMessages();
    }
  }, [activeChat, session?.user?.id, setError]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start call
  const startCall = async (type: "audio" | "video", userId: string) => {
    if (!session?.user?.id) {
      setError("Cannot start call: No active chat or user");
      return;
    }
    try {
      await startCallStore(type, userId);
    } catch (error) {
      console.error(`Error starting ${type} call:`, error);
      setError(`Failed to start ${type} call`);
    }
  };

  // Handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);
    const mime = file.type;
    let fileType: "image" | "pdf" | "document";

    try {
      fileType = getBaseType(mime);
    } catch (err) {
      setError("Unsupported file type");
      return;
    }
    try {
      const logo_url = await uploadCloudinary(file);
      const data = {
        url: logo_url?.imageUrl,
        type: fileType,
        name: file.name,
      };
      if (data.url && activeChat && session?.user?.id) {
        const message = {
          senderId: session.user.id,
          recipientId: activeChat.id,
          content: newMessage,
          file: data,
          type: "file",
          timestamp: new Date().toISOString(),
        };
        socket?.emit("sendMessage", message);
        setNewMessage("");
        setSelectedFile(null);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file");
    }
  };


  const handleSendMessage = () => {
    if ((newMessage.trim() || selectedFile) && activeChat && session?.user?.id) {
      if (selectedFile) return;
      const message = {
        senderId: session.user.id,
        recipientId: activeChat.id,
        content: newMessage,
        type: "text",
        timestamp: new Date().toISOString(),
      };
      socket?.emit("sendMessage", message);
      setNewMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleTyping = () => {
    if (activeChat && session?.user?.id) {
      socket?.emit("typing", {
        senderId: session.user.id,
        recipientId: activeChat.id,
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("stopTyping", {
          senderId: session.user.id,
          recipientId: activeChat.id,
        });
      }, 2000);
    }
  };


  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };


  const handleContactClick = useCallback(
    (contact: Contact) => {
      setActiveChat(contact);
      setShowMobileChat(true);
      setIsTyping(false);
      setError(null);
      messages
        .filter((msg) => msg.recipient === session?.user?.id && !msg.isSeen)
        .forEach((msg) => {
          socket?.emit("messageSeen", { messageId: msg.id });
        });
      router.push(`/chat?recipientId=${contact.id}`);
    },
    [messages, session?.user?.id, router, socket, setActiveChat, setError]
  );

  const handleBackToContacts = () => {
    setShowMobileChat(false);
    setActiveChat(null);
    setError(null);
    router.push("/chat");
  };

  // Filter contacts
  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (contact.company?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    messages.forEach((msg) => {
      if (!msg.timestamp || typeof msg.timestamp !== "string") {
        console.error("Invalid timestamp for message:", msg);
        return;
      }
      try {
        const parsedDate = parseISO(msg.timestamp);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date parsed for message:", msg);
          return;
        }
        const msgDate = format(parsedDate, "yyyy-MM-dd");
        if (msgDate !== currentDate) {
          currentDate = msgDate;
          grouped.push({ date: msgDate, messages: [msg] });
        } else {
          grouped[grouped.length - 1].messages.push(msg);
        }
      } catch (error) {
        console.error("Error parsing timestamp for message:", msg, error);
      }
    });
    return grouped;
  };

  // Get date label
  const getDateLabel = (date: string) => {
    const parsed = parseISO(date);
    if (isToday(parsed)) return "Today";
    if (isYesterday(parsed)) return "Yesterday";
    return format(parsed, "MMMM d, yyyy");
  };

  // Get call message content
  const getCallMessageContent = (msg: Message) => {
    if (msg.type !== "call" || !msg.callDetails) return "";
    const { status, callType } = msg.callDetails;
    const isOwn = msg.isOwn;
    switch (status) {
      case "attempted":
        return isOwn
          ? `You attempted a ${callType} call`
          : `${activeChat?.name} attempted a ${callType} call`;
      case "connected":
        return `Successful ${callType} call at ${msg.displayTime}`;
      case "failed":
        return `${callType?.charAt(0).toUpperCase() + callType?.slice(1)} call failed`;
      case "unavailable":
        return isOwn
          ? `${activeChat?.name} was offline for your ${callType} call`
          : `You were offline for a ${callType} call from ${activeChat?.name}`;
      case "rejected":
        return isOwn
          ? `${activeChat?.name} rejected your ${callType} call`
          : `You rejected a ${callType} call`;
      case "ended":
        return `${callType.charAt(0).toUpperCase() + callType.slice(1)} call ended`;
      default:
        return "";
    }
  };

  // Handle file download
  const handleFileDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Download failed");
    }
  };

  return {
    showMobileChat,
    searchTerm,
    setSearchTerm,
    filteredContacts,
    handleContactClick,
    activeChat,
    handleBackToContacts,
    callStatus,
    callType,
    startCall,
    endCall,
    error,
    groupMessagesByDate,
    getDateLabel,
    getCallMessageContent,
    messagesEndRef,
    setShowEmojiPicker,
    showEmojiPicker,
    handleEmojiClick,
    fileInputRef,
    handleFileChange,
    newMessage,
    setNewMessage,
    handleTyping,
    handleSendMessage,
    EmojiPicker,
    isTyping,
    messages,
    handleFileDownload,
    router,
    caller,
    receiving,
    onAcceptCall: handleAcceptCall,
    onDeclineCall: handleDeclineCall,
    setLocalVideo,
    setRemoteVideo,
    setRemoteAudio,
  };
}