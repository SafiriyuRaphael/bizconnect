"use client";
import React, { useState, useEffect } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  ArrowLeft,
  X,
  Users,
  Star,
  AlertTriangle,
} from "lucide-react";

import useChat from "@/app/chat/hook/useChat";
import { useSocketStore } from "@/shared/store/useSocketStore";
import Loader from "@/shared/components/ui/Loader";
import groupMessagesByDate from "./utils/groupMessagesByDate";
import getDateLabel from "./utils/getDateLabels";
import ContactListItem from "./components/composites/ContactListItem";
import MessageBubble from "./components/composites/MessageBubble";
import ProfileImage from "@/shared/components/composites/ProfileImage";
import ReportModal from "@/shared/components/modal/ReportModal";
const BizConnectChat = () => {
  const {
    showMobileChat,
    searchTerm,
    debouncedSetSearch,
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
    dragOver,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  } = useChat();

  const {
    startCall,
    callStatus,
    isTyping,
    isLoadingMessage,
    pagination,
    activeUsers,
    callType,
    error,
    activeChat,
    messages,
    isLoadingInitialMessage,
  } = useSocketStore();

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  // const [showChatInfo, setShowChatInfo] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [messages]);

  return (
    <div className="flex h-[87vh] max-h-screen bg-gray-50 overflow-hidden">
      {activeChat && (
        <ReportModal
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
          reportedUser={{
            _id: activeChat?.id,
            fullName: activeChat?.name,
            username: activeChat?.username,
            businessName: activeChat?.company,
            userType:
              activeChat?.company != "Customer" ? "business" : "customer",
          }}
        />
      )}
      <div
        className={`${
          showMobileChat ? "hidden" : "flex"
        } md:flex w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col shadow-sm`}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              value={searchTerm}
              onChange={(e) => debouncedSetSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">
                No conversations yet
              </p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Start connecting with your business network
              </p>
            </div>
          ) : (
            contacts.map((contact, index) => (
              <ContactListItem
                key={index}
                contact={contact}
                activeChat={activeChat}
                handleContactClick={handleContactClick}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div
        className={`${
          showMobileChat ? "flex" : "hidden"
        } md:flex flex-1 flex-col bg-white min-w-0 overflow-hidden`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between shadow-sm flex-shrink-0">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <button
                  onClick={handleBackToContacts}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div
                  className="relative flex-shrink-0 cursor-pointer"
                  onClick={() => router.push(`/${activeChat.username}`)}
                >
                  <ProfileImage
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    user={{
                      businessName: activeChat.name,
                      fullName: activeChat.name,
                    }}
                    logo={activeChat.avatar}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                      activeUsers.includes(activeChat.id)
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h2
                    className="font-semibold text-gray-900 truncate text-sm sm:text-base cursor-pointer"
                    onClick={() => router.push(`/${activeChat.username}`)}
                  >
                    {activeChat.name}
                  </h2>
                  <div
                    className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 cursor-pointer"
                    onClick={() => router.push(`/${activeChat.username}`)}
                  >
                    <span className="truncate">{activeChat.company}</span>
                    {activeChat.online && (
                      <span className="text-green-500 flex-shrink-0">
                        • Online
                      </span>
                    )}
                  </div>
                  {isTyping && (
                    <p className="text-xs sm:text-sm text-blue-500 animate-pulse">
                      Typing...
                    </p>
                  )}
                  {callStatus !== "idle" && (
                    <p className="text-xs sm:text-sm text-blue-500 flex items-center">
                      {callType === "video" ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <Phone className="w-3 h-3 mr-1" />
                      )}
                      {callType === "video" ? "Video Call" : "Audio Call"}:{" "}
                      {callStatus.charAt(0).toUpperCase() + callStatus.slice(1)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                <button
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => startCall("audio", activeChat.id)}
                  disabled={
                    callStatus === "ringing" || callStatus === "connected"
                  }
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <button
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => startCall("video", activeChat.id)}
                  disabled={
                    callStatus === "ringing" || callStatus === "connected"
                  }
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                {/* <button
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowChatInfo(!showChatInfo)}
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button> */}

                <div className="relative">
                  <button
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                        onClick={() => {
                          starredMutate.mutate(activeChat.id);
                        }}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            activeChat.starred
                              ? "fill-yellow-500 text-yellow-500"
                              : ""
                          }`}
                        />
                        <span>
                          {activeChat.starred
                            ? "Unstar Contact"
                            : "Star Contact"}
                        </span>
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-red-600 text-sm"
                        onClick={() => setIsOpenModal(true)}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Report User</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center space-x-2 flex-shrink-0">
                <X className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Messages Area */}
            {!isLoadingMessage && isLoadingInitialMessage ? (
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 items-center justify-center flex">
                {" "}
                <Loader text="loading messages" variant="network" />
              </div>
            ) : (
              <div
                className={`flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 ${
                  dragOver
                    ? "bg-blue-50 border-2 border-dashed border-blue-300"
                    : ""
                }`}
                ref={listRef}
                onScroll={handleScroll}
              >
                {pagination && isLoadingMessage && (
                  <Loader size="md" text="Loading messages" variant="bars" />
                )}
                {dragOver && (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <Paperclip className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                      </div>
                      <p className="text-blue-600 font-medium text-sm sm:text-base">
                        Drop files here to share
                      </p>
                    </div>
                  </div>
                )}

                {!dragOver && (
                  <div className="space-y-1">
                    {groupMessagesByDate(messages).map((group, index) => (
                      <div key={index}>
                        <div className="text-center my-4 sm:my-6">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center">
                              <span className="px-3 py-1 bg-gray-100 text-xs sm:text-sm text-gray-500 rounded-full">
                                {getDateLabel(group.date)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {group.messages.map((message, index) => (
                          <MessageBubble key={index} message={message} />
                        ))}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            )}

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
              <div className="flex items-end space-x-2">
                <div className="relative">
                  <button
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>

                <button
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,application/pdf,.doc,.docx,.txt,.zip"
                  onChange={handleFileChange}
                  multiple
                />

                <div className="flex-1 relative min-w-0">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={
                    !newMessage.trim() ||
                    isLoadingMessage ||
                    isLoadingInitialMessage
                  }
                  className="p-2 sm:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                Welcome to BizConnect
              </h3>
              <p className="text-sm sm:text-base text-gray-500">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BizConnectChat;
