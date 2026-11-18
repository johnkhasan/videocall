"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Link as LinkIcon,
  Shield,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { generateRoomId } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [inputCode, setInputCode] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Instantly start a new call with 4-digit code
  const handleCreateInstantCall = () => {
    const newRoomId = generateRoomId();
    router.push(`/room/${newRoomId}`);
  };

  // Generate shareable 4-digit link to send to others before joining
  const handleGenerateLink = () => {
    const newRoomId = generateRoomId();
    setCreatedRoomId(newRoomId);
  };

  const handleCopyLink = () => {
    if (!createdRoomId) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${origin}/room/${createdRoomId}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Join existing room via 4-digit code or pasted full link
  const handleJoinExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    let targetId = inputCode.trim();
    // If user pasted a full link like https://video.javohir.ru/room/1234
    if (targetId.includes("/room/")) {
      targetId = targetId.split("/room/")[1].split("?")[0].split("#")[0];
    }

    if (targetId) {
      router.push(`/room/${targetId}`);
    }
  };

  return (
    <main className="relative h-[100dvh] w-full bg-gradient-to-b from-[#111116] via-[#09090b] to-[#030304] text-white flex flex-col justify-between overflow-hidden px-4 sm:px-6 py-3 sm:py-5 select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
            <Video className="w-5 h-5 fill-current" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">{t.appTitle}</span>
        </div>

        <LanguageSwitcher />
      </nav>

      {/* Center Main Action Container - Strictly fits in screen */}
      <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center justify-center my-auto py-2">
        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-center mb-2">
          {t.heroTitle}{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
            {t.heroHighlight}
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 text-center max-w-sm mb-5 sm:mb-6 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Apple Style Sleek Action Card */}
        <div className="w-full glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          {/* 1. Create Call Primary Button */}
          <button
            type="button"
            onClick={handleCreateInstantCall}
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition active:scale-98"
          >
            <Video className="w-5 h-5 fill-current" />
            <span>{t.startCallBtn}</span>
          </button>

          {/* Divider with 'or' */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative px-3 bg-[#111116] text-[11px] font-semibold text-zinc-400 uppercase tracking-wider rounded-full border border-white/5">
              {t.orDivider}
            </span>
          </div>

          {/* 2. Join Call Form with 4-digit code */}
          <form onSubmit={handleJoinExisting} className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={20}
              placeholder={t.roomInputPlaceholder}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="flex-1 min-w-0 px-4 py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-white placeholder-zinc-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/50 transition"
            />
            <button
              type="submit"
              disabled={!inputCode.trim()}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 disabled:opacity-30 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition active:scale-98 shrink-0"
            >
              <span>{t.joinCallBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Create shareable link without instant redirect */}
          <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-center">
            <button
              type="button"
              onClick={handleGenerateLink}
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition py-1"
            >
              <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.generateLinkBtn}</span>
            </button>
          </div>

          {/* Generated Link Card */}
          {createdRoomId && (
            <div className="mt-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2 text-xs animate-in fade-in duration-200">
              <div className="truncate">
                <span className="text-zinc-400">Xona: </span>
                <span className="font-mono font-bold text-emerald-400 text-sm tracking-widest">
                  {createdRoomId}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] flex items-center gap-1 transition active:scale-95"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? t.copiedBtn : t.copyLinkBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/room/${createdRoomId}`)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[11px] transition active:scale-95"
                >
                  {t.enterNowBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 py-1 shrink-0">
        <Shield className="w-3 h-3 text-emerald-400/70" />
        <span>{t.footerText}</span>
      </footer>
    </main>
  );
}
