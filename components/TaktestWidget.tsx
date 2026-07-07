"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, X, ArrowRight, RotateCcw } from "lucide-react";

// ──────────────────────────────────────────────────────────
// Scriptad "Taktest"-chattwidget (INGEN livechat). Knappbaserat
// frågeflöde → bedömning → lead-formulär som postar till samma
// /api/lead-endpoint som offertformuläret. Se DEL 1–5 i speccen.
// ──────────────────────────────────────────────────────────

const EXCLUDED = ["/offert", "/tack"];
const TEASER_DELAY_MS = 12000;
const STORAGE_KEY = "sands_taktest_widget";
const DONE_FLAG = "sands_taktest_done";
const LEAD_FIRED_FLAG = "sands_taktest_lead_fired";
const AVATAR = "/images/logo-sandsentreprenad-icon.svg";

type Flow =
  | "intro"
  | "material"
  | "alder"
  | "symptom"
  | "lackage"
  | "byggar"
  | "result"
  | "form"
  | "done";

const QUESTION_ORDER: Flow[] = [
  "material",
  "alder",
  "symptom",
  "lackage",
  "byggar",
];

type Opt = { v: string; label: string };
type Question = { q: string; multi?: boolean; options: Opt[] };

const QUESTIONS: Record<string, Question> = {
  material: {
    q: "Vilket takmaterial har huset idag?",
    options: [
      { v: "tegel", label: "Tegelpannor" },
      { v: "betong", label: "Betongpannor" },
      { v: "plat", label: "Plåt" },
      { v: "papp", label: "Papp" },
      { v: "eternit", label: "Eternit" },
      { v: "vet", label: "Vet inte" },
    ],
  },
  alder: {
    q: "Ungefär hur gammalt är taket?",
    options: [
      { v: "<15", label: "Under 15 år" },
      { v: "15-30", label: "15–30 år" },
      { v: "30+", label: "Över 30 år" },
      { v: "vet", label: "Vet inte" },
    ],
  },
  symptom: {
    q: "Känner du igen något av det här?",
    multi: true,
    options: [
      { v: "mossa", label: "Mossa eller alger" },
      { v: "spruckna", label: "Spruckna/lösa pannor" },
      { v: "fukt", label: "Fuktfläckar inomhus" },
      { v: "svackor", label: "Svackor i taket" },
      { v: "rost", label: "Rost eller lösa plåtdetaljer" },
      { v: "inget", label: "Inget av detta" },
    ],
  },
  lackage: {
    q: "Har taket läckt någon gång?",
    options: [
      { v: "ja", label: "Ja" },
      { v: "nej", label: "Nej" },
      { v: "osaker", label: "Osäker" },
    ],
  },
  byggar: {
    q: "Vilket årtionde byggdes huset?",
    options: [
      { v: "40-50", label: "40–50-tal" },
      { v: "60-70", label: "60–70-tal" },
      { v: "80-90", label: "80–90-tal" },
      { v: "2000+", label: "2000+" },
      { v: "vet", label: "Vet inte" },
    ],
  },
};

type Answers = {
  material?: string;
  alder?: string;
  symptom: string[];
  lackage?: string;
  byggar?: string;
};

const EMPTY: Answers = { symptom: [] };

function labelOf(step: string, value?: string): string {
  if (!value) return "–";
  return QUESTIONS[step]?.options.find((o) => o.v === value)?.label ?? value;
}

function scoreAnswers(a: Answers): number {
  let s = 0;
  if (a.alder === "30+") s += 3;
  else if (a.alder === "15-30") s += 1;
  if (a.lackage === "ja") s += 3;
  else if (a.lackage === "osaker") s += 1;
  const symptomPoints: Record<string, number> = {
    fukt: 3,
    spruckna: 2,
    svackor: 2,
    rost: 1,
    mossa: 1,
  };
  for (const sym of a.symptom) s += symptomPoints[sym] ?? 0;
  if (a.material === "eternit") s += 2;
  return s;
}

type Urgency = { key: "hog" | "medel" | "lag"; text: string };

function urgencyFor(score: number): Urgency {
  if (score >= 6)
    return {
      key: "hog",
      text: "Mycket tyder på att taket behöver ses över inom kort. En kostnadsfri takkontroll ger dig svart på vitt, och ett fast pris om något behöver göras.",
    };
  if (score >= 3)
    return {
      key: "medel",
      text: "Taket har några varningstecken värda att hålla koll på. En kostnadsfri takkontroll ger dig en tydlig bild, utan förpliktelser.",
    };
  return {
    key: "lag",
    text: "Taket verkar vara i gott skick! Vill du vara säker inför kommande år kan du boka en kostnadsfri takkontroll.",
  };
}

