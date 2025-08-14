import { useSocketStore } from "@/store/useSocketStore";
import {
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  Phone,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface VideoCallProps {
  isVideoMinimized: boolean;
  setIsVideoMinimized: (value: boolean) => void;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  activeChat: { name: string } | null;
}

export default function VideoCall({
  localVideoRef,
  remoteVideoRef,
  activeChat,
}: VideoCallProps) {
  const { endCall, callType, localStream } = useSocketStore();
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMuted;
      }
      if (callType === "video") {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
          videoTrack.enabled = !isVideoOff;
        }
      }
    }
  }, [isMuted, isVideoOff, callType]);

  return (
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
        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-lg transition-colors ${
              isMuted ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
            }`}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          {callType === "video" && (
            <button
              className={`p-2 rounded-lg transition-colors ${
                isVideoOff
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600"
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
      </div>
    </div>
  );
}
