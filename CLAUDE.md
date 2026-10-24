@AGENTS.md

## Specifikationer
Copy- och strukturspecifikationer ligger i parallellt repo: `/Users/wherkligheten/Sands-web/` (startsida, tjänster, FAQ, områden, design, sitemap).

## Projektregler

**Läs alltid `SEO.md` innan du ändrar copy, metadata, rubriker, FAQ eller strukturerad data.** Den innehåller obligatoriska regler för sökintention, synonymkluster, copy-regler (vad som aldrig får skrivas), prisformatering och teknisk SEO.

Kort sammanfattning av det viktigaste:
- **CTA:** två kanoniska strängar, kontext bestämmer vilken:
  - **Persistent UI** (header, sticky mobil-footer, form-submit): "Få prisförslag"
  - **In-page primary** (hero, slutet av sektioner, mellan content): "Boka kostnadsfri takkontroll"
  - **Aldrig:** "Få gratis offert", "Kontakta oss", "Få offert", eller "Boka takkontroll" utan "kostnadsfri" (förutom som rubrik/eyebrow)
  - **Undantag (beslut 19 okt 2026):** offertflödet på /priser och /taktest (`components/Offertflode.tsx`) och annonslandningssidorna under /lp (`components/LpQuiz.tsx`) har knappen "Få gratis offert", eftersom det ligger närmast intentionen. Gäller bara där.
- **Priser:** alltid med "från" eller "efter kostnadsfri takkontroll"
- **Förbjudet:** "familjeföretag", "Järfälla", syntetiska recensioner
- **Synonymer:** varje service-sida måste väva in minst 3 av: takbyte, byta tak, lägga om tak, lägga nytt tak, omläggning av tak
- **JSON-LD:** RoofingContractor + FAQPage på alla service-sidor
- **Konvertering:** rör ALDRIG `/tack`-sidan eller gtag-koden utan explicit godkännande
- **Prestanda:** hero-bild = LCP-elementet, alltid `priority` + `fetchPriority="high"`, aldrig lazy

## Skrivregler

**Använd ALDRIG em-streck (`—`) någonstans.** Varken i copy, kommentarer, commit-meddelanden eller mina svar till användaren. Gäller även en-streck (`–`) utom när det är en sifferintervall (t.ex. "25 000–60 000 kr"). Ersätt med komma, kolon, parenteser eller dela i två meningar beroende på vad som läses bäst.

## Kvalitetskontroll (harness)
- `npm run regelkoll` granskar tillagda rader mot reglerna ovan (CTA, förbjudna ord, streck, hårdkodade priser, /tack och konverteringskoden). `--staged` inför commit, `--alla` för en full genomgång.
- `npm run test:e2e` kör flödestesterna i `e2e/` (landningssidan, /priser, startsidan) på en mobil i 375×667. All trafik utanför localhost stoppas och /api/lead fångas, så inga riktiga leads eller konverteringar skickas. I Claude Code i molnet: `PW_CHROMIUM=/opt/pw-browsers/chromium UTAN_SANITY=1 npm run test:e2e`.
- `.github/workflows/kvalitet.yml` kör regelkontroll, lint på ändrade filer, typkontroll, bygge och flödestesterna på varje PR mot main. Röd kontroll betyder ingen merge.
- Ändras ett flöde medvetet (ny knapptext, nytt steg) uppdateras testet i samma PR.
