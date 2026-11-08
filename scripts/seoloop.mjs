#!/usr/bin/env node
/*
  SEO-loopen: läser Search Console-exporter, följer upp tidigare ändringar
  i seo/experiment.json och listar möjligheter enligt seo/regler.mjs.
  Skriptet ändrar ingenting på sajten. Förslagen skrivs utifrån rapporten
  och godkänns av Erik.

    node scripts/seoloop.mjs --nu <fil> --fore <fil> --daglig <fil> [--ut <fil.md>]
    node scripts/seoloop.mjs --test

  --nu, --fore  Search Console, dimensionerna query och page, 28 dagar var.
  --daglig      Search Console, dimensionerna date och page, minst 60 dagar bakåt.
                Raderna har formen { keys: [...], clicks, impressions, ctr, position }.
  --test        Kontrollerar experimentloggen och att varje ämne pekar på en
                sida som finns. Körs i CI.
*/
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import * as R from "../seo/regler.mjs";

const args = process.argv.slice(2);
const arg = (namn) => {
  const i = args.indexOf(namn);
  return i === -1 ? undefined : args[i + 1];
};
const lasJson = (fil) => JSON.parse(readFileSync(fil, "utf8"));

// ── Hjälpare ─────────────────────────────────────────────

/** Sökvägen utan domän, ankare och avslutande snedstreck. */
export function sokvag(url) {
  const p = new URL(url, R.BAS).pathname.replace(/\/+$/, "");
  return decodeURIComponent(p) || "/";
}

const translit = (s) => s.toLowerCase().replace(/[åä]/g, "a").replace(/ö/g, "o").replace(/é/g, "e");

/** Vilket ämne och vilken sida som äger en sökfråga, eller null. */
export function agare(fraga) {
  const q = fraga.toLowerCase();
  const t = translit(q).replace(/\s+/g, "-");
  const ort = R.ORTER.find((o) => new RegExp(`(^|-)${o}($|-)`).test(t));
  if (ort && /tak/.test(q)) return { amne: `område ${ort}`, sida: `/omraden/${ort}`, alternativ: [] };
  const a = R.AMNEN.find((x) => x.monster.test(q));
  return a ? { amne: a.amne, sida: a.sida, alternativ: a.alternativ ?? [] } : null;
}

/** Summerar rader till klick, visningar och visningsviktad placering. */
function summera(rader) {
  const klick = rader.reduce((s, r) => s + r.clicks, 0);
  const visningar = rader.reduce((s, r) => s + r.impressions, 0);
  const position = visningar ? rader.reduce((s, r) => s + r.position * r.impressions, 0) / visningar : null;
  return { klick, visningar, position, ctr: visningar ? klick / visningar : 0 };
}

/** Grupperar fråga och sida per sökfråga. */
function perFraga(rader) {
  const m = new Map();
  for (const r of rader) {
    const [fraga, url] = r.keys;
    const f = m.get(fraga) ?? { fraga, sidor: [] };
    f.sidor.push({ sida: sokvag(url), klick: r.clicks, visningar: r.impressions, position: r.position, ctr: r.ctr });
    m.set(fraga, f);
  }
  for (const f of m.values()) {
    // Samma sida kan förekomma med olika ankare: slå ihop.
    const per = new Map();
    for (const s of f.sidor) {
      const x = per.get(s.sida) ?? { sida: s.sida, rader: [] };
      x.rader.push({ clicks: s.klick, impressions: s.visningar, position: s.position });
      per.set(s.sida, x);
    }
    f.sidor = [...per.values()].map((x) => ({ sida: x.sida, ...summera(x.rader) })).sort((a, b) => b.visningar - a.visningar);
    Object.assign(f, summera(f.sidor.map((s) => ({ clicks: s.klick, impressions: s.visningar, position: s.position }))));
  }
  return m;
}

const pos = (p) => (p == null ? "-" : p.toFixed(1).replace(".", ","));
const proc = (x) => `${Math.round(x * 100)} %`;
const andring = (fore, nu) => (fore ? `${nu >= fore ? "+" : ""}${Math.round(((nu - fore) / fore) * 100)} %` : "ny");

