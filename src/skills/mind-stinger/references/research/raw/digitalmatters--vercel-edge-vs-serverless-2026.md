# Vercel Functions: Edge vs Serverless, and when to pick which

**Title:** Vercel Functions: Edge vs Serverless Runtime | DM
**URL:** https://digitalmatters.me/it-infrastructure/vercel-functions-edge-vs-serverless/
**Published:** 2026-07-28
**Fetched:** 2026-08-14
**Source type:** Third-party engineering blog (practitioner comparison piece, cites Vercel's own changelog and docs by name throughout)
**Covers:** The 2025-2026 consolidation of Vercel Edge Functions and Serverless Functions into a single "Vercel Functions" product with selectable runtimes, plus a decision table

## What the article says

In June 2025, Vercel deprecated the standalone Edge Functions product and folded its capabilities into Vercel Functions; Edge Middleware became Vercel Routing Middleware. Both middleware and functions now run on Vercel Functions, with a single execution model called **Fluid compute**, per Vercel's own changelog (cited in the article). The practical effect: the decision is no longer "which product" but "which runtime to attach to a given function" - Edge runtime or Node.js runtime (Fluid compute also supports Python, Bun, and Rust runtimes, but those aren't relevant to this stack).

**Edge runtime characteristics:** a lightweight JavaScript environment on V8 isolates (the same isolation primitive as Chrome tabs), not a full container/microVM; cold start is roughly a millisecond instead of the hundreds of milliseconds a container needs. Constraint: Web Standard APIs only, no `fs`, no native addons, some Node crypto methods missing, and "a number of database drivers that assume a Node socket layer will not run there" - directly relevant to this repo, since a Postgres driver connecting to Neon over a raw TCP socket (rather than Neon's HTTP/WebSocket-based serverless driver) will not function on the Edge runtime. Duration: must begin sending a response within 25 seconds, can then stream for up to 300 seconds.

**Node.js runtime characteristics:** full Node.js API surface, so existing database clients, ORMs (Drizzle included), and native dependencies work unmodified. Historically ran each invocation in its own microVM (slower cold start, idle waste); Fluid compute changed that execution model to reuse warm instances. Current limits: 2GB memory / 1 vCPU default (4GB / 2 vCPU on Pro/Enterprise), 250MB bundle (5GB beta for "Large Functions"), 300s default duration extendable to 800s (1800s beta), 4.5MB request/response body cap. Runs in a single region by default (`iad1` unless changed); Pro can pin up to three regions, Enterprise can run in all.

**The article's bottom line rule:** since Fluid compute erased the old cost/latency tradeoff that used to justify choosing Edge specifically to dodge Node.js cold starts, and since the article and Vercel's own docs (see companion source `vercel--edge-runtime-official-docs.md` in this folder) now both point toward Node.js as the default, Edge should be reserved for genuinely latency-critical, Web-Standard-API-only logic (auth checks, redirects, A/B routing at the network edge) rather than for full application logic like an LLM streaming endpoint that needs a real database driver.

## Why this matters for this stinger

Directly informs the runtime choice for this stack's `+server.ts` streaming LLM endpoints: this repo needs a Postgres (Neon) connection and a Drizzle ORM client inside the same request that streams the completion (to run the pgvector retrieval query before or alongside the stream), and the Edge runtime's database-driver constraint makes it the wrong default choice here even before considering Vercel's own "migrate to Node.js" guidance.

## Relevance to this stinger

Corroborating source (alongside the official Vercel edge-runtime doc) for the Node.js-runtime-as-default rule in `guides/svelte-streaming-endpoints.md`; the Neon-driver-on-Edge constraint is specific new information this source adds.
