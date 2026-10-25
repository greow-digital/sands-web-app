import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUp, CheckCircle, Clock, ShieldCheck, Star, Wallet } from "lucide-react";
import { Etikett, Fragor, Garantiband, Omdomen, Rubrik2, Tidslinje } from "@/components/Byggblock";
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

/*
  Annonslandningssida för kampanjen Takläggning Stockholm, för A/B-test mot
  startsidan (beslut 19 okt 2026). Noindex och inte i sitemap.

  Struktur, i den ordning besökarens frågor kommer:
  1. Är jag på rätt ställe? Rubriken speglar sökordet (varianten i URL:en).
  2. Hur får jag ett pris? Tre frågor, sedan en gratis offert med fast pris.
     Inget riktpris på sidan (beslut 20 okt 2026): ett spann besvarar det
     offerten ska besvara och tar bort skälet att skicka in.
  3. Kan jag lita på dem? Betyg i första skärmen, sedan före och efter,
     omdömen och garantier.
  4. Hur går det till? Tidslinje och FAQ om det som brukar oroa.
  En enda konverteringspunkt, frågeflödet i heron. Enda länken ut är
  loggan (till startsidan) och integritetspolicyn. Allt längre ner leder
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
      "Byta tak eller lägga om tak i Stockholm. Gratis offert med fast pris efter kostnadsfri takkontroll och upp till 30 års garanti.",
    robots: { index: false, follow: false },
  };
}

const TIDSLINJE = [
  { rubrik: "Gratis offert", text: "Du svarar på tre frågor och lämnar namn och nummer. Vi hör av oss inom 24 timmar." },
  { rubrik: "Kostnadsfri takkontroll", text: "Vi går upp på taket och bedömer skicket tillsammans med dig." },
  { rubrik: "Fast pris i skriftlig offert", text: "ROT-avdraget är inräknat. Säger du nej kostar det ingenting." },
  { rubrik: "Nytt tak på 1–2 veckor", text: "För en normalvilla, beroende på väder och takets skick." },
];

const FAQ = [
  {
    q: "Kostar offerten eller takkontrollen något?",
    a: "Nej. Både offerten och takkontrollen är kostnadsfria och utan förpliktelser. Du bestämmer dig först när du har det fasta priset framför dig.",
  },
  {
    q: "Vad händer när jag har skickat in?",
    a: "Vi hör av oss inom 24 timmar och bokar en tid för en kostnadsfri takkontroll. Vi går upp på taket och ser skicket på underlaget, sedan får du en skriftlig offert med fast pris där ROT-avdraget är inräknat.",
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
    a: "Med ett komplett Monier-taksystem får du Moniers Tätt tak-garanti i upp till 30 år. Garantibeviset registreras digitalt och kan alltid tas fram med ditt offertnummer.",
  },
];

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
            {/* Ingen meny: logga och betyg. Loggan länkar till startsidan
                (beslut 19 okt 2026), så att den som vill kontrollera vem
                som står bakom sidan kan göra det. */}
            <div className="flex items-center justify-between mb-5 lg:mb-14">
              <Link href="/" aria-label="Sands Entreprenad, till startsidan">
                <Image
                  src="/images/logo-sandsentreprenad.svg"
                  alt="Sands Entreprenad"
                  width={180}
                  height={32}
                  className="h-6 lg:h-7 w-auto brightness-0 invert"
                />
              </Link>
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
                  Svara på tre frågor och få en gratis offert med fast pris,
                  helt utan förpliktelser.
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
        <Omdomen urval={startsidaTestimonials} />

        {/* ── GARANTI ─────────────────────────────────── */}
        <Garantiband className="pt-14 lg:pt-24" />

        {/* ── SÅ GÅR DET TILL ─────────────────────────── */}
        <section className="py-14 lg:py-24">
          <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-16">
            <div>
              <Etikett>Så går det till</Etikett>
              <Rubrik2>Från offert till nytt tak, utan krångel</Rubrik2>
            </div>
            <Tidslinje steg={TIDSLINJE} />
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────── */}
        <section className="pb-14 lg:pb-24">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Rubrik2>Vanliga frågor</Rubrik2>
            </div>
            <Fragor fragor={FAQ} />
          </div>
        </section>

        {/* ── SLUT ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 pb-14 lg:pb-24">
          <div
            className="max-w-[1120px] mx-auto rounded-[32px] p-8 lg:p-14 text-center"
            style={{ background: "linear-gradient(135deg, #2B74FC 0%, #1A4FCC 100%)" }}
          >
            <Rubrik2 ljus>Få din gratis offert</Rubrik2>
            <p className="text-white/80 mt-3 max-w-md mx-auto">
              Tre frågor, 30 sekunder. Fast pris efter kostnadsfri
              takkontroll, helt utan förpliktelser.
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
