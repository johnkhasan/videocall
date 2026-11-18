"use client";

import React, { useState } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: "uz", label: "Oʻzbekcha", flag: "🇺🇿" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "ru", label: "Русский", flag: "🇷🇺" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition active:scale-95"
        title="Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="uppercase font-semibold tracking-wider">{language}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-36 glass-panel rounded-2xl p-1.5 shadow-2xl border border-white/10 z-40 animate-in fade-in zoom-in-95 duration-150">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  language === item.code
                    ? "bg-emerald-500/20 text-emerald-400 font-semibold"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                <span>{item.flag}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
