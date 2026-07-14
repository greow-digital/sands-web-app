"use client";

import { useRef, useState, type ReactNode } from "react";
import {
  Clock,
  Layers,
  AlertTriangle,
  Search,
  Home,
  ArrowLeft,
  RotateCcw,
  ArrowRight,
  Info,
  MapPin,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";

// ──────────────────────────────────────────────────────────
// Takform-illustrationer (rena linje-SVG, inte clip-art)
// ──────────────────────────────────────────────────────────

function RoofSvg({ shape }: { shape: string }) {
  const common = {
    width: 72,
    height: 56,
    viewBox: "0 0 72 56",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  const body = <path d="M14 54V30h44v24" />;
  switch (shape) {
    case "sadel":
      return (
        <svg {...common}>
          {body}
          <path d="M8 30 36 10l28 20" />
        </svg>
      );
    case "valmat":
      return (
        <svg {...common}>
          {body}
          <path d="M8 30 24 12h24l16 18" />
          <path d="M24 12 36 30 48 12" />
        </svg>
      );
    case "pulpet":
      return (
        <svg {...common}>
          {body}
          <path d="M10 30 62 14" />
        </svg>
      );
    case "mansard":
      return (
        <svg {...common}>
          {body}
          <path d="M10 30 20 18h32l10 12" />
          <path d="M20 18 36 8l16 10" />
        </svg>
      );
    default: // platt / annan
      return (
        <svg {...common}>
          {body}
          <path d="M10 30h52" />
        </svg>
      );
  }
}

// ──────────────────────────────────────────────────────────
// Frågor + poäng
// ──────────────────────────────────────────────────────────

type StepId = "takform" | "alder" | "material" | "byggar" | "brister" | "besiktning";

type Option = {
  value: string;
  label: string;
  points: number;
  illustration?: ReactNode;
};
type Step = {
  id: StepId;
  fraga: string;
  hjalp?: string;
  typ: "single" | "multi";
  icon: typeof Clock;
  layout?: "cards" | "grid" | "list";
  options: Option[];
};

const STEPS: Step[] = [
  {
    id: "takform",
    fraga: "Vilken takform har huset?",
    hjalp: "Välj den som liknar ditt tak mest.",
    typ: "single",
    icon: Home,
    layout: "cards",
    options: [
      { value: "sadel", label: "Sadeltak", points: 0, illustration: <RoofSvg shape="sadel" /> },
      { value: "valmat", label: "Valmat tak", points: 0, illustration: <RoofSvg shape="valmat" /> },
      { value: "pulpet", label: "Pulpettak", points: 0, illustration: <RoofSvg shape="pulpet" /> },
      { value: "mansard", label: "Mansardtak", points: 0, illustration: <RoofSvg shape="mansard" /> },
      { value: "annan", label: "Platt / annan", points: 0, illustration: <RoofSvg shape="platt" /> },
    ],
  },
  {
    id: "alder",
    fraga: "Hur gammalt är taket?",
    hjalp: "Räkna från senaste omläggningen, inte husets byggår.",
    typ: "single",
    icon: Clock,
    options: [
      { value: "<15", label: "Yngre än 15 år", points: 0 },
      { value: "15-30", label: "15–30 år", points: 1 },
      { value: "30+", label: "Äldre än 30 år", points: 3 },
      { value: "vet-ej", label: "Vet ej", points: 1 },
    ],
  },
  {
    id: "material",
    fraga: "Vilket material är taket gjort av?",
    typ: "single",
    icon: Layers,
    options: [
      { value: "tegel", label: "Tegel", points: 0 },
      { value: "betong", label: "Betong", points: 0 },
      { value: "plat", label: "Plåt", points: 0 },
      { value: "papp", label: "Papp", points: 1 },
      { value: "eternit", label: "Eternit", points: 2 },
      { value: "vet-ej", label: "Annat / vet ej", points: 0 },
    ],
  },
  {
    id: "byggar",
    fraga: "När byggdes huset?",
    hjalp: "Hjälper oss ge en mer träffsäker bedömning.",
    typ: "single",
    icon: Home,
    options: [
      { value: "<1950", label: "Före 1950", points: 1 },
      { value: "1950-69", label: "1950–1969", points: 1 },
      { value: "1970-89", label: "1970–1989", points: 0 },
      { value: "1990+", label: "1990 eller senare", points: 0 },
      { value: "vet-ej", label: "Vet ej", points: 0 },
    ],
  },
  {
    id: "brister",
    fraga: "Ser du något av detta på taket?",
    hjalp: "Välj alla som stämmer.",
    typ: "multi",
    icon: AlertTriangle,
    layout: "grid",
    options: [
      { value: "lackage", label: "Läckage senaste åren", points: 3 },
      { value: "fukt", label: "Fuktfläckar eller röta i innertak/vind", points: 3 },
      { value: "svackor", label: "Hängande parti eller svackor", points: 3 },
      { value: "spruckna", label: "Spruckna eller trasiga pannor", points: 2 },
      { value: "mossa", label: "Mossa, alg eller lav", points: 1 },
      { value: "plat", label: "Lösa eller rostiga plåtdetaljer", points: 1 },
      { value: "istappar", label: "Mycket istappar vintertid", points: 1 },
      { value: "inget", label: "Inget av detta", points: 0 },
    ],
  },
  {
    id: "besiktning",
    fraga: "När besiktigades taket senast?",
    typ: "single",
    icon: Search,
    options: [
      { value: "aldrig", label: "Aldrig", points: 1 },
      { value: ">5", label: "För mer än 5 år sedan", points: 1 },
      { value: "nyligen", label: "Nyligen", points: 0 },
    ],
  },
];

type Answers = {
  adress?: string;
  takform?: string;
  alder?: string;
  material?: string;
  byggar?: string;
  brister: string[];
  besiktning?: string;
};

const EMPTY: Answers = { brister: [] };

// ──────────────────────────────────────────────────────────
// Poäng + resultat
// ──────────────────────────────────────────────────────────

function optionLabel(id: StepId, value?: string): string {
  if (!value) return "–";
  const step = STEPS.find((s) => s.id === id);
  return step?.options.find((o) => o.value === value)?.label ?? value;
}

function scoreAnswers(a: Answers): number {
  const single = (id: StepId, value?: string): number => {
    const step = STEPS.find((s) => s.id === id);
    return step?.options.find((o) => o.value === value)?.points ?? 0;
  };
  let s = 0;
  s += single("alder", a.alder);
  s += single("material", a.material);
  s += single("byggar", a.byggar);
  s += single("besiktning", a.besiktning);
  const bristerStep = STEPS.find((st) => st.id === "brister")!;
  for (const t of a.brister) {
    s += bristerStep.options.find((o) => o.value === t)?.points ?? 0;
  }
  return s;
}

type Niva = {
  key: "hog" | "medel" | "lag";
  label: string;
  rubrik: string;
  text: string;
  color: string;
  bg: string;
};

function nivaFor(score: number): Niva {
  if (score >= 7) {
    return {
      key: "hog",
      label: "Hög angelägenhet",
      rubrik: "Ditt tak visar flera tecken på att det snart behöver bytas",
      text: "Flera av dina svar pekar på slitage som brukar innebära att ett takbyte närmar sig. Vi rekommenderar att du bokar en kostnadsfri takkontroll snart, så får du ett tydligt besked och ett fast pris innan eventuella skador hinner växa.",
      color: "#C2410C",
      bg: "rgba(234,88,12,0.10)",
    };
  }
  if (score >= 3) {
    return {
      key: "medel",
      label: "Håll koll",
      rubrik: "Håll koll på taket, boka gärna en kostnadsfri takkontroll",
      text: "Taket visar vissa tecken på slitage men inget akut utifrån dina svar. En kostnadsfri takkontroll ger dig svart på vitt på skicket och hur många år taket har kvar, så du kan planera i lugn och ro.",
      color: "#B45309",
      bg: "rgba(217,119,6,0.10)",
    };
  }
  return {
    key: "lag",
    label: "Verkar i skick",
    rubrik: "Taket verkar vara i hyfsat skick",
    text: "Utifrån dina svar ser taket ut att vara i rimligt skick. En kostnadsfri takkontroll är ändå ett bra sätt att få det bekräftat, och att fånga små saker innan de blir dyra.",
    color: "#15803D",
    bg: "rgba(22,163,74,0.10)",
  };
}

function buildInsikter(a: Answers): string[] {
  const out: string[] = [];
  if (a.material === "eternit")
    out.push(
      "Eternit innehåller asbest och får bara hanteras av certifierad saneringspersonal. Vid ett takbyte sköter vi hela saneringen enligt gällande regler."
    );
  if (a.byggar === "1950-69" || a.byggar === "<1950")
    out.push(
      "Hus från den här tiden har ofta kvar sin ursprungliga underlagspapp. Även när takpannorna ser hela ut är det pappen under som avgör om taket är tätt, och den har oftast passerat sin livslängd."
    );
  if (a.brister.includes("fukt") || a.brister.includes("lackage"))
    out.push(
      "Fuktfläckar och läckage tyder på att vatten redan tagit sig förbi tätskiktet. Ju längre det fortgår desto större blir risken för röt- och mögelskador i konstruktionen."
    );
  if (a.brister.includes("svackor"))
    out.push(
      "Hängande partier eller svackor kan bero på att bärläkt eller underliggande trä försvagats. Det bör bedömas på plats så snart som möjligt."
    );
  if (a.brister.includes("istappar"))
    out.push(
      "Mycket istappar kan vara ett tecken på bristande ventilation eller isolering i taket, något som är värt att titta på i samband med en takkontroll."
    );
  if (a.brister.includes("mossa") || a.brister.includes("spruckna"))
    out.push(
      "Mossa och spruckna pannor släpper in fukt som fryser och spränger materialet vidare. Det går ofta att åtgärda, men bör kollas innan det sprider sig."
    );
  if (a.alder === "30+")
    out.push(
      "Ett tak som passerat 30 år närmar sig, eller har nått, slutet av sin tekniska livslängd oavsett material."
    );
  if (a.besiktning === "aldrig" || a.besiktning === ">5")
    out.push(
      "Taket har inte besiktigats på länge. En kostnadsfri takkontroll ger dig en tydlig bild av skicket utan gissningar."
    );
  return out;
}

// ──────────────────────────────────────────────────────────
// GA4
// ──────────────────────────────────────────────────────────

type GtagFn = (event: string, name: string, params: object) => void;
function fireGtag(name: string, params: object) {
  if (typeof window === "undefined" || !("gtag" in window)) return;
  (window as unknown as { gtag: GtagFn }).gtag("event", name, {
    event_category: "engagement",
    event_label: "taktest",
    ...params,
  });
}

const BG = "/images/bromma-tak-hero.jpg";

// ──────────────────────────────────────────────────────────
// Komponent
// ──────────────────────────────────────────────────────────

export default function Taktest() {
  // -1 = startvyn (adress), 0..n = frågor
  const [stepIndex, setStepIndex] = useState(-1);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [done, setDone] = useState(false);
  const startedRef = useRef(false);

  const totalFragor = STEPS.length;
  const onStart = stepIndex === -1;
  const step = onStart ? null : STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const progress = done
    ? 100
    : onStart
      ? 0
      : Math.round((stepIndex / totalFragor) * 100);

  function ensureStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    fireGtag("taktest_start", {});
  }

  function finish(next: Answers) {
    const score = scoreAnswers(next);
    const niva = nivaFor(score);
    fireGtag("taktest_complete", { score, niva: niva.key });
    setDone(true);
  }

  function beginTest() {
    ensureStarted();
    setStepIndex(0);
  }

  function selectSingle(value: string) {
    if (!step) return;
    const next = { ...answers, [step.id]: value } as Answers;
    setAnswers(next);
    fireGtag("taktest_step", { step: stepIndex + 1, step_id: step.id });
    if (isLast) finish(next);
    else setStepIndex((i) => i + 1);
  }

  function toggleMulti(value: string) {
    if (!step) return;
    setAnswers((prev) => {
      if (value === "inget") return { ...prev, brister: ["inget"] };
      const set = new Set(prev.brister.filter((v) => v !== "inget"));
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, brister: [...set] };
    });
  }

  function goNextMulti() {
    if (!step) return;
    fireGtag("taktest_step", { step: stepIndex + 1, step_id: step.id });
    if (isLast) finish(answers);
    else setStepIndex((i) => i + 1);
  }

  function goBack() {
    if (onStart) return;
    if (stepIndex === 0) setStepIndex(-1);
    else setStepIndex((i) => i - 1);
  }

  function restart() {
    setAnswers(EMPTY);
    setStepIndex(-1);
    setDone(false);
    startedRef.current = false;
  }

  return (
    <section className="relative overflow-hidden">
      {/* Bakgrund */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,18,32,0.72) 0%, rgba(11,18,32,0.62) 45%, rgba(11,18,32,0.78) 100%)",
        }}
        aria-hidden
      />

      <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-14 lg:py-20">
        <div className="w-full max-w-2xl">
          {/* Progress (dölj på startvyn) */}
          {!onStart && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                  {done ? "Klart" : `Fråga ${stepIndex + 1} av ${totalFragor}`}
                </span>
                <span className="text-xs font-semibold text-white/70">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, backgroundColor: "#2B74FC" }}
                />
              </div>
            </div>
          )}

          {/* Glascard */}
          <div className="rounded-[28px] bg-white/95 backdrop-blur-md shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)] border border-white/40 p-6 sm:p-9 lg:p-10">
            {done
              ? <ResultView answers={answers} onRestart={restart} />
              : onStart
                ? (
                    <StartView
                      adress={answers.adress ?? ""}
                      onAdress={(v) =>
                        setAnswers((p) => ({ ...p, adress: v }))
                      }
                      onStart={beginTest}
                    />
                  )
                : (
                    <QuestionView
                      step={step!}
                      answers={answers}
                      stepIndex={stepIndex}
                      onSingle={selectSingle}
                      onToggle={toggleMulti}
                      onNextMulti={goNextMulti}
                      onBack={goBack}
                      isLast={isLast}
                    />
                  )}
          </div>

          {/* Fot: trygghetsrad */}
          {!done && (
            <p className="mt-5 text-center text-xs text-white/70">
              Kostnadsfritt · Tar under 1 minut · Ingen förpliktelse
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

// ──────────────────────────────────────────────────────────
// Delvyer
// ──────────────────────────────────────────────────────────

function StartView({
  adress,
  onAdress,
  onStart,
}: {
  adress: string;
  onAdress: (v: string) => void;
  onStart: () => void;
}) {
  return (
    <div className="text-center">
      <p
        className="text-xs font-semibold uppercase tracking-[0.16em] mb-3"
        style={{ color: "var(--color-primary)" }}
      >
        Kostnadsfritt taktest
      </p>
      <h1
        className="text-[26px] sm:text-[32px] lg:text-[38px] font-extrabold tracking-[-0.02em] leading-tight mb-3"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
      >
        Är det dags för takbyte?
      </h1>
      <p className="text-gray-600 leading-relaxed max-w-md mx-auto mb-7">
        Svara på några snabba frågor om ditt tak, så får du en personlig
        bedömning av skicket och hur bråttom det är. Helt kostnadsfritt.
      </p>

      <div className="max-w-md mx-auto text-left">
        <label className="block text-xs font-semibold mb-1.5 text-gray-500">
          Din adress <span className="text-gray-400 font-normal">(valfritt)</span>
        </label>
        <div className="relative">
          <MapPin
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={adress}
            onChange={(e) => onAdress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onStart()}
            placeholder="Testvägen 12, 123 45 Stockholm"
            className="w-full pl-10 pr-4 py-3.5 rounded-xl text-sm outline-none border border-gray-200 bg-[#F6F8FB] focus:border-[#2B74FC] focus:bg-white transition-colors"
          />
        </div>

        <button
          onClick={onStart}
          className="mt-4 w-full py-4 rounded-xl text-white font-semibold text-[15px] transition-all hover:scale-[1.01]"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Sätt igång
        </button>
        <p className="mt-3 text-center text-[11px] text-gray-400">
          Vi använder adressen enbart för att förbereda din takkontroll.
        </p>
      </div>
    </div>
  );
}

function QuestionView({
  step,
  answers,
  stepIndex,
  onSingle,
  onToggle,
  onNextMulti,
  onBack,
  isLast,
}: {
  step: Step;
  answers: Answers;
  stepIndex: number;
  onSingle: (v: string) => void;
  onToggle: (v: string) => void;
  onNextMulti: () => void;
  onBack: () => void;
  isLast: boolean;
}) {
  const Icon = step.icon;
  const multiSelected = step.typ === "multi" ? answers.brister : [];
  const singleSelected = answers[step.id] as string | undefined;
  const layout = step.layout ?? "list";

  const isSelected = (value: string) =>
    step.typ === "multi"
      ? multiSelected.includes(value)
      : singleSelected === value;

  return (
    <div key={step.id} className="animate-[fadeIn_0.25s_ease]">
      {/* Fråga */}
      <div className="flex items-start gap-3.5 mb-6">
        <div
          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
          style={{
            backgroundColor: "rgba(43,116,252,0.08)",
            color: "var(--color-primary)",
          }}
        >
          <Icon size={19} />
        </div>
        <div>
          <h2
            className="text-[21px] lg:text-[25px] font-extrabold tracking-[-0.02em] leading-tight"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
          >
            {step.fraga}
          </h2>
          {step.hjalp && (
            <p className="text-sm text-gray-500 mt-1">{step.hjalp}</p>
          )}
        </div>
      </div>

      {/* Alternativ */}
      {layout === "cards" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {step.options.map((o) => (
            <button
              key={o.value}
              onClick={() => onSingle(o.value)}
              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-all ${
                isSelected(o.value)
                  ? "border-[#2B74FC] bg-[rgba(43,116,252,0.05)]"
                  : "border-gray-200 bg-white hover:border-[#2B74FC]/50"
              }`}
            >
              <span
                style={{
                  color: isSelected(o.value)
                    ? "var(--color-primary)"
                    : "#64748B",
                }}
              >
                {o.illustration}
              </span>
              <span
                className="text-[13px] font-semibold text-center"
                style={{ color: "var(--color-dark)" }}
              >
                {o.label}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5"
              : "grid grid-cols-1 sm:grid-cols-2 gap-2.5"
          }
        >
          {step.options.map((o) => (
            <button
              key={o.value}
              onClick={() =>
                step.typ === "multi" ? onToggle(o.value) : onSingle(o.value)
              }
              className={`flex items-center justify-between gap-3 text-left rounded-xl border p-3.5 transition-all ${
                isSelected(o.value)
                  ? "border-[#2B74FC] bg-[rgba(43,116,252,0.05)]"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span
                className="text-[14px] font-medium"
                style={{ color: "var(--color-dark)" }}
              >
                {o.label}
              </span>
              <span
                className={`shrink-0 flex items-center justify-center ${
                  step.typ === "multi"
                    ? "w-5 h-5 rounded-[6px] border-2"
                    : "w-5 h-5 rounded-full border-2"
                } ${isSelected(o.value) ? "border-[#2B74FC] bg-[#2B74FC]" : "border-gray-300"}`}
              >
                {isSelected(o.value) &&
                  (step.typ === "multi" ? (
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2.5 6.5 5 9l4.5-5"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  ))}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Navigering */}
      <div className="flex items-center justify-between mt-7">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={15} />
          Tillbaka
        </button>

        {step.typ === "multi" && (
          <button
            onClick={onNextMulti}
            disabled={multiSelected.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {isLast ? "Se resultat" : "Nästa"}
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function ResultView({
  answers,
  onRestart,
}: {
  answers: Answers;
  onRestart: () => void;
}) {
  const score = scoreAnswers(answers);
  const niva = nivaFor(score);
  const insikter = buildInsikter(answers);
  const payload: Record<string, string> = {
    taktest_niva: niva.label,
    taktest_score: String(score),
    taktest_adress: answers.adress?.trim() || "Ej angiven",
    taktest_takform: optionLabel("takform", answers.takform),
    taktest_alder: optionLabel("alder", answers.alder),
    taktest_material: optionLabel("material", answers.material),
    taktest_byggar: optionLabel("byggar", answers.byggar),
    taktest_brister:
      answers.brister.length > 0
        ? answers.brister.map((v) => optionLabel("brister", v)).join(", ")
        : "Inga angivna",
    taktest_besiktning: optionLabel("besiktning", answers.besiktning),
  };

  return (
    <div>
      {/* Resultatkort */}
      <div className="rounded-2xl p-6" style={{ backgroundColor: niva.bg }}>
        <span
          className="inline-block text-xs font-bold uppercase tracking-[0.12em] mb-3 px-3 py-1 rounded-full bg-white/80"
          style={{ color: niva.color }}
        >
          {niva.label}
        </span>
        <h2
          className="text-[22px] lg:text-[27px] font-extrabold tracking-[-0.02em] mb-2.5 leading-tight"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
        >
          {niva.rubrik}
        </h2>
        <p className="text-gray-700 leading-relaxed text-[15px]">{niva.text}</p>
      </div>

      {/* Insikter */}
      {insikter.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-3">
            Det här sticker ut i dina svar
          </h3>
          <ul className="space-y-2.5">
            {insikter.map((text, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-[#F8F9FB] p-3.5"
              >
                <Info
                  size={17}
                  className="shrink-0 mt-0.5"
                  style={{ color: "var(--color-primary)" }}
                />
                <p className="text-[13.5px] text-gray-700 leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-5 text-xs text-gray-400 leading-relaxed">
        Taktestet ger en fingervisning utifrån dina svar och ersätter inte en
        fysisk besiktning. En kostnadsfri takkontroll på plats ger dig ett säkert
        besked.
      </p>

      {/* Lead-capture */}
      <div className="mt-7">
        <LeadForm
          variant="section"
          formId="taktest"
          extraPayload={payload}
          ctaText="Boka kostnadsfri takkontroll"
          confirmation={`Ditt resultat: ${niva.label}`}
          hideHeader
          notBindingNote
          privacyNote
        />
      </div>

      <button
        onClick={onRestart}
        className="mt-5 mx-auto flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#2B74FC] transition-colors"
      >
        <RotateCcw size={14} />
        Gör om testet
      </button>
    </div>
  );
}
