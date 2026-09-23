# Selection matrix: which vector store

Walk this before writing any schema. Grounded in `references/research/raw/devto--pgvector-vs-pinecone-vs-qdrant-when-dedicated-vector-db-worth-it.md` and `references/research/raw/kalviumlabs--vector-databases-compared-pgvector-pinecone-qdrant-weaviate-2026.md`.

## Default for this repo: Neon Postgres + pgvector

This repo already runs Neon Postgres with Drizzle ORM. Unless one of the escape hatches below applies, the answer is pgvector on the existing database. Reasons this wins by default here:

- No new system to provision, monitor, back up, or grant access to. `CREATE EXTENSION IF NOT EXISTS vector;` and the column lives next to every other table.
- Vector search can join and filter against relational data (organizations, users, tenants, permissions) in the same query, same transaction, same connection pool.
- Neon's serverless compute scales to zero on idle, which keeps cost low for bursty search traffic compared to a dedicated vector database that bills for standing infrastructure.
- The team already owns Postgres operations; a second datastore is a second on-call surface for no product benefit at this repo's current scale.

See `pgvector-01-schema-and-drizzle.md` onward for the implementation.

## Escape hatches: when pgvector stops being the right default

Move off pgvector, or run a dedicated vector database alongside it, when a **measured** signal (not a hunch) shows one of these:

| Signal | What it means | Where to look next |
|---|---|---|
| Corpus approaching or past ~2M vectors with continuous writes on one Postgres instance | Index build time and `VACUUM` start competing with query and write traffic; p95 latency climbs past what the product needs | `alt-01-qdrant.md` |
| Highly selective metadata filters (for example, per-tenant search over a shared large table) at meaningful scale | pgvector filters are applied *after* the ANN candidate set is built, not inside the index traversal; a 10% selectivity filter can force scanning several times the final result count | `alt-01-qdrant.md` |
| Query concurrency that needs to be isolated from the primary transactional workload | A heavy embedding backfill or a spike in search traffic can contend with production OLTP queries on the same instance | Dedicated read replica first; `alt-01-qdrant.md` or `alt-02-managed-vector-services.md` if isolation alone is not enough |
| The team wants vector search operations owned by a vendor, not by this team | No index tuning, no capacity planning, consumption-based billing, real vendor lock-in | `alt-02-managed-vector-services.md` |
| An existing Deep Lake dataset already backs the feature | Migrating a running dataset has its own cost; evaluate in place before treating a rewrite as free | `deeplake-00-principles.md` |

"Everyone else uses a dedicated vector database" is explicitly not on this list. It is not a valid trigger to leave pgvector.

## One-paragraph comparison

**pgvector** is a Postgres extension: a column type and two ANN index methods (HNSW, IVFFlat) inside a database this repo already runs. **Qdrant** is a purpose-built, open-source vector engine (Rust) with in-graph metadata filtering and strong hybrid dense+sparse support, self-hosted or Qdrant Cloud; the tradeoff is a second stateful system to operate if self-hosted. **Pinecone-style managed services** are fully managed, closed-source, API-only vector databases; zero operational burden, real cost and lock-in at scale, and no self-host path. **Deep Lake** is the columnar, versioned dataset engine the earlier product on this codebase's history was built on (`FLOAT4[]` embedding columns, `deeplake_index` BM25, `<#>` vector, hybrid records via `deeplake_hybrid_record`); it remains a fully supported option here, documented in the `deeplake-*` guides, for any project that is already running it or has a specific need for its dataset-versioning model (commit/branch/merge/tag on the data itself).

## Quick decision table

| If the project is... | Default to |
|---|---|
| This repo, or any new SvelteKit + Neon + Drizzle feature | pgvector (`pgvector-01-schema-and-drizzle.md`) |
| Already running Deep Lake in production | Stay on Deep Lake (`deeplake-00-principles.md`) unless a Neon migration is independently justified |
| Expecting tens of millions of vectors with heavy metadata filtering from day one | Qdrant (`alt-01-qdrant.md`) |
| A team with no database operations capacity that wants zero infrastructure | A managed/serverless vector service (`alt-02-managed-vector-services.md`) |