const ETERNIT_NOTE =
  "Eftersom du angett eternittak är det värt att veta att eternit kräver särskild hantering vid en eventuell åtgärd. En takkontroll ger dig klarhet i vad som gäller.";

// ── GA4 ────────────────────────────────────────────────
type GtagFn = (event: string, name: string, params: object) => void;
function fireGtag(name: string, params: object = {}) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  (window as unknown as { gtag: GtagFn }).gtag("event", name, params);
}

// ── Click-ID (samma logik som LeadForm) ────────────────
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}
function parseGcl(name: string): string | undefined {
  const raw = getCookie(name);
  if (!raw) return undefined;
  const parts = raw.split(".");
  return parts.length >= 3 ? parts.slice(2).join(".") : undefined;
}
function clickId(our: string, gtag: string): string | undefined {
  return getCookie(our) || parseGcl(gtag);
}

// ── Persistens ─────────────────────────────────────────
type Persisted = {
  open: boolean;
  flow: Flow;
  answers: Answers;
};
function loadState(): Persisted | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
}
function saveState(s: Persisted) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // storage blockerat
  }
}

function setWidgetOpenFlag(open: boolean) {
  if (typeof window === "undefined") return;
  (window as unknown as { __sandsWidgetOpen?: boolean }).__sandsWidgetOpen =
    open;
  // Döljer mobil sticky-CTA medan fönstret är öppet (samma event som
  // kalkylatorns sticky-bar använder).
  window.dispatchEvent(
    new CustomEvent("sands:calc-sticky", { detail: { visible: open } })
  );
}

// ──────────────────────────────────────────────────────────

