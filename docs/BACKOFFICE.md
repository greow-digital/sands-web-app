# Backoffice för leads (/admin)

Ett litet backoffice ovanpå lead-arket. **Arket är fortfarande masterfilen.**
Backofficet läser arket och skriver tillbaka varje ändring direkt, så den som
hellre jobbar i arket kan fortsätta göra det.

```
sajten -> /api/lead -> lead-webhook (Apps Script) -> arket      (oförändrat)
                                                     ^
/admin -> server actions -> backoffice.gs (eget Apps Script) ---+
Vercel Cron -> /api/admin/dagligt -> uppföljningar + sammanfattning (Resend)
```

Lead-webhooken rörs inte. Går backofficet sönder landar leads i arket precis
som förut.

## Vad det gör

- **Leads**: flikarna Att göra, Pågående, Accepterade, Alla och Arkiv, plus sökning.
  Att göra visar nya leads från i dag, leads som ingen rört efter ett dygn,
  påminnelser som förfallit och föreslagna uppföljningsmejl.
- **Leadvy**: ring och mejla med ett klick, kryssa i stegen (samma kryssrutor
  som i arket), offertvärde, startdatum, adress, anteckning, påminnelsedatum,
  fri notering. Snabbknappar: "Ringt, fick svar", "Ringt, inget svar",
  "Takkontroll bokad" och "Skräp, arkivera".
- **Kalender**: "Boka tid" i leadvyn bokar en takkontroll i Google Kalender
  bland lediga tider, kryssar i Bokad och loggar tiden. Mötena syns på
  översikten, i leadvyn och i pipelinen. Se `docs/GOOGLE_KALENDER.md`.
- **Historik**: varje ändring från backofficet skrivs i kolumnen Logg med tid
  och namn. Flödena räknar dagar från loggen.
- **Uppföljningsmejl** (`lib/backoffice/floden.ts`):
  - *Uppföljning av offert*: 5 dagar efter "Offert skickad", om offerten
    varken accepterats eller nekats.
  - *Nådde dig inte på telefon*: 1 dag efter "Ringt, inget svar", om ingen
    fått svar efteråt och inget är bokat.
  Varje flöde skickas högst en gång per lead. Alla går att förhandsgranska
  och skicka manuellt när som helst.
- **Dagligt jobb** (kl 06 UTC, se `vercel.json`): mejlar en sammanfattning av
  dagens att göra till Sands. Med `BACKOFFICE_AUTOUTSKICK=1` skickar det också
  de föreslagna uppföljningarna själv. Utan den flaggan väntar de på ett klick.

Google Ads: när backofficet kryssar i Bokad eller Offet accepterad läggs raden
i fliken Ads-import av bryggan själv, eftersom skriptändringar inte utlöser
arkets redigeringsutlösare (se `scripts/apps-script/ads-offline-import.gs`).

## Installation

Flödet från sajten till arket får inte påverkas. Testa därför mot en kopia
först:

0. **Testa mot en kopia.** Arkiv > Gör en kopia av lead-arket och sätt
   `ARK_ID` till kopians ID i steg 1. Prova backofficet där. När det fungerar:
   notera arkets versionshistorik så att ni kan backa, byt `ARK_ID` till det
   riktiga arket och kör `installera()` igen. Skicka direkt ett testlead från
   sajten och kontrollera att raden hamnar precis under den senaste och att
   notismejlet kommer som vanligt.
1. **Apps Script-bryggan.** Följ stegen överst i
   `scripts/apps-script/backoffice.gs`. Det är ett eget, fristående projekt.
   Sätt projektets tidszon till Europe/Stockholm (Projektinställningar).
   `installera()` lägger till kolumnerna ID, Anteckning, Påminnelse, Logg och
   Arkiverad längst till höger, ger alla rader ett ID och startar en utlösare
   som varje minut ger nya leads ID och kryssrutor (Bokad till Arkiverad).
   Den går att köra igen utan risk, och den stoppar om sista raden i arket
   skulle flyttas. `kontroll()` visar var nästa lead hamnar.
2. **Miljövariabler i Vercel** (Production):

   | Namn | Värde |
   | --- | --- |
   | `BACKOFFICE_SCRIPT_URL` | bryggans `/exec`-URL |
   | `BACKOFFICE_TOKEN` | samma som skriptegenskapen `BACKOFFICE_TOKEN` |
   | `BACKOFFICE_ANVANDARE` | `Simon:långtlösen,Erik:annatlösen` (minst 8 tecken) |
   | `BACKOFFICE_SESSION_SECRET` | slumpad sträng, minst 32 tecken |
   | `CRON_SECRET` | slumpad sträng, Vercel skickar den till det dagliga jobbet |
   | `BACKOFFICE_SAMMANFATTNING_TILL` | t.ex. `simon@sandsab.se` (valfri, kommaseparerad) |
   | `BACKOFFICE_AUTOUTSKICK` | `1` för automatiska kundmejl, annars utelämna |
   | `GOOGLE_CALENDAR_CLIENT_ID`, `GOOGLE_CALENDAR_CLIENT_SECRET`, `GOOGLE_CALENDAR_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID` | kalendern, se `docs/GOOGLE_KALENDER.md` (valfria) |

   `RESEND_API_KEY`, `LEAD_FROM_EMAIL` och `LEAD_REPLY_TO` finns redan och
   används även här.
3. Redeploya och logga in på `https://www.sandsab.se/admin`.

## Inloggningen är avslagen utanför Production

Tills vidare krävs lösenord bara i Vercel Production. I Preview och lokalt
släpps alla in direkt, och loggen får namnet i `BACKOFFICE_UTAN_INLOGGNING`
(valfri, annars "Test"). Previewn skyddas då bara av Vercels egen
inloggning, så dela inte en publik länk till den när den läser ett ark med
riktiga kunduppgifter.

## Lokalt

```
BACKOFFICE_DEMO=1 npm run dev
```

Öppna `/admin`, i demoläget behövs ingen inloggning. Det använder påhittade
leads i minnet, skriver inget till arket och skickar inga mejl. Det går inte
att slå på i Vercel Production.

## Kända begränsningar i första versionen

- Ett lösenord per person i en miljövariabel, ingen lösenordsåterställning.
  Byt lösenord i Vercel och redeploya.
- Ingen spärr mot många inloggningsförsök utöver en kort fördröjning.
- Kryssar man i "Offert skickad" direkt i arket finns inget datum i loggen,
  och då föreslås ingen automatisk uppföljning (manuellt går det).
- Varje sidvisning läser hela arket via Apps Script, ungefär 1 till 3 sekunder.
