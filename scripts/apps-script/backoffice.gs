/**
 * Backoffice för Sands lead-ark (sandsab.se/admin).
 *
 * Ett FRISTÅENDE Apps Script-projekt, inte samma projekt som lead-webhooken.
 * Webhooken som tar emot leads från sajten rörs alltså inte, och går den
 * här bryggan sönder fortsätter leads att landa i arket som vanligt.
 *
 * Arket är fortfarande masterfilen. Backofficet läser hela fliken och skriver
 * bara de celler som faktiskt ändrats, så den som jobbar direkt i arket
 * samtidigt skrivs inte över i andra kolumner.
 *
 * INSTALLATION (en gång, av den som äger arket)
 *  1. script.google.com > Nytt projekt. Döp det till "Sands backoffice".
 *     Klistra in den här filen och spara.
 *  2. Projektinställningar > Skriptegenskaper, lägg till:
 *       ARK_ID           1KGAWjJeJJ36sadfyodyEpPbbSpzKEWOIbQ9Z_2Tl5Uc
 *       BACKOFFICE_TOKEN en lång slumpad sträng (samma som i Vercel)
 *     Sätt också projektets tidszon till Europe/Stockholm.
 *  3. Kör installera() en gång och godkänn behörigheterna. Den lägger till
 *     kolumnerna ID, Anteckning, Påminnelse, Logg och Arkiverad längst till
 *     höger om de saknas. Befintliga kolumner flyttas inte.
 *  4. Distribuera > Ny distribution > Webbapp. Kör som: Jag.
 *     Åtkomst: Vem som helst. Kopiera /exec-URL:en till Vercel som
 *     BACKOFFICE_SCRIPT_URL.
 *
 * Varje anrop kräver BACKOFFICE_TOKEN, så URL:en ensam ger ingen åtkomst.
 *
 * Google Ads: en ändring som görs av ett skript utlöser inte arkets
 * redigeringsutlösare (ads-offline-import.gs). När backofficet kryssar i
 * Bokad eller Offet accepterad lägger det därför själv till raden i fliken
 * Ads-import, i samma format och med samma dubblettskydd. Finns fliken inte
 * hoppas det steget över.
 */

const BO_FLIK = "Sheet1";
const BO_TIDSZON = "Europe/Stockholm";

// Kolumner som backofficet lägger till om de saknas.
const BO_NYA_KOLUMNER = ["ID", "Anteckning", "Påminnelse", "Logg", "Arkiverad"];
const BO_KRYSSRUTOR = ["Arkiverad"];

// Kolumner som får skrivas från backofficet. Allt annat (tidpunkt, källa,
// klick-id, transkript) är läsbart men låst.
const BO_SKRIVBARA = [
  "Namn",
  "Telefon",
  "E-post",
  "Bokad",
  "Offert skickad",
  "Offet accepterad",
  "Offert nekad",
  "Projekt avslutat",
  "Planerat startdatum",
  "Adress (fyll ut)",
  "Offertvärde",
  "Anteckning",
  "Påminnelse",
  "Arkiverad",
];

const BO_ADS_FLIK = "Ads-import";
const BO_ADS = {
  "Bokad": "Takkontroll bokad (arket)",
  "Offet accepterad": "Offert accepterad (arket)",
};

function installera() {
  const blad = bladet_();
  const sistaFore = blad.getLastRow();
  const rubriker = rubriker_(blad);
  BO_NYA_KOLUMNER.forEach(function (namn) {
    if (rubriker.indexOf(namn) !== -1) return;
    const kol = blad.getLastColumn() + 1;
    blad.getRange(1, kol).setValue(namn);
    rubriker.push(namn);
    if (BO_KRYSSRUTOR.indexOf(namn) !== -1 && blad.getMaxRows() > 1) {
      // Bara validering, inga värden. insertCheckboxes() skriver FALSE i
      // varje cell, och då flyttar getLastRow() till arkets sista rad så att
      // webhooken lägger nya leads längst ner. En tom cell visas som urkryssad.
      const regel = SpreadsheetApp.newDataValidation().requireCheckbox().build();
      blad.getRange(2, kol, blad.getMaxRows() - 1, 1).setDataValidation(regel);
    }
  });
  tilldelaId_(blad);
  // Webhooken lägger nya leads efter getLastRow(). Flyttas den har något
  // skrivits under sista leaden, och då skulle nästa lead hamna fel.
  const sistaEfter = blad.getLastRow();
  if (sistaEfter !== sistaFore) {
    throw new Error("Sista raden flyttades från " + sistaFore + " till " + sistaEfter + ". Återställ arket och hör av dig.");
  }
  Logger.log("Klart. Sista raden med innehåll är fortfarande " + sistaEfter + ".");
}

