# 00 - Principles

The non-negotiables for retrieval, regardless of which stack implements it. Read this first on every invocation, before any implementation-specific guide.

> **Ground truth:** for this repo's default stack (Neon Postgres, full-text search, pgvector, RRF fusion), see `references/research/distilled-retrieval.md` and the raw sources under `references/research/raw/`. For the Deep Lake/Hivemind implementation, ground truth is Hivemind source under `src/shell/`, `src/hooks/`, `src/skillify/`, `src/graph/`, and `src/embeddings/columns.ts` - see `research/` for that trail. If a finding contradicts the source or the cited research, read it again - it wins.

---

## What this Stinger covers

Retrieval for an app: how a query finds the right rows, chunks, or documents, ranked well, measured honestly. This repo's stack is Neon Postgres, so the default, first-class implementation is **Postgres full-text search (lexical) + pgvector (semantic) fused with Reciprocal Rank Fusion, with optional cross-encoder reranking** - see `guides/postgres-01-full-text-search.md` through `guides/postgres-06-recall-quality-eval.md`.

This Stinger also documents, in full and unchanged, the **Deep Lake-backed hybrid recall pipeline** built for the Hivemind product (`guides/deeplake-01-recall-pipeline.md` through `guides/deeplake-09-common-failure-modes.md`) as a supported alternative implementation for any project already running it. And it documents a **skillify/codify capability** (`guides/skillify-01-codify.md` through `guides/skillify-03-scope-and-privacy.md`) - mining agent sessions into `SKILL.md` files - as one specific thing this Stinger can help with, not the definition of retrieval. Most invocations on this repo will land in the Postgres guides; route to the Deep Lake or skillify guides only when the question is actually about that implementation.

---

## The principles

### 1. Hybrid beats single-mode for most real queries

Pure lexical search misses paraphrases and synonyms; pure semantic search misses exact identifiers, error strings, and rare tokens. A real query stream contains both shapes. Fusing both arms - RRF over Postgres full-text + pgvector (`guides/postgres-03-rrf-fusion.md`), or the Deep Lake `deeplake_hybrid_record` weighting (`guides/deeplake-02-hybrid-search.md`) - is the general answer; pure-lexical and pure-semantic are the edges, chosen deliberately for a query shape that clearly calls for one, not defaulted to out of habit.

### 2. Approximate recall trades speed for a small, tunable amount of missed recall - on purpose

Any ANN index (pgvector's HNSW/IVFFlat, Deep Lake's `<#>` path) makes the same bargain: skip an exhaustive scan, accept a small amount of missed recall, go faster. A result set changing after an index change is not automatically a bug - it's the index working as designed. The finding worth raising is recall dropping below what the product needs, measured, not "the index is approximate."

### 3. A silent fallback must stay silent when expected, and get surfaced when it's a surprise

Both implementations have a fallback path: Postgres hybrid degrading to lexical-only when no embedding is available for a query or row; the Deep Lake pipeline's BM25/ILIKE fallback when embeddings are off or the daemon is down (`guides/deeplake-03-bm25-fallback.md`). Either way: recall must never hard-fail for lack of an optional dependency. The finding is only when the user clearly expected semantic recall and silently got lexical with no signal telling them so.

### 4. Dimension, operator, and index class are schema facts, not tuning knobs

A query vector's dimension must match the stored column; a query's distance operator must match the index's operator class, or the index goes silently unused or the ordering is silently wrong. This is true for pgvector (`vector_cosine_ops` <-> `<=>`, etc. - owned by `vector-store-worker-bee`, see `guides/postgres-02-pgvector-recall.md` for the recall-side check) and for the Deep Lake `<#>` operator against `FLOAT4[]` columns sized to `EMBEDDING_DIMS` (`guides/deeplake-04-embeddings-integration.md`). A mismatch is a must-fix; the schema/index definition itself is a handoff, not this Stinger's call to make.

### 5. Fusion weighting is picked on purpose, per query intent

Whether it's `full_text_weight`/`semantic_weight` in an RRF query, Weaviate-style `alpha`, or the legacy Deep Lake `w1`/`w2` presets - the mechanism differs, the discipline doesn't. Keyword-shaped, exact-identifier queries lean lexical; paraphrase-heavy, conceptual queries lean semantic; unknown or mixed intent stays balanced. One fixed weighting applied to every query regardless of shape is a should-refactor in every implementation this Stinger covers.

### 6. Reranking is a second-stage refinement, never a recall fix

