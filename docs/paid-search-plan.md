# Paid search: audit och plan

Konto `476-755-4827` (Sands Entreprenad). Data hämtad 2026-08-07, period 2026-05-08 till 2026-08-07 (90 dagar) om inget annat anges.

---

## 0. Sammanfattning

Kontot spenderar cirka 15 000 kr/månad och levererar cirka 9 formulärleads och 3 telefonleads per månad. CPA på formulär är 1 732 kr.

Tre saker begränsar volymen, i den här ordningen:

1. **Ad Rank, inte budget.** Impression share är 22 till 26 procent. Av det som förloras beror 56 till 63 procentenheter på rank och bara 11 till 20 på budget. Att höja budgeten idag köper fler av samma dyra klick.
2. **Landningssidan.** 109 av 157 keywords med data har `BELOW_AVERAGE` på landing page experience. Samtliga annonser som får trafik pekar på startsidan, även prisrelaterade keywords. Det sänker både Quality Score och konverteringsgrad.
3. **Struktur.** 743 keywords ligger i två aktiva annonsgrupper, varav en heter `Ad group 1`. En annonsgrupp kan inte vara relevant för både "byte av hängrännor" och "plåttak pris".

Räkneexempel på vad som står på spel, vid oförändrad budget på 15 000 kr/månad:

| Scenario | CPC | CVR | Leads/mån | CPA |
|---|---|---|---|---|
| Idag | 20 kr | 1,4 % | 10 | 1 471 kr |
| Efter struktur och landningssidor | 16 kr | 2,0 % | 19 | 800 kr |
| Efter QS-lyft (mål) | 14 kr | 2,5 % | 27 | 560 kr |

Målet på 30 leads/månad går att nå från Google Ads ensamt, men bara om ordningen hålls: mätning först, sedan struktur och landningssidor, sedan budstrategi, sedan budget. Höjer man budgeten först bränner man pengar på QS 1 till 3-keywords.

---

## 1. Nuläge i siffror

**Kampanjer**

| Kampanj | Status | Budget/dag | Budstrategi | Opt. score |
|---|---|---|---|---|
| Takläggning Stockholm | Aktiv | 500 kr | Maximize Clicks (`TARGET_SPEND`), inget CPC-tak | 88 % |
| Search - Pris/Research Stockholm | Pausad | 100 kr | Maximize Clicks | 0 % |

**Annonsgrupper, 90 dagar**

| Kampanj | Annonsgrupp | Impr | Klick | Kostnad | Konv | CTR | Snitt-CPC |
|---|---|---|---|---|---|---|---|
| Takläggning Stockholm | Ad group 1 | 20 394 | 1 058 | 24 330 kr | 17 | 5,2 % | 23,0 kr |
| Takläggning Stockholm | Pris-Research | 8 816 | 1 008 | 17 964 kr | 9 | 11,4 % | 17,8 kr |
| Takläggning Stockholm | Taksäkerhet (pausad) | 216 | 23 | 574 kr | 0 | 10,6 % | 25,0 kr |
| Search - Pris/Research | Pris-Research | 1 649 | 204 | 2 158 kr | 0 | 12,4 % | 10,6 kr |

Totalt 45 022 kr, 2 293 klick, 26 formulärkonverteringar. CPA 1 732 kr.

**Månadsutveckling**

| Månad | Kostnad | Konv | Impr. share | Förlorad IS (rank) | Förlorad IS (budget) |
|---|---|---|---|---|---|
| Maj | 11 567 kr | 2 | 23,3 % | 58,2 % | 18,5 % |
| Juni | 15 177 kr | 10 | 22,1 % | 63,2 % | 14,7 % |
| Juli | 15 212 kr | 10 | 25,7 % | 62,8 % | 11,5 % |
| Aug (7 dagar) | 3 071 kr | 4 | 23,7 % | 56,1 % | 20,2 % |

