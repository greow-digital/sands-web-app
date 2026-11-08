#!/usr/bin/env node
/*
  Konkurrentdelen av SEO-loopen. Läser konkurrenternas sitemaps, jämför
  med förra veckans ögonblicksbild och läser nya och ändrade sidor om tak.

    node scripts/konkurrentloop.mjs [--ut <fil.md>]
    node scripts/konkurrentloop.mjs --test

  Ögonblicksbilderna sparas i seo/konkurrenter/<domän>.json och checkas in,
  så att nästa varv har något att jämföra med. robots.txt följs, och bara
  ett begränsat antal sidor läses per varv (seo/konkurrenter.mjs).
*/
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import * as K from "../seo/konkurrenter.mjs";
import { agare } from "./seoloop.mjs";

const args = process.argv.slice(2);
const arg = (namn) => {
  const i = args.indexOf(namn);
  return i === -1 ? undefined : args[i + 1];
};
const vanta = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Tolkning ─────────────────────────────────────────────

const avkoda = (s) =>
  s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/\s+/g, " ").trim();

/** Läser en sitemap eller ett sitemapindex. */
export function lasSitemap(xml) {
  const ar = (tagg) => [...xml.matchAll(new RegExp(`<${tagg}>([\\s\\S]*?)</${tagg}>`, "g"))].map((m) => m[1]);
  if (/<sitemapindex/i.test(xml)) {
    return { index: ar("sitemap").map((b) => avkoda(b.match(/<loc>([\s\S]*?)<\/loc>/)?.[1] ?? "")).filter(Boolean), sidor: [] };
  }
  const sidor = ar("url").map((b) => ({
    url: avkoda(b.match(/<loc>([\s\S]*?)<\/loc>/)?.[1] ?? ""),
    lastmod: avkoda(b.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1] ?? "") || null,
  })).filter((s) => s.url);
  return { index: [], sidor };
}

/** Sitemaps och förbjudna sökvägar ur robots.txt (gruppen för *). */
export function lasRobots(txt) {
  const sitemaps = [];
  const forbjudna = [];
  let galler = false;
  for (const rad of txt.split(/\r?\n/)) {
    const [nyckel, ...rest] = rad.split(":");
    const varde = rest.join(":").replace(/#.*/, "").trim();
    const k = nyckel.trim().toLowerCase();
    if (k === "sitemap" && varde) sitemaps.push(varde);
    else if (k === "user-agent") galler = varde === "*";
    else if (k === "disallow" && galler && varde) forbjudna.push(varde);
  }
  return { sitemaps, forbjudna };
}

/** Titel, beskrivning och rubriker ur en sida. */
export function lasSida(html) {
  const forsta = (re) => avkoda(html.match(re)?.[1]?.replace(/<[^>]+>/g, " ") ?? "");
  const alla = (re) => [...html.matchAll(re)].map((m) => avkoda(m[1].replace(/<[^>]+>/g, " "))).filter(Boolean);
  return {
    titel: forsta(/<title[^>]*>([\s\S]*?)<\/title>/i),
    beskrivning: avkoda(html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1] ?? ""),
    h1: alla(/<h1[^>]*>([\s\S]*?)<\/h1>/gi),
    h2: alla(/<h2[^>]*>([\s\S]*?)<\/h2>/gi).slice(0, 12),
  };
}

/** Jämför två ögonblicksbilder. */
export function jamfor(fore, nu) {
  const f = new Map((fore ?? []).map((s) => [s.url, s]));
  const n = new Map(nu.map((s) => [s.url, s]));
  return {
    nya: nu.filter((s) => !f.has(s.url)),
    borta: (fore ?? []).filter((s) => !n.has(s.url)),
    andrade: nu.filter((s) => f.has(s.url) && s.lastmod && f.get(s.url).lastmod && s.lastmod !== f.get(s.url).lastmod),
  };
}