// ── Möjligheter ──────────────────────────────────────────

export function mojligheter(nuRader, foreRader) {
  const T = R.TROSKEL;
  const nu = perFraga(nuRader);
  const fore = perFraga(foreRader);
  const ej = (f) => !R.VARUMARKE.test(f.fraga.toLowerCase()) && !R.UTANFOR_FOKUS.test(f.fraga.toLowerCase());
  const out = { nara: [], lagCtr: [], felSida: [], omappat: [], tapp: [] };

  for (const f of nu.values()) {
    if (!ej(f)) continue;
    const ag = agare(f.fraga);
    const agSida = ag && f.sidor.find((s) => s.sida === ag.sida || ag.alternativ.includes(s.sida));
    const bast = f.sidor[0];

    if (f.visningar >= T.minVisningar) {
      const p = (agSida ?? bast).position;
      if (p >= T.naraFran && p <= T.naraTill) out.nara.push({ ...f, ag, sida: (agSida ?? bast).sida, pos: p });
      if (!ag) out.omappat.push({ ...f, sida: bast.sida });
      else if (!agSida) out.felSida.push({ ...f, ag, sida: bast.sida });
      else if (f.sidor.filter((s) => s.visningar >= 10).length >= 2) out.felSida.push({ ...f, ag, sida: bast.sida, kannibal: true });
    }
    for (const s of f.sidor) {
      const forv = R.FORVANTAD_CTR[Math.max(1, Math.round(s.position))];
      if (s.position <= T.lagCtrMaxPosition && s.visningar >= T.lagCtrMinVisningar && forv && s.ctr < forv * T.lagCtrAndel) {
        out.lagCtr.push({ fraga: f.fraga, ...s, forv });
      }
    }
    const fo = fore.get(f.fraga);
    if (fo) {
      const klickTapp = fo.klick >= T.tappMinKlickFore && f.klick <= fo.klick * (1 - T.tappAndel);
      const posTapp = fo.visningar >= 30 && f.visningar >= 30 && f.position - fo.position >= T.tappPositioner;
      if (klickTapp || posTapp) out.tapp.push({ ...f, fore: fo });
    }
  }
  // Frågor som försvann helt.
  for (const fo of fore.values()) {
    if (ej(fo) && !nu.has(fo.fraga) && fo.klick >= T.tappMinKlickFore) out.tapp.push({ fraga: fo.fraga, klick: 0, visningar: 0, position: null, sidor: [], fore: fo });
  }
  for (const k of Object.keys(out)) out[k].sort((a, b) => b.visningar - a.visningar);
  return out;
}

// ── Uppföljning av experiment ────────────────────────────

const dag = (d) => new Date(`${d}T00:00:00Z`);
const plus = (d, n) => new Date(dag(d).getTime() + n * 864e5).toISOString().slice(0, 10);

export function folj(experiment, dagligRader) {
  const M = R.MATNING;
  const datum = [...new Set(dagligRader.map((r) => r.keys[0]))].sort();
  const sista = datum.at(-1);
  const rader = dagligRader.map((r) => ({ d: r.keys[0], sida: sokvag(r.keys[1]), clicks: r.clicks, impressions: r.impressions, position: r.position }));
  const fonster = (sida, fran, till) => rader.filter((r) => r.d >= fran && r.d <= till && (sida === "*" || r.sida === sida));

  return experiment.map((e) => {
    const start = plus(e.datum, M.startForskjutning);
    const dagarEfter = Math.min(M.fonsterDagar, Math.round((dag(sista) - dag(start)) / 864e5) + 1);
    if (dagarEfter < 1) return { ...e, dagarEfter: 0, status: "inte live i datan än" };
    const efterTill = plus(start, dagarEfter - 1);
    const foreFran = plus(e.datum, -dagarEfter);
    const foreTill = plus(e.datum, -1);
    const f = summera(fonster(e.sida, foreFran, foreTill));
    const n = summera(fonster(e.sida, start, efterTill));
    const sajtF = summera(fonster("*", foreFran, foreTill));
    const sajtN = summera(fonster("*", start, efterTill));
    // Sidans förändring jämfört med hela sajtens, så att säsongen räknas bort.
    const relativ = f.visningar && sajtF.visningar ? n.visningar / f.visningar / (sajtN.visningar / sajtF.visningar) - 1 : null;
    const klar = dagarEfter >= M.minDagar;
    return { ...e, dagarEfter, fore: f, efter: n, sajtF, sajtN, relativ, klar, perioder: { foreFran, foreTill, start, efterTill } };
  });
}

