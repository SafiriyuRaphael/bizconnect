"use client";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import getBaseType from "@/shared/utils/getBaseType";
import { Contact } from "../../../../types";
import { useSocketStore } from "@/shared/store/useSocketStore";
import formatContact from "../utils/formatContact";
import fetchMessages from "../api/fetchMessages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toggleStar from "../api/toggleStar";
import getContacts from "../api/getContacts";
import debounce from "lodash.debounce";


export default function useChat() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    socket,
    messages,
    activeChat,
    setError,
    setActiveChat,
    setIsTyping,
    pagination,
    setPagination,
    setIsLoadingMessage,
    markChatRead,
    contacts
  } = useSocketStore();
  const pathname = usePathname()
  const [dragOver, setDragOver] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  if (!session?.user.id) {
    router.push(`/auth/login?callbackUrl=${pathname}`)
  }

  const queryClient = useQueryClient()

  // Initialize socket
  useEffect(() => {
    if (session?.user?.id) {
      useSocketStore.getState().initSocket();
    }
    return () => {
      useSocketStore.getState().clearSocket();
    };
  }, [session?.user?.id]);

  const query = useQuery<Contact[]>({
    queryKey: ['contacts', searchTerm],
    queryFn: ({ queryKey }) => {
      const [_key, search] = queryKey;
      return getContacts(search as string);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  })


  // useEffect(() => {
  //   if (query.data && !query.isLoading) {
  //     useSocketStore.setState(state => {
  //       const ids = new Set(state.contacts.map(c => c.id));
  //       const merged = [
  //         ...state.contacts,
  //         ...query.data.filter(c => !ids.has(c.id))
  //       ];
  //       return { contacts: merged };
  //     });
  //   }
  // }, [query.data]);

  useEffect(() => {
    if (query.data && !query.isLoading) {
      useSocketStore.setState(() => ({
        contacts: query.data,
      }));
    }
  }, [query.data, query.isLoading]);

  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchTerm(val);
      }, 400), // 400ms debounce
    [setSearchTerm]
  );

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  useEffect(() => {
    const recipientId = searchParams.get("recipientId");
    if (!recipientId) return;

    const state = useSocketStore.getState();
    let contact = state.contacts.find(c => c.id === recipientId);

    if (!contact) {
      fetch(`/api/chat/contacts?recipientId=${recipientId}`)
        .then(res => res.json())
        .then(recipientData => {
          const formatted = formatContact(recipientData);
          const ids = new Set(useSocketStore.getState().contacts.map(c => c.id));
          if (!ids.has(formatted.id)) {
            useSocketStore.setState(state => ({
              contacts: [...state.contacts, formatted],
            }));
          }
          setActiveChat(formatted); // always set here
        });
    } else {
      setActiveChat(contact);
    }

    if (recipientId && session?.user?.id) {
      fetchMessages(recipientId, 1, 20, session);
      markChatRead(session, recipientId)

    }
    setShowMobileChat(true);
  }, [searchParams]);


  const starredMutate = useMutation({
    mutationFn: toggleStar,

    onMutate: async (contactId: string) => {
      await queryClient.cancelQueries({ queryKey: ["contacts"] })
      const prevData = queryClient.getQueryData<any[]>(["contacts"])
      queryClient.setQueryData<any[]>(["contacts"], (old) =>
        old?.map((c) =>
          c.id === contactId ? { ...c, starred: !c.starred } : c
        )
      )
      useSocketStore.setState((state) => ({
        contacts: state.contacts.map((c) =>
          c.id === contactId ? { ...c, starred: !c.starred } : c
        ),
        activeChat: state.activeChat
          ? { ...state.activeChat, starred: !state.activeChat.starred }
          : state.activeChat,
      }))
      return { prevData }
    },

    onError: (_err, _vars, context) => {
      if (context?.prevData) {
        queryClient.setQueryData(["contacts"], context.prevData)
        useSocketStore.setState({
          contacts: context.prevData, activeChat: activeChat
            ? { ...activeChat, starred: !activeChat.starred }
            : activeChat
        })

      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] })
    },
  })


  // Enhanced file drop handling
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const event = {
        target: { files },
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(event);
    }
  };




  const handleScroll = async () => {
    const div = listRef.current;
    if (!div || !pagination) return;

    if (
      activeChat &&
      session &&
      div.scrollTop === 0 &&
      pagination.page < pagination.totalPages
    ) {
      const oldScrollHeight = div.scrollHeight;

      setIsLoadingMessage(true);
      await fetchMessages(activeChat.id, pagination.page + 1, 20, session);
      setIsLoadingMessage(false);

      const newScrollHeight = div.scrollHeight;
      div.scrollTop = newScrollHeight - oldScrollHeight;
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
      setPagination(null)
      setActiveChat(contact);
      setShowMobileChat(true);
      setIsTyping(false);
      setError(null);

      if (session) {
        markChatRead(session, contact.id)
      }
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



  return {
    showMobileChat,
    searchTerm,
    setSearchTerm,
    handleContactClick,
    handleBackToContacts,
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
    router,
    listRef,
    handleScroll,
    starredMutate,
    contacts,
    dragOver, handleDragLeave, handleDragOver, handleDrop, debouncedSetSearch
  };
}