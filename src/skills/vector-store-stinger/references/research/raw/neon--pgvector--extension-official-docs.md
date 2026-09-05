# The pgvector extension - Neon Docs

- URL: https://neon.com/docs/extensions/pgvector
- Fetched: 2026-08-14
- Source type: official-docs
- Component: vector-store (pgvector on Neon)

## Summary

The pgvector extension adds vector embedding storage and similarity search to Postgres, supporting exact and approximate nearest-neighbor queries with L2, cosine, inner product, L1, Hamming, and Jaccard distance operators. HNSW supports up to 2,000 dimensions for `vector`, 4,000 for `halfvec`, and 64,000 for `bit`; IVFFlat shares the same limits.

## Enabling the extension

pgvector is available on every Neon plan with no add-on or paid tier required.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

The extension is installed per database, not per project. If a Neon branch has multiple databases, run the statement once in each database that stores vectors.

Confirm install and version:

```sql
SELECT extname, extversion FROM pg_extension WHERE extname = 'vector';
```

To install a previous version (one version back from latest supported):

```sql
CREATE EXTENSION vector VERSION '0.7.4';
```

## Creating a table with a vector column

```sql
CREATE TABLE items (
  id BIGSERIAL PRIMARY KEY,
  embedding VECTOR(1536)
);
```

Dimensions must match the embedding model in use (for example OpenAI `text-embedding-3-small` outputs 1536 dimensions).

## Storing and querying vectors

Insert:

```sql
INSERT INTO items (embedding) VALUES ('[0.1, 0.2, 0.3]');
```

Nearest neighbor by L2 distance:

```sql
SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
```

Nearest neighbor to an existing row:

```sql
SELECT * FROM items
WHERE id != 1
ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1)
LIMIT 5;
```

## Indexing vectors

By default pgvector performs an exact (sequential) nearest-neighbor search with perfect recall. Adding an approximate index (HNSW or IVFFlat) trades a small amount of recall for much better query performance at scale. Match the operator class (`vector_cosine_ops`, `vector_l2_ops`, `vector_ip_ops`) to the distance operator used in the query, or the planner will silently fall back to a sequential scan.

## Related Neon AI Starter Kit pages

Neon's AI Starter Kit collects pgvector setup, RAG pipeline concepts, semantic search, and scaling strategy under `neon.com/docs/ai/*`, and supports framework integrations including LangChain, LlamaIndex, Semantic Kernel, and Inngest, plus a deployable Vercel Postgres + pgvector starter template.
