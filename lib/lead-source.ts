// Kanonisk lead-källa (kanal) per formId. Används på ETT ställe så att både
// Google Sheet-payloaden (/api/lead) och GA4-konverteringen (lead_source) får
// samma värde. Då kan leads grupperas efter varifrån de kom.
//
// Nya kanaler: lägg till en case här, inget annat behöver ändras.
export function leadSourceFor(formId: string | undefined): string {
  switch (formId) {
    case "voice":
      return "voice"; // röstagenten Sanna
    case "taktest":
      return "taktest"; // taktest-quiz + chatt-widget
    case "calc_bridge":
      return "priskalkylator"; // priskalkylatorn
    case "home_hero":
    case "home_section":
      return "startsida"; // formulären på startsidan
    case "taklaggning_hero":
    case "taklaggning_section":
    case "tjanst_hero":
      return "tjanstesida"; // formulären på tjänstesidorna
    case "omrade_hero":
      return "omradessida"; // formulären i heron på ortssidorna
    case "popup":
      return "popup";
    case "offert":
    default:
      return "offertformular"; // vanliga offertformuläret
  }
}
