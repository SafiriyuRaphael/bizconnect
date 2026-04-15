import { Clock, Download } from "lucide-react";
import MessageStatus from "./MessageStatus";
import getFileIcon from "@/shared/components/composites/getFileIcon";
import getCallMessageContent from "../../utils/getCallMessageContent";
import { Message } from "../../../../../types";
import { useSocketStore } from "@/shared/store/useSocketStore";
import handleFileDownload from "../../utils/handleFileDownload";
import ProfileImage from "@/shared/components/composites/ProfileImage";

export default function MessageBubble({ message }: { message: Message }) {
  const { activeChat } = useSocketStore();
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
          {getCallMessageContent(message, activeChat)}
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
          <ProfileImage
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-white shadow-sm flex-shrink-0"
            user={{
              businessName: activeChat?.name,
              fullName: activeChat?.name,
            }}
            logo={message.avatar}
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
                      onClick={() => {
                        if (!message || !message.file) return;
                        return handleFileDownload(
                          message.file.url,
                          message.file.name
                        );
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex text-black items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                    {message.file &&
                      message &&
                      getFileIcon({ fileName: message.file.name })}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {message.file.name}
                      </p>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                      <Download
                        className="w-4 h-4"
                        onClick={() => {
                          if (!message || !message.file) return;
                          return handleFileDownload(
                            message.file.url,
                            message.file.name
                          );
                        }}
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
}
