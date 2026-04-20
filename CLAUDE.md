@AGENTS.md

## Specifikationer
Copy- och strukturspecifikationer ligger i parallellt repo: `/Users/wherkligheten/Sands-web/` (startsida, tjänster, FAQ, områden, design, sitemap).

## Projektregler

**Läs alltid `SEO.md` innan du ändrar copy, metadata, rubriker, FAQ eller strukturerad data.** Den innehåller obligatoriska regler för sökintention, synonymkluster, copy-regler (vad som aldrig får skrivas), prisformatering och teknisk SEO.

Kort sammanfattning av det viktigaste:
- **CTA:** alltid "Boka kostnadsfri takkontroll" — aldrig "Få gratis offert" eller "Kontakta oss"
- **Priser:** alltid med "från" eller "efter kostnadsfri takkontroll"
- **Förbjudet:** "familjeföretag", "Järfälla", syntetiska recensioner
- **Synonymer:** varje service-sida måste väva in minst 3 av: takbyte, byta tak, lägga om tak, lägga nytt tak, omläggning av tak
- **JSON-LD:** RoofingContractor + FAQPage på alla service-sidor
- **Konvertering:** rör ALDRIG `/tack`-sidan eller gtag-koden utan explicit godkännande
- **Prestanda:** hero-bild = LCP-elementet, alltid `priority` + `fetchPriority="high"`, aldrig lazy
