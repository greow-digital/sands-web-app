"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Voice-sessionen drar in ElevenLabs React SDK + WebRTC (LiveKit), vilket är
// tungt. Den lazy-laddas därför först när besökaren klickar, så sidladdningen
// och Core Web Vitals inte påverkas. Mountas site-wide via app/layout.tsx.
const VoiceSession = dynamic(() => import("@/components/VoiceSession"), {
  ssr: false,
});

// Sidor där röst-bubblan inte ska visas: offertformuläret, tack-sidan samt
// Studio/POC-sidor.
const HIDDEN_PREFIXES = ["/offert", "/tack", "/studio", "/projekt-sanity-poc"];

export default function ElevenLabsWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (
    pathname &&
    HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))
  ) {
    return null;
  }

  if (open) return <VoiceSession onClose={() => setOpen(false)} />;

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Prata med vår takrådgivare"
      className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full py-2 pl-2 pr-5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] sm:bottom-6 sm:right-6"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <img
        src="/images/voice-avatar.jpg"
        alt="Takrådgivare på Sands Entreprenad"
        className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-white/40"
      />
      Prata med oss
    </button>
  );
}
