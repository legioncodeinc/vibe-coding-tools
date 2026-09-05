# Vercel Functions: streaming support and duration limits (Node.js vs Edge)

**Sources (combined, both official Vercel):**
- Streaming from serverless Node.js and Edge Runtime on Vercel - https://vercel.com/blog/streaming-for-serverless-node-js-and-edge-runtimes-with-vercel-functions (2023-03-28)
- Configuring Maximum Duration for Vercel Functions - https://vercel.com/docs/functions/configuring-functions/duration (page `last_updated: 2026-07-01`)

**Fetched:** 2026-08-14
**Source type:** Official Vercel documentation and engineering blog
**Covers:** How Vercel makes HTTP response streaming work on a Lambda-backed serverless runtime, and current function duration limits by plan

## What the sources say

**Streaming mechanics on the Node.js (serverless) runtime:** Vercel's serverless architecture is built on AWS Lambda, which historically has no native support for returning an HTTP response as a stream (Lambda's invocation model returns one complete response payload). Vercel built a custom bridging layer to work around this: a request hits an Edge Location, which forwards it to a Serverless Function Invocation Service; that service injects streaming-specific payload attributes (including a callback URL) before forwarding to Lambda; inside Lambda, a bridge establishes a secure socket connection back to that callback URL and streams the response over it as it's generated; the Invocation Service reads that socket and forwards bytes to the client incrementally. The practical upshot: streaming works transparently from a `+server.ts` handler returning a `ReadableStream`-backed `Response` on Vercel's Node.js runtime, but it depends on this Vercel-specific bridge, not a native Lambda capability. This is the direct explanation for why the generic SvelteKit-docs caveat about "platforms that buffer responses, like AWS Lambda" does **not** apply to Vercel specifically, even though Vercel's underlying compute is Lambda-based.

**Current duration limits (2026-07-01 revision), by plan, with Fluid compute (default) and Node.js/Python runtimes:**

| Plan | Default | Maximum | Extended maximum |
|---|---|---|---|
| Hobby | 300s (5 min) | 300s (5 min) | - |
| Pro | 300s (5 min) | 800s | 1800s (30 min, beta, supported Node.js/Python versions only) |
| Enterprise | 300s (5 min) | 800s | 1800s (30 min, beta) |

A documented operational detail for long streaming connections held open over HTTP/2: Vercel sends connection-level HTTP/2 `PING` frames while the response is idle to keep the connection alive; HTTP/1.1 has no equivalent keep-alive frame, so HTTP/1.1 clients or intermediate network layers (proxies, corporate networks) may still close an idle connection. The documented mitigation is to stream progress or heartbeat data periodically while work is running, rather than going silent between chunks.

## Why this matters for this stinger

Two concrete, must-know facts for anyone shipping a SvelteKit streaming LLM endpoint on this repo's Vercel deployment: (1) streaming genuinely works on the default Node.js runtime without needing Edge, because Vercel engineered around Lambda's lack of native streaming support specifically; (2) a long agentic/multi-step LLM response that could run past the default 300-second window needs an explicit `maxDuration` route config (or a background/async architecture) on Pro/Enterprise, and needs a heartbeat/progress chunk sent periodically if any hop in the path is HTTP/1.1, or the connection can be silently dropped mid-stream.

## Relevance to this stinger

Grounds the "Vercel Node.js runtime is the default, streaming works via Vercel's own Lambda bridge, mind the duration and heartbeat rules" section of `guides/svelte-streaming-endpoints.md`.