Trenden är rätt: CPC ner från 27,5 kr i maj till 16,7 kr i augusti, konverteringar upp. Men impression share står stilla runt 23 procent i tre månader.

**Landningssidor, betald trafik (GA4, 90 dagar)**

| Sida | Sessioner | Key events | CVR | Bounce |
|---|---|---|---|---|
| `/` | 1 770 | 24 | 1,36 % | 38 % |
| `/priser` | 112 | 0 | 0 % | 29 % |
| `/omraden` | 54 | 3 | 5,6 % | 43 % |
| `/omraden/norrtalje` | 25 | 1 | 4,0 % | 36 % |
| `/tjanster/taklaggning` | 17 | 0 | 0 % | 18 % |
| `/tjanster/taksakerhet` | 22 | 0 | 0 % | 45 % |

`/omraden` och `/omraden/norrtalje` konverterar 3 till 4 gånger bättre än startsidan på små volymer. Det är den starkaste signalen i hela datasetet om vad matchade landningssidor gör.

---

## 2. Diagnos: var pengarna tar vägen

92 procent av sökordskostnaden (15 430 av 16 712 kr bland de 200 dyraste söktermerna) gick till söktermer med noll konverteringar.

**De sex söktermer som faktiskt konverterade, 90 dagar**

| Sökterm | Kostnad | Klick | Konv | CPA |
|---|---|---|---|---|
| sands entreprenad | 621 kr | 43 | 6 | 103 kr |
| takläggare norrtälje | 268 kr | 9 | 1 | 268 kr |
| byta hängrännor | 144 kr | 8 | 1 | 144 kr |
| bandtäckt plåt pris | 94 kr | 5 | 1 | 94 kr |
| kvadratmeterpris plåttak | 90 kr | 5 | 1 | 90 kr |
| räkna på takbyte | 65 kr | 4 | 1 | 65 kr |

Alla sex ligger under 300 kr CPA. Fem av dem är specifika, långa sökningar. Ingen av dem är en bred generisk term.

**De sex dyraste söktermerna utan konvertering**

| Sökterm | Kostnad | Klick |
|---|---|---|
| byta tak kostnad (två annonsgrupper) | 1 663 kr | 76 |
| lägga om tak kostnad | 482 kr | 26 |
| kostnad byta tak 150 kvm | 424 kr | 24 |
| plåttak kostnad | 385 kr | 25 |
| takbyte kostnad | 314 kr | 18 |
| kostnad byta tak | 298 kr | 15 |

Det här är inte skräptrafik. Det är rätt målgrupp som landar på startsidan i stället för på en prissida som svarar på frågan. `/priser` fick 112 betalda sessioner och noll konverteringar, vilket betyder att sidan inte heller löser det idag.

**Den enskilt största posten**

`takläggare` (bred matchning) kostade 14 293 kr på 90 dagar, alltså 32 procent av hela kontots spend. QS 3. CTR 4,65 procent. 5 konverteringar, CPA 2 859 kr. Bred matchning utan CPC-tak på en QS 3-term är kontots dyraste enskilda problem.

---

## 3. Quality Score

Av 157 keywords med QS-data ligger 109 på QS 1 till 3.

| Komponent | Under snitt | Snitt | Över snitt |
|---|---|---|---|
| Landing page experience | 109 | 44 | 4 |
| Ad relevance | 104 | 39 | 14 |
| Expected CTR | 92 | 41 | 24 |

Mönstret är entydigt. Landningssidan är sämst, och den är sämst för att alla annonser pekar på samma startsida oavsett vad som söktes.

Kontrastfallet: `sands entreprenad` har QS 10 med `ABOVE_AVERAGE` på alla tre komponenter, och 7 konverteringar till 103 kr CPA. Startsidan är alltså en bra landningssida för ett varumärkessök och en dålig för "plåttak pris".

**Vad ett QS-lyft är värt.** Ad Rank är ungefär bud gånger QS. Att gå från QS 3 till QS 6 på de keywords som bär spenden halverar ungefär vad man behöver bjuda för samma position. Vid låst budget betyder det ungefär dubbelt så många klick. Det är samma effekt som att fördubbla budgeten, fast gratis.

