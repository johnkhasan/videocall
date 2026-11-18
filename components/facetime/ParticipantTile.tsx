"use client";

import React from "react";
import {
  TrackReferenceOrPlaceholder,
  VideoTrack,
  useIsSpeaking,
  isTrackReference,
} from "@livekit/components-react";
import { MicOff, Volume2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ParticipantTileProps {
  trackRef: TrackReferenceOrPlaceholder;
  isLocal?: boolean;
  is1on1PiP?: boolean;
  isCompact?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ParticipantTile({
  trackRef,
  isLocal = false,
  is1on1PiP = false,
  isCompact = false,
  className = "",
  onClick,
}: ParticipantTileProps) {
  const { t } = useLanguage();
  const participant = trackRef.participant;
  const isSpeaking = useIsSpeaking(participant);

  // Check if participant has camera enabled
  const hasVideo =
    isTrackReference(trackRef) &&
    trackRef.publication &&
    !trackRef.publication.isMuted;
  const isMuted = !participant.isMicrophoneEnabled;
  const displayName =
    participant.name || participant.identity || (isLocal ? t.you : t.participant);
  const initial = displayName.charAt(0).toUpperCase();

  // Size calculations for avatar
  let avatarSize = "w-20 h-20 sm:w-28 sm:h-28 text-3xl sm:text-4xl";
  if (isCompact) {
    avatarSize = "w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base";
  } else if (is1on1PiP) {
    avatarSize = "w-12 h-12 sm:w-14 sm:h-14 text-base sm:text-lg";
  }

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden transition-all duration-300 group select-none bg-zinc-900 ${
        isCompact ? "rounded-2xl" : is1on1PiP ? "rounded-2xl" : "rounded-3xl"
      } ${
        isSpeaking
          ? "ring-2 ring-emerald-400 shadow-activeSpeaker scale-[1.01]"
          : "border border-white/10 hover:border-white/20"
      } ${
        is1on1PiP
          ? "w-28 sm:w-44 md:w-56 aspect-[3/4] shadow-2xl border-2 border-white/20"
          : "w-full h-full"
      } ${className}`}
    >
      {/* Video stream or Avatar fallback */}
      {hasVideo && isTrackReference(trackRef) ? (
        <div className={`w-full h-full ${isLocal ? "video-mirrored" : ""}`}>
          <VideoTrack
            trackRef={trackRef}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-2 overflow-hidden">
          <div className="relative flex items-center justify-center shrink-0">
            <div
              className={`rounded-full flex items-center justify-center font-bold text-white shadow-xl transition-all duration-300 shrink-0 select-none ${avatarSize} ${
                is1on1PiP || isCompact
                  ? "bg-zinc-800"
                  : "bg-gradient-to-tr from-zinc-800 to-zinc-700"
              } ${
                isSpeaking
                  ? "ring-4 ring-emerald-400/50 scale-105"
                  : "border border-white/10"
              }`}
            >
              <span className="leading-none">{initial}</span>
            </div>

            {/* Speaking audio ripple */}
            {isSpeaking && (
              <span className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none" />
            )}
          </div>
        </div>
      )}

      {/* Participant Info Overlay (Glass badge) */}
      <div
        className={`absolute flex items-center justify-between pointer-events-none ${
          isCompact ? "bottom-1.5 left-1.5 right-1.5" : "bottom-3 left-3 right-3"
        }`}
      >
        <div
          className={`flex items-center gap-1.5 glass-pill rounded-full font-medium text-white/90 shadow-md max-w-[85%] truncate ${
            isCompact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
          }`}
        >
          {isSpeaking && (
            <Volume2 className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
          )}
          <span className="truncate">
            {displayName} {isLocal && `(${t.you})`}
          </span>
        </div>

        {isMuted && (
          <div
            className={`rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow ${
              isCompact ? "w-5 h-5" : "w-6 h-6"
            }`}
          >
            <MicOff className={isCompact ? "w-2.5 h-2.5" : "w-3 h-3"} />
          </div>
        )}
      </div>

      {/* Local participant indicator for PiP */}
      {isLocal && is1on1PiP && (
        <div className="absolute top-2 left-2 glass-pill px-2 py-0.5 rounded-md text-[10px] text-zinc-300 font-semibold tracking-wide uppercase">
          {t.you}
        </div>
      )}
    </div>
  );
}
