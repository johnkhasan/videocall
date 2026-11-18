"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Copy, Check, Users, Shield, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface PreJoinLobbyProps {
  roomId: string;
  onJoin: (username: string, initialAudio: boolean, initialVideo: boolean) => void;
}

export default function PreJoinLobby({ roomId, onJoin }: PreJoinLobbyProps) {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start local camera preview
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initPreview() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
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

    onJoin(username.trim(), audioEnabled, videoEnabled);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-[#141418] via-[#09090b] to-[#040405] text-white">
      {/* Language Switcher in top right */}
      <div className="absolute top-6 right-6 z-20">
        <LanguageSwitcher />
      </div>

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left: Camera Preview Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-video sm:aspect-[4/3] max-w-lg rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl bg-zinc-900/90 group">
            {videoEnabled && hasPermission !== false ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover video-mirrored"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/90 text-zinc-400">
                <div className="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-semibold mb-3 border border-white/5 shadow-inner">
                  {username.trim() ? username.charAt(0).toUpperCase() : <VideoOff className="w-10 h-10 text-zinc-500" />}
                </div>
                <p className="text-sm font-medium text-zinc-400">{t.cameraOff}</p>
              </div>
            )}

            {/* In-preview Floating Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 glass-pill px-4 py-2 rounded-full shadow-lg">
              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  audioEnabled
                    ? "bg-white/15 hover:bg-white/25 text-white"
                    : "bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                }`}
                title={audioEnabled ? t.muteMic : t.unmuteMic}
              >
                {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setVideoEnabled(!videoEnabled)}
                className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                  videoEnabled
                    ? "bg-white/15 hover:bg-white/25 text-white"
                    : "bg-red-500/90 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                }`}
                title={videoEnabled ? t.turnOffCam : t.turnOnCam}
              >
                {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>
            </div>

            {/* Room badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 glass-pill px-3 py-1.5 rounded-full text-xs font-medium text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t.room}: {roomId}</span>
            </div>
          </div>
        </div>

        {/* Right: Join Info & Name Form */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Users className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{t.lobbyTitle}</h1>
            </div>
            <p className="text-sm text-zinc-400 mb-6">
              {t.lobbySubtitle}
            </p>

            {/* Shareable Link Box */}
            <div className="mb-6 p-3 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-center justify-between gap-2">
              <div className="truncate text-xs text-zinc-400 select-all">
                {typeof window !== "undefined" ? window.location.href : roomId}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition shrink-0"
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

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!username.trim()}
                className="w-full py-3.5 px-6 rounded-2xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:hover:bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition duration-200"
              >
                <span>{t.joinRoomBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Shield className="w-3.5 h-3.5 text-emerald-400/80" />
              <span>{t.secureConnection}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
