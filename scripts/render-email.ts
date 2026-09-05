/**
 * Renderar bekräftelsemejlet till statisk HTML och ren text.
 *
 * Används för att granska mejlet utan att skicka det, och för att kunna
 * klistra in HTML:en i mail-tester.com. Förhandsvisningen med live
 * reload startas i stället med:
 *   npx react-email dev --dir emails --port 3030
 *
 * Användning:
 *   npx tsx scripts/render-email.ts
 */
import { render } from "@react-email/render";
import fs from "node:fs/promises";
import path from "node:path";
import LeadConfirmation from "../emails/lead-confirmation";

const OUT = path.join(process.cwd(), ".email-preview");

const props = LeadConfirmation.PreviewProps;

async function main() {
  const element = LeadConfirmation(props);
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);

  await fs.mkdir(OUT, { recursive: true });
  await fs.writeFile(path.join(OUT, "lead-confirmation.html"), html, "utf8");
  await fs.writeFile(path.join(OUT, "lead-confirmation.txt"), text, "utf8");

  console.log(`HTML: ${(html.length / 1024).toFixed(1)} kB`);
  console.log(path.join(OUT, "lead-confirmation.html"));
}

main();
