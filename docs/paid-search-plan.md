# Paid search: audit och plan

Konto `476-755-4827` (Sands Entreprenad). Data hämtad 2026-08-07, period 2026-05-08 till 2026-08-07 (90 dagar) om inget annat anges. Avsnitt 2 är omskrivet 2026-08-15 och bygger på hela körperioden, 1 mars till 15 augusti 2026. Genomförandelogg och rättelser ligger i avsnitt 16.

---

## 0. Sammanfattning

Kontot spenderar cirka 15 000 kr/månad och levererar cirka 9 formulärleads och 3 telefonleads per månad. CPA på formulär är 1 732 kr.

Tre saker begränsar volymen, i den här ordningen:

1. **Ad Rank, inte budget.** Impression share är 22 till 26 procent. Av det som förloras beror 56 till 63 procentenheter på rank och bara 11 till 20 på budget. Att höja budgeten idag köper fler av samma dyra klick.
2. **Landningssidan.** 109 av 157 keywords med data har `BELOW_AVERAGE` på landing page experience. Samtliga annonser som får trafik pekar på startsidan, även prisrelaterade keywords. Det sänker både Quality Score och konverteringsgrad.
3. **Struktur och koncentration.** 743 keywords ligger i två aktiva annonsgrupper, varav en heter `Ad group 1`. En annonsgrupp kan inte vara relevant för både "byte av hängrännor" och "plåttak pris". Djupanalysen 2026-08-15 visar dessutom att två sökord bär 55 procent av leaden till 1 174 kr CPA medan 398 sökord levererar resten till 2 951 kr. Se avsnitt 17.

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

Uppdaterad 2026-08-15 med hela körperioden, 1 mars till 15 augusti 2026. Den tidigare versionen av det här avsnittet drog en slutsats som inte höll, se rättelsen sist.

### 2.1 Helheten

Kontot har gjort av med **78 955 kr på 40 konverteringar**, alltså 1 974 kr per lead.

| Annonsgrupp | Kostnad | Klick | Konv | CPA | CTR |
|---|---|---|---|---|---|
| Pris-Research (huvudkampanjen) | 20 739 kr | 1 178 | 9 | 2 304 kr | 11,4 % |
| Pris-Research (den pausade kampanjen) | 2 158 kr | 204 | 0 | - | 12,4 % |
| **Pris totalt** | **22 897 kr** | **1 382** | **9** | **2 544 kr** | 11,6 % |
| Takläggning | 55 281 kr | 2 237 | 31 | 1 783 kr | 5,6 % |
| Taksäkerhet (pausad) | 574 kr | 23 | 0 | - | 10,6 % |
| Brand | 184 kr | 15 | 0 | - | 31,9 % |
| Områden (tre grupper) | 17 kr | 1 | 0 | - | - |

Den separat uppsatta pris- och researchkampanjen körde maj och juni och gav **noll leads på 204 klick**, med kontots billigaste klick och näst högsta CTR.

### 2.2 Efter sökordslydelse

Prissökningar går även genom Takläggning-gruppen, så annonsgruppsindelningen räcker inte.

| Kluster | Termer | Klick | Kostnad | Konv | CVR |
|---|---|---|---|---|---|
| Pris och research | 536 | 1 387 | 28 627 kr | 6 | **0,43 %** |
| Icke-pris | 909 | 582 | 14 324 kr | 8 | **1,32 %** |
| Varumärke | 6 | 94 | 1 573 kr | 7 | **7,45 %** |

Pris mot icke-pris: **z = 2,16, tvåsidigt p = 0,031.** Skillnaden är verklig. Prisformulerade sökningar konverterar ungefär tre gånger sämre.

Notera att prissökningar kostat 28 627 kr, mer än hela Pris-Research-gruppens 22 897 kr. Att pausa annonsgruppen löser bara halva problemet.

**Täckning:** söktermsrapporten omfattar 44 524 kr av 78 955 (56 procent) och 21 av 40 konverteringar. Google döljer lågvolymtermer. Annonsgruppstabellen i 2.1 är komplett, tabellen ovan är ett stort urval.

### 2.3 Inuti prisklustret finns inget mönster att hitta

| Egenskap | Termer | Klick | Konv | CVR |
|---|---|---|---|---|
| Har kvadratmetertal | 11 | 164 | 1 | 0,61 % |
| Har enhet (per kvm, kvadratmeterpris) | 52 | 146 | 2 | 1,03 % |
| Har material | 278 | 473 | 4 | 0,74 % |
| Har handlingsverb (byta, lägga om) | 183 | 849 | 4 | 0,41 % |
| Frågeform (vad kostar, hur mycket) | 76 | 200 | 0 | 0 % |
| Kalkylator och räkna | 4 | 18 | 1 | 5,56 % |
| **Alla pristermer** | **536** | **1 387** | **6** | **0,43 %** |

Största kontrasten, enhet mot handlingsverb: **z = 1,30, p = 0,19.** Inte signifikant. Ordantal ger 1, 2, 2 och 2 konverteringar över fyra hinkar, alltså ingen lutning.

