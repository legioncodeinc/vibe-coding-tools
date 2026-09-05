# Caching Pre-Computed Embeddings: TTL, Versioning, and the Cold-Start Problem - DEV Community
- URL: https://dev.to/gabrielanhaia/caching-pre-computed-embeddings-ttl-versioning-and-the-cold-start-problem-628
- Fetched: 2026-08-14
- Source type: blog
- Source date: 2026-05-05
- Component: embeddings-runtime (embedding cache key design, invalidation, model-swap versioning, cold-start/single-flight pattern)

## Summary

A production-grade treatment of embedding caching: what belongs in the cache key, why TTL is usually the wrong invalidation mechanism for embeddings, how to version a cache through a model swap, and how to avoid a stampede on day zero.

## The cache key is the whole design

Recommended key: the tuple `(model_name, model_version, doc_hash)`, all three non-negotiable:

- `model_name` - separates vector spaces when more than one embedder is live (e.g. a search index and a reranker running different models cannot share cache rows; mixing them "returns garbage").
- `model_version` - covers silent vendor model updates (OpenAI/Cohere/Voyage have all shipped versioned embedding models) and self-hosted model rollouts. Lets you ship a new model behind the cache without treating old vectors as still valid.
- `doc_hash` - SHA-256 of the *normalized* chunk text (collapse whitespace, strip control characters; generally leave case alone since most embedders are case-sensitive). Byte-identical text reuses the vector; a single changed character produces a new hash and a fresh embed.

```python
def cache_key(model_name, model_version, chunk_text):
    h = hashlib.sha256(normalize(chunk_text).encode("utf-8")).hexdigest()
    return f"emb:{model_name}:{model_version}:{h}"
```

A common mistake called out explicitly: keying on document ID instead of content hash, which serves a stale vector after the document is edited. Content-hash keys make an edit a cache miss automatically.

## TTL is almost never the right invalidation mechanism

Embeddings don't go stale on a clock; they go stale only when the source text changes or the model changes, and the cache key already handles both. A 7-day TTL on a vector derived from immutable text just pays the vendor to recompute a still-correct answer. TTL is appropriate only for: (a) a memory ceiling on a hot in-process/Redis cache (use as an eviction bound, not a freshness signal), or (b) genuinely short-lived "documents" like chat-session snippets governed by a data-retention policy.

For everything else, invalidation is event-driven: a document-update event triggers rehashing and a new cache row; old rows are simply never looked up again (a small binding table maps the application's stable chunk identity to the current content-addressed cache key, so a rewritten chunk can be repointed to a new key without touching the big embedding table).

## Model-swap versioning strategies

Every model swap invalidates the whole cache by definition (vectors from two different models are not comparable; mixing them "returns nonsense distances"). Two migration strategies:

1. **Stop-the-world re-embed** - maintenance window, rehash and re-embed every chunk under the new `(model_name, model_version)`, then flip the index pointer. Simplest, usually fast enough under roughly a million chunks.
2. **Dual-write with a flag** - during migration, every cache miss writes both old-model and new-model vectors; retrieval reads are gated by a flag; flip the flag once new-model coverage is sufficient, then decommission old rows. Reads stay available throughout; writes cost double until cutover.

The tuple-based key makes both strategies cheap: no schema migration, new rows live alongside old rows, and a lookup either hits the new key or falls through to a fresh embed call.

## The cold-start / stampede problem

Day zero, the cache is empty and the producer may be firing faster than the embedding API can absorb it. Three mitigations:

- **Backfill before cutover** - an offline job walks the corpus and populates the cache before any live traffic hits it, ideally through a vendor's discounted bulk/batch endpoint rather than the synchronous live lane.
- **Single-flight on the read path** - when a request misses, check an in-flight map keyed by the same cache key; if another request for that exact text is already mid-embed, wait on its result instead of issuing a duplicate API call. Without this, a newly-popular chunk fires N concurrent duplicate embed calls on first appearance. Shown in Python via a `threading.Event` per in-flight key (multi-process deployments need a distributed lock, e.g. Redis `SET NX PX`, instead of an in-process map).
- **Soft-fail to a smaller local model** - if the hosted vendor rate-limits a user-facing request, fall back to a self-hosted small model (the article names `all-MiniLM-L6-v2` and BGE-small as examples) for that single request, tag the row as a fallback, and rewrite it with the canonical vector later. The fallback lives in a different vector space and is only a stopgap until the canonical embedding lands.

## What changes and what doesn't

Once cached, retrieval quality is unaffected (a cache hit returns the exact vector the API would have returned, as long as `model_version` is in the key). The number that moves is cost and P99 latency for hot keys, not correctness.
