# pgvector: hybrid search with Postgres full text

How to combine pgvector similarity with native Postgres full-text search in one query on this stack. Deep detail on ranking and fusion weighting lives in `retrieval-stinger` (this Stinger owns the storage shape and the index; `retrieval-worker-bee` owns recall tuning); this guide covers the storage-layer half.

## Why hybrid, not vector-only

Pure vector search misses exact-match and rare-term queries (SKUs, error codes, proper nouns, IDs) that a lexical index catches instantly, because embedding models compress meaning and lose exact-token fidelity. Pure lexical search misses paraphrases and conceptual matches that vector search catches instantly. Most product search surfaces want both, fused, not one or the other.

## The two columns

A hybrid-searchable table on Postgres typically carries both:

```ts
import { index, pgTable, serial, text, vector, customType } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

const tsvectorType = customType<{ data: string }>({
  dataType() {
    return 'tsvector';
  },
});

export const documents = pgTable(
  'documents',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
    searchVector: tsvectorType('search_vector').generatedAlwaysAs(
      (): any => sql`to_tsvector('english', ${documents.content})`
    ),
  },
  (table) => [
    index('documents_embedding_hnsw').using('hnsw', table.embedding.op('vector_cosine_ops')),
    index('documents_search_vector_gin').using('gin', table.searchVector),
  ]
);
```

A generated `tsvector` column kept current by Postgres itself (via `GENERATED ALWAYS AS`) avoids the classic bug where a hand-maintained tsvector column drifts out of sync with the source text after an update. Index it with GIN, not GiST, for a static or append-heavy corpus; GIN gives faster lookups at a slightly slower write.

## Running both searches and fusing

The storage-layer contract is: run the vector similarity query and the full-text query independently, each producing a ranked list, then fuse the two ranked lists (commonly Reciprocal Rank Fusion, RRF) into a single ranking. See `retrieval-stinger/guides/*` for the fusion math and weighting; this Stinger's job stops at making sure both indexes exist, are current, and are queryable efficiently:

```sql
-- vector arm
SELECT id, embedding <=> $1 AS distance
FROM documents
ORDER BY embedding <=> $1
LIMIT 20;

-- lexical arm
SELECT id, ts_rank(search_vector, websearch_to_tsquery('english', $2)) AS rank
FROM documents
WHERE search_vector @@ websearch_to_tsquery('english', $2)
ORDER BY rank DESC
LIMIT 20;
```

Fuse the two ranked ID lists in the application layer (or a CTE) with RRF rather than trying to force one SQL query to compute a single blended score; RRF only needs each arm's rank position, not a normalized score, which sidesteps the problem of cosine distance and `ts_rank` living on incomparable scales.

## Filtering alongside hybrid search

Both arms can carry the same `WHERE` clause (tenant ID, status, date range) ahead of the `ORDER BY`. Remember the pgvector filtering caveat from the selection matrix: a highly selective filter on a large table is applied *after* the ANN candidate set is built, not inside the index traversal, so a very selective filter combined with a small `LIMIT` can under-return results even though matching rows exist further down the unfiltered ranking. If a query needs both a highly selective filter and full recall, consider a partial index scoped to the filter, or raising `hnsw.ef_search` for that query path specifically.
