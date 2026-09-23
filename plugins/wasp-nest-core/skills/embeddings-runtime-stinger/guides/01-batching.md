# Batching strategy

Applies to hosted-provider calls and the self-hosted daemon alike: batching bulk embedding work is close to mandatory, not an optimization to consider later. Grounded in `references/research/raw/speedtesthq--embedding-api-networking.md` and `references/research/raw/voyageai--pricing.md`.

## Why batching matters more for embeddings than for LLM completions

Embedding calls have a different networking profile from LLM completions: there is no autoregressive decode, the input goes through the model once, and the output is a fixed-size array of floats. Latency is dominated by network round-trip and per-request overhead (HTTP, TLS, parsing), not by inference compute. A single embedding call typically completes in 50-200ms; a batch of 100 completes in 100-400ms, not 100x longer (source: speedtesthq--embedding-api-networking.md). That means the *number of requests*, not the number of items, is usually the bottleneck for bulk work.

## Sizing the batch

Illustrative numbers for embedding 1000 documents (source: speedtesthq--embedding-api-networking.md):

| Batch size | Requests for 1000 docs | Bottleneck |
|---|---|---|
| 1 | 1000 | Network overhead dominates |
| 50 | 20 | Inference time dominates |
| 500 | 2 | Server-batching gains have mostly saturated |

Practical rule: for background/bulk indexing, batch as large as the provider's stated per-call limit allows (Cohere: 96 texts/inputs per call; Voyage: up to 1,000 texts per call, subject to a per-model total-token cap; OpenAI: subject to the 300,000-token-per-request aggregate cap and 2048-array-length cap noted in its API reference). For a single interactive query (one search-box keystroke, one chat turn), batching does not apply, there is exactly one text to embed.

## Self-hosted daemon batching

The same principle applies to the local daemon: batch multiple texts into one socket request rather than one round-trip per text, so the per-request overhead is amortized and the model processes the batch together. See `guides/local-daemon-01-lifecycle.md` for the daemon-specific mechanics (this is principle 4 in `00-principles.md`, applied to the Unix-socket NDJSON channel).

## Rate limits and backoff

Hosted providers rate-limit by requests-per-minute and/or tokens-per-minute. A production batch pipeline needs:

- **Concurrency control** - a semaphore or worker pool capping simultaneous in-flight requests, not unbounded `Promise.all`.
- **Exponential backoff on 429s** - retry with increasing delay (1s, 2s, 4s, ...) rather than hammering the endpoint.
- **Progress tracking and resumability** - checkpoint which items have been embedded so a crash mid-run does not force a full restart; skip items whose content hash is already cached (see `guides/02-caching.md`).

## Use the discounted batch/async lane for large one-time jobs

For a bulk backfill or a model-swap re-embed (not a live query path), route the job through the provider's discounted asynchronous batch endpoint rather than the synchronous endpoint:

- **OpenAI Batch API** - accepts a file of requests, processes asynchronously within a turnaround window, at a discount versus synchronous pricing.
- **Voyage AI Batch API** - 12-hour completion window, a 33% discount versus the standard endpoint. Free per-account token credits do not apply to Batch API usage; batch tokens are billed at the discounted rate regardless (source: voyageai--pricing.md).

The point of the discounted lane is to eat the cost of a large one-time job on a slower, cheaper path instead of the live, synchronous one that also serves interactive query traffic.

## Dimension and bandwidth interact with batch size at scale

At high volume, the network cost of moving the embeddings themselves (not just the input text) can exceed the inference cost. A 1536-dim float32 vector is about 6KB; embedding 100M documents at that width moves roughly 600GB of vector data alone (source: speedtesthq--embedding-api-networking.md). This is a second, independent reason (beyond the schema-lock principle in `00-principles.md`) to pick the smallest dimension that still meets the quality bar for a very large corpus, and to consider a quantized output dtype (`int8`/`binary`) for storage-bound workloads; see the provider-specific guides for how each exposes that.
