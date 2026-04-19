# SEO & Content Guidelines – Sands Entreprenad

Den här filen är projektets referens för SEO, copy och sökintention. Läs den innan du bygger en ny sida, lägger till ett nytt content-block eller ändrar metadata på en befintlig sida. Den är grundad i en faktisk analys av 30 dagar Google Ads-sökdata (mars–april 2026) mot den svenska takläggar-marknaden i Stockholm.

Dokumentet är beskrivet som **regler + bakgrund**. Reglerna är obligatoriska. Bakgrunden är "därför" så att du kan fatta rimliga beslut i edge cases.

---

## 1. Affärskontext (bakgrund)

**Kund:** Sands Entreprenad Stockholm AB. Verksamhet: takläggning och takbyten i Stockholms län. Affärsmodellen är **totalentreprenad enligt ABT 06** med fast pris efter kostnadsfri besiktning. Primär geografisk målgrupp: villaägare i Stockholm + närförorter (Täby, Solna, Sollentuna, Nacka, Lidingö, Danderyd, Huddinge, Norrtälje).

**Konkurrentlandskap:** Vesivek, Villatakexperten m.fl. leder med **besiktning/konsultation** som primär CTA, inte "offertförfrågan". De använder **Reco** för verifierade recensioner. Sands positioneras i samma riktning.

**Primär CTA överallt:** `Boka kostnadsfri takbesiktning`. Konverteringsdestination: `/tack`. Conversion-event fyrar via gtag på `/tack` — rör aldrig den filen utan explicit godkännande.

**Teknisk verklighet påverkar SEO lika mycket som copy:** Core Web Vitals är ett Google-rankingkriterium och ingår i Google Ads Quality Score som "landing page experience". Se §11 för aktuell baslinje och mål — kort version: mobil LCP är idag 4,4 s i fältdata, vilket är "Poor" och bromsar både organisk ranking och ad cost.

---

## 2. Sökintentionshierarki

När du bygger en ny sida, vet först **vilken intention** sidan tjänar. Hierarkin nedan är i fallande klick-volym från faktisk data:

1. **Pris/kostnad för takbyte** – dominerande intention. "pris", "kostnad", "från X kr/m²", "ROT-avdrag". Alla service-sidor måste adressera detta above the fold.
2. **Materialspecifikt takbyte** – "tegeltak pris", "kostnad byta plåttak", "papptak pris", "byta eternittak". Varje material förtjänar egen sektion eller egen sida.
3. **Synonymkluster för takbyte** – se §3. Kritiskt för Quality Score.
4. **Geografiskt** – "takläggare [förort]". Lång svans med tydlig köpintention.
5. **Skada/läckage** – "taket läcker", "fuktskada tak", "ruttet tak". Akutintention, besiktnings-CTA.
6. **Brand** – "sands entreprenad". Ska landa på startsida eller dedikerad om-sida.
7. **Informationellt** – "vad är eternit", "hur länge håller tegeltak". Lågt konverterande men bygger topical authority. Bloggformat, inte ads-landningssidor.

---

## 3. Obligatoriskt synonymkluster

Detta är den enskilt viktigaste regeln i dokumentet. Användare söker på **flera olika ord** för samma sak. Google flaggar sidor som "low quality" när sidan bara täcker en av varianterna. På varje service-sida **måste** följande synonymer förekomma i copy, helst tidigt:

**Takbyte-kluster (alltid minst 3 av dessa i hero/intro):**
- takbyte
- byta tak
- lägga om tak
- lägga nytt tak
- omläggning av tak
- ny takläggning

**Pris-kluster (alltid minst 2):**
- pris
- kostnad
- från [X] kr/m²
- pris per kvadratmeter

**Material-kluster** (när relevant för sidan):
- tegeltak, tegelpannor, byta takpannor
- plåttak, byta plåttak
- papptak, byta papptak, tätskikt
- betongtak, betongpannor
- eternittak, byta eternittak

**Geografi-kluster:**
- Stockholm (alltid)
- relevant förort om sidan är geospecifik

Väv in naturligt — det får aldrig kännas som keyword-stuffing. En enda välformulerad mening kan täcka 4–5 synonymer: *"Byta tak, lägga om tak eller lägga nytt tak? Vi tar helhetsansvar för takbyte i hela Stockholms län."*

---

## 4. Copy-regler – alltid

