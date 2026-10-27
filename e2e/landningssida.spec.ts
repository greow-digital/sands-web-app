import { expect, test } from "@playwright/test";
import { forbered, knapp, skicka, synsUtanScroll } from "./hjalp";

test.describe("Landningssidan /lp", () => {
  test("tre frågor, sedan formuläret i bild, och svaren följer med leadet", async ({ page }) => {
    const leads = await forbered(page);
    await page.goto("/lp/taklaggare");
    await expect(page.locator("h1")).toContainText("Takläggare i Stockholm");

    await knapp(page, /Byta tak/).first().click();
    await knapp(page, "Tegelpannor").click();
    await knapp(page, "100–150 m²").click();

    const formular = page.locator("#formular");
    await expect(formular.getByText("Få din offert med fast pris")).toBeVisible();
    // Inget riktpris på landningssidan (beslut 20 okt 2026).
    await expect(formular.getByText(/riktpris/i)).toHaveCount(0);

    // Namn, telefon och e-post syns, fritexten ligger bakom en länk, och
    // betyg plus ett kundcitat står ovanför knappen (26 okt 2026).
    await expect(formular.locator('input[type="email"]')).toBeVisible();
    await expect(formular.locator("textarea")).toHaveCount(0);
    await expect(formular.getByText(/av 5 · \d+ omdömen/)).toBeVisible();
    await expect(formular.getByText("Hasse, Sollentuna")).toBeVisible();

    // Formulärfixen 22 okt 2026: namnfältet och knappen syns direkt.
    await page.waitForTimeout(900);
    await synsUtanScroll(page, formular.locator('input[type="text"]').first());
    await synsUtanScroll(page, formular.getByRole("button", { name: "Få gratis offert", exact: true }));

    await skicka(page, formular, "Få gratis offert");
    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({ formId: "lp_hero", leadSource: "landningssida", source: "/lp/taklaggare" });
    expect(leads[0].message).toContain("byta tak");
    expect(leads[0].message).toContain("tegelpannor");
  });

  test("sökordet från annonsen väljer variant och följer med leadet", async ({ page }) => {
    const leads = await forbered(page);
    await page.goto("/lp/taklaggare?kw=byta%20tak");
    await expect(page.locator("h1")).toContainText("Byta tak i Stockholm");

    // Varianten förväljer ärendet, så flödet börjar på taktyp.
    await knapp(page, "Betongpannor").click();
    await knapp(page, "150–200 m²").click();
    await skicka(page, page.locator("#formular"), "Få gratis offert");
    expect(leads[0].message).toContain("annonssökord: byta tak");
  });

  test("sökord med åäö mappas rätt", async ({ page }) => {
    await forbered(page);
    await page.goto("/lp/taklaggare?kw=takoml%C3%A4ggning");
    await expect(page.locator("h1")).toContainText("Takomläggning i Stockholm");
  });

  test("den som hellre vill bli mejlad kan skicka utan telefonnummer", async ({ page }) => {
    const leads = await forbered(page);
    await page.goto("/lp/takbyte");
    await knapp(page, "Betongpannor").click();
    await knapp(page, "Under 100 m²").click();
    const formular = page.locator("#formular");
    await formular.locator('input[type="text"]').first().fill("Test Testsson");

    // Utan telefon och e-post stoppas formuläret.
    await formular.getByRole("button", { name: "Få gratis offert", exact: true }).click();
    await expect(formular.getByText("Fyll i telefon eller e-post, du väljer själv")).toBeVisible();

    await formular.locator('input[type="email"]').fill("test@example.com");
    await formular.getByRole("button", { name: "+ Lägg till ett meddelande (valfritt)" }).click();
    await formular.locator("textarea").fill("Kupor på baksidan");
    await formular.getByRole("button", { name: "Få gratis offert", exact: true }).click();
    await page.waitForURL("**/tack");
    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({ email: "test@example.com", formId: "lp_hero" });
    expect(leads[0].phone ?? "").toBe("");
    expect(leads[0].message).toContain("Kupor på baksidan");
  });

  test("felaktigt mobilnummer stoppas innan det skickas", async ({ page }) => {
    const leads = await forbered(page);
    await page.goto("/lp/takbyte");
    await knapp(page, "Betongpannor").click();
    await knapp(page, "Under 100 m²").click();
    const formular = page.locator("#formular");
    await formular.locator('input[type="text"]').first().fill("Test Testsson");
    await formular.locator('input[type="tel"]').first().fill("07057819");
    await formular.getByRole("button", { name: "Få gratis offert", exact: true }).click();
    await expect(formular.getByText(/Mobilnummer har 10 siffror/)).toBeVisible();
    expect(leads).toHaveLength(0);
  });
});
