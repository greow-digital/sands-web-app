#!/usr/bin/env node
/*
  Regelkontroll för projektreglerna i CLAUDE.md och SEO.md.

  Granskar bara tillagda rader, så att äldre kod inte stoppar en PR. Det
  som redan finns i repot visas med --alla, men stoppar ingenting.

    node scripts/regelkoll.mjs              tillagt jämfört med origin/main
    node scripts/regelkoll.mjs --staged     det som ligger i git add (inför commit)
    node scripts/regelkoll.mjs --bas <ref>  jämför mot en annan gren
    node scripts/regelkoll.mjs --alla       granskar alla filer, avslutar med 0

  Ändringar i /tack eller i konverteringskoden (gtag config, AW-taggen)
  kräver uttryckligt godkännande: skriv "[tack-godkänt]" i ett
  commit-meddelande i PR:en, eller kör med TACK_GODKANT=1.
*/
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const ALLA = args.includes("--alla");
const STAGED = args.includes("--staged");
const basIndex = args.indexOf("--bas");
const BAS = basIndex !== -1 ? args[basIndex + 1] : process.env.REGEL_BAS || "origin/main";

const git = (cmd) => execSync(`git ${cmd}`, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

// Filer där copy och kod bor. Allt annat (node_modules, bilder, lockfiler) hoppas över.
const GRANSKAS = /^(app|components|lib|emails|sanity)\/.*\.(tsx?|mjs|md)$|^proxy\.ts$|^(CLAUDE|SEO|AGENTS|README)\.md$/;

const fel = [];
const varningar = [];

function regel(lista, fil, rad, text, orsak) {
  lista.push({ fil, rad, text: text.trim().slice(0, 140), orsak });
}

function granskaRad(fil, rad, radText) {
  // I dokumentationen beskrivs reglerna med exempel i `kod`. Dem granskar vi inte.
  const text = fil.endsWith(".md") ? radText.replace(/`[^`]*`/g, "") : radText;
  // Tankstreck är förbjudet överallt, även i kommentarer.
  if (text.includes("\u2014")) regel(fel, fil, rad, text, "Långt tankstreck (U+2014). Använd komma, kolon, parentes eller dela meningen.");

  // Kort tankstreck bara mellan siffror, som i "25 000–60 000 kr".
  const enDash = [...text.matchAll(/\u2013/g)].filter((m) => {
    const fore = text.slice(Math.max(0, m.index - 2), m.index);
    const efter = text.slice(m.index + 1, m.index + 3);
    return !(/\d\s?$/.test(fore) && /^\s?\d/.test(efter));
  });
  if (enDash.length) regel(fel, fil, rad, text, "Kort tankstreck (U+2013) utanför ett sifferintervall.");

  if (/familjeföretag/i.test(text) && !fil.endsWith(".md")) regel(fel, fil, rad, text, "Ordet \"familjeföretag\" är förbjudet.");

  // CTA-reglerna. "Få gratis offert" är tillåtet bara i offertflödet och på /lp.
  const offertUndantag = /^(components\/(Offertflode|LpQuiz|LpStickyCta)\.tsx|app\/lp\/|app\/priser\/page\.tsx)/.test(fil);
  if (/få gratis offert/i.test(text) && !offertUndantag && !fil.endsWith(".md"))
    regel(fel, fil, rad, text, "\"Få gratis offert\" är bara tillåtet i offertflödet och på /lp.");
  if (/\bfå offert\b/i.test(text) && !fil.endsWith(".md")) regel(fel, fil, rad, text, "\"Få offert\" är förbjudet. Använd \"Få prisförslag\" eller \"Boka kostnadsfri takkontroll\".");
  if (/kontakta oss/i.test(text) && !/^app\/(kontakt|integritetspolicy)\//.test(fil) && !fil.endsWith(".md"))
    regel(fel, fil, rad, text, "\"Kontakta oss\" är förbjudet som CTA.");

  // Priser ska komma från lib/material.ts, inte skrivas in för hand.
  if (/\d[\d\s ]*\s?kr\/m²/.test(text) && fil !== "lib/material.ts" && !fil.endsWith(".md"))
    regel(fel, fil, rad, text, "Hårdkodat pris per m². Hämta det från MATERIAL i lib/material.ts.");

  // Varningar: kräver omdöme, stoppar inte.
  if (/boka takkontroll/i.test(text) && !/kostnadsfri/i.test(text))
    regel(varningar, fil, rad, text, "\"Boka takkontroll\" utan \"kostnadsfri\" (ok som rubrik, inte som knapp).");
}

// Konverteringskoden: /tack, gtag config och Ads-taggen.
function rorKonvertering(fil, text) {
  if (/^app\/tack\//.test(fil)) return true;
  // Skriptet självt innehåller mönstren den letar efter.
  if (fil === "scripts/regelkoll.mjs") return false;
  return /AW-18004063012|gtag\(\s*['"]config['"]|send_to/.test(text);
}

function tackGodkand() {
  if (process.env.TACK_GODKANT === "1") return true;
  if (STAGED || ALLA) return false;
  try {
    return git(`log --format=%B ${BAS}..HEAD`).includes("[tack-godkänt]");
  } catch {
    return false;
  }
}

if (ALLA) {
  const filer = git("ls-files").split("\n").filter((f) => GRANSKAS.test(f));
  for (const fil of filer) {
    readFileSync(fil, "utf8").split("\n").forEach((t, i) => granskaRad(fil, i + 1, t));
  }
} else {
  const diff = STAGED ? git("diff --cached --unified=0 --no-color") : git(`diff --unified=0 --no-color ${BAS}...HEAD`);
  let fil = null;
  let rad = 0;
  const konvertering = new Set();
  for (const t of diff.split("\n")) {
    if (t.startsWith("+++ ")) {
      fil = t.startsWith("+++ b/") ? t.slice(6) : null;
      continue;
    }
    if (t.startsWith("--- ")) {
      const gammal = t.startsWith("--- a/") ? t.slice(6) : null;
      if (gammal && /^app\/tack\//.test(gammal)) konvertering.add(gammal);
      continue;
    }
    const hunk = t.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
    if (hunk) {
      rad = Number(hunk[1]);
      continue;
    }
    if (!fil) continue;
    if (t.startsWith("+")) {
      if (GRANSKAS.test(fil)) granskaRad(fil, rad, t.slice(1));
      if (rorKonvertering(fil, t.slice(1))) konvertering.add(fil);
      rad++;
    } else if (t.startsWith("-") && rorKonvertering(fil, t.slice(1))) {
      konvertering.add(fil);
    }
  }
  if (konvertering.size && !tackGodkand()) {
    for (const f of konvertering)
      regel(fel, f, 0, "", "Ändrar /tack eller konverteringskoden. Kräver uttryckligt godkännande: \"[tack-godkänt]\" i ett commit-meddelande.");
  }

  // Commit-meddelanden i PR:en följer samma regel om tankstreck.
  if (!STAGED) {
    try {
      const meddelanden = git(`log --format=%h%x09%s%x09%b%x1e ${BAS}..HEAD`).split("\x1e");
      for (const m of meddelanden) {
        if (m.includes("\u2014")) regel(fel, "commit " + m.trim().slice(0, 7), 0, m.split("\t")[1] ?? "", "Långt tankstreck (U+2014) i commit-meddelandet.");
      }
    } catch {
      // Ingen gemensam historik med basen, till exempel i en grund klon.
    }
  }
}

const skriv = (lista, rubrik) => {
  if (!lista.length) return;
  console.log(`\n${rubrik} (${lista.length})`);
  for (const f of lista) console.log(`  ${f.fil}${f.rad ? ":" + f.rad : ""}  ${f.orsak}${f.text ? "\n      " + f.text : ""}`);
};

skriv(fel, ALLA ? "Avvikelser i hela repot" : "Regelbrott");
skriv(varningar, "Varningar");
if (!fel.length && !varningar.length) console.log("Regelkontrollen: inga avvikelser.");
process.exit(fel.length && !ALLA ? 1 : 0);
