import { BASEURL } from "@/constants/url";
import { uploadCloudinary } from "@/lib/cloudinary/uploadClodinary";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Contact } from "../../types";
import getBaseType from "@/lib/chat/getBaseType";

function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

interface CallerProps {
  name: string;
  avatar: string;
  callType: "video" | "audio" | null
}

interface Message {
  id: string;
  sender: string;
  recipient: string;
  content?: string;
  file?: {
    url: string;
    type: string;
    name: string;
  };
  type: "text" | "file" | "call";
  callDetails: {
    status: "attempted" | "connected" | "failed" | "rejected" | "ended" | "unavailable";
    callType: "audio" | "video";
  };
  timestamp: string; // ISO timestamp
  displayTime: string; // Formatted time for display
  isOwn: boolean;
  isSeen: boolean;
  seenAt?: string;
  avatar: string;
}



export default function useChat() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeChat, setActiveChat] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [callStatus, setCallStatus] = useState<
    "idle" | "ringing" | "connected" | "rejected" | "failed" | "ended" | "unavailable"
  >("idle");
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);
  const [caller, setCaller] = useState<CallerProps>({ name: "", avatar: "", callType: null })
  const [receiving, setReceiving] = useState(false)

  // Debounced user status handler
  const handleUserStatus = useCallback(
    debounce(({ userId, online }: { userId: string; online: boolean }) => {
      console.log(`User status update: ${userId} is ${online ? "online" : "offline"}`);
      setContacts((prev) =>
        prev.map((contact) =>
          contact.id === userId ? { ...contact, online } : contact
        )
      );
      if (activeChat?.id === userId) {
        setActiveChat((prev) => (prev ? { ...prev, online } : prev));
      }
    }, 1000),
    [activeChat]
  );

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      console.log("Stopping ringtone");
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    ringtoneRef.current = new Audio("/ringtones/ringtone-012-149904.mp3");
    ringtoneRef.current.loop = true;
    return () => {
      stopRingtone();
      ringtoneRef.current = null;
    };
  }, []);


  const sendCallMessage = async (
    status: Message["callDetails"]["status"],
    callType: "audio" | "video"
  ) => {
    if (!activeChat || !session?.user.id) return;
    try {
      const message = {
        senderId: session.user.id,
        recipientId: activeChat.id,
        type: "call",
        callDetails: { status, callType },
        timestamp: new Date().toISOString(),
      };
      console.log("Sending call message:", message);
      socketRef.current?.emit("sendMessage", message);
    } catch (err) {
      console.error("Error sending call message:", err);
      setError("Failed to log call event");
    }
  };


  const handleAcceptCall = useCallback(
    async (from: string, offer: any, callType: "audio" | "video") => {
      try {
        stopRingtone()
        setReceiving(false);
        setCallStatus("ringing");
        setCallType(callType);

        // Navigate to chat if not already there
        if (activeChat?.id !== from) {
          const contact = contacts.find((c) => c.id === from);
          if (contact) {
            setActiveChat(contact);
            setShowMobileChat(true);
            router.push(`/chat?recipientId=${from}`);
          } else {
            throw new Error("Caller not found in contacts");
          }
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === "video",
        });
        localStreamRef.current = stream;

        if (callType === "video" && localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch((err) => {
            console.error("Error playing local video:", err);
            setCallStatus("failed");
            sendCallMessage("failed", callType);
            setError("Failed to play local video. Check camera permissions.");
          });
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        peerConnectionRef.current = pc;

        pc.onicecandidateerror = (event) => {
          console.error("ICE candidate error:", event);
          setCallStatus("failed");
          sendCallMessage("failed", callType);
        };

        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
          if (pc.connectionState === "failed") {
            console.error("WebRTC connection failed");
            setCallStatus("failed");
            sendCallMessage("failed", callType);
          } else if (pc.connectionState === "connected") {
            console.log("Call connected at:", new Date().toISOString());
            setCallStatus("connected");
            sendCallMessage("connected", callType);
          }
        };

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socketRef.current?.emit("ice-candidate", {
              to: from,
              candidate: event.candidate,
            });
          }
        };

        pc.ontrack = (event) => {
          console.log("🎥 Got remote track!", event.streams);
          const [remoteStream] = event.streams;
          if (callType === "video" && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play().catch((err) => {
              console.error("Error playing remote video:", err);
              setCallStatus("failed");
              sendCallMessage("failed", callType);
            });
          } else if (callType === "audio" && remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = remoteStream;
            remoteAudioRef.current.play().catch((err) => {
              console.error("Error playing remote audio:", err);
              setCallStatus("failed");
              sendCallMessage("failed", callType);
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socketRef.current?.emit("answer-call", { to: from, answer });

        while (pendingIceCandidates.current.length) {
          const candidate = pendingIceCandidates.current.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding pending ICE candidate:", err);
          }
        }
      } catch (error) {
        console.error(`Error handling incoming ${callType} call:`, error);
        socketRef.current?.emit("reject-call", { to: from });
        setCallStatus("failed");
        setCallType(null);
        sendCallMessage("failed", callType);
        setError(`Failed to handle incoming ${callType} call`);
        setReceiving(false);
      }
    },
    [activeChat, contacts, router, sendCallMessage]
  );

  // Handle decline call
  const handleDeclineCall = useCallback(
    (from: string, callType: "audio" | "video") => {
      socketRef.current?.emit("reject-call", { to: from });
      setCallStatus("rejected");
      setCallType(null);
      sendCallMessage("rejected", callType);
      stopRingtone()
      setReceiving(false);
      setCaller({ name: "", avatar: "", callType: null });
    },
    [sendCallMessage]
  );

  const startCall = async (type: "audio" | "video") => {
    if (!activeChat || !session?.user.id) {
      setError("Cannot start call: No active chat or user");
      return;
    }
    // if (!activeChat.online) {
    //   // setError(`${activeChat.name || "User"} is offline. Please try again later.`);
    //   setCallStatus("unavailable");
    //   await sendCallMessage("unavailable", type);
    //   return;
    // }

    try {
      setCallStatus("ringing");
      setCallType(type);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: type === "video",
      });
      localStreamRef.current = stream;

      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.play().catch((err) => {
          console.error("Error playing local video:", err);
          setError("Failed to play local video. Check camera permissions.");
          setCallStatus("failed");
          sendCallMessage("failed", type);
        });
      }

      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      peerConnectionRef.current = pc;

      pc.onicecandidateerror = (event) => {
        console.error("ICE candidate error:", event);
        setCallStatus("failed");
        sendCallMessage("failed", type);
      };

      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
        if (pc.connectionState === "failed") {
          console.error("WebRTC connection failed");
          setCallStatus("failed");
          sendCallMessage("failed", type);
        } else if (pc.connectionState === "connected") {
          console.log("Call connected at:", new Date().toISOString());
          setCallStatus("connected");
          sendCallMessage("connected", type);
        }
      };

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socketRef.current?.emit("ice-candidate", {
            to: activeChat.id,
            candidate: event.candidate,
          });
        }
      };

      pc.ontrack = (event) => {
        console.log("🎥 Got remote track!", event.streams);
        const [remoteStream] = event.streams;
        if (type === "video" && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch((err) => {
            console.error("Error playing remote video:", err);
            setCallStatus("failed");
            sendCallMessage("failed", type);
          });
        } else if (type === "audio" && remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
          remoteAudioRef.current.play().catch((err) => {
            console.error("Error playing remote audio:", err);
            setCallStatus("failed");
            sendCallMessage("failed", type);
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("call-user", {
        to: activeChat.id,
        offer,
        callType: type,
      });

      const callTimeout = setTimeout(() => {
        console.error("Call timed out");
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
        }
        setCallStatus("ended");
        setCallType(null);
        sendCallMessage("ended", type);
      }, 120000);

      socketRef.current?.on("call-queued", ({ to, callType }) => {
        console.log(`Recipient ${to} is offline, call queued`);
        setError(`${contacts.find((c) => c.id === to)?.name || "User"} is offline, waiting for them to come online...`);
      });

      socketRef.current?.on("call-unavailable", async ({ to, callType }) => {
        stopRingtone()
        setReceiving(false)
        clearTimeout(callTimeout);
        console.log(`Recipient ${to} is offline for ${callType} call`);
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
        }
        setCallStatus("unavailable");
        sendCallMessage("unavailable", callType);
        setError(`${contacts.find((c) => c.id === to)?.name || "User"} is offline.`);
      });

      socketRef.current?.on("call-answered", async ({ answer }) => {
        clearTimeout(callTimeout);
        console.log("✅ Call answered, setting remote description...");
        await peerConnectionRef.current?.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
        setCallStatus("connected");
        sendCallMessage("connected", type);
      });

      socketRef.current?.on("call-rejected", () => {
        stopRingtone()
        setReceiving(false)
        clearTimeout(callTimeout);
        console.log("Call was rejected");
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
          localStreamRef.current = null;
        }
        setCallStatus("rejected");
        setCallType(null);
        sendCallMessage("rejected", type);
      });
    } catch (error) {
      console.error(`Error starting ${type} call:`, error);
      setCallStatus("failed");
      setCallType(null);
      sendCallMessage("failed", type);
      setError(`Failed to start ${type} call`);
    }
  };

  const endCall = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    socketRef.current?.emit("end-call", { to: activeChat?.id });
    setCallStatus("ended");
    if (callType) {
      sendCallMessage("ended", callType);
    }
    setCallType(null);
    setReceiving(false);
    setCaller({ name: "", avatar: "", callType: null });
    stopRingtone()
  };


  useEffect(() => {
    const fetchContactsAndRecipient = async () => {
      try {
        const res = await fetch(`/api/chat/contacts`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
        console.log("data", data);

        setContacts(
          data.map((contact: any) => ({
            ...contact,
            timestamp: contact.createdAt || new Date().toISOString(),
            displayTime: new Date(
              contact.createdAt || Date.now()
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          }))
        );
        console.log("contacts", contacts);

        const recipientId = searchParams.get("recipientId");
        if (recipientId) {
          let contact = data.find((c: Contact) => c.id === recipientId);
          if (!contact) {
            const recipientRes = await fetch(
              `/api/chat/contacts?recipientId=${recipientId}`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );
            if (!recipientRes.ok) throw new Error("Failed to fetch recipient");
            const recipientData = await recipientRes.json();
            contact = {
              ...recipientData,
              timestamp: recipientData.createdAt || new Date().toISOString(),
              displayTime: new Date(
                recipientData.createdAt || Date.now()
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
            };
          }
          if (contact) {
            setActiveChat(contact);
            setShowMobileChat(true);
          }
        } else if (data.length > 0) {
          setActiveChat({
            ...data[0],
            timestamp: data[0].createdAt || new Date().toISOString(),
            displayTime: new Date(
              data[0].createdAt || Date.now()
            ).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          });
        }
      } catch (error) {
        console.error("Error fetching contacts or recipient:", error);
        setError("Failed to load contacts");
      }
    };
    fetchContactsAndRecipient();
  }, [session?.user.id, searchParams])

  useEffect(() => {
    if (!session?.user.id) return;
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL);
    socketRef.current.emit("register", session.user.id);


    socketRef.current.on("newMessage", (message: Message) => {

      if (!message.timestamp || typeof message.timestamp !== "string") {
        console.error("Received message with invalid timestamp:", message);
        return;
      }
      const newMessage = {
        ...message,
        isOwn: message.sender === session?.user.id,
        displayTime: new Date(message.timestamp).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setContacts((prev) => {
        const contactExists = prev.find(
          (c) => c.id === message.sender || c.id === message.recipient
        );
        if (
          !contactExists &&
          (message.sender === session?.user.id ||
            message.recipient === session?.user.id)
        ) {
          fetch(
            `/api/chat/contacts?recipientId=${message.sender === session?.user.id
              ? message.recipient
              : message.sender
            }`
          )
            .then((res) => {
              if (!res.ok) throw new Error("Failed to fetch new contact");
              return res.json();
            })
            .then((newContact) => {
              if (newContact.id) {
                setContacts((prevContacts) => [
                  ...prevContacts,
                  {
                    ...newContact,
                    lastMessage:
                      message.content ||
                      (message.file
                        ? message.file.name
                        : message.type === "call"
                          ? `${message.callDetails?.callType} call ${message.callDetails?.status}`
                          : ""),
                    timestamp: message.timestamp || new Date().toISOString(),
                    displayTime: new Date(
                      message.timestamp || Date.now()
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    }),
                    unread:
                      message.recipient === session?.user.id && !message.isSeen
                        ? 1
                        : 0,
                  },
                ]);
              }
            })
            .catch((err) => {
              console.error("Error fetching new contact:", err);
              setError("Failed to load new contact");
            });
        }
        return prev.map((contact) =>
          contact.id === message.sender &&
            message.recipient === session?.user.id
            ? {
              ...contact,
              lastMessage:
                message.content ||
                (message.file
                  ? message.file.name
                  : message.type === "call"
                    ? `${message.callDetails?.callType} call ${message.callDetails?.status}`
                    : ""),
              timestamp: message.timestamp || new Date().toISOString(),
              displayTime: new Date(
                message.timestamp || Date.now()
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              unread: contact.unread + (message.isSeen ? 0 : 1),
            }
            : contact
        );
      });
      if (
        message.recipient === session?.user.id &&
        message.sender === activeChat?.id
      ) {
        socketRef.current?.emit("messageSeen", { messageId: message.id });
      }
    });

    socketRef.current.on("messageSent", (message: Message) => {
      // if (!message.timestamp || typeof message.timestamp !== "string") {
      //   console.error("Received messageSent with invalid timestamp:", message);
      //   return;
      // }
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== message.id),
        {
          ...message,
          isOwn: message.sender === session?.user.id,
          displayTime: new Date(message.timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
        },
      ]);
    });

    socketRef.current.on("messageError", ({ error }: { error: string }) => {
      setError(error);
    });

    socketRef.current.on("typing", ({ senderId }: { senderId: string }) => {
      if (senderId === activeChat?.id) {
        setIsTyping(true);
      }
    });

    socketRef.current.on("stopTyping", ({ senderId }: { senderId: string }) => {
      if (senderId === activeChat?.id) {
        setIsTyping(false);
      }
    });

    socketRef.current.on(
      "messageSeen",
      ({ messageId, seenAt }: { messageId: string; seenAt: string }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                ...msg,
                isSeen: true,
                seenAt: new Date(seenAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                }),
              }
              : msg
          )
        );
        setContacts((prev) =>
          prev.map((contact) =>
            contact.id === activeChat?.id ? { ...contact, unread: 0 } : contact
          )
        );
      }
    );

    const pendingIceCandidates: RTCIceCandidateInit[] = [];

    socketRef.current.on("receive-call", ({ from, offer, callType, callerName, callerLogo }) => {
      console.log(`📞 Incoming ${callType} call from: ${callerName}`);
      if (ringtoneRef.current) {
        ringtoneRef.current.play().catch((err) => {
          console.error("Error playing ringtone:", err);
          setError("Failed to play ringtone. Check audio permissions.");
        });
      }
      setCaller({ name: callerName, avatar: callerLogo, callType });
      setReceiving(true);

      // Store offer and from for later use
      (socketRef.current as any).callData = { from, offer, callType };

      socketRef.current?.once("call-cancelled", () => {
        console.log("Call cancelled by caller, setting receiving to false");
        stopRingtone()
        setReceiving(false);
        setCaller({ name: "", avatar: "", callType: null });
      });
    });

    socketRef.current.on("ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current) {
        if (peerConnectionRef.current.remoteDescription) {
          try {
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(candidate)
            );
          } catch (err) {
            console.error("Error adding received ICE candidate:", err);
          }
        } else {
          pendingIceCandidates.push(candidate);
        }
      }
    });

    socketRef.current.on("call-answered", async ({ answer }) => {
      console.log("✅ Call answered, setting remote description...");
      await peerConnectionRef.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
      while (pendingIceCandidates.length) {
        const candidate = pendingIceCandidates.shift();
        try {
          await peerConnectionRef.current?.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        } catch (err) {
          console.error("Error adding pending ICE candidate:", err);
        }
      }
      setCallStatus("connected");
    });

    socketRef.current.on("call-ended", () => {
      stopRingtone()
      setReceiving(false)
      console.log("Call ended by remote user");
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setCallStatus("ended");
      if (callType) {
        sendCallMessage("ended", callType);
      }
      setCallType(null);
      pendingIceCandidates.length = 0;
    });

    socketRef.current.on("userStatus", handleUserStatus);

    return () => {
      socketRef.current?.off("userStatus", handleUserStatus);
      socketRef.current?.disconnect();
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
      }
      setCallStatus("idle");
      setCallType(null);
      pendingIceCandidates.length = 0;
    };
  }, [session?.user.id, activeChat, searchParams]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      try {
        const res = await fetch(
          `/api/chat/messages?recipientId=${activeChat.id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(
          data
            .filter(
              (msg: any) => msg.createdAt && typeof msg.createdAt === "string"
            )
            .map((msg: any) => ({
              id: msg._id,
              sender: msg.sender._id,
              recipient: msg.recipient._id,
              content: msg.content,
              file: msg.file,
              type: msg.type || "text",
              callDetails: msg.callDetails,
              timestamp: msg.createdAt,
              displayTime: new Date(msg.createdAt).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }),
              isOwn: msg.sender._id === session?.user.id,
              isSeen: msg.isSeen,
              seenAt: msg.seenAt
                ? new Date(msg.seenAt).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                : undefined,
              avatar:
                msg.sender.logo ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            }))
        );
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Failed to load messages");
      }
    };

    if (activeChat && session?.user.id) {
      fetchMessages();
    }
  }, [activeChat, session?.user.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const formData = new FormData();
    formData.append("file", file);
    const mime = file.type;
    let fileType: "image" | "pdf" | "document";

    try {
      fileType = getBaseType(mime);
    } catch (err) {
      setError("Unsupported file type");
      return;
    }
    try {
      const logo_url = await uploadCloudinary(file);
      const data = {
        url: logo_url?.imageUrl,
        type: fileType,
        name: file.name,
      };
      if (data.url && activeChat && session?.user.id) {
        const message = {
          senderId: session.user.id,
          recipientId: activeChat.id,
          content: newMessage,
          file: data,
          type: "file",
          timestamp: new Date().toISOString(),
        };
        socketRef.current?.emit("sendMessage", message);
        setNewMessage("");
        setSelectedFile(null);
      } else {
        throw new Error("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setError("Failed to upload file");
    }
  };

  const handleSendMessage = () => {
    console.log('activestatus', activeChat);
    console.log('contact', contacts);
    console.log('filteredcontact', filteredContacts);
    if ((newMessage.trim() || selectedFile) && activeChat && session?.user.id) {
      if (selectedFile) {
        return;
      }
      const message = {
        senderId: session.user.id,
        recipientId: activeChat.id,
        content: newMessage,
        type: "text",
        timestamp: new Date().toISOString(),
      };
      socketRef.current?.emit("sendMessage", message);
      setNewMessage("");
      setShowEmojiPicker(false);
    }
  };

  const handleTyping = () => {
    if (activeChat && session?.user.id) {
      socketRef.current?.emit("typing", {
        senderId: session.user.id,
        recipientId: activeChat.id,
      });
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current?.emit("stopTyping", {
          senderId: session.user.id,
          recipientId: activeChat.id,
        });
      }, 2000);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };

  const handleContactClick = useCallback((contact: Contact) => {
    setActiveChat(contact);
    setShowMobileChat(true);
    setIsTyping(false);
    setError(null);
    messages
      .filter((msg) => msg.recipient === session?.user.id && !msg.isSeen)
      .forEach((msg) => {
        socketRef.current?.emit("messageSeen", { messageId: msg.id });
      });
    router.push(`/chat?recipientId=${contact.id}`);
  },
    [messages, session?.user.id, router]
  );

  const handleBackToContacts = () => {
    setShowMobileChat(false);
    setActiveChat(null);
    setError(null);
    router.push("/chat");
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      (contact.name?.toLowerCase() ?? "").includes(searchTerm.toLowerCase()) ||
      (contact.company?.toLowerCase() ?? "").includes(searchTerm.toLowerCase())
  );

  const groupMessagesByDate = (messages: Message[]) => {
    const grouped: { date: string; messages: Message[] }[] = [];
    let currentDate = "";
    messages.forEach((msg) => {
      if (!msg.timestamp || typeof msg.timestamp !== "string") {
        console.error("Invalid timestamp for message:", msg);
        return; // Skip invalid messages
      }
      try {
        const parsedDate = parseISO(msg.timestamp);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date parsed for message:", msg);
          return; // Skip messages with invalid dates
        }
        const msgDate = format(parsedDate, "yyyy-MM-dd");
        if (msgDate !== currentDate) {
          currentDate = msgDate;
          grouped.push({ date: msgDate, messages: [msg] });
        } else {
          grouped[grouped.length - 1].messages.push(msg);
        }
      } catch (error) {
        console.error("Error parsing timestamp for message:", msg, error);
      }
    });
    return grouped;
  };

  const getDateLabel = (date: string) => {
    const parsed = parseISO(date);
    if (isToday(parsed)) return "Today";
    if (isYesterday(parsed)) return "Yesterday";
    return format(parsed, "MMMM d, yyyy");
  };

  const getCallMessageContent = (msg: Message) => {
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
        return `${callType?.charAt(0).toUpperCase() + callType?.slice(1)
          } call failed`;
      case "unavailable":
        return isOwn
          ? `${activeChat?.name} was offline for your ${callType} call`
          : `You were offline for a ${callType} call from ${activeChat?.name}`;
      case "rejected":
        return isOwn
          ? `${activeChat?.name} rejected your ${callType} call`
          : `You rejected a ${callType} call`;
      case "ended":
        return `${callType.charAt(0).toUpperCase() + callType.slice(1)
          } call ended`;
      default:
        return "";
    }
  };

  const handleFileDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url, {
        mode: "cors",
      });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // cleanup
    } catch (err) {
      console.error("Download failed:", err);
      setError("Download failed:");
    }
  };

  return {
    showMobileChat, searchTerm, setSearchTerm, filteredContacts, handleContactClick, activeChat, handleBackToContacts, callStatus, callType, startCall, remoteAudioRef, endCall, localVideoRef, remoteVideoRef, error, groupMessagesByDate, getDateLabel, getCallMessageContent, messagesEndRef, setShowEmojiPicker, showEmojiPicker, handleEmojiClick, fileInputRef, handleFileChange, newMessage, setNewMessage, handleTyping, handleSendMessage, EmojiPicker, isTyping, messages, handleFileDownload, router, caller, receiving, onAcceptCall: () => handleAcceptCall((socketRef.current as any)?.callData?.from, (socketRef.current as any)?.callData?.offer, (socketRef.current as any)?.callData?.callType),
    onDeclineCall: () => handleDeclineCall((socketRef.current as any)?.callData?.from, (socketRef.current as any)?.callData?.callType),
  };
};
