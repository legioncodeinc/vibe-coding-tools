# Svelte streaming endpoints

How a streaming LLM completion gets from a SvelteKit server route to a Svelte 5 component on this repo's stack (SvelteKit, Vercel). Read this for any `coach-change`, `onboarding-flow`, or `prompt-change` invocation that touches a `+server.ts` route handler, and for any `rag-audit` that needs to confirm a retrieval-augmented response actually streams.

> **Doc reference:** grounded in `references/research/distilled-mind-svelte-neon.md` and the raw sources under `references/research/raw/`. This is new, repo-specific coverage; the pre-existing 21 numbered guides predate SvelteKit's adoption on this repo and don't cover this pattern.

---

## The shape of the pattern

A SvelteKit `+server.ts` route handler is, per the framework's own description, a function that turns a `Request` into a `Response`, built on standard Web APIs (source: `references/research/raw/sveltekit--kit-web-standards-stream-apis.md`). The `Response` constructor accepts a `ReadableStream` as its body. That single fact is the entire mechanism: retrieval happens first (query the retrieval substrate per `guides/00-selection-and-defaults.md`), then the LLM call streams its output through that `ReadableStream`, and the client reads it incrementally instead of waiting for the full response.

Two implementation paths, both grounded in archived sources; pick one per feature, don't mix them within a single endpoint.

### Path one: the Vercel AI SDK (`ai` plus `@ai-sdk/svelte`)

The documented pattern (source: `references/research/raw/ai-sdk-dev--svelte-quickstart-streamtext.md`):

```ts
// src/routes/api/chat/+server.ts
import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from 'ai';
import { openai } from '@ai-sdk/openai';
// or any OpenAI-compatible client, which covers OpenRouter directly

export async function POST({ request }) {
  const { messages }: { messages: UIMessage[] } = await request.json();

  // Retrieval happens here, before the model call, against this repo's
  // default substrate (Neon plus pgvector) or whichever the project has
  // committed to. See guides/00-selection-and-defaults.md.

  const result = streamText({
    model: openai('gpt-5.1'), // swap for the project's chosen provider/model
    messages: await convertToModelMessages(messages),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
```

`streamText()` returns a result whose `.stream` is an async-iterable stream of text and tool-call parts. `toUIMessageStream()` adapts that into the AI SDK's structured UI message protocol; `createUIMessageStreamResponse()` wraps it into a ready-made streaming `Response`. This is the batteries-included path: correct headers, correct framing, and a matching `Chat` class / `useChat`-equivalent on the Svelte 5 side that already knows how to parse the stream.

**This does not require dropping OpenRouter as the gateway** on a project running the alternative stack from `guides/01-stack-enforcement.md`. OpenRouter's endpoint is OpenAI-compatible, so `createOpenAI({ baseURL: 'https://openrouter.ai/api/v1', apiKey })` from `@ai-sdk/openai` slots into the same `model:` position. Adopting `streamText()` is a response-shaping decision, independent of the gateway decision.

### Path two: raw `ReadableStream` / Server-Sent Events, no SDK

For a case that doesn't fit the AI SDK's message protocol (a custom event stream, a non-chat use case), the reference pattern the SvelteKit ecosystem has converged on (source: `references/research/raw/sveltejs-kit--issue-5344-sse-readablestream-examples.md`):

```ts
// src/routes/api/stream/+server.ts
export async function GET() {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of getUpstreamLLMStream()) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
      }
      controller.close();
    },
    cancel() {
      // release any upstream connection / abort controller here
    },
  });

  return new Response(readable, {
    headers: { 'content-type': 'text/event-stream' },
  });
}
```

**A chunk-boundary gotcha that is a must-fix if missed:** `ReadableStream` chunks are not guaranteed to end at convenient boundaries. A UTF-8 multi-byte sequence, a full SSE frame, or a complete JSON token from an upstream provider's stream can be split arbitrarily across reads (source: `references/research/raw/sveltejs-kit--issue-5344-sse-readablestream-examples.md`). Code that assumes one `read()` equals one complete logical unit will intermittently corrupt output under real network conditions. Any hand-rolled stream parser needs a small buffering/reassembly layer; forwarding raw chunks 1:1 without reassembly is a finding.