/** Visar var webhooken kommer att lägga nästa lead. Ändrar ingenting. */
function kontroll() {
  const blad = bladet_();
  Logger.log("Sista raden med innehåll: " + blad.getLastRow() + ". Rader i fliken: " + blad.getMaxRows() + ".");
}

function doPost(e) {
  try {
    const data = JSON.parse((e.postData && e.postData.contents) || "{}");
    const token = PropertiesService.getScriptProperties().getProperty("BACKOFFICE_TOKEN");
    if (!token || data.token !== token) return svar_({ ok: false, error: "obehorig" });

    if (data.action === "lista") return svar_({ ok: true, leads: lista_() });
    if (data.action === "uppdatera") return svar_(uppdatera_(data));
    return svar_({ ok: false, error: "okand action" });
  } catch (err) {
    console.error(err);
    return svar_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput("Sands backoffice ok.");
}

/** Alla rader som objekt med rubriken som nyckel. Saknade ID fylls i. */
function lista_() {
  const blad = bladet_();
  tilldelaId_(blad);
  const varden = blad.getDataRange().getValues();
  const rubriker = varden[0].map(function (r) { return String(r).trim(); });
  const leads = [];
  for (var i = 1; i < varden.length; i++) {
    const rad = varden[i];
    if (rad.every(function (v) { return v === "" || v === false; })) continue;
    const lead = {};
    rubriker.forEach(function (namn, k) {
      if (namn) lead[namn] = serialisera_(rad[k], namn);
    });
    leads.push(lead);
  }
  return leads;
}

/**
 * data.id: radens ID. data.falt: { rubrik: nytt värde }. data.logg: rad som
 * läggs sist i Logg-cellen. Bara skrivbara kolumner tas emot.
 */
function uppdatera_(data) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const blad = bladet_();
    const rubriker = rubriker_(blad);
    const idKol = rubriker.indexOf("ID") + 1;
    if (!idKol) return { ok: false, error: "Kolumnen ID saknas, kör installera()" };

    const idn = blad.getRange(2, idKol, Math.max(blad.getLastRow() - 1, 1), 1).getValues();
    var radNr = 0;
    for (var i = 0; i < idn.length; i++) {
      if (String(idn[i][0]) === String(data.id)) { radNr = i + 2; break; }
    }
    if (!radNr) return { ok: false, error: "Hittar inte leaden" };

    const falt = data.falt || {};
    Object.keys(falt).forEach(function (namn) {
      if (BO_SKRIVBARA.indexOf(namn) === -1) return;
      const kol = rubriker.indexOf(namn) + 1;
      if (!kol) return;
      var v = falt[namn];
      if (namn === "Påminnelse" && /^\d{4}-\d{2}-\d{2}$/.test(String(v))) {
        v = Utilities.parseDate(v, BO_TIDSZON, "yyyy-MM-dd");
      }
      blad.getRange(radNr, kol).setValue(v);
    });

    if (data.logg) {
      const loggKol = rubriker.indexOf("Logg") + 1;
      if (loggKol) {
        const cell = blad.getRange(radNr, loggKol);
        const fore = String(cell.getValue() || "");
        cell.setValue(fore ? fore + "\n" + data.logg : data.logg);
      }
    }
    SpreadsheetApp.flush();

    const rad = blad.getRange(radNr, 1, 1, blad.getLastColumn()).getValues()[0];
    Object.keys(BO_ADS).forEach(function (namn) {
      if (falt[namn] === true) adsImport_(rad, rubriker, BO_ADS[namn], namn === "Offet accepterad");
    });

    const lead = {};
    rubriker.forEach(function (namn, k) {
      if (namn) lead[namn] = serialisera_(rad[k], namn);
    });
    return { ok: true, lead: lead };
  } finally {
    lock.releaseLock();
  }
}

