"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConversationProvider,
  useConversation,
  useConversationClientTool,
} from "@elevenlabs/react";
import { PhoneOff, Send } from "lucide-react";

// ── Lead-pipeline ────────────────────────────────────────────────
// Röst-leads går genom samma /api/lead (Google Sheets + mejl) och firar
// samma konvertering (form_submit + generate_lead, value 1500 SEK) som
// /tack. Men användaren bekräftar sina uppgifter i panelen och klickar
// Skicka själv, inget skickas i det tysta. Transkriptet följer med.

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

let leadFired = false;

type Lead = {
  name: string;
  contact: string; // telefon eller e-post
  area: string;
  roofType: string;
  urgency: string;
};

// Skickar leadet till pipelinen och firar konverteringen en gång.
async function submitLead(lead: Lead, transcript: string): Promise<boolean> {
  try {
    const contact = lead.contact.trim();
    const isEmail = contact.includes("@");
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "sandsab.se";

    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: lead.name.trim() || undefined,
        phone: isEmail ? undefined : contact || undefined,
        email: isEmail ? contact : undefined,
        area: lead.area.trim() || undefined,
        roofType: lead.roofType.trim() || undefined,
        urgency: lead.urgency.trim() || undefined,
        message: "Röstsamtal via Sanna (se transkript).",
        transcript: transcript || undefined,
        formId: "voice",
        tag: "voice",
        leadSource: "voice",
        source: pathname,
        gclid: clickId("gclid", "_gcl_aw"),
        gbraid: clickId("gbraid", "_gcl_gb"),
        wbraid: clickId("wbraid", "_gcl_wb"),
      }),
    });
    if (!res.ok) return false;

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
    return true;
  } catch {
    return false;
  }
}

