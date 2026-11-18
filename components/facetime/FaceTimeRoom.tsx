"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  ConnectionStateToast,
} from "@livekit/components-react";
import VideoGrid from "./VideoGrid";
import ControlsBar from "./ControlsBar";
import ReactionsOverlay from "./ReactionsOverlay";
import { Shield, Sparkles } from "lucide-react";

interface FaceTimeRoomProps {
  token: string;
  serverUrl: string;
  roomId: string;
  username: string;
  initialFacingMode?: "user" | "environment";
}

export default function FaceTimeRoom({
  token,
  serverUrl,
  roomId,
  username,
  initialFacingMode = "user",
}: FaceTimeRoomProps) {
  const router = useRouter();

  // Mobile wakeLock & auto-resume video when returning from background
  useEffect(() => {
    let wakeLock: any = null;
    const requestWake = async () => {
      if (typeof navigator !== "undefined" && "wakeLock" in navigator) {
        try {
          wakeLock = await (navigator as any).wakeLock.request("screen");
        } catch (e) {}
      }
    };
    requestWake();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        requestWake();
        // Resume all videos when returning to browser tab
        document.querySelectorAll("video").forEach((video) => {
          if (video.paused) video.play().catch(() => {});
        });
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, []);

  const handleDisconnected = () => {
    router.push("/");
  };

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      video={true}
      audio={true}
      onDisconnected={handleDisconnected}
      data-lk-theme="default"
      className="relative w-full h-[100dvh] overflow-hidden bg-black flex flex-col justify-between"
    >
      {/* Top Header Bar */}
      <RoomHeader roomId={roomId} />

      {/* Main FaceTime Video Stage */}
      <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        <VideoGrid roomId={roomId} />
        <ReactionsOverlay />
      </div>

      {/* Floating Bottom Controls */}
      <RoomControls onLeave={handleDisconnected} initialFacingMode={initialFacingMode} />

      {/* Automatically renders all incoming remote audio streams */}
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}

function RoomHeader({ roomId }: { roomId: string }) {
  const [seconds, setSeconds] = useState(0);

  // Call duration timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-0 right-0 z-40 px-3 sm:px-6 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-pill px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold text-white/90 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>FaceTime</span>
          <span className="text-white/40">|</span>
          <span className="text-zinc-300 font-mono">{formatTime(seconds)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-pill px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs text-zinc-300">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-mono text-[11px] sm:text-xs">{roomId}</span>
        </div>
      </div>
    </header>
  );
}

function RoomControls({
  onLeave,
  initialFacingMode,
}: {
  onLeave: () => void;
  initialFacingMode?: "user" | "environment";
}) {
  const participants = useParticipants();
  return (
    <ControlsBar
      participantCount={participants.length}
      onLeave={onLeave}
      initialFacingMode={initialFacingMode}
    />
  );
}