---

## 4. Konverteringsmätning: rätta först

Tre fel som gör att budgivningen optimerar mot fel signal. Dessa ska rättas innan något annat, eftersom allt annat mäts mot dem.

**4.1 `Submit lead form (form_submit)` räknar `MANY_PER_CLICK`.**
Värde 1 500 kr, primär målåtgärd. Med `MANY_PER_CLICK` räknas varje inskick från samma klick som en konvertering. Det är exakt samma dubblettproblem du redan sett i leadflödet, fast på budgivningssidan. Ska vara `ONE_PER_CLICK`. Detta hänger ihop med dubblettfixen i `docs/apps-script.gs` som ännu inte är driftsatt.

**4.2 `Phone call lead (phone_click)` är inte primär målåtgärd.**
9 telefonleads på 90 dagar syns i `all_conversions` men bidrar med 0 till `conversions`. Budgivningen vet alltså inte att de finns. 9 leads är 26 procent av all lead-volym från ads. Sätt den som primär, `ONE_PER_CLICK`, med ett rimligt värde (förslag 1 500 kr, samma som formulär).

**4.3 `Local actions` (Directions, Other engagements, Website visits) är satta som primära.**
De rapporterar 30 `all_conversions` på 90 dagar. De påverkar inte den här sökkampanjens budgivning idag (de rapporterar 0 i `conversions` här), men de ligger i den primära måluppsättningen och grumlar all rapportering på kontonivå. Flytta till sekundära.

**4.4 Attributionsfönster.**
Formuläråtgärden har 30 dagars click-through-fönster. Ett takbyte har längre beslutscykel än så. Höj till 90 dagar. Den borttagna versionen av samma åtgärd hade redan 90.

**4.5 `Calls from ads` (AD_CALL) är aktiv och primär men rapporterar noll.**
Samtalstillägget finns på kontonivå (08-28 38 88) men genererar inga mätta samtal. Verifiera att samtalsrapportering är påslagen, annars är telefonspåret från annonserna helt osynligt.

Efter 4.1 och 4.2 går den mätta signalen från cirka 9 till cirka 12 konverteringar per månad, vilket är den nivå smart bidding behöver för att fungera.

---

## 5. Budstrategi

**Idag:** Maximize Clicks (`TARGET_SPEND`) utan CPC-tak, på ett lead gen-konto. Strategin optimerar mot klick, inte leads, och betalar 23 kr snittklick på QS 3-keywords utan tak.

**Föreslagen väg, i tre steg:**

**Steg 1, omedelbart (vecka 1).** Behåll Maximize Clicks men sätt ett CPC-tak på 25 kr. Det stoppar utliggarna utan att strypa volymen (snitt-CPC är 20 kr, så taket biter bara i toppen). Bryt samtidigt ut varumärket i egen kampanj, se avsnitt 6, så att CPA-siffran för icke-varumärke blir ärlig. Idag drar `sands entreprenad` med 103 kr CPA ner den blandade CPA:n och döljer att icke-varumärke ligger på cirka 2 200 kr.

**Steg 2, efter 3 till 4 veckor med rättad mätning (vecka 4).** Byt icke-varumärkeskampanjen till Maximize Conversions utan mål-CPA. Kravet är ungefär 15 konverteringar per 30 dagar. Med telefonleads inräknade landar ni på 12 till 14, vilket är precis på gränsen. Kör den utan mål-CPA först, annars stryper den sig själv.

**Steg 3, efter 6 till 8 veckor (vecka 10 till 12).** När 30-dagarsvolymen ligger stabilt över 15, lägg på mål-CPA. Sätt den 15 till 20 procent över faktisk CPA vid övergången, inte på önskad nivå. Om faktisk CPA då är 900 kr, sätt 1 050 kr och sänk stegvis med 10 procent varannan vecka.

