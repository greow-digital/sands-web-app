/**
 * Offline-konverteringar från lead-arket till Google Ads.
 *
 * Varje gång någon kryssar i "Bokad" eller "Offet accepterad" på en rad med
 * gclid läggs en rad till i fliken "Ads-import". Google Ads hämtar fliken
 * med en schemalagd uppladdning och kopplar konverteringen till klicket.
 * Ads lär sig då vilka klick som blir riktiga kunder, inte bara formulär.
 *
 * Konverteringarna i Ads (kontot 4767554827, sekundära från start):
 *   - "Takkontroll bokad (arket)"   (id 7856019976)
 *   - "Offert accepterad (arket)"   (id 7855987179), med offertvärdet
 *
 * Bara gclid skickas. Rader med enbart gbraid eller wbraid (iPhone-klick,
 * 7 av 50 betalda leads fram till okt 2026) hoppas över, eftersom
 * uppladdning från Kalkylark bygger på Google Click ID.
 *
 * INSTALLATION (en gång, av den som äger arket)
 *  1. Arket: Tillägg > Apps Script. Klistra in den här filen och spara.
 *  2. Kör funktionen installera() en gång och godkänn behörigheterna.
 *     Den skapar fliken "Ads-import" och en utlösare för redigeringar.
 *  3. Kör bakfyll() en gång. Den lägger in bokningar och accepterade
 *     offerter från de senaste 90 dagarna.
 *  4. Google Ads: Mål > Konverteringar > Uppladdningar > Scheman.
 *     Källa: Google Kalkylark, välj det här arket och fliken "Ads-import",
 *     schemalägg dagligen.
 *
 * Arket ändras inte i övrigt. Webhooken som skriver nya leads påverkas inte,
 * eftersom skript-skrivningar inte utlöser redigeringsutlösaren.
 */

const KALLFLIK = "Sheet1";
const MALFLIK = "Ads-import";
const TIDSZON = "Europe/Stockholm";

const KONVERTERING_BOKAD = "Takkontroll bokad (arket)";
const KONVERTERING_ACCEPTERAD = "Offert accepterad (arket)";

// Rubrikerna i lead-arket. Kolumnerna slås upp på namn, inte position, så
// att skriptet håller om kolumner flyttas.
const RUBRIK = {
  tid: "Tidpunkt",
  gclid: "gclid",
  bokad: "Bokad",
  accepterad: "Offet accepterad",
  varde: "Offertvärde",
};

// Google Ads mall för uppladdning från Kalkylark. Rad 1 anger tidszonen,
// rad 2 är kolumnrubrikerna, data från rad 3.
const MALL_RUBRIKER = [
  "Google Click ID",
  "Conversion Name",
  "Conversion Time",
  "Conversion Value",
  "Conversion Currency",
];

function installera() {
  malflik_();
  const ark = SpreadsheetApp.getActive();
  const finns = ScriptApp.getProjectTriggers().some(
    (t) => t.getHandlerFunction() === "vidRedigering"
  );
  if (!finns) {
    ScriptApp.newTrigger("vidRedigering").forSpreadsheet(ark).onEdit().create();
  }
}

/** Installerad utlösare: körs när någon ändrar en cell i arket. */
function vidRedigering(e) {
  const blad = e.range.getSheet();
  if (blad.getName() !== KALLFLIK) return;
  const kol = kolumner_(blad);

  const forsta = e.range.getRow();
  const antal = e.range.getNumRows();
  const vanster = e.range.getColumn();
  const hoger = vanster + e.range.getNumColumns() - 1;
  const inom = (k) => k >= vanster && k <= hoger;

  for (let rad = Math.max(forsta, 2); rad < forsta + antal; rad++) {
    const varden = blad.getRange(rad, 1, 1, blad.getLastColumn()).getValues()[0];
    if (inom(kol.bokad) && sant_(varden[kol.bokad - 1])) {
      lagg_(varden, kol, KONVERTERING_BOKAD, new Date(), false);
    }
    if (inom(kol.accepterad) && sant_(varden[kol.accepterad - 1])) {
      lagg_(varden, kol, KONVERTERING_ACCEPTERAD, new Date(), true);
    }
  }
}

