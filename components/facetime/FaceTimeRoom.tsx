"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useParticipants,
  useRoomContext,
} from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import VideoGrid from "./VideoGrid";
import ControlsBar from "./ControlsBar";
import ReactionsOverlay from "./ReactionsOverlay";
import { Shield, Copy, Check, Clock } from "lucide-react";
import { playJoinSound, playLeaveSound, playEndCallSound } from "@/lib/sounds";

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

  const handleDisconnected = async () => {
    await playEndCallSound();
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
      {/* Sound Events for join & leave */}
      <RoomAudioEvents />

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

/**
 * Handles Web Audio chime playback when participants join or leave
 */
function RoomAudioEvents() {
  const room = useRoomContext();
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (!room) return;

    // Small delay so initial participants don't trigger join sound
    const timer = setTimeout(() => {
      isFirstMountRef.current = false;
    }, 1500);

    const handleParticipantConnected = () => {
      if (!isFirstMountRef.current) {
        playJoinSound();
      }
    };

    const handleParticipantDisconnected = () => {
      playLeaveSound();
    };

    room.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
    room.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);

    return () => {
      clearTimeout(timer);
      room.off(RoomEvent.ParticipantConnected, handleParticipantConnected);
      room.off(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
    };
  }, [room]);

  return null;
}

function RoomHeader({ roomId }: { roomId: string }) {
  const [seconds, setSeconds] = useState(0);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="absolute top-[max(0.75rem,env(safe-area-inset-top))] left-0 right-0 z-40 px-3 sm:px-6 flex items-center justify-between pointer-events-none">
      {/* Left: Shield icon. On click, expands to reveal room info & duration */}
      <div className="relative flex items-center gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsDetailsOpen((prev) => !prev)}
          className={`glass-pill w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
            isDetailsOpen
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 ring-2 ring-emerald-500/30"
              : "text-zinc-300 hover:text-white hover:bg-white/15"
          }`}
          title="Xavfsizlik va xona ma'lumotlari"
        >
          <Shield className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Dropdown Card when Shield Icon is clicked */}
        {isDetailsOpen && (
          <div className="absolute top-11 left-0 glass-panel p-4 rounded-3xl border border-white/15 shadow-2xl w-64 text-left animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Xona ma'lumotlari
              </span>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <Clock className="w-3 h-3" />
                <span>{formatTime(seconds)}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-zinc-900/90 border border-white/5 mb-3 flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-white truncate select-all">{roomId}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95 shrink-0"
                title="Havolani nusxalash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Xavfsiz va shifrlangan aloqa</span>
            </p>
          </div>
        )}
      </div>

      {/* Right side is intentionally empty for clean, distraction-free view */}
      <div />
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
