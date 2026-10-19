---
name: manadsrapport
description: >
  Månadsrapport för sandsab.se: leads per källa ur lead-arket, Google Ads,
  GA4, Search Console, Core Web Vitals och ett AI-synlighetstest där samma
  kundfrågor ställs till AI-assistenter varje månad. Använd när någon ber om
  månadsrapport, "hur gick förra månaden", marknadsrapport, AI-synlighet,
  "syns vi i ChatGPT" eller liknande. Argument: månad som YYYY-MM (standard
  är senaste hela kalendermånaden).
argument-hint: "[YYYY-MM]"
---

# Månadsrapport, Sands Entreprenad

Läs `SEO.md` och `CLAUDE.md` innan du skriver rapporten. Rekommendationer får aldrig bryta mot reglerna där (CTA-strängar, prisformat, förbjudna ord, `/tack` och gtag-koden är orörbara).

Rapporten är läsning och analys. Den ändrar ingenting i Google Ads, GA4, GTM, Search Console eller koden. Förslag på åtgärder skrivs i rapporten och genomförs bara efter ett separat ja.

## Period

- Rapportmånad: argumentet `YYYY-MM`, annars senaste hela kalendermånaden.
- Jämförelse: månaden innan. Om en tidigare rapport finns i `docs/rapporter/` läses den in för trender, särskilt AI-synlighetstabellen.
- Search Console har cirka tre dagars eftersläpning. Körs rapporten före den 4:e, säg att sista dagarna kan saknas.

## Källor och ID:n

| Källa | Verktyg | ID |
|---|---|---|
| Lead-arket (sanningen om leads) | Google Drive `read_file_content` | `1KGAWjJeJJ36sadfyodyEpPbbSpzKEWOIbQ9Z_2Tl5Uc` |
| Google Ads | Cogny `tool_execute_gaql` | kund-ID `4767554827` |
| GA4 | Cogny `tool_run_report` | property `528115518` |
| Search Console | Cogny `tool_get_search_analytics` | `sc-domain:sandsab.se` |
| Core Web Vitals | WebFetch mot PageSpeed Insights API | `https://www.sandsab.se/` |

Hämta allt i en parallell omgång. Om en källa fallerar: skriv ut vilken och varför i avsnittet "Datakällor" och fortsätt. En källa som saknas får aldrig se ut som en nolla.

## Steg 1: Leads ur arket

Kolumner: `Tidpunkt | Namn | Telefon | E-post | Taktyp | Yta m² | Meddelande | Källa | GCLID`.

- Räkna rader per månad och per `Källa` (värdena kommer från `lib/lead-source.ts`: offertformular, startsida, tjanstesida, omradessida, landningssida, taktest, priskalkylator, popup, voice).
- Räkna hur många som har GCLID, det vill säga kom via Google Ads.
- Flagga troliga dubbletter (samma telefon eller e-post inom 24 timmar) och räkna dem separat.
- **Personuppgifter:** kopiera aldrig namn, telefon, e-post eller meddelanden in i rapporten. Bara antal och fördelningar.

## Steg 2: Google Ads

```sql
SELECT campaign.name, campaign.status, metrics.cost_micros, metrics.clicks,
  metrics.impressions, metrics.conversions, metrics.search_impression_share,
  metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share
FROM campaign
WHERE segments.date BETWEEN '<start>' AND '<slut>' AND metrics.impressions > 0
```

```sql
SELECT campaign.name, segments.conversion_action_name, metrics.conversions, metrics.all_conversions
FROM campaign
WHERE segments.date BETWEEN '<start>' AND '<slut>' AND metrics.all_conversions > 0
```

Redovisa per kampanj: kostnad, klick, CPC, konverteringar, CPA och impression share (förlorad på rank och på budget). Hämta också topp 10 sökord på kostnad från `keyword_view` med konverteringar. Jämför med baslinjen och målen i `docs/paid-search-plan.md`.

**Attribution, ärligt:** ställ Ads-konverteringar (form_submit plus phone_click) bredvid antalet ark-leads med GCLID. Siffrorna kommer att skilja sig. Redovisa båda, förklara glappet i en mening och styr på kostnad per ark-lead med GCLID. Hitta aldrig på en blandad siffra. "Local actions" räknas inte som leads.

## Steg 3: GA4

Filtrera alltid på `hostName = www.sandsab.se` (annars kommer localhost och testtrafik med).

- Sessioner och key events per `sessionDefaultChannelGroup`.
- Key events per `eventName` (form_submit, phone_click, generate_lead).
- Topp 10 `landingPage` på sessioner, med form_submit per sida.
- Konverteringsgrad per kanal.

## Steg 4: Search Console

- Totalt: klick, visningar, CTR, snittposition, mot föregående månad.
- Topp 25 sökfrågor och topp 15 sidor.
- **Synonymklustret i SEO.md §3:** filtrera sökfrågor som innehåller takbyte, byta tak, lägga om tak, lägga nytt tak, omläggning, takläggare, och redovisa varje kluster separat.
- Möjligheter: frågor med många visningar och position 5 till 20 (sidan finns men rankar inte högt nog), samt sidor där CTR ligger klart under snittet för sin position.
- Kannibalisering: samma sökfråga där två eller fler sidor får visningar.

