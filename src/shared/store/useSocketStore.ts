import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { devtools } from "zustand/middleware";
import { getSession } from "next-auth/react";
import { Message, Contact, CallerProps, } from "../../../types";
import getUserById from "@/lib/profile/getUserById";
import apiService from "@/lib/service/apiService";
import axios from "axios";
import fetchContacts from "@/app/chat/api/fetchContacts";
import { Session } from "next-auth";
import formatTime from "../utils/formatTime";
import sortContacts from "@/app/chat/utils/sortContacts";

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
  startedAt?: string;
  endedAt?: string;
}

interface ActivitiesProp {
  id: string;
  type: "registration" | "call" | "connection";
  message: string;
  timestamp: Date;
  bgColor: string;
}


interface SocketStore {
  isLoadingMessage: boolean
  isLoadingInitialMessage: boolean
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
  setIsLoadingMessage: (isLoadingMessage: boolean) => void;
  setIsLoadingInitialMessage: (isLoadingMessage: boolean) => void;
  setRingtone: (audio: HTMLAudioElement | null) => void;
  setNotifications: (notifications: Notification[]) => void;
  callData: CallData | null;
  pagination: {
    total: number;
    page: number
    totalPages: number
  } | null

  initSocket: () => Promise<void>;
  setError: (error: string | null) => void;
  clearSocket: () => void;
  setActiveChat: (contact: Contact | null) => void;
  addPendingIceCandidate: (candidate: RTCIceCandidateInit) => void;
  clearPendingIceCandidates: () => void;
  stopRingtone: () => void;
  sendCallMessage: (status: string, callType: "video" | "audio", recipientId: string, startedAt?: string, endedAt?: string) => void;
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
  markChatRead: (session: Session, chatUserId: string) => void
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  updateNotification: (notificationId: string, updates: Partial<Notification>) => void;
  markAllNotificationsRead: () => Promise<void>
  setMessages: (message: Message[]) => void
  prependMessages: (olderMessages: Message[]) => void
  appendMessages: (olderMessages: Message[]) => void
  setPagination: (pagination: {
    total: number;
    page: number
    totalPages: number
  } | null) => void
  cleanupCall: () => void
}

