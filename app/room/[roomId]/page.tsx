"use client";

import React, { useState } from "react";
import PreJoinLobby from "@/components/facetime/PreJoinLobby";
import FaceTimeRoom from "@/components/facetime/FaceTimeRoom";
import { Loader2 } from "lucide-react";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const { roomId } = params;

  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (name: string, initialAudio: boolean, initialVideo: boolean) => {
    setIsLoading(true);
    setError(null);
    setUsername(name);

    try {
      const res = await fetch(
        `/api/livekit/token?room=${encodeURIComponent(roomId)}&username=${encodeURIComponent(name)}`
      );

      if (!res.ok) {
        throw new Error("Token olishda xatolik yuz berdi");
      }

      const data = await res.json();
      setToken(data.token);
      setWsUrl(data.wsUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Xonaga ulanishda xatolik");
    } finally {
      setIsLoading(false);
    }
  };

  // State 1: Connecting / Token loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <div className="w-16 h-16 rounded-3xl glass-panel flex items-center justify-center mb-4 border border-white/10 shadow-2xl">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
        <p className="text-sm font-medium text-zinc-300">FaceTime xonasiga ulanmoqda...</p>
      </div>
    );
  }

  // State 2: Error screen
  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-red-500/20">
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
            !
          </div>
          <h2 className="text-xl font-bold mb-2">Ulanishda xatolik</h2>
          <p className="text-sm text-zinc-400 mb-6">{error}</p>
          <button
            onClick={() => setError(null)}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition"
          >
            Qaytadan urinish
          </button>
        </div>
      </div>
    );
  }

  // State 3: Active FaceTime Room
  if (token && wsUrl && username) {
    return (
      <FaceTimeRoom
        token={token}
        serverUrl={wsUrl}
        roomId={roomId}
        username={username}
      />
    );
  }

  // State 4: Pre-join Lobby
  return <PreJoinLobby roomId={roomId} onJoin={handleJoin} />;
}