// Ber om mik-tillstånd och släpper strömmen direkt, så SDK:n äger miken ensam.
async function acquireMic(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

// Autentiserad signed URL (API-nyckeln ligger server-side i /api/voice-token).
// Vi kör websocket med den (TCP/443, undviker WebRTC/UDP).
async function fetchSignedUrl(): Promise<string | null> {
  try {
    const res = await fetch("/api/voice-token", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { signedUrl?: string };
    return data.signedUrl ?? null;
  } catch {
    return null;
  }
}

// ── UI ───────────────────────────────────────────────────────────

type Msg = { role: "agent" | "user"; text: string };

export default function VoiceSession({ onClose }: { onClose: () => void }) {
  return (
    <ConversationProvider>
      <VoiceInner onClose={onClose} />
    </ConversationProvider>
  );
}

function VoiceInner({ onClose }: { onClose: () => void }) {
  const [micDenied, setMicDenied] = useState(false);
  const [startError, setStartError] = useState(false);
  const [everConnected, setEverConnected] = useState(false);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [lead, setLead] = useState<Lead>({
    name: "",
    contact: "",
    area: "",
    roofType: "",
    urgency: "",
  });
  const [prefilled, setPrefilled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const transcriptRef = useRef<HTMLDivElement>(null);

  // Transkript: append varje meddelande (stabil callback).
  const onMessage = useCallback(
    (p: { message: string; source: "user" | "ai" }) => {
      if (!p?.message) return;
      setMessages((prev) => [
        ...prev,
        { role: p.source === "ai" ? "agent" : "user", text: p.message },
      ]);
    },
    []
  );

  // capture_lead förfyller formuläret istället för att skicka direkt.
  useConversationClientTool(
    "capture_lead",
    useCallback((params: Record<string, unknown>) => {
      const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
      setLead((prev) => ({
        name: s(params.name) || prev.name,
        contact: s(params.phone) || s(params.email) || prev.contact,
        area: s(params.area) || prev.area,
        roofType: s(params.roofType) || prev.roofType,
        urgency: s(params.urgency) || prev.urgency,
      }));
      setPrefilled(true);
      return "Jag har fyllt i uppgifterna i rutan. Be kunden kontrollera att de stämmer och klicka Skicka.";
    }, [])
  );

  const { status, isSpeaking, startSession, endSession } = useConversation({
    onMessage,
  });

  async function connect(shouldAbort?: () => boolean) {
    setMicDenied(false);
    setStartError(false);
    if (!(await acquireMic())) {
      if (!shouldAbort?.()) setMicDenied(true);
      return;
    }
    const signedUrl = await fetchSignedUrl();
    if (shouldAbort?.()) return;
    if (!signedUrl) {
      setStartError(true);
      return;
    }
    startSession({ signedUrl, connectionType: "websocket" });
  }

  useEffect(() => {
    let cancelled = false;
    void connect(() => cancelled);
    return () => {
      cancelled = true;
      endSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "connected") setEverConnected(true);
  }, [status]);

  // Rulla transkriptet till senaste raden.
  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const connectFailed =
    micDenied ||
    startError ||
    status === "error" ||
    (status === "disconnected" && everConnected);

  const statusLabel = micDenied
    ? "Mikrofon behövs"
    : startError
    ? "Kunde inte starta"
    : status === "connected"
    ? isSpeaking
      ? "Sanna pratar…"
      : "Lyssnar…"
    : connectFailed
    ? "Samtalet avslutat"
    : "Ansluter…";

  const dotColor = micDenied || startError
    ? "#ef4444"
    : status === "connected"
    ? isSpeaking
      ? "var(--color-primary)"
      : "#22c55e"
    : connectFailed
    ? "#9ca3af"
    : "#9ca3af";

  function hangUp() {
    endSession();
    onClose();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.name.trim() || !lead.contact.trim()) {
      setFormError("Fyll i namn och telefon eller e-post.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    const transcript = messages
      .map((m) => `${m.role === "agent" ? "Sanna" : "Kund"}: ${m.text}`)
      .join("\n");
    const ok = await submitLead(lead, transcript);
    setSubmitting(false);
    if (ok) setSubmitted(true);
    else setFormError("Något gick fel. Försök igen eller ring 08-28 38 88.");
  }

  const field =
    "w-full px-3 py-2 rounded-lg text-sm outline-none border border-gray-200 bg-white focus:border-[#2B74FC] transition-colors";

  return (
    <div className="fixed bottom-24 right-4 z-40 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:bottom-6 sm:right-6">
      {/* Rubrik */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          {status === "connected" && (
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ backgroundColor: dotColor }}
            />
          )}
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: dotColor }}
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800">Sanna</p>
          <p className="text-xs text-gray-500">{statusLabel}</p>
        </div>
        {connectFailed && (
          <button
            type="button"
            onClick={() => void connect()}
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-[#2B74FC] hover:bg-blue-50"
          >
            Försök igen
          </button>
        )}
        <button
          type="button"
          onClick={hangUp}
          aria-label="Lägg på"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-500 transition-colors hover:bg-red-100"
        >
          <PhoneOff size={16} />
        </button>
      </div>

      {/* Transkript */}
      <div
        ref={transcriptRef}
        className="max-h-56 min-h-[80px] space-y-2 overflow-y-auto px-4 py-3"
      >
        {messages.length === 0 ? (
          <p className="pt-4 text-center text-xs text-gray-400">
            Säg hej till Sanna, konversationen visas här.
          </p>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block max-w-[85%] rounded-2xl px-3 py-1.5 text-sm ${
                  m.role === "user"
                    ? "bg-[#2B74FC] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {m.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Bekräfta & skicka */}
      {submitted ? (
        <div className="border-t border-gray-100 bg-[#F8F9FB] px-4 py-5 text-center">
          <p className="text-sm font-semibold text-gray-800">
            Tack, vi har tagit emot din förfrågan!
          </p>
          <p className="mt-1 text-xs text-gray-500">
            En takläggare hör av sig inom kort.
          </p>
        </div>
      ) : (
        <form
          onSubmit={onSubmit}
          className="space-y-2 border-t border-gray-100 bg-[#F8F9FB] px-4 py-3"
        >
          <p className="text-xs font-semibold text-gray-600">
            {prefilled
              ? "Stämmer uppgifterna? Rätta vid behov och skicka."
              : "Lämna dina uppgifter så hör vi av oss."}
          </p>
          <input
            className={field}
            placeholder="Namn"
            value={lead.name}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
          />
          <input
            className={field}
            placeholder="Telefon eller e-post"
            value={lead.contact}
            onChange={(e) => setLead({ ...lead, contact: e.target.value })}
          />
          <input
            className={field}
            placeholder="Ort (valfritt)"
            value={lead.area}
            onChange={(e) => setLead({ ...lead, area: e.target.value })}
          />
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Send size={15} />
            {submitting ? "Skickar…" : "Skicka förfrågan"}
          </button>
        </form>
      )}
    </div>
  );
}
