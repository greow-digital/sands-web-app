"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Mic } from "lucide-react";

// Voice-sessionen drar in ElevenLabs React SDK + WebRTC (LiveKit), vilket är
// tungt. Den lazy-laddas därför först när besökaren klickar, så /projekt
// behåller sin laddtid och Core Web Vitals vid sidladdning. Mountas just nu
// bara på /projekt som ett test av röstagenten (agent "Takrenovering").
const VoiceSession = dynamic(() => import("@/components/VoiceSession"), {
  ssr: false,
});

export default function ElevenLabsWidget() {
  const [open, setOpen] = useState(false);

  if (open) return <VoiceSession onClose={() => setOpen(false)} />;

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Prata med vår takrådgivare"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] sm:bottom-6 sm:right-6"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <Mic size={18} />
      Prata med oss
    </button>
  );
}
