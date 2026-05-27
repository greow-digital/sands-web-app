"use client";

import dynamic from "next/dynamic";
import type { ProjektPin } from "./ProjektKarta";

const ProjektKarta = dynamic(() => import("./ProjektKarta"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] md:h-[520px] rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" />
  ),
});

export default function ProjektKartaWrapper({ pins }: { pins: ProjektPin[] }) {
  return <ProjektKarta pins={pins} />;
}
