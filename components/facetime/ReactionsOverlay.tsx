"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";

export interface ReactionItem {
  id: string;
  emoji: string;
  senderName: string;
  xOffset: number; // percentage from left
}

export default function ReactionsOverlay() {
  const room = useRoomContext();
  const [reactions, setReactions] = useState<ReactionItem[]>([]);

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant?: any) => {
      try {
        const decoder = new TextDecoder();
        const str = decoder.decode(payload);
        const data = JSON.parse(str);

        if (data.type === "reaction" && data.emoji) {
          const newReaction: ReactionItem = {
            id: `${Date.now()}-${Math.random()}`,
            emoji: data.emoji,
            senderName: participant?.name || participant?.identity || "Mehmon",
            xOffset: 20 + Math.random() * 60, // random position between 20% and 80%
          };

          setReactions((prev) => [...prev.slice(-15), newReaction]);

          // auto remove after 3 seconds
          setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
          }, 3200);
        }
      } catch (e) {
        // Not a reaction JSON, ignore
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 50, scale: 0.5, x: `${r.xOffset}vw` }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: -500,
              scale: [0.5, 1.4, 1.2, 0.8],
              rotate: [0, -10, 10, -5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "easeOut" }}
            className="absolute bottom-24 flex flex-col items-center"
          >
            <span className="text-4xl filter drop-shadow-lg select-none">{r.emoji}</span>
            <span className="text-[10px] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white/90 border border-white/10 mt-1">
              {r.senderName}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function sendReaction(room: any, emoji: string) {
  if (!room || !room.localParticipant) return;
  const encoder = new TextEncoder();
  const payload = encoder.encode(
    JSON.stringify({
      type: "reaction",
      emoji,
    })
  );
  room.localParticipant.publishData(payload, { reliable: true });

  // Also trigger custom event locally so sender sees their own reaction
  const event = new CustomEvent("local-reaction", { detail: { emoji } });
  window.dispatchEvent(event);
}
