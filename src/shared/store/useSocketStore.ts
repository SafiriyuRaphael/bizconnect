import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { devtools } from "zustand/middleware";
import { getSession } from "next-auth/react";
import { Message, Contact, CallerProps, } from "../../../types";
import getUserById from "@/lib/profile/getUserById";
import apiService from "@/lib/service/apiService";
import axios from "axios";

interface ConnectionsMade {
  from: string;
  to: string;
}

type Status = {
  chatService: string;
  voiceCalls: string;
  videoCalls: string;
  database: string;
};

interface CallData {
  from: string;
  to?: string;
  offer: any;
  callType: "audio" | "video";
}

interface ActivitiesProp {
  id: string;
  type: "registration" | "call" | "connection";
  message: string;
  timestamp: Date;
  bgColor: string;
}


interface SocketStore {
  socket: Socket | null;
  messages: Message[];
  notifications: Notification[];
  contacts: Contact[];
  activeChat: Contact | null;
  isTyping: boolean;
  error: string | null;
  caller: CallerProps | null;
  receiving: boolean;
  callStatus: "idle" | "ringing" | "connected" | "ended" | "rejected" | "failed" | "unavailable";
  callType: "video" | "audio" | null;
  pendingIceCandidates: RTCIceCandidateInit[];
  activeUsers: string[];
  activeCalls: number;
  status: Status | null;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  peerConnection: RTCPeerConnection | null;
  localStream: MediaStream | null;
  localVideo: HTMLVideoElement | null;
  remoteVideo: HTMLVideoElement | null;
  remoteAudio: HTMLAudioElement | null;
  // ringtone: HTMLAudioElement | null;
  ringtone: HTMLAudioElement | null;
  setRingtone: (audio: HTMLAudioElement | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  callData: CallData | null;

  initSocket: () => Promise<void>;
  setError: (error: string | null) => void;
  clearSocket: () => void;
  setActiveChat: (contact: Contact | null) => void;
  addPendingIceCandidate: (candidate: RTCIceCandidateInit) => void;
  clearPendingIceCandidates: () => void;
  stopRingtone: () => void;
  sendCallMessage: (status: string, callType: "video" | "audio", recipientId: string) => void;
  setActiveUsers: (users: string[]) => void;
  setActiveCalls: (count: number) => void;
  setIsTyping: (typing: boolean) => void;
  setStatus: (status: Status) => void;
  recentActivities: ActivitiesProp[]
  addActivity: (type: "registration" | "call" | "connection", message: string, bgColor: string) => void;
  setPeerConnection: (pc: RTCPeerConnection | null) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setLocalVideo: (video: HTMLVideoElement | null) => void;
  setRemoteVideo: (video: HTMLVideoElement | null) => void;
  setRemoteAudio: (audio: HTMLAudioElement | null) => void;
  setCaller: (caller: CallerProps | null) => void;
  setReceiving: (receiving: boolean) => void;
  setCallStatus: (status: "idle" | "ringing" | "connected" | "ended" | "rejected" | "failed" | "unavailable") => void;
  setCallType: (callType: "video" | "audio" | null) => void;
  handleAcceptCall: () => Promise<void>;
  handleDeclineCall: () => void;
  endCall: () => void;
  startCall: (type: "audio" | "video", userId: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  updateNotification: (notificationId: string, updates: Partial<Notification>) => void;
  markAllNotificationsRead: () => Promise<void>
}

export const useSocketStore = create<SocketStore>()(
  devtools((set, get) => ({
    socket: null,
    notifications: [],
    messages: [],
    contacts: [],
    activeChat: null,
    isTyping: false,
    error: null,
    caller: null,
    receiving: false,
    callStatus: "idle",
    callType: null,
    pendingIceCandidates: [],
    activeUsers: [],
    activeCalls: 0,
    status: null,
    peerConnection: null,
    localStream: null,
    localVideo: null,
    remoteVideo: null,
    remoteAudio: null,
    ringtone: null,
    setRingtone: (audio: HTMLAudioElement | null): void => set({ ringtone: audio }),
    callData: null,
    unreadCount: 0,
    setUnreadCount: (count: number) => set({ unreadCount: count }),
    setError: (error) => set({ error }),
    setNotifications: (notifications: Notification[]) => set({ notifications }),
    setActiveChat: (contact) => set({ activeChat: contact }),
    addPendingIceCandidate: (candidate) =>
      set((state) => ({
        pendingIceCandidates: [...state.pendingIceCandidates, candidate],
      })),
    clearPendingIceCandidates: () => set({ pendingIceCandidates: [] }),
    stopRingtone: () => {
      const { ringtone } = get();
      if (ringtone) {
        ringtone.pause();
        ringtone.currentTime = 0;
      }
    },
    sendCallMessage: async (status, callType, recipientId) => {
      const { socket } = get();
      if (!socket) return;
      const session = await getSession();
      if (!session?.user?.id) return;
      const message = {
        senderId: session.user.id,
        recipientId,
        type: "call",
        callDetails: { status, callType },
        timestamp: new Date().toISOString(),
      };
      socket.emit("sendMessage", message);
    },
    setActiveUsers: (users) => set({ activeUsers: users }),
    setActiveCalls: (count) => set({ activeCalls: count }),
    setIsTyping: (typing) => set({ isTyping: typing }),
    setStatus: (status) => set({ status }),
    recentActivities: [],
    addActivity: (type, message, bgColor) => {
      const newActivity = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date(),
        bgColor,
      };
      set((state) => ({
        recentActivities: [newActivity, ...state.recentActivities.slice(0, 4)],
      }))

    },
    setPeerConnection: (pc) => set({ peerConnection: pc }),
    setLocalStream: (stream) => set({ localStream: stream }),
    setLocalVideo: (video) => set({ localVideo: video }),
    setRemoteVideo: (video) => set({ remoteVideo: video }),
    setRemoteAudio: (audio) => set({ remoteAudio: audio }),
    setCaller: (caller) => set({ caller }),
    setReceiving: (receiving) => set({ receiving }),
    setCallStatus: (status) => set({ callStatus: status }),
    setCallType: (callType) => set({ callType }),
    addNotification: (notification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),

    markNotificationRead: (notificationId) => {
      const { socket } = get();
      if (socket) {
        socket.emit("mark-notification-read", { notificationId });
      }
    },

    updateNotification: (notificationId, updates) =>
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, ...updates } : n
        ),
      })),

    handleAcceptCall: async () => {
      const { callData, contacts, socket, localVideo, remoteVideo, remoteAudio, setActiveChat } = get();
      if (!callData || !socket) {
        set({ error: "No incoming call data available" });
        return;
      }
      const { from, offer, callType, } = callData;
      try {
        get().stopRingtone();

        set({ receiving: false, callStatus: "ringing", callType, callData: { ...callData, to: from } });

        let callerContact = contacts.find((c) => c.id === from);
        if (!callerContact) {
          try {
            const userData = await getUserById(from);
            if (!userData?._id) {
              throw new Error("Invalid user data returned");
            }
            callerContact = {
              id: userData._id,
              name: userData.businessName || userData.fullName || "Unknown User",
              online: false,
              lastMessage: "",
              timestamp: new Date().toISOString(),
              displayTime: new Date().toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Africa/Lagos",
              }),
              unread: 0,
              avatar: userData.logo || "",
              company: userData.businessName || "Customer",
              username: userData.username || "",
            };
            set({ contacts: [...contacts, callerContact] });
          } catch (err) {
            console.error("Error fetching caller:", err);
            set({ error: `Cannot accept call: Caller with ID ${from} not found` });
            socket.emit("reject-call", { to: from });
            set({ callStatus: "failed", callType: null, receiving: false, callData: null });
            get().sendCallMessage("failed", callType, from);
            return;
          }
        }
        setActiveChat(callerContact);

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: callType === "video",
        });
        set({ localStream: stream });

        if (callType === "video" && localVideo) {
          localVideo.srcObject = stream;
          localVideo.play().catch((err) => {
            console.error("Error playing local video:", err);
            set({ error: "Failed to play local video. Check camera permissions.", callStatus: "failed" });
            get().sendCallMessage("failed", callType, from);
          });
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        set({ peerConnection: pc });

        pc.onicecandidateerror = (event) => {
          console.error("ICE candidate error:", event);
          set({ callStatus: "failed" });
          get().sendCallMessage("failed", callType, from);
        };

        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
          if (pc.connectionState === "failed") {
            console.error("WebRTC connection failed");
            set({ callStatus: "failed" });
            get().sendCallMessage("failed", callType, from);
          } else if (pc.connectionState === "connected") {
            console.log("Call connected at:", new Date().toISOString());
            set({ callStatus: "connected" });
            get().sendCallMessage("connected", callType, from);
          }
        };

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: from,
              candidate: event.candidate,
            });
          }
        };

        pc.ontrack = (event) => {
          console.log("🎥 Got remote track!", event.streams);
          const [remoteStream] = event.streams;
          if (callType === "video" && remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play().catch((err) => {
              console.error("Error playing remote video:", err);
              set({ callStatus: "failed" });
              get().sendCallMessage("failed", callType, from);
            });
          } else if (callType === "audio" && remoteAudio) {
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play().catch((err) => {
              console.error("Error playing remote audio:", err);
              set({ callStatus: "failed" });
              get().sendCallMessage("failed", callType, from);
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("answer-call", { to: from, answer });

        const pendingCandidates = get().pendingIceCandidates;
        while (pendingCandidates.length) {
          const candidate = pendingCandidates.shift();
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("Error adding pending ICE candidate:", err);
          }
        }
        set({ pendingIceCandidates: [], callData: null });
      } catch (error) {
        console.error(`Error handling incoming ${callType} call:`, error);
        socket.emit("reject-call", { to: from });
        set({ callStatus: "failed", callType: null, receiving: false, callData: null });
        get().sendCallMessage("failed", callType, from);
        set({ error: `Failed to handle incoming ${callType} call` });
      }
    },

    handleDeclineCall: () => {
      const { callData, socket } = get();
      if (!callData || !socket) return;
      const { from, callType } = callData;
      socket.emit("reject-call", { to: from });
      set({ callStatus: "rejected", callType: null, receiving: false, caller: null, callData: null });
      get().sendCallMessage("rejected", callType, from);
      get().stopRingtone();
    },

    endCall: () => {
      const { peerConnection, localStream, localVideo, remoteVideo, remoteAudio, socket, callType, callData } = get();
      if (peerConnection) {
        peerConnection.close();
        set({ peerConnection: null });
      }
      if (remoteAudio) remoteAudio.srcObject = null;
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        set({ localStream: null });
      }
      if (localVideo) localVideo.srcObject = null;
      if (remoteVideo) remoteVideo.srcObject = null;
      const recipientId = callData?.to
      if (recipientId) {
        socket?.emit("end-call", { to: recipientId });
        if (callType) get().sendCallMessage("ended", callType, recipientId);
      }
      get().stopRingtone();
      set({ callStatus: "ended", callType: null, receiving: false, caller: null, callData: null });
    },

    startCall: async (type: "audio" | "video", userId: string) => {
      const { socket, localVideo, remoteVideo, remoteAudio, contacts, } = get();
      const session = await getSession();
      if (!session?.user?.id || !socket) {
        set({ error: "Cannot start call: No user session or socket connection" });
        return;
      }

      // Find or fetch the contact
      let targetContact = contacts.find((c) => c.id === userId);
      if (!targetContact) {
        try {
          const userData = await getUserById(userId);
          targetContact = {
            id: userData._id,
            name: userData.businessName || userData.fullName || "Unknown User",
            online: false,
            lastMessage: "",
            timestamp: new Date().toISOString(),
            displayTime: new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Africa/Lagos",
            }),
            unread: 0,
            avatar: userData.logo || "",
            company: userData.businessName || "Customer",
            username: userData.username
          };
          set({ contacts: [...contacts, targetContact] });
        } catch (err) {
          console.error("Error fetching user:", err);
          set({ error: `Cannot start call: User with ID ${userId} not found` });
          return;
        }
      }
      // setActiveChat(targetContact);
      try {
        set({ callStatus: "ringing", callType: type, callData: { from: session.user.id, to: userId, offer: null, callType: type } })

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "video",
        });
        set({ localStream: stream });

        if (type === "video" && localVideo) {
          localVideo.srcObject = stream;
          localVideo.play().catch((err) => {
            console.error("Error playing local video:", err);
            set({ error: "Failed to play local video. Check camera permissions.", callStatus: "failed" });
            get().sendCallMessage("failed", type, userId);
          });
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });
        set({ peerConnection: pc });

        pc.onicecandidateerror = (event) => {
          console.error("ICE candidate error:", event);
          set({ callStatus: "failed" });
          get().sendCallMessage("failed", type, userId);
        };

        pc.onconnectionstatechange = () => {
          console.log("Connection state:", pc.connectionState);
          if (pc.connectionState === "failed") {
            console.error("WebRTC connection failed");
            set({ callStatus: "failed" });
            get().sendCallMessage("failed", type, userId);
          } else if (pc.connectionState === "connected") {
            console.log("Call connected at:", new Date().toISOString());
            set({ callStatus: "connected" });
            get().sendCallMessage("connected", type, userId);
          }
        };

        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              to: userId,
              candidate: event.candidate,
            });
          }
        };

        pc.ontrack = (event) => {
          console.log("🎥 Got remote track!", event.streams);
          const [remoteStream] = event.streams;
          if (type === "video" && remoteVideo) {
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play().catch((err) => {
              console.error("Error playing remote video:", err);
              set({ callStatus: "failed" });
              get().sendCallMessage("failed", type, userId);
            });
          } else if (type === "audio" && remoteAudio) {
            remoteAudio.srcObject = remoteStream;
            remoteAudio.play().catch((err) => {
              console.error("Error playing remote audio:", err);
              set({ callStatus: "failed" });
              get().sendCallMessage("failed", type, userId);
            });
          }
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("call-user", {
          to: userId,
          offer,
          callType: type,
        });

        const callTimeout = setTimeout(() => {
          console.error("Call timed out");
          if (pc) {
            pc.close();
            set({ peerConnection: null });
          }
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            set({ localStream: null });
          }
          set({ callStatus: "ended", callType: null });
          get().sendCallMessage("ended", type, userId);
        }, 120000);

        socket.on("call-queued", ({ to, callType }) => {
          console.log(`Recipient ${to} is offline, call queued`);
          set({
            error: `${contacts.find((c) => c.id === to)?.name || "User"
              } is offline, waiting for them to come online...`,
          });
        });

        socket.on("call-unavailable", async ({ to, callType }) => {
          get().stopRingtone();
          set({ receiving: false });
          clearTimeout(callTimeout);
          console.log(`Recipient ${to} is offline for ${callType} call`);
          if (pc) {
            pc.close();
            set({ peerConnection: null });
          }
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            set({ localStream: null });
          }
          set({ callStatus: "unavailable", callType: null });
          get().sendCallMessage("unavailable", callType, userId);
          set({ error: `${contacts.find((c) => c.id === to)?.name || "User"} is offline.` });
        });

        socket.on("call-answered", async ({ answer }) => {
          clearTimeout(callTimeout);
          console.log("✅ Call answered, setting remote description...");
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            set({ callStatus: "connected" });
            get().sendCallMessage("connected", type, userId);
          }
        });

        socket.on("call-rejected", () => {
          get().stopRingtone();
          set({ receiving: false });
          clearTimeout(callTimeout);
          console.log("Call was rejected");
          if (pc) {
            pc.close();
            set({ peerConnection: null });
          }
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            set({ localStream: null });
          }
          set({ callStatus: "rejected", callType: null });
          get().sendCallMessage("rejected", type, userId);
        });
      } catch (error) {
        console.error(`Error starting ${type} call:`, error);
        set({ callStatus: "failed", callType: null });
        get().sendCallMessage("failed", type, userId);
        set({ error: `Failed to start ${type} call` });
      }
    },

    initSocket: async () => {
      const session = await getSession();
      if (!session?.user?.id || !process.env.NEXT_PUBLIC_API_URL) {
        set({ error: "Session or API URL not configured" });
        return;
      }

      const socket = io(process.env.NEXT_PUBLIC_API_URL);
      socket.emit("register", session.user.id);
      set({ socket });

      const ringtone = get().ringtone;
      if (ringtone) ringtone.loop = true;

      socket.on("newMessage", (message: Message) => {
        if (!message.timestamp || typeof message.timestamp !== "string") {
          console.error("Received message with invalid timestamp:", message);
          return;
        }
        const newMessage = {
          ...message,
          isOwn: message.sender === session.user.id,
          displayTime: new Date(message.timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Africa/Lagos",
          }),
        };
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        set((state) => {
          const contactExists = state.contacts.find(
            (c) => c.id === message.sender || c.id === message.recipient
          );
          if (
            !contactExists &&
            (message.sender === session.user.id ||
              message.recipient === session.user.id)
          ) {
            fetch(
              `/api/chat/contacts?recipientId=${message.sender === session.user.id
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
                  set((state) => ({
                    contacts: [
                      ...state.contacts,
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
                          timeZone: "Africa/Lagos",
                        }),
                        unread:
                          message.recipient === session.user.id && !message.isSeen
                            ? 1
                            : 0,
                      },
                    ],
                  }));
                }
              })
              .catch((err) => {
                console.error("Error fetching new contact:", err);
                set({ error: "Failed to load new contact" });
              });
          }
          return {
            contacts: state.contacts.map((contact) =>
              contact.id === message.sender &&
                message.recipient === session.user.id
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
                    timeZone: "Africa/Lagos",
                  }),
                  unread: contact.unread + (message.isSeen ? 0 : 1),
                }
                : contact
            ),
          };
        });

        const { activeChat } = get();
        if (
          message.recipient === session.user.id &&
          message.sender === activeChat?.id
        ) {
          socket.emit("messageSeen", { messageId: message.id });
        }
      });

      socket.on("messageSent", (message: Message) => {
        set((state) => ({
          messages: [
            ...state.messages.filter((m) => m.id !== message.id),
            {
              ...message,
              isOwn: message.sender === session.user.id,
              displayTime: new Date(message.timestamp).toLocaleTimeString(
                "en-US",
                { hour: "numeric", minute: "2-digit", hour12: true }
              ),
            },
          ],
        }));
      });

      socket.on("messageError", ({ error }: { error: string }) => {
        set({ error });
      });

      socket.on("typing", ({ senderId }: { senderId: string }) => {
        const { activeChat } = get();
        if (senderId === activeChat?.id) {
          set({ isTyping: true });
        }
      });

      socket.on("stopTyping", ({ senderId }: { senderId: string }) => {
        const { activeChat } = get();
        if (senderId === activeChat?.id) {
          set({ isTyping: false });
        }
      });

      socket.on(
        "messageSeen",
        ({ messageId, seenAt }: { messageId: string; seenAt: string }) => {
          set((state) => ({
            messages: state.messages.map((msg) =>
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
            ),
            contacts: state.contacts.map((contact) =>
              contact.id === state.activeChat?.id
                ? { ...contact, unread: 0 }
                : contact
            ),
          }));
        }
      );

      socket.on("receive-call", ({ from, offer, callType, callerName, callerLogo }) => {
        console.log(`📞 Incoming ${callType} call from: ${callerName}`);
        const { ringtone } = get();
        if (ringtone) {
          ringtone.play().catch((err) => {
            console.error("Error playing ringtone:", err);
            set({ error: "Failed to play ringtone. Check audio permissions." });
          });
        }
        set({
          caller: { name: callerName, avatar: callerLogo, callType },
          receiving: true,
          callData: { from, offer, callType },
          callType
        });

        socket.once("call-cancelled", () => {
          console.log("Call cancelled by caller, setting receiving to false");
          get().stopRingtone();
          set({ receiving: false, caller: null, callData: null });
        });
      });

      socket.on("ice-candidate", async ({ candidate }) => {
        const { peerConnection } = get();
        if (peerConnection) {
          if (peerConnection.remoteDescription) {
            try {
              await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error("Error adding received ICE candidate:", err);
            }
          } else {
            get().addPendingIceCandidate(candidate);
          }
        }
      });

      socket.on("call-answered", async ({ answer }) => {
        console.log("✅ Call answered, setting remote description...");
        const { peerConnection, pendingIceCandidates } = get();
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          while (pendingIceCandidates.length) {
            const candidate = pendingIceCandidates.shift();
            try {
              await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
              console.error("Error adding pending ICE candidate:", err);
            }
          }
          set({ callStatus: "connected", pendingIceCandidates: [] });
        }
      });

      socket.on("call-ended", () => {
        const { stopRingtone, peerConnection, localStream, localVideo, remoteVideo, callType, callData } = get();
        stopRingtone();
        set({ receiving: false });
        console.log("Call ended by remote user");
        if (peerConnection) {
          peerConnection.close();
          set({ peerConnection: null });
        }
        if (localStream) {
          localStream.getTracks().forEach((track) => track.stop());
          set({ localStream: null });
        }
        if (localVideo) localVideo.srcObject = null;
        if (remoteVideo) remoteVideo.srcObject = null;
        set({ callStatus: "ended" });
        const recipientId = callData?.to
        if (recipientId) {
          socket?.emit("end-call", { to: recipientId });
          if (callType) get().sendCallMessage("ended", callType, recipientId);
        }
        set({ callType: null, pendingIceCandidates: [], callData: null });
      });

      socket.on("userStatus", ({ userId, online }: { userId: string; online: boolean }) => {
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === userId ? { ...contact, online } : contact
          ),
          activeChat: state.activeChat?.id === userId ? { ...state.activeChat, online } : state.activeChat,
        }));
      });

      socket.on("active-users", (data: string[]) => {
        console.log("🔥 Active Users: ", data);
        set({ activeUsers: data });
      });

      socket.on("activeCalls", (data: { total: number; calls: ConnectionsMade[] }) => {
        set({ activeCalls: data.total });
      });

      socket.on("call-initiated", (data: { callerName: string }) => {
        get().addActivity("call", `${data.callerName} initiated a video call`, "bg-blue-500");
      });

      socket.on("newConnection", async (data: ConnectionsMade) => {
        console.log("Chat sent: ", data);
        try {
          const [receiver, caller] = await Promise.all([
            fetch(`/api/users/${data.to}`).then((res) => res.json()),
            fetch(`/api/users/${data.from}`).then((res) => res.json()),
          ]);
          const from = receiver?.businessName || receiver?.fullName;
          const to = caller?.businessName || caller?.fullName;
          get().addActivity(
            "connection",
            `New Connection made between ${from} and ${to}`,
            "bg-purple-500"
          );
        } catch (err) {
          console.error("Error fetching users for new connection:", err);
          set({ error: "Failed to load new connection details" });
        }
      });

      socket.on("status-update", (data: Status) => {
        console.log("📡 Service Status:", data);
        set({ status: data });
      });

      socket.on("new-notification", (notification: Notification) => {
        console.log("📢 New Notification:", notification);
        get().addNotification({
          ...notification,
          createdAt: new Date(notification.createdAt),
        });
      });

      socket.on("notification-count", (count: number) => {
        set({ unreadCount: count })
      });

      socket.on("notification-updated", ({ id, isRead }: { id: string; isRead: boolean }) => {
        get().updateNotification(id, { isRead });
      });

      const statusInterval = setInterval(() => {
        socket.emit("check-status");
      }, 5000);

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
        set({ error: "Failed to connect to server" });
      });

      return () => {
        clearInterval(statusInterval);
        socket.disconnect();
        set({ socket: null });
      };
    },

    markAllNotificationsRead: async () => {
      try {
        const session = await getSession();
        if (!session?.user?.id) {
          console.error("No user session found");
          return;
        }

        const readAll = await apiService({
          method: "POST",
          baseUrl: process.env.NEXT_PUBLIC_API_URL,
          endpoint: "/api/notifications/mark-all-read",
          body: { userId: session.user.id },
          headers: new axios.AxiosHeaders({ "x-api-key": process.env.NEXT_PUBLIC_NOTIFY_API_KEY! }),
          requiresAuth: false,
        });

        if (readAll.response.status === 200) {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
          }));
          set({ unreadCount: 0 });
        }
      } catch (error: any) {
        console.error("Error marking all notifications as read:", error);
      }
    },

    clearSocket: () => {
      const { socket, stopRingtone, peerConnection, localStream, localVideo, remoteVideo, remoteAudio } = get();
      if (socket) socket.disconnect();
      stopRingtone();
      if (peerConnection) peerConnection.close();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      if (localVideo) localVideo.srcObject = null;
      if (remoteVideo) remoteVideo.srcObject = null;
      if (remoteAudio) remoteAudio.srcObject = null;
      set({
        socket: null,
        messages: [],
        contacts: [],
        activeChat: null,
        isTyping: false,
        error: null,
        caller: null,
        receiving: false,
        callStatus: "idle",
        callType: null,
        pendingIceCandidates: [],
        activeUsers: [],
        activeCalls: 0,
        status: null,
        peerConnection: null,
        localStream: null,
        localVideo: null,
        remoteVideo: null,
        remoteAudio: null,
        callData: null,
        notifications: [],
        unreadCount: 0,
      });
    },
  }))
);