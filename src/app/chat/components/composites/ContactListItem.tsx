import { Contact } from "../../../../../types";
import { Clock, Star } from "lucide-react";
import { useSocketStore } from "@/shared/store/useSocketStore";
import ProfileImage from "@/shared/components/composites/ProfileImage";

function ContactListItem({
  contact,
  activeChat,
  handleContactClick,
}: {
  contact: Contact;
  activeChat: Contact | null;
  handleContactClick: (contact: Contact) => void;
}) {
  const { activeUsers } = useSocketStore();

  const isActive = activeChat?.id === contact.id;
  const isOnline = activeUsers.includes(contact.id);
  const isStarred = contact.starred;

  return (
    <div
      onClick={() => handleContactClick(contact)}
      className={`group p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all duration-200 ${
        isActive ? "bg-blue-50 border-blue-200 shadow-sm hover:bg-blue-100" : ""
      }`}
      role="button"
      tabIndex={0}
      aria-label={`Chat with ${contact.name}${isStarred ? " (starred)" : ""}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleContactClick(contact);
        }
      }}
    >
      <div className="flex items-center space-x-3">
        {/* Enhanced Avatar with fallback */}
        <div className="relative flex-shrink-0">
          <ProfileImage
            user={{ businessName: contact.name, fullName: contact.name }}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm transition-all duration-200 ${
              isActive
                ? "ring-2 ring-blue-300"
                : "ring-2 ring-white group-hover:ring-gray-200"
            }`}
            logo={contact.avatar}
          />

          {/* Enhanced status indicator */}
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm transition-colors duration-300 ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
            aria-label={isOnline ? "Online" : "Offline"}
          />
        </div>

        {/* Contact Information */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <h3
                className={`font-semibold truncate transition-colors text-sm sm:text-base ${
                  isActive
                    ? "text-blue-700"
                    : "text-gray-900 group-hover:text-blue-600"
                }`}
              >
                {contact.name}
              </h3>

              {/* Star indicator */}
              {isStarred && (
                <Star
                  className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0"
                  aria-label="Starred contact"
                />
              )}
            </div>

            {/* Time and unread count container */}
            <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-2">
              <span className="text-xs text-gray-500 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {contact.displayTime}
              </span>

              {contact.unread > 0 && (
                <div className="bg-blue-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-medium shadow-sm">
                  {contact.unread > 99 ? "99+" : contact.unread}
                </div>
              )}
            </div>
          </div>

          {/* Company */}
          <p className="text-xs sm:text-sm text-gray-600 truncate mb-1 font-medium">
            {contact.company}
          </p>

          {/* Last Message */}
          <p
            className={`text-xs sm:text-sm truncate ${
              contact.unread > 0 ? "text-gray-900 font-medium" : "text-gray-500"
            }`}
          >
            {contact.lastMessage}
          </p>
        </div>
      </div>

      {/* Subtle active state overlay */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent pointer-events-none"></div>
      )}
    </div>
  );
}

ContactListItem.displayName = "ContactListItem";

export default ContactListItem;
