import React from "react";
import { Phone, PhoneOff, Video, User, X } from "lucide-react";

interface IncomingCallModalProps {
  isVisible: boolean;
  caller: {
    name: string;
    avatar: string;
    callType: "video" | "audio" | null;
  };
  onAccept: () => void;
  onDecline: () => void;
  onDismiss?: () => void;
}

const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isVisible,
  caller,
  onAccept,
  onDecline,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Top notification bar */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 max-w-sm w-full mx-4 overflow-hidden animate-slide-in-right">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {caller.callType === "video" ? (
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Video className="w-4 h-4 text-blue-600" />
                </div>
              ) : (
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-900">
                {caller.callType === "video" ? "Video Call" : "Incoming Call"}
              </span>
            </div>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-100">
                {caller.avatar ? (
                  <img
                    src={caller.avatar}
                    alt={caller.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>
              {/* Small pulsing indicator */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {caller.name}
              </h3>
              {caller.name && (
                <p className="text-xs text-gray-500 truncate">{caller.name}</p>
              )}
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mr-1"></div>
                <span>Calling...</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onDecline}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <PhoneOff className="w-4 h-4 mr-1" />
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm font-medium animate-pulse"
            >
              {caller.callType === "video" ? (
                <Video className="w-4 h-4 mr-1" />
              ) : (
                <Phone className="w-4 h-4 mr-1" />
              )}
              Accept
            </button>
          </div>
        </div>
      </div>

      {/* Optional: Minimalist floating version */}
      {/* You can use this instead if you want even smaller notification */}
      {/* 
      <div className="fixed top-4 right-4 z-50 bg-white rounded-full shadow-lg border border-gray-200 p-3 flex items-center space-x-3 animate-bounce-gentle">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img src={caller.avatar} alt={caller.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onDecline}
            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
          <button
            onClick={onAccept}
            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors animate-pulse"
          >
            {callType === "video" ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          </button>
        </div>
      </div>
      */}
    </>
  );
};

export default IncomingCallModal;
