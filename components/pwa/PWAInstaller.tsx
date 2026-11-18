"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PWAInstaller() {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone;

    if (isStandalone) return;

    // Check if dismissed before
    const isDismissed = localStorage.getItem("facetime_pwa_dismissed");
    if (isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isAppleDevice);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered successfully"))
        .catch((err) => console.log("Service Worker registration failed:", err));
    }

    // Capture Chrome/Android install event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // On iOS, show prompt after a short delay
    if (isAppleDevice && !isStandalone) {
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("facetime_pwa_dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm glass-panel p-4 rounded-3xl border border-emerald-500/30 shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{t.installApp}</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
              {isIOS ? (
                <span className="flex items-center gap-1">
                  <span>iOS:</span>
                  <Share className="w-3 h-3 inline text-blue-400" />
                  <span>Ulashish &rarr; Asosiy ekranga qoʻshish</span>
                </span>
              ) : (
                t.installAppDesc
              )}
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-zinc-500 hover:text-white p-1 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {!isIOS && deferredPrompt && (
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold shadow-md shadow-emerald-500/20 transition active:scale-95 text-center"
          >
            {t.installBtn}
          </button>
          <button
            onClick={handleDismiss}
            className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-medium transition"
          >
            {t.dismissBtn}
          </button>
        </div>
      )}
    </div>
  );
}
