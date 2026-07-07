"use client";

import dynamic from "next/dynamic";

// Lazy-laddas på klienten efter hydrering (ssr:false) så den inte påverkar
// LCP. Fixed overlay = ingen CLS.
const TaktestWidget = dynamic(() => import("./TaktestWidget"), { ssr: false });

export default function TaktestWidgetLoader() {
  return <TaktestWidget />;
}