export const useSocketStore = create<SocketStore>()(
  devtools((set, get) => ({
    socket: null,
    notifications: [],
    isLoadingMessage: false,
    isLoadingInitialMessage: false,
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
    pagination: { page: 1 },
    setRingtone: (audio: HTMLAudioElement | null): void => set({ ringtone: audio }),
    callData: null,
    unreadCount: 0,
    setUnreadCount: (count: number) => set({ unreadCount: count }),
    setError: (error) => set({ error }),
    setNotifications: (notifications: Notification[]) => set({ notifications }),
    setActiveChat: (contact) => set({ activeChat: contact }),
    setPagination: (pagination) => set({ pagination }),
    setMessages: (messages) => set({ messages }),
    appendMessages: (newMsgs) =>
      set((state) => ({ messages: [...state.messages, ...newMsgs] })),
    prependMessages: (olderMsgs) =>
      set((state) => ({ messages: [...olderMsgs, ...state.messages] })),
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
    sendCallMessage: async (status, callType, recipientId, startedAt, endedAt) => {
      const { socket } = get();
      if (!socket) return;
      const session = await getSession();
      if (!session?.user?.id) return;
      const message = {
        senderId: session.user.id,
        recipientId,
        type: "call",
        callDetails: {
          startedAt,
          endedAt: new Date().toISOString(), status, callType
        },
        timestamp: new Date().toISOString(),
      };

      socket.emit("sendMessage", message);
    },
    setActiveUsers: (users) => set({ activeUsers: users }),
    setIsLoadingMessage: (loading) => set({ isLoadingMessage: loading }),
    setIsLoadingInitialMessage: (loading) => set({ isLoadingInitialMessage: loading }),
    setActiveCalls: (count) => set({ activeCalls: count }),
    setIsTyping: (typing) => set({ isTyping: typing }),
    setStatus: (status) => set({ status }),
    recentActivities: [],
    cleanupCall: () => {
      const { peerConnection, localStream, remoteVideo, remoteAudio } = get();

      if (peerConnection) {
        peerConnection.close();
        set({ peerConnection: null });
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        set({ localStream: null });
      }
      get().stopRingtone();
      if (remoteVideo) remoteVideo.srcObject = null;
      if (remoteAudio) remoteAudio.srcObject = null;
    },
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
    // setCallStatus: (status) => set({ callStatus: status }),

    setCallStatus: (status) => {
      const current = get().callStatus;
      if (current === status) return;
      if (["failed", "ended"].includes(current)) return;
      set({ callStatus: status });
    },
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

      const { from, offer, callType, startedAt } = callData;
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
              name: userData.businessName || userData.fullName,
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
        // setActiveChat(callerContact);

        if (get().callStatus !== "ringing") {
          console.warn("Call already cancelled before accept.");
          return;
        }

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

        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === "connected") {
            set({ pendingIceCandidates: [] });
          }
        };

        pc.onicecandidateerror = (event) => {
          console.error("ICE candidate error:", event);
          set({ callStatus: "failed" });
          get().sendCallMessage("failed", callType, from);
        };

        let everConnected = false;

        pc.onconnectionstatechange = () => {


          if (pc.connectionState === "connected") {
            everConnected = true;
            const now = new Date();

            set({ callStatus: "connected", callData: { ...callData, startedAt: now.toISOString() } });
          }

          if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
            console.error("WebRTC connection dropped:", pc.connectionState);

            if (everConnected) {
              set({ callStatus: "ended" });
              get().sendCallMessage("ended", callType, from, startedAt, new Date().toISOString());
            } else {
              set({ callStatus: "failed" });
              get().sendCallMessage("failed", callType, from);
            }
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
          if (!candidate) continue;

          try {
            if (pc.remoteDescription) {
              await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } else {
              get().pendingIceCandidates.push(candidate);
            }
          } catch (err) {
            console.error("Error adding pending ICE candidate:", err);
          }
        }
        set({ pendingIceCandidates: [] });
      } catch (error) {
        console.error(`Error handling incoming ${callType} call:`, error);
        get().cleanupCall();
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
      // get().sendCallMessage("rejected", callType, from);
      get().stopRingtone();
    },


    markChatRead: (session: Session, chatUserId: string) => {
      const { socket, activeChat } = get()
      socket?.emit("markChatSeen", { chatUserId, viewerId: session.user.id });

      set((state) => ({
        messages: state.messages.map((msg): Message =>
          msg.sender === activeChat?.id && msg.recipient === session.user.id
            ? { ...msg, isSeen: true, seenAt: new Date().toISOString() }
            : msg
        ),
        contacts: state.contacts.map((contact): Contact =>
          contact.id === activeChat?.id ? { ...contact, unread: 0 } : contact
        ),
      }));
    },

    endCall: () => {
      const { peerConnection, localStream, localVideo, remoteVideo, remoteAudio, socket, callType, callData, } = get();
      const recipientId = callData?.to || callData?.from
      if (recipientId) {
        socket?.emit("end-call", { to: recipientId });
        if (callType) get().sendCallMessage("ended", callType, recipientId, callData.startedAt, callData.endedAt);
      }
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
        const { ringtone, callData } = get();

        if (ringtone) {
          ringtone.play().catch((err) => {
            console.error("Error playing ringtone:", err);
            set({ error: "Failed to play ringtone. Check audio permissions." });
          });
        }

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
          get().cleanupCall()
        };

        let everConnected = false;

        pc.onconnectionstatechange = () => {


          if (pc.connectionState === "connected") {
            everConnected = true;
            const now = new Date();

            set({ callStatus: "connected", callData: { ...callData as CallData, startedAt: now.toISOString() } });
          }

          if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
            console.error("WebRTC connection dropped:", pc.connectionState);

            if (everConnected) {
              set({ callStatus: "ended" });
              get().sendCallMessage("ended", type, userId, callData?.startedAt, new Date().toISOString());
            } else {
              set({ callStatus: "failed" });
              get().sendCallMessage("failed", type, userId);
            }

            get().cleanupCall();
          }

          // if (pc.connectionState === "closed") {
          //   console.log("Peer connection closed");
          //   set({ callStatus: "ended" });
          //   get().sendCallMessage("ended", type, userId);
          //   get().cleanupCall();
          // }
        };

        // pc.onconnectionstatechange = () => {
        //   console.log("Connection state:", pc.connectionState);
        //   if (pc.connectionState === "failed") {
        //     console.error("WebRTC connection failed");
        //     set({ callStatus: "failed" });
        //     get().sendCallMessage("failed", type, userId);
        //     get().cleanupCall()
        //   } else if (pc.connectionState === "connected") {
        //     console.log("Call connected at:", new Date().toISOString());
        //     set({ callStatus: "connected" });
        //     // get().sendCallMessage("connected", type, userId);
        //   }
        // };

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
              get().cleanupCall()
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
          get().cleanupCall()
          set({ callStatus: "ended", callType: null });
          get().sendCallMessage("ended", type, userId);
        }, 120000);

        socket.off("call-queued");
        socket.off("call-unavailable");
        socket.off("call-answered");
        socket.off("call-rejected");

        socket.on("call-queued", ({ to, callType }) => {

          set({
            error: `${contacts.find((c) => c.id === to)?.name || "User"
              } is offline, waiting for them to come online...`,
          });
        });


        socket.on("call-unavailable", async ({ to, callType }) => {
          get().stopRingtone();
          set({ receiving: false });
          clearTimeout(callTimeout);
          get().cleanupCall()
          set({ callStatus: "unavailable", callType: null });
          get().sendCallMessage("unavailable", callType, userId);
          set({ error: `${contacts.find((c) => c.id === to)?.name || "User"} is offline.` });
        });

        socket.on("call-answered", async ({ answer }) => {
          clearTimeout(callTimeout);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
            set({ callStatus: "connected" });
            // get().sendCallMessage("connected", type, userId);
          }
          get().stopRingtone();
        });

        socket.on("call-rejected", () => {
          get().stopRingtone();
          set({ receiving: false });
          clearTimeout(callTimeout);
          get().cleanupCall()
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
      const oldSocket = get().socket;
      if (oldSocket) {
        oldSocket.removeAllListeners();
        oldSocket.disconnect();
      }

      const socket = io(process.env.NEXT_PUBLIC_API_URL);
      socket.emit("register", session.user.id);
      set({ socket });

      const ringtone = get().ringtone;
      if (ringtone) ringtone.loop = true;


      socket.off("newMessage");
      socket.on("newMessage", (message: Message) => {
        const { id, sender, recipient, content, file, type, callDetails, timestamp, isSeen } = message;

        const formattedMessage = {
          ...message,
          isOwn: sender === session.user.id,
          displayTime: new Date(timestamp).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
            timeZone: "Africa/Lagos",
          }),
        };

        const { activeChat } = get();

        if (recipient === session.user.id && sender === activeChat?.id) {
          set(state => ({
            messages: [...state.messages, formattedMessage],
          }));
        }

        set(state => {
          const contactIndex = state.contacts.findIndex(
            c => c.id === sender || c.id === recipient
          );

          const lastMessageText =
            content ||
            (file
              ? file.name
              : type === "call"
                ? `${callDetails?.callType} call ${callDetails?.status}`
                : "");

          const displayTime = new Date(timestamp || Date.now()).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Africa/Lagos",
            }
          );

          const updatedContacts = [...state.contacts];
          let newContact;

          if (contactIndex === -1) {
            const recipientId = sender === session.user.id ? recipient : sender;

            fetchContacts(recipientId).then(data => {
              if (data && !Array.isArray(data) && data.id) {
                set(state => ({
                  contacts: [
                    ...state.contacts,
                    {
                      ...data,
                      lastMessage: lastMessageText,
                      timestamp: timestamp || new Date().toISOString(),
                      displayTime,
                      unread: recipient === session.user.id && !isSeen ? 1 : 0,
                    },
                  ],
                }));
              }
            });

            return state;
          } else {
            const contact = updatedContacts[contactIndex];
            const isActive = activeChat?.id === (sender === session.user.id ? recipient : sender);

            newContact = {
              ...contact,
              lastMessage: lastMessageText,
              timestamp: timestamp || new Date().toISOString(),
              displayTime,
              unread: isActive
                ? 0 // reset unread if chat is open
                : contact.unread + (recipient === session.user.id && !isSeen ? 1 : 0),
            };

            updatedContacts[contactIndex] = newContact;
          }

          return {
            contacts: sortContacts(updatedContacts),
          };
        });

        if (recipient === session.user.id && sender === activeChat?.id) {
          set((state) => ({
            contacts: state.contacts.map((contact): Contact =>
              contact.id === activeChat.id ? { ...contact, unread: 0 } : contact
            ),
          }));
          socket.emit("messageSeen", { messageId: id });
        }
      });

      socket.on("chatSeen", ({ viewerId, seenAt }) => {

        set((state) => ({
          messages: state.messages.map((msg): Message =>
            msg.recipient === viewerId && msg.isSeen === false
              ? { ...msg, isSeen: true, seenAt: formatTime(seenAt) }
              : msg
          ),
          contacts: state.contacts.map((contact): Contact =>
            contact.id === viewerId ? { ...contact, unread: 0 } : contact
          ),
        }));
      });


      socket.off("messageSent");
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
          // if (callType) get().sendCallMessage("ended", callType, recipientId);
        }
        set({ callType: null, pendingIceCandidates: [], callData: null });
      });

      // socket.on("userStatus", ({ userId, online }: { userId: string; online: boolean }) => {
      //   set((state) => ({
      //     contacts: state.contacts.map((contact) =>
      //       contact.id === userId ? { ...contact, online } : contact
      //     ),
      //     activeChat: state.activeChat?.id === userId ? { ...state.activeChat, online } : state.activeChat,
      //   }));
      // });

      socket.on("active-users", (data: string[]) => {


        set({ activeUsers: data });
      });

      socket.on("activeCalls", (data: { total: number; calls: ConnectionsMade[] }) => {
        set({ activeCalls: data.total });
      });

      socket.on("call-initiated", (data: { callerName: string }) => {
        get().addActivity("call", `${data.callerName} initiated a video call`, "bg-blue-500");
      });

      socket.on("newConnection", async (data: ConnectionsMade) => {
        try {
          const [receiver, caller] = await Promise.all([
            fetch(`/api/profile/get-users-by-id`, { body: data.to, method: "POST" }).then((res) => res.json()),
            fetch(`/api/profile/get-users-by-id`, { body: data.from, method: "POST" }).then((res) => res.json()),
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
        }
      });

      socket.on("status-update", (data: Status) => {
        set({ status: data });
      });

      socket.on("new-notification", (notification: Notification) => {
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
      }
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
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
      }
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