"use client";

import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  Smile,
  Copy,
  Check,
  Users,
} from "lucide-react";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { sendReaction } from "./ReactionsOverlay";
import { useLanguage } from "@/context/LanguageContext";

const EMOJIS = ["❤️", "👍", "👏", "🎉", "🔥", "😂", "👋", "🚀"];

interface ControlsBarProps {
  participantCount: number;
  onLeave: () => void;
}

export default function ControlsBar({ participantCount, onLeave }: ControlsBarProps) {
  const { t } = useLanguage();
  const room = useRoomContext();
  const {
    isMicrophoneEnabled,
    isCameraEnabled,
    isScreenShareEnabled,
    localParticipant,
  } = useLocalParticipant();

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleMic = async () => {
    if (localParticipant) {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
    }
  };

  const toggleCamera = async () => {
    if (localParticipant) {
      await localParticipant.setCameraEnabled(!isCameraEnabled);
    }
  };

  const toggleScreenShare = async () => {
    if (localParticipant) {
      try {
        if (!isScreenShareEnabled) {
          await localParticipant.setScreenShareEnabled(true, {
            audio: false,
            selfBrowserSurface: "exclude",
            surfaceSwitching: "include",
            preferCurrentTab: false,
            resolution: { width: 1280, height: 720, frameRate: 15 },
          });
        } else {
          await localParticipant.setScreenShareEnabled(false);
        }
      } catch (e) {
        console.warn("Screen share cancelled or failed:", e);
      }
    }
  };

  const handleEmojiClick = (emoji: string) => {
    sendReaction(room, emoji);
    setShowEmojiPicker(false);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3">
      {/* Emoji Picker Popup (Floating above controls) */}
      {showEmojiPicker && (
        <div className="glass-panel px-4 py-2.5 rounded-full flex items-center gap-2 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl hover:scale-130 transition-transform p-1 rounded-full active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main FaceTime Dock */}
      <div className="glass-panel px-4 py-2.5 rounded-full flex items-center gap-2 sm:gap-3.5 shadow-2xl border border-white/15">
        {/* Participants count pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-zinc-200 mr-1 select-none">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>{participantCount}</span>
        </div>

        {/* Microphone */}
        <button
          onClick={toggleMic}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition duration-200 ${
            isMicrophoneEnabled
              ? "bg-white/15 hover:bg-white/25 text-white active:scale-95"
              : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
          }`}
          title={isMicrophoneEnabled ? t.muteMic : t.unmuteMic}
        >
          {isMicrophoneEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition duration-200 ${
            isCameraEnabled
              ? "bg-white/15 hover:bg-white/25 text-white active:scale-95"
              : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
          }`}
          title={isCameraEnabled ? t.turnOffCam : t.turnOnCam}
        >
          {isCameraEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition duration-200 ${
            isScreenShareEnabled
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600"
              : "bg-white/15 hover:bg-white/25 text-white active:scale-95"
          }`}
          title={isScreenShareEnabled ? t.screenShareToggleOn : t.screenShareToggleOff}
        >
          <ScreenShare className="w-5 h-5" />
        </button>

        {/* Reactions (Emojis) */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition duration-200 ${
            showEmojiPicker
              ? "bg-amber-500/80 text-white ring-2 ring-amber-400"
              : "bg-white/15 hover:bg-white/25 text-white active:scale-95"
          }`}
          title={t.reactionsTooltip}
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Copy Invite Link */}
        <button
          onClick={handleCopyLink}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition active:scale-95 relative"
          title={t.copyLinkBtn}
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          {copied && (
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-black/80 text-emerald-400 text-[10px] font-medium whitespace-nowrap border border-emerald-500/30">
              {t.copiedBtn}
            </span>
          )}
        </button>

        {/* End Call / Leave Button (FaceTime Red) */}
        <button
          onClick={onLeave}
          className="w-12 h-11 sm:w-14 sm:h-12 px-4 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 transition active:scale-95 ml-1"
          title={t.endCallTooltip}
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