**Styrkeberäkning vid 0,43 procents baslinje:**

| Skillnad att bevisa | Klick per arm | Vid 252 prisklick/mån |
|---|---|---|
| 3,5x | 1 299 | 10 månader |
| 3x | 1 806 | 14 månader |
| 2x | 5 433 | 43 månader |

Ett enda test inom prisklustret tar över ett år. Datan kommer inte att avslöja vilka prisord som fungerar, och varje analys som påstår motsatsen beskriver brus.

### 2.4 Det som däremot har full statistisk kraft

CTR bygger på tusentals visningar.

- **Specificitet driver CTR monotont:** 2 ord 13,4 %, 3 ord 15,4 %, 4 ord 17,1 %, 5+ ord 17,0 %. Handlingsverb 18,0 %, kalkylator 20,2 %.
- **Prisjägare klickar inte:** termer med "billig" har 199 visningar och 7 klick, CTR 3,5 % mot 15,5 i snitt. Positioneringen mot fast pris och garanti stöter bort budgetköpare, vilket är avsiktligt och fungerar.
- **CPC är platt, 19,2 till 20,8 kr i varje kategori.** Marknaden prissätter alla prissökningar lika. Ingen konkurrent har heller hittat mönstret. Det finns alltså inget att vinna på budgivning, skillnaden måste komma från landningssidan.

### 2.5 Konfoundern, mätt

| Landningssida för prisklick | Klick | Andel |
|---|---|---|
| Startsidan `/` | 1 232 | **89 %** |
| `/priser` (gamla versionen) | 122 | 8,8 % |
| offert-domänen | 28 | 2 % |

Nio av tio prisklick har landat på en sida utan pris. Klustret har aldrig fått en rättvis prövning.

Åt andra hållet: på samma startsida konverterar övrig icke-varumärkestrafik runt 1,0 procent mot prisstrafikens 0,43. Frågorna är alltså svagare även när sidan hålls konstant. Båda sakerna är sanna samtidigt.

### 2.6 Vad som följer av det

Sluta segmentera prisord. Testa landningssidan i stället, av statistiska skäl: den flyttar hela klustret på en gång, ett test med 1 387 klick per period i stället för åtta test med 170 klick styck.

Målet är räknebart. Vid 20,6 kr CPC krävs:

| För att | CVR som krävs | Från 0,43 % |
|---|---|---|
| Matcha icke-pris CPA (1 868 kr) | 1,10 % | 2,6x |
| Matcha kontosnittet (1 974 kr) | 1,04 % | 2,4x |

**Mät inte på konverteringar.** Klustret ger en konvertering i månaden, så ett före- och efterbeslut tar 5 till 10 månader. Mät `/priser` på avvisningsfrekvens, tid på sidan och andel som når formuläret. De har hundratals observationer i veckan.

**Beslutsregel, satt i förväg:** om `/priser` inte får avvisningsfrekvensen under 40 procent och formulärstarterna över 10 procent inom 400 sessioner, skär klustret till enbart material- och kvadratmeterspecifika frågor och flytta budgeten till Takläggning.

### 2.7 Rättelse av tidigare version

Den första versionen av det här avsnittet listade sex konverterande söktermer och drog slutsatsen att "specifika, långa sökningar" konverterar medan "breda generiska" inte gör det. Den slutsatsen var cirkulär: termerna klassades efter utfall och egenskapen lästes sedan in i efterhand.

Tydligaste exemplet: `kostnad byta tak 100 kvm` beskrevs som högintent och `kostnad byta tak 150 kvm` som generisk. De är samma frågeform. De elva termerna med kvadratmetertal delar 164 klick och 1 konvertering. Termen som fick den hade 23 procent av klicken, alltså exakt den andel slumpen förutsäger.

Samma version kallade `takläggare` bred matchning "kontots dyraste enskilda problem" och föreslog att pausa den. Även det är reviderat, se avsnitt 13. Den bär 42 procent av visningarna och resten av kontot kan inte absorbera budgeten om den stängs.

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

**Vad ett QS-lyft är värt. Rättat 2026-08-15.**

Den ursprungliga texten här hävdade att QS 3 till 6 ungefär halverar budet och därmed fördubblar klicken, alltså "samma effekt som att fördubbla budgeten, fast gratis". Det är läroboksformeln Ad Rank = bud gånger kvalitet, inte kontots data.

Viktad regression över 143 sökord med QS och minst tre klick ger **CPC = 25,61 minus 1,24 gånger QS, r = -0,78**. Observerad spännvidd i kontot:

| QS | Sökord | Klick | CPC |
|---|---|---|---|
| 1 | 17 | 334 | 23,8 kr |
| 3 | 35 | 1 565 | 23,0 kr |
| 5 | 18 | 522 | 18,0 kr |
| 6 | 9 | 147 | 15,4 kr |
| 7 | 5 | 97 | 16,8 kr |

