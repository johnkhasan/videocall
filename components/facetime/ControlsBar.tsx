"use client";

import React, { useState, useEffect } from "react";
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
  SwitchCamera,
} from "lucide-react";
import { useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { Track } from "livekit-client";
import { sendReaction } from "./ReactionsOverlay";
import { useLanguage } from "@/context/LanguageContext";

const EMOJIS = ["❤️", "👍", "👏", "🎉", "🔥", "😂", "👋", "🚀"];

interface ControlsBarProps {
  participantCount: number;
  onLeave: () => void;
  initialFacingMode?: "user" | "environment";
}

export default function ControlsBar({
  participantCount,
  onLeave,
  initialFacingMode = "user",
}: ControlsBarProps) {
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
  const [facingMode, setFacingMode] = useState<"user" | "environment">(initialFacingMode);
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [isSwitchingCamera, setIsSwitchingCamera] = useState(false);
  const [shortcutFeedback, setShortcutFeedback] = useState<string | null>(null);

  // Check if device has multiple cameras (mobile phone front/back)
  useEffect(() => {
    const checkCameras = async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoInputs = devices.filter((d) => d.kind === "videoinput");
          const isTouchOrMobile =
            /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
            ("ontouchstart" in window || navigator.maxTouchPoints > 0);
          setHasMultipleCameras(videoInputs.length > 1 || isTouchOrMobile);
        }
      } catch (e) {}
    };
    checkCameras();
  }, []);

  const toggleMic = async () => {
    if (localParticipant) {
      const nextState = !isMicrophoneEnabled;
      await localParticipant.setMicrophoneEnabled(nextState);
      showToast(nextState ? "🎤 " + t.unmuteMic : "🔇 " + t.muteMic);
    }
  };

  const toggleCamera = async () => {
    if (localParticipant) {
      const nextState = !isCameraEnabled;
      await localParticipant.setCameraEnabled(nextState);
      showToast(nextState ? "📹 " + t.turnOnCam : "🚫 " + t.turnOffCam);
    }
  };

  const showToast = (msg: string) => {
    setShortcutFeedback(msg);
    setTimeout(() => {
      setShortcutFeedback((prev) => (prev === msg ? null : prev));
    }, 1500);
  };

  // Keyboard shortcuts (Laptop/Desktop: 'M' for mic, 'V' for video)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMic();
      } else if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        toggleCamera();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMicrophoneEnabled, isCameraEnabled, localParticipant]);

  // Flip Camera between Front ("user") and Back ("environment") on mobile phones
  const switchCamera = async () => {
    if (!localParticipant || isSwitchingCamera) return;
    setIsSwitchingCamera(true);
    const nextFacing = facingMode === "user" ? "environment" : "user";

    try {
      const videoPub = Array.from(localParticipant.videoTrackPublications.values()).find(
        (pub) => pub.source === Track.Source.Camera
      );

      if (videoPub?.videoTrack) {
        await videoPub.videoTrack.restartTrack({
          facingMode: nextFacing,
        });
        setFacingMode(nextFacing);
        showToast("📷 " + t.switchCameraTooltip);
      } else {
        setFacingMode(nextFacing);
      }
    } catch (err) {
      console.warn("restartTrack with facingMode failed, falling back to device switch:", err);
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        if (videoInputs.length > 1) {
          const currentId = room.getActiveDevice("videoinput");
          const nextDevice = videoInputs.find((d) => d.deviceId !== currentId) || videoInputs[0];
          if (nextDevice) {
            await room.switchActiveDevice("videoinput", nextDevice.deviceId);
            setFacingMode(nextFacing);
            showToast("📷 " + t.switchCameraTooltip);
          }
        }
      } catch (e) {
        console.error("Camera switch fallback failed:", e);
      }
    } finally {
      setIsSwitchingCamera(false);
    }
  };

  const toggleScreenShare = async () => {
    if (!localParticipant) return;

    try {
      if (!isScreenShareEnabled) {
        if (
          typeof navigator === "undefined" ||
          !navigator.mediaDevices ||
          typeof navigator.mediaDevices.getDisplayMedia !== "function"
        ) {
          showToast("⚠️ " + (t.screenShareNotSupported || "Ekran ulashish qo'llab-quvvatlanmaydi"));
          return;
        }

        try {
          // Clean standard display capture without experimental flags that fail on tablets/iPadOS
          await localParticipant.setScreenShareEnabled(true, {
            audio: false,
          });
        } catch (optionsErr: any) {
          console.warn("Screen share with audio:false failed, retrying bare:", optionsErr);
          // Fallback for tablets where any extra options cause rejection
          await localParticipant.setScreenShareEnabled(true);
        }
      } else {
        await localParticipant.setScreenShareEnabled(false);
      }
    } catch (e: any) {
      console.warn("Screen share cancelled or failed:", e);
      if (e?.name === "NotAllowedError") {
        // User cancelled the prompt
      } else if (e?.name === "NotFoundError" || e?.name === "NotSupportedError") {
        showToast("⚠️ " + (t.screenShareNotSupported || "Ekran ulashish qo'llab-quvvatlanmaydi"));
      } else {
        showToast("⚠️ " + (e?.message || "Ekran ulashishda xatolik"));
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
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-[96vw]">
      {/* Keyboard Shortcut Toast Notification */}
      {shortcutFeedback && (
        <div className="glass-panel px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {shortcutFeedback}
        </div>
      )}

      {/* Emoji Picker Popup (Floating above controls) */}
      {showEmojiPicker && (
        <div className="glass-panel px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2 shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-xl sm:text-2xl hover:scale-125 transition-transform p-1 rounded-full active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Main FaceTime Dock */}
      <div className="glass-panel px-2 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1 sm:gap-2.5 shadow-2xl border border-white/15 max-w-[98vw]">
        {/* Participants count pill */}
        <div className="flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 text-[11px] sm:text-xs font-semibold text-zinc-200 select-none">
          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
          <span>{participantCount}</span>
        </div>

        {/* Microphone (Shortcut: M) */}
        <button
          onClick={toggleMic}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition duration-200 ${
            isMicrophoneEnabled
              ? "bg-white/15 hover:bg-white/25 text-white active:scale-95"
              : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
          }`}
          title={`${isMicrophoneEnabled ? t.muteMic : t.unmuteMic} (M)`}
        >
          {isMicrophoneEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Camera (Shortcut: V) */}
        <button
          onClick={toggleCamera}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition duration-200 ${
            isCameraEnabled
              ? "bg-white/15 hover:bg-white/25 text-white active:scale-95"
              : "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
          }`}
          title={`${isCameraEnabled ? t.turnOffCam : t.turnOnCam} (V)`}
        >
          {isCameraEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {/* Camera Flip for Mobile Phones (Front / Back) */}
        {hasMultipleCameras && (
          <button
            onClick={switchCamera}
            disabled={isSwitchingCamera || !isCameraEnabled}
            className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition duration-200 bg-white/15 hover:bg-white/25 text-white active:scale-95 disabled:opacity-40"
            title={t.switchCameraTooltip}
          >
            <SwitchCamera
              className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isSwitchingCamera ? "rotate-180 scale-90" : ""
              }`}
            />
          </button>
        )}

        {/* Screen Share */}
        <button
          onClick={toggleScreenShare}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition duration-200 ${
            isScreenShareEnabled
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600"
              : "bg-white/15 hover:bg-white/25 text-white active:scale-95"
          }`}
          title={isScreenShareEnabled ? t.screenShareToggleOn : t.screenShareToggleOff}
        >
          <ScreenShare className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Reactions (Emojis) */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition duration-200 ${
            showEmojiPicker
              ? "bg-amber-500/80 text-white ring-2 ring-amber-400"
              : "bg-white/15 hover:bg-white/25 text-white active:scale-95"
          }`}
          title={t.reactionsTooltip}
        >
          <Smile className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Copy Invite Link */}
        <button
          onClick={handleCopyLink}
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center bg-white/15 hover:bg-white/25 text-white transition active:scale-95 relative"
          title={t.copyLinkBtn}
        >
          {copied ? <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
          {copied && (
            <span className="absolute -top-8 px-2 py-0.5 rounded-md bg-black/80 text-emerald-400 text-[10px] font-medium whitespace-nowrap border border-emerald-500/30">
              {t.copiedBtn}
            </span>
          )}
        </button>

        {/* End Call / Leave Button (FaceTime Red) */}
        <button
          onClick={onLeave}
          className="w-11 h-9 sm:w-14 sm:h-11 px-3 sm:px-4 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/40 transition active:scale-95"
          title={t.endCallTooltip}
        >
          <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