/** Ger rader utan ID ett kort slumpat ID. */
function tilldelaId_(blad) {
  const rubriker = rubriker_(blad);
  const idKol = rubriker.indexOf("ID") + 1;
  const sista = blad.getLastRow();
  if (!idKol || sista < 2) return;
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const omr = blad.getRange(2, idKol, sista - 1, 1);
    const idn = omr.getValues();
    const tidKol = rubriker.indexOf("Tidpunkt") + 1 || 1;
    const tider = blad.getRange(2, tidKol, sista - 1, 1).getValues();
    var andrat = false;
    for (var i = 0; i < idn.length; i++) {
      if (!idn[i][0] && tider[i][0] !== "") {
        idn[i][0] = Utilities.getUuid().slice(0, 8);
        andrat = true;
      }
    }
    if (andrat) omr.setValues(idn);
  } finally {
    lock.releaseLock();
  }
}

/** Samma rad och dubblettskydd som ads-offline-import.gs. */
function adsImport_(rad, rubriker, konvertering, medVarde) {
  const mal = SpreadsheetApp.openById(arkId_()).getSheetByName(BO_ADS_FLIK);
  if (!mal) return;
  const gclid = String(rad[rubriker.indexOf("gclid")] || "").trim();
  if (!gclid) return;
  const befintliga = mal.getRange(3, 1, Math.max(mal.getLastRow() - 2, 1), 2).getValues();
  if (befintliga.some(function (r) { return r[0] === gclid && r[1] === konvertering; })) return;
  const varde = medVarde ? belopp_(rad[rubriker.indexOf("Offertvärde")]) : "";
  mal.appendRow([
    gclid,
    konvertering,
    Utilities.formatDate(new Date(), BO_TIDSZON, "yyyy-MM-dd HH:mm:ss"),
    varde,
    varde === "" ? "" : "SEK",
  ]);
}

function bladet_() {
  const blad = SpreadsheetApp.openById(arkId_()).getSheetByName(BO_FLIK);
  if (!blad) throw new Error("Hittar inte fliken " + BO_FLIK);
  return blad;
}

function arkId_() {
  const id = PropertiesService.getScriptProperties().getProperty("ARK_ID");
  if (!id) throw new Error("Skriptegenskapen ARK_ID saknas");
  return id;
}

function rubriker_(blad) {
  return blad
    .getRange(1, 1, 1, blad.getLastColumn())
    .getValues()[0]
    .map(function (r) { return String(r).trim(); });
}

/**
 * Datum skickas som lokal tid i Stockholm, "yyyy-MM-dd HH:mm:ss". Tidpunkt
 * finns även som text i arket (m/d/åååå eller dd/mm/åååå), den tolkas här
 * på samma sätt som i ads-offline-import.gs.
 */
function serialisera_(v, namn) {
  if (v instanceof Date) return Utilities.formatDate(v, BO_TIDSZON, "yyyy-MM-dd HH:mm:ss");
  if (namn === "Tidpunkt" && typeof v === "string") {
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?:?(\d{2})?/);
    if (m) {
      var manad = Number(m[1]);
      var dag = Number(m[2]);
      if (manad > 12) { const t = manad; manad = dag; dag = t; }
      const d = new Date(Number(m[3]), manad - 1, dag, Number(m[4] || 12), Number(m[5] || 0), Number(m[6] || 0));
      return Utilities.formatDate(d, BO_TIDSZON, "yyyy-MM-dd HH:mm:ss");
    }
  }
  return v;
}

function belopp_(v) {
  if (typeof v === "number") return v;
  var s = String(v || "").replace(/kr/gi, "").replace(/\s/g, "");
  if (!/\d/.test(s)) return "";
  if (/^\d{1,3}(,\d{3})+$/.test(s)) s = s.replace(/,/g, "");
  else s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return isFinite(n) && n > 0 ? n : "";
}

function svar_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