- **Primär CTA:** `Boka kostnadsfri takbesiktning`. Samma wording överallt.
- **Prispunkter:** alltid prefixerade med `från` eller följda av `efter kostnadsfri besiktning`. Aldrig som garanterat slutpris.
- **Trust-triad:** fast pris · kostnadsfri besiktning · 30 års garanti. Minst två av tre på varje service-sida.
- **ROT-avdrag:** nämn där det är relevant (arbetskostnad 30 %). Viktigt för konvertering, inte för ranking.
- **Totalentreprenad / ABT 06:** behåll som trovärdighetssignal. Är inte sökord, men signalerar seriositet.
- **Telefonnummer:** synligt i header som `tel:`-länk. Konkurrentanalys visar att det höjer CTR.
- **Social proof:** riktiga projektbilder (Instagram @sandsentreprenad, 120+ st) och verifierade recensioner (Reco när vi bygger upp det). Detta är en strategisk prioritering.

## 5. Copy-regler – aldrig

- Aldrig **"familjeföretag"**.
- Aldrig **"Järfälla"** (kunden är Stockholm-fokuserad i positionering).
- Aldrig byt CTA till **"Få gratis offert"**, **"Kontakta oss"** eller liknande. Besiktnings-framingen är en medveten differentiering mot konkurrenter.
- Aldrig garantera slutpris utan besiktning.
- Aldrig syntetiska/uppdiktade recensioner, kundcitat eller case. Om en sektion behöver social proof och vi inte har källa — flagga och stanna.
- Aldrig hårdkoda priset `1 200 kr/m²` på flera ställen. Centralisera i en konstant eller content-fil så det kan uppdateras på ett ställe.
- Aldrig använd ABT 06 / totalentreprenad som H1-rubrik. Kontraktuell signal, inte hero-copy.

---

## 6. Page template – struktur för service-sidor

Varje service-sida (takbyte, plåttak, tegeltak, papptak, eternittak, skada/läckage, geografi) följer samma grundmall:

1. **Metadata**
   - Title ≤60 tecken med: primär sökterm + `Stockholm` + brand
   - Description ≤155 tecken med: 2 synonymer + pris/kostnad + Stockholm + trust-triad
   - OpenGraph + Twitter cards speglar title/description
2. **H1** som upprepar primär sökterm + geografi
3. **Hero-subhead** med synonymkluster (§3) invävt naturligt
4. **Primär CTA** `Boka kostnadsfri takbesiktning`
5. **Prissektion** (H2: `Vad kostar det att [verb]?`) med prispunkter, trust-triad, ROT-referens, CTA-repris
6. **Material-/tjänst-sektion(er)** med H2/H3 som innehåller pris eller kostnad
7. **Skada/läckage-sektion** om sidan passar (för akut-intention)
8. **Social proof** – projektbilder + recensioner
9. **FAQ** (visad öppen, inte accordion — SEO- och CRO-fördel)
10. **Avslutande CTA**
11. **JSON-LD** – `RoofingContractor` (page-level) + `FAQPage` (om FAQ finns)

Avsteg från mallen ska vara motiverat. Dokumentera motiveringen i PR:n.

---

## 7. Metadata-exempel (mall)

```
Title:       Takbyte Stockholm – Fast pris på att lägga om tak | Sands
Description: Lägga om tak eller byta tak i Stockholm? Fast pris från 1 200 kr/m², kostnadsfri takbesiktning och 30 års garanti. Tegel, plåt, papp, betong, eternit.
H1:          Takbyte i Stockholm – fast pris när du ska lägga om taket
```

Varianter per sida:

- **Plåttak:** `Plåttak Stockholm – Kostnad för att byta plåttak | Sands`
- **Tegeltak:** `Tegeltak Stockholm – Pris och omläggning | Sands`
- **Papptak:** `Papptak Stockholm – Pris per m² och byte | Sands`
- **Eternittak:** `Eternittak Stockholm – Byta eternittak tryggt | Sands`
- **Skada:** `Taket läcker? Akut takbesiktning Stockholm | Sands`
- **Geo (exempel):** `Takläggare Täby – Takbyte & fast pris | Sands`

---

## 8. FAQ-bibliotek – frågor som motsvarar faktiska sökfraser

