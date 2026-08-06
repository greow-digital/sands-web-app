/**
 * Sands Entreprenad — lead webhook
 *
 * Tar emot POST från sandsab.se (/api/lead), lägger till rad i
 * kalkylarket och skickar mejl till erik@greow.digital.
 *
 * Deploy: Distribuera → Ny distribution → Webbapp → Vem som helst.
 * Kopiera /exec-URL till Vercel env-var GOOGLE_SHEETS_WEBHOOK_URL.
 */

const NOTIFY_EMAIL = 'erik@greow.digital';
const SHEET_NAME = ''; // tomt = första bladet

// Dedupe: en identisk lead som kommer in inom detta fönster skapar bara EN
// rad och ETT mejl. Fångar dubbelklick, tillbaka-knapp och nätverksretry där
// samma besökare råkar skicka två gånger. Justera fönstret vid behov.
const DEDUPE_WINDOW_SECONDS = 120; // 2 minuter
const DEDUPE_MAX_ROWS_SCAN = 50;   // hur många rader bakåt vi jämför mot

function normText_(v) {
  return String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, ' ');
}

function normPhone_(v) {
  return String(v == null ? '' : v).replace(/[^0-9]/g, '');
}

// Identitet för en lead: samma normaliserade kontakt + innehåll = samma lead.
// Kolumnordningen matchar appendRow nedan (namn, telefon, epost, taktyp, yta,
// meddelande), så en befintlig rad kan få samma fingeravtryck återskapat.
function leadFingerprint_(name, phone, email, roofType, area, message) {
  return [
    normText_(name),
    normPhone_(phone),
    normText_(email),
    normText_(roofType),
    normText_(area),
    normText_(message),
  ].join('|');
}

// Finns identifierande innehåll alls? Annars deduplicerar vi inte, så att två
// anonyma röst-leads utan kontaktuppgifter aldrig slås ihop av misstag.
function hasIdentity_(name, phone, email) {
  return Boolean(normText_(name) || normPhone_(phone) || normText_(email));
}

// Har en identisk lead redan landat inom fönstret? Vi tittar bara på de
// senaste raderna (dubbletter kommer tätt i tid) och stannar så fort en rad
// är äldre än fönstret. Kolumn A..G = tidpunkt, namn, telefon, epost, taktyp,
// yta, meddelande.
function isRecentDuplicate_(sheet, fingerprint, windowMs) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // bara rubrikrad eller tomt blad
  const firstRow = Math.max(2, lastRow - DEDUPE_MAX_ROWS_SCAN + 1);
  const values = sheet.getRange(firstRow, 1, lastRow - firstRow + 1, 7).getValues();
  const now = Date.now();
  for (var i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    const t = row[0] instanceof Date ? row[0].getTime() : Date.parse(row[0]);
    if (!isNaN(t) && now - t > windowMs) break; // resten är äldre = utanför fönstret
    const rowFingerprint = leadFingerprint_(row[1], row[2], row[3], row[4], row[5], row[6]);
    if (rowFingerprint === fingerprint) return true;
  }
  return false;
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    const sheet = SHEET_NAME
      ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      : SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Dedupe under lås: serialisera två samtidiga requests och kontrollera om
    // en identisk lead redan kommit in inom fönstret. Är det en dubblett:
    // skippa rad + mejl men svara ok (besökaren ska aldrig se ett fel eller
    // skickas tillbaka in i formuläret).
    const lock = LockService.getScriptLock();
    try { lock.waitLock(10000); } catch (lockErr) { /* fortsätt utan lås hellre än att tappa leaden */ }
    try {
      if (
        hasIdentity_(data.name, data.phone, data.email) &&
        isRecentDuplicate_(
          sheet,
          leadFingerprint_(data.name, data.phone, data.email, data.roofType, data.area, data.message),
          DEDUPE_WINDOW_SECONDS * 1000
        )
      ) {
        return ContentService
          .createTextOutput(JSON.stringify({ ok: true, duplicate: true }))
          .setMimeType(ContentService.MimeType.JSON);
      }

      // Lägg till rad
      sheet.appendRow([
        new Date(),
        data.name || '',
        data.phone || '',
        data.email || '',
        data.roofType || '',
        data.area || '',
        data.message || '',
        data.source || 'sandsab.se',
        data.gclid || '',
        data.gbraid || '',
        data.wbraid || '',
      ]);
      // Skriv raden direkt så en köad request ser den innan låset släpps.
      SpreadsheetApp.flush();
    } finally {
      lock.releaseLock();
    }

    // Skicka mejl
    const subject = `Ny lead från ${data.source || 'sandsab.se'} — ${data.name || 'okänd'}`;

    const bodyLines = [
      'Ny förfrågan från sandsab.se',
      '',
      'Namn:      ' + (data.name || '-'),
      'Telefon:   ' + (data.phone || '-'),
      'E-post:    ' + (data.email || '-'),
      'Taktyp:    ' + (data.roofType || '-'),
      'Yta (m²):  ' + (data.area || '-'),
      'Meddelande:',
      data.message || '-',
      '',
      '— Källa:  ' + (data.source || 'sandsab.se'),
      '— GCLID:  ' + (data.gclid || '-'),
      '— GBRAID: ' + (data.gbraid || '-'),
      '— WBRAID: ' + (data.wbraid || '-'),
      '— Tid:    ' + new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' }),
    ];

    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: subject,
      body: bodyLines.join('\n'),
      replyTo: data.email || undefined,
    });

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    console.error(err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Sands lead webhook is running.')
    .setMimeType(ContentService.MimeType.TEXT);
}
