/**
 * One-shot geocoder for the customer registry.
 *
 * Reads a CSV with addresses, geocodes unique addresses via Google
 * Geocoding API, aggregates results into a k-anonymous density grid,
 * and writes the aggregated output to lib/customer-density.json.
 *
 * Safety rails:
 *   - Dry-run by default. Pass --execute to actually call the API.
 *   - Hard cap: aborts if more than MAX_API_CALLS new requests are needed.
 *   - Persistent cache in scripts/cache/geocoded.json — re-runs reuse results.
 *   - Sequential, 100ms throttle (10 req/s) — no parallel requests.
 *   - K-anonymity: cells with fewer than MIN_CELL_COUNT customers are dropped.
 *
 * Usage:
 *   npx tsx scripts/geocode-customers.ts [--execute] [--csv path/to.csv]
 *
 * The raw CSV must stay outside the repo (e.g. ~/Downloads/).
 * Only the aggregated lib/customer-density.json is committed.
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import readline from "node:readline";
import { parse } from "csv-parse/sync";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// ───── Config ───────────────────────────────────────────────────────

function findDefaultCsv(): string | null {
  const dir = path.join(os.homedir(), "Downloads");
  if (!fs.existsSync(dir)) return null;
  const matches = fs
    .readdirSync(dir)
    .filter((f) => /kunder.*\.csv$/i.test(f))
    .map((f) => path.join(dir, f));
  if (matches.length === 0) return null;
  // Newest first
  matches.sort(
    (a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs
  );
  return matches[0];
}
const DEFAULT_CSV = findDefaultCsv();
const CACHE_FILE = path.join(
  process.cwd(),
  "scripts",
  "cache",
  "geocoded.json"
);
const OUTPUT_FILE = path.join(
  process.cwd(),
  "lib",
  "customer-density.json"
);

const MAX_API_CALLS = 3000;
const REQUEST_THROTTLE_MS = 100;
const MIN_CELL_COUNT = 10;

// Grid resolution: ~500-600m at Stockholm latitude
const LAT_BUCKET = 0.005;
const LNG_BUCKET = 0.01;

const args = new Set(process.argv.slice(2));
const dryRun = !args.has("--execute");
const skipPrompt = args.has("--yes");
const csvArg = process.argv.find((_, i, a) => a[i - 1] === "--csv");
const limitArg = process.argv.find((_, i, a) => a[i - 1] === "--limit");
const limit = limitArg ? Number.parseInt(limitArg, 10) : Infinity;
const csvPath = csvArg ?? DEFAULT_CSV;

if (!csvPath) {
  console.error(
    "✗ No CSV file found in ~/Downloads matching 'kunder*.csv'. Pass --csv path/to/file.csv"
  );
  process.exit(1);
}


// ───── Address extraction ───────────────────────────────────────────

interface CustomerRow {
  postadress?: string;
  besoksadress?: string;
  fakturaadress?: string;
}

function pickAddress(row: CustomerRow): string | null {
  // Prefer Postadress; fall back to Besöksadress, then Fakturaadress
  const candidates = [row.postadress, row.besoksadress, row.fakturaadress];
  for (const raw of candidates) {
    if (!raw) continue;
    const cleaned = raw.trim();
    // Skip placeholders like ", Sverige" with no actual street
    if (cleaned === ", Sverige" || cleaned === "") continue;
    // Must contain at least a comma (street, city) and not just a country
    if (!cleaned.includes(",")) continue;
    return cleaned;
  }
  return null;
}

function normalizeForCache(addr: string): string {
  return addr.toLowerCase().replace(/\s+/g, " ").trim();
}

// ───── Geocoding ────────────────────────────────────────────────────

interface GeocodeResult {
  lat: number;
  lng: number;
  status: "OK" | "ZERO_RESULTS" | "FAILED";
}

type Cache = Record<string, GeocodeResult>;

function loadCache(): Cache {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_FILE, "utf8")) as Cache;
  } catch {
    return {};
  }
}

function saveCache(cache: Cache): void {
  fs.mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function geocode(
  address: string,
  apiKey: string
): Promise<GeocodeResult> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("region", "se");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url);
  const data = (await res.json()) as {
    status: string;
    results: { geometry: { location: { lat: number; lng: number } } }[];
  };

  if (data.status === "OK" && data.results.length > 0) {
    const loc = data.results[0].geometry.location;
    return { lat: loc.lat, lng: loc.lng, status: "OK" };
  }
  if (data.status === "ZERO_RESULTS") {
    return { lat: 0, lng: 0, status: "ZERO_RESULTS" };
  }
  return { lat: 0, lng: 0, status: "FAILED" };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ───── Aggregation ──────────────────────────────────────────────────

function aggregate(coords: GeocodeResult[]): { lat: number; lng: number; count: number }[] {
  const cells = new Map<string, { lat: number; lng: number; count: number }>();

  for (const c of coords) {
    if (c.status !== "OK") continue;
    const latBucket = Math.round(c.lat / LAT_BUCKET) * LAT_BUCKET;
    const lngBucket = Math.round(c.lng / LNG_BUCKET) * LNG_BUCKET;
    const key = `${latBucket.toFixed(4)},${lngBucket.toFixed(4)}`;
    const existing = cells.get(key);
    if (existing) {
      existing.count++;
    } else {
      cells.set(key, { lat: latBucket, lng: lngBucket, count: 1 });
    }
  }

  // K-anonymity: drop cells below threshold
  return Array.from(cells.values()).filter((c) => c.count >= MIN_CELL_COUNT);
}

// ───── Confirmation prompt ──────────────────────────────────────────

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (a) => {
      rl.close();
      resolve(a);
    })
  );
}

// ───── Main ─────────────────────────────────────────────────────────

async function main() {
  console.log(`\n${dryRun ? "🔍 DRY-RUN (no API calls)" : "🚀 EXECUTE MODE"}`);
  console.log(`→ CSV: ${csvPath}\n`);

  if (!fs.existsSync(csvPath)) {
    console.error(`✗ CSV not found: ${csvPath}`);
    process.exit(1);
  }

  // CSV is UTF-8 encoded (default for modern CRM exports)
  const rawText = fs.readFileSync(csvPath, "utf8");

  type Record = Record<string, string>;
  const records = parse(rawText, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
  }) as Record[];

  console.log(`→ Parsed ${records.length} rows from CSV`);

  // Extract addresses. Also filter out obvious CRM mock/template rows.
  const SKIP_PATTERNS = [
    /mall/i,
    /^badrum/i,
    /^brutet tak/i,
    /^takomläggning \d/i,
    /^exempel /i,
    /^erbjudande /i,
    /^offertförslag/i,
    /^projekt /i,
    /^test\b/i,
    /^sdsd/i,
    /^sasd/i,
    /^boende/i,
  ];

  const allAddresses: string[] = [];
  for (const row of records) {
    const candidate: CustomerRow = {
      postadress: row["Postadress"] ?? "",
      besoksadress: row["Besöksadress"] ?? "",
      fakturaadress: row["Fakturaadress"] ?? "",
    };
    const addr = pickAddress(candidate);
    if (!addr) continue;
    if (SKIP_PATTERNS.some((re) => re.test(addr))) continue;
    allAddresses.push(addr);
  }

  // Dedupe (normalize for cache key, keep original for API call)
  const unique = new Map<string, string>();
  for (const addr of allAddresses) {
    const key = normalizeForCache(addr);
    if (!unique.has(key)) unique.set(key, addr);
  }

  console.log(`→ ${allAddresses.length} rows had addresses`);
  console.log(`→ ${unique.size} unique addresses after dedupe\n`);

  // Check cache
  const cache = loadCache();
  const toGeocodeAll: { key: string; address: string }[] = [];
  let cached = 0;
  for (const [key, address] of unique) {
    if (cache[key]) {
      cached++;
    } else {
      toGeocodeAll.push({ key, address });
    }
  }

  // Apply --limit
  const toGeocode = toGeocodeAll.slice(0, limit);
  const limited = toGeocodeAll.length - toGeocode.length;

  console.log(`📦 Cache hits:    ${cached}`);
  console.log(`🌐 New requests:  ${toGeocode.length}${limited ? ` (--limit applied, ${limited} skipped)` : ""}`);
  console.log(
    `💰 Est. cost:     ~$${((toGeocode.length / 1000) * 5).toFixed(2)} (covered by $200/mo free tier)\n`
  );

  // Hard cap check
  if (toGeocode.length > MAX_API_CALLS) {
    console.error(
      `✗ ABORT: would require ${toGeocode.length} API calls, max is ${MAX_API_CALLS}.`
    );
    console.error(`  Check the CSV — something seems off.`);
    process.exit(1);
  }

  if (toGeocode.length === 0) {
    console.log("✓ Everything cached. Skipping API.\n");
  } else if (dryRun) {
    console.log("🔍 Dry-run: stopping before API calls.");
    console.log(`   Run with --execute to actually geocode.\n`);
    process.exit(0);
  } else {
    const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;
    if (!apiKey) {
      console.error("✗ Missing GOOGLE_GEOCODING_API_KEY in .env.local");
      process.exit(1);
    }

    if (!skipPrompt) {
      const answer = await prompt(
        `Continue and make ${toGeocode.length} API calls? (yes/no) `
      );
      if (answer.trim().toLowerCase() !== "yes") {
        console.log("✗ Aborted.");
        process.exit(0);
      }
    } else {
      console.log(`→ --yes flag: skipping prompt, executing ${toGeocode.length} calls`);
    }

    console.log("\n→ Geocoding...");
    let ok = 0;
    let zero = 0;
    let failed = 0;
    const startedAt = Date.now();

    for (const [i, { key, address }] of toGeocode.entries()) {
      try {
        const result = await geocode(address, apiKey);
        cache[key] = result;
        if (result.status === "OK") ok++;
        else if (result.status === "ZERO_RESULTS") zero++;
        else failed++;

        // Save cache every 50 requests so we don't lose progress
        if ((i + 1) % 50 === 0) {
          saveCache(cache);
          console.log(
            `   ${i + 1}/${toGeocode.length} (${ok} ok, ${zero} no-result, ${failed} failed)`
          );
        }
      } catch (err) {
        failed++;
        console.warn(`   ✗ ${address}: ${(err as Error).message}`);
      }
      await sleep(REQUEST_THROTTLE_MS);
    }

    saveCache(cache);
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(0);
    console.log(
      `\n✓ Geocoded ${ok} OK, ${zero} no-result, ${failed} failed in ${elapsed}s`
    );
  }

  // Aggregate
  const allResults: GeocodeResult[] = [];
  for (const [key] of unique) {
    if (cache[key]) allResults.push(cache[key]);
  }

  const cells = aggregate(allResults);
  cells.sort((a, b) => b.count - a.count);

  const totalCustomers = allResults.filter((r) => r.status === "OK").length;
  const customersInVisibleCells = cells.reduce((sum, c) => sum + c.count, 0);
  const customersInDroppedCells = totalCustomers - customersInVisibleCells;

  console.log(`\n──────────────────────────────`);
  console.log(`📊 Aggregation result`);
  console.log(`──────────────────────────────`);
  console.log(`Total geocoded:           ${totalCustomers}`);
  console.log(`Visible cells (≥${MIN_CELL_COUNT}):       ${cells.length}`);
  console.log(`Customers in visible:     ${customersInVisibleCells}`);
  console.log(`Hidden (low-count cells): ${customersInDroppedCells}`);
  console.log(`──────────────────────────────`);
  if (cells.length > 0) {
    console.log(`Densest cell:  ${cells[0].count} customers`);
    console.log(`Median cell:   ${cells[Math.floor(cells.length / 2)].count} customers`);
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        totalCustomersGeocoded: totalCustomers,
        kAnonymityThreshold: MIN_CELL_COUNT,
        gridResolutionDeg: { lat: LAT_BUCKET, lng: LNG_BUCKET },
        cells,
      },
      null,
      2
    )
  );

  console.log(`\n✓ Wrote ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
