#!/usr/bin/env node
/*
  Sökordsloopen: sorterar sökord från Google Ads mot ads/sokordsregler.mjs
  och skriver ett förslag på negativa sökord. Skriptet ändrar ingenting i
  Google Ads. Förslaget godkänns av Erik och läggs in för hand (via Cogny).

    node scripts/sokordsloop.mjs --sokord <fil> --negativa <fil> [--ut <fil.md>] [--json <fil>]
    node scripts/sokordsloop.mjs --test

  --sokord   JSON: { period, rader: [{ kampanj, annonsgrupp, sokord, visningar, klick, kostnad, konv }] }
  --negativa JSON: { negativa: [{ niva: "kampanj"|"annonsgrupp", kampanj, annonsgrupp, text, typ }] }
             typ är BROAD, PHRASE eller EXACT, som i Google Ads.
  --test     Kontrollerar att reglerna klarar spärrarna. Körs i CI.

  Negativa sökord matchar som i Google Ads, utan närliggande varianter:
    EXACT/EXAKT: samma ord i samma ordning och inga andra.
    PHRASE/FRAS: orden i följd, någonstans i sökningen.
    BROAD:       alla orden finns med, i valfri ordning.
*/
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import * as REGLER from "../ads/sokordsregler.mjs";

const args = process.argv.slice(2);
const arg = (namn) => {
  const i = args.indexOf(namn);
  return i === -1 ? undefined : args[i + 1];
};

// ── Matchning ────────────────────────────────────────────

const ord = (s) => s.toLowerCase().trim().split(/\s+/).filter(Boolean);

/** Stoppar det negativa sökordet sökningen? */
export function stoppar(neg, sokning) {
  const n = ord(neg.text);
  const s = ord(sokning);
  const typ = { EXAKT: "EXACT", FRAS: "PHRASE" }[neg.typ] ?? neg.typ;
  if (typ === "EXACT") return n.length === s.length && n.every((o, i) => o === s[i]);
  if (typ === "BROAD") return n.every((o) => s.includes(o));
  if (typ === "PHRASE") {
    for (let i = 0; i + n.length <= s.length; i++) if (n.every((o, j) => s[i + j] === o)) return true;
    return false;
  }
  throw new Error(`Okänd matchningstyp: ${neg.typ}`);
}

/** Matchar en regel sökningen? Text matchar som hela ord, ett reguljärt uttryck som det står. */
function matchar(monster, sokning) {
  if (monster instanceof RegExp) return monster.test(sokning.toLowerCase());
  return stoppar({ text: monster, typ: "PHRASE" }, sokning);
}

// ── Sortering ────────────────────────────────────────────

/** Spärrarna: vad ett föreslaget negativt sökord inte får stoppa. */
function sparrbrott(neg, skyddade) {
  return skyddade.filter((s) => stoppar(neg, s));
}

