import { Check, CheckCheck } from "lucide-react";
import React from "react";
import { Message } from "../../../../../types";

export default function MessageStatus({ message }: {message: Message }) {
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
}
