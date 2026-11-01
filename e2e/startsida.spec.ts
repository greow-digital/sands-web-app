import { expect, test } from "@playwright/test";
import { forbered, skicka } from "./hjalp";

/*
  Startsidan hämtar senaste projekten från Sanity på servern. I miljöer
  utan nätverk till Sanity (till exempel Claude Code i molnet) svarar sidan
  500, så testet hoppas över där med UTAN_SANITY=1.
*/
test.skip(Boolean(process.env.UTAN_SANITY), "Kräver nätverk till Sanity");

// Heron har samma frågeflöde som landningssidan sedan 1 nov 2026.
test("startsidan laddar och frågeflödet i heron skickar leadet", async ({ page }) => {
  const leads = await forbered(page);
  const svar = await page.goto("/");
  expect(svar?.status()).toBe(200);
  await expect(page.locator("h1")).toContainText("takläggare i Stockholm");
  await expect(page.getByText("Prata med oss")).toHaveCount(0);

  const hero = page.locator("[data-hero-anchor]");
  await hero.getByRole("button", { name: /Byta tak/ }).click();
  await hero.getByRole("button", { name: "Betongpannor" }).click();
  await hero.getByRole("button", { name: "100–150 m²" }).click();
  await skicka(page, hero, "Få kostnadsfri offert");
  expect(leads[0]).toMatchObject({ formId: "home_hero", source: "/" });
  expect(leads[0].message).toContain("Från startsidan: byta tak");
});