Från QS 1 till QS 7 är skillnaden **29 procent, inte en halvering**. QS 3 till 6 motsvarar cirka 3,7 kr, alltså 16 procent.

Och även det är en överskattning. Sambandet är sammanblandat med nischens konkurrens: kontots QS 6 och 7-sökord är prisfraser som är billiga auktioner i sig, medan QS 3 domineras av `takläggare`, en dyr generisk term. Regressionen är beskrivande, inte kausal. Behandla 29 procent som ett tak på vad QS-arbete kan ge på CPC.

Skälet att ändå göra QS-arbetet är konverteringsgraden, inte klickpriset. Se avsnitt 17.

---

## 4. Konverteringsmätning: rätta först

Tre fel som gör att budgivningen optimerar mot fel signal. Dessa ska rättas innan något annat, eftersom allt annat mäts mot dem.

**4.1 `Submit lead form (form_submit)` räknar `MANY_PER_CLICK`.**
Värde 1 500 kr, primär målåtgärd. Med `MANY_PER_CLICK` räknas varje inskick från samma klick som en konvertering. Det är exakt samma dubblettproblem du redan sett i leadflödet, fast på budgivningssidan.

**Korrigerat 2026-08-07:** räknesättet går inte att ändra från Google Ads. API:t svarar `IMMUTABLE_FIELD`, eftersom Google härleder räknesättet från GA4 för importerade konverteringar. Den enda spaken sitter i GA4 Admin under Nyckelhändelser, där `form_submit` kan sättas från "En gång per händelse" till "En gång per session". Det gör att dubblettfixen i `docs/apps-script.gs` blir viktigare än först antaget, eftersom den är det andra av två möjliga skydd.

**4.2 `Phone call lead (phone_click)` är inte primär målåtgärd.**
9 telefonleads på 90 dagar syns i `all_conversions` men bidrar med 0 till `conversions`. Budgivningen vet alltså inte att de finns. 9 leads är 26 procent av all lead-volym från ads. Sätt den som primär, `ONE_PER_CLICK`, med ett rimligt värde (förslag 1 500 kr, samma som formulär).

**4.3 `Local actions` (Directions, Other engagements, Website visits) är satta som primära.**
**Struken 2026-08-07.** Flaggan `primary_for_goal` på själva åtgärden är inte det som styr. Målnivån gör det, och där ligger PAGE_VIEW, GET_DIRECTIONS och ENGAGEMENT från GOOGLE_HOSTED redan som `biddable: false`. Därför rapporterar de 0 i konverteringskolumnen. Ingen åtgärd behövs. Åtgärderna är dessutom av typen GOOGLE_HOSTED och går inte att mutera alls (`MUTATE_NOT_ALLOWED`).

**4.4 Attributionsfönster.**
Formuläråtgärden har 30 dagars click-through-fönster. Ett takbyte har längre beslutscykel än så. Höj till 90 dagar. Den borttagna versionen av samma åtgärd hade redan 90.

**4.5 `Calls from ads` (AD_CALL) är aktiv och primär men rapporterar noll.**
Samtalstillägget finns på kontonivå (08-28 38 88) men genererar inga mätta samtal.

Det är två fel, inte ett. Utöver att inga samtal registreras ligger målet PHONE_CALL_LEAD med ursprung CALL_FROM_ADS som `biddable: false`, så även mätta samtal skulle inte räknas i konverteringskolumnen. Båda måste rättas i UI:t.

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

**Reviderat 2026-08-15: elva annonsgrupper är för många.** Kontots spend är extremt koncentrerad. Ett sökord, `takläggare` bred, står för 30 procent av spenden och 13 av 40 konverteringar. Topp fem sökord är 42,5 procent av spenden och 26 av 40 konverteringar. Vid 25 klick om dagen ger elva grupper drygt två klick per grupp och dag, vilket varken ger inlärning eller utvärderingsbarhet.

**Börja med tre annonsgrupper**, som tillsammans täcker cirka 80 procent av volymen:

| Annonsgrupp | Andel av visningar | Landningssida |
|---|---|---|
| Takläggare och takbyte (inkl. `takläggare` bred) | 42 % | `/tjanster/taklaggning` |
| Pris och kostnad | 28 % | `/priser` |
| Plåttak | 10 % | `/tjanster/plattak` |

Tabellen nedan är den ursprungliga målbilden och gäller först när budgeten bär den. Lägg till en grupp i taget, och bara när dess tema visar minst 300 visningar i månaden i söktermsrapporten.

Ursprunglig målbild:

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

**Matchningstyp. Struken 2026-08-15.**

Den ursprungliga rekommendationen var frasmatchning som grund och bred matchning bara i en budgetbegränsad upptäcktsgrupp. **Det finns inget stöd för den i kontots data.**

Utan varumärkessökord: bred matchning 1,03 procents CVR mot fras och exakt 0,80 procent, **z = 0,70, p = 0,481**. Matchningstyp förklarar ingenting. Den skenbara fördelen för bred matchning i en första körning (1,61 mot 0,79 procent, p = 0,022) berodde helt på `sands entreprenad` som bred matchning, alltså varumärket.

