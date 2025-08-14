import React, { useState } from "react";
import { AllBusinessProps, AnyUser } from "../../../../types";
import { useMessageModalStore } from "@/store/useMessageModalStore";
import { useRouter } from "next/navigation";
import { useSocketStore } from "@/store/useSocketStore";

export default function useAdminModal() {
  const { onClose: handleCloseDelete } = useMessageModalStore();
  const { startCall, socket } = useSocketStore();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<"add" | "edit" | "view" | "chat" | null>(
    null
  );
  const [modalData, setModalData] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AnyUser | null>(null);

  const handleDelete = async ({ userId }: { userId: string }) => {
    try {
      const res = await fetch(`/api/admin/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Delete failed");
      }
      if (res.ok) {
        useMessageModalStore.getState().onOpen({
          title: "Confirm Delete",
          message: "Business account deleted successfully",
          type: "success",
          autoClose: true,
          actions: null,
        });
        router.refresh();
      }
    } catch (err) {
      useMessageModalStore.getState().onOpen({
        title: "Delete",
        message: "Failed to delete",
        type: "error",
        autoClose: true,
        actions: null,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteModal = (userId: string) => {
    useMessageModalStore.getState().onOpen({
      title: "Confirm Delete",
      message: "Are you sure you want to delete this user",
      type: "warning",
      actions: (
        <div key={isDeleting.toString()} className="flex gap-2">
          <button
            onClick={handleCloseDelete}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete({ userId })}
            disabled={isDeleting}
            className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:bg-gray-800 disabled:cursor-not-allowed"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      ),
      autoClose: false,
    });
  };

  const handleChat = (user: AnyUser) => {
    setSelectedUser(user);
    setIsOpen("chat");
  };

  const handleSendMessage = (userId: string) => {
    if (message.trim() && userId) {
      const newMessage = {
        senderId: "Bizconnect Admin",
        recipientId: userId,
        content: message,
        type: "text",
        timestamp: new Date().toISOString(),
      };
      socket?.emit("sendMessage", newMessage);
      setMessage("");
      useMessageModalStore.getState().onOpen({
        title: "Message",
        message: `Message sent`,
        type: "success",
        actions: null,
        autoClose: false,
      });
    }
  };

  const handleAudioCall = async (userId: string) => {
    try {
      await startCall("audio", userId);
    } catch (error) {
      console.error(`Error starting video call:`, error);
      useMessageModalStore.getState().onOpen({
        title: "Audio Call Error",
        message: `Error starting audio call:${error}`,
        type: "error",
        actions: null,
        autoClose: false,
      });
    }
  };
  const handleVideoCall = async (userId: string) => {
    try {
      await startCall("video", userId);
    } catch (error) {
      console.error(`Error starting video call:`, error);
      useMessageModalStore.getState().onOpen({
        title: "Video Call Error",
        message: `Error starting video call:${error}`,
        type: "error",
        actions: null,
        autoClose: false,
      });
    }
  };

  const onClose = () => {
    setIsOpen(null);
    setModalData(null);
  };

  const handleEdit = (bus: AllBusinessProps | AnyUser) => {
    setModalData(bus);
    setIsOpen("edit");
  };

  const handleView = (bus: AllBusinessProps | AnyUser) => {
    setModalData(bus);
    setIsOpen("view");
  };

  return {
    isOpen,
    modalData,
    onClose,
    setIsOpen,
    selectedStatus,
    setSelectedStatus,
    viewMode,
    setViewMode,
    handleDeleteModal,
    handleEdit,
    handleView,
    handleAudioCall,
    handleChat,
    handleVideoCall,
    handleSendMessage,
    selectedUser,
  };
}