**Varumärkeskampanjen** ska ha egen budget på 25 till 30 kr/dag med Maximize Clicks och CPC-tak 8 kr. Varumärkessök ska aldrig konkurrera med icke-varumärke om samma dagsbudget.

Observera: budmodifierare för tidsschema och enhet ignoreras av Maximize Conversions. Justeringarna i avsnitt 10 gäller alltså bara under steg 1.

---

## 6. Kampanjstruktur

**Idag:** en aktiv kampanj, en annonsgrupp som heter `Ad group 1` med 345 keywords, en `Pris-Research` med 73, en pausad `Taksäkerhet`, plus en pausad spegelkampanj.

**Föreslagen struktur: tre kampanjer.**

### Kampanj A: Varumärke
Budget 25 kr/dag. Maximize Clicks, CPC-tak 8 kr.
Keywords: `[sands entreprenad]`, `[sands entreprenad stockholm]`, `[sandsab]`, `[sands ab tak]`, `"sands entreprenad"`.
Landningssida: `/`.
Syfte: skydda varumärket billigt och hålla det utanför icke-varumärkes-CPA.

### Kampanj B: Takbyte Stockholm (huvudkampanjen)
Budget 350 kr/dag initialt, upp till 500 efter QS-lyftet.
Annonsgrupper, en per tema, med egen matchad landningssida och egen RSA:

| Annonsgrupp | Kärnkeywords | Landningssida |
|---|---|---|
| Takläggare | takläggare, takfirma, takentreprenör (+ stockholm) | `/tjanster/taklaggning` |
| Takbyte | takbyte, byta tak, nytt tak | `/tjanster/taklaggning` |
| Takomläggning | lägga om tak, takomläggning, omläggning av tak | `/tjanster/taklaggning` |
| Plåttak | plåttak, bandtäckning, falsat plåttak | `/tjanster/plattak` |
| Tegeltak | tegeltak, taktegel, lertegel | `/tjanster/tegeltak` |
| Betongtak | betongtak, betongpannor | `/tjanster/betongtak` |
| Papptak | papptak, takpapp, låglutande tak | `/tjanster/papptak` |
| Eternittak | eternittak, asbesttak, byta eternittak | `/tjanster/eternittak` |
| Hängrännor | hängrännor, stuprör, byte av hängrännor | `/tjanster/hangrannorstupror` |
| Takbesiktning | takbesiktning, takkontroll, besiktning av tak | `/tjanster/takbesiktning` |
| Taksäkerhet | taksäkerhet, snörasskydd, takstege, glidskydd | `/tjanster/taksakerhet` |

`byte av hängrännor` har QS 1 idag men konverterade till 144 kr CPA. Den ligger i `Ad group 1` tillsammans med takbyteskeywords, vilket gör att både annonsrelevans och landningssida måste bli dåliga. Egen annonsgrupp med egen sida är hela fixen.

### Kampanj C: Pris och research
Budget 150 kr/dag. Detta är kontots största outnyttjade volym: cirka 12 000 kr på 90 dagar med nästan noll konverteringar, trots CTR på 11 till 21 procent. Folk klickar, sidan svarar inte.

| Annonsgrupp | Kärnkeywords | Landningssida |
|---|---|---|
| Kostnad takbyte | byta tak kostnad, takbyte kostnad, vad kostar takbyte | `/priser` |
| Kostnad per kvm | kostnad byta tak 100/150/200 kvm, pris per kvm tak | `/priser` |
| Kalkylator | byta tak kalkylator, räkna på takbyte, räkna takyta | `/priser` (Takräknaren) |
| Materialpris | plåttak pris, tegeltak pris, papptak pris | respektive `/tjanster/`-sida |

Förutsättningen för kampanj C är att `/priser` fungerar. Idag: 112 betalda sessioner, 0 konverteringar, 105 sekunders snittid. Sidan måste ge ett konkret spann högt upp, Takräknaren över mitten, och ett formulär på sidan i stället för en länk vidare. Det är en webbändring, inte en Ads-ändring, och den ska göras innan kampanj C skalas.