// ── Rapport ──────────────────────────────────────────────

export function rapport({ nuRader, foreRader, dagligRader, experiment, perioder }) {
  const rad = [];
  const sajtNu = summera(nuRader.filter((r) => !R.VARUMARKE.test(r.keys[0].toLowerCase())));
  const sajtFore = summera(foreRader.filter((r) => !R.VARUMARKE.test(r.keys[0].toLowerCase())));
  rad.push(`# SEO-loopen, ${new Date().toISOString().slice(0, 10)}`, "");
  rad.push(`Search Console, ${R.SAJT}, bara Sverige. Nu: ${perioder.nu}. Före: ${perioder.fore}. Varumärkessökningar räknas inte.`, "");
  rad.push("| | Före | Nu | Ändring |", "|---|---|---|---|");
  rad.push(`| Klick | ${sajtFore.klick} | ${sajtNu.klick} | ${andring(sajtFore.klick, sajtNu.klick)} |`);
  rad.push(`| Visningar | ${sajtFore.visningar} | ${sajtNu.visningar} | ${andring(sajtFore.visningar, sajtNu.visningar)} |`);
  rad.push(`| Snittplacering | ${pos(sajtFore.position)} | ${pos(sajtNu.position)} | |`, "");

  // Uppföljning
  const foljda = folj(experiment.filter((e) => e.status === "aktiv"), dagligRader);
  rad.push("## Uppföljning av ändringar", "");
  rad.push(
    `Samma antal dagar före och efter (högst ${R.MATNING.fonsterDagar}), de första ${R.MATNING.startForskjutning} dagarna efter räknas inte. "Mot sajten" räknar bort hela sajtens förändring, till exempel säsongen. Ett utfall bedöms först efter ${R.MATNING.minDagar} dagar.`,
    ""
  );
  rad.push("| Id | Datum | Sida | Typ | Dagar | Visningar/dag före → efter | Klick före → efter | Placering före → efter | Mot sajten | Läge |", "|---|---|---|---|---|---|---|---|---|---|");
  for (const e of foljda) {
    if (!e.fore) {
      rad.push(`| ${e.id} | ${e.datum} | ${e.sida} | ${e.typ} | 0 | | | | | ${e.status} |`);
      continue;
    }
    const d = e.dagarEfter;
    const vis = `${(e.fore.visningar / d).toFixed(1)} → ${(e.efter.visningar / d).toFixed(1)}`.replace(/\./g, ",");
    const rel = e.relativ == null ? "ny sida" : `${e.relativ >= 0 ? "+" : ""}${Math.round(e.relativ * 100)} %`;
    rad.push(`| ${e.id} | ${e.datum} | ${e.sida} | ${e.typ} | ${d} | ${vis} | ${e.fore.klick} → ${e.efter.klick} | ${pos(e.fore.position)} → ${pos(e.efter.position)} | ${rel} | ${e.klar ? "mätbart" : "för tidigt"} |`);
  }
  // Målfrågorna i 28-dagarsperioderna.
  const nuF = perFraga(nuRader);
  const foreF = perFraga(foreRader);
  const malrader = [];
  for (const e of foljda) {
    for (const m of e.mal ?? []) {
      const a = foreF.get(m);
      const b = nuF.get(m);
      const egen = (f) => f && (e.sida === "*" ? f : f.sidor.find((s) => s.sida === e.sida));
      malrader.push(`| ${e.id} | ${m} | ${pos(egen(a)?.position)} (${egen(a)?.visningar ?? 0}) | ${pos(egen(b)?.position)} (${egen(b)?.visningar ?? 0}) | ${b?.sidor[0]?.sida ?? "-"} |`);
    }
  }
  if (malrader.length) {
    rad.push("", "Målfrågorna, sidans placering (visningar) i perioden före och nu:", "");
    rad.push("| Id | Sökfråga | Före | Nu | Bästa sidan nu |", "|---|---|---|---|---|", ...malrader);
  }

  // Möjligheter
  const m = mojligheter(nuRader, foreRader);
  const T = R.TROSKEL;
  const tabell = (rubrik, text, lista, kolumner, rad1) => {
    rad.push("", `## ${rubrik}: ${lista.length}`, "", text, "");
    if (!lista.length) return;
    rad.push(`| ${kolumner.join(" | ")} |`, `|${kolumner.map(() => "---").join("|")}|`);
    for (const x of lista.slice(0, 15)) rad.push(`| ${rad1(x).join(" | ")} |`);
    if (lista.length > 15) rad.push("", `Ytterligare ${lista.length - 15} visas inte.`);
  };
  tabell("Nära toppen", `Placering ${T.naraFran} till ${T.naraTill} och minst ${T.minVisningar} visningar. Ägarsidan räknas om den rankar.`, m.nara,
    ["Sökfråga", "Sida", "Placering", "Visningar", "Klick", "Ämne"],
    (x) => [x.fraga, x.sida, pos(x.pos), x.visningar, x.klick, x.ag?.amne ?? "inget ämne"]);
  tabell("Låg klickfrekvens", `Placering ${T.lagCtrMaxPosition} eller bättre, men under hälften av förväntad klickfrekvens. Titel och beskrivning är första misstänkt.`, m.lagCtr,
    ["Sökfråga", "Sida", "Placering", "Visningar", "CTR", "Förväntat"],
    (x) => [x.fraga, x.sida, pos(x.position), x.visningar, proc(x.ctr), proc(x.forv)]);
  tabell("Fel sida eller flera sidor", "Ägarsidan rankar inte, eller flera sidor delar på frågan.", m.felSida,
    ["Sökfråga", "Rankar nu", "Ska ägas av", "Visningar", "Placering", "Typ"],
    (x) => [x.fraga, x.sida, x.ag.sida, x.visningar, pos(x.position), x.kannibal ? "flera sidor" : "fel sida"]);
  tabell("Utan ämne", "Sökfrågor som inget ämne i seo/regler.mjs täcker. Kandidater för nytt innehåll, eller ett ämne som saknas i reglerna. Andra tjänster än tak och engelska sökningar räknas inte.", m.omappat,
    ["Sökfråga", "Rankar nu", "Visningar", "Klick", "Placering"],
    (x) => [x.fraga, x.sida, x.visningar, x.klick, pos(x.position)]);
  tabell("Tapp", `Klick ned minst ${proc(T.tappAndel)} eller placering ${T.tappPositioner} platser sämre jämfört med perioden före.`, m.tapp,
    ["Sökfråga", "Klick före → nu", "Placering före → nu", "Visningar nu"],
    (x) => [x.fraga, `${x.fore.klick} → ${x.klick}`, `${pos(x.fore.position)} → ${pos(x.position)}`, x.visningar]);
  rad.push("");
  return rad.join("\n");
}