Återanvänd från detta bibliotek när du bygger FAQ-sektioner. Frågorna är formulerade nära exakt sökfras för att matcha People-Also-Ask och Quality Score.

- Vad kostar det att lägga om tak?
- Vad kostar det att byta tak?
- Vad kostar takbyte per kvadratmeter?
- Hur mycket kostar det att byta takpannor?
- Vad kostar det att byta plåttak?
- Vad kostar det att byta papptak?
- Vad kostar det att byta tegeltak?
- Vad kostar det att byta eternittak?
- Kan man få ROT-avdrag på takbyte?
- Mitt tak läcker – vad gör jag?
- Hur vet jag om taket behöver bytas?
- Hur länge håller ett nytt tak?
- Hur lång tid tar ett takbyte?
- Måste jag flytta ut under takbytet?
- Vad ingår i en kostnadsfri takbesiktning?
- Vilket takmaterial är bäst?

Svar ska vara 2–4 meningar, konkreta, och sluta med en mjuk hänvisning till besiktningen som nästa steg.

---

## 9. Negativa nyckelord (referens)

Dessa undviks aktivt i Ads och vi bygger inte sidor för dem (lågt kommersiellt värde):

```
själv / gör det själv
hyra
jobb
utbildning
bild / bilder
ritning
takstol
takfönster (om vi inte säljer det)
snörasskydd (om vi inte säljer det)
```

Var försiktig med `eternittak` ensamt — det är ofta informationell sökning ("är eternit farligt"). Material-sidan för eternit ska adressera säkerhet/sanering tydligt, annars blir CTR låg.

---

## 10. Strukturerad data

På varje publicerad sida (minst):

- **RoofingContractor** (sub-typ av LocalBusiness) med `name`, `address`, `telephone`, `geo`, `areaServed` (Stockholms län + förorter), `priceRange`, `url`, `image`.
- **FAQPage** om sidan har FAQ-sektion, spegla innehållet 1:1.

När recensionsdata finns:

- **aggregateRating** inom RoofingContractor med källa (Reco). Uppdatera inte med gissade siffror — bara verifierad data.

När en specifik tjänst beskrivs:

- **Service** schema kopplat till RoofingContractor, med `serviceType` (t.ex. "Takbyte", "Takbesiktning"), `areaServed`, `offers` (prisintervall).

JSON-LD läggs via Next.js metadata-standard eller i layout — aldrig inline i `<body>`.

---

## 11. Teknisk SEO & prestanda

Teknisk SEO påverkar både organisk ranking (Core Web Vitals är ett Google-rankingkriterium sedan 2021) **och** Google Ads Quality Score via signalen "landing page experience". Långsamma sidor, CLS och dålig tillgänglighet försämrar båda samtidigt. Därför är tekniska regler lika viktiga som copy-regler på det här projektet.

### 11.1 Core Web Vitals – mål vs baslinje

Mål (mobil, fältdata från CrUX):

| Metric | Mål | "Needs improvement" | "Poor" |
|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2,5 s | 2,5–4,0 s | > 4,0 s |
| **INP** (Interaction to Next Paint) | ≤ 200 ms | 200–500 ms | > 500 ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0,1 | 0,1–0,25 | > 0,25 |

Kompletterande lab-metrics att hålla koll på: FCP ≤ 1,8 s · TBT ≤ 200 ms · Speed Index ≤ 3,4 s.

### 11.2 Aktuell baslinje – `sands-web-app.vercel.app` (mobil)

Senast mätt: **2026-04-17** via PageSpeed Insights.

**Lighthouse-score (mobil):** Performance 84 · Accessibility 92 · Best Practices 100 · SEO 100.

**Core Web Vitals (fältdata, riktiga användare):**

| Metric | Värde | Status |
|---|---|---|
| FCP | 0,9 s | Bra |
| **LCP** | **4,4 s** | **Poor – ranking-handikapp** |
| TBT | 110 ms | Bra |
| CLS | 0 | Utmärkt |
| Speed Index | 2,3 s | Bra |

**Lab-mätningar (simulerade):** LCP 0,7 s, TBT 170 ms. Klyftan mellan lab (0,7 s) och fält (4,4 s) är signalen att resursleverans i verkliga 4G-nät är problemet — inte själva renderingen.

**Kända problem att prioritera:**

