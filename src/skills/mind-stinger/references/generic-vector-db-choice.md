# Generic vector DB choice (pgvector is this repo's default; Qdrant is a documented alternative)

> **Status, updated for this repo:** this repo's default retrieval substrate is **pgvector on Neon Postgres**, owned by `vector-store-stinger` (schema, migrations) and `retrieval-stinger` (query shape, recall tuning). See `guides/00-selection-and-defaults.md` for the full reasoning and the escalation triggers. Qdrant per-tenant collections (`{type}-{tenantId}`, HNSW `m: 16, ef_construct: 200`, cosine distance, `strict_mode: enabled`, `on_disk: false`) is the alternative stack, fully documented starting at `guides/01-stack-enforcement.md`, for a project that already runs it or has a specific need past pgvector's ceiling. This file previously framed pgvector as a demoted, awareness-only alternative to a canonical Qdrant choice; for this repo, that framing is inverted.

---

## Why pgvector on Neon is the default for this repo

1. **No new system to provision, monitor, back up, or grant access to.** `CREATE EXTENSION IF NOT EXISTS vector;` and the column lives next to every other table this repo already runs in Postgres.
2. **Vector search shares a transaction and a connection pool with relational data.** Per-tenant filtering is an ordinary indexed `WHERE tenant_id = $1`, joinable against the rest of the schema, not a separate payload-filter dialect.
3. **One backup plan.** Point-in-time recovery, logical replication, and `pg_dump` already cover embeddings the same way they cover every other table.
4. **Mature enough at this repo's scale.** ANN-Benchmarks 2025 places pgvector with HNSW at the top of the open field; this repo is nowhere near the multi-million-vector range where the tradeoffs below start to bite.

See `guides/00-selection-and-defaults.md` for the schema shape, HNSW parameters, and cited production SLOs.

## Why Qdrant remains a fully documented alternative

1. **RPS + latency profile** is best-in-class at the open-source vector DB tier once a corpus is large enough for that ceiling to matter.
2. **`strict_mode_config.enabled: true`** rejects filters on unindexed fields, preventing silent full-scans.
3. **In-graph metadata filtering.** Qdrant filters inside the ANN traversal rather than after building the candidate set, which is pgvector's one real structural weakness at high filter selectivity (the "recall cliff" documented in `guides/00-selection-and-defaults.md`).
4. **Per-tenant collections** scale cleanly to very large tenant counts without the memory overhead per-user collections would incur.
5. **HNSW tuning is well-documented** (`m`, `ef_construct`, `default_segment_number`).
6. **TS client (`@qdrant/js-client-rest`)** is mature and stable.

Reach for Qdrant when a measured signal, not a hunch, crosses one of the escalation triggers in `guides/00-selection-and-defaults.md`: corpus approaching roughly 2 million vectors with continuous writes, highly selective per-tenant filters at meaningful scale, or a need to isolate vector query load from the primary transactional workload.

---

## The alternatives (for context, beyond the default-vs-Qdrant pair above)

### pgvector (Postgres extension): this repo's default; see above, not repeated here as a generic alternative

### Pinecone

- **Pitch:** Managed vector DB. No ops.
- **Pros vs Qdrant:** Zero-ops; production-grade SLA; multi-region.
- **Cons vs Qdrant:** Closed-source; pricing scales aggressively with vector count and metadata; vendor lock-in.
- **When it'd be the right call:** Strict no-ops requirement + budget for managed services.

### Weaviate

- **Pitch:** Open-source vector DB with hybrid search built in (BM25 + vector).
- **Pros vs Qdrant:** Hybrid search first-class; GraphQL API.
- **Cons vs Qdrant:** Heavier resource footprint; GraphQL adds complexity; metadata filtering less flexible at scale.
- **When it'd be the right call:** Hybrid (BM25 + dense) retrieval is a primary need; Qdrant supports hybrid via named vectors but Weaviate's pattern is more idiomatic.

### Milvus

- **Pitch:** Open-source, scales to billions of vectors.
- **Pros vs Qdrant:** Higher scale ceiling; mature distributed mode.
- **Cons vs Qdrant:** Heavier ops; resource-hungry; setup complexity higher than Qdrant.
- **When it'd be the right call:** > 100M vectors with multi-node distributed requirement.

### Chroma

- **Pitch:** Embedded vector DB, simple Python API.
- **Pros vs Qdrant:** Easy local development; minimal ops.
- **Cons vs Qdrant:** Production maturity behind Qdrant; performance degrades past ~1M vectors; not battle-tested at scale.
- **When it'd be the right call:** Prototyping; local dev; not for production at the deploying product scale.

### Elasticsearch / OpenSearch (vector mode)

- **Pitch:** Existing search infrastructure, vector mode added.
- **Pros vs Qdrant:** Reuse existing infra if already on ES/OS.
- **Cons vs Qdrant:** Vector performance below dedicated vector DBs; resource usage high.
- **When it'd be the right call:** Already running ES/OS for log search and vector search is a small add-on.

### Redis (RediSearch with vector)

- **Pitch:** Vector search in Redis.
- **Pros vs Qdrant:** Reuse Valkey/Redis if already deployed.
- **Cons vs Qdrant:** Memory-bound; not designed for large vector corpora; hybrid filter performance below Qdrant.
- **When it'd be the right call:** Small vector corpus (< 100K) and existing Redis infrastructure.

---

## Decision matrix

| Factor | pgvector (this repo's default) | Qdrant (alternative stack) | Pinecone | Weaviate | Milvus | Chroma |
|---|---|---|---|---|---|---|
| Ops surface | Lowest (in Postgres) | Low | Zero (managed) | Medium | High | Lowest (embedded) |
| RPS at 10M vectors | Medium | High | High (managed) | Medium | High | Low |
| Filter performance | Medium (post-filter, Postgres planner; see the recall-cliff note in `guides/00-selection-and-defaults.md`) | High (strict mode, in-graph) | Medium | Medium | High | Low |
| Hybrid retrieval | Manual (Postgres FTS or ParadeDB `pg_search` + vector, fused with RRF) | Native (named vectors) | Manual | Native | Native | No |
| Cost | OSS, already-running Postgres | OSS + self-host | $$$ | OSS + self-host | OSS + self-host | OSS + embedded |
| Fit for this repo | Default | Alternative, for the escalation triggers in `guides/00-selection-and-defaults.md` | substitution | substitution | overkill | dev-only |

---

## Migration path, in either direction

**From nothing to pgvector (this repo's default path for a new feature):** schema design is owned by `vector-store-stinger`; query implementation by `retrieval-stinger`. See `guides/00-selection-and-defaults.md` for the recommended `documents`/`chunks` schema shape and HNSW parameters.

**From pgvector to Qdrant (only when an escalation trigger in `guides/00-selection-and-defaults.md` is actually measured, not assumed):**

1. Schema design for the target Qdrant collections, `db-worker-bee` and `vector-store-stinger` coordinate on the source side.
2. Backfill: re-index all vectors into Qdrant collections (one collection per `{type}-{tenantId}` equivalent).
3. Dual-write during transition.
4. Cut reads to Qdrant.
5. Drop the pgvector columns and their indexes once the cutover is verified.

Confirm the `tenant_id`-on-every-query rule (this stinger's rule 5) is enforced the same way on the Qdrant side, via payload filtering, that it was enforced on the Postgres side via an indexed column.