### Geo-annonsgrupper (senare)
`takläggare norrtälje` (QS 4, 1 konv), `takbyte norrtälje` (QS 7) och `takläggning norrtälje` (QS 6) har högst QS i hela icke-varumärkeskontot. Det är inte en slump: de matchar `/omraden/norrtalje`. När kampanj B står, lägg till 5 till 8 geo-annonsgrupper mot de områdessidor som redan har unik text (Sollentuna, Täby, Södertälje, Upplands Väsby, Lidingö, Huddinge, Norrtälje).

---

## 7. Keywords

743 keywords på 2 293 klick per 90 dagar är cirka 3 klick per keyword. Det ger varken statistik eller relevans.

**Ta bort eller pausa**
- `takläggare` bred matchning. Byt till frasmatchning plus exakt. Bred matchning utan CPC-tak på QS 3 är kontots dyraste rad.
- `takläggning` frasmatchning, QS 1, 1 167 impressions, CTR 3,0 procent. Sänker hela annonsgruppens expected CTR.
- `takomläggning` bred matchning, QS 1, 567 kr, 0 konv.
- Alla keywords med 0 impressions på 90 dagar. Det är merparten av de 743.

**Behåll och flytta till rätt annonsgrupp**
Samtliga keywords med QS 5 eller högre: `byta tak kostnad`, `lägga om tak kostnad`, `takbyte kostnad` (QS 7), `kostnad takbyte` (QS 7), `hur mycket kostar takbyte` (QS 7), `takomläggning kostnad` (QS 6), `kostnad takomläggning` (QS 7), `pris för takbyte` (QS 6), `vad kostar takläggning` (QS 6), `takbyte norrtälje` (QS 7).

**Lägg till, bevisat av söktermsdata**
`[kostnad byta tak 150 kvm]`, `[kostnad byta tak 100 kvm]`, `[takbyte 200 kvm pris]`, `[byta tak kalkylator]`, `[räkna på takbyte]`, `[bandtäckt plåt pris]`, `[kvadratmeterpris plåttak]`, `[byta hängrännor]`, `[byta eternittak till plåt]`, `[byta betongpannor]`, `[bästa takläggare stockholm]`.

De fyra första har redan spend som söktermer utan att vara egna keywords, vilket betyder att de matchas löst via andra keywords och saknar egen annons och egen sida.

**Matchningstyp**
Frasmatchning som grund, exakt matchning på de 20 termer som har konverterat eller har QS 6 eller högre. Bred matchning bara i en separat, budgetbegränsad annonsgrupp för upptäckt, med CPC-tak 15 kr, och bara efter att Maximize Conversions är på plats. Bred matchning utan smart bidding är den kombination som kostat 14 293 kr här.

---

## 8. Negativa keywords

418 negativa keywords finns. De flesta är bra: DIY, jobb och utbildning, byggvaruhus, konkurrenter, orter utanför Stockholm. Men listan blockerar också pengar.

**8.1 Kommersiella termer som blockeras av misstag**

Följande ligger som negativa i den aktiva kampanjen:

`[plåttak]`, `[tegeltak]`, `[betongtak]`, `[papptak]`, `[eternittak]`, `[takpannor]`, `[tegelpannor]`, `[betongpannor]`, `[takpapp]`, `"plåttak pris"`, `"plåtslagare stockholm"`, `"falsat plåttak pris"`, `[bandtäckt plåttak pris]`, `"dubbelfalsat plåttak pris"`, `"plåttak bandtäckning pris"`.

Det här är exakt de sökningar en villaägare gör när hen ska välja takmaterial. Att blockera dem samtidigt som man bygger materialsidor på webben är motsägelsefullt.

