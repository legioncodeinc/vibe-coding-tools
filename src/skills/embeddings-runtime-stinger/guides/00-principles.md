# Principles - embeddings-runtime-stinger

These non-negotiables govern every output this stinger produces, regardless of whether the embeddings come from a hosted provider (OpenAI, Cohere, Voyage AI) or a self-hosted local model. Read this guide on every invocation before consulting a specialized guide.

## 1. The embedding dimension locks the schema

Whatever store holds the vectors, the embedding model's output width is a hard constraint on the column or collection, never a runtime detail:

- On this repo's default stack (Neon Postgres + pgvector, per `vector-store-stinger`), the constraint is a `vector(n)` column's declared width.
- On a Hivemind/Deep Lake project, the constraint is `EMBEDDING_DIMS` and the `FLOAT4[]` column width (see `guides/local-daemon-07-schema-and-columns.md` for the full Deep Lake mechanics).
- Either way: a model whose output dimension does not match the column cannot be written without a schema migration. Changing the dimension is a schema event: new column (or resized column), backfill/re-embed, cutover, cleanup. It is never an in-place reinterpretation.
- Matryoshka-trained models (OpenAI `text-embedding-3-*`, Cohere `embed-v4`, Voyage `voyage-4-*`, and nomic-embed-text-v1.5) are the one exception worth knowing: truncating to a shorter, still-supported width is a slice-and-renormalize operation on an already-generated vector, not a re-embed. See `guides/00-selection-matrix.md` and `guides/hosted-01-openai.md` / `hosted-03-voyage.md` for the mechanics. A width outside the model's trained Matryoshka set, or a genuinely different model, is always a full re-embed.

Never recommend a model swap or a dimension change without checking this first.

## 2. Match the model to the workload, not to a leaderboard

The rubric, in priority order, applies to any provider or self-hosted option:

1. **Dimension compatibility** - does the candidate's output width fit the target column (directly, or via Matryoshka truncation), or does adopting it force a schema migration?
2. **Retrieval quality on this project's actual data** - a model that wins a public benchmark (MTEB or otherwise) but does not improve recall on the project's real records and queries is not a win. Build a small domain-specific eval set (a few dozen to a few hundred query-to-relevant-document pairs is enough to start) before trusting a leaderboard score.
3. **Latency and throughput** - a hosted API call is dominated by network round-trip, not inference; a self-hosted model is dominated by warmup and per-batch inference time on the host's CPU/GPU. Match the model to the actual product surface: a live search box wants latency, a bulk backfill wants throughput.
4. **Cost** - per-token hosted pricing vs the infrastructure cost (and engineering time) of self-hosting. See `guides/00-selection-matrix.md` for the local-vs-hosted decision.

## 3. There is no quality cliff in falling back to lexical search

Turning semantic (embedding-based) search off, or not turning it on in the first place, is a legitimate, shipped configuration on any stack. Falling back to lexical search (Postgres full-text search, BM25, ILIKE) does not break recall; it narrows it to exact and near-exact keyword matches and loses paraphrase/conceptual matching. Never frame "off" as broken or as a missing dependency. See `guides/local-daemon-05-embeddings-vs-bm25.md` for the fully worked Hivemind example of this decision; the same reasoning applies to any embeddings-vs-lexical tradeoff.

## 4. Batch, don't spawn per item

Whether the embedding call goes to a hosted API or a local daemon, per-item round trips are always wrong for bulk work:

- A hosted API call amortizes HTTP/TLS overhead across a batch; sending 1000 texts one at a time instead of in batches of 50-500 turns 20 requests into 1000. See `guides/01-batching.md`.
- A self-hosted daemon amortizes model warmup across a warm, long-lived process; spawning a fresh process per embedding pays the warmup cost every time. See `guides/local-daemon-01-lifecycle.md`.
- Interactive, single-query embedding (one search box keystroke, one chat turn) is the one case batching does not apply to; there is nothing to batch.

## 5. Cache before you re-embed

Embeddings are a pure function of `(model, model_version, exact text)`: same input, same model, same vector, forever. That determinism makes caching safe and close to mandatory for any pipeline that re-processes overlapping content (nightly re-indexing, repeated support questions, incremental document updates):

- The cache key must include the model name, model version, and a content hash, never just a document ID (an edited document under the same ID must produce a cache miss).
- TTL is almost never the right invalidation mechanism for an embedding cache; embeddings go stale only when the text or the model changes, and the key already encodes both.
- See `guides/02-caching.md` for the full pattern, including the cold-start/single-flight problem on day zero and the model-swap versioning strategies.

## 6. State the consequence, not just the recommendation

Every output should name the consequence on the axes that matter for whichever runtime is in play:

- **Dim/schema:** does this touch the vector column's declared width?
- **Cost:** does this change per-token spend (hosted) or footprint/CPU (self-hosted)?
- **Latency/throughput:** does warmup, network round-trip, or per-batch inference time change?

A recommendation without these consequences is incomplete.

## 7. Never strand a dimension change mid-migration

Changing the embedding dimension forces a column-width change and a re-embedding backfill of existing records, on any store. Before recommending it:

- Name the full migration path: schema change, re-embed existing records, validate recall.
- Hand the schema execution to the owning storage Bee: `vector-store-worker-bee` on this repo's default stack (pgvector on Neon) or on a Deep Lake project. This stinger decides the dimension and writes the plan; it does not execute the schema event itself.
- If recall works today, a dimension change proposed purely for cost or a marginal quality gain is a should-refactor, not a must-fix, unless current data is already corrupt from a dimension mismatch.

## Severity rubric

Used to classify findings when auditing an existing embeddings setup, on any provider or runtime:

- **Must-fix:** embedding dimension does not match the target column/collection width (recall returns garbage or writes fail); embeddings written with one model then queried as if from another (mixed vector spaces, silently wrong distances); a dimension change shipped without the schema migration path; a hosted-provider `input_type`/asymmetric-embedding parameter (Cohere `search_document` vs `search_query`, Voyage `document` vs `query`) used inconsistently between the write and query paths.
- **Should-refactor:** embeddings turned on with no measured recall lift over the lexical fallback; a self-hosted daemon spawned per-request instead of warmed once; a hosted API called per-item instead of batched; no embedding cache on a pipeline that repeatedly re-processes overlapping content; quantization or footprint heavier than justified by a measured quality need.
- **Style / nice-to-have:** no crash-recovery or retry handling on the embedding call path; warmup or rate-limit backoff not surfaced to the user as an expected cost; model or provider choice undocumented.

## Cross-Bee handoffs

Surface these explicitly rather than attempting them inline:

- **`vector-store-worker-bee`** for the actual schema/column mechanics when a dimension change forces a migration (pgvector column resize on this repo's default stack, or Deep Lake schema-heal on a Hivemind-style project). This Bee decides the dimension and writes the swap plan; `vector-store-worker-bee` executes the schema event.
- **`security-worker-bee`** if a hosted embedding provider is considered and an API key or data-egress review is needed.
- **`library-worker-bee`** for PRD authorship when turning embeddings on, or a model/provider swap, needs to be documented as a feature requirement.