Rekommendationen kom från branschpraxis, inte från mätning. Se avsnitt 17.

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

**Annonser:** Annonsen mot `/priser` är aktiv men har fått 0 konverteringar på 122 klick.

**Korrigerat 2026-08-07:** i en tidigare version stod här att den pausade annonsen med `EXCELLENT` annonsstyrka mot `/tjanster/taklaggning` var bortkastad. Det stämmer inte. Den hann köra 1 138 visningar med 3,25 procents CTR och 0 konverteringar på 37 klick, mot 5,59 procent och 8 konverteringar för den aktiva annonsen mot startsidan. `EXCELLENT` är Googles omdöme om variationen i tillgångar, inte om prestanda. Annonsen ska inte återaktiveras i nuvarande struktur.

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

## 12. Vad jag kan köra själv och vad som kräver dig i UI:t

Google Ads MCP-verktygen täcker en del av API:t, inte hela. Här är den faktiska gränsen, verifierad mot verktygens scheman.

**Kan köras via MCP (jag gör det, du behöver inte röra något)**

| Område | Verktyg |
|---|---|
| Konverteringsåtgärder: räknesätt, primär/sekundär, attributionsfönster, värde, status | `update_conversion_action` |
| Konverteringsmål biddable eller ej | `update_customer_conversion_goal` |
| Kampanjbudget | `update_campaign_budget`, `create_campaign_budget` |
| Budstrategityp (Max Clicks, Max Conversions, Target CPA) | `update_campaign_bidding_strategy` |
| Enhetsbudmodifierare | `update_campaign_device_bid_modifier` |
| Skapa kampanjer, annonsgrupper | `create_campaign`, `create_ad_group` |
| Lägga till keywords med matchningstyp och bud | `add_keywords_to_ad_group` |
| Lägga till negativa keywords | `add_negative_keywords_to_campaign` / `_to_ad_group` |
| Ta bort negativa keywords på kampanjnivå | `remove_negative_keyword_from_campaign` |
| Skapa RSA-annonser | `create_responsive_search_ad` |
| Pausa och aktivera annonsgrupper och annonser | `update_ad_group_status`, `update_ad_status` |
| Koppla befintliga assets till kampanj | `link_asset_to_campaign` |
| All rapportering och uppföljning | `execute_gaql` |

**Kräver dig i UI:t (jag kan inte, och varför)**

| Vad | Varför |
|---|---|
| CPC-tak på Maximize Clicks | `update_campaign_bidding_strategy` tar bara strategityp och tCPA/tROAS. Inget fält för bid ceiling. |
| Pausa eller ta bort enskilda keywords | Det finns inget verktyg för keyword-status. Jag kan lägga till keywords, inte stänga av dem. Detta är den största begränsningen. |
| Ändra eller ta bort befintligt tidsschema | `update_campaign_ad_schedule` skapar bara nya poster. Veckan är redan heltäckt 0 till 24 alla sju dagar med 35 poster, så varje ny post krockar. De gamla måste bort först. |
| Skapa sitelinks, callouts, structured snippets, prisassets | `upload_asset` stöder bara TEXT, IMAGE och YOUTUBE_VIDEO. Sitelink och callout är egna assettyper som verktyget inte kan skapa. |
| Ta bort eller koppla loss befintliga assets | Det finns `link_asset_to_campaign` men ingen unlink. |
| Pinna rubriker i RSA | `create_responsive_search_ad` saknar pin-parameter. Jag kan skapa annonsen, du pinnar rubrik 1. |
| Skapa delade negativlistor | Jag kan bara koppla en lista som redan finns, inte skapa den. |
| Sätta geo till "Närvaro" på nya kampanjer | `create_campaign` sätter geo-ID men inte `geo_target_type_setting`. Nya kampanjer får Googles standard "Närvaro eller intresse", vilket ger trafik från folk som bara är intresserade av Stockholm. Måste ändras direkt efter att kampanjen skapats. |
| Ta bort negativa keywords på annonsgruppsnivå | Bara kampanjnivå finns som borttagningsverktyg. |
| Samtalsrapportering och Google-vidarekopplingsnummer | Kontoinställning utanför API-ytan. |
| Enhetsbudmodifierare | `update_campaign_device_bid_modifier` är trasigt. Det skriver enumvärdet som heltal i en GAQL WHERE-sats, vilket Google avvisar med `BAD_ENUM_CONSTANT`. Verifierat på både MOBILE och DESKTOP 2026-08-07. |
| Räknesätt på GA4-importerade konverteringar | `IMMUTABLE_FIELD`. Härleds från GA4 och ändras bara i GA4 Admin. |
| Local actions-åtgärder | Typen GOOGLE_HOSTED går inte att mutera alls (`MUTATE_NOT_ALLOWED`). |

