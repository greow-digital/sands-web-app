"use client";

import Script from "next/script";
import { createElement } from "react";

// ElevenLabs Conversational AI-widget (voice agent). Web-komponenten
// <elevenlabs-convai> injiceras och uppgraderas av embed-scriptet nedan.
// Vi renderar elementet via createElement för att slippa JSX-typa ett
// okänt custom element. Mountas just nu bara på /projekt som ett test.
const AGENT_ID = "agent_6001kykxzdsqfhnafwc9hp5z535s";

export default function ElevenLabsWidget() {
  return (
    <>
      {createElement("elevenlabs-convai", { "agent-id": AGENT_ID })}
      <Script
        src="https://unpkg.com/@elevenlabs/convai-widget-embed"
        strategy="afterInteractive"
      />
    </>
  );
}