1. **LCP 4,4 s i fält** – tyngst att lösa, störst ranking-effekt. Hero-bilden är troligtvis LCP-elementet. Åtgärder: dedikerad mobil hero-variant (WebP/AVIF), `fetchpriority="high"`, `preload` av hero-bild i `<head>`, inlinea critical CSS för hero.
2. **Improve image delivery – est. savings 48–190 KiB** – modernare format, rätt dimension per breakpoint (inte desktop-bild på mobil), `srcset`/`sizes` där det saknas.
3. **Render blocking requests – est. savings 140 ms** – fonts eller CSS som blockerar FCP. Använd `font-display: swap`, preload nyckel-fonts, inlinea kritisk CSS.
4. **Reduce unused JavaScript – est. savings 80 KiB** – code-split per route, ladda third-party (analytics/chat) med `next/script strategy="lazyOnload"` eller `afterInteractive`.
5. **Legacy JavaScript – est. savings 14 KiB** – verifiera att Next.js bygger för moderna browsers (`browserslist` begränsad till nyare targets).
6. **LCP request discovery / Network dependency tree** – LCP-bilden upptäcks sent i kedjan. Lägg den direkt i initial HTML, inte lazy-loadad eller importerad via JS.
7. **Forced reflow** – en script-körning triggar layout-pass. Leta i initial render-stacken (ofta scroll/resize-listeners i tredjepartslibbar).

**Tillgänglighet (påverkar SEO indirekt + är rätt sak):**

- **Select utan associerat label** – alla `<select>` måste ha `<label for="...">` eller `aria-label`.
- **Kontrastproblem** – minst en textkombination saknar 4,5:1-kontrast (3:1 för stor text). Troligen ljusgrå hjälptext. Fixa i design tokens, inte per komponent.

### 11.3 Hero-bilden förtjänar särskild omsorg

LCP-elementet är med stor sannolikhet hero-bilden. Det gör den till den **enskilt viktigaste prestanda-resursen** på varje sida. Regler:

- En mobilvariant ≤ 100 KiB, AVIF eller WebP, rätt dimension för 375–430 px viewport
- `<Image priority fetchPriority="high">` (Next.js) eller `<link rel="preload" as="image" imagesrcset="...">` i `<head>`
- Aldrig lazy-loadad
- Aldrig laddad via CSS `background-image` (försvårar preload + gömmer sig från LCP-detektion)
- Aldrig beroende av webfont för LCP-detektion — texten ovanpå hero ska renderas med `font-display: swap`

### 11.4 Obligatorisk checklista – varje ny eller ändrad sida

**Metadata & semantik**

- [ ] Exakt en `<h1>` per sida
- [ ] Title ≤ 60 tecken, unik per sida
- [ ] Meta description ≤ 155 tecken, unik per sida
- [ ] `<html lang="sv">`
- [ ] Canonical-tag pekar på sig själv
- [ ] `robots`: `index, follow` (om publik) — dra inte in staging-URL:er i Google
- [ ] Sitemap uppdaterad (om genereras manuellt)
- [ ] OpenGraph + Twitter cards komplett och matchar title/description
- [ ] JSON-LD validerar i Google Rich Results Test
- [ ] Bröd­text använder semantiska element (`<article>`, `<section>`, `<nav>`) – inte `<div>`-soppa

**Prestanda**

- [ ] PageSpeed Insights (mobil) körd efter större ändringar – Performance ≥ 85
- [ ] LCP ≤ 2,5 s i lab – fältdata följs upp separat efter 28 dagar
- [ ] CLS ≤ 0,1 (sidan har idag 0 – bibehåll det, undvik bilder/embedded media utan explicit width/height)
- [ ] Hero-bild: modern format, preload, `fetchPriority="high"`, rätt dimension per breakpoint
- [ ] Alla övriga bilder: `srcset`/`sizes`, lazy-loaded, WebP/AVIF, explicit `width`/`height` i markup
- [ ] Fonts: `font-display: swap`, preload endast kritiska varianter, subsetta
- [ ] Tredjepartsskript (gtag, chat, Reco widget) laddas med `strategy="lazyOnload"` eller `afterInteractive`
- [ ] Ingen render-blockerande CSS > 20 KiB
- [ ] Bundle-size per route granskad (t.ex. `@next/bundle-analyzer`) efter större tillägg

**Tillgänglighet (a11y)**

