"use client";

import React from "react";
import {
  TrackReferenceOrPlaceholder,
  VideoTrack,
  useIsSpeaking,
  isTrackReference,
} from "@livekit/components-react";
import { MicOff, Pin, Volume2 } from "lucide-react";

interface ParticipantTileProps {
  trackRef: TrackReferenceOrPlaceholder;
  isLocal?: boolean;
  is1on1PiP?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function ParticipantTile({
  trackRef,
  isLocal = false,
  is1on1PiP = false,
  className = "",
  onClick,
}: ParticipantTileProps) {
  const participant = trackRef.participant;
  const isSpeaking = useIsSpeaking(participant);

  // Check if participant has camera enabled
  const hasVideo = isTrackReference(trackRef) && trackRef.publication && !trackRef.publication.isMuted;
  const isMuted = !participant.isMicrophoneEnabled;
  const displayName = participant.name || participant.identity || (isLocal ? "Siz" : "Ishtirokchi");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden transition-all duration-300 group select-none bg-zinc-900 ${
        isSpeaking
          ? "ring-2 ring-emerald-400 shadow-activeSpeaker scale-[1.01]"
          : "border border-white/10 hover:border-white/20"
      } ${
        is1on1PiP
          ? "w-40 sm:w-56 aspect-[3/4] shadow-2xl rounded-2xl border-2 border-white/20"
          : "w-full h-full"
      } ${className}`}
    >
      {/* Video stream or Avatar fallback */}
      {isTrackReference(trackRef) && trackRef.publication && !trackRef.publication.isMuted ? (
        <div className={`w-full h-full ${isLocal ? "video-mirrored" : ""}`}>
          <VideoTrack
            trackRef={trackRef}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950 p-4">
          <div className="relative">
            <div
              className={`rounded-full flex items-center justify-center font-bold text-white shadow-xl transition-transform duration-300 ${
                is1on1PiP
                  ? "w-14 h-14 text-xl bg-zinc-800"
                  : "w-20 h-20 sm:w-28 sm:h-28 text-3xl sm:text-4xl bg-gradient-to-tr from-zinc-800 to-zinc-700"
              } ${isSpeaking ? "ring-4 ring-emerald-400/50 scale-105" : "border border-white/10"}`}
            >
              {initial}
            </div>

            {/* Speaking audio ripple */}
            {isSpeaking && (
              <span className="absolute -inset-1 rounded-full border-2 border-emerald-400 animate-ping opacity-60 pointer-events-none" />
            )}
          </div>

          {!is1on1PiP && (
            <p className="mt-3 text-sm font-medium text-zinc-300 truncate max-w-[150px]">
              {displayName}
            </p>
          )}
        </div>
      )}

      {/* Participant Info Overlay (Glass badge) */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1 rounded-full text-xs font-medium text-white/90 shadow-md max-w-[85%] truncate">
          {isSpeaking && <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 animate-pulse" />}
          <span className="truncate">{displayName} {isLocal && "(Siz)"}</span>
        </div>

        {isMuted && (
          <div className="w-6 h-6 rounded-full bg-red-500/80 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow">
            <MicOff className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Local participant indicator */}
      {isLocal && is1on1PiP && (
        <div className="absolute top-2 left-2 glass-pill px-2 py-0.5 rounded-md text-[10px] text-zinc-300 font-semibold tracking-wide uppercase">
          Siz
        </div>
      )}
    </div>
  );
}