A reranker (cross-encoder, e.g. Cohere rerank) reorders a candidate pool - it cannot recover a document that never made the pool. Ablate it last, after chunking, embedding, and fusion are already solid (`guides/postgres-04-reranking.md`). A reranker evaluated before the earlier stages are trustworthy produces a misleading "reranking doesn't help" verdict that's actually a masked recall problem upstream.

### 7. Chunking is a citation-backed decision, not a vendor-blog guess

Structural (sentence-boundary or fixed-size recursive) chunking matches or beats semantic (embedding-similarity-boundary) chunking as the general default, per two independent 2026 benchmarks (`guides/postgres-05-chunking-strategy.md`, and the pre-existing Vectara NAACL 2025 finding this Hive already treats as load-bearing at `mind-stinger/references/vectara-naacl-2025-chunking-finding.md`). Semantic chunking is a documented option for large-context or highly-discursive corpora with a measured lift, never a default adopted because a vendor says "semantic" sounds smarter.

### 8. Recall quality is measured, not vibed

A fixed, labeled query set; precision and recall together (one alone hides the other's failure mode); before and after any pipeline change; posture (embeddings on/off, weighting, chunking) recorded alongside the numbers. This applies identically whether the pipeline is Postgres RRF (`guides/postgres-06-recall-quality-eval.md`) or Deep Lake hybrid (`guides/deeplake-08-recall-quality-eval.md`). "Feels better" is not an entry in either table.

### 9. Retrieval and generation are measured separately

A bad final answer has two possible causes: the right facts never reached the model (a retrieval failure no prompt tuning fixes), or the right facts were present but misused (a generation failure). Split the scorecard - recall@k/precision@k/MRR/nDCG for retrieval, faithfulness/answer-relevancy for generation - so a finding points at the actual broken stage, not a vague "the answer was wrong."

### 10. Skillify (codify) is one capability among several, not the default meaning of "retrieval"

The Haiku KEEP/MERGE/SKIP gate that mines agent sessions into `SKILL.md` provenance rows (`guides/skillify-01-codify.md` through `guides/skillify-03-scope-and-privacy.md`) is a legitimate, fully documented capability for anyone running that kind of pipeline - and it remains this Stinger's only coverage of that specific problem. It is not, however, what "retrieval" means on this repo's stack. Route a skillify-shaped question to those guides; route everything else to the Postgres guides first.

---

## Severity rubric

- **Must-fix** - a recall path that throws on a missing embedding instead of falling back to lexical; a query-vector dimension or operator that doesn't match the stored column/index; a `FULL OUTER JOIN` in an RRF query silently replaced with an `INNER JOIN` (drops single-arm hits); a `<#>` or pgvector query run against a NULL/missing column expecting a clean result; a mined skill with no provenance row; a `me`-scoped skill propagated to teammates. Blocks merge.
- **Should-refactor** - a fixed fusion weighting applied to every query regardless of intent; recall that silently ran lexical when semantic was expected, with no signal; unjustified overlap or semantic chunking with no measured lift; a reranker evaluated before recall is validated; no recall-quality snapshot before a pipeline change. Opens a follow-up ticket.
- **Style** - naming, helper placement, comment density. Never blocks a PR alone.

The severity of a finding is its credibility. Calling a style nit "must-fix" destroys trust.

---

## Cross-Bee handoffs

- **Vector column shape, dimension, index type (HNSW/IVFFlat), operator class, schema/DDL, Deep Lake table schema** -> **`vector-store-worker-bee`**. This Stinger owns the recall *query* (which operator, which weighting, is recall good enough); vector-store-worker-bee owns the column and index it queries against.
- **The embedding model, daemon, quantization, warmup, batching** -> **`embeddings-runtime-worker-bee`**. This Stinger owns how recall *consumes* vectors and the null/missing-embedding fallback contract; the model and pipeline that *produce* them are theirs.
- **API-key handling, PII inside retrieved chunks or mined skills, prompt-injection via retrieved or session text, scope as a security control** -> **`security-worker-bee`**. This Stinger flags with file:line or query; the audit is theirs.
- **Feature PRDs (a new recall mode, a new fusion strategy, a new propagation policy)** -> **`library-worker-bee`** authors; this Stinger provides the architectural rationale.
- **Retrieval/skillify quality as audit evidence** -> **`quality-worker-bee`**. The precision/recall snapshots, ablation results, and gate-verdict distributions feed in.

Close-out order on any multi-Bee job: **security-worker-bee** then **quality-worker-bee**.
