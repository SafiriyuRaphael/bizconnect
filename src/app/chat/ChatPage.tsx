"use client";
import React, { useState, useRef, useEffect, memo } from "react";
import {
  Send,
  Search,
  MoreVertical,
  Phone,
  Video,
  Info,
  Paperclip,
  Smile,
  ArrowLeft,
  X,
  Check,
  CheckCheck,
  Minimize2,
  Maximize2,
  Mic,
  MicOff,
  VideoOff,
  Image,
  File,
  Download,
  Users,
  Settings,
  Archive,
  Star,
  Volume2,
  VolumeX,
  Calendar,
  Clock,
} from "lucide-react";

import useChat from "@/hook/useChat";
import { Contact } from "../../../types";
import IncomingCallModal from "../components/modals/IncomingCallModal";

const BizConnectChat: React.FC = () => {
  const {
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
    remoteAudioRef,
    endCall,
    localVideoRef,
    remoteVideoRef,
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
    onAcceptCall,
    onDeclineCall,
  } = useChat();

  const [showChatInfo, setShowChatInfo] = useState(false);
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || ""))
      return <Image className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const MessageStatus = ({ message }: { message: any }) => {
    if (!message.isOwn) return null;

    if (message.isSeen) {
      return (
        <div className="flex items-center space-x-1 text-blue-100">
          <CheckCheck className="w-3 h-3" />
          {message.seenAt && (
            <span className="text-xs opacity-75">{message.seenAt}</span>
          )}
        </div>
      );
    }

    return <Check className="w-3 h-3 text-blue-100" />;
  };

  const ContactListItem = memo(
    ({
      contact,
      activeChat,
      handleContactClick,
    }: {
      contact: Contact;
      activeChat: Contact | null;
      handleContactClick: (contact: Contact) => void;
    }) => (
      <div
        onClick={() => handleContactClick(contact)}
        className={`group p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
          activeChat?.id === contact.id
            ? "bg-blue-50 border-blue-200 shadow-sm"
            : ""
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className="relative flex-shrink-0">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm ${
                contact.online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                {contact.name}
              </h3>
              <span className="text-xs text-gray-500 flex items-center flex-shrink-0 ml-2">
                <Clock className="w-3 h-3 mr-1" />
                {contact.displayTime}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 truncate mb-1">
              {contact.company}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {contact.lastMessage}
            </p>
          </div>
          {contact.unread > 0 && (
            <div className="bg-blue-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium shadow-sm flex-shrink-0">
              {contact.unread > 99 ? "99+" : contact.unread}
            </div>
          )}
        </div>
      </div>
    )
  );

  const CallControls = () => (
    <div className="flex items-center space-x-2">
      <button
        className={`p-2 rounded-lg transition-colors ${
          isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
        }`}
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
      </button>

      {callType === "video" && (
        <button
          className={`p-2 rounded-lg transition-colors ${
            isVideoOff ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
          }`}
          onClick={() => setIsVideoOff(!isVideoOff)}
        >
          {isVideoOff ? (
            <VideoOff className="w-5 h-5" />
          ) : (
            <Video className="w-5 h-5" />
          )}
        </button>
      )}

      <button
        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
        onClick={endCall}
      >
        <Phone className="w-5 h-5 rotate-[135deg]" />
      </button>
    </div>
  );

  const VideoCall = () => (
    <div
      className={`${
        isVideoMinimized
          ? "fixed bottom-4 right-4 w-72 h-48 sm:w-80 sm:h-60 z-50"
          : "p-4"
      } bg-black rounded-lg shadow-xl transition-all duration-300`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium text-sm sm:text-base">
          Video Call
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsVideoMinimized(!isVideoMinimized)}
            className="p-1 text-white hover:bg-gray-700 rounded"
          >
            {isVideoMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={endCall}
            className="p-1 text-white hover:bg-red-600 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full ${
            isVideoMinimized ? "h-24 sm:h-32" : "h-48 sm:h-64"
          } rounded-lg object-cover`}
        />
        <div className="absolute bottom-2 left-2 text-white text-xs sm:text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          {activeChat?.name}
        </div>

        <div className="absolute bottom-2 right-2">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`${
              isVideoMinimized
                ? "w-12 h-9 sm:w-16 sm:h-12"
                : "w-20 h-15 sm:w-24 sm:h-18"
            } rounded object-cover border-2 border-white`}
          />
          <div className="absolute bottom-0 left-0 text-white text-xs bg-black bg-opacity-50 px-1 rounded">
            You
          </div>
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <CallControls />
      </div>
    </div>
  );

  const MessageBubble = ({ message }: { message: any }) => {
    return (
      <div
        className={`flex mb-3 sm:mb-4 ${
          message.type === "call"
            ? "justify-center"
            : message.isOwn
            ? "justify-end"
            : "justify-start"
        }`}
      >
        {message.type === "call" ? (
          <div className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs sm:text-sm text-center shadow-sm max-w-xs">
            {getCallMessageContent(message)}
            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1" />
              {message.displayTime}
            </p>
          </div>
        ) : (
          <div
            className={`flex max-w-[280px] sm:max-w-xs lg:max-w-md items-end space-x-2 ${
              message.isOwn ? "flex-row-reverse space-x-reverse" : "flex-row"
            }`}
          >
            <img
              src={message.avatar}
              alt={message.sender}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
            />
            <div
              className={`group px-3 py-2 rounded-2xl shadow-sm transition-all duration-200 ${
                message.isOwn
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm"
                  : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"
              }`}
            >
              {message.content && (
                <p className="text-sm leading-relaxed break-words">
                  {message.content}
                </p>
              )}

              {message.file && (
                <div className="mt-2">
                  {message.file.type === "image" ? (
                    <div className="relative">
                      <img
                        src={message.file.url}
                        alt={message.file.name}
                        className="max-w-full h-auto rounded-lg shadow-sm"
                      />
                      <button
                        className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-opacity"
                        onClick={() =>
                          handleFileDownload(
                            message.file.url,
                            message.file.name
                          )
                        }
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex text-black items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      {getFileIcon(message.file.name)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {message.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(message.file.size || 0)}
                        </p>
                      </div>
                      <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                        <Download
                          className="w-4 h-4"
                          onClick={() =>
                            handleFileDownload(
                              message.file.url,
                              message.file.name
                            )
                          }
                        />
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div
                className={`flex items-center justify-between mt-1 ${
                  message.isOwn ? "text-blue-100" : "text-gray-500"
                }`}
              >
                <span className="text-xs">{message.displayTime}</span>
                <MessageStatus message={message} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // useEffect(() => {
  //   if (localStreamRef.current) {
  //     const audioTrack = localStreamRef.current.getAudioTracks()[0];
  //     if (audioTrack) {
  //       audioTrack.enabled = !isMuted;
  //     }
  //     if (callType === "video") {
  //       const videoTrack = localStreamRef.current.getVideoTracks()[0];
  //       if (videoTrack) {
  //         videoTrack.enabled = !isVideoOff;
  //       }
  //     }
  //   }
  // }, [isMuted, isVideoOff, callType]);

  return (
    <div className="flex h-[87vh] max-h-screen bg-gray-50 overflow-hidden">
      {callType !== null && (
        <IncomingCallModal onAccept={onAcceptCall} onDecline={onDeclineCall} isVisible={receiving} caller={caller} />
      )}
      {/* Sidebar */}
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredContacts.length === 0 ? (
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
            filteredContacts.map((contact, index) => (
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
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-white ${
                      activeChat.online ? "bg-green-500" : "bg-gray-400"
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
                  onClick={() => startCall("audio")}
                  disabled={
                    callStatus === "ringing" || callStatus === "connected"
                  }
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <button
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => startCall("video")}
                  disabled={
                    callStatus === "ringing" || callStatus === "connected"
                  }
                >
                  <Video className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <button
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowChatInfo(!showChatInfo)}
                >
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>

                <div className="relative">
                  <button
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm">
                        <Archive className="w-4 h-4" />
                        <span>Archive Chat</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4" />
                        <span>Star Contact</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Video Call Component */}
            {callType === "video" && callStatus === "connected" && (
              <VideoCall />
            )}

            {/* Audio Reference */}
            <audio ref={remoteAudioRef} autoPlay playsInline />

            {/* Error Display */}
            {error && (
              <div className="p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center space-x-2 flex-shrink-0">
                <X className="w-5 h-5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Messages Area */}
            <div
              className={`flex-1 overflow-y-auto p-3 sm:p-4 min-h-0 ${
                dragOver
                  ? "bg-blue-50 border-2 border-dashed border-blue-300"
                  : ""
              }`}
            >
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
                  disabled={!newMessage.trim()}
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