## Steg 5: Core Web Vitals

Enligt SEO.md §11.5 ska fältdata loggas varje månad. Hämta:

`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://www.sandsab.se/&strategy=mobile`

Redovisa fältdata (`loadingExperience`: LCP, INP, CLS) och labbpoäng. Kör också `/priser` och en tjänstesida. Jämför med baslinjen i SEO.md §11.2. Går API:t inte att nå, skriv det och gå vidare.

## Steg 6: AI-synlighetstest

Syftet är att se om AI-assistenter hittar Sands, och om de återger fakta rätt. Det handlar om läsbarhet och korrekta fakta, aldrig om att försöka styra vad en AI rekommenderar. Föreslå aldrig dold text, instruktioner riktade till AI i sidinnehåll eller påhittade recensioner.

### Frågorna

Ställ alltid exakt samma frågor, så att månaderna går att jämföra. Lägg bara till nya frågor längst ner och behåll de gamla.

1. Vilken takläggare ska jag anlita i Stockholm?
2. Vilka är de bästa företagen för takbyte i Stockholm?
3. Vad kostar det att byta tak på en villa i Stockholm?
4. Jag vill lägga om taket på min villa i Täby, vilka företag kan jag kontakta?
5. Takläggare i Nacka, vem rekommenderar du?
6. Vem kan byta eternittak i Stockholm?
7. Mitt tak läcker, vilket takföretag i Stockholm kan komma ut?
8. Vad vet du om Sands Entreprenad?
9. Vad har Sands Entreprenad för omdömen?

### Hur frågorna ställs

Använd det som finns i sessionen, och skriv i rapporten exakt vilket sätt som användes för varje assistent:

- **Claude:** ställ varje fråga via WebSearch (`standard`) och bedöm svaret utifrån de källor som kommer tillbaka. Det är en approximation av Claude med webbsök, inte claude.ai-appen.
- **ChatGPT, Perplexity och Googles AI-översikt:** om den inbyggda webbläsaren eller Claude in Chrome finns, ställ frågorna där i en ny, utloggad flik. Finns ingen av dem, skriv ut frågelistan och be användaren klistra in svaren. Fyll aldrig i ett svar som inte faktiskt hämtats.

### Vad som noteras per fråga och assistent

| Fält | Innehåll |
|---|---|
| Nämns Sands? | ja / nej |
| Placering | ordning i listan om flera företag nämns |
| Konkurrenter | vilka som nämns (t.ex. Vesivek, Villatakexperten) |
| Källor | vilka sidor som citeras (sandsab.se, Brabyggare, Offerta, Servicefinder, Reco, Google-profilen) |
| Faktafel | allt som inte stämmer med `public/llms.txt`, `lib/testimonials.ts` och sajten: priser, garanti, område, omdömen, telefon |

Svaren varierar mellan körningar. Redovisa vad som hände, ge aldrig en "synlighetspoäng" och dra inga slutsatser av en enskild månad. Trenden över flera månader är det som säger något.

### Om Sands inte nämns

Ta reda på vilka källor de nämnda konkurrenterna hämtas från. Föreslå konkreta åtgärder som gäller fakta och närvaro: Google-företagsprofilen, recensionsplattformar, `llms.txt`, schema i SEO.md §10 eller sidinnehåll som svarar på frågan.

## Steg 7: Skriv rapporten

Spara som `docs/rapporter/YYYY-MM.md`, i den här ordningen:

1. **Sammanfattning:** högst fem meningar. Leads totalt och mot förra månaden, kostnad per lead, största förändringen, viktigaste åtgärden.
2. **Leads:** tabell per källa, andel med GCLID, dubbletter.
3. **Google Ads:** kampanjtabell, attributionsjämförelse, topp-sökord.
4. **Webbplats (GA4):** kanaler, landningssidor, konverteringsgrad.
5. **Organisk sök (Search Console):** totaler, synonymkluster, möjligheter, kannibalisering.
6. **Core Web Vitals:** tabell mot baslinjen.
7. **AI-synlighet:** en rad per fråga och assistent enligt tabellen ovan, plus jämförelse med förra månaden.
8. **Åtgärder:** högst fem, rangordnade efter effekt. Var och en med vad, varför (med siffran som motiverar den), var i koden eller kontot och om den kräver godkännande.
9. **Datakällor:** vad som hämtades, när, och vad som saknades.

Skrivregler: svenska, inga em-streck, en-streck bara i sifferintervall, siffror med mellanslag som tusentalsavgränsare ("15 000 kr"), priser alltid med "från". Inga personuppgifter.

När filen är skriven: visa sammanfattningen och åtgärderna i chatten. Committa rapporten bara om användaren ber om det.
