import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUp, CheckCircle, Clock, ShieldCheck, Star, Wallet } from "lucide-react";
import LpQuiz, { type Arende } from "@/components/LpQuiz";
import LpStickyCta from "@/components/LpStickyCta";
import ForeEfter from "@/components/ForeEfter";
import {
  AVG_RATING,
  PLATFORM_STATS,
  SOURCE_META,
  TOTAL_REVIEWS,
  startsidaTestimonials,
} from "@/lib/testimonials";
import { company, nap, stats, telefon } from "@/lib/company";
import { FLAGGSKEPP_KVM, FLAGGSKEPP_PRIS, MATERIAL } from "@/lib/material";

/*
  Annonslandningssida för kampanjen Takläggning Stockholm, för A/B-test mot
  startsidan (beslut 19 okt 2026). Noindex och inte i sitemap.

  Struktur, i den ordning besökarens frågor kommer:
  1. Är jag på rätt ställe? Rubriken speglar sökordet (varianten i URL:en).
  2. Vad kostar det? Frågeflödet ger ett riktpris efter tre knapptryck.
  3. Kan jag lita på dem? Betyg i första skärmen, sedan före och efter,
     omdömen, pris och garantier.
  4. Hur går det till? Tidslinje och FAQ om det som brukar oroa.
  En enda konverteringspunkt, frågeflödet i heron. Allt längre ner leder
  tillbaka dit, och den fasta knappen på mobil minns var besökaren var.
*/

type Variant = { sokord: string; h1: string; forval?: Arende };

const VARIANTER: Record<string, Variant> = {
  taklaggare: { sokord: "takläggare", h1: "Takläggare i Stockholm" },
  takfirma: { sokord: "takfirma", h1: "Takfirma i Stockholm" },
  takbyte: { sokord: "takbyte", h1: "Takbyte i Stockholm", forval: "byta" },
  "byta-tak": { sokord: "byta tak", h1: "Byta tak i Stockholm", forval: "byta" },
  "nytt-tak": { sokord: "nytt tak", h1: "Nytt tak i Stockholm", forval: "byta" },
  "lagga-om-tak": { sokord: "lägga om tak", h1: "Lägga om tak i Stockholm", forval: "lagga-om" },
  takomlaggning: { sokord: "takomläggning", h1: "Takomläggning i Stockholm", forval: "lagga-om" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VARIANTER).map((variant) => ({ variant }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}): Promise<Metadata> {
  const v = VARIANTER[(await params).variant];
  if (!v) return {};
  return {
    title: { absolute: `${v.h1} | Gratis offert | Sands` },
    description:
      "Byta tak eller lägga om tak i Stockholm. Se ditt riktpris direkt, fast pris efter kostnadsfri takkontroll och upp till 30 års garanti.",
    robots: { index: false, follow: false },
  };
}

const kr = (n: number) => n.toLocaleString("sv-SE");

const TIDSLINJE = [
  { rubrik: "Gratis offert", text: "Du svarar på tre frågor och lämnar namn och nummer. Vi hör av oss inom 24 timmar." },
  { rubrik: "Kostnadsfri takkontroll", text: "Vi går upp på taket och bedömer skicket tillsammans med dig." },
  { rubrik: "Fast pris i skriftlig offert", text: "ROT-avdraget är inräknat. Säger du nej kostar det ingenting." },
  { rubrik: "Nytt tak på 1–2 veckor", text: "För en normalvilla, beroende på väder och takets skick." },
];

const INGAR = [
  "Rivning och bortforsling",
  "Ny underlagspapp och läkt",
  "Nya takpannor eller plåt",
  "Hängrännor och stuprör",
  "Ställning och container",
  "ROT-ansökan",
];

const FAQ = [
  {
    q: "Kostar offerten eller takkontrollen något?",
    a: "Nej. Både offerten och takkontrollen är kostnadsfria och utan förpliktelser. Du bestämmer dig först när du har det fasta priset framför dig.",
  },
  {
    q: "Hur stämmer riktpriset med det slutliga priset?",
    a: "Riktpriset bygger på takmaterial och husets storlek. Takets form, kupor och skicket på underlaget kan flytta det åt båda hållen, och det ser vi vid takkontrollen. Offerten du får efter kontrollen är ett fast pris.",
  },
  {
    q: "Kan jag använda ROT-avdrag?",
    a: "Ja. ROT-avdraget är 30 % av arbetskostnaden, högst 50 000 kr per person och år, och dras direkt på fakturan. Vi sköter ansökan åt dig.",
  },
  {
    q: "Behöver jag bygglov för att byta tak?",
    a: "För en- och tvåfamiljshus krävs inte bygglov för takbyte sedan 1 december 2025, även om du byter taktyp eller färg. Vi kontrollerar alltid innan vi börjar.",
  },
  {
    q: "Vilken garanti får jag?",
    a: "Vi lämnar 15 års hantverksgaranti på utfört arbete. Med ett komplett Monier-taksystem tillkommer Moniers Tätt tak-garanti i upp till 30 år.",
  },
];

function Stjarnor({ storlek = 14 }: { storlek?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={storlek} className="fill-yellow-400 text-yellow-400" />
      ))}
    </span>
  );
}

