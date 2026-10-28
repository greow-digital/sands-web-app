# Google Kalender i backofficet

Säljaren bokar takkontroller direkt från leadvyn (knappen **Boka tid**).
Bokningen blir en händelse i en Google-kalender, och backofficet läser
mötena därifrån: kortet "Kommande takkontroller" på översikten, nästa möte i
leadvyns sidhuvud och mötestiden på pipelinekortet i kolumnen Takkontroll.

- Lediga tider räknas från kalenderns freebusy: vardagar, pass om en timme
  mellan 08 och 17 (Stockholmstid), de närmaste 14 dagarna.
- Händelsen får titeln `Takkontroll: <namn>, <adress>`, telefonnummer och
  länk till leaden i beskrivningen, och lead-ID:t i
  `extendedProperties.private.leadId`. Arket behöver ingen ny kolumn.
- Vid bokning kryssas Bokad i och loggen får raden
  `Takkontroll bokad <yyyy-MM-dd HH:mm>`.
- Flyttar eller tar man bort mötet direkt i Google Kalender syns det i
  backofficet nästa sidvisning. Kryssrutan och loggen ändras inte.
- Saknas kalendern är knappen gråad. Fallerar den visas en kort rad om felet,
  resten av sidan fungerar som vanligt.

Koden ligger i `lib/backoffice/kalender.ts` bakom ett eget gränssnitt
(`ledigaTider`, `boka`, `kommande`), så att Google kan bytas mot något
annat när Sands väljer kalender.

## Miljövariabler

| Namn | Värde |
| --- | --- |
| `GOOGLE_CALENDAR_CLIENT_ID` | OAuth-klientens ID |
| `GOOGLE_CALENDAR_CLIENT_SECRET` | OAuth-klientens hemlighet |
| `GOOGLE_CALENDAR_REFRESH_TOKEN` | refresh token för kontot som äger kalendern |
| `GOOGLE_CALENDAR_ID` | valfri, t.ex. `abc123@group.calendar.google.com`. Utelämnad blir det kontots huvudkalender (`primary`) |

I demoläget (`BACKOFFICE_DEMO=1`) används en minneskalender med några
påhittade upptagna tider i stället, och variablerna ovan behövs inte.

## Ta fram en refresh token (test mot Eriks egen kalender)

Sands har inte Google Workspace, så första testet görs mot ett privat
Google-konto. Skapa gärna en separat kalender ("Sands test") i det kontot
och sätt `GOOGLE_CALENDAR_ID` till den, så hamnar testbokningarna inte i
den vanliga kalendern. Kalender-ID:t finns under kalenderns inställningar,
"Integrera kalender".

1. **Projekt.** Gå till <https://console.cloud.google.com/>, skapa ett
   projekt (t.ex. "Sands backoffice").
2. **API.** APIs & Services > Library > *Google Calendar API* > Enable.
3. **Samtyckesskärm.** APIs & Services > OAuth consent screen (Google Auth
   Platform):
   - User type: *External*.
   - Appnamn och din egen e-post som support- och utvecklarkontakt.
   - Under *Audience* / *Test users*: lägg till ditt eget Google-konto.
   - Lägg till scopes `https://www.googleapis.com/auth/calendar.events` och
     `https://www.googleapis.com/auth/calendar.freebusy` (under *Data access*).
4. **Klient.** APIs & Services > Credentials > Create credentials > OAuth
   client ID:
   - Application type: *Web application*.
   - Authorized redirect URI: `https://developers.google.com/oauthplayground`
   - Spara klient-ID och hemlighet.
5. **Refresh token via OAuth Playground.** Öppna
   <https://developers.google.com/oauthplayground>:
   - Kugghjulet uppe till höger > kryssa i *Use your own OAuth credentials*
     och klistra in klient-ID och hemlighet.
   - Step 1: skriv in båda scopes från steg 3 i rutan längst ned
     (mellanslag emellan) och klicka *Authorize APIs*. Logga in med kontot
     som äger kalendern och godkänn varningen om overifierad app (det är
     din egen app).
   - Step 2: *Exchange authorization code for tokens*. Kopiera
     **Refresh token**.
6. **Lokalt.** Lägg in i `.env.local` (och starta om `next dev`):

   ```
   GOOGLE_CALENDAR_CLIENT_ID=...
   GOOGLE_CALENDAR_CLIENT_SECRET=...
   GOOGLE_CALENDAR_REFRESH_TOKEN=...
   GOOGLE_CALENDAR_ID=...   # valfri
   ```

   Demoläget måste vara avstängt (ingen `BACKOFFICE_DEMO=1`, eller en riktig
   `BACKOFFICE_SCRIPT_URL` satt), annars används minneskalendern.
7. **Prova.** Öppna en lead i `/admin`, klicka **Boka tid**. Upptagna tider i
   kalendern ska saknas i väljaren, och den bokade tiden ska dyka upp i
   kalendern och på översikten.

### Bra att veta

- **Tokens i testläge går ut efter 7 dagar.** Så länge appen har
  publiceringsstatus *Testing* slutar refresh token att fungera efter en
  vecka, och felet blir `invalid_grant`. Gör om steg 5, eller sätt appen
  till *In production* (Audience > Publish app). Då slutar den gå ut, men
  Google visar varningen om overifierad app vid inloggningen, vilket är okej
  för ett internt verktyg med ett konto.
- Refresh token blir ogiltig om man byter lösenord på kontot eller tar bort
  appens åtkomst under <https://myaccount.google.com/permissions>.
- Lägg variablerna i Vercel (Production, och Preview om det ska testas där)
  först när rätt kalender är vald. Byt till Sands riktiga kalender genom att
  göra om steg 5 inloggad på det kontot och byta de tre värdena.

## Kunden bokar själv på /tack

Efter offertflödet på landningssidorna (`components/LpQuiz.tsx`, formId
`lp_hero`) kan kunden boka sin takkontroll direkt på `/tack`, eller välja
"Jag föredrar att ni ringer upp mig".

- Leadet skickas och `/tack` laddas precis som förut, så konverteringen
  skickas innan bokaren visas. Gtag-koden på `/tack` är orörd.
- `/api/lead` lämnar en signerad biljett (HMAC med
  `BACKOFFICE_SESSION_SECRET`, giltig i sex timmar) när kalendern är
  inställd. `LeadForm` lägger den i sessionStorage (`sands_lead_bokning`),
  och `components/BokaTakkontroll.tsx` på `/tack` visas bara med den.
  Utan kalender eller hemlighet ser `/tack` ut exakt som förut.
- `/api/boka` (se `lib/backoffice/kundbokning.ts`) visar lediga tider från
  i morgon och två veckor fram, och bokar. Leadet hittas i arket på
  telefon eller e-post bland leads från i dag och i går. Adressen kunden
  fyller i sparas på leaden om den saknas.
- Loggraderna skrivs som "Kunden". De räknas inte som att Sands haft
  kontakt, så en lead som bara bett om ett samtal står kvar som Ny och i
  Att göra.
