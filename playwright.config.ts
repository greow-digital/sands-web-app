import { defineConfig, devices } from "@playwright/test";

/*
  Flödestester för konverteringsvägarna (landningssidan, /priser och
  startsidan). Körs på en liten mobil, där problemen brukar synas först.

  Lokalt startas en dev-server automatiskt. I CI byggs sajten först och
  körs med next start. All trafik till andra domäner än localhost stoppas
  i testerna (se e2e/hjalp.ts), så inga leads, GA-händelser eller
  Ads-konverteringar skickas på riktigt.

  Finns Chromium redan installerad (som i Claude Code-miljön) pekar
  PW_CHROMIUM ut den, annars används Playwrights egen.
*/
const PORT = 3200;
const CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  retries: CI ? 1 : 0,
  reporter: CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
  },
  projects: [
    {
      name: "mobil",
      // 375×667, samma storlek som mätningarna inför formulärfixen.
      use: { ...devices["iPhone 8"], defaultBrowserType: "chromium" },
    },
  ],
  webServer: {
    command: CI ? `npx next start -p ${PORT}` : `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}/lp/taklaggare`,
    reuseExistingServer: !CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "3do82whm",
      NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
    },
  },
});
