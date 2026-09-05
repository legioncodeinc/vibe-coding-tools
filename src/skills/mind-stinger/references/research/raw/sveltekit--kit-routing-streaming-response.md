# SvelteKit routing: streaming responses and ReadableStream

**Title:** Routing - SvelteKit Docs
**URL:** https://svelte.dev/docs/kit/routing
**Fetched:** 2026-08-14
**Source type:** Official framework documentation (svelte.dev)
**Covers:** SvelteKit `+server.ts` route handlers, `Response` streaming, `ReadableStream`, platform buffering caveats

## What the page says

SvelteKit route handlers (`+server.ts` / `+server.js`) export functions named after HTTP verbs (`GET`, `POST`, etc.) that receive a `RequestEvent` and return a `Response`. The first argument to the `Response` constructor can be a `ReadableStream`, which is the mechanism SvelteKit uses to stream large amounts of data or construct Server-Sent Events (SSE) responses.

Direct quote (paraphrased from the docs highlight): the first argument to `Response` can be a `ReadableStream`, making it possible to stream large amounts of data or create server-sent events, **unless deploying to platforms that buffer responses, like AWS Lambda.**

## Why this matters for this stinger

This is the single most load-bearing caveat for streaming LLM responses out of a SvelteKit `+server.ts` route on this repo's stack (Vercel). Vercel's Node.js serverless runtime is themselves built on AWS Lambda under the hood for the classic (pre-Fluid) execution model, and historically needed a custom bridging layer to support HTTP streaming at all (see `vercel--functions-streaming-serverless-node-edge.md` in this same raw folder). A `+server.ts` handler that returns a `ReadableStream` will only actually stream to the client if the deployment target does not buffer the whole response before sending it. On Vercel specifically, streaming works today, but the guarantee is platform-specific and not a SvelteKit-level guarantee.

## Relevance to this stinger

Grounds the "always confirm streaming survives the deploy target" rule in the new SvelteKit streaming guide.
