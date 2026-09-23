# Alternative: Qdrant

Labeled alternative, not this repo's default. Reach for this guide only after the selection matrix (`00-selection-matrix.md`) points here: heavy metadata-filtered search at scale, or a corpus past pgvector's comfortable ceiling on a single Postgres instance. Sourced from `references/research/raw/devto--pgvector-vs-pinecone-vs-qdrant-when-dedicated-vector-db-worth-it.md` and `references/research/raw/kalviumlabs--vector-databases-compared-pgvector-pinecone-qdrant-weaviate-2026.md`.

## What it is

Qdrant is an open-source vector search engine written in Rust. Self-host it (Docker, Kubernetes) or use Qdrant Cloud. It treats vectors plus rich payload (metadata) filtering as first-class, and applies filters *inside* the HNSW graph traversal rather than as a post-filter on the candidate set, which is its standout advantage over pgvector for selective filtered queries at scale.

## Why it beats pgvector at scale, specifically

- **In-graph filtering.** A selective metadata filter (per-tenant search over a large shared collection, for example) does not force scanning several times the final result count the way pgvector's post-filter does.
- **Throughput at scale.** Published benchmarks: roughly 850 QPS at p95 ~8ms on 1M vectors (768-dim), self-hosted.
- **Native hybrid dense+sparse search.** Production-ready BM25-plus-semantic in one query, without bolting on a separate lexical index.
- **Quantization options** to cut memory footprint at large scale.

## The tradeoff: it is a second stateful system

Self-hosting Qdrant means running a distributed, stateful system: sharding, replication, backups, upgrades, monitoring. This only pays off when the vector workload genuinely justifies a dedicated system; standing it up for a corpus pgvector handles comfortably is pure overhead with no product benefit. Qdrant Cloud removes the self-hosting burden at a real dollar cost, similar in shape to Pinecone's tradeoff (see `alt-02-managed-vector-services.md`) but with the option to self-host later if the vendor relationship changes.

## When to actually reach for it on this stack

- The corpus has crossed, or is clearly headed toward, several million vectors with continuous writes on the primary Neon instance, and index build/VACUUM contention is measured, not hypothesized.
- Queries combine vector similarity with highly selective metadata filters (multi-tenant search over a large shared table is the canonical case) and pgvector's post-filter behavior is producing measurably poor recall or latency at the filter selectivity the product actually sees.
- Hybrid dense+sparse search is a hard product requirement and the team does not want to maintain a separate BM25 implementation on top of Postgres full text.

## Integration shape if adopted

Qdrant would run alongside Neon, not instead of it: relational data, auth, and application state stay in Postgres; only the vector collection(s) needing Qdrant's filtering or scale characteristics move. This is a per-collection decision, not an all-or-nothing migration; a project can run pgvector for most tables and Qdrant for the one collection that has outgrown it. Document the split explicitly in an ADR before adopting, since it introduces a second datastore this team now operates (or pays Qdrant Cloud to operate), a second thing to keep in sync, monitor, and reason about during an incident.
