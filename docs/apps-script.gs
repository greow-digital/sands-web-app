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

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');

    const sheet = SHEET_NAME
      ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      : SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

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
