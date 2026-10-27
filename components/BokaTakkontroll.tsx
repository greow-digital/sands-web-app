"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle, Loader2, MapPin, Phone } from "lucide-react";
import { kontaktperson } from "@/lib/company";

type LedigDag = { dag: string; rubrik: string; tider: { start: string; tid: string }[] };

type Lage =
  | { typ: "ingen" }
  | { typ: "laddar" }
  | { typ: "valj" }
  | { typ: "skickar" }
  | { typ: "bokad"; dag: string; tid: string; adress: string }
  | { typ: "ring" };

const NYCKEL = "sands_lead_bokning";
const PREFIX = /^(i dag|i morgon), /;
const versal = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const rubrikStil = { fontFamily: "var(--font-heading)", color: "var(--color-dark)" };

function glomBiljett() {
  try {
    sessionStorage.removeItem(NYCKEL);
  } catch {}
}

/** Utan bokning (kalendern nere, inga tider): visa den vanliga tacksidan. */
function tillbakaTillTack() {
  glomBiljett();
  document.querySelector(".tack-sida")?.removeAttribute("data-bokning");
}

/**
 * /tack i bokningsläge, efter offertflödet på landningssidorna. Leadet är
 * redan skickat och konverteringen registrerad när den visas. Att boka är
 * huvudsaken, att bli uppringd är andrahandsvalet. Syns bara när /api/lead
 * lämnat en biljett (kalendern inställd); skriptet på /tack sätter
 * data-bokning på omslaget .tack-sida innan sidan ritas, och då döljs tackdelen.
 */