export function sortera(rader, negativa, regler = REGLER) {
  const iKampanj = rader.filter(
    (r) => r.kampanj === regler.KAMPANJ && !regler.HOPPA_OVER_ANNONSGRUPPER.includes(r.annonsgrupp)
  );
  const kampanjNeg = negativa.filter((n) => n.niva === "kampanj" && n.kampanj === regler.KAMPANJ);
  const gruppNeg = (grupp) =>
    negativa.filter((n) => n.niva === "annonsgrupp" && n.kampanj === regler.KAMPANJ && n.annonsgrupp === grupp);

  // Sökord som gett en konvertering skyddas också, oavsett regel.
  const konverterade = [...new Set(iKampanj.filter((r) => r.konv > 0).map((r) => r.sokord))];
  const skyddade = [...regler.KANDA_BRA, ...konverterade];

  const hogar = { stoppad: [], behall: [], negativ: [], osaker: [] };
  for (const r of iKampanj) {
    const stoppadAv = [...kampanjNeg, ...gruppNeg(r.annonsgrupp)].find((n) => stoppar(n, r.sokord));
    if (stoppadAv) {
      hogar.stoppad.push({ ...r, orsak: `${stoppadAv.text} (${stoppadAv.typ})` });
      continue;
    }
    const beslut = regler.BESLUT.find((b) => b.sokord === r.sokord.toLowerCase());
    if (beslut?.beslut === "behåll") {
      hogar.behall.push({ ...r, orsak: "Eriks beslut" });
      continue;
    }
    if (beslut?.beslut === "negativ") {
      hogar.negativ.push({ ...r, kategori: "Eriks beslut", neg: { text: beslut.negativ ?? r.sokord, typ: beslut.typ ?? "EXAKT" } });
      continue;
    }
    if (konverterade.includes(r.sokord)) {
      hogar.behall.push({ ...r, orsak: "har gett konvertering" });
      continue;
    }
    // Regler som går före AVSIKT, till exempel orter utanför området.
    const hard = regler.NEGATIVA.find((n) => n.foreAvsikt && matchar(n.monster, r.sokord));
    const avsikt = !hard && regler.AVSIKT.find((re) => re.test(r.sokord.toLowerCase()));
    if (avsikt) {
      hogar.behall.push({ ...r, orsak: String(avsikt) });
      continue;
    }
    const regel = hard ?? regler.NEGATIVA.find((n) => matchar(n.monster, r.sokord));
    if (regel) {
      const neg = { text: regel.negativ ?? r.sokord.toLowerCase(), typ: regel.typ };
      const brott = sparrbrott(neg, skyddade);
      if (brott.length) {
        hogar.osaker.push({ ...r, orsak: `"${neg.text}" skulle stoppa ${brott.slice(0, 3).join(", ")}` });
      } else {
        hogar.negativ.push({ ...r, kategori: regel.kategori, neg });
      }
      continue;
    }
    hogar.osaker.push({ ...r, orsak: "ingen regel" });
  }
  // Åt andra hållet: befintliga negativa sökord som stoppar en känd bra
  // sökning. Annonsgruppernas negativa styr trafik mellan grupperna och
  // räknas inte här.
  const stopparBra = regler.KANDA_BRA.flatMap((s) =>
    kampanjNeg.filter((n) => stoppar(n, s)).map((n) => ({ sokning: s, negativ: `${n.text} (${n.typ})` }))
  );
  return { hogar, skyddade, stopparBra };
}

/** Slår ihop förslagen per negativt sökord, dyrast först, och kapar vid MAX_PER_VARV. */
export function forslag(negativHog, regler = REGLER) {
  const per = new Map();
  for (const r of negativHog) {
    const nyckel = `${r.neg.typ}:${r.neg.text}`;
    const f = per.get(nyckel) ?? { ...r.neg, kategori: r.kategori, sokord: new Set(), klick: 0, visningar: 0, kostnad: 0 };
    f.sokord.add(r.sokord);
    f.klick += r.klick;
    f.visningar += r.visningar;
    f.kostnad += r.kostnad;
    per.set(nyckel, f);
  }
  const alla = [...per.values()].sort((a, b) => b.kostnad - a.kostnad || b.visningar - a.visningar);
  return { nu: alla.slice(0, regler.MAX_PER_VARV), senare: alla.slice(regler.MAX_PER_VARV) };
}

// ── Rapport ──────────────────────────────────────────────

const kr = (n) => `${Math.round(n).toLocaleString("sv-SE")} kr`;
const summa = (lista, falt) => lista.reduce((s, r) => s + r[falt], 0);
// Inga långa tankstreck i rapporten, inte heller från kampanjnamn.
const tvatta = (s) => String(s).replace(/\u2014/g, "-").replace(/\|/g, "/");

/** Samma sökord i flera annonsgrupper räknas ihop. */
function perSokord(lista) {
  const m = new Map();
  for (const r of lista) {
    const f = m.get(r.sokord) ?? { ...r, klick: 0, visningar: 0, kostnad: 0, konv: 0 };
    f.klick += r.klick;
    f.visningar += r.visningar;
    f.kostnad += r.kostnad;
    f.konv += r.konv;
    m.set(r.sokord, f);
  }
  return [...m.values()].sort((a, b) => b.kostnad - a.kostnad || b.visningar - a.visningar);
}