function TillFlodet({ text, ljus = false }: { text: string; ljus?: boolean }) {
  return (
    <a
      href="#formular"
      className={`inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-[15px] transition-transform active:scale-[0.98] ${
        ljus ? "bg-white text-gray-900" : "text-white"
      }`}
      style={ljus ? undefined : { backgroundColor: "var(--color-primary)" }}
    >
      {text} <ArrowUp size={16} />
    </a>
  );
}

const Rubrik2 = ({ children, ljus = false }: { children: React.ReactNode; ljus?: boolean }) => (
  <h2
    className="text-[30px] lg:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.08]"
    style={{ fontFamily: "var(--font-heading)", color: ljus ? "#fff" : "var(--color-dark)" }}
  >
    {children}
  </h2>
);

const Etikett = ({ children, ljus = false }: { children: React.ReactNode; ljus?: boolean }) => (
  <p
    className="text-xs font-bold uppercase tracking-[0.16em] mb-2"
    style={{ color: ljus ? "#5B95FF" : "var(--color-primary)" }}
  >
    {children}
  </p>
);

export default async function Landningssida({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const v = VARIANTER[(await params).variant];
  if (!v) notFound();

  return (
    <>
      <main className="bg-white">
        {/* ── HERO ─────────────────────────────────── */}
        <section className="relative overflow-hidden bg-[#07090D]">
          <Image
            src="/images/lp/hero.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 70% at 85% 0%, rgba(43,116,252,0.35) 0%, rgba(7,9,13,0) 55%), linear-gradient(180deg, rgba(7,9,13,0.55) 0%, rgba(7,9,13,0.85) 70%, #07090D 100%)",
            }}
          />

          <div className="relative max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10 lg:pt-6 lg:pb-20">
            {/* Ingen meny och inga länkar ut: logga och betyg */}
            <div className="flex items-center justify-between mb-5 lg:mb-14">
              <Image
                src="/images/logo-sandsentreprenad.svg"
                alt="Sands Entreprenad"
                width={180}
                height={32}
                className="h-6 lg:h-7 w-auto brightness-0 invert"
              />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white ring-1 ring-white/15">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{AVG_RATING}</span>
                <span className="text-gray-300">· {TOTAL_REVIEWS} omdömen</span>
              </span>
            </div>

            <div className="grid lg:grid-cols-[1fr_440px] gap-5 lg:gap-16 items-start">
              <div className="text-white lg:pt-6">
                <h1
                  className="text-[33px] sm:text-[46px] lg:text-[60px] font-extrabold leading-[1.03] tracking-[-0.035em]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {v.h1}{" "}
                  <span className="bg-gradient-to-r from-[#7AA9FF] to-[#2B74FC] bg-clip-text text-transparent">
                    med fast pris
                  </span>
                </h1>
                <p className="text-[15px] sm:text-lg text-gray-300 mt-3 lg:mt-5 leading-relaxed max-w-xl">
                  Se ditt riktpris på 30 sekunder. Sedan kan du begära en gratis
                  offert, helt utan förpliktelser.
                </p>

                <ul className="hidden lg:grid grid-cols-2 gap-x-6 gap-y-3 mt-8 max-w-xl">
                  {[
                    { ikon: ShieldCheck, text: "Upp till 30 års garanti" },
                    { ikon: Wallet, text: "ROT-avdrag direkt på fakturan" },
                    { ikon: Clock, text: "Svar inom 24 timmar" },
                    { ikon: CheckCircle, text: `${stats.tak} tak sedan ${company.grundades}` },
                  ].map(({ ikon: Ikon, text }) => (
                    <li key={text} className="flex items-center gap-2.5 text-[15px] text-gray-200">
                      <Ikon size={18} style={{ color: "#7AA9FF" }} />
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="hidden lg:flex items-center gap-5 mt-10">
                  {PLATFORM_STATS.map((p) => (
                    <div key={p.source} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="h-2 w-2 rounded-full ring-1 ring-white/50" style={{ backgroundColor: SOURCE_META[p.source].color }} />
                      <span>
                        <span className="font-bold text-white">{p.snitt}</span> {SOURCE_META[p.source].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div id="formular" className="scroll-mt-3">
                <LpQuiz sokord={v.sokord} forval={v.forval} />
              </div>
            </div>

            {/* Mobil: löftena under flödet, så att flödet hamnar i första skärmen */}
            <ul className="lg:hidden grid grid-cols-3 gap-2 mt-5 text-center">
              {[
                { ikon: Wallet, text: "ROT direkt på fakturan" },
                { ikon: Clock, text: "Svar inom 24 timmar" },
                { ikon: ShieldCheck, text: "Upp till 30 års garanti" },
              ].map(({ ikon: Ikon, text }) => (
                <li key={text} className="flex flex-col items-center gap-1.5 text-[11px] leading-tight text-gray-300">
                  <Ikon size={18} style={{ color: "#7AA9FF" }} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── FÖRE OCH EFTER ─────────────────────────── */}
        <section className="py-14 lg:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_560px] gap-7 lg:gap-16 items-center">
            <div>
              <Etikett>Före och efter</Etikett>
              <Rubrik2>Från slitet tak till nytt på 1–2 veckor</Rubrik2>
              <p className="text-gray-600 mt-4 leading-relaxed max-w-md">
                Ett takbyte i Bromma, fotograferat med drönare före och efter.
                Dra i reglaget och jämför.
              </p>
            </div>
            <ForeEfter
              fore="/images/lp/bromma-fore.webp"
              efter="/images/lp/bromma-efter.webp"
              alt="Takbyte i Bromma sett från ovan"
              bredd={640}
              hojd={480}
            />
          </div>
        </section>

        {/* ── OMDÖMEN ─────────────────────────────────── */}
        <section className="py-14 lg:py-24 bg-[#F5F7FA]">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-end justify-between gap-4 mb-7">
            <div>
              <Stjarnor storlek={18} />
              <div className="mt-3">
                <Rubrik2>
                  {AVG_RATING} av 5 från {TOTAL_REVIEWS} omdömen
                </Rubrik2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {PLATFORM_STATS.map((p) => (
                <span
                  key={p.source}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SOURCE_META[p.source].color }} />
                  {SOURCE_META[p.source].label} {p.snitt} · {p.antal} st
                </span>
              ))}
            </div>
          </div>

          {/* Svepbar på mobil, rutnät på desktop */}
          <div className="max-w-[1120px] mx-auto lg:px-8">
            <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 px-4 sm:px-6 lg:px-0 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {startsidaTestimonials.map((o) => (
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

        {/* ── PRIS ─────────────────────────────────── */}
        <section className="py-14 lg:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-[32px] overflow-hidden ring-1 ring-gray-200 grid lg:grid-cols-2">
              <div className="p-7 lg:p-12">
                <Etikett>Vad kostar det?</Etikett>
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
                <p className="text-sm text-gray-600 mt-5 leading-relaxed">
                  Riktpriser efter 30 % ROT-avdrag. Du får ett bindande fast pris
                  efter kostnadsfri takkontroll.
                </p>
                <div className="mt-7">
                  <TillFlodet text="Räkna på ditt tak" />
                </div>
              </div>
              <div className="p-7 lg:p-12 bg-[#F5F7FA]">
                <p className="font-bold" style={{ color: "var(--color-dark)" }}>Det här ingår</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {INGAR.map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-[15px] text-gray-700">
                      <CheckCircle size={18} className="shrink-0" style={{ color: "var(--color-primary)" }} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── GARANTI ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1120px] mx-auto rounded-[32px] bg-[#07090D] text-white p-7 lg:p-14 relative overflow-hidden">
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

        {/* ── SÅ GÅR DET TILL ─────────────────────────── */}
        <section className="py-14 lg:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16">
            <div>
              <Etikett>Så går det till</Etikett>
              <Rubrik2>Från offert till nytt tak, utan krångel</Rubrik2>
            </div>
            <ol>
              {TIDSLINJE.map((s, i) => (
                <li key={s.rubrik} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < TIDSLINJE.length - 1 && (
                    <span className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200" aria-hidden="true" />
                  )}
                  <span
                    className="relative h-10 w-10 shrink-0 rounded-full text-white font-bold flex items-center justify-center"
                    style={{ backgroundColor: i === 0 ? "var(--color-primary)" : "var(--color-dark)" }}
                  >
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <p className="font-bold text-[17px]" style={{ color: "var(--color-dark)" }}>{s.rubrik}</p>
                    <p className="text-[15px] text-gray-600 leading-relaxed mt-1">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────── */}
        <section className="pb-14 lg:pb-24">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Rubrik2>Vanliga frågor</Rubrik2>
            </div>
            <div className="space-y-3">
              {FAQ.map((f) => (
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
          </div>
        </section>

        {/* ── SLUT ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-14 lg:pb-24">
          <div
            className="max-w-[1120px] mx-auto rounded-[32px] p-8 lg:p-14 text-center"
            style={{ background: "linear-gradient(135deg, #2B74FC 0%, #1A4FCC 100%)" }}
          >
            <Rubrik2 ljus>Se vad ditt tak kostar</Rubrik2>
            <p className="text-white/80 mt-3 max-w-md mx-auto">
              Tre frågor, 30 sekunder. Sedan kan du begära en gratis offert,
              utan förpliktelser.
            </p>
            <div className="mt-7">
              <TillFlodet text="Starta här" ljus />
            </div>
          </div>
        </section>
      </main>

      {/* Avsändare i stället för sajtens footer: tydligt vem som står bakom
          sidan, men inga länkar ut utöver integritetspolicyn. */}
      <footer className="border-t border-gray-100 py-8 pb-36 md:pb-8">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-500 leading-relaxed text-center">
          <p className="font-semibold text-gray-700">{company.namn}</p>
          <p>
            Org.nr {company.orgNr} · {nap.gata}, {nap.postnr} {nap.ort} ·{" "}
            <a href={telefon.href} className="hover:underline">{telefon.display}</a> ·{" "}
            <a href={`mailto:${nap.email}`} className="hover:underline">{nap.email}</a>
          </p>
          <p className="mt-2">
            <Link href="/integritetspolicy" className="hover:underline">Integritetspolicy</Link>
          </p>
        </div>
      </footer>

      <LpStickyCta betyg={AVG_RATING} antal={TOTAL_REVIEWS} />
    </>
  );
}
