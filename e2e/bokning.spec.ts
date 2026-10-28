import { expect, test, type Page } from "@playwright/test";
import { forbered, knapp, skicka } from "./hjalp";

/*
  Mötesbokaren på /tack efter offertflödet på landningssidan. /api/lead
  och /api/boka fångas, så ingen bokning når kalendern eller arket.
*/

const DAGAR = [
  {
    dag: "2030-01-08",
    rubrik: "tis 8 jan",
    tider: [
      { start: "2030-01-08T08:00:00.000Z", tid: "09:00" },
      { start: "2030-01-08T13:00:00.000Z", tid: "14:00" },
    ],
  },
];

async function medBiljett(page: Page) {
  const leads = await forbered(page);
  const bokningar: Record<string, unknown>[] = [];
  // Senare route vinner: leadet får en biljett i svaret.
  await page.route("**/api/lead", async (route) => {
    leads.push(route.request().postDataJSON());
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true,"bokning":"testbiljett"}' });
  });
  await page.route("**/api/boka**", async (route) => {
    if (route.request().method() === "GET") {
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ dagar: DAGAR }) });
    }
    const body = route.request().postDataJSON();
    bokningar.push(body);
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body.ring ? { ok: true } : { ok: true, dag: "tis 8 jan", tid: "14:00" }),
    });
  });
  return { leads, bokningar };
}

async function tillTack(page: Page) {
  await page.goto("/lp/taklaggare");
  await knapp(page, /Byta tak/).first().click();
  await knapp(page, "Tegelpannor").click();
  await knapp(page, "100–150 m²").click();
  await skicka(page, page.locator("#formular"), "Få gratis offert");
}

test.describe("Bokning på /tack", () => {
  test("leadet skickas först, sedan går det att boka en tid", async ({ page }) => {
    const { leads, bokningar } = await medBiljett(page);
    await tillTack(page);
    // Leadet är redan skickat innan bokaren visas.
    expect(leads).toHaveLength(1);

    // Bokningen är sidans huvudsak, tackdelen syns inte.
    await expect(page.getByRole("heading", { name: "Välj en tid för din kostnadsfria takkontroll" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tack för din förfrågan!" })).toBeHidden();
    const kort = page.getByTestId("boka-takkontroll");
    await knapp(page, "14:00").click();
    await kort.getByPlaceholder("Gata, ort").fill("Testvägen 1, Bromma");
    await kort.getByRole("button", { name: /^Boka / }).click();

    await expect(page.getByRole("heading", { name: "Din takkontroll är bokad" })).toBeVisible();
    expect(bokningar).toEqual([{ biljett: "testbiljett", start: "2030-01-08T13:00:00.000Z", adress: "Testvägen 1, Bromma" }]);
  });

  test("kunden kan välja att bli uppringd i stället", async ({ page }) => {
    const { bokningar } = await medBiljett(page);
    await tillTack(page);
    await page.getByRole("button", { name: /ringer upp mig/ }).click();
    await expect(page.getByRole("heading", { name: "Vi ringer upp dig" })).toBeVisible();
    expect(bokningar).toEqual([{ biljett: "testbiljett", ring: true }]);
  });

  test("utan biljett ser /tack ut som förut", async ({ page }) => {
    await forbered(page);
    await tillTack(page);
    await expect(page.getByRole("heading", { name: "Tack för din förfrågan!" })).toBeVisible();
    await expect(page.getByTestId("boka-takkontroll")).toBeHidden();
  });
});