export function rapport({ period, hogar, nu, senare, stopparBra = [] }) {
  const rad = [];
  const totalKostnad = summa(Object.values(hogar).flat(), "kostnad");
  rad.push(`# Sökordsloopen, ${new Date().toISOString().slice(0, 10)}`, "");
  rad.push(`Kampanj: ${REGLER.KAMPANJ}. Period: ${period}. Brand-gruppen ingår inte.`, "");
  rad.push("| Hög | Sökord | Klick | Kostnad |", "|---|---|---|---|");
  for (const [namn, nyckel] of [["Redan stoppade", "stoppad"], ["Behåll", "behall"], ["Föreslå negativt", "negativ"], ["Osäkert", "osaker"]]) {
    const h = hogar[nyckel];
    rad.push(`| ${namn} | ${perSokord(h).length} | ${summa(h, "klick")} | ${kr(summa(h, "kostnad"))} |`);
  }
  rad.push("", `Totalt ${kr(totalKostnad)} under perioden.`, "");

  if (stopparBra.length) {
    rad.push("## Befintliga negativa som stoppar bra sökningar", "");
    rad.push("Negativa sökord på kampanjnivå som stoppar en sökning i KANDA_BRA. Erik avgör om de ska tas bort.", "");
    for (const b of stopparBra) rad.push(`- "${tvatta(b.sokning)}" stoppas av ${tvatta(b.negativ)}`);
    rad.push("");
  }

  rad.push(`## Förslag: ${nu.length} negativa sökord`, "");
  rad.push(
    `Läggs på kampanjnivå i ${REGLER.KAMPANJ}. Sökorden nedan kostade ${kr(summa(nu, "kostnad"))} under perioden.`,
    "Inget läggs in utan godkännande.",
    ""
  );
  rad.push("| Negativt sökord | Typ | Kategori | Sökord | Klick | Kostnad | Exempel |", "|---|---|---|---|---|---|---|");
  for (const f of nu) {
    const ex = [...f.sokord].slice(0, 3).join(", ");
    rad.push(`| ${tvatta(f.text)} | ${f.typ} | ${f.kategori} | ${f.sokord.size} | ${f.klick} | ${kr(f.kostnad)} | ${tvatta(ex)} |`);
  }
  if (senare.length) rad.push("", `${senare.length} förslag till väntar på nästa varv (taket är ${REGLER.MAX_PER_VARV} per varv).`);

  const osakra = perSokord(hogar.osaker);
  rad.push("", `## Osäkert: ${osakra.length} sökord`, "");
  rad.push("Erik avgör. Besluten skrivs in i BESLUT i ads/sokordsregler.mjs.", "");
  rad.push("| Sökord | Annonsgrupp | Klick | Visningar | Kostnad | Varför osäkert |", "|---|---|---|---|---|---|");
  for (const r of osakra.slice(0, 50)) {
    rad.push(`| ${tvatta(r.sokord)} | ${tvatta(r.annonsgrupp)} | ${r.klick} | ${r.visningar} | ${kr(r.kostnad)} | ${tvatta(r.orsak)} |`);
  }
  if (osakra.length > 50) rad.push("", `Ytterligare ${osakra.length - 50} osäkra sökord utan klick visas inte.`);

  const behall = perSokord(hogar.behall);
  rad.push("", `## Behåll: ${behall.length} sökord`, "");
  rad.push(behall.slice(0, 40).map((r) => `${tvatta(r.sokord)} (${r.klick} klick${r.konv ? `, ${r.konv} konv.` : ""})`).join(", "));
  rad.push("");
  return rad.join("\n");
}

// ── Självtest ────────────────────────────────────────────

