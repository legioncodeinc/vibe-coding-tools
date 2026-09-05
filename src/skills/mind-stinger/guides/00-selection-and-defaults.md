# 00: Selection and defaults

Which stack this repo actually runs for the cognitive layer, why, and when to reach for the alternative instead. Read this alongside `guides/00-principles.md` before any `rag-audit`, `memory-refactor`, or `graphrag-enable` invocation.

> **Doc reference:** `library/knowledge/private/ai/rag-vector-strategy.md` records this project's actual commitment; treat that doc as canonical if it disagrees with this default.

---

## The default for this repo: Neon Postgres plus pgvector

This repo already runs Neon Postgres with Drizzle ORM for every other table. Unless one of the escalation triggers below applies, the cognitive layer's retrieval substrate is a `vector` column in that same database, not a separate vector database service.

Why this wins by default here:

- **No new system to provision, monitor, back up, or grant access to.** `CREATE EXTENSION IF NOT EXISTS vector;` and the column lives next to every other table (source: `references/research/raw/neon--vector-search-guide-pgvector.md`).
- **Vector search can join and filter against relational data** (tenants, users, permissions, organizations) in the same query, same transaction, same connection pool. Per-tenant filtering, this stinger's rule 5 in `guides/00-principles.md`, is an ordinary indexed `WHERE tenant_id = $1`, not a payload-filter dialect specific to a vector database.
- **One backup plan.** Point-in-time recovery, logical replication, and `pg_dump` already cover the embeddings the same way they cover everything else (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`).
- **Maturity at this repo's scale.** ANN-Benchmarks 2025 places pgvector with HNSW at the top of the open field; a named April 2026 Timescale benchmark reports `pgvectorscale` (an optional extension, not required by default) sustaining 471 QPS at 99 percent recall at 50 million vectors (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`). This repo is nowhere near that scale.

The schema, indexing, and query implementation are owned by `vector-store-stinger` (schema and migrations) and `retrieval-stinger` (query shape and recall tuning); mind-worker-bee's job is to confirm the cognitive-layer concepts (per-tenant isolation, two-stage retrieval, chunking discipline) are honored on top of whatever those two Stingers build. See `vector-store-stinger`'s `guides/pgvector-01-schema-and-drizzle.md` onward for the implementation, and `vector-store-stinger`'s `guides/00-selection-matrix.md` for the full vector-store decision tree (this file summarizes the cognitive-layer-relevant slice of it).

### The schema shape mind-worker-bee expects to see

A production-shaped pgvector RAG setup separates the document (the business/permissions unit) from the chunk (the retrieval unit), with `tenant_id` carried on both tables even though it's derivable via a join (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`):

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id   uuid NOT NULL,
    source      text NOT NULL,
    title       text,
    body        text NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE chunks (
    id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id   uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    tenant_id     uuid NOT NULL,
    chunk_index   int NOT NULL,
    text          text NOT NULL,
    embedding     vector(1024) NOT NULL,
    token_count   int,
    created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX chunks_tenant_idx ON chunks (tenant_id);
CREATE INDEX chunks_embedding_hnsw
  ON chunks USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

A missing `tenant_id` filter on the retrieval query against `chunks`, or a missing index backing that filter, is the same must-fix severity as a missing `tenant_id` payload filter on a Qdrant query in the alternative stack. See `guides/00-principles.md` rule 5.

### The one structural gap relative to the alternative stack, and its mitigation

pgvector's HNSW index applies a metadata filter (like `tenant_id`) *after* building its top-k candidate set, not inside the graph traversal the way Qdrant does. A highly selective filter can leave far fewer results than requested, or none (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`). Mitigations, in order of applicability:

1. A partial index or a partition per tenant, when tenant is the dominant filter.
2. Raising the runtime `hnsw.ef_search` GUC for moderately selective filters.
3. pgvector 0.8's iterative scan (`SET hnsw.iterative_scan = strict_order` or `relaxed_order`, bounded by `hnsw.max_scan_tuples`) for the general case.

This is the primary escalation trigger toward the alternative stack; see the table below.

### Two-stage retrieval still applies

A wide, cheap HNSW cosine sweep for candidates, then a reranking step that narrows to the final top-N, is not optional past a small corpus on this substrate any more than it is on the alternative stack. Skipping the rerank stage costs 10 to 15 percent measured relevance on a cited production dataset (source: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`). The reranker can be a local cross-encoder or a hosted API (Cohere Rerank is not exclusive to the Qdrant path; it works fine reranking pgvector's candidate set too).

### Targets for this repo's default substrate

- End-to-end retrieval-plus-generation p95 latency under 700ms for a single-turn response (up to 1500ms with rerank plus a large model in the pipeline).
- Recall@10 at or above 0.85 on a held-out eval set, alert below 0.80.
- A monitored cost-per-thousand-queries budget.

(Source for all three: `references/research/raw/jacar-es--pgvector-production-poc-to-slo.md`.)

---

## Escalation triggers: when to move off pgvector, or run a dedicated vector database alongside it

Move off pgvector, or add a dedicated vector database for a specific feature, when a **measured** signal, not a hunch, shows one of these (this table mirrors `vector-store-stinger`'s own selection matrix; consult it directly before acting):

| Signal | What it means | Where to look next |
|---|---|---|
| Corpus approaching or past roughly 2 million vectors with continuous writes on one Postgres instance | Index build time and `VACUUM` start competing with query and write traffic | `guides/01-stack-enforcement.md` (Qdrant) |
| Highly selective per-tenant metadata filters at meaningful scale | The recall-cliff mechanism described above starts costing real result quality | `guides/01-stack-enforcement.md` (Qdrant) |
| Query concurrency that needs isolation from the primary transactional workload | A heavy embedding backfill or a search-traffic spike contends with production OLTP queries on the same instance | A dedicated read replica first; the alternative stack if isolation alone isn't enough |
| The team wants vector search operations owned by a vendor, not by this team | No index tuning, no capacity planning, consumption-based billing | A managed vector service, documented in `vector-store-stinger`'s `guides/alt-02-managed-vector-services.md` |
| An existing Qdrant deployment already backs a feature | Migrating a running collection has its own cost; evaluate in place before treating a rewrite as free | `guides/01-stack-enforcement.md` |

"Everyone else uses a dedicated vector database" is explicitly not a valid trigger.

---

## The alternative stack: Qdrant, Cohere, Valkey, OpenRouter

Fully documented starting at `guides/01-stack-enforcement.md`, and not deprecated by this default. It is the right call, unmodified, for:

- A project that is already running it in production; a migration off a working system needs its own justification, not just "the default changed."
- A corpus large enough or filtered aggressively enough to hit the escalation triggers above.
- A team that wants the LLM gateway, the vector store, and the rerank step to each be a managed, swappable vendor with no Postgres coupling at all.

Every guide from `01` onward carries a short label at the top identifying it as alternative-stack documentation and pointing back here. Nothing in that guide set changes as a result of this repo's default; it stays fully implementable for a project (or a future feature within this repo) that has a specific need for it.

---

## SvelteKit-specific implementation note

Once the retrieval substrate is decided, the response still has to reach the browser as a stream. That's a separate concern from which database backs retrieval, covered in `guides/svelte-streaming-endpoints.md`.