**Praktisk konsekvens.** Att jag inte kan pausa keywords låter värre än det är. I den nya strukturen skapar jag rena annonsgrupper från grunden, och sedan pausar jag hela `Ad group 1` i ett anrop. De 743 gamla keywordsen behöver alltså aldrig städas en och en. Undantaget är steg 6 nedan, där `takläggare` bred matchning ska stängas innan resten är byggt.

---

## 13. Sekventiell åtgärdslista

Ordningen spelar roll. Varje steg är märkt med vem som gör det.

### Mätning

**1. [MCP] Rätta `form_submit` till en konvertering per klick.**
Konverteringsåtgärd `7624071599`. Sätt `counting_type` till `ONE_CONVERSION` och `click_through_lookback_window_days` till 90. Detta stoppar att dubbla inskick räknas som två leads i budgivningen.

**2. [MCP] Gör telefonleads biddbara.**
Konverteringsåtgärd `7605932601` (`Phone call lead / phone_click`). Sätt `primary_for_goal` till true, `counting_type` till `ONE_CONVERSION`, `default_value` 1500, lookback 90. Detta tar den mätta signalen från cirka 9 till cirka 12 konverteringar per månad, vilket är förutsättningen för steg 19.

**3. [MCP] Flytta Local actions till sekundära.**
Konverteringsåtgärderna `7647712079` (Directions), `7665786211` (Other engagements), `7687692370` (Website visits). Sätt `primary_for_goal` till false.

**4. [UI] Verifiera samtalsrapportering.**
`Calls from ads` (`7605929746`) är aktiv och primär men har noll registrerade samtal på 90 dagar, trots att samtalstillägget med 08-28 38 88 ligger på kontonivå. Gå till Mål > Konverteringar > Inställningar och kontrollera att samtalsrapportering är påslagen och att numret använder Googles vidarekopplingsnummer. Jag kan läsa att åtgärden finns, men inte se eller ändra vidarekopplingsinställningen.

**5. [DU] Driftsätt dubblettfixen i Apps Script.**
`docs/apps-script.gs` ligger klar men är inte deployad. Steg 1 rättar dubbletter på Google-sidan, detta rättar dem i ditt eget leadflöde. De hör ihop.

*Notera datumet när steg 1 till 3 körs. Jämförelser före och efter blir inte rena över den punkten.*

### Blödningsstopp

**6. [MCP] Ta bort 24 felaktiga negativa keywords** i kampanj `23643269229`. Criterion-ID:

| Criterion ID | Keyword | Match |
|---|---|---|
| 328279332164 | plåttak | EXACT |
| 7255353368 | plåttak pris | PHRASE |
| 321072921027 | falsat plåttak pris | PHRASE |
| 387921826686 | bandtäckt plåttak pris | EXACT |
| 2338591781237 | dubbelfalsat plåttak pris | PHRASE |
| 2273409892313 | plåttak bandtäckning pris | PHRASE |
| 296974337019 | tegeltak | EXACT |
| 300790603123 | betongtak | EXACT |
| 304478413857 | papptak | EXACT |
| 300374951439 | eternittak | EXACT |
| 172073803 | takpannor | EXACT |
| 7875549754 | tegelpannor | EXACT |
| 260362882 | betongpannor | EXACT |
| 300374952239 | nockpannor | EXACT |
| 310714501673 | takpapp | EXACT |
| 4768844728 | plåtslagare | PHRASE |
| 7255354448 | plåtslagare stockholm | PHRASE |
| 361151586877 | shingel | BROAD |
| 1637808288909 | lägga nytt tak på gammalt hus | PHRASE |
| 2485496289774 | räkna takyta | PHRASE |
| 1637907506623 | byta tak med solceller | PHRASE |
| 410610917026 | byta altantak | PHRASE |
| 725173591090 | besiktningsprotokoll tak | PHRASE |
| 422657752989 | byta tak steg för steg | EXACT |

**7. [MCP] Lägg till `takläggare` som fras och exakt** i `Ad group 1` (`194744777192`), så att volymen finns kvar när bred matchning stängs i nästa steg.

**8. [UI] Pausa tre keywords i `Ad group 1`.**
`takläggare` bred matchning (14 293 kr på 90 dagar, 32 procent av kontots spend, QS 3), `takläggning` frasmatchning (QS 1), `takomläggning` bred matchning (QS 1). Sök upp dem under Sökord i kampanjen. Jag kan inte göra detta via MCP.

**9. [UI] Sätt CPC-tak 25 kr** på kampanj `Takläggning Stockholm`. Inställningar > Budgivning > Ange ett max-CPC-budtak. Snitt-CPC är 20 kr, så taket biter bara i toppen.

**10. [UI] Lägg om tidsschemat.**
Ta bort de 35 befintliga posterna (Inställningar > Annonsschema) och lägg in:

| Tid | Justering |
|---|---|
| 00 till 06 | -40 % |
| 06 till 10 | -20 % |
| 10 till 17 | +20 % |
| 17 till 20 | 0 % |
| 20 till 24 | -20 % |

