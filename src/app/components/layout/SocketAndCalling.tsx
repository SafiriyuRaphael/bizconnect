"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import IncomingCallModal from "../modals/IncomingCallModal";
import VideoCall from "../ui/VideoCall";
import { useSocketStore } from "@/store/useSocketStore";

export default function SocketAndCalls() {
  const { data: session } = useSession();
  const router = useRouter();
  const {
    caller,
    receiving,
    callStatus,
    localVideo,
    remoteVideo,
    remoteAudio,
    handleAcceptCall,
    handleDeclineCall,
    setLocalVideo,
    setRemoteVideo,
    setRemoteAudio,
    activeChat,
    callData,
    setRingtone,
  } = useSocketStore();
  const [isVideoMinimized, setIsVideoMinimized] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  // Set video and audio refs
  useEffect(() => {
    setLocalVideo(localVideoRef.current);
    setRemoteVideo(remoteVideoRef.current);
    setRemoteAudio(remoteAudioRef.current);
  }, [setLocalVideo, setRemoteVideo, setRemoteAudio]);

  // Initialize socket
  useEffect(() => {
    if (session?.user?.id) {
      useSocketStore.getState().initSocket();
      const audio = new Audio("/ringtones/ringtone-012-149904.mp3");
      setRingtone(audio);
    }
    return () => {
      useSocketStore.getState().clearSocket();
    };
  }, [session?.user?.id]);

  // Handle navigation on accept call
  const onAcceptCall = async () => {
    await handleAcceptCall();
    if (callData?.from) {
      router.push(`/chat?recipientId=${callData.from}`);
    }
  };

  return (
    <div>
      <IncomingCallModal
        isVisible={receiving}
        caller={caller || { name: "", avatar: "", callType: null }}
        onAccept={onAcceptCall}
        onDecline={handleDeclineCall}
        onDismiss={handleDeclineCall}
      />
      {callStatus === "connected" && (
        <VideoCall
          isVideoMinimized={isVideoMinimized}
          setIsVideoMinimized={setIsVideoMinimized}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          activeChat={activeChat}
        />
      )}
      <video
        id="localVideo"
        ref={localVideoRef}
        autoPlay
        muted
        style={{ display: "none" }}
      />
      <video
        id="remoteVideo"
        ref={remoteVideoRef}
        autoPlay
        style={{ display: "none" }}
      />
      <audio
        id="remoteAudio"
        ref={remoteAudioRef}
        autoPlay
        style={{ display: "none" }}
      />
    </div>
  );
}
