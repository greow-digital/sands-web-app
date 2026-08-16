/**
 * Vilka tjänster som faktiskt utfördes i varje projekt.
 *
 * Klassificeringen är gjord på projektets `beskrivning` i Sanity, som är
 * den enda av fälten som stämmer. Fälten `typ`, `taggar` och `material`
 * är felaktiga på ungefär en tredjedel av projekten: ett badrumsprojekt
 * är taggat "Betongtak", en fasadmålning har material "Monier
 * tegeltakpannor", och flera takprojekt har fel taktyp. Bygg därför
 * ingenting på `typ` utan att först rätta datan i Studion.
 *
 * Första tjänsten i listan är den primära och används som huvudtagg.
 * Slugarna motsvarar sidorna i lib/tjanster.ts.
 *
 * `null` betyder att projektet saknar matchande tjänstesida. Sätt inte en
 * ungefärlig tjänst där, en felaktig tagg är sämre än ingen.
 */
export type TjanstSlug =
  | "taklaggning"
  | "tegeltak"
  | "betongtak"
  | "plattak"
  | "papptak"
  | "takfonsterkupor"
  | "hangrannorstupror"
  | "taksakerhet"
  | "fasadrenovering"
  | "badrumsrenovering"
  | "koksrenovering"
  | "totalentreprenad";

export const PROJEKT_TJANSTER: Record<string, TjanstSlug[] | null> = {
  // ── Takomläggning och takbyte, betongpannor ──────────────
  "fagerasen-vrena": ["taklaggning", "betongtak"],
  "hakevagen-djursholm": ["taklaggning", "betongtak"],
  "kastanjetunet-lidingo": ["taklaggning", "betongtak"],
  "plommonvagen-bromma": ["taklaggning", "betongtak"],
  "prastgardsvagen-tumba": ["taklaggning", "betongtak"],
  "skrattmasvagen-farsta": ["taklaggning", "betongtak"],
  "solfagravagen-huddinge": ["taklaggning", "betongtak"],
  "takomlaggning-enskede": ["taklaggning", "betongtak"],
  "takomlaggning-farsta": ["taklaggning", "betongtak"],
  "takomlaggning-gnesta": ["taklaggning", "betongtak"],
  "takomlaggning-huddinge": ["taklaggning", "betongtak"],
  "takomlaggning-lidingo": ["taklaggning", "betongtak"],
  "timmerbacken-tumba": ["taklaggning", "betongtak"],
  "frotunagrand-upplands-vasby": [
    "taklaggning",
    "betongtak",
    "taksakerhet",
    "fasadrenovering",
  ],
  "takomlaggning-norrtalje": ["taklaggning", "betongtak", "taksakerhet"],
  "vartavagen-taby": ["taklaggning", "betongtak", "taksakerhet"],
  "skacklingevagen-tumba": ["taklaggning", "betongtak", "takfonsterkupor"],
  "takomlaggning-grodinge": ["taklaggning", "betongtak", "takfonsterkupor"],
  "takrenovering-taby": ["taklaggning", "betongtak", "takfonsterkupor"],

  // ── Takomläggning och takbyte, tegel ─────────────────────
  "aladdinvagen-bromma": ["taklaggning", "tegeltak", "hangrannorstupror"],
  "karl-nordstromsvag-bromma": ["taklaggning", "tegeltak"],
  "klappstigen-bromma": ["taklaggning", "tegeltak"],
  "norrangsvagen-huddinge": ["taklaggning", "tegeltak"],
  "nytorpsvagen-koping": ["taklaggning", "tegeltak"],
  "skovelvagen-alvsjo": ["taklaggning", "tegeltak"],
  "takomlaggning-nykoping": ["taklaggning", "tegeltak"],
  "viksjo-jarfalla": ["taklaggning", "tegeltak"],
  "stenvagen-vaxholm": ["taklaggning", "tegeltak", "fasadrenovering"],

  // ── Plåt och papp ────────────────────────────────────────
  "takomlaggning-hasselby": ["taklaggning", "plattak"],
  "takomlaggning-upplands-bro": ["taklaggning", "plattak", "takfonsterkupor"],
  "papptak-fasad-hasselby": ["papptak", "fasadrenovering"],
  "volmvagen-jarfalla": ["fasadrenovering", "papptak", "hangrannorstupror"],

  // ── Fasad ────────────────────────────────────────────────
  "fasadmalning-vallingby": ["fasadrenovering"],
  "sorgardsvagen-bromma": ["fasadrenovering"],

  // ── Renovering och totalentreprenad ──────────────────────
  "badrumsrenovering-norsborg": ["badrumsrenovering"],
  "takomlaggning-skokloster": ["koksrenovering"],
  "enskededalen-stockholm": ["totalentreprenad", "badrumsrenovering"],
  "haggvagen-jarfalla": ["totalentreprenad", "badrumsrenovering"],
  "lagenhetsrenovering-kungsholmen": [
    "totalentreprenad",
    "badrumsrenovering",
    "koksrenovering",
  ],
  "takomlaggning-upplands-vasby": [
    "totalentreprenad",
    "badrumsrenovering",
    "koksrenovering",
  ],
  "totalrenovering-jarfalla": [
    "totalentreprenad",
    "badrumsrenovering",
    "koksrenovering",
    "fasadrenovering",
  ],
  "takrenovering-sollentuna": ["totalentreprenad"],
  "alstromervagen-skarholmen": ["totalentreprenad"],
  "nybyggnation-uttran": ["totalentreprenad", "tegeltak"],

  // ── Saknar matchande tjänstesida ─────────────────────────
  // Mark, altan och pool säljs men har ingen egen sida. Hellre ingen
  // tagg än en som skickar besökaren fel.
  "altanbygge-hasselby": null,
  "poolbygge-uteplats-solna": null,
  "finplanering-enkoping": null,
  "radhusslingan-strangnas": null,
};