const sokvagen = (url) => {
  try {
    return decodeURIComponent(new URL(url).pathname).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

/** Vilket av våra ämnen en konkurrentsida handlar om, utifrån adressen. */
export function amneFor(url) {
  const ord = sokvagen(url).replace(/[/_-]+/g, " ").trim();
  return agare(ord);
}

// ── Hämtning ─────────────────────────────────────────────

async function hamta(url) {
  const res = await fetch(url, { headers: { "User-Agent": K.USER_AGENT }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} för ${url}`);
  return res.text();
}

async function konkurrent(k) {
  const dom = new URL(k.bas).hostname.replace(/^www\./, "");
  const fil = `seo/konkurrenter/${dom}.json`;
  const fore = existsSync(fil) ? JSON.parse(readFileSync(fil, "utf8")) : null;

  let robots = { sitemaps: [], forbjudna: [] };
  try {
    robots = lasRobots(await hamta(`${k.bas}/robots.txt`));
  } catch {
    // Ingen robots.txt: vanliga sitemapadresser provas nedan.
  }
  const tillaten = (url) => !robots.forbjudna.some((p) => sokvagen(url).startsWith(p.toLowerCase()));

  const ko = robots.sitemaps.length ? [...robots.sitemaps] : [`${k.bas}/sitemap.xml`, `${k.bas}/sitemap_index.xml`];
  const sidor = [];
  const lasta = new Set();
  while (ko.length && lasta.size < 20) {
    const s = ko.shift();
    if (lasta.has(s)) continue;
    lasta.add(s);
    try {
      const { index, sidor: nya } = lasSitemap(await hamta(s));
      ko.push(...index);
      sidor.push(...nya);
    } catch {
      // En sitemap som inte svarar hoppas över.
    }
    await vanta(K.PAUS_MS);
  }
  const unika = [...new Map(sidor.map((s) => [s.url, s])).values()].sort((a, b) => a.url.localeCompare(b.url));
  const diff = jamfor(fore?.sidor, unika);

  // Första varvet: läs de sidor om tak som ser viktigast ut. Därefter: nya och ändrade.
  const kandidater = (fore ? [...diff.nya, ...diff.andrade] : unika)
    .filter((s) => K.RELEVANT.test(sokvagen(s.url)) && tillaten(s.url))
    .slice(0, K.MAX_SIDOR);
  const lasta2 = [];
  for (const s of kandidater) {
    try {
      lasta2.push({ ...s, ...lasSida(await hamta(s.url)), amne: amneFor(s.url)?.amne ?? null });
    } catch (e) {
      lasta2.push({ ...s, fel: String(e.message ?? e) });
    }
    await vanta(K.PAUS_MS);
  }

  // En misslyckad hämtning får inte skriva över förra veckans bild.
  if (!unika.length) return { ...k, dom, forsta: !fore, antal: 0, diff, lasta: [] };
  mkdirSync("seo/konkurrenter", { recursive: true });
  writeFileSync(fil, JSON.stringify({ namn: k.namn, hamtat: new Date().toISOString().slice(0, 10), sidor: unika }, null, 1) + "\n");
  return { ...k, dom, forsta: !fore, antal: unika.length, diff, lasta: lasta2 };
}

// ── Rapport ──────────────────────────────────────────────

const tvatta = (s) => String(s ?? "").replace(/—/g, "-").replace(/–/g, "-").replace(/\|/g, "/");

export function rapport(resultat) {
  const rad = [`# Konkurrenterna, ${new Date().toISOString().slice(0, 10)}`, ""];
  for (const r of resultat) {
    rad.push(`## ${r.namn} (${r.dom})`, "");
    if (!r.antal) {
      rad.push("Ingen sitemap gick att läsa. Kontrollera nätverket och sajtens robots.txt.", "");
      continue;
    }
    rad.push(r.forsta
      ? `Första varvet: ${r.antal} sidor i sitemap. Nästa varv visar vad som är nytt.`
      : `${r.antal} sidor i sitemap. Nya: ${r.diff.nya.length}, ändrade: ${r.diff.andrade.length}, borttagna: ${r.diff.borta.length}.`, "");
    // Vilka av våra ämnen konkurrenten har sidor om, utifrån adresserna.
    const per = new Map();
    for (const s of r.lasta) if (s.amne) per.set(s.amne, (per.get(s.amne) ?? 0) + 1);
    if (per.size) rad.push(`Ämnen bland de lästa sidorna: ${[...per].map(([a, n]) => `${a} (${n})`).join(", ")}.`, "");
    if (r.lasta.length) {
      rad.push("| Sida | Titel | H1 | Vårt ämne |", "|---|---|---|---|");
      for (const s of r.lasta) {
        rad.push(`| ${tvatta(sokvagen(s.url))} | ${tvatta(s.fel ? `fel: ${s.fel}` : s.titel)} | ${tvatta(s.h1?.[0])} | ${tvatta(s.amne ?? "-")} |`);
      }
      rad.push("");
    }
    if (!r.forsta && r.diff.borta.length) rad.push(`Borttagna: ${r.diff.borta.slice(0, 10).map((s) => tvatta(sokvagen(s.url))).join(", ")}`, "");
  }
  return rad.join("\n");
}

// ── Självtest ────────────────────────────────────────────

function test() {
  const fel = [];
  const ok = (v, t) => v || fel.push(t);

  const index = lasSitemap(`<?xml version="1.0"?><sitemapindex><sitemap><loc>https://x.se/sitemap-1.xml</loc></sitemap></sitemapindex>`);
  ok(index.index[0] === "https://x.se/sitemap-1.xml", "sitemapindex läses");
  const karta = lasSitemap(`<urlset><url><loc>https://x.se/takbyte-stockholm/</loc><lastmod>2026-11-01</lastmod></url><url><loc><![CDATA[https://x.se/om-oss?a=1&amp;b=2]]></loc></url></urlset>`);
  ok(karta.sidor.length === 2 && karta.sidor[0].lastmod === "2026-11-01", "urlset läses med lastmod");
  ok(karta.sidor[1].url === "https://x.se/om-oss?a=1&b=2", "CDATA och &amp; avkodas");

  const robots = lasRobots("User-agent: Googlebot\nDisallow: /x\n\nUser-agent: *\nDisallow: /admin # kommentar\nSitemap: https://x.se/sitemap.xml");
  ok(robots.sitemaps[0] === "https://x.se/sitemap.xml", "Sitemap ur robots.txt");
  ok(robots.forbjudna.length === 1 && robots.forbjudna[0] === "/admin", "bara gruppen för * räknas");

  const sida = lasSida(`<html><head><title>Takbyte i Stockholm | X</title><meta name="description" content="Fast pris &amp; garanti"></head><body><h1>Byt <em>tak</em></h1><h2>Pris</h2></body></html>`);
  ok(sida.titel === "Takbyte i Stockholm | X" && sida.beskrivning === "Fast pris & garanti", "titel och beskrivning");
  ok(sida.h1[0] === "Byt tak" && sida.h2[0] === "Pris", "rubriker utan taggar");

  const d = jamfor(
    [{ url: "a", lastmod: "1" }, { url: "b", lastmod: "1" }],
    [{ url: "b", lastmod: "2" }, { url: "c", lastmod: null }]
  );
  ok(d.nya.length === 1 && d.borta.length === 1 && d.andrade.length === 1, "nya, borttagna och ändrade");

  ok(amneFor("https://x.se/tjanster/takomlaggning-stockholm/")?.amne === "takbyte", "adress till ämne");
  ok(amneFor("https://x.se/takreparation/")?.amne === "takreparation", "takreparation känns igen");
  ok(!/@/.test(K.USER_AGENT), "ingen e-post i User-Agent");

  if (fel.length) {
    console.error(`Konkurrentdelen: ${fel.length} fel`);
    for (const f of fel) console.error("  " + f);
    process.exit(1);
  }
  console.log("Konkurrentdelen: tolkningen håller.");
}

// ── Körning ──────────────────────────────────────────────

const direkt = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (!direkt) {
  // Importerat som modul: gör ingenting.
} else if (args.includes("--test")) {
  test();
} else {
  const resultat = [];
  for (const k of K.KONKURRENTER) {
    try {
      resultat.push(await konkurrent(k));
    } catch (e) {
      resultat.push({ ...k, dom: new URL(k.bas).hostname, antal: 0, lasta: [], diff: { nya: [], borta: [], andrade: [] }, fel: String(e) });
    }
  }
  const text = rapport(resultat);
  if (arg("--ut")) writeFileSync(arg("--ut"), text);
  else console.log(text);
}
