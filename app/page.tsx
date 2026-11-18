"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Video,
  Link as LinkIcon,
  Plus,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  MonitorPlay,
  Smile,
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

  // Instantly start a new call
  const handleCreateInstantCall = () => {
    const newRoomId = generateRoomId();
    router.push(`/room/${newRoomId}`);
  };

  // Generate shareable link to send to others before joining
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

  // Join existing room via pasted code or full link
  const handleJoinExisting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    let targetId = inputCode.trim();
    // If user pasted a full link like https://domain.com/room/abc-123
    if (targetId.includes("/room/")) {
      targetId = targetId.split("/room/")[1].split("?")[0].split("#")[0];
    }

    if (targetId) {
      router.push(`/room/${targetId}`);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-[#111116] via-[#09090b] to-[#030304] text-white flex flex-col justify-between overflow-y-auto">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-emerald-500/15 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <nav className="relative z-20 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
            <Video className="w-5 h-5 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">{t.appTitle}</span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-8 flex-1 flex flex-col items-center justify-center text-center">
        {/* Apple Style Pill Badge */}
        <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full text-xs font-medium text-emerald-400 mb-6 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.heroBadge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15] mb-4">
          {t.heroTitle} <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">{t.heroHighlight}</span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mb-10">
          {t.heroSubtitle}
        </p>

        {/* Action Cards */}
        <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {/* Card 1: New Call */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Video className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">{t.startCallCardTitle}</h2>
              <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                {t.startCallCardDesc}
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCreateInstantCall}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t.startCallBtn}</span>
              </button>

              <button
                onClick={handleGenerateLink}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>{t.generateLinkBtn}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Join via Link/Code */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">{t.joinCardTitle}</h2>
              <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
                {t.joinCardDesc}
              </p>
            </div>

            <form onSubmit={handleJoinExisting} className="space-y-2">
              <input
                type="text"
                placeholder={t.roomInputPlaceholder}
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-zinc-800/80 border border-white/10 text-white placeholder-zinc-500 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
              />

              <button
                type="submit"
                disabled={!inputCode.trim()}
                className="w-full py-3 px-4 rounded-2xl bg-white/15 hover:bg-white/25 disabled:opacity-40 text-white font-semibold text-sm flex items-center justify-center gap-2 transition active:scale-98"
              >
                <span>{t.joinCallBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Modal/Banner when link is generated */}
        {createdRoomId && (
          <div className="w-full max-w-2xl mt-6 p-4 rounded-3xl glass-panel border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="text-left">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-0.5">
                {t.linkReadyLabel}
              </p>
              <p className="text-xs text-zinc-300 font-mono truncate max-w-xs sm:max-w-md">
                {typeof window !== "undefined" ? `${window.location.origin}/room/${createdRoomId}` : createdRoomId}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copiedBtn : t.copyLinkBtn}</span>
              </button>

              <button
                onClick={() => router.push(`/room/${createdRoomId}`)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <span>{t.enterNowBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Feature Highlights Grid */}
        <div className="mt-14 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5 text-left">
          <div className="p-3">
            <div className="text-emerald-400 mb-1.5">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-white">{t.feature1Title}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">{t.feature1Desc}</p>
          </div>

          <div className="p-3">
            <div className="text-blue-400 mb-1.5">
              <MonitorPlay className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-white">{t.feature2Title}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">{t.feature2Desc}</p>
          </div>

          <div className="p-3">
            <div className="text-amber-400 mb-1.5">
              <Smile className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-white">{t.feature3Title}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">{t.feature3Desc}</p>
          </div>

          <div className="p-3">
            <div className="text-purple-400 mb-1.5">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-white">{t.feature4Title}</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">{t.feature4Desc}</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 text-center text-xs text-zinc-500 border-t border-white/5">
        {t.footerText}
      </footer>
    </main>
  );
}
