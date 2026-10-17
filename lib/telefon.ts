/*
  Kontroll av telefonnummer i formulären, så att den som skriver fel får
  veta det innan leaden skickas. Tidigare räckte sju valfria tecken av
  siffror, plus, mellanslag och bindestreck, och ett mobilnummer med två
  siffror för lite gick igenom. Då finns ingen att ringa upp.

  Bara klientsidan. API:t tar emot vad det får, eftersom en lead med
  e-post fortfarande går att nå även om numret är fel.
*/

/** Tar bort mellanslag, bindestreck, punkter, snedstreck och parenteser. */
function siffrorOchPlus(v: string) {
  return v.replace(/[\s\-./()]/g, "");
}

/**
 * Returnerar ett felmeddelande, eller null om numret ser riktigt ut.
 * Ett tomt fält räknas som giltigt, kravet på ifyllt fält ligger i
 * formulären.
 */
export function telefonFel(v?: string): string | null {
  if (!v?.trim()) return null;
  const s = siffrorOchPlus(v.trim());
  if (!/^\+?\d+$/.test(s)) return "Ange bara siffror";

  // +46 och 0046 blir 0. Står det +46 (0)8 tas den extra nollan bort.
  let nr = s.replace(/^(\+|00)46/, "0");
  if (nr !== s) nr = nr.replace(/^00/, "0");

  // Utländska nummer kontrolleras bara grovt (E.164 är högst 15 siffror).
  if (/^(\+|00)/.test(nr)) {
    const n = nr.replace(/^(\+|00)/, "").length;
    return n >= 7 && n <= 15 ? null : "Kontrollera numret";
  }

  if (!nr.startsWith("0")) return "Numret ska börja med 0 eller +46";

  // Mobilnummer: 07X-XXX XX XX, alltid tio siffror.
  if (nr.startsWith("07")) {
    if (nr.length === 10) return null;
    // Antalet skrivna siffror visas bara när numret skrevs med 0 först.
    // Efter +46 stämmer räkningen inte med det användaren ser i fältet.
    return nr === s
      ? `Mobilnummer har 10 siffror, du har skrivit ${nr.length}`
      : "Kontrollera numret, ett mobilnummer har 10 siffror";
  }

  // Fasta nummer: riktnummer plus abonnentnummer, 8 till 10 siffror.
  return nr.length >= 8 && nr.length <= 10 ? null : "Kontrollera numret";
}
