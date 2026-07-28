"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Voice-sessionen drar in ElevenLabs React SDK + WebRTC (LiveKit), vilket är
// tungt. Den lazy-laddas därför först när besökaren klickar, så sidladdningen
// och Core Web Vitals inte påverkas. Mountas site-wide via app/layout.tsx.
const VoiceSession = dynamic(() => import("@/components/VoiceSession"), {
  ssr: false,
});

// Sidor där röst-widgeten inte ska visas: offertformuläret, tack-sidan samt
// Studio/POC-sidor.
const HIDDEN_PREFIXES = ["/offert", "/tack", "/studio", "/projekt-sanity-poc"];

export default function ElevenLabsWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Öppna panelen även från den mobila sticky-baren (MobileCTA), som saknar
  // egen flytande knapp och skickar detta event i stället.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("sands:open-voice", handler);
    return () => window.removeEventListener("sands:open-voice", handler);
  }, []);

  // Stäng vid sidbyte.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Dölj den mobila offert-baren medan panelen är öppen (återanvänder samma
  // event som MobileCTA redan lyssnar på) så de inte staplas.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sands:calc-sticky", { detail: { visible: open } })
    );
  }, [open]);

  const hidden =
    !!pathname &&
    HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (hidden) return null;

  if (open) return <VoiceSession onClose={() => setOpen(false)} />;

  // Flytande knapp bara på desktop. På mobil öppnas rösten från sticky-baren.
  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Prata med vår takrådgivare"
      className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-2 rounded-full py-2 pl-2 pr-5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
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
