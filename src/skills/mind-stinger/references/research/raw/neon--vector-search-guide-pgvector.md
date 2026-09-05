# Neon Postgres: Vector Search guide (pgvector)

**Title:** Vector Search in Postgres - Neon Guides
**URL:** https://neon.com/guides/vector-search
**Author:** Valeri Karpov
**Fetched:** 2026-08-14
**Source type:** Official Neon documentation/guide
**Covers:** Enabling pgvector on Neon, creating a vector column, distance operators, HNSW indexing, storing and querying embeddings

## What the page says

Neon ships `pgvector` pre-installed; enabling it per-database is a single statement:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

A vector column is declared with a fixed dimensionality matching the embedding model's output width:

```sql
CREATE TABLE embeddings (
  id SERIAL PRIMARY KEY,
  data VECTOR(3)
);
```

pgvector exposes three distance operators used in `ORDER BY` for nearest-neighbor search:

- `<->` - Euclidean (L2) distance. General similarity, magnitude matters.
- `<=>` - Cosine distance. Standard choice for text embeddings, where direction matters more than magnitude.
- `<#>` - Negative inner product. Used for maximizing similarity, common in ranking/recommendation.

By default, a nearest-neighbor query performs a sequential scan, which the guide flags as slow at scale. Creating an HNSW index on the vector column accelerates approximate nearest-neighbor search:

```sql
CREATE INDEX ON embeddings USING hnsw (data);
```

The guide walks a full round trip: install the extension, create the table, insert vectors as literal array strings (`'[0.1, 0.2, 0.3]'`), run a nearest-neighbor query, add the HNSW index, then repeats the exercise with real embeddings (Nomic API output, 512-dim) to show the intended production shape: a `content` text column alongside the `data vector(N)` column so retrieved chunks carry their source text.

## Why this matters for this stinger

This is Neon's own first-party confirmation that pgvector ships enabled by default on every Neon project (no separate managed vector-database tier or add-on purchase required), which is the core argument for making Neon + pgvector this repo's default retrieval substrate rather than a secondary option. It is also the base syntax (`CREATE EXTENSION`, `VECTOR(n)` column type, the three distance operators, `USING hnsw`) that the SvelteKit streaming guide and the RAG default-stack framing both cite.

## Relevance to this stinger

Grounds the "Neon ships pgvector by default" claim and the basic schema/index syntax referenced in `guides/00-selection-and-defaults.md`. Cross-reference `vector-store-stinger`'s own pgvector guides (`pgvector-01-schema-and-drizzle.md` onward) for the Drizzle-specific implementation this stinger defers to.
