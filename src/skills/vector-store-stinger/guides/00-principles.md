# Principles: vector and embedding storage

Read this first on every invocation, before any implementation-specific guide. These principles hold regardless of which store backs the vectors.

## The store is a means to a query, not the point

Every vector-store decision traces back to one question: what query does this table need to answer, at what scale, with what recall, and alongside what other data? Pick the store and the index after answering that, not before. See `00-selection-matrix.md` for the worked decision tree.

## Dimension is a schema fact, not a runtime detail

The embedding model's output width is a hard constraint on the column. A `vector(768)` column cannot hold a 1536-dim embedding, silently or otherwise; the write fails. Changing embedding models is a schema event: a new column (or a new table), a backfill plan, and a cutover, never an in-place reinterpretation of existing bytes. This is true whether the column is pgvector's `vector(n)`, a Deep Lake `FLOAT4[n]` tensor, or a Qdrant collection's configured vector size. See `pgvector-01-schema-and-drizzle.md` §Dimension discipline and `guides/deeplake-06-embeddings-jsonb-versioning.md` for the Deep Lake equivalent.

## Match the operator class (or equivalent) to the distance metric you actually use

An index built for cosine distance does nothing for an L2 query, or vice versa; most engines either silently fall back to a full scan or simply refuse to use the index. Decide the distance metric once, per embedding model (cosine is the near-universal default for normalized text-embedding models), and keep every index and every query consistent with it. See `pgvector-02-indexing.md`.

## Approximate indexes trade recall for speed on purpose

HNSW, IVFFlat, Deep Lake's `deeplake_index`, and Qdrant's HNSW all make the same bargain: skip an exhaustive scan, accept a small, tunable amount of missed recall, and go faster. "It found different results after I added an index" is not a bug, it is the index working as designed. The finding worth raising is when recall drops below what the product needs, not that an approximate index is approximate. See `pgvector-02-indexing.md` and `10-recall-quality-eval.md` in `retrieval-stinger` for how to measure it.

## Hybrid beats vector-only for most product search

Pure semantic (vector) search misses exact-match and rare-term queries (SKUs, error codes, proper nouns) that lexical search catches instantly, and pure lexical search misses paraphrases and conceptual matches that vector search catches instantly. Most real search surfaces want both, fused. See `pgvector-03-hybrid-search.md` for the Postgres full-text implementation and `guides/deeplake-02-indexing.md` for the Deep Lake hybrid path.

## Every claim is sourced

A guide section, a research note in `references/research/`, or an official docs URL. "Best practice" with no citation does not survive a review here.

## Severity rubric

Used to classify findings when reviewing an existing vector-store setup, whichever backend is in play:

- **Must-fix**: a query's distance operator does not match the index's operator class (index silently unused, or query returns wrong ordering); an embedding written at one dimension and queried at another; a dimension change shipped without a migration/backfill plan; an IVFFlat index built on an empty or partially-loaded table; a filtered query at meaningful scale with no plan to keep filter selectivity reasonable against a post-filtered ANN index.
- **Should-refactor**: an index built with default parameters never tuned against a measured recall target; a corpus approaching the chosen store's practical scale ceiling with no migration plan; IVFFlat chosen where the data takes continuous writes (recall will silently decay); a vector-only search where hybrid would clearly outperform for the product's query mix.
- **Style**: naming, comment density, where a helper lives. Never blocks a review on its own.

## Cross-cutting handoffs

- **Which embedding model, and its dimension** -> `embeddings-runtime-worker-bee`. This Stinger picks the column/collection shape and the index; the model that produces the vectors is theirs.
- **Recall tuning, hybrid weighting, chunking strategy, evaluation** -> `retrieval-worker-bee`. This Stinger stores and indexes; retrieval-worker-bee tunes how well a query finds the right rows.
- **Tenant isolation, credential handling, PII in stored payloads** -> `security-worker-bee`.
- **Schema PRD authorship** -> `library-worker-bee`.

## Where to go next

1. **Choosing a store for a new project or feature** -> `00-selection-matrix.md`.
2. **Building on this repo's default (Neon + pgvector + Drizzle)** -> `pgvector-01-schema-and-drizzle.md` through `pgvector-04-migrations.md`.
3. **Working with an existing Deep Lake dataset** -> `deeplake-00-principles.md` through `deeplake-08-storage-backends.md`.
4. **Evaluating Qdrant or a managed/serverless vector service as an alternative** -> `alt-01-qdrant.md`, `alt-02-managed-vector-services.md`.
