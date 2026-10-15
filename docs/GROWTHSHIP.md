# The Growthship

Internal growth operating system for Sands, at `/growthship`. One user, one
password, no accounts. See `lib/growthship/cogny/README.md` for how Cogny
data actually gets in today, and the Phase plan in the original build
prompt for the long-term shape (Bridge to Radar to Launchpad to Engine Room).

## Setup

- `GROWTHSHIP_PASSWORD`: shared password for the one gate on `/growthship`.
  Without it, Growthship is reachable in `npm run dev` (not in production) so
  local work doesn't need setup.
- No other env vars are required. There is no LLM key and no Cogny key
  configured; see the boundary note below.

## Running an analysis

```
npm run growthship:seed
```

Runs `scripts/growthship-seed.ts`, which currently holds the real Cogny
numbers pulled on 2026-10-15 (GA4 property 528115518, Search Console
sc-domain:sandsab.se, Google Ads 4767554827) and feeds them through the
analysis engine. To refresh: ask an agent with Cogny access to pull current
GA4/GSC/Ads data for the same window, replace the literals in that script,
and run it again. Re-running updates existing opportunities (matched by
`dedupeKey`) instead of duplicating them.

The in-app "Run analysis" button in The Engine Room calls the same engine
via `POST /api/growthship/analysis-runs`, but the server has no live Cogny
credential yet, so it reports that honestly instead of inventing data.

## Where things live

- `lib/growthship/types.ts`: Opportunity, LaunchpadItem, AnalysisRun.
- `lib/growthship/store/db.ts`: persistence. A single JSON file at
  `.data/growthship.json` (gitignored), because there is no existing app
  database and this is an MVP for one user. Swap for Postgres/Turso behind
  this same module if it ever needs to survive a serverless/multi-instance
  deploy.
- `lib/growthship/cogny/`: the Cogny-shaped domain types Growthship
  actually renders, independent of which underlying source (GA4, GSC, Ads)
  produced them.
- `lib/growthship/analysis/`: detectors (rule-based opportunity
  generation), scoring, observations (Overview's "what's happening"),
  and `ask.ts` (deterministic Q&A over the stored snapshot, not an LLM
  call, since no LLM key is configured here).
- `app/growthship/`: the UI. `proxy.ts` (Next 16's renamed middleware)
  gates everything under `/growthship` and `/api/growthship`.

## What's intentionally not here

Teams, roles, billing, a connector-management UI, notifications,
scheduling infrastructure. This is scope discipline, not an oversight: see
the "Scope discipline" section of the original build prompt.
