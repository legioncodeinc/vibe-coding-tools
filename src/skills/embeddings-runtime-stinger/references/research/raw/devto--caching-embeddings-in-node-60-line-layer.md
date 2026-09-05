# Caching Embeddings in Node: A 60-Line Layer That Cuts the Bill - DEV Community
- URL: https://dev.to/gabrielanhaia/caching-embeddings-in-node-a-60-line-layer-that-cuts-the-bill-2j10
- Fetched: 2026-08-14
- Source type: blog
- Source date: 2026-08-06
- Component: embeddings-runtime (TypeScript embedding cache implementation: key normalization, batch-shaped interface, binary storage)

## Summary

A concrete, TypeScript, batch-shaped embedding cache implementation, useful as a template for a Node/TypeScript project on this stack (SvelteKit backend) wrapping an OpenAI/Cohere/Voyage or local embed call.

## Why embeddings are the easiest thing in an AI stack to cache

"Same text, same model, same vector. No temperature, no sampling, no context." A pure function of `(model, text)`, so a cache hit is behaviorally indistinguishable from a fresh call, with zero correctness risk (unlike an LLM-answer cache, which the companion "three layers" source flags as higher-risk).

## Key design: normalize, include model, include dimension

```typescript
export function cacheKey(text: string, model: string, dims?: number) {
  const norm = text.normalize("NFC").replace(/\s+/g, " ").trim();
  const h = createHash("sha256").update(norm).digest("hex");
  return `emb:${model}:${dims ?? "default"}:${h}`;
}
```

Three deliberate choices:

- **Normalization** - Unicode NFC + whitespace collapse only. Do not go further (no lowercasing, no punctuation stripping): the cache must key on exactly the bytes actually sent to the embedder, since a different string produces a different embedding.
- **Model in the key** - the detail most commonly left out, and the one that silently corrupts an index: a text-only key returns yesterday's vector from an old model after a swap, comparisons against it "produce distances that are meaningless, and no error, ever."
- **Dimension in the key** - a model that supports variable output width (Matryoshka truncation via `dimensions`/`output_dimension`) produces different values for the same text at different requested widths; those need separate cache entries.

## Batch-shaped interface (not single-key get/set)

```typescript
export interface VectorCache {
  getMany(keys: string[]): Promise<Map<string, number[]>>;
  setMany(entries: Map<string, number[]>): Promise<void>;
}
```

Rationale: ingest pipelines work in batches, and one `get` per item against Redis "turns one round trip into five hundred." The Redis implementation uses `mgetBuffer` for the batched read and a pipelined `set` for the batched write.

## Storage encoding: binary, not JSON

```typescript
const encode = (v: number[]) => Buffer.from(new Float32Array(v).buffer);
const decode = (b: Buffer) =>
  Array.from(new Float32Array(b.buffer, b.byteOffset, b.length / 4));
```

A 1536-dim vector is roughly 12KB as a JSON array of decimal strings versus 6KB as raw `Float32Array` bytes, and skips JSON parse/stringify overhead entirely. `Float32Array` loses a little precision versus float64, but for cosine similarity over normalized embeddings that loss is far below anything that affects ranking, so it's a straightforward space/precision trade worth taking.

## The cache-wrapping layer itself

```typescript
export function cached(
  embed: (texts: string[]) => Promise<number[][]>,
  cache: VectorCache,
  model: string,
) {
  return async function embedCached(texts: string[]) {
    const keys = texts.map((t) => cacheKey(t, model));
    const hits = await cache.getMany([...new Set(keys)]);
    const missIdx: number[] = [];
    texts.forEach((_, i) => { if (!hits.has(keys[i])) missIdx.push(i); });
    if (missIdx.length) {
      const fresh = await embed(missIdx.map((i) => texts[i]));
      const toStore = new Map<string, number[]>();
      missIdx.forEach((idx, j) => { hits.set(keys[idx], fresh[j]); toStore.set(keys[idx], fresh[j]); });
      await cache.setMany(toStore);
    }
    return keys.map((k) => hits.get(k)!); // preserves original input order
  };
}
```

Two details worth calling out: the final `keys.map` rebuilds results in original input order so the wrapper is a drop-in replacement for the raw `embed` function (a cache that returns hits-then-misses out of order is a correctness bug for any positional caller); and deduplicating with `new Set(keys)` before the batched lookup avoids re-fetching the same text more than once when a batch has internal repeats (common in page-boilerplate-heavy corpora).

## Invalidation is a non-problem with this design

Because the model is already in the key, a model change produces a different key (a miss, which is correct) with no separate invalidation logic needed. A TTL, if used at all, exists only to reclaim space for content no longer referenced, not for freshness. Query-side caching (embedding the same repeated user question) uses the same wrapper with a shorter TTL and a separate keyspace so flushing query entries never evicts the corpus cache.

## Measuring it

Track hit/miss counters. A nightly-ingest hit rate that isn't overwhelmingly high signals a non-deterministic chunker (same input producing different chunk boundaries and thus different hashes) more than it signals a caching problem; a hit rate that suddenly drops to zero signals someone changed the model, normalization, or chunker without realizing the blast radius.
