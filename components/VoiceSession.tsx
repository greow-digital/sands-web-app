"use client";

import { useEffect, useState } from "react";
import {
  ConversationProvider,
  useConversation,
  useConversationClientTool,
} from "@elevenlabs/react";
import { X } from "lucide-react";

const AGENT_ID = "agent_6001kykxzdsqfhnafwc9hp5z535s";

// ── Lead-pipeline ────────────────────────────────────────────────
// capture_lead speglar exakt hur LeadForm och TaktestWidget skickar
// leads: samma /api/lead-endpoint (Google Sheets + mejl) och samma
// konverterings-events (form_submit + generate_lead, value 1500 SEK)
// som /tack firar. Voice-leads får formId "voice" så de kan skiljas ut.

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}
function parseGcl(name: string): string | undefined {
  const raw = getCookie(name);
  if (!raw) return undefined;
  const parts = raw.split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : raw;
}
function clickId(our: string, gtag: string): string | undefined {
  return getCookie(our) || parseGcl(gtag);
}
function fireGtag(name: string, params: object) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  (
    window as unknown as { gtag: (e: string, n: string, p: object) => void }
  ).gtag("event", name, params);
}

// Firar konverteringen max en gång per sidladdning (som /tack:s dedup).
let leadFired = false;

type LeadArgs = {
  name?: string;
  phone?: string;
  email?: string;
  area?: string;
  roofType?: string;
  urgency?: string;
  message?: string;
};

async function captureLead(params: LeadArgs): Promise<string> {
  try {
    const contact = (params.phone || params.email || "").trim();
    const isEmail = contact.includes("@");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "sandsab.se";

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: params.name?.trim() || undefined,
        phone: params.phone?.trim() || (isEmail ? undefined : contact) || undefined,
        email: params.email?.trim() || (isEmail ? contact : undefined) || undefined,
        area: params.area?.trim() || undefined,
        roofType: params.roofType?.trim() || undefined,
        urgency: params.urgency?.trim() || undefined,
        message: params.message?.trim() || "Röstagent på sandsab.se.",
        formId: "voice",
        tag: "voice",
        leadSource: "voice",
        source: pathname,
        gclid: clickId("gclid", "_gcl_aw"),
        gbraid: clickId("gbraid", "_gcl_gb"),
        wbraid: clickId("wbraid", "_gcl_wb"),
      }),
    });
    if (!res.ok) return "Kunde tyvärr inte spara uppgifterna just nu.";

    if (!leadFired) {
      leadFired = true;
      const txn = `voice_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
      const p = {
        currency: "SEK",
        value: 1500,
        transaction_id: txn,
        form_source: pathname,
        form_variant: "voice",
        form_id: "voice",
        lead_source: "voice",
      };
      fireGtag("form_submit", p);
      fireGtag("generate_lead", p);
      try {
        document.cookie =
          "sands_submitted=1; max-age=2592000; path=/; samesite=lax";
      } catch {
        /* cookies kan vara blockerat */
      }
    }
    return "Tack, jag har registrerat dina uppgifter. En takläggare hör av sig inom kort.";
  } catch {
    return "Kunde tyvärr inte spara uppgifterna just nu.";
  }
}

// Ber om mik-tillstånd och SLÄPPER strömmen direkt. Annars håller vår probe
// kvar mikrofonen, och SDK:ns egen getUserMedia (för LiveKit-publish-spåret)
// får en upptagen enhet -> trackID undefined -> rummet kopplas ner precis
// efter hälsningen. Konsolen bekräftade exakt det förloppet.
async function acquireMic(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

// ── UI ───────────────────────────────────────────────────────────

export default function VoiceSession({ onClose }: { onClose: () => void }) {
  return (
    <ConversationProvider>
      <VoiceInner onClose={onClose} />
    </ConversationProvider>
  );
}

function VoiceInner({ onClose }: { onClose: () => void }) {
  const [micDenied, setMicDenied] = useState(false);
  const [everConnected, setEverConnected] = useState(false);

  // Client tool: stabil modul-funktion, registreras en gång.
  useConversationClientTool("capture_lead", captureLead);

  // Inga callbacks/options här med flit: inline-callbacks får ny identitet
  // vid varje re-render (och agenten re-renderar när den pratar), vilket kan
  // störa den live-anslutningen. Vi driver UI:t enbart från status.
  const { status, isSpeaking, startSession, endSession } = useConversation();

  async function start() {
    setMicDenied(false);
    if (!(await acquireMic())) {
      setMicDenied(true);
      return;
    }
    startSession({ agentId: AGENT_ID, connectionType: "websocket" });
  }

  // Starta vid mount, avsluta vid unmount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await acquireMic();
      if (cancelled) return;
      if (ok) startSession({ agentId: AGENT_ID, connectionType: "websocket" });
      else setMicDenied(true);
    })();
    return () => {
      cancelled = true;
      endSession();
    };
    // startSession/endSession är ref-stabila; kör bara vid mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "connected") setEverConnected(true);
  }, [status]);

  // "Slut" = ett fel, eller frånkopplad EFTER att vi en gång varit
  // uppkopplade (så initiala "disconnected" innan start inte flaggas).
  const ended =
    !micDenied &&
    (status === "error" || (status === "disconnected" && everConnected));
  const restartable = micDenied || ended;

  const label = micDenied
    ? "Mikrofon behövs, tryck för att försöka igen"
    : ended
    ? "Samtalet avslutades, tryck för att prata igen"
    : status === "connected"
    ? isSpeaking
      ? "Rådgivaren pratar…"
      : "Lyssnar…"
    : "Ansluter…";

  const dotColor = micDenied
    ? "#ef4444"
    : ended
    ? "#f59e0b"
    : status === "connected"
    ? isSpeaking
      ? "var(--color-primary)"
      : "#22c55e"
    : "#9ca3af";

  function handleClose() {
    endSession();
    onClose();
  }

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-3 shadow-xl">
      <button
        type="button"
        onClick={restartable ? start : undefined}
        disabled={!restartable}
        aria-label={restartable ? "Starta samtal igen" : "Samtalsstatus"}
        className={`flex items-center gap-3 ${
          restartable ? "cursor-pointer" : "cursor-default"
        }`}
      >
        <span className="relative flex h-3 w-3 shrink-0">
          {status === "connected" && (
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: dotColor }}
            />
          )}
          <span
            className="relative inline-flex h-3 w-3 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        </span>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>
      <button
        onClick={handleClose}
        aria-label="Stäng"
        className="ml-1 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <X size={18} />
      </button>
    </div>
  );
}
