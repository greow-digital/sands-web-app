"use client";

import { useEffect, useRef, useState } from "react";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Tyst loopande videoförhandsvisning ovanpå projektkortets stillbild.
 *
 * CWV-säker by design:
 * - Stillbilden ligger kvar som basskikt och paintar direkt → ingen LCP-
 *   regression och noll CLS (videon är absolut positionerad i samma box).
 * - preload="none" + src sätts FÖRST när kortet är nära viewporten
 *   (IntersectionObserver), så inget laddas vid sidladdning.
 * - Tonas in först när den kan spelas, annars syns bara bilden.
 * - Respekterar prefers-reduced-motion samt Save-Data/2G → hoppar över video.
 */
export default function ProjektCardVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Rörelsekänsliga användare och sparläge: behåll stillbilden.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: NetworkInfo })
      .connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return;

    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={load ? src : undefined}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      aria-hidden
      tabIndex={-1}
      onCanPlay={() => setReady(true)}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
        ready ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
