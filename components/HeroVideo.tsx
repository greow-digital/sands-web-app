"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface HeroVideoProps {
  posterSrc: string;
  videoSrc: string;
  alt: string;
}

/**
 * Hero-bakgrund som börjar med en still bild (LCP-element) och fade-byter till
 * en autoplaying loop-video EFTER page load. Performance-strategi:
 *
 * 1. <Image priority fetchPriority="high"> är LCP - browser hämtar den direkt.
 * 2. <video preload="none"> renderas tom utan att browser laddar fil.
 * 3. useEffect kör efter mount. Vi väntar pa window.load + 300ms idle.
 * 4. Då sätter vi preload="auto" och anropar load() + play().
 * 5. När onCanPlay triggers → fade in videon (opacity 0 → 100).
 *
 * På mobil (innerWidth < 768) skippar vi videon helt — sparar mobil-data och
 * undviker autoplay-restriktioner i iOS Low Data mode.
 */
export default function HeroVideo({ posterSrc, videoSrc, alt }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;

    // Respekt prefers-reduced-motion: skippa autoplay
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = () => {
      const v = videoRef.current;
      if (!v) return;
      v.preload = "auto";
      v.load();
      v.play().catch(() => {
        // Autoplay-block (sällsynt på muted video men händer)
      });
    };

    if (document.readyState === "complete") {
      const id = setTimeout(start, 300);
      return () => clearTimeout(id);
    }
    const onLoad = () => setTimeout(start, 300);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      <Image
        src={posterSrc}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 768px, (max-width: 1200px) 1200px, 1920px"
        quality={80}
        className="object-cover"
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        onCanPlay={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </>
  );
}
