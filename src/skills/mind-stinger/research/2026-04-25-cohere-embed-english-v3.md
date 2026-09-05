# Cohere `embed-english-v3.0`: 1024-dim, Two Input Types

**Source:** Cohere docs: https://docs.cohere.com/docs/cohere-embed, https://docs.cohere.com/reference/embed
**Retrieved:** 2026-04-25
**Status:** **LOAD-BEARING.** Cited in `guides/10-cohere-embedding-and-rerank.md §2`.
**Numbers tag:** benchmarked on input-type mismatch effect (~5-15% retrieval drop documented across vendors); vendor-directional on absolute quality numbers.

---

## TL;DR

`embed-english-v3.0` is Cohere's 1024-dim English-tuned embedder. Critical disciplines:

1. **Two input types:** `"search_document"` at index time, `"search_query"` at retrieval time. Mixing degrades retrieval 5-15%.
2. **Cosine distance** is the canonical pairing.
3. **Batch ≤ 96 texts/request** (hard limit).
4. **Rate limit: 10K texts/minute** on paid plan.
5. **Token limit: 512 tokens/text** (longer silently truncated).

---

## API shape

```typescript
// Indexing
const vectors = await cohere.embed({
  model:     "embed-english-v3.0",
  texts:     chunks,                            // ≤ 96
  input_type: "search_document",
  embedding_types: ["float"],
});

// Retrieval
const queryVector = await cohere.embed({
  model:     "embed-english-v3.0",
  texts:     [userMessage],
  input_type: "search_query",
  embedding_types: ["float"],
});
```

the deploying product's wrapper:

```typescript
embed(texts, "search_document"): Promise<number[][]>
embedQuery(text): Promise<number[]>   // wraps embed([text], "search_query")[0]
```

`embedQuery()` is the convenience that prevents the most common embedding bug.

---

## Vector dimensions

- `embed-english-v3.0`: **1024-dim**.
- Cosine distance.
- `VECTOR_SIZE = 1024` in `qdrant-client.ts` is the single source of truth.

---

## Why English-only is acceptable for the deploying product

the deploying product's coaching corpus is English. Multilingual embedders (BGE-M3) trade English quality for languages we don't currently serve. When/if multilingual becomes a use case, BGE-M3 is the first alternative to evaluate (see `references/generic-embedding-model-choice.md`).

---

## Token limit gotcha

500-char chunks (~125 tokens) are well within the 512-token limit. The current host product design choice is deliberate (smaller chunks = more precise retrieval) but **below** the optimal Cohere window. A migration to ~2000-char chunks (~512 tokens) would lift precision but requires re-indexing all existing vectors.

---

## Implications

- Wrong `input_type` → **must-fix** (retrieval quality drops 5-15%).
- Batch > 96 → must-fix (request fails).
- Embedding without `wait: true` on Qdrant upsert when retrieval immediately follows → must-fix.
- See `guides/10-cohere-embedding-and-rerank.md`.
