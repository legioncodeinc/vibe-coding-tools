# Vercel Edge Runtime: official reference (2026-08 revision)

**Title:** Edge Runtime - Vercel
**URL:** https://vercel.com/docs/functions/runtimes/edge
**Fetched:** 2026-08-14 (page `last_updated: 2026-08-03` per page metadata)
**Source type:** Official Vercel documentation
**Covers:** Edge runtime behavior, duration limits, current Vercel platform guidance on Edge vs Node.js

## What the page says

As of this page's 2026-08-03 revision, Vercel's own docs now open with a direct steer **away** from the Edge runtime: "We recommend migrating from edge to Node.js for improved performance and reliability. Both runtimes run on Fluid compute with Active CPU pricing." This is a reversal of Vercel's earlier (2023-era) positioning, which recommended Edge specifically for streaming and to avoid Node.js cold-start/timeout limits.

**Duration limits, stated explicitly:** "Vercel Functions using the Edge runtime must begin sending a response within 25 seconds to maintain streaming capabilities beyond this period, and can continue streaming data for up to 300 seconds." Middleware configured with the `edge` runtime carries the same 25-second first-byte rule.

**Region behavior:** Edge runtime functions execute by default in the region closest to the incoming request (can be pinned to specific regions via `preferredRegion` or a `regions` array in the route's `config` export).

**Framework note relevant to Next.js/SvelteKit-adjacent tooling:** "Starting in Next.js 16.3, setting `runtime = 'edge'` is no longer supported. Routes and pages run on Node.js" - Vercel is actively removing the edge option from at least one major framework integration, reinforcing the "migrate to Node.js" guidance above.

## Why this matters for this stinger

This directly contradicts a still-common piece of received wisdom ("use Edge for streaming AI responses to avoid serverless timeouts") that shows up across older tutorials and even in some AI SDK community discussion threads. As of this source's date, Vercel's own current guidance is the opposite: default to the Node.js runtime (which now runs on Fluid compute and no longer has the old cold-start/idle-cost tradeoff that originally justified Edge) and treat Edge as a legacy option, not the streaming-friendly default. For this repo, that means the recommended default for a `+server.ts` streaming LLM endpoint is the standard (Node.js) Vercel Function runtime, not an explicit `export const config = { runtime: 'edge' }` opt-in, unless a specific requirement (true global low-latency routing at the very first byte) justifies it.

## Relevance to this stinger

Primary source for the "default to Node.js runtime, not Edge, for streaming LLM endpoints on Vercel" guidance in `guides/svelte-streaming-endpoints.md`.