export default function TaktestWidget() {
  const pathname = usePathname();
  const excluded = EXCLUDED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<Flow>("intro");
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [teaser, setTeaser] = useState(false);

  const startedRef = useRef(false);
  const teaserFiredRef = useRef(false);
  const openedOnceRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Hydrera från sessionStorage.
  useEffect(() => {
    const s = loadState();
    if (s) {
      setFlow(s.flow);
      setAnswers(s.answers ?? EMPTY);
      if (s.open) {
        setOpen(true);
        openedOnceRef.current = true;
      }
    }
    setHydrated(true);
  }, []);

  // Persistera.
  useEffect(() => {
    if (!hydrated) return;
    saveState({ open, flow, answers });
  }, [hydrated, open, flow, answers]);

  // Teaser efter 12 s (om aldrig öppnad, ej klar, ej exkluderad sida).
  useEffect(() => {
    if (!hydrated || excluded) return;
    let done = false;
    try {
      done = sessionStorage.getItem(DONE_FLAG) === "1";
    } catch {
      /* ignore */
    }
    if (done || openedOnceRef.current) return;
    const t = setTimeout(() => {
      if (openedOnceRef.current) return;
      setTeaser(true);
      if (!teaserFiredRef.current) {
        teaserFiredRef.current = true;
        fireGtag("taktest_teaser_view", {});
      }
    }, TEASER_DELAY_MS);
    return () => clearTimeout(t);
  }, [hydrated, excluded]);

  // Öppna/stäng-sidoeffekter (flagga + sticky-koordinering + fokus).
  useEffect(() => {
    if (!hydrated) return;
    setWidgetOpenFlag(open);
    if (open) {
      openedOnceRef.current = true;
      setTeaser(false);
      // Fokusera panelen för skärmläsare/tangentbord.
      requestAnimationFrame(() => panelRef.current?.focus());
    }
    return () => setWidgetOpenFlag(false);
  }, [open, hydrated]);

  // Auto-scrolla till senaste meddelandet.
  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [flow, open, answers]);

  // Esc stänger.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const openWidget = useCallback(() => {
    setOpen(true);
    fireGtag("taktest_open", {});
  }, []);

  const markStarted = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fireGtag("taktest_start", {});
  }, []);

  function answerSingle(step: Flow, value: string) {
    markStarted();
    const next = { ...answers, [step]: value } as Answers;
    setAnswers(next);
    fireGtag("taktest_step", { step, answer: value });
    advanceFrom(step, next);
  }

  function toggleSymptom(value: string) {
    markStarted();
    setAnswers((prev) => {
      if (value === "inget") return { ...prev, symptom: ["inget"] };
      const set = new Set(prev.symptom.filter((v) => v !== "inget"));
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, symptom: [...set] };
    });
  }

  function commitSymptom() {
    fireGtag("taktest_step", {
      step: "symptom",
      answer: answers.symptom.join(",") || "inget",
    });
    advanceFrom("symptom", answers);
  }

  function advanceFrom(step: Flow, current: Answers) {
    const idx = QUESTION_ORDER.indexOf(step);
    const nextStep = QUESTION_ORDER[idx + 1];
    if (nextStep) {
      setFlow(nextStep);
    } else {
      // Sista frågan klar → visa bedömning.
      const score = scoreAnswers(current);
      const u = urgencyFor(score);
      fireGtag("taktest_result", { urgency: u.key });
      setFlow("result");
    }
  }

  function markDone() {
    try {
      sessionStorage.setItem(DONE_FLAG, "1");
    } catch {
      /* ignore */
    }
  }

  function restart() {
    setAnswers(EMPTY);
    setFlow("intro");
    startedRef.current = false;
  }

  if (excluded || !hydrated) return null;

  const score = scoreAnswers(answers);
  const urgency = urgencyFor(score);
  const tookTest = Boolean(
    answers.material ||
      answers.alder ||
      answers.symptom.length ||
      answers.lackage ||
      answers.byggar
  );

  return (
    <>
      {/* Flytande bubbla (dold när fönstret är öppet) */}
      {!open && (
        <div className="fixed right-4 bottom-24 md:right-6 md:bottom-6 z-[45] flex flex-col items-end gap-3">
          {teaser && (
            <button
              onClick={openWidget}
              className="max-w-[240px] text-left bg-white rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] border border-gray-100 p-3.5 pr-4 animate-[fadeIn_0.3s_ease]"
            >
              <p className="text-[13px] font-semibold text-gray-800 leading-snug">
                Undrar du om det är dags att byta tak?
              </p>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Gör taktestet, 1 minut.
              </p>
            </button>
          )}
          <button
            onClick={openWidget}
            aria-label="Öppna taktestet"
            className="relative w-14 h-14 rounded-full shadow-[0_12px_30px_-8px_rgba(43,116,252,0.6)] flex items-center justify-center text-white transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <MessageSquare size={24} />
            {teaser && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>
      )}

      {/* Chattfönster */}
      {open && (
        <div
          ref={panelRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Taktest, chatt"
          className="fixed z-[55] outline-none bg-white flex flex-col
            inset-x-0 bottom-0 h-[88vh] rounded-t-3xl
            md:inset-x-auto md:bottom-6 md:right-6 md:h-[620px] md:max-h-[82vh] md:w-[400px] md:rounded-3xl
            shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)] border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <div className="w-9 h-9 rounded-full bg-white/95 flex items-center justify-center overflow-hidden shrink-0">
              <Image src={AVATAR} alt="Sands" width={24} height={24} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Taktest</p>
              <p className="text-white/80 text-[11px] leading-tight">
                Sands Entreprenad
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Stäng"
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            >
              <X size={17} />
            </button>
          </div>

          {/* Meddelanden */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-3.5 bg-[#F6F8FB]"
          >
            <Bot>
              Hej! Svara på 5 snabba frågor så får du en första bedömning av ditt
              tak, och boka en kostnadsfri takkontroll om du vill.
            </Bot>

            {flow === "intro" && (
              <Choices>
                <ChoiceBtn onClick={() => setFlow("material")}>
                  Starta taktestet
                </ChoiceBtn>
                <ChoiceBtn
                  variant="ghost"
                  onClick={() => {
                    fireGtag("taktest_step", { step: "intro", answer: "skip_to_form" });
                    setFlow("form");
                  }}
                >
                  Jag vill ha prisförslag direkt →
                </ChoiceBtn>
              </Choices>
            )}

            {/* Historik: besvarade frågor som bubbelpar */}
            {flow !== "intro" &&
              QUESTION_ORDER.map((step) => {
                const answered =
                  step === "symptom"
                    ? answers.symptom.length > 0 &&
                      QUESTION_ORDER.indexOf(flowActiveStep(flow)) >
                        QUESTION_ORDER.indexOf(step)
                    : Boolean(answers[step as keyof Answers]) &&
                      isPast(flow, step);
                if (!answered) return null;
                const answerLabel =
                  step === "symptom"
                    ? answers.symptom.map((v) => labelOf("symptom", v)).join(", ")
                    : labelOf(step, answers[step as keyof Answers] as string);
                return (
                  <div key={step} className="space-y-3.5">
                    <Bot>{QUESTIONS[step].q}</Bot>
                    <UserBubble>{answerLabel}</UserBubble>
                  </div>
                );
              })}

            {/* Aktiv fråga */}
            {QUESTION_ORDER.includes(flow) && (
              <>
                <Bot>{QUESTIONS[flow].q}</Bot>
                {flow === "symptom" ? (
                  <>
                    <Choices>
                      {QUESTIONS.symptom.options.map((o) => (
                        <ChoiceBtn
                          key={o.v}
                          selected={answers.symptom.includes(o.v)}
                          onClick={() => toggleSymptom(o.v)}
                        >
                          {o.label}
                        </ChoiceBtn>
                      ))}
                    </Choices>
                    <button
                      onClick={commitSymptom}
                      disabled={answers.symptom.length === 0}
                      className="ml-auto flex items-center gap-1.5 px-5 py-2.5 rounded-full text-white text-sm font-semibold transition-all disabled:opacity-40"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Klar <ArrowRight size={14} />
                    </button>
                  </>
                ) : (
                  <Choices>
                    {QUESTIONS[flow].options.map((o) => (
                      <ChoiceBtn key={o.v} onClick={() => answerSingle(flow, o.v)}>
                        {o.label}
                      </ChoiceBtn>
                    ))}
                  </Choices>
                )}
              </>
            )}

            {/* Bedömning (visas ej om användaren hoppade direkt till formuläret) */}
            {tookTest && (flow === "result" || flow === "form" || flow === "done") && (
              <>
                <Bot>{urgency.text}</Bot>
                {answers.material === "eternit" && <Bot>{ETERNIT_NOTE}</Bot>}
                {flow === "result" && (
                  <Choices>
                    <ChoiceBtn onClick={() => setFlow("form")}>
                      Boka kostnadsfri takkontroll
                    </ChoiceBtn>
                    <ChoiceBtn variant="ghost" onClick={restart}>
                      Gör om testet
                    </ChoiceBtn>
                  </Choices>
                )}
              </>
            )}

            {/* Formulär */}
            {flow === "form" && (
              <>
                <Bot>
                  Lämna dina uppgifter så bokar vi en kostnadsfri takkontroll, vi
                  återkommer inom 24 h på vardagar.
                </Bot>
                <WidgetForm
                  answers={answers}
                  urgency={urgency.key}
                  score={score}
                  pathname={pathname}
                  onDone={() => {
                    markDone();
                    setFlow("done");
                  }}
                />
              </>
            )}

            {/* Tack */}
            {flow === "done" && (
              <>
                <UserBubble>Uppgifter skickade</UserBubble>
                <Bot>
                  Tack! Vi har tagit emot dina uppgifter och hör av oss inom 24 h
                  på vardagar för att boka din kostnadsfria takkontroll.
                </Bot>
                <button
                  onClick={restart}
                  className="mx-auto flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#2B74FC]"
                >
                  <RotateCcw size={13} /> Gör om testet
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Vilket steg är "aktivt" i flödet (för historik-jämförelse) ──
function flowActiveStep(flow: Flow): Flow {
  return QUESTION_ORDER.includes(flow) ? flow : "byggar";
}
function isPast(flow: Flow, step: Flow): boolean {
  const activeIdx = QUESTION_ORDER.includes(flow)
    ? QUESTION_ORDER.indexOf(flow)
    : QUESTION_ORDER.length; // result/form/done: allt är passerat
  return QUESTION_ORDER.indexOf(step) < activeIdx;
}

// ── Delkomponenter ─────────────────────────────────────
function Bot({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 animate-[fadeIn_0.25s_ease]">
      <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 mt-0.5">
        <Image src={AVATAR} alt="" width={18} height={18} className="w-4 h-4" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white border border-gray-100 px-3.5 py-2.5 text-[13.5px] text-gray-700 leading-relaxed shadow-sm">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end animate-[fadeIn_0.2s_ease]">
      <div
        className="max-w-[80%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-[13.5px] font-medium text-white leading-relaxed"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {children}
      </div>
    </div>
  );
}

function Choices({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2 justify-end">{children}</div>;
}

function ChoiceBtn({
  children,
  onClick,
  selected = false,
  variant = "solid",
  disabled = false,
}: {
  children: ReactNode;
  onClick: () => void;
  selected?: boolean;
  variant?: "solid" | "ghost";
  disabled?: boolean;
}) {
  const base =
    "px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all border";
  const cls =
    variant === "ghost"
      ? "border-gray-200 bg-white text-gray-600 hover:border-[#2B74FC] hover:text-[#2B74FC]"
      : selected
        ? "border-[#2B74FC] bg-[#2B74FC] text-white"
        : "border-[#2B74FC]/30 bg-[rgba(43,116,252,0.06)] text-[#2B74FC] hover:bg-[rgba(43,116,252,0.12)]";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${cls}`}>
      {children}
    </button>
  );
}

// ── Formulär ───────────────────────────────────────────
function WidgetForm({
  answers,
  urgency,
  score,
  pathname,
  onDone,
}: {
  answers: Answers;
  urgency: string;
  score: number;
  pathname: string;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [ort, setOrt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);
  const firedRef = useRef(false);

  function onFirstFocus() {
    if (startedRef.current) return;
    startedRef.current = true;
    // BEFINTLIGT event-namn, samma form som huvudformuläret.
    fireGtag("form_start", {
      event_category: "engagement",
      event_label: "leadform",
      form_id: "taktest",
    });
  }

  function fireConversionOnce() {
    if (firedRef.current) return;
    try {
      if (sessionStorage.getItem(LEAD_FIRED_FLAG) === "1") {
        firedRef.current = true;
        return;
      }
    } catch {
      /* ignore */
    }
    firedRef.current = true;
    const txn = `taktest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const params = {
      currency: "SEK",
      value: 1500,
      transaction_id: txn,
      form_source: pathname,
      form_variant: "widget",
      form_id: "taktest",
      lead_source: "taktest",
    };
    // BEFINTLIGA konverterings-events (samma som /tack), fyras exakt en gång.
    fireGtag("form_submit", params);
    fireGtag("generate_lead", params);
    try {
      sessionStorage.setItem(LEAD_FIRED_FLAG, "1");
      // Suppression för exit-popup/andra formulär (samma cookie som LeadForm).
      document.cookie = "sands_submitted=1; max-age=2592000; path=/; samesite=lax";
    } catch {
      /* ignore */
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedContact = contact.trim();
    const trimmedOrt = ort.trim();
    if (!trimmedName || !trimmedContact || !trimmedOrt) {
      setError("Fyll i namn, kontaktuppgift och ort.");
      return;
    }
    setError(null);
    setSubmitting(true);
    const isEmail = trimmedContact.includes("@");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          phone: isEmail ? undefined : trimmedContact,
          email: isEmail ? trimmedContact : undefined,
          area: trimmedOrt,
          roofType: labelOf("material", answers.material),
          roofAge: labelOf("alder", answers.alder),
          symptoms:
            answers.symptom.length > 0
              ? answers.symptom.map((v) => labelOf("symptom", v)).join(", ")
              : "Inga angivna",
          leak: labelOf("lackage", answers.lackage),
          decade: labelOf("byggar", answers.byggar),
          urgency,
          message: `Taktest-widget. Material: ${labelOf(
            "material",
            answers.material
          )}, ålder: ${labelOf("alder", answers.alder)}, symptom: ${
            answers.symptom.map((v) => labelOf("symptom", v)).join(", ") ||
            "inga"
          }, läckt: ${labelOf("lackage", answers.lackage)}, byggår: ${labelOf(
            "byggar",
            answers.byggar
          )}. Bedömning: ${urgency} (poäng ${score}).`,
          formId: "taktest",
          tag: "taktest",
          leadSource: "taktest",
          source: pathname,
          gclid: clickId("gclid", "_gcl_aw"),
          gbraid: clickId("gbraid", "_gcl_gb"),
          wbraid: clickId("wbraid", "_gcl_wb"),
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      fireConversionOnce();
      onDone();
    } catch {
      setError("Något gick fel. Försök igen eller ring 08-28 38 88.");
      setSubmitting(false);
    }
  }

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none border border-gray-200 bg-white focus:border-[#2B74FC] transition-colors";

  return (
    <form onSubmit={onSubmit} onFocus={onFirstFocus} className="space-y-2.5" noValidate>
      <input
        type="text"
        placeholder="Namn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={inputCls}
        aria-label="Namn"
      />
      <input
        type="text"
        placeholder="Telefon eller e-post"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className={inputCls}
        aria-label="Telefon eller e-post"
      />
      <input
        type="text"
        placeholder="Ort"
        value={ort}
        onChange={(e) => setOrt(e.target.value)}
        className={inputCls}
        aria-label="Ort"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-colors disabled:opacity-70"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {submitting ? "Skickar…" : "Boka kostnadsfri takkontroll"}
      </button>
      <p className="text-[11px] leading-relaxed text-gray-400 text-center">
        Vi hanterar dina uppgifter enligt GDPR och delar dem aldrig med tredje
        part.{" "}
        <Link href="/integritetspolicy" className="underline hover:text-gray-600">
          Integritetspolicy
        </Link>
      </p>
      <p className="text-[11px] text-center text-gray-400">
        Föredrar du att ringa?{" "}
        <a href="tel:08283888" className="font-medium text-gray-600 underline">
          08-28 38 88
        </a>
      </p>
    </form>
  );
}
