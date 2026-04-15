import { Message } from "../../../../types";
import formatDuration from "./formatDuration";

export default function getCallMessageContent(msg: Message, activeChat: { name: string } | null) {
  if (msg.type !== "call" || !msg.callDetails) return "";

  const { status, callType, duration } = msg.callDetails;
  const isOwn = msg.isOwn;

  const capCall = callType.charAt(0).toUpperCase() + callType.slice(1);

  switch (status) {
    case "attempted":
      return isOwn
        ? `You tried to start a ${callType} call`
        : `${activeChat?.name} tried to start a ${callType} call`;

    case "connected":
      return duration
        ? `${capCall} call • Duration: ${formatDuration(Number(duration))}`
        : `Successful ${callType} call at ${msg.displayTime}`;

    case "failed":
      return isOwn
        ? `Your ${callType} call couldn’t connect`
        : `Missed ${callType} call from ${activeChat?.name}`;

    case "unavailable":
      return isOwn
        ? `${capCall} call could not be completed`
        : `Missed ${callType} call`;

    case "rejected":
      return isOwn
        ? `${activeChat?.name} declined your ${callType} call`
        : `You declined a ${callType} call`;

    case "ended":
      return duration
        ? `${capCall} call ended • Duration: ${formatDuration(Number(duration))}`
        : `${capCall} call ended`;

    default:
      return "";
  }
};