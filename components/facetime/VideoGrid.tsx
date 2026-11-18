"use client";

import React, { useMemo } from "react";
import { Track } from "livekit-client";
import {
  useTracks,
  useLocalParticipant,
  VideoTrack,
  isTrackReference,
} from "@livekit/components-react";
import ParticipantTile from "./ParticipantTile";
import { Copy, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface VideoGridProps {
  roomId: string;
}

export default function VideoGrid({ roomId }: VideoGridProps) {
  const { t } = useLanguage();
  const { localParticipant } = useLocalParticipant();

  // Get camera tracks (with placeholder so tiles render even when camera is off)
  const cameraTracks = useTracks(
    [{ source: Track.Source.Camera, withPlaceholder: true }],
    { onlySubscribed: false }
  );

  // Get active screen shares
  const screenTracks = useTracks(
    [{ source: Track.Source.ScreenShare, withPlaceholder: false }],
    { onlySubscribed: false }
  );

  const screenShareTrack = screenTracks.length > 0 ? screenTracks[0] : null;

  // Separate local and remote camera tracks
  const localTrack = useMemo(
    () => cameraTracks.find((t) => t.participant.isLocal),
    [cameraTracks]
  );

  const remoteTracks = useMemo(
    () => cameraTracks.filter((t) => !t.participant.isLocal),
    [cameraTracks]
  );

  // Handle link copying
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // CASE 1: Active Screen Share View
  if (screenShareTrack && isTrackReference(screenShareTrack)) {
    return (
      <div className="relative w-full h-full flex flex-col p-4 pb-24 gap-3">
        {/* Main Screen Share Area */}
        <div className="flex-1 w-full relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-black flex items-center justify-center">
          <VideoTrack
            trackRef={screenShareTrack}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-4 left-4 glass-pill px-3 py-1 rounded-full text-xs text-white/90">
            {screenShareTrack.participant.name || screenShareTrack.participant.identity} {t.screenSharingText}
          </div>
        </div>

        {/* Horizontal strip of participants */}
        <div className="h-28 w-full flex items-center gap-3 overflow-x-auto pb-1">
          {cameraTracks.map((track) => (
            <div key={`${track.participant.identity}-${track.source}`} className="h-full aspect-video shrink-0">
              <ParticipantTile
                trackRef={track}
                isLocal={track.participant.isLocal}
                isCompact={true}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // CASE 2: 1-on-1 FaceTime Mode (1 Remote participant + 1 Local user)
  if (remoteTracks.length === 1 && localTrack) {
    const remoteTrack = remoteTracks[0];

    return (
      <div className="relative w-full h-full p-2 sm:p-4 pb-24 flex items-center justify-center overflow-hidden">
        {/* Full-bleed Remote Participant (FaceTime style) */}
        <div className="w-full h-full max-w-7xl max-h-[92vh] rounded-3xl overflow-hidden">
          <ParticipantTile
            trackRef={remoteTrack}
            isLocal={false}
            className="rounded-3xl"
          />
        </div>

        {/* Floating Local PiP (Picture-in-Picture in top-right or bottom-right) */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 transition-transform duration-300 hover:scale-105">
          <ParticipantTile
            trackRef={localTrack}
            isLocal={true}
            is1on1PiP={true}
          />
        </div>
      </div>
    );
  }

  // CASE 3: Waiting for someone to join (Only local user in room)
  if (remoteTracks.length === 0 && localTrack) {
    return (
      <div className="relative w-full h-full p-4 pb-24 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl aspect-video rounded-3xl overflow-hidden mb-6 relative">
          <ParticipantTile
            trackRef={localTrack}
            isLocal={true}
            className="rounded-3xl shadow-2xl"
          />
        </div>

        {/* Waiting card */}
        <div className="glass-panel px-6 py-4 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left shadow-2xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t.waitingTitle}</h3>
            <p className="text-xs text-zinc-400">
              {t.waitingDesc}
            </p>
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black transition shrink-0 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{t.copyLinkBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  // CASE 4: Group FaceTime Mode (3+ participants)
  const totalCount = cameraTracks.length;
  let gridCols = "grid-cols-1 sm:grid-cols-2";
  if (totalCount >= 5) {
    gridCols = "grid-cols-2 lg:grid-cols-3";
  } else if (totalCount >= 9) {
    gridCols = "grid-cols-3 lg:grid-cols-4";
  }

  return (
    <div className="w-full h-full p-3 sm:p-6 pb-24 overflow-y-auto flex items-center justify-center">
      <div
        className={`w-full max-w-7xl h-full max-h-[88vh] grid ${gridCols} gap-3 sm:gap-4 auto-rows-fr`}
      >
        {cameraTracks.map((track) => (
          <div
            key={`${track.participant.identity}-${track.source}`}
            className="w-full h-full min-h-[200px]"
          >
            <ParticipantTile
              trackRef={track}
              isLocal={track.participant.isLocal}
              isCompact={totalCount >= 6}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