### The client side (Svelte 5)

Reading a stream directly with runes, without the AI SDK's client helper:

```svelte
<script lang="ts">
  let messages = $state<string[]>([]);

  async function ask(prompt: string) {
    const response = await fetch('/api/stream', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    });
    const reader = response.body!.pipeThrough(new TextDecoderStream()).getReader();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      messages = [...messages, value];
    }
  }
</script>
```

Component shape, Suspense-equivalent boundaries, and optimistic-update patterns for the chat UI itself are `react-worker-bee`'s domain on repos that use React; on this SvelteKit repo the equivalent frontend Bee owns that. mind-worker-bee owns the server-side stream generation, prompt assembly, and retrieval up to the point the `Response` leaves the route handler.

---

## Deploying it on Vercel: runtime, duration, and connection liveness

### Default to the Node.js runtime, not Edge

As of the current Vercel documentation, Vercel itself recommends migrating away from the Edge runtime to the Node.js runtime "for improved performance and reliability" (source: `references/research/raw/vercel--edge-runtime-official-docs.md`), a reversal of the platform's earlier position that favored Edge specifically for streaming. Two reasons this matters concretely for this repo:

1. **Fluid compute erased the old cold-start/idle-cost tradeoff** that used to justify choosing Edge over serverless Node.js.
2. **The Edge runtime is Web-Standard-APIs-only.** A number of database drivers that assume a Node socket layer will not run there (source: `references/research/raw/digitalmatters--vercel-edge-vs-serverless-2026.md`), which is a direct problem for a Neon Postgres connection running inside the same request that streams a retrieval-augmented completion. Reach for the Neon serverless HTTP driver specifically if an Edge deployment is genuinely required for a given route; otherwise, don't opt into `export const config = { runtime: 'edge' }` at all.

**Streaming does work on Vercel's default Node.js runtime**, despite that runtime being Lambda-backed and Lambda having no native streaming support. Vercel built a dedicated bridge (a socket connection from inside the Lambda invocation back to Vercel's own invocation service) specifically to make this work (source: `references/research/raw/vercel--functions-streaming-serverless-node-edge-and-duration.md`). This is why the generic SvelteKit-docs caveat, "streaming doesn't work on platforms that buffer responses, like AWS Lambda" (source: `references/research/raw/sveltekit--kit-routing-streaming-response.md`), does not apply to Vercel even though Vercel's compute is Lambda-based underneath.

### Duration limits to design against

Current Vercel Function duration limits: Hobby 300s max; Pro/Enterprise 300s default, extendable to 800s, with a 1800s (30 minute) extended maximum in beta on supported runtimes (source: `references/research/raw/vercel--functions-streaming-serverless-node-edge-and-duration.md`). A long-running agentic or multi-step response that could approach these windows needs an explicit `maxDuration` route config on a paid plan, or should move to a background/async architecture rather than holding a single request open.

### Connection liveness on long streams

Vercel keeps long-held HTTP/2 connections alive with idle `PING` frames while a response streams. HTTP/1.1 has no equivalent, so any HTTP/1.1 hop, a corporate proxy, an older client, can silently drop an idle connection. **Emit a periodic heartbeat or progress chunk while work is running** (a comment line in an SSE stream, or a lightweight status token) rather than going silent between tokens; this is the documented mitigation, not a nice-to-have.

---

## Must-fix checklist for a SvelteKit streaming LLM endpoint

- Retrieval query (against this repo's default substrate, or whichever the project has committed to) includes `tenant_id` scoping, per `guides/00-principles.md` rule 5.
- The route does not opt into the Edge runtime without a specific, articulated reason and a Neon driver that actually works there.
- A hand-rolled (non-SDK) stream parser buffers partial chunks before treating a boundary as complete.
- A route whose expected duration could approach the platform default has an explicit `maxDuration` set, or is redesigned as background work.
- A long stream emits periodic heartbeat/progress data rather than going silent between tokens.
- The LLM call inside the handler is traced, per `guides/00-principles.md` rule 4, exactly as a non-streaming call would be; streaming is not an exemption from the every-call-traced rule.