Alla sju dagar. Nuvarande schema är inverterat mot data: 10 till 17 ger 980 kr CPA men är nedjusterat över lunchen, 17 till 24 ger 3 398 kr CPA och är uppjusterat. Om du hellre vill att jag lägger in posterna: ta bara bort de 35 gamla, så kör jag in de 35 nya via MCP.

**11. [MCP] Sätt enhetsmodifierare +20 procent på dator** i kampanj `23643269229`. Dator ger 1 247 kr CPA mot mobilens 1 784 kr men får bara 14 procent av trafiken.

### Assets

**12. [UI] Byt de två assets som inte får stå kvar.**
- Sitelink `Gratis Takbesiktning` med beskrivning `Boka gratis hembesök`, och callout `Gratis takbesiktning`. Bryter mot CTA-reglerna. Ersätt med `Kostnadsfri takkontroll` och `Boka kostnadsfri takkontroll`.
- Sitelink och callout `Auktoriserad takläggare`. Det finns ingen statlig auktorisation för takläggare i Sverige, vilket ni själva skriver i `/blogg/certifierad-taklaggare`. Ersätt med `Certifierad takläggare` eller de faktiska certifikaten.

**13. [UI] Lägg till sitelinks och structured snippets** enligt avsnitt 9. Nuvarande sitelinks pekar nästan alla på startsidan. Nya ska peka på `/priser`, `/projekt`, `/var-process`, `/omdomen`, `/tjanster/takbesiktning`.

**14. [MCP] Aktivera den starka annonsen.**
Annons `811203375592` i `Ad group 1` har `EXCELLENT` i annonsstyrka och pekar på `/tjanster/taklaggning`, men är pausad med 0 impressions. Görs efter steg 8, annars konkurrerar den med de befintliga.

### Struktur

**15. [MCP] Skapa varumärkeskampanjen.**
Ny sökkampanj, 25 kr/dag, Maximize Clicks, geo 21000 (Stockholms län), språk svenska, endast Google-sök. En annonsgrupp med `[sands entreprenad]`, `[sands entreprenad stockholm]`, `[sandsab]`, `"sands entreprenad"`, plus en RSA mot `/`.

**16. [UI] Två inställningar direkt efter steg 15.**
Sätt geo till **Närvaro** (kampanjen skapas med Googles standard "Närvaro eller intresse") och CPC-tak 8 kr. Båda ligger utanför MCP-verktygens fält.

**17. [UI] Pausa varumärkeskeywords i `Ad group 1`** när varumärkeskampanjen är igång, annars konkurrerar de om samma sökningar.

**18. [MCP] Bygg huvudkampanjen.**
Ny sökkampanj `Takbyte Stockholm`, 350 kr/dag, Maximize Clicks tills vidare, geo 21000. Sedan 11 annonsgrupper enligt avsnitt 6, var och en med sina keywords (fras och exakt) och en RSA mot sin matchade landningssida. Det blir cirka 50 verktygsanrop, men det är helt mekaniskt och jag kör det i en sekvens.

**19. [UI] Efter steg 18, tre saker.**
- Geo till **Närvaro** på nya kampanjen
- CPC-tak 25 kr
- Pinna rubrik 1 i varje av de 11 RSA:erna till den rubrik som innehåller exakta sökordet. Det är den enskilt största hävstången på ad relevance, och `create_responsive_search_ad` har ingen pin-parameter.

**20. [MCP] Koppla assets till nya kampanjerna.** Görs efter steg 12 och 13, eftersom jag bara kan koppla assets som redan finns.

**21. [MCP] Pausa `Ad group 1` (`194744777192`)** när den nya strukturen levererar. Ett anrop, och alla 345 gamla keywords slutar servera. Pausa samtidigt den pausade pris- och researchkampanjen (`23866563102`), som fortfarande ligger kvar med egen budget.

Budgetkontroll här: 25 + 350 = 375 kr/dag i nya kampanjer mot 500 i den gamla. Kör dem parallellt i några dagar, sedan ned med den gamla.

### Webben

**22. [JAG, i repot] Bygg om `/priser`.**
112 betalda sessioner, noll konverteringar, 105 sekunders snittid. Sidan behöver ett konkret prisspann högt upp, Takräknaren ovanför mitten och ett formulär på sidan i stället för en länk vidare. Detta är förutsättningen för steg 23. Jag gör det som en PR på vanligt sätt, du granskar och mergar.

### Pris, research och geo

**23. [MCP] Starta pris- och researchkampanjen** enligt avsnitt 6, mot den ombyggda `/priser`. Detta är kontots största outnyttjade volym: cirka 12 000 kr på 90 dagar med CTR mellan 11 och 21 procent och nästan noll konverteringar.

**24. [UI] Geo till Närvaro och CPC-tak** på den kampanjen.

**25. [MCP] Lägg till geo-annonsgrupper** mot områdessidor med unik text. Norrtälje-sökorden har högst QS i hela icke-varumärkeskontot just för att de har en matchande sida.

