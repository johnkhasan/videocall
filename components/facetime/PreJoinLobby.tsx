"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Copy, Check, Users, Shield, ArrowRight, SwitchCamera } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface PreJoinLobbyProps {
  roomId: string;
  onJoin: (username: string, initialAudio: boolean, initialVideo: boolean, initialFacingMode?: "user" | "environment") => void;
}

export default function PreJoinLobby({ roomId, onJoin }: PreJoinLobbyProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start local camera preview with facingMode
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initPreview() {
      try {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);

        // Detect if device has multiple cameras (e.g. mobile front/back)
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        const isTouchOrMobile =
          /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
          ("ontouchstart" in window || navigator.maxTouchPoints > 0);
        setHasMultipleCameras(videoInputs.length > 1 || isTouchOrMobile);
      } catch (err) {
        console.warn("Camera/Mic access issue:", err);
        setHasPermission(false);
      }
    }

    initPreview();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Keyboard shortcuts (M for Mic, V for Video on laptop when input is not focused)
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
        setAudioEnabled((prev) => !prev);
      } else if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        setVideoEnabled((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update track state when toggles change
  useEffect(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = videoEnabled;
      });
      mediaStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = audioEnabled;
      });
    }
  }, [audioEnabled, videoEnabled]);

  const handleCopyLink = () => {
    const fullUrl = window.location.href;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    // Clean up local preview stream before LiveKit takes over
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
    }

    onJoin(username.trim(), audioEnabled, videoEnabled, facingMode);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between items-center px-4 py-3 sm:py-6 bg-gradient-to-b from-[#141418] via-[#09090b] to-[#040405] text-white overflow-y-auto overflow-x-hidden">
      {/* Top Navbar Header */}
      <header className="w-full max-w-4xl flex items-center justify-between pb-3 pt-1 shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-bold text-xs shadow-md shadow-emerald-500/20">
            FT
          </div>
          <span className="font-semibold text-base tracking-tight text-white">FaceTime</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-80 sm:w-96 h-80 sm:h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 sm:w-96 h-80 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Card Container */}
      <div className="w-full max-w-4xl my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center z-10">
        {/* Left / Top: Camera Preview Card */}
        <div className="lg:col-span-7 flex flex-col items-center w-full">
          <div className="relative w-full max-w-md lg:max-w-none aspect-[4/3] sm:aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl bg-zinc-900/90 group">
            {videoEnabled && hasPermission !== false ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === "user" ? "video-mirrored" : ""}`}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/90 text-zinc-400">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-semibold mb-3 border border-white/5 shadow-inner">
                  {username.trim() ? username.charAt(0).toUpperCase() : <VideoOff className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500" />}
                </div>
                <p className="text-xs sm:text-sm font-medium text-zinc-400">{t.cameraOff}</p>
              </div>
            )}

            {/* In-preview Floating Controls */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2.5 sm:gap-3 glass-pill px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                  audioEnabled
                    ? "bg-white/15 hover:bg-white/25 text-white active:scale-95"
                    : "bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                }`}
                title={`${audioEnabled ? t.muteMic : t.unmuteMic} (M)`}
              >
                {audioEnabled ? <Mic className="w-4 h-4 sm:w-5 sm:h-5" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all ${
                  videoEnabled
                    ? "bg-white/15 hover:bg-white/25 text-white active:scale-95"
                    : "bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                }`}
                title={`${videoEnabled ? t.turnOffCam : t.turnOnCam} (V)`}
              >
                {videoEnabled ? <Video className="w-4 h-4 sm:w-5 sm:h-5" /> : <VideoOff className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>

              {/* Mobile Camera Flip (Front/Back) */}
              {hasMultipleCameras && (
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all bg-white/15 hover:bg-white/25 text-white active:scale-95 shadow-md"
                  title={t.switchCameraTooltip}
                >
                  <SwitchCamera className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>

            {/* Room badge */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5 sm:gap-2 glass-pill px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.room}: {roomId}</span>
            </div>
          </div>
        </div>

        {/* Right / Bottom: Join Info & Name Form */}
        <div className="lg:col-span-5 flex flex-col justify-center w-full">
          <div className="w-full max-w-md mx-auto lg:max-w-none glass-panel p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{t.lobbyTitle}</h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mb-4 sm:mb-5">
              {t.lobbySubtitle}
            </p>

            {/* Shareable Link Box */}
            <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-2 overflow-hidden">
              <div className="truncate text-xs text-zinc-400 select-all font-mono min-w-0 flex-1">
                {typeof window !== "undefined" ? window.location.href : roomId}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 active:scale-95 text-white transition shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{t.copiedBtn}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{t.copiedToast}</span>
                  </>
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
              <div>
                <label htmlFor="name-input" className="block text-xs font-medium text-zinc-300 mb-1.5">
                  {t.nameInputLabel}
                </label>
                <input
                  id="name-input"
                  type="text"
                  required
                  placeholder={t.nameInputPlaceholder}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-white placeholder-zinc-500 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!username.trim()}
                className="w-full py-3.5 px-6 rounded-2xl font-semibold text-base sm:text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition duration-200 active:scale-98"
              >
                <span>{t.joinRoomBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 sm:mt-5 pt-3.5 sm:pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-zinc-500">
              <Shield className="w-3.5 h-3.5 text-emerald-400/80" />
              <span>{t.secureConnection}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