function test() {
  const fel = [];
  const ok = (villkor, text) => villkor || fel.push(text);

  // Matchningen följer Google Ads.
  ok(stoppar({ text: "trapetsplåt", typ: "FRAS" }, "trapetsplåt tak"), "FRAS ska stoppa när ordet finns");
  ok(!stoppar({ text: "plåt", typ: "FRAS" }, "plåttak"), "FRAS matchar hela ord, inte delar av ord");
  ok(stoppar({ text: "tak byta", typ: "BROAD" }, "byta tak stockholm"), "BROAD ska stoppa i valfri ordning");
  ok(!stoppar({ text: "takpannor tegel", typ: "EXAKT" }, "byta takpannor tegel"), "EXAKT stoppar bara exakt sökning");
  ok(!stoppar({ text: "åre", typ: "FRAS" }, "lägga tak i våren"), "FRAS matchar inte inuti ord");

  // Spärrarna: inget negativt sökord i reglerna får stoppa en känd bra sökning.
  for (const n of REGLER.NEGATIVA) {
    if (!n.negativ) continue;
    const brott = sparrbrott({ text: n.negativ, typ: n.typ }, REGLER.KANDA_BRA);
    ok(!brott.length, `"${n.negativ}" (${n.kategori}) skulle stoppa ${brott.join(", ")}`);
  }
  for (const b of REGLER.BESLUT) {
    if (b.beslut !== "negativ") continue;
    const brott = sparrbrott({ text: b.negativ ?? b.sokord, typ: b.typ ?? "EXAKT" }, REGLER.KANDA_BRA);
    ok(!brott.length, `Beslutet om "${b.sokord}" skulle stoppa ${brott.join(", ")}`);
  }

  // Varje känd bra sökning ska behållas av AVSIKT, annars kan en EXAKT-regel ta den.
  for (const s of REGLER.KANDA_BRA) {
    const behalls = REGLER.AVSIKT.some((re) => re.test(s));
    const tas = REGLER.NEGATIVA.find((n) => matchar(n.monster, s));
    ok(behalls || !tas, `"${s}" behålls inte och fångas av regeln ${tas?.monster}`);
  }

  // Inga dubbletter i beslutslistan.
  const sett = new Set();
  for (const b of REGLER.BESLUT) {
    ok(!sett.has(b.sokord), `"${b.sokord}" står två gånger i BESLUT`);
    sett.add(b.sokord);
  }

  if (fel.length) {
    console.error(`Sökordsreglerna: ${fel.length} fel`);
    for (const f of fel) console.error("  " + f);
    process.exit(1);
  }
  console.log("Sökordsreglerna: alla spärrar håller.");
}

// ── Körning ──────────────────────────────────────────────

// Bara när skriptet körs direkt, inte när det importeras.
const direkt = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (!direkt) {
  // Importerat som modul: gör ingenting.
} else if (args.includes("--test")) {
  test();
} else if (arg("--sokord") && arg("--negativa")) {
  const sokdata = JSON.parse(readFileSync(arg("--sokord"), "utf8"));
  const negdata = JSON.parse(readFileSync(arg("--negativa"), "utf8"));
  const { hogar, stopparBra } = sortera(sokdata.rader, negdata.negativa);
  const { nu, senare } = forslag(hogar.negativ);
  const text = rapport({ period: sokdata.period, hogar, nu, senare, stopparBra });
  if (arg("--ut")) writeFileSync(arg("--ut"), text);
  else console.log(text);
  if (arg("--json")) {
    const lista = nu.map((f) => ({ text: f.text, typ: f.typ, kategori: f.kategori, kostnad: Math.round(f.kostnad), sokord: [...f.sokord] }));
    writeFileSync(arg("--json"), JSON.stringify(lista, null, 2));
  }
} else {
  console.error("Användning: node scripts/sokordsloop.mjs --sokord <fil> --negativa <fil> [--ut <fil.md>] [--json <fil>]  eller  --test");
  process.exit(2);
}
