import { expect, type Locator, type Page } from "@playwright/test";

export type Lead = Record<string, string | undefined>;

/**
 * Stoppar all trafik utanför localhost och fångar det som skickas till
 * /api/lead. Inget lead når arket, och gtag, Ads och chattwidgeten laddas
 * aldrig, så testerna kan inte ge falska konverteringar.
 */
export async function forbered(page: Page) {
  const leads: Lead[] = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return route.fallback();
    return route.abort();
  });
  await page.route("**/api/lead", async (route) => {
    leads.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  return leads;
}

export const knapp = (page: Page, namn: string | RegExp) =>
  page.getByRole("button", { name: namn, exact: typeof namn === "string" });

/** Elementet ligger helt inom skärmen utan att besökaren scrollar. */
export async function synsUtanScroll(page: Page, el: Locator) {
  await expect(el).toBeVisible();
  const ruta = await el.boundingBox();
  const hojd = page.viewportSize()!.height;
  expect(ruta, "elementet saknar position").not.toBeNull();
  expect(ruta!.y, "elementet ligger ovanför skärmen").toBeGreaterThanOrEqual(0);
  expect(ruta!.y + ruta!.height, "elementet ligger under vikningen").toBeLessThanOrEqual(hojd);
}

/** Fyller i namn och telefon i formuläret inom `omrade` och skickar. */
export async function skicka(page: Page, omrade: Locator, knapptext: string) {
  await omrade.locator('input[type="text"]').first().fill("Test Testsson");
  await omrade.locator('input[type="tel"]').first().fill("070-123 45 67");
  await omrade.getByRole("button", { name: knapptext, exact: true }).click();
  await page.waitForURL("**/tack");
}