- [ ] Alla interaktiva element (inkl. `<select>`) har synligt label eller `aria-label`
- [ ] Textkontrast ≥ 4,5:1 (normal text) eller ≥ 3:1 (≥ 18 px eller fet ≥ 14 px)
- [ ] Fokusring synlig på alla interaktiva element
- [ ] Tangentbordsnavigerbar hela flödet inkl. CTA
- [ ] Bilder har `alt`-text (tomt `alt=""` för dekorativa)

**Konvertering & spårning**

- [ ] Primär CTA går till samma destination som övriga CTAs
- [ ] Konverteringsspårning på `/tack` verifierat fortfarande aktiv efter ändring
- [ ] Inga nya tredjepartsskript tillagda utan godkännande
- [ ] gtag/GA4-event firar i DevTools Network-tab

**Validering**

- [ ] Mobil rendering verifierad vid 375 px
- [ ] Tablet verifierad vid 768 px
- [ ] Desktop verifierad vid 1280 px
- [ ] Inga brutna interna länkar (kör en länkkontroll efter publicering)
- [ ] Lighthouse CI eller PSI-körning bifogad PR-beskrivning

### 11.5 Rutin – löpande mätning

- **Per PR med visuell påverkan:** kör PSI (mobil) innan merge och klistra in scores i PR-beskrivningen
- **Varje månad:** snapshot av CrUX-fältdata per sida, logga i en enkel tabell. Observera trend, inte enskilda dagar
- **Efter större releaser:** Search Console → Core Web Vitals-rapport 14–28 dagar efter release för att se om fält följer labb

### 11.6 Vad som särskilt påverkar den här projektkodbasen

Sidan är byggd som Next.js på Vercel (separat från Framer-sidan `offert.sandsentreprenad.se`). Det ger några specifika verktyg som ska utnyttjas:

- `next/image` är default för alla bilder. Undvik `<img>` utanför inbäddad markdown.
- `next/font` för alla fonts – aldrig `@font-face` manuellt eller `<link>` till Google Fonts direkt.
- `next/script` med `strategy` – aldrig `<script>` inline i page-komponenter.
- Metadata via `export const metadata` (App Router) eller `next/head` (Pages Router) – aldrig duplicerat mellan layout och sida.
- Vercel Analytics + Speed Insights är billiga att aktivera och ger kontinuerlig RUM-data (komplement till PSI fältdata).

---

## 12. Intern länkstrategi

När en ny sida publiceras:

- Länka **in** från minst 2 existerande sidor med meningsfull ankartext (använd synonymer från §3, inte "klicka här").
- Länka **ut** till relaterade tjänstesidor (t.ex. plåttak-sidan länkar till takbesiktning och till takbyte-huvudsidan).
- Undvik kannibalisering: två sidor ska inte tävla om samma primära sökfras. Om ämnet överlappar — slå ihop, eller differentiera tydligt per intention (t.ex. informationellt vs transaktionellt).

---

## 13. Innan du publicerar en ny sida – quality gate

Svara på dessa frågor i PR-beskrivningen:

1. **Primär sökintention?** (En mening, med exempel på sökfras.)
2. **Synonymkluster täckt?** (Lista de synonymer som finns i copy.)
3. **Pris-information above the fold?** (Ja/nej + hänvisning.)
4. **Primär CTA korrekt?** (`Boka kostnadsfri takbesiktning`, ja/nej.)
5. **Strukturerad data?** (Vilka schema-typer används.)
6. **Intern länkning?** (Från vilka sidor, till vilka sidor.)
7. **Kannibalisering?** (Finns det en existerande sida som konkurrerar? Hur differentieras de?)
8. **Copy-regler följda?** (Inga förbjudna termer, inga syntetiska citat, prispunkter har "från".)

Om något svar är "nej" eller otydligt — åtgärda innan merge.

---

## 14. När i tvivel

- **Stanna och fråga** hellre än att gissa copy. Speciellt kring prispunkter, garantier och recensioner.
- **Följ data, inte magkänsla.** "Takläggare" känns intuitivt som huvudordet — data säger att "takbyte" och "lägga om tak" dominerar. Bygg för det.
- **Granska konvertering separat från ranking.** Höjd CTR i Ads ≠ fler leads om CTA är svag. Båda måste hållas i huvudet.
- **Rör inte `/tack`** eller konverteringsspårningskoden. Någonsin. Utan uttryckligt godkännande.
