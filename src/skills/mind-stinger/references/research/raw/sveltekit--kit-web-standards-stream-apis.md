# SvelteKit web standards: Fetch API and Stream APIs

**Title:** Web standards - SvelteKit Docs
**URL:** https://svelte.dev/docs/kit/web-standards
**Fetched:** 2026-08-14
**Source type:** Official framework documentation (svelte.dev)
**Covers:** `Request`/`Response`/`Headers`, `ReadableStream`/`WritableStream`/`TransformStream` in SvelteKit route handlers and hooks

## What the page says

SvelteKit builds directly on standard Web APIs rather than inventing its own request/response abstraction. A SvelteKit app is described in the docs as "a machine for turning a `Request` into a `Response`." The APIs a route handler works with:

- **`Request`** - accessible as `event.request` in hooks and `+server.ts` handlers; has `request.json()`, `request.formData()`.
- **`Response`** - what `await fetch(...)` returns and what `+server.ts` handlers must return.
- **`Headers`** - read incoming `request.headers`, set outgoing `response.headers`.
- **Stream APIs** - `ReadableStream`, `WritableStream`, `TransformStream` are provided by the platform for responses too large to buffer in memory, or delivered in chunks over time.

These Web Standard APIs are available in all modern browsers and in non-browser server environments including Cloudflare Workers, Deno, and **Vercel Functions**. In Node-based adapters (including AWS Lambda-backed adapters), SvelteKit polyfills them where the underlying Node runtime doesn't natively support them yet.

## Why this matters for this stinger

This confirms the SvelteKit streaming pattern is not a framework-specific trick: it is the standard `ReadableStream`/`TransformStream` Web API surface, the same objects used for SSE and for piping an LLM provider's own stream through. It also confirms Vercel Functions is an explicitly supported non-browser environment for these APIs, which is the direct grounding for wiring an OpenRouter/OpenAI/Anthropic streaming completion into a `+server.ts` handler on this repo's Vercel deployment.

## Relevance to this stinger

Grounds the "use the platform, not a library abstraction, for the raw stream" framing in the new `guides/svelte-streaming-endpoints.md` guide.