### Budstrategi och skalning

**26. [MCP] Byt huvudkampanjen till Maximize Conversions** utan mål-CPA, tidigast tre till fyra veckor efter steg 1 till 3 och när 30-dagarsvolymen ligger över 12 konverteringar.

**27. [MCP] Nollställ enhetsmodifieraren** i huvudkampanjen efter steg 26. Smart bidding ignorerar den ändå.

**28. [UI] Ta bort tidsschemat** i huvudkampanjen efter steg 26. Samma skäl, och jag kan inte ta bort schemaposter.

**29. [MCP] Lägg på mål-CPA** när 30-dagarsvolymen stabilt överstiger 15. Sätt 15 till 20 procent över faktisk CPA vid övergången, inte på önskad nivå, och sänk 10 procent varannan vecka.

**30. [MCP] Höj budgeten till 700 kr/dag** när förlorad impression share till budget överstiger 25 procent. Inte innan, eftersom det som förloras idag beror på rank och inte på budget.

---

## 14. Det kortaste vettiga första steget

Om du vill se effekt snabbt utan att bygga om något: steg 1, 2, 3, 6, 7, 11 kör jag på några minuter via MCP. Steg 8, 9, 10 är cirka en kvart för dig i UI:t och är där de största pengarna sitter, eftersom `takläggare` bred matchning ensam är 32 procent av spenden och tidsschemat är inverterat mot data.

Resten (struktur, assets, `/priser`) är riktigt arbete och bör tas som ett eget block.

---

## 15. Vad som inte ändras utan godkännande

- Inga skrivningar mot Google Ads-kontot är gjorda ännu. Allt ovan är analys och förslag.
- `/tack`-sidan och gtag-koden rörs inte alls, enligt projektreglerna.
- Ändringar av konverteringsåtgärder (steg 1 till 3) påverkar historisk rapportering och bör göras medvetet, med datum noterat.

---

## 16. Genomförandelogg

### 2026-08-07, kört via MCP

| Åtgärd | Resultat |
|---|---|
| `form_submit` (`7624071599`) attributionsfönster 30 till 90 dagar | Klart |
| `form_submit` räknesätt till en per klick | Gick inte, `IMMUTABLE_FIELD`. Flyttad till GA4 Admin, se 4.1 |
| `phone_click` (`7605932601`) primär målåtgärd, värde 1 500 kr, fönster 90 dagar | Klart |
| Local actions till sekundära | Behövdes inte, redan `biddable: false` på målnivå. Se 4.3 |
| Kontroll av `takläggare` fras och exakt i `Ad group 1` | Fanns redan, båda aktiva med QS 3. Ingen ny post skapad |
| Enhetsmodifierare dator plus 20 procent | Gick inte, verktyget är trasigt. Flyttad till UI |

### Borttagna negativa keywords, kampanj 23643269229

Tolv borttagna: `plåttak pris`, `falsat plåttak pris`, `bandtäckt plåttak pris`, `dubbelfalsat plåttak pris`, `plåttak bandtäckning pris`, `plåttak`, `tegeltak`, `betongtak`, `papptak`, `eternittak`, `lägga nytt tak på gammalt hus`, `räkna takyta`, `byta tak med solceller`.

### Behållna, mot vad avsnitt 8.1 först föreslog

Elva stannar blockerade. Avsnitt 8.1 var för brett. Dessa är rimliga spärrar:

| Keyword | Skäl |
|---|---|
| `takpannor`, `tegelpannor`, `betongpannor`, `nockpannor`, `takpapp` | Produktköp, inte tjänsteköp |
| `byta tak steg för steg` | Gör-det-själv |
| `shingel` | Ingen shingeltjänst finns på sajten |
| `plåtslagare`, `plåtslagare stockholm` | Angränsande yrke, mycket ventilation och fasad |
| `byta altantak` | Ingen tjänstesida |
| `besiktningsprotokoll tak` | Informationssökning |

Öppen fråga till Sands: erbjuder ni shingeltak, altantak eller rent plåtslageri? Om ja bör de tre flyttas till borttagning.

---

## 17. Djupanalys: sökord, matchningstyper och negativ (2026-08-15)

Period 1 mars till 15 augusti 2026. Sökordsurvalet omfattar 78 953 kr av 78 955 och samtliga 40 konverteringar, alltså i praktiken hela kontot. Negativlistan lästes komplett, 604 poster.

### 17.1 Koncentrationen är kontots dominerande drag

| | Kostnad | Klick | Konv | CPA |
|---|---|---|---|---|
| `takläggare` (bred) + `sands entreprenad` | 25 829 kr (33 %) | 1 102 | **22 (55 %)** | **1 174 kr** |
| Övriga 398 sökord | 53 124 kr (67 %) | 2 556 | 18 (45 %) | **2 951 kr** |

**z = 3,45, p = 0,0006.** Den mest robusta siffran i hela materialet.