Extra tydligt: `plåttak pris` är samtidigt ett aktivt keyword (1 804 impressions senaste 30 dagarna, 1 807 kr) **och** ett negativt frasmatchat keyword. Söktermsrapporten visar status `ADDED_EXCLUDED`. Nettoeffekten är att pengarna går till lösare varianter medan den mest köpstarka frasen är blockad.

**8.2 Köpintention som blockeras**

`"lägga nytt tak på gammalt hus"`, `"räkna takyta"`, `"byta tak med solceller"`, `"lägga om eternittak"`, `"byta altantak"`, `"besiktningsprotokoll tak"`, `[byta tak steg för steg]`.

`räkna takyta` bör tas bort direkt, ni har en Takräknare nu. `lägga om eternittak` är rent köpintention.

**8.3 Struktur**

Inga delade negativlistor finns. Alla 418 ligger direkt på kampanjerna, delvis dubblerade mellan de två. Bygg fem delade listor:

1. **DIY och instruktion**: gör det själv, hur gör man, byggbeskrivning, ritning, steg för steg, youtube, guide
2. **Jobb och utbildning**: jobb, lön, lärling, praktik, cv, rekrytering, utbildning, karriär, sommarjobb
3. **Material och återförsäljare**: bauhaus, byggmax, beijer, k-rauta, jula, biltema, ahlsell, optimera, woody, xl-bygg, lindab, plannja, mataki
4. **Konkurrenter**: alla firmanamn (cirka 120 rader idag)
5. **Geo utanför Stockholm**: göteborg, malmö, skåne, uppsala, västerås, dalarna, linköping, örebro, kalmar

Lista 5 är delvis onödig eftersom geo-inställningen redan är `PRESENCE` på Stockholms län, men den skyddar mot söktermer där ortnamnet finns i frågan.

**8.4 Nya negativa att lägga till**

Från söktermsdata: `takhem` (redan exkluderad, bra), plus `gratis takpannor`, `begagnade takpannor`, `hyra ställning`, `takläggare lön`, `vad tjänar en takläggare`. De tre sista finns redan.

---

## 9. Assets

**Sitelinks, 7 aktiva.** Fyra av sju pekar på startsidan eller en ankarlänk på startsidan. Ingen pekar på `/priser`, `/projekt` eller någon tjänstesida.

Förslag på ny uppsättning, kampanj B:

| Länktext | Beskrivning 1 | Beskrivning 2 | URL |
|---|---|---|---|
| Kostnadsfri takkontroll | Vi kommer hem och inventerar taket | Fast pris efteråt | `/tjanster/takbesiktning` |
| Priser på takbyte | Räkna ut ditt takbyte | Från 1 200 kr/m² | `/priser` |
| Se utförda tak | Projekt i Stockholms län | Före och efter | `/projekt` |
| Takläggare i ditt område | 31 orter i Stockholms län | Hitta din ort | `/omraden` |
| Så går ett takbyte till | Från takkontroll till slutbesiktning | 4 steg | `/var-process` |
| Omdömen | Vad kunderna säger | BraByggare 4,8 av 5 | `/omdomen` |

**Två assets måste bytas oavsett vad ni gör med resten:**

1. Sitelink `Gratis Takbesiktning` med beskrivningen `Boka gratis hembesök`, och callout `Gratis takbesiktning`. Bryter mot CTA-reglerna i `CLAUDE.md` och `SEO.md`. Rätt formulering är "Boka kostnadsfri takkontroll". "Gratis" ska inte förekomma någonstans i kommunikationen.

2. Sitelink `Auktoriserad takläggare` och callout `Auktoriserad takläggare`. Det finns ingen statlig auktorisation för takläggare i Sverige, vilket ni själva skriver i artikeln `/blogg/certifierad-taklaggare`. Annonstexten säger alltså emot er egen sajt, och ett påstående om auktorisation som inte finns är en marknadsföringsrisk. Byt till "Certifierad takläggare" eller till de faktiska certifikaten (Säker Vatten, TIB, Monier-behörighet, vad som nu gäller).