export default function BokaTakkontroll() {
  const [biljett, setBiljett] = useState<string | null>(null);
  const [dagar, setDagar] = useState<LedigDag[]>([]);
  const [vald, setVald] = useState(0);
  const [tid, setTid] = useState<{ start: string; tid: string } | null>(null);
  const [adress, setAdress] = useState("");
  const [lage, setLage] = useState<Lage>({ typ: "laddar" });
  const [fel, setFel] = useState("");

  const hamta = (b: string) =>
    fetch(`/api/boka?biljett=${encodeURIComponent(b)}`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null) as Promise<{ dagar?: LedigDag[] } | null>;

  useEffect(() => {
    let b: string | null = null;
    try {
      b = sessionStorage.getItem(NYCKEL);
    } catch {}
    // Utan biljett döljer CSS:en sektionen (inget data-bokning på omslaget).
    if (!b) return;
    hamta(b).then((d) => {
      if (!d?.dagar?.length) {
        tillbakaTillTack();
        return setLage({ typ: "ingen" });
      }
      setBiljett(b);
      setDagar(d.dagar);
      setLage({ typ: "valj" });
    });
  }, []);

  const skicka = (body: object) =>
    fetch("/api/boka", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ biljett, ...body }) })
      .then(async (res) => ({ ok: res.ok, data: await res.json().catch(() => null) }))
      .catch(() => ({ ok: false, data: null }));

  const boka = async () => {
    if (!tid || !adress.trim()) return;
    setFel("");
    setLage({ typ: "skickar" });
    const r = await skicka({ start: tid.start, adress });
    if (!r.ok) {
      setFel(r.data?.error ?? "Vi kunde inte boka just nu. Vi ringer dig inom 24 timmar i stället.");
      setLage({ typ: "valj" });
      // Tiden kan ha blivit upptagen, läs om listan.
      const d = biljett ? await hamta(biljett) : null;
      if (d?.dagar?.length) {
        setDagar(d.dagar);
        setTid(null);
      }
      return;
    }
    glomBiljett();
    setLage({ typ: "bokad", dag: r.data.dag, tid: r.data.tid, adress: adress.trim() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ring = async () => {
    setFel("");
    setLage({ typ: "skickar" });
    await skicka({ ring: true });
    glomBiljett();
    setLage({ typ: "ring" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (lage.typ === "ingen") return null;

  if (lage.typ === "bokad" || lage.typ === "ring") {
    const bokad = lage.typ === "bokad";
    return (
      <section className="tack-bokning py-16 lg:py-24" data-testid="boka-takkontroll">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-7" style={{ backgroundColor: "rgba(43,116,252,0.08)" }}>
            {bokad ? <CalendarCheck size={38} style={{ color: "var(--color-primary)" }} /> : <Phone size={34} style={{ color: "var(--color-primary)" }} />}
          </div>
          <h1 className="text-[32px] lg:text-[44px] font-extrabold tracking-[-0.03em] leading-tight" style={rubrikStil}>
            {bokad ? "Din takkontroll är bokad" : "Vi ringer upp dig"}
          </h1>
          {bokad ? (
            <>
              <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 text-left">
                <p className="flex items-center gap-3 text-lg font-bold" style={{ color: "var(--color-dark)" }}>
                  <CalendarCheck size={20} style={{ color: "var(--color-primary)" }} />
                  {versal(lage.dag)} kl {lage.tid}
                </p>
                <p className="mt-2 flex items-center gap-3 text-gray-600">
                  <MapPin size={20} className="shrink-0" style={{ color: "var(--color-primary)" }} />
                  {lage.adress}
                </p>
              </div>
              <p className="mt-5 text-gray-600 leading-relaxed">
                Vi kommer ut, går upp på taket och bedömer skicket. Efter besöket får du ett skriftligt prisförslag. Behöver du ändra tiden, ring{" "}
                {kontaktperson.fornamn} på{" "}
                <a href={kontaktperson.telefonHref} className="font-semibold whitespace-nowrap" style={{ color: "var(--color-primary)" }}>
                  {kontaktperson.telefonDisplay}
                </a>
                .
              </p>
            </>
          ) : (
            <p className="mt-5 text-lg text-gray-600 leading-relaxed">
              Tack för din förfrågan. Vi hör av oss inom 24 timmar och bokar en kostnadsfri takkontroll på en tid som passar dig.
            </p>
          )}
        </div>
      </section>
    );
  }

  const dag = dagar[vald];
  const skickar = lage.typ === "skickar";

  return (
    <section className="tack-bokning pt-10 pb-16 lg:pt-16 lg:pb-24" style={{ background: "linear-gradient(180deg, #F5F8FF 0%, #FFFFFF 420px)" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold shadow-sm ring-1 ring-gray-200" style={{ color: "var(--color-dark)" }}>
            <CheckCircle size={15} className="text-[#085B69]" /> Din förfrågan är mottagen
          </span>
          <h1 className="mt-5 text-[30px] sm:text-[38px] lg:text-[46px] font-extrabold tracking-[-0.03em] leading-[1.08]" style={rubrikStil}>
            Välj en tid för din kostnadsfria takkontroll
          </h1>
          <p className="mt-3 text-[16px] lg:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
            Vi kommer ut, går upp på taket och bedömer skicket. Efter besöket får du ett skriftligt prisförslag.
          </p>
        </div>

        <div className="mt-7 lg:mt-9 rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-[0_12px_40px_rgba(6,6,7,0.08)]" data-testid="boka-takkontroll">
          {lage.typ === "laddar" ? (
            <div className="space-y-4" aria-busy>
              <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="h-[72px] w-[68px] shrink-0 animate-pulse rounded-2xl bg-gray-100" />
                ))}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {Array.from({ length: 9 }, (_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
              <p className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 size={16} className="animate-spin" /> Hämtar lediga tider...
              </p>
            </div>
          ) : (
            <>
              <p className="mb-2.5 text-sm font-bold" style={{ color: "var(--color-dark)" }}>
                1. Välj dag
              </p>
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {dagar.map((d, i) => {
                  const [vd, nr, man] = d.rubrik.replace(PREFIX, "").split(" ");
                  const aktiv = i === vald;
                  return (
                    <button
                      key={d.dag}
                      type="button"
                      onClick={() => {
                        setVald(i);
                        setTid(null);
                      }}
                      aria-pressed={aktiv}
                      className={`flex h-[72px] w-[68px] shrink-0 flex-col items-center justify-center rounded-2xl border transition-colors ${
                        aktiv ? "border-transparent text-white" : "border-gray-200 hover:border-[#2B74FC]"
                      }`}
                      style={aktiv ? { backgroundColor: "var(--color-primary)" } : { color: "var(--color-dark)" }}
                    >
                      <span className={`text-[11px] font-semibold uppercase ${aktiv ? "text-white/80" : "text-gray-500"}`}>{vd}</span>
                      <span className="text-xl font-extrabold leading-tight">{nr}</span>
                      <span className={`text-[11px] ${aktiv ? "text-white/80" : "text-gray-500"}`}>{man}</span>
                    </button>
                  );
                })}
              </div>

              {dag && (
                <>
                  <p className="mt-5 mb-2.5 text-sm font-bold" style={{ color: "var(--color-dark)" }}>
                    2. Välj tid <span className="font-normal text-gray-500">({versal(dag.rubrik)})</span>
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {dag.tider.map((t) => {
                      const aktiv = tid?.start === t.start;
                      return (
                        <button
                          key={t.start}
                          type="button"
                          onClick={() => setTid(t)}
                          aria-pressed={aktiv}
                          className={`rounded-xl border py-3 text-[15px] font-semibold tabular-nums transition-colors ${
                            aktiv ? "border-transparent text-white" : "border-gray-200 hover:border-[#2B74FC]"
                          }`}
                          style={aktiv ? { backgroundColor: "var(--color-primary)" } : { color: "var(--color-dark)" }}
                        >
                          {t.tid}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {tid && (
                <form
                  className="mt-5 space-y-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    boka();
                  }}
                >
                  <label className="block text-sm font-bold" style={{ color: "var(--color-dark)" }}>
                    3. Adress för besöket
                    <input
                      required
                      value={adress}
                      onChange={(e) => setAdress(e.target.value)}
                      autoComplete="street-address"
                      placeholder="Gata, ort"
                      className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-base font-normal outline-none focus:border-[#2B74FC]"
                    />
                  </label>
                  <button
                    disabled={skickar}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-base font-semibold text-white shadow-lg shadow-[#2B74FC]/25 transition-transform hover:scale-[1.01] disabled:opacity-60"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {skickar ? <Loader2 size={18} className="animate-spin" /> : <CalendarCheck size={18} />}
                    {skickar ? "Bokar..." : `Boka ${dag?.rubrik.replace(PREFIX, "")} kl ${tid.tid}`}
                  </button>
                </form>
              )}

              {fel && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{fel}</p>}
            </>
          )}
        </div>

        <p className="mt-4 text-center text-[13px] text-gray-500">Kostnadsfritt · Utan förpliktelser</p>

        <div className="mt-8 text-center">
          <p className="text-[15px] text-gray-600">Passar ingen av tiderna?</p>
          <button
            type="button"
            onClick={ring}
            disabled={skickar || lage.typ === "laddar"}
            className="mt-2 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-[15px] font-semibold transition-colors hover:border-[#2B74FC] disabled:opacity-60"
            style={{ color: "var(--color-dark)" }}
          >
            <Phone size={16} /> Jag föredrar att ni ringer upp mig
          </button>
        </div>
      </div>
    </section>
  );
}
