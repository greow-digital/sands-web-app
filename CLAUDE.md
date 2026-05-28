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
- **Priser:** alltid med "från" eller "efter kostnadsfri takkontroll"
- **Förbjudet:** "familjeföretag", "Järfälla", syntetiska recensioner
- **Synonymer:** varje service-sida måste väva in minst 3 av: takbyte, byta tak, lägga om tak, lägga nytt tak, omläggning av tak
- **JSON-LD:** RoofingContractor + FAQPage på alla service-sidor
- **Konvertering:** rör ALDRIG `/tack`-sidan eller gtag-koden utan explicit godkännande
- **Prestanda:** hero-bild = LCP-elementet, alltid `priority` + `fetchPriority="high"`, aldrig lazy

## Skrivregler

**Använd ALDRIG em-streck (`—`) någonstans.** Varken i copy, kommentarer, commit-meddelanden eller mina svar till användaren. Gäller även en-streck (`–`) utom när det är en sifferintervall (t.ex. "25 000–60 000 kr"). Ersätt med komma, kolon, parenteser eller dela i två meningar beroende på vad som läses bäst.