**Callouts, 8 aktiva.** `30 års Monier-garanti`, `ROT-avdrag gäller`, `2 500+ tak utförda`, `BraByggare 4,8 av 5`, `Fast pris på takbyte` är bra. `Lokalt företag` och `Boka hembesök` är svaga. Ersätt med `Fast pris efter takkontroll` och `Svar inom 24 timmar`.

**Structured snippets:** finns tre på kontonivå, inga på kampanjnivå. Lägg till per kampanj:
- Rubrik `Tjänster`: Takbyte, Takomläggning, Plåttak, Tegeltak, Papptak, Taksäkerhet, Hängrännor
- Rubrik `Varumärken`: Benders, Monier, Plannja, Lindab, Icopal

**Priceasset:** två finns men båda är borttagna. Ett prisasset med spann per taktyp passar kampanj C bra och tar mycket yta i mobilen, som står för 93 procent av klicken.

**Bilder:** 8 bildassets aktiva, bra.

**Annonser:** Här finns ett direkt slöseri. Den annons som har `EXCELLENT` i annonsstyrka och pekar på `/tjanster/taklaggning` är **pausad** och har 0 impressions. Annonsen mot `/priser` är aktiv men har fått 0 konverteringar på 122 klick. Trafiken bärs av två annonser med `GOOD` och `AVERAGE` styrka som båda pekar på startsidan. Aktivera den starka annonsen när dess annonsgrupp finns.

**RSA-krav per ny annonsgrupp:** 15 rubriker, 4 beskrivningar, en rubrik fastnålad i position 1 med exakt sökordet (det är den enskilt största hävstången på ad relevance), minst en rubrik med pris, en med geo, en med kostnadsfri takkontroll.

---

## 10. Geo, enhet och tidsschema

**Geo.** Stockholms län, `PRESENCE` (fysisk närvaro), inte `PRESENCE_OR_INTEREST`. Det är rätt inställt och ska inte röras. Ingen radiemålgrupp finns, vilket är rimligt för hela länet.

**Nätverk.** Sökpartners av, Display av. Rätt.

**Enhet, 90 dagar**

| Enhet | Impr | Klick | Kostnad | Konv | CPA |
|---|---|---|---|---|---|
| Mobil | 23 103 | 1 742 | 35 678 kr | 20 | 1 784 kr |
| Dator | 5 565 | 299 | 6 236 kr | 5 | 1 247 kr |
| Surfplatta | 758 | 48 | 955 kr | 1 | 955 kr |

Dator ger 30 procent billigare leads men får bara 14 procent av trafiken. Under steg 1 (Maximize Clicks): sätt +20 procent på dator. Under Maximize Conversions: ta bort modifieraren, algoritmen sköter det.

**Tidsschema.** Här är den nuvarande inställningen inverterad mot data.

| Tidsblock | Kostnad | Klick | Konv | CPA | Nuvarande modifierare |
|---|---|---|---|---|---|
| 00 till 06 | 1 906 kr | 95 | 1 | 1 906 kr | 1,0 |
| 06 till 10 | 5 342 kr | 264 | 1 | 5 342 kr | 1,0 |
| 10 till 17 | 18 629 kr | 958 | 19 | 980 kr | 0,85 mellan 11 och 13 |
| 17 till 24 | 16 992 kr | 772 | 5 | 3 398 kr | 1,2 mellan 17 och 23 |

Kvällarna är nedjusterade i data och uppjusterade i inställningen. Lunchtimmarna 11 till 13 är nedjusterade med 15 procent trots att klockan 13 är dygnets bästa timme med 6 konverteringar.

Föreslagen justering under steg 1:
- 10 till 17: +20 procent (idag 0,85 mellan 11 och 13)
- 17 till 20: 0 procent
- 20 till 24: -20 procent
- 00 till 06: -40 procent
- 06 till 10: -20 procent

Detta är den snabbaste enskilda vinsten i hela planen. Den kräver inget nytt content och kan göras på tio minuter.

