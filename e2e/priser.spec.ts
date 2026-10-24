import { expect, test } from "@playwright/test";
import { forbered, knapp, skicka } from "./hjalp";

test("offertflödet på /priser ger ett ungefärligt pris och skickar leadet", async ({ page }) => {
  const leads = await forbered(page);
  await page.goto("/priser");

  await knapp(page, "Betongpannor").click();
  await knapp(page, /Fortsätt/).click();
  await knapp(page, "Sadeltak").click();
  await knapp(page, "Skorsten").click();
  await knapp(page, /Fortsätt/).click();

  const flode = page.locator("#offertflode");
  await expect(flode.getByText("Ungefärligt pris efter ROT")).toBeVisible();
  await expect(flode.getByText("Få ditt exakta pris, gratis")).toBeVisible();
  // Skicksbedömningen hör till taktestet, inte till /priser.
  await expect(flode.getByText("Takets skick")).toHaveCount(0);

  await skicka(page, flode, "Få gratis offert");
  expect(leads).toHaveLength(1);
  expect(leads[0]).toMatchObject({ formId: "calc_bridge", leadSource: "priskalkylator", source: "/priser" });
  expect(leads[0].message).toContain("betongpannor");
});
