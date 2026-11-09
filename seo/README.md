# SEO-loopen

En loop som varje vecka läser Search Console, följer upp tidigare
ändringar och föreslår nya. Varje ändring loggas med en hypotes och mäts
mot hela sajten, så att vi lär oss vad som fungerar på just den här
sajten och inte gissar.

## Filer

- `seo/regler.mjs`: trösklar, vilken sida som äger vilket ämne, och hur
  ändringar mäts.
- `seo/experiment.json`: varje ändring med datum, sida, typ, hypotes och
  målfrågor. Utfall och lärdom fylls i när mätningen är klar.
- `scripts/seoloop.mjs`: läser Search Console-exporter och skriver
  rapporten. Ändrar ingenting på sajten.
- `seo/varv/ÅÅÅÅ-MM-DD.md`: rapporten från varje varv, med förslagen och
  Eriks svar.

## Ett varv

1. **Hämta data** från Search Console (`sc-domain:sandsab.se`, bara
   Sverige: filtret `country equals swe`) via Cogny:
   - Dimensionerna `query` och `page`, senaste 28 dagarna (Search Console
     ligger två till tre dagar efter).
   - Samma sak för de 28 dagarna innan.
   - Dimensionerna `date` och `page`, minst 60 dagar bakåt.

   Spara raderna (`rows`) som JSON.
2. **Rapport:**
   `npm run seo -- --nu <fil> --fore <fil> --daglig <fil> --period-nu "<text>" --period-fore "<text>" --ut seo/varv/<datum>.md`
3. **Förslag:** Claude läser rapporten, SEO.md och sidorna som berörs och
   skriver högst tre förslag i varvets fil, med data, hypotes och hur de
   mäts.
4. **Erik godkänner.** Godkända ändringar görs i en PR som vanligt, med
   regelkontroll och flödestester.
5. **Logga** ändringen i `seo/experiment.json` samma dag som den går live.
6. **Mät** i varje varv. När en ändring har minst 21 dagars data efter,
   och resultatet håller över två varv, skrivs utfall och lärdom in och
   status blir `avslutad`. Lärdomar som håller blir nya regler, till
   exempel en ny mall för titlar.

## Principer

- **En ändring per sida i taget.** Två ändringar på samma sida inom
  mätfönstret går inte att skilja åt. `npm run seo:test` stoppar det om
  det inte finns en anteckning om varför.
- **Mät mot sajten.** En sidas förändring jämförs med hela sajtens under
  samma dagar, så att säsong och algoritmändringar räknas bort.
- **Högst tre förslag per varv.**
- **Inga påhittade uppgifter.** Priser hämtas ur `lib/material.ts`, betyg
  ur `lib/testimonials.ts`, och tjänster eller löften som Sands inte har
  bekräftat skrivs inte.
- `npm run seo:test` kontrollerar experimentloggen och att varje ämne
  pekar på en sida som finns. Det körs i CI på varje PR.

## Konkurrenter

Loopen följer Vesivek, Villatakexperten och Takhero (`seo/konkurrenter.mjs`).

- `npm run seo:konkurrenter -- --ut seo/varv/<datum>-konkurrenter.md` läser
  deras sitemaps, jämför med förra veckans ögonblicksbild i
  `seo/konkurrenter/<domän>.json` och läser titel, beskrivning och rubriker
  på nya och ändrade sidor om tak. Första varvet läser de sidor om tak som
  finns. Adresserna kopplas till våra ämnen i `seo/regler.mjs`.
- robots.txt följs, högst 25 sidor läses per konkurrent och varv, med en
  paus mellan anropen. Loopen presenterar sig som SandsSEOLoop, utan
  personuppgifter.
- Sajterna nås bara från environmentet **sands-web-app**, som tillåter dem.
  En misslyckad hämtning skriver inte över förra veckans bild.
- Googles sökresultat läses inte, så placeringar finns bara för våra egna
  sidor.