Notera att 26 konverteringar är ett litet underlag att skära i fyra block. Justeringarna är därför måttliga och ska följas upp efter 30 dagar.

---

## 11. Budget och prognos

**Nuläge:** 500 kr/dag, cirka 15 000 kr/månad, cirka 10 formulärleads plus 3 telefonleads.

Förlorad impression share till budget är 11 till 20 procent, till rank 56 till 63 procent. Budgetökning ska därför komma sist, inte först.

| Fas | Budget/dag | Förväntad CPC | Förväntad CVR | Leads/mån | CPA |
|---|---|---|---|---|---|
| Idag | 500 kr | 20 kr | 1,4 % | 10 | 1 471 kr |
| Efter fas 1 och 2 (vecka 4) | 500 kr | 17 kr | 1,8 % | 16 | 940 kr |
| Efter fas 3 (vecka 8) | 500 kr | 15 kr | 2,2 % | 22 | 680 kr |
| Efter fas 4 (vecka 12) | 700 kr | 15 kr | 2,2 % | 29 | 720 kr |

CVR-antagandet på 2,2 procent är inte optimistiskt. `/omraden` konverterar redan 5,6 procent och `/omraden/norrtalje` 4,0 procent från betald trafik. Startsidans 1,36 procent är golvet, inte taket.

Vid 29 leads/månad från ads plus nuvarande organiska och GBP-flöde ligger totalen klart över 30. Med 25 procents close rate blir det cirka 7 till 8 affärer i månaden från ads ensamt.

---

## 12. Genomförandeordning

**Vecka 1: mätning och snabbfixar. Ingen strukturändring.**
1. `form_submit` till `ONE_PER_CLICK`, lookback 90 dagar
2. `phone_click` till primär målåtgärd, `ONE_PER_CLICK`, värde 1 500 kr
3. `Local actions` till sekundära
4. Verifiera `Calls from ads`-rapportering
5. CPC-tak 25 kr på Maximize Clicks
6. Tidsschema enligt avsnitt 10
7. Enhetsmodifierare +20 procent dator
8. Byt de två assets som bryter mot CTA-reglerna respektive påstår auktorisation
9. Ta bort de felaktiga negativa keywords enligt 8.1 och 8.2

Punkt 1 till 4 påverkar mätningen retroaktivt på så sätt att jämförelser före och efter inte blir rena. Notera datumet.

**Vecka 2 till 3: struktur.**
10. Bygg kampanj A (varumärke) och flytta över varumärkeskeywords
11. Bygg kampanj B med 11 annonsgrupper, en RSA per grupp, matchad landningssida
12. Bygg delade negativlistor och koppla dem
13. Pausa `Ad group 1` och `Search - Pris/Research Stockholm` när trafiken flyttat
14. Sitelinks och structured snippets per kampanj

**Vecka 3 till 4: `/priser`.**
15. Bygg om `/priser` för konvertering innan kampanj C skalas. Detta är webbarbete, inte Ads.

**Vecka 4: budstrategi.**
16. Kampanj B till Maximize Conversions utan mål-CPA
17. Ta bort tids- och enhetsmodifierare i kampanj B

**Vecka 6 till 8: kampanj C och geo.**
18. Starta kampanj C mot den nya prissidan
19. Lägg till geo-annonsgrupper mot områdessidorna med unik text

**Vecka 10 till 12: skala.**
20. Mål-CPA på kampanj B, 15 till 20 procent över faktisk
21. Budget till 700 kr/dag när förlorad IS till budget överstiger 25 procent

---

## 13. Vad som inte ändras utan godkännande

- Inga skrivningar mot Google Ads-kontot är gjorda. Allt ovan är analys och förslag.
- `/tack`-sidan och gtag-koden rörs inte alls, enligt projektreglerna.
- Ändringar av konverteringsåtgärder (avsnitt 4) påverkar historisk rapportering och bör göras medvetet, med datum noterat.