// ── Självtest ────────────────────────────────────────────

function test() {
  const fel = [];
  const ok = (v, t) => v || fel.push(t);
  const { experiment } = lasJson("seo/experiment.json");

  // Experimentloggen.
  const typer = ["ny sida", "innehåll", "titel och beskrivning", "internlänkar", "teknisk", "konvertering"];
  const ids = new Set();
  for (const e of experiment) {
    ok(e.id && !ids.has(e.id), `Experiment-id saknas eller är dubblett: ${e.id}`);
    ids.add(e.id);
    ok(/^\d{4}-\d{2}-\d{2}$/.test(e.datum ?? ""), `${e.id}: datum ska vara ÅÅÅÅ-MM-DD`);
    ok(e.sida === "*" || e.sida?.startsWith("/"), `${e.id}: sida ska vara en sökväg eller *`);
    ok(typer.includes(e.typ), `${e.id}: okänd typ "${e.typ}"`);
    ok(e.hypotes, `${e.id}: hypotes saknas`);
    ok(["aktiv", "avslutad"].includes(e.status), `${e.id}: status ska vara aktiv eller avslutad`);
    ok(e.status !== "avslutad" || (e.utfall && e.lardom), `${e.id}: ett avslutat experiment behöver utfall och lärdom`);
  }
  // En ändring per sida i taget: två aktiva ändringar på samma sida inom
  // mätfönstret går inte att skilja åt, om inte det är noterat.
  const aktiva = experiment.filter((e) => e.status === "aktiv" && e.sida !== "*");
  for (const a of aktiva) {
    for (const b of aktiva) {
      if (a.id >= b.id || a.sida !== b.sida) continue;
      const dagar = Math.abs(dag(a.datum) - dag(b.datum)) / 864e5;
      ok(dagar >= R.MATNING.fonsterDagar || a.anteckning || b.anteckning,
        `${a.id} och ${b.id} ändrar ${a.sida} med ${dagar} dagars mellanrum. Vänta, eller skriv en anteckning om varför.`);
    }
  }

  // Varje ämne pekar på en sida som finns.
  const blogg = readFileSync("lib/blogg.ts", "utf8");
  const tjanster = readFileSync("lib/tjanster.ts", "utf8");
  const omraden = readFileSync("lib/omraden.ts", "utf8");
  const finns = (s) => {
    if (s === "/") return true;
    const [, del, slug] = s.split("/");
    if (del === "blogg" && slug) return blogg.includes(`slug: "${slug}"`);
    if (del === "tjanster" && slug) return tjanster.includes(`slug: "${slug}"`) || existsSync(`app/tjanster/${slug}/page.tsx`);
    if (del === "omraden" && slug) return omraden.includes(`slug: "${slug}"`);
    return existsSync(`app${s}/page.tsx`);
  };
  for (const a of R.AMNEN) for (const s of [a.sida, ...(a.alternativ ?? [])]) ok(finns(s), `Ämnet "${a.amne}" pekar på ${s}, som inte finns`);
  for (const o of R.ORTER) ok(finns(`/omraden/${o}`), `Orten ${o} saknar områdessida`);
  for (const e of experiment) ok(e.sida === "*" || finns(e.sida), `${e.id}: sidan ${e.sida} finns inte`);

  // Ägarlogiken på några kända frågor.
  ok(agare("takläggare stockholm")?.sida === "/", "takläggare stockholm ska ägas av startsidan");
  ok(agare("takläggare täby")?.sida === "/omraden/taby", "takläggare täby ska ägas av områdessidan");
  ok(agare("vad kostar takbyte")?.sida === "/priser", "prisfrågor ska ägas av /priser");
  ok(agare("byta eternittak kostnad")?.sida === "/blogg/byta-eternittak-kostnad", "eternit och pris ska ägas av artikeln");

  if (fel.length) {
    console.error(`SEO-reglerna: ${fel.length} fel`);
    for (const f of fel) console.error("  " + f);
    process.exit(1);
  }
  console.log("SEO-reglerna: experimentloggen och ämnena håller.");
}

// ── Körning ──────────────────────────────────────────────

const direkt = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (!direkt) {
  // Importerat som modul: gör ingenting.
} else if (args.includes("--test")) {
  test();
} else if (arg("--nu") && arg("--fore") && arg("--daglig")) {
  const text = rapport({
    nuRader: lasJson(arg("--nu")),
    foreRader: lasJson(arg("--fore")),
    dagligRader: lasJson(arg("--daglig")),
    experiment: lasJson("seo/experiment.json").experiment,
    perioder: { nu: arg("--period-nu") ?? "senaste 28 dagarna", fore: arg("--period-fore") ?? "28 dagarna innan" },
  });
  if (arg("--ut")) writeFileSync(arg("--ut"), text);
  else console.log(text);
} else {
  console.error("Användning: node scripts/seoloop.mjs --nu <fil> --fore <fil> --daglig <fil> [--ut <fil.md>]  eller  --test");
  process.exit(2);
}
