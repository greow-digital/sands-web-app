"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ConversationProvider,
  useConversation,
  useConversationClientTool,
} from "@elevenlabs/react";
import { PhoneOff, ChevronDown, Check } from "lucide-react";

// ── Lead-pipeline ────────────────────────────────────────────────
// Röst-leads går genom samma /api/lead (Google Sheets + mejl) och firar
// samma konvertering (form_submit + generate_lead, value 1500 SEK) som
// /tack. Leadet skickas automatiskt när agenten anropar capture_lead;
// transkriptet (så här långt) följer med.

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
  const [expanded, setExpanded] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "sent" | "error">(
    "idle"
  );

  const transcriptRef = useRef<HTMLDivElement>(null);
  // Spegel av messages så den stabila capture_lead-handlern kan läsa
  // hela transkriptet vid anropstillfället.
  const messagesRef = useRef<Msg[]>([]);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

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

  // capture_lead skickar leadet automatiskt (med transkript). Inget formulär.
  useConversationClientTool(
    "capture_lead",
    useCallback(async (params: Record<string, unknown>) => {
      const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");
      const lead: Lead = {
        name: s(params.name),
        contact: s(params.phone) || s(params.email),
        area: s(params.area),
        roofType: s(params.roofType),
        urgency: s(params.urgency),
      };
      const transcript = messagesRef.current
        .map((m) => `${m.role === "agent" ? "Sanna" : "Kund"}: ${m.text}`)
        .join("\n");
      const ok = await submitLead(lead, transcript);
      setLeadStatus(ok ? "sent" : "error");
      return ok
        ? "Tack, jag har registrerat uppgifterna. En takläggare hör av sig inom kort."
        : "Jag kunde tyvärr inte spara uppgifterna just nu.";
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

  useEffect(() => {
    const el = transcriptRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, expanded]);

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

  const dotColor =
    micDenied || startError
      ? "#ef4444"
      : status === "connected"
      ? isSpeaking
        ? "var(--color-primary)"
        : "#22c55e"
      : "#9ca3af";

  function hangUp() {
    endSession();
    onClose();
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 flex w-[calc(100vw-2rem)] max-w-xs flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl sm:bottom-6 sm:right-6">
      {/* Rubrik */}
      <div className="flex items-center gap-2.5 px-4 py-3">
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

      {/* Lead skickat-bekräftelse */}
      {leadStatus === "sent" && (
        <div className="flex items-center gap-2 border-t border-gray-100 bg-[#F0F7F1] px-4 py-2.5">
          <Check size={15} className="shrink-0 text-green-600" />
          <p className="text-xs font-medium text-green-800">
            Dina uppgifter är skickade, vi hör av oss inom kort.
          </p>
        </div>
      )}
      {leadStatus === "error" && (
        <div className="border-t border-gray-100 bg-red-50 px-4 py-2.5">
          <p className="text-xs font-medium text-red-700">
            Kunde inte spara uppgifterna. Du kan ringa oss på 08-28 38 88.
          </p>
        </div>
      )}

      {/* Kollapsbart transkript */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between border-t border-gray-100 px-4 py-2.5 text-xs font-medium text-gray-500 hover:bg-gray-50"
      >
        <span>{expanded ? "Dölj konversation" : "Visa konversation"}</span>
        <ChevronDown
          size={15}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div
          ref={transcriptRef}
          className="max-h-56 min-h-[60px] space-y-2 overflow-y-auto border-t border-gray-100 px-4 py-3"
        >
          {messages.length === 0 ? (
            <p className="pt-3 text-center text-xs text-gray-400">
              Konversationen visas här.
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
      )}
    </div>
  );
}
