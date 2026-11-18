"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { Track } from "livekit-client";
import {
  useTracks,
  useLocalParticipant,
  VideoTrack,
  isTrackReference,
} from "@livekit/components-react";
import ParticipantTile from "./ParticipantTile";
import {
  Copy,
  Users,
  Pause,
  MonitorPlay,
  ArrowLeftRight,
  Columns2,
  Maximize2,
  Move,
  LayoutGrid,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

interface VideoGridProps {
  roomId: string;
}

export default function VideoGrid({ roomId }: VideoGridProps) {
  const { t } = useLanguage();
  const { localParticipant } = useLocalParticipant();

  // 1-on-1 state: swap who is main vs PiP, and split view vs PiP view
  const [is1on1Swapped, setIs1on1Swapped] = useState(false);
  const [oneOnOneLayout, setOneOnOneLayout] = useState<"pip" | "split">("pip");
  const [spotlightParticipantId, setSpotlightParticipantId] = useState<string | null>(null);
  const pipContainerRef = useRef<HTMLDivElement>(null);

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
    const participantName =
      screenShareTrack.participant.name ||
      screenShareTrack.participant.identity ||
      t.participant;

    return (
      <div className="relative w-full h-full flex flex-col p-2 sm:p-4 pb-20 sm:pb-24 gap-2 sm:gap-3">
        {/* Main Screen Share Area with pause detection */}
        <ScreenShareStage
          trackRef={screenShareTrack}
          participantName={participantName}
        />

        {/* Horizontal strip of participants */}
        <div className="h-20 sm:h-28 w-full flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 shrink-0">
          {cameraTracks.map((track) => (
            <div
              key={`${track.participant.identity}-${track.source}`}
              className="h-full aspect-video shrink-0"
            >
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
    const primaryTrack = is1on1Swapped ? localTrack : remoteTrack;
    const pipTrack = is1on1Swapped ? remoteTrack : localTrack;
    const primaryIsLocal = is1on1Swapped;
    const pipIsLocal = !is1on1Swapped;

    // Sub-case: Split View (50/50 side by side)
    if (oneOnOneLayout === "split") {
      return (
        <div className="relative w-full h-full p-2 sm:p-6 pb-20 sm:pb-24 flex flex-col items-center justify-center">
          {/* Top layout toggle button */}
          <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30">
            <button
              type="button"
              onClick={() => setOneOnOneLayout("pip")}
              className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-white/90 hover:text-white transition active:scale-95 shadow-lg border border-white/10"
              title={t.pipView}
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.pipView}</span>
            </button>
          </div>

          {/* Equal 50/50 Split View */}
          <div className="w-full max-w-7xl h-full max-h-[85vh] grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 auto-rows-fr">
            <div
              className="w-full h-full min-h-[160px] cursor-pointer"
              onClick={() => {
                setIs1on1Swapped(false);
                setOneOnOneLayout("pip");
              }}
              title="Kattalashtirish (Maximize)"
            >
              <ParticipantTile
                trackRef={remoteTrack}
                isLocal={false}
              />
            </div>
            <div
              className="w-full h-full min-h-[160px] cursor-pointer"
              onClick={() => {
                setIs1on1Swapped(true);
                setOneOnOneLayout("pip");
              }}
              title="Kattalashtirish (Maximize)"
            >
              <ParticipantTile
                trackRef={localTrack}
                isLocal={true}
              />
            </div>
          </div>
        </div>
      );
    }

    // Default PiP Mode (Full-screen + Draggable PiP + Swap)
    return (
      <div
        ref={pipContainerRef}
        className="relative w-full h-full p-1.5 sm:p-4 pb-20 sm:pb-24 flex items-center justify-center overflow-hidden"
      >
        {/* Top layout mode toggle button */}
        <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-20">
          <button
            type="button"
            onClick={() => setOneOnOneLayout("split")}
            className="glass-pill px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white transition active:scale-95 shadow-lg border border-white/10"
            title={t.splitView}
          >
            <Columns2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{t.splitView}</span>
          </button>
        </div>

        {/* Full-bleed Primary Participant (FaceTime style) */}
        <div className="w-full h-full max-w-7xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl relative">
          <ParticipantTile
            trackRef={primaryTrack}
            isLocal={primaryIsLocal}
            className="rounded-3xl"
          />
        </div>

        {/* Draggable PiP Window (Framer Motion) */}
        <motion.div
          drag
          dragConstraints={pipContainerRef}
          dragElastic={0.08}
          dragMomentum={false}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="absolute top-3 right-3 sm:top-8 sm:right-8 z-30 cursor-grab active:cursor-grabbing touch-none select-none group/pip"
          style={{ willChange: "transform" }}
        >
          <div className="relative">
            <ParticipantTile
              trackRef={pipTrack}
              isLocal={pipIsLocal}
              is1on1PiP={true}
              onClick={() => setIs1on1Swapped((prev) => !prev)}
            />

            {/* Quick Swap Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIs1on1Swapped((prev) => !prev);
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full glass-pill flex items-center justify-center text-white/90 hover:text-white hover:bg-emerald-500/80 transition shadow-lg border border-white/20 active:scale-90"
              title={t.swapVideosTooltip}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>

            {/* Drag Handle Icon on hover */}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover/pip:opacity-75 transition pointer-events-none p-1">
              <Move className="w-3 h-3 text-white/70" />
            </div>
          </div>
        </motion.div>
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
            <p className="text-xs text-zinc-400">{t.waitingDesc}</p>
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

  // Sub-case: Spotlight / Focus View (When a user clicked on a participant to enlarge them)
  const spotlightTrack = spotlightParticipantId
    ? cameraTracks.find((t) => t.participant.identity === spotlightParticipantId)
    : null;

  if (spotlightTrack) {
    const otherTracks = cameraTracks.filter(
      (t) => t.participant.identity !== spotlightParticipantId
    );

    return (
      <div className="relative w-full h-full p-2 sm:p-4 pb-20 sm:pb-24 flex flex-col md:flex-row gap-2.5 sm:gap-4 items-center justify-center overflow-hidden">
        {/* Top return-to-grid button */}
        <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 z-30">
          <button
            type="button"
            onClick={() => setSpotlightParticipantId(null)}
            className="glass-pill px-3.5 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-medium text-white/90 hover:text-white transition active:scale-95 shadow-lg border border-white/10"
            title={t.gridMode}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.gridMode}</span>
          </button>
        </div>

        {/* Main Big Stage (Spotlight Participant) */}
        <div className="flex-1 w-full h-full max-h-[88vh] rounded-3xl overflow-hidden shadow-2xl relative min-h-0">
          <ParticipantTile
            trackRef={spotlightTrack}
            isLocal={spotlightTrack.participant.isLocal}
            className="rounded-3xl cursor-pointer"
            onClick={() => setSpotlightParticipantId(null)}
          />
        </div>

        {/* Side / Bottom Strip of Other Participants */}
        <div className="w-full md:w-64 lg:w-72 h-24 md:h-full max-h-[88vh] flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-1">
          {otherTracks.map((track) => (
            <div
              key={`${track.participant.identity}-${track.source}`}
              onClick={() => setSpotlightParticipantId(track.participant.identity)}
              className="h-full aspect-video md:h-36 md:w-full md:aspect-auto shrink-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
              title="Kattalashtirish (Focus)"
            >
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

  // Sub-case: Equal Grid View
  let gridCols = "grid-cols-1 sm:grid-cols-2";
  if (totalCount >= 5) {
    gridCols = "grid-cols-2 lg:grid-cols-3";
  } else if (totalCount >= 9) {
    gridCols = "grid-cols-3 lg:grid-cols-4";
  }

  return (
    <div className="w-full h-full p-2.5 sm:p-6 pb-20 sm:pb-24 overflow-y-auto flex items-center justify-center">
      <div
        className={`w-full max-w-7xl h-full max-h-[88vh] grid ${gridCols} gap-2.5 sm:gap-4 auto-rows-fr`}
      >
        {cameraTracks.map((track) => (
          <div
            key={`${track.participant.identity}-${track.source}`}
            onClick={() => setSpotlightParticipantId(track.participant.identity)}
            className="w-full h-full min-h-[160px] sm:min-h-[200px] cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]"
            title="Kattalashtirish uchun bosing"
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

/**
 * ScreenShareStage:
 * Handles screen sharing stream rendering, track mute events (e.g. mobile app switching),
 * and automatic unpausing upon returning to the browser.
 */
function ScreenShareStage({
  trackRef,
  participantName,
}: {
  trackRef: any;
  participantName: string;
}) {
  const { t } = useLanguage();
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return Boolean(
      trackRef.publication?.isMuted || trackRef.publication?.track?.isMuted
    );
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pub = trackRef.publication;
    if (!pub) return;

    const onMuted = () => setIsMuted(true);
    const onUnmuted = () => setIsMuted(false);

    pub.on("muted", onMuted);
    pub.on("unmuted", onUnmuted);
    if (pub.track) {
      pub.track.on("muted", onMuted);
      pub.track.on("unmuted", onUnmuted);
    }

    setIsMuted(Boolean(pub.isMuted || pub.track?.isMuted));

    return () => {
      pub.off("muted", onMuted);
      pub.off("unmuted", onUnmuted);
      if (pub.track) {
        pub.track.off("muted", onMuted);
        pub.track.off("unmuted", onUnmuted);
      }
    };
  }, [trackRef]);

  // When returning from background/tab, unpause video element
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (containerRef.current) {
          const videos = containerRef.current.querySelectorAll("video");
          videos.forEach((video) => {
            if (video.paused) {
              video.play().catch(() => {});
            }
          });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full relative rounded-3xl overflow-hidden glass-panel border border-white/10 bg-black flex items-center justify-center shadow-2xl"
    >
      <VideoTrack
        trackRef={trackRef}
        className="w-full h-full object-contain"
      />

      {/* Paused Overlay (App switched / Tab minimized on phone) */}
      {isMuted && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200 z-20">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 shadow-xl shadow-amber-500/10">
            <Pause className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {t.screenSharePaused}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed">
            {t.screenSharePausedDesc}
          </p>
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-zinc-300 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-medium">{participantName}</span>
          </div>
        </div>
      )}

      {/* Participant info badge */}
      <div className="absolute top-4 left-4 glass-pill px-3.5 py-1.5 rounded-full text-xs text-white/90 z-10 flex items-center gap-2 shadow-lg">
        <MonitorPlay className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-medium">{participantName}</span>
        <span className="text-white/40">&bull;</span>
        <span className="text-zinc-300">{t.screenSharingText}</span>
      </div>
    </div>
  );
}