Topp 1 sökord är 30 procent av spenden, topp 5 är 42,5 procent och 26 av 40 konverteringar, topp 20 är 64,5 procent. Samtidigt har **174 sökord visningar men noll klick** (800 visningar tillsammans).

### 17.2 Matchningstyp förklarar ingenting

Utan varumärkessökord:

| Typ | Sökord | Klick | Kostnad | Konv | CTR | CPC | CVR |
|---|---|---|---|---|---|---|---|
| Bred | 12 | 1 250 | 30 426 kr | 13 | 4,5 % | 24,3 | 1,03 % |
| Fras | 231 | 2 067 | 40 734 kr | 16 | 9,4 % | 19,7 | 0,80 % |
| Exakt | 151 | 217 | 5 540 kr | 2 | 10,4 % | 25,5 | 0,77 % |

Bred mot fras och exakt: **z = 0,70, p = 0,481.**

En första körning gav 1,61 mot 0,79 procent, p = 0,022, vilket såg ut som ett starkt argument för bred matchning. Hela skillnaden var `sands entreprenad` som bred matchning, med 9 konverteringar på 105 klick. Kontrollen för varumärket var avgörande.

### 17.3 `takläggare` bred är rehabiliterad

| | 90 dagar (ursprunglig läsning) | Hela perioden |
|---|---|---|
| Konverteringar | 5 | **13** |
| CPA | 2 859 kr | **1 861 kr** |

Kontosnittet är 1 974 kr. Sökordet ligger under snittet. Den ursprungliga siffran kom av ett 90-dagarsfönster som råkade fånga en svag period, och ledde till rekommendationen att pausa sökordet. Den rekommendationen är felaktig och struken.

Mot resten av icke-varumärke: 1,30 mot 0,71 procent, z = 1,70, p = 0,089. Suggestivt, inte bevisat, men definitivt inte sämre.

De elva övriga breda sökorden har tillsammans noll konverteringar, och tio av dem är redan pausade.

### 17.4 Geografi: verklig CTR-signal, men små volymer och fel orter valda

`takläggare norrtälje` har CTR 10,1 procent mot 5,1 för `takläggare stockholm`. **z = 2,01, p = 0,044.**

| Ort | Visningar | Klick | Kostnad | Egen annonsgrupp |
|---|---|---|---|---|
| Stockholm | 594 | 53 | 1 429 kr | nej |
| Norrtälje | 230 | 35 | 886 kr | ja |
| Haninge | 35 | 3 | 67 kr | nej |
| Nacka | 29 | 2 | 58 kr | nej |
| Södertälje | 25 | 7 | 164 kr | nej |
| Järfälla | 13 | 1 | 17 kr | ja |
| Ekerö | 10 | 4 | 95 kr | nej |
| Bromma | 5 | 1 | 28 kr | ja |

Haninge, Nacka och Södertälje har mer volym än Järfälla och Bromma tillsammans.

**Reservation:** all geotrafik är 952 visningar, 108 klick, 2 785 kr och 2 konverteringar på 5,5 månader, alltså 3,5 procent av spenden. CVR-skillnaden mot icke-geo är p = 0,213 och alltså inte belagd. Geo är en relevansförbättring värd att göra billigt i en annonsgrupp, inte tio.

### 17.5 Negativlistan

604 poster: 305 fras, 196 breda, 103 exakta. 507 på den aktiva kampanjen, 97 på den pausade.

**En verklig konflikt:** `glidskydd` (fras) blockerar det aktiva sökordet `montera glidskydd`. Konflikten infördes 2026-08-15 i samma omgång som produktfiltren. 15 kr och ett klick, och annonsgruppen är pausad, men den ska rättas när Taksäkerhet återaktiveras.

**105 av 604 (17 procent) är helt inneslutna i ett annat negativ**, mest samma ord i tre matchningstyper (`jobb` som bred, fras och exakt). Ofarligt men underhållsskuld.

**Ett brett negativ är för brett:** `befintligt plåttak` blockerar allt som innehåller båda orden i valfri ordning, till exempel "lägga nytt tak på befintligt plåttak", som är en köpfråga. Övriga tretton breda negativ med kärnord är jobb- eller konkurrentrelaterade och ofarliga.

### 17.6 Vad analysen ändrar i planen

| Avsnitt | Ursprunglig rekommendation | Status |
|---|---|---|
| 3 | QS 3 till 6 halverar budet | Rättad, 29 procent är taket |
| 6 | Elva annonsgrupper | Reviderad till tre |
| 7 | Frasmatchning som grund | Struken, p = 0,481 |
| 13 punkt 8 | Pausa `takläggare` bred | Struken, den är kontots bästa icke-varumärkestillgång |

Auditen utgick från att strukturen är problemet. Analysen pekar i stället på koncentrationen: ett sökord bär en tredjedel av spenden och gör det till under kontosnittets CPA, medan 398 sökord kostar 53 000 kr och levererar till 2 951 kr styck. Det talar för att skala det som fungerar och stänga svansen, inte för att bygga ut strukturen.
