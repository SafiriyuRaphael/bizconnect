import { Contact, Message } from "../../../../types";

export default async function getCallMessageContent(msg: Message, activeChat: Contact | null) {
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
