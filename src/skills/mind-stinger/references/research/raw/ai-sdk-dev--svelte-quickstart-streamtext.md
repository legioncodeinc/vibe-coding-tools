# Vercel AI SDK: Svelte quickstart (streamText in a SvelteKit +server.ts)

**Title:** Getting Started: Svelte - AI SDK
**URL:** https://ai-sdk.dev/docs/getting-started/svelte
**Fetched:** 2026-08-14
**Source type:** Official Vercel AI SDK documentation
**Covers:** Wiring a streaming LLM completion into a SvelteKit `+server.ts` route handler using the `ai` package and `@ai-sdk/svelte` bindings

## What the page says

The AI SDK's official SvelteKit quickstart wires a streaming chat completion into a `src/routes/api/chat/+server.ts` endpoint:

```ts
import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  createGateway,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';

import { AI_GATEWAY_API_KEY } from '$env/static/private';

const gateway = createGateway({ apiKey: AI_GATEWAY_API_KEY });

export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  const result = streamText({
    model: gateway('anthropic/claude-sonnet-4.5'),
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```

Key mechanics documented:

1. `streamText()` (from the `ai` package) accepts a `model` provider instance and a `messages` array and returns a `StreamTextResult`, whose `.stream` property is an `AsyncIterable` / `ReadableStream` of text/tool parts.
2. `toUIMessageStream()` adapts that result stream into the AI SDK's UI message stream protocol (structured parts: text deltas, tool calls, tool results, finish reason), which is what the client-side `Chat` class / `useChat` hook expects to parse.
3. `createUIMessageStreamResponse()` wraps that adapted stream into a standard `Response` object suitable for returning directly from the SvelteKit route handler, with the correct SSE-style headers already set.
4. The quickstart's default provider is the Vercel AI Gateway (`createGateway`), which is model-agnostic: swapping to a direct provider is a one-line change (`import { openai } from '@ai-sdk/openai'; model: openai('gpt-5.1')`), and the same pattern applies to `@ai-sdk/anthropic` or any OpenAI-compatible provider (which covers OpenRouter, since OpenRouter exposes an OpenAI-compatible endpoint).
5. Environment variables for server-only secrets (`AI_GATEWAY_API_KEY`) are imported from `$env/static/private`, SvelteKit's build-time-injected, server-only environment variable module. This is the documented way to keep provider API keys out of client bundles in SvelteKit.

A companion GitHub issue (`vercel/ai#1891`, "Sveltekit: Responses are not streaming") documents a known gotcha: response streaming can silently degrade to buffered delivery when a reverse proxy or tunnel (the reported case used a Cloudflare tunnel) sits in front of the dev server and does not forward chunked transfer encoding; forcing `'content-type': 'text/event-stream'` on the response headers was the reported workaround in that thread.

## Why this matters for this stinger

This is the primary "batteries included" path for streaming an LLM completion from a SvelteKit server endpoint on this repo's stack, and it directly supersedes the old Qdrant/Cohere/OpenRouter guide's assumption that an LLM call is always made with the raw `openai` SDK pointed at OpenRouter's base URL. The AI SDK works fine as an OpenAI-compatible client against OpenRouter directly, so adopting `streamText()` does not require abandoning the OpenRouter gateway choice documented for the alternative stack; it is an additive convenience layer for the streaming/response-shaping part specifically.

## Relevance to this stinger

Primary source for the "Vercel AI SDK" path in `guides/svelte-streaming-endpoints.md`.
