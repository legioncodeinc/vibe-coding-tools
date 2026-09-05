# Generic Embedding Model Choice (DEMOTED: the deploying product uses Cohere embed-english-v3.0)

> **Status:** Demoted reference. the deploying product uses Cohere `embed-english-v3.0` for all vector embeddings (1024-dim cosine, two input types: `search_document` + `search_query`).
>
> The alternatives below exist for context when comparing approaches.

---

## Why Cohere `embed-english-v3.0` is canonical for the deploying product

1. **English-only is acceptable for v1.** the deploying product's coaching corpus is English. Multilingual embedders (BGE-M3) trade English quality for languages we don't currently serve.
2. **Pairs naturally with Cohere `rerank-v3.5`.** Same vendor, same calibration, single API key, predictable rate limits.
3. **1024 dims is manageable.** Higher-dim embedders (text-embedding-3-large at 3072) consume 3× the storage in Qdrant; the precision lift on coaching corpora is small.
4. **Two-input-type discipline (`search_document` / `search_query`)** is built into the SDK and protects against the most common embedding bug (using the same input type at index and query time).
5. **Rate limits are sufficient** (96 texts/batch, 10K texts/min on paid plan) for current the deploying product's scale.

A push to substitute requires `guides/01-stack-enforcement.md §2`.

---

## The alternatives (for context)

### BGE-M3 (BAAI)

- **Pitch:** Open-source multilingual embedder, 1024-dim. Long-context support (8192 tokens): enables late chunking.
- **Pros vs Cohere:** Open weights (self-host), multilingual, supports late chunking.
- **Cons vs Cohere:** Self-hosting overhead; quality on English specifically slightly below Cohere v3 in some benchmarks; pairing with a self-hosted reranker (`bge-reranker-v2-m3`) is a separate ops concern.
- **When to consider:** Multilingual product, self-hosted preference, late chunking experiments.

### Voyage AI (`voyage-3` / `voyage-3-large`)

- **Pitch:** Strong commercial embedder, pairs with `voyage-rerank-2`.
- **Pros vs Cohere:** Slightly higher quality on some benchmarks; voyage rerank is competitive with Cohere rerank.
- **Cons vs Cohere:** Vendor lock-in to a smaller player; less mature ecosystem; pricing slightly higher.
- **When to consider:** If Cohere's quality regresses or pricing changes adversely; Voyage is the strongest commercial alternative.

### OpenAI `text-embedding-3-large`

- **Pitch:** OpenAI's flagship embedder. 3072-dim native (truncatable to 256/512/1024).
- **Pros vs Cohere:** Single-vendor convenience if also using GPT models; very stable API.
- **Cons vs Cohere:** Higher dim = more Qdrant storage; OpenAI rerank is not first-class (would mix vendors anyway); calibration on coaching-style corpora is similar to Cohere.
- **When to consider:** Single-vendor preference with OpenAI; via the gateway, model-choice flexibility is preserved.

### OpenAI `text-embedding-3-small`

- **Pitch:** Cheaper, 1536-dim (truncatable). Good enough for many use cases.
- **Pros vs Cohere:** Lower cost.
- **Cons vs Cohere:** Quality below Cohere v3 on retrieval benchmarks; calibration matters less than vendor brand recognition would suggest.
- **When to consider:** Cost-constrained MVP; not a long-term default.

### `all-mpnet-base-v2` / `instructor-large` / other open-weights

- **Pitch:** Free, self-hosted, no API costs.
- **Cons vs Cohere:** Quality on coaching corpora is materially below Cohere v3; self-hosting a CPU/GPU embedding service adds ops complexity.
- **When to consider:** Strict no-API-spend constraint; not for production coaching.

---

## Decision matrix

| Factor | Cohere v3 | BGE-M3 | Voyage 3 | OpenAI 3-large |
|---|---|---|---|---|
| English quality | High | High | Highest | High |
| Multilingual | English-only | Strong | English-focused | Strong |
| Vector dim | 1024 | 1024 | 1024 | 3072 (truncate ok) |
| Pairs with rerank | ✓ Cohere v3.5 | ✓ bge-reranker-v2-m3 | ✓ voyage-rerank-2 | (mix vendors) |
| Self-host option | No | Yes | No | No |
| Vendor maturity | High | Medium | Medium | Highest |
| Long-context | 512 tokens | 8192 tokens | 16K tokens | 8191 tokens |

For the deploying product's current product (English coaching, Cohere rerank, no late-chunking need), Cohere v3 is the right pick. Whenever multilingual or late-chunking becomes a use case, BGE-M3 becomes the first alternative to evaluate.

---

## Migration path if substitution is approved

1. Spin up parallel collections: `knowledge-{tenantId}-v2`, `conversations-{tenantId}-v2`, etc.
2. Re-embed all existing data with the new model into v2 collections.
3. Dual-write to both during transition (new vectors land in both).
4. Cut reads to v2.
5. Drop v1 collections + the v3.0 embedder dependency.

Per `guides/08-rag-strategy.md §9` (embedding model versioning).
