import { expect, test } from "@playwright/test";
import { forbered, skicka } from "./hjalp";

/*
  Startsidan hämtar senaste projekten från Sanity på servern. I miljöer
  utan nätverk till Sanity (till exempel Claude Code i molnet) svarar sidan
  500, så testet hoppas över där med UTAN_SANITY=1.
*/
test.skip(Boolean(process.env.UTAN_SANITY), "Kräver nätverk till Sanity");

test("startsidan laddar och heroformuläret skickar leadet", async ({ page }) => {
  const leads = await forbered(page);
  const svar = await page.goto("/");
  expect(svar?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("takläggare i Stockholm");

  const hero = page.locator("[data-hero-anchor]");
  await skicka(page, hero, "Få mitt prisförslag");
  expect(leads[0]).toMatchObject({ formId: "home_hero", source: "/" });
});
