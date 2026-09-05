# Caching: avoiding re-embedding identical text

Embeddings are a pure function of `(model, model_version, exact text)`. Same input, same model, same vector, every time, with no sampling or context dependency. That determinism makes an embedding cache safe in a way an LLM-answer cache is not, a cache hit is behaviorally indistinguishable from a fresh call. Grounded in `references/research/raw/devto--caching-pre-computed-embeddings-ttl-versioning-cold-start.md` and `references/research/raw/devto--caching-embeddings-in-node-60-line-layer.md`.

## The cache key

Use the tuple `(model_name, model_version, content_hash[, dimension])`. Every part is load-bearing:

- **`model_name`** - separates vector spaces when more than one embedder is in use (a search index and a reranker running different models cannot share cache rows; mixing them returns garbage distances with no error).
- **`model_version`** - covers silent vendor model updates and self-hosted model rollouts. Lets a new model ship behind the cache without treating old vectors as still valid.
- **`content_hash`** - a SHA-256 of the *normalized* text (Unicode NFC, whitespace collapsed; do not lowercase or strip punctuation, the cache must key on exactly the bytes actually sent to the embedder). Hash on content, never on a document ID: an edited document under an unchanged ID must produce a cache miss, not a stale hit.
- **`dimension`** - required if the model supports variable output width (Matryoshka truncation via `dimensions`/`output_dimension`); a 1536-dim and a 768-dim vector of the same text under the same model are different values needing different cache entries.

```typescript
function cacheKey(text: string, model: string, version: string, dims?: number) {
  const norm = text.normalize("NFC").replace(/\s+/g, " ").trim();
  const h = createHash("sha256").update(norm).digest("hex");
  return `emb:${model}:${version}:${dims ?? "default"}:${h}`;
}
```

## TTL is almost never the right invalidation mechanism

Embeddings do not go stale on a clock; they go stale only when the source text changes or the model changes, and the cache key above already handles both. A time-based TTL on a vector derived from immutable text just pays the provider to recompute a still-correct answer. Two legitimate uses of a TTL:

1. A memory ceiling on a hot in-process or Redis cache, used as an eviction bound, not a freshness signal.
2. Genuinely short-lived content (chat-session snippets, per-user state governed by a data-retention policy) where the TTL is doing the job of data lifecycle, not embedding freshness.

For everything else, invalidate event-driven: a document-update event triggers rehashing and a new cache row; old rows are simply never looked up again once no chunk hashes to them.

## Model-swap versioning

A model swap invalidates the whole cache by construction, vectors from two different models are not comparable, and mixing them in one retrieval call produces meaningless distances. Two migration strategies:

- **Stop-the-world re-embed** - a maintenance window, rehash and re-embed every chunk under the new `(model_name, model_version)`, then cut the index pointer over. Simplest; usually fast enough under roughly a million chunks.
- **Dual-write with a flag** - during migration, every cache miss writes both the old-model and new-model vectors; retrieval reads are gated by a flag; flip the flag once new-model coverage is sufficient, then decommission old rows. Reads stay available throughout; writes cost double until cutover.

The tuple-based key makes both cheap: no schema migration on the cache itself, new rows live alongside old ones, and a lookup either hits the new key or falls through to a fresh embed call.

## The cold-start problem

On day zero the cache is empty, and a producer firing faster than the embedding API can absorb creates a stampede. Three mitigations:

- **Backfill before cutover** - an offline job walks the corpus and populates the cache before any live traffic hits it, ideally through the provider's discounted batch endpoint (see `guides/01-batching.md`).
- **Single-flight on the read path** - when a request misses, check an in-flight map keyed by the same cache key; if another request for that exact text is already mid-embed, wait on its result instead of firing a duplicate call. Without this, a newly-popular chunk fires N concurrent duplicate embed calls on first appearance.
- **Soft-fail to a smaller local model** - if a hosted provider rate-limits a user-facing request, fall back to a self-hosted small model for that one request, tag the row as a fallback, and rewrite it with the canonical vector later. The fallback lives in a different vector space and is only a stopgap.

## Storage shape

Store cached vectors as raw bytes (`Float32Array`), not JSON arrays of decimals: roughly half the size and no JSON parse/stringify cost, at a precision loss (float32 vs float64) far below anything that affects cosine-similarity ranking. Build the cache interface batch-shaped (`getMany`/`setMany`), not single-key `get`/`set`: a batch of N texts should cost one round trip to the cache store, not N.

## Measuring it

Track hit/miss counters on every cache-wrapped embed call. A nightly-ingest hit rate that is not overwhelmingly high usually signals a non-deterministic chunker (same input producing different chunk boundaries and therefore different hashes) rather than a caching problem. A hit rate that drops to zero overnight signals someone changed the model, the normalization, or the chunker without realizing the blast radius; both are worth surfacing, not just the cost line item.
