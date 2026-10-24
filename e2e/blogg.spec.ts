import { expect, test } from "@playwright/test";
import { forbered, skicka } from "./hjalp";

test("blogginlägget om läckage leder till formuläret och märks som blogglead", async ({ page }) => {
  const leads = await forbered(page);
  await page.goto("/blogg/taket-lacker");
  await expect(page.locator("h1")).toContainText("Taket läcker");

  // Uppmaningen ligger högt upp i texten, inte bara efter artikeln.
  const uppmaning = page.getByRole("link", { name: /Boka kostnadsfri takkontroll/ }).first();
  await expect(page.getByText("Läcker taket redan nu?")).toBeVisible();
  await uppmaning.click();

  const formular = page.locator("#formular");
  await expect(formular.locator('input[type="text"]').first()).toBeInViewport();

  await skicka(page, formular, "Få prisförslag");
  expect(leads).toHaveLength(1);
  expect(leads[0]).toMatchObject({ formId: "blogg", leadSource: "blogg", source: "/blogg/taket-lacker" });
});
