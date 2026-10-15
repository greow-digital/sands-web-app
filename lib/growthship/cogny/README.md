# Cogny layer: how data actually gets in

Cogny's MCP tools (GA4, Search Console, Google Ads, GTM) are reachable by an
agent session with the Cogny connector attached, not by this Next.js app's
own server process. There is no workspace API key yet for a plain server to
call Cogny directly over HTTP.

So for v1:

1. An agent with Cogny access (this was Claude Code, could be anyone with the
   same connector) retrieves the data and shapes it into a `CognyBundle`
   (see `types.ts`).
2. That bundle is handed to `lib/growthship/analysis/runAnalysis.ts`, either
   by running `npx tsx scripts/growthship-seed.ts` directly, or by posting
   the bundle to `POST /api/growthship/analysis-runs`.
3. The app renders everything from what's stored. It never calls Cogny
   itself and never fabricates a number that wasn't in a bundle.

The in-app "Run analysis" button in The Engine Room calls the same endpoint.
Today, with no bundle attached to the request, it reports that Cogny isn't
connected to the server rather than inventing data. The moment Cogny issues
a server-to-server credential, replace that branch with a real fetch to
Cogny's endpoint, build a `CognyBundle` from the response, and nothing
downstream (detectors, scoring, UI) needs to change.
