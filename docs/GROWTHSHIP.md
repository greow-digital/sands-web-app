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

## The Launchpad board

A kanban board at `/growthship/launchpad`. Cards are dragged between columns
(native HTML5 drag and drop) or moved from the card's detail dialog.

| Column | Status | Meaning |
| --- | --- | --- |
| Backlog | `Backlog` | Sent here from The Radar. |
| Redo att bygga | `Ready` | Has a brief a coding agent could execute. |
| Bygger | `Building` | Being implemented on a branch. |
| Granskning | `Review` | PR and preview wait for a human. |
| Live | `Shipped` | Merged to main. |
| Utvärderad | `Measured` | Result and learning written down. |

A card cannot leave Backlog without a `brief` (enforced in
`PATCH /api/growthship/launchpad`). The brief is the contract with the
future agent: which pages or files, what changes, how to verify. The three
middle columns are drawn with a dashed border because they are the stretch
an agent would own. Old statuses (`Planned`, `In progress`, `Completed`)
are mapped on read in `store/db.ts`.

## Launchpad to Claude Code (not built yet)

The shape the board is built for: "Starta med Claude Code" on a Ready card
kicks off an agent that implements the brief and lands it on main. The
button is rendered but disabled. `LaunchpadItem.implementation` is the
record a runner would fill in.

1. **Start.** `POST /api/growthship/launchpad/:id/implement` sets
   `implementation.state = "queued"`, moves the card to Building and fires a
   GitHub `workflow_dispatch` on this repo with the card id.
2. **Run.** A GitHub Actions workflow using `anthropics/claude-code-action`
   checks out the repo, builds the prompt (brief + hypothesis + the
   opportunity's evidence), lets Claude Code implement it on
   `growthship/<card-id>`, runs `npm run build` and `npm run lint`, and opens
   a PR. Claude Code reads `CLAUDE.md` itself, so the copy rules and the
   "never touch /tack or gtag" rule still apply. Alternative: the Claude
   Agent SDK in a Vercel Sandbox, which gives more control but means owning
   the infrastructure. Actions is the smaller step.
3. **Report back.** `POST /api/growthship/webhooks/github` (HMAC-verified,
   exempt from the password gate in `proxy.ts`) maps GitHub events onto the
   card: PR opened moves it to Review with `pullRequestUrl`, Vercel's
   `deployment_status` sets `previewUrl`, a failed workflow sets
   `state = "failed"` and moves it back to Ready.
4. **Land on main.** Recommended: the agent never pushes to main directly.
   Review holds a "Godkänn och merga" button that merges the PR through the
   GitHub API, which moves the card to Shipped with `commitSha`. Auto-merge
   for low-risk cards is possible later, behind branch protection with
   required checks.
5. **Measure.** After a set window, an analysis run compares the affected
   pages before and after and pre-fills `result` for Measured.

What it takes:

- **A real database.** `.data/growthship.json` does not survive on Vercel
  (read-only, per-instance filesystem), and webhooks need durable writes.
  Swap `store/db.ts` for Postgres (Neon) or Turso via the Vercel Marketplace.
- **Secrets.** `ANTHROPIC_API_KEY` as a GitHub Actions secret; a GitHub App
  or fine-grained token on the server (actions, pull requests and contents
  write); `GITHUB_WEBHOOK_SECRET`.
- **`GROWTHSHIP_PASSWORD` set in production**, since the board can then
  change the live site.
- **Guardrails** in the workflow: max turns, allowed tools, one run per
  card at a time, and a path deny-list (`app/tack`, analytics code).

## What's intentionally not here

Teams, roles, billing, a connector-management UI, notifications,
scheduling infrastructure. This is scope discipline, not an oversight: see
the "Scope discipline" section of the original build prompt.
