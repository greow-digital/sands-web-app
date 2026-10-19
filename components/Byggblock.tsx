import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import {
  AVG_RATING,
  PLATFORM_STATS,
  SOURCE_META,
  TOTAL_REVIEWS,
  type Testimonial,
} from "@/lib/testimonials";
import {
  FLAGGSKEPP_KVM,
  FLAGGSKEPP_PRIS,
  MATERIAL,
  RIKTPRIS_NOT,
} from "@/lib/material";

/*
  Gemensamma byggblock för startsidan och annonslandningssidorna under /lp
  (19 okt 2026). Landningssidan byggdes först och fick det uttryck vi vill
  ha, så blocken är lyfta därifrån. Sidan äger sina <section>-ramar och
  bakgrunder; blocken här är innehållet, utom omdömen och garantibandet
  som alltid ser likadana ut.
*/

const kr = (n: number) => n.toLocaleString("sv-SE");

export function Stjarnor({ storlek = 14 }: { storlek?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={storlek} className="fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  );
}

export function Rubrik2({ children, ljus = false }: { children: ReactNode; ljus?: boolean }) {
  return (
    <h2
      className="text-[30px] lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.08]"
      style={{ fontFamily: "var(--font-heading)", color: ljus ? "#fff" : "var(--color-dark)" }}
    >
      {children}
    </h2>
  );
}

export function Etikett({ children, ljus = false }: { children: ReactNode; ljus?: boolean }) {
  return (
    <p
      className="text-xs font-bold uppercase tracking-[0.16em] mb-2"
      style={{ color: ljus ? "#5B95FF" : "var(--color-primary)" }}
    >
      {children}
    </p>
  );
}

/**
 * Omdömen som svepbar rad på mobil och rutnät på desktop. Utan `rubrik` blir
 * betyget självt rubriken, som på landningssidan. Med `rubrik` står betyget
 * som en rad ovanför, så att startsidan kan behålla sin sökordsrubrik.
 */
export function Omdomen({
  urval,
  rubrik,
  lank = false,
  bred = false,
}: {
  urval: Testimonial[];
  rubrik?: string;
  /** Länk till /omdomen. Av på landningssidorna, som saknar utgångar. */
  lank?: boolean;
  /** Startsidans bredd (1200 px) i stället för landningssidans (1120 px). */
  bred?: boolean;
}) {
  const maxW = bred ? "max-w-[1200px]" : "max-w-[1120px]";
  const betyg = `${AVG_RATING} av 5 från ${TOTAL_REVIEWS} omdömen`;

  return (
    <section className="py-14 lg:py-24 bg-[#F5F7FA]">
      <div className={`${maxW} mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4 mb-7`}>
        <div>
          <div className="flex items-center gap-2.5">
            <Stjarnor storlek={18} />
            {rubrik && <span className="text-sm font-semibold text-gray-600">{betyg}</span>}
          </div>
          <div className="mt-3">
            <Rubrik2>{rubrik ?? betyg}</Rubrik2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PLATFORM_STATS.map((p) => (
            <span
              key={p.source}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SOURCE_META[p.source].color }} />
              {SOURCE_META[p.source].label} {p.snitt} · {p.antal} st
            </span>
          ))}
          {lank && (
            <Link
              href="/omdomen"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2B74FC] hover:gap-2.5 transition-all ml-1"
            >
              Se alla omdömen <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>

      {/* data-nosnippet: Google ska inte plocka omdömestext som snippet. */}
      <div className={`${maxW} mx-auto lg:px-8`} data-nosnippet>
        <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 sm:px-6 lg:px-0 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {urval.map((o) => (
            <figure
              key={`${o.name}-${o.datumISO}`}
              className="snap-start shrink-0 w-[84%] sm:w-[46%] lg:w-auto rounded-3xl bg-white p-6 ring-1 ring-gray-100 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] flex flex-col"
            >
              <Stjarnor />
              <blockquote className="text-[15px] text-gray-700 leading-relaxed mt-3 flex-1">
                &ldquo;{o.text}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-end justify-between gap-3">
                <span>
                  <span className="block font-bold text-sm" style={{ color: "var(--color-dark)" }}>{o.name}</span>
                  <span className="block text-xs text-gray-500">
                    {[o.tjanst, o.ort].filter(Boolean).join(" · ")}
                  </span>
                </span>
                <span className="text-[11px] font-semibold" style={{ color: SOURCE_META[o.source].color }}>
                  {SOURCE_META[o.source].label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="lg:hidden text-center text-xs text-gray-400 mt-2">Svep för fler omdömen</p>
      </div>
    </section>
  );
}

/**
 * Prisexemplet med materialpriser till vänster och vad som ingår till höger.
 * Alla siffror kommer från lib/material.ts.
 */
export function Priskort({
  rubrik,
  cta,
  ingarRubrik = "Det här ingår",
  ingar,
  tvaKolumner = true,
  tillagg,
}: {
  rubrik: ReactNode;
  cta: ReactNode;
  ingarRubrik?: string;
  ingar: string[];
  /** Två kolumner passar korta punkter. Längre punkter läses bättre i en. */
  tvaKolumner?: boolean;
  tillagg?: ReactNode;
}) {
  return (
    <div className="rounded-[32px] overflow-hidden ring-1 ring-gray-200 grid lg:grid-cols-2">
      <div className="p-7 lg:p-12">
        {rubrik}
        <p className="text-sm text-gray-500 mt-3">Villa {FLAGGSKEPP_KVM} m², betongpannor, efter ROT</p>
        <p
          className="text-[44px] lg:text-[56px] font-extrabold tracking-[-0.04em] leading-none mt-1 tabular-nums"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
        >
          från {kr(FLAGGSKEPP_PRIS)} kr
        </p>
        <div className="flex flex-wrap gap-2 mt-5">
          {(["betong", "tegel", "plat"] as const).map((m) => (
            <span key={m} className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700">
              {MATERIAL[m].namn} från {kr(MATERIAL[m].prisM2)} kr/m²
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-5 leading-relaxed">{RIKTPRIS_NOT}</p>
        <div className="mt-7">{cta}</div>
      </div>
      <div className="p-7 lg:p-12 bg-[#F5F7FA]">
        <p className="font-bold" style={{ color: "var(--color-dark)" }}>{ingarRubrik}</p>
        <ul className={`grid grid-cols-1 ${tvaKolumner ? "sm:grid-cols-2" : ""} gap-3 mt-4`}>
          {ingar.map((t) => (
            <li key={t} className="flex items-start gap-2.5 text-[15px] text-gray-700">
              <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: "var(--color-primary)" }} />
              {t}
            </li>
          ))}
        </ul>
        {tillagg}
      </div>
    </div>
  );
}

/** Mörkt band med de två garantierna. Siffrorna följer lib/company.ts: "upp till 30 år". */
export function Garantiband({
  bred = false,
  className = "",
  id,
}: {
  bred?: boolean;
  className?: string;
  /** Ankare för länkar hit, t.ex. Ads-länktillägget "30 års garanti" (/#monier). */
  id?: string;
}) {
  return (
    <section id={id} className={`px-4 sm:px-6 lg:px-8 scroll-mt-24 ${className}`}>
      <div
        className={`${bred ? "max-w-[1200px]" : "max-w-[1120px]"} mx-auto rounded-[32px] bg-[#07090D] text-white p-7 lg:p-14 relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(60% 80% at 100% 0%, rgba(43,116,252,0.35), transparent 60%)" }}
        />
        <div className="relative grid lg:grid-cols-[1fr_auto_auto] gap-8 lg:gap-14 items-center">
          <div>
            <Etikett ljus>Trygghet</Etikett>
            <Rubrik2 ljus>Garantier som håller lika länge som taket</Rubrik2>
            <p className="text-gray-400 mt-3 max-w-md">
              Monier-certifierad takläggare. Garantibeviset registreras
              digitalt och kan alltid tas fram med ditt offertnummer.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:contents gap-6">
            <div>
              <p className="text-[52px] lg:text-[72px] font-extrabold leading-none tracking-[-0.04em]" style={{ fontFamily: "var(--font-heading)" }}>
                15 år
              </p>
              <p className="text-sm text-gray-400 mt-1">hantverksgaranti</p>
            </div>
            <div>
              <p className="text-[52px] lg:text-[72px] font-extrabold leading-none tracking-[-0.04em] text-[#7AA9FF]" style={{ fontFamily: "var(--font-heading)" }}>
                30 år
              </p>
              <p className="text-sm text-gray-400 mt-1">upp till, Monier Tätt tak</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Numrerade steg med en linje emellan. Första steget är markerat. */
export function Tidslinje({ steg }: { steg: { rubrik: string; text: string }[] }) {
  return (
    <ol>
      {steg.map((s, i) => (
        <li key={s.rubrik} className="relative flex gap-5 pb-8 last:pb-0">
          {i < steg.length - 1 && (
            <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />
          )}
          <span
            className="relative h-10 w-10 shrink-0 rounded-full text-white font-bold flex items-center justify-center"
            style={{ backgroundColor: i === 0 ? "var(--color-primary)" : "var(--color-dark)" }}
          >
            {i + 1}
          </span>
          <div className="pt-1.5">
            <h3 className="font-bold text-[17px]" style={{ color: "var(--color-dark)" }}>{s.rubrik}</h3>
            <p className="text-[15px] text-gray-600 leading-relaxed mt-1">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Frågor som kort. `oppen` visar alla svar direkt, vilket SEO.md kräver på
 * indexerade sidor. Landningssidorna är noindex och fäller ihop svaren för
 * att hålla sidan kort på mobil.
 */
export function Fragor({ fragor, oppen = false }: { fragor: { q: string; a: string }[]; oppen?: boolean }) {
  if (oppen) {
    return (
      <div className="space-y-3">
        {fragor.map((f) => (
          <div key={f.q} className="rounded-2xl bg-[#F5F7FA] px-5 py-5 lg:px-7 lg:py-6">
            <h3
              className="text-[17px] lg:text-lg font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-dark)" }}
            >
              {f.q}
            </h3>
            <p className="text-[15px] text-gray-600 leading-relaxed mt-2">{f.a}</p>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {fragor.map((f) => (
        <details
          key={f.q}
          className="group rounded-2xl bg-[#F5F7FA] px-5 py-4 open:bg-white open:ring-1 open:ring-gray-200"
        >
          <summary
            className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[15px] [&::-webkit-details-marker]:hidden"
            style={{ color: "var(--color-dark)" }}
          >
            {f.q}
            <span className="text-xl leading-none text-gray-400 transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="text-[15px] text-gray-600 leading-relaxed mt-3">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
