import { mkdir, readFile, writeFile, rename } from "fs/promises";
import { dirname, join } from "path";
import type { AnalysisRun, LaunchpadItem, Opportunity } from "../types";
import type { CognyBundle } from "../cogny/types";
import type { MarketingReport } from "../reporting/types";

// Server-only. The app has no existing database (Sanity is a CMS for
// marketing content, not a fit for records whose status changes often),
// so Growthship persists to a single JSON file. This is deliberately the
// simplest thing that works for one user and a few hundred records; if
// this ever needs to survive a serverless/multi-instance deploy, swap
// this module for Postgres/Turso and keep the same function signatures.

interface Shape {
  opportunities: Opportunity[];
  launchpadItems: LaunchpadItem[];
  analysisRuns: AnalysisRun[];
  latestBundle: CognyBundle | null;
  report: MarketingReport | null;
}

const DATA_DIR = join(process.cwd(), ".data");
const DATA_FILE = join(DATA_DIR, "growthship.json");

const EMPTY: Shape = {
  opportunities: [],
  launchpadItems: [],
  analysisRuns: [],
  latestBundle: null,
  report: null,
};

// Next.js can run several requests concurrently in one process; chain
// writes through this promise so two writers never interleave.
let queue: Promise<unknown> = Promise.resolve();

async function readShape(): Promise<Shape> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<Shape>;
    return {
      opportunities: parsed.opportunities ?? [],
      launchpadItems: parsed.launchpadItems ?? [],
      analysisRuns: parsed.analysisRuns ?? [],
      latestBundle: parsed.latestBundle ?? null,
      report: parsed.report ?? null,
    };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return { ...EMPTY };
    throw err;
  }
}

async function writeShape(shape: Shape): Promise<void> {
  await mkdir(dirname(DATA_FILE), { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(shape, null, 2), "utf-8");
  await rename(tmp, DATA_FILE);
}

function withQueue<T>(fn: (shape: Shape) => Promise<T> | T): Promise<T> {
  const run = queue.then(async () => {
    const shape = await readShape();
    const result = await fn(shape);
    await writeShape(shape);
    return result;
  });
  // Keep the chain alive even if this call rejects, but don't let a
  // rejection here leak as an unhandled rejection on the shared queue.
  queue = run.catch(() => undefined);
  return run;
}

export async function listOpportunities(): Promise<Opportunity[]> {
  return (await readShape()).opportunities;
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  const found = (await readShape()).opportunities.find((o) => o.id === id);
  return found ?? null;
}

export async function upsertOpportunities(
  incoming: Opportunity[]
): Promise<{ created: number; updated: number }> {
  return withQueue((shape) => {
    let created = 0;
    let updated = 0;
    for (const next of incoming) {
      const idx = shape.opportunities.findIndex(
        (o) => o.dedupeKey === next.dedupeKey
      );
      if (idx === -1) {
        shape.opportunities.push(next);
        created += 1;
      } else {
        const existing = shape.opportunities[idx];
        shape.opportunities[idx] = {
          ...next,
          id: existing.id,
          status: existing.status,
          createdAt: existing.createdAt,
          updatedAt: new Date().toISOString(),
        };
        updated += 1;
      }
    }
    return { created, updated };
  });
}

export async function updateOpportunityStatus(
  id: string,
  status: Opportunity["status"]
): Promise<Opportunity | null> {
  return withQueue((shape) => {
    const idx = shape.opportunities.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    shape.opportunities[idx] = {
      ...shape.opportunities[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    return shape.opportunities[idx];
  });
}

export async function listLaunchpadItems(): Promise<LaunchpadItem[]> {
  return (await readShape()).launchpadItems;
}

export async function createLaunchpadItem(
  item: LaunchpadItem
): Promise<LaunchpadItem> {
  return withQueue((shape) => {
    shape.launchpadItems.push(item);
    return item;
  });
}

export async function updateLaunchpadItem(
  id: string,
  patch: Partial<
    Pick<LaunchpadItem, "status" | "result" | "learning" | "hypothesis">
  >
): Promise<LaunchpadItem | null> {
  return withQueue((shape) => {
    const idx = shape.launchpadItems.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    shape.launchpadItems[idx] = {
      ...shape.launchpadItems[idx],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    return shape.launchpadItems[idx];
  });
}

export async function listAnalysisRuns(): Promise<AnalysisRun[]> {
  return (await readShape()).analysisRuns;
}

export async function recordAnalysisRun(run: AnalysisRun): Promise<AnalysisRun> {
  return withQueue((shape) => {
    shape.analysisRuns.unshift(run);
    shape.analysisRuns = shape.analysisRuns.slice(0, 50);
    return run;
  });
}

export async function getLatestBundle(): Promise<CognyBundle | null> {
  return (await readShape()).latestBundle;
}

export async function setLatestBundle(bundle: CognyBundle): Promise<void> {
  await withQueue((shape) => {
    shape.latestBundle = bundle;
  });
}

export async function getReport(): Promise<MarketingReport | null> {
  return (await readShape()).report;
}

export async function setReport(report: MarketingReport): Promise<void> {
  await withQueue((shape) => {
    shape.report = report;
  });
}