/**
 * Engångskörning för det som redan är ikryssat. Exakt tidpunkt för
 * bokningen finns inte i arket, så konverteringstiden sätts till ett dygn
 * efter leaden (aldrig senare än nu). Leads äldre än 89 dagar hoppas över,
 * Google tar inte emot konverteringar utanför klickfönstret på 90 dagar.
 */
function bakfyll() {
  const blad = SpreadsheetApp.getActive().getSheetByName(KALLFLIK);
  const kol = kolumner_(blad);
  const rader = blad.getDataRange().getValues().slice(1);
  const nu = new Date();
  const grans = new Date(nu.getTime() - 89 * 864e5);
  let tillagda = 0;

  rader.forEach((varden) => {
    const lead = datum_(varden[kol.tid - 1]);
    if (!lead || lead < grans) return;
    const tid = new Date(Math.min(lead.getTime() + 864e5, nu.getTime() - 36e5));
    if (sant_(varden[kol.bokad - 1])) {
      tillagda += lagg_(varden, kol, KONVERTERING_BOKAD, tid, false);
    }
    if (sant_(varden[kol.accepterad - 1])) {
      tillagda += lagg_(varden, kol, KONVERTERING_ACCEPTERAD, tid, true);
    }
  });
  Logger.log("Bakfyllning klar, %s rader tillagda.", tillagda);
}

/** Lägger till en rad i Ads-import. Returnerar 1 om raden lades till. */
function lagg_(varden, kol, namn, tid, medVarde) {
  const gclid = String(varden[kol.gclid - 1] || "").trim();
  if (!gclid) return 0;

  const mal = malflik_();
  // Samma klick och konvertering skickas bara en gång, även om någon kryssar
  // ur och i igen.
  const befintliga = mal.getRange(3, 1, Math.max(mal.getLastRow() - 2, 1), 2).getValues();
  if (befintliga.some((r) => r[0] === gclid && r[1] === namn)) return 0;

  const varde = medVarde ? belopp_(varden[kol.varde - 1]) : "";
  mal.appendRow([
    gclid,
    namn,
    Utilities.formatDate(tid, TIDSZON, "yyyy-MM-dd HH:mm:ss"),
    varde,
    varde === "" ? "" : "SEK",
  ]);
  return 1;
}

function malflik_() {
  const ark = SpreadsheetApp.getActive();
  let mal = ark.getSheetByName(MALFLIK);
  if (!mal) {
    mal = ark.insertSheet(MALFLIK);
    mal.getRange(1, 1).setValue("Parameters:TimeZone=" + TIDSZON);
    mal.getRange(2, 1, 1, MALL_RUBRIKER.length).setValues([MALL_RUBRIKER]);
    // Klick-id och tider ska ligga kvar som text, annars formaterar
    // Kalkylark om dem.
    mal.getRange("A:C").setNumberFormat("@");
  }
  return mal;
}

function kolumner_(blad) {
  const rubriker = blad
    .getRange(1, 1, 1, blad.getLastColumn())
    .getValues()[0]
    .map((r) => String(r).trim());
  const kol = {};
  Object.keys(RUBRIK).forEach((nyckel) => {
    const i = rubriker.indexOf(RUBRIK[nyckel]);
    if (i === -1) throw new Error("Hittar inte kolumnen " + RUBRIK[nyckel]);
    kol[nyckel] = i + 1;
  });
  return kol;
}

function sant_(v) {
  return v === true || String(v).trim().toUpperCase() === "TRUE";
}

/**
 * Offertvärdet skrivs på olika sätt i arket: "192 799,00", "158,490 kr".
 * Komma följt av exakt tre siffror sist är tusentalsavgränsare, annars
 * decimalkomma. Text som "inget svar" ger tomt värde.
 */
function belopp_(v) {
  if (typeof v === "number") return v;
  let s = String(v || "").replace(/kr/gi, "").replace(/\s/g, "");
  if (!/\d/.test(s)) return "";
  if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, "");
  else s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return isFinite(n) && n > 0 ? n : "";
}

/**
 * Tidpunkten i arket är ibland ett datum och ibland text, och texten finns
 * både som m/d/åååå och dd/mm/åååå. Är första talet större än 12 är det dag.
 */
function datum_(v) {
  if (v instanceof Date) return v;
  const m = String(v || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return null;
  let manad = Number(m[1]);
  let dag = Number(m[2]);
  if (manad > 12) [manad, dag] = [dag, manad];
  return new Date(Number(m[3]), manad - 1, dag, 12);
}
