# Google Sheets + Email — Setup

Formulärsvar postas till en Google Apps Script som:
1. Lägger till en rad i Google Sheet:
   https://docs.google.com/spreadsheets/d/1KGAWjJeJJ36sadfyodyEpPbbSpzKEWOIbQ9Z_2Tl5Uc/edit
2. Skickar ett mejl till `erik@greow.digital`

## Steg 1 — Förbered kalkylarket

1. Öppna kalkylarket (länken ovan)
2. Skapa rubrikrad i rad 1 (cell A1 → H1):
   `Tidpunkt` | `Namn` | `Telefon` | `E-post` | `Taktyp` | `Yta m²` | `Meddelande` | `Källa`

## Steg 2 — Skapa Apps Script

1. I kalkylarket: **Tillägg → Apps Script**
2. Radera allt i `Code.gs`
3. Klistra in koden från `docs/apps-script.gs` i det här repot
4. Klicka **Spara** (disk-ikonen)

## Steg 3 — Deploya som web app

1. Klicka **Distribuera → Ny distribution**
2. Välj typ: **Webbapp**
3. Beskrivning: `Sands lead webhook`
4. Kör som: **Jag** (din Google-användare)
5. Vem har åtkomst: **Vem som helst**
6. Klicka **Distribuera**
7. Godkänn behörigheter (första gången)
8. Kopiera **webbappens URL** (slutar på `/exec`)

## Steg 4 — Lägg till URL i Vercel

1. Gå till Vercel-projektet → **Settings → Environment Variables**
2. Lägg till:
   - Name: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: `<webbappens URL>`
   - Environments: Production, Preview, Development
3. Klicka **Save**
4. Redeploya för att environment-variabeln ska laddas

## Steg 5 — Testa

1. Skicka ett testformulär från sajten
2. Kontrollera att raden dyker upp i kalkylarket
3. Kontrollera att mejlet kommer fram till `erik@greow.digital`

## Felsökning

Om formulär misslyckas:
- **Vercel**: kontrollera **Runtime Logs** för API-rutten `/api/lead`
- **Apps Script**: öppna scriptet → **Körningar** (vänstermenyn) för att se eventuella fel
- **Env-var**: säkerställ att `GOOGLE_SHEETS_WEBHOOK_URL` finns i Vercel och slutar på `/exec`
