# Sökordsloopen

En loop som varje vecka går igenom vilka sökningar annonserna i kampanjen
Takläggning Stockholm faktiskt visades för, och föreslår negativa sökord
för de som inte kan bli kunder. Varje beslut Erik fattar blir en regel, så
loopen frågar mindre för varje varv.

## Filer

- `ads/sokordsregler.mjs`: reglerna. Vad som behålls, vad som blir negativt,
  spärrarna och Eriks beslut.
- `scripts/sokordsloop.mjs`: sorterar sökorden mot reglerna och skriver
  rapporten. Ändrar ingenting i Google Ads.
- `ads/varv/ÅÅÅÅ-MM-DD.md`: rapporten från varje varv, med Eriks svar.

## Ett varv

1. **Hämta data** från Google Ads (konto 4767554827) via Cogny:
   - Sökord med klick:
     `SELECT campaign.name, ad_group.name, search_term_view.search_term, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM search_term_view WHERE segments.date BETWEEN '<från>' AND '<till>' AND metrics.clicks > 0`
   - Sökord utan klick men med minst 3 visningar: samma fråga med
     `metrics.clicks = 0 AND metrics.impressions >= 3`.
   - Befintliga negativa sökord på kampanjnivå (`campaign_criterion`) och
     annonsgruppsnivå (`ad_group_criterion`), med `negative = TRUE`.

   Spara som JSON i det format som står överst i `scripts/sokordsloop.mjs`.
   Långa tankstreck i kampanjnamn byts mot bindestreck.
2. **Sortera:**
   `npm run sokord -- --sokord <sökord.json> --negativa <negativa.json> --ut ads/varv/<datum>.md --json <förslag.json>`
3. **Erik godkänner** förslagen och avgör de osäkra sökorden.
4. **Lägg in** de godkända negativa sökorden på kampanjnivå via Cogny.
5. **Skriv in besluten** i `BESLUT` (eller som nya regler) i
   `ads/sokordsregler.mjs`, och Eriks svar i varvets rapport.
6. **Mät** i nästa varv: andel klick som behålls, kostnad per lead och
   klickfrekvens på kärnsökorden.

## Spärrar

- Inget läggs in i Google Ads utan Eriks godkännande.
- Ett föreslaget negativt sökord får aldrig stoppa något i `KANDA_BRA` eller
  ett sökord som har gett en konvertering. Bryter det mot det hamnar
  sökordet bland de osäkra.
- Högst `MAX_PER_VARV` nya negativa sökord per varv.
- `npm run sokord:test` kontrollerar spärrarna och körs i CI på varje PR,
  så en regel som skulle stoppa en bra sökning kommer inte in i main.
- Rapporten visar också befintliga negativa sökord som stoppar en sökning
  i `KANDA_BRA`.
