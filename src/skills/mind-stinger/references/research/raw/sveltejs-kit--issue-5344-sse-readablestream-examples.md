# SvelteKit GitHub issue #5344: streaming request/response examples (SSE via ReadableStream)

**Title:** Documentation/Examples for streaming requests and responses - Issue #5344 - sveltejs/kit
**URL:** https://github.com/sveltejs/kit/issues/5344
**Fetched:** 2026-08-14
**Source type:** Official framework repository (sveltejs org), community issue thread with maintainer and community-contributed code, open since 2022-07-02, last updated 2025-12-12
**Covers:** Concrete `+server.ts` code patterns for Server-Sent Events using `ReadableStream`, chunk-boundary gotchas

## What the thread contains

This is the sveltejs/kit repository's own tracking issue for streaming docs/examples, still open, with maintainer- and community-contributed working code samples that are the de facto reference pattern used across the Svelte ecosystem (this exact code shows up, adapted, in most third-party SvelteKit-plus-LLM tutorials).

Minimal SSE endpoint pattern confirmed working (`src/routes/sse/+server.ts`):

```ts
export function GET() {
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 20; i++) {
        controller.enqueue(encoder.encode('hello'));
        await delay(1000);
      }
      controller.close();
    }
  });

  return new Response(readable, {
    headers: { 'content-type': 'text/event-stream' }
  });
}
```

A more complete pattern uses `TransformStream` bridged to a Node `EventEmitter`, enqueuing SSE-framed messages (`id:`, `event:`, `data:` lines terminated by a blank line) and unsubscribing on `writer.closed`:

```ts
export function createSSE(last_id = 0, retry = 0) {
  const { readable, writable } = new TransformStream({
    start(controller) {
      controller.enqueue(': hello\n\n');
      if (retry > 0) controller.enqueue(`retry: ${retry}\n\n`);
    },
    transform({ event, data }, controller) {
      let msg = `id: ${++id}\n`;
      if (event) msg += `event: ${event}\n`;
      msg += typeof data === 'string'
        ? 'data: ' + data.trim().replace(/\n+/gm, '\ndata: ') + '\n'
        : `data: ${JSON.stringify(data)}\n`;
      controller.enqueue(msg + '\n');
    }
  });
  const writer = writable.getWriter();
  return {
    readable,
    async subscribe(eventEmitter, event) {
      function listener(data) { writer.write({ event, data }); }
      eventEmitter.on(event, listener);
      await writer.closed.catch(() => {});
      eventEmitter.off(event, listener);
    }
  };
}
```

Client-side consumption pattern confirmed working from `+page.svelte`, reading the raw fetch body stream directly (not `EventSource`, since `EventSource` cannot send custom headers like an Authorization bearer token):

```ts
async function subscribe() {
  const response = await fetch('/sse');
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    result.push(value);
    result = result;
  }
}
```

A maintainer-adjacent contributor (@rmunn) flagged a load-bearing gotcha for anyone parsing streamed chunks manually: `ReadableStream` chunks are **not guaranteed to end at convenient boundaries**. A UTF-8 multi-byte sequence, or a multipart boundary marker, or (by direct extension) a newline-delimited SSE frame or a JSON token in an LLM streaming payload, can be split arbitrarily across chunk reads. Code that assumes one `read()` call yields one complete logical unit will intermittently corrupt output under real network conditions.

## Why this matters for this stinger

This is the concrete implementation pattern underneath any "stream an LLM response from a SvelteKit endpoint" guide, whether or not the Vercel AI SDK is used. It is also the direct source for the chunk-boundary defensive-coding rule (buffer partial lines, don't assume a chunk is a complete SSE frame or JSON object) that belongs in the must-fix list for any hand-rolled (non-SDK) streaming implementation.

## Relevance to this stinger

Grounds the raw `ReadableStream`/SSE code shape in `guides/svelte-streaming-endpoints.md` for anyone not using the Vercel AI SDK (e.g., streaming raw OpenRouter output).
