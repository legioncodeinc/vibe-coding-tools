# PostgreSQL extensions - pg_vector - Drizzle ORM

- URL: https://orm.drizzle.team/docs/extensions/pg
- Fetched: 2026-08-14
- Source type: official-docs
- Component: vector-store (Drizzle column types and distance operators)

## Summary

Drizzle does not scaffold `CREATE EXTENSION vector` itself; it assumes the database already has pgvector installed. It exposes a `vector()` column builder and query-time distance-operator helpers that translate directly to pgvector SQL.

## Column definition

```ts
const table = pgTable('table', {
  embedding: vector({ dimensions: 3 }),
  embedding2: vector({ dimensions: 3 }).default([0, -2, 3]),
});
```

```sql
CREATE TABLE "table" (
  "embedding" vector(3),
  "embedding2" vector(3) DEFAULT '[0,-2,3]'
);
```

## Index examples translated to Drizzle

```ts
export const table = pgTable('items', {
  embedding: vector({ dimensions: 3 }),
}, (table) => [
  index('l2_index').using('hnsw', table.embedding.op('vector_l2_ops')),
  index('ip_index').using('hnsw', table.embedding.op('vector_ip_ops')),
  index('cosine_index').using('hnsw', table.embedding.op('vector_cosine_ops')),
]);
```

This maps directly to:

```sql
CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

## Query helpers

```ts
import { l2Distance, innerProduct } from 'drizzle-orm';

// SELECT * FROM items ORDER BY embedding <-> '[3,1,2]' LIMIT 5;
db.select().from(items).orderBy(l2Distance(items.embedding, [3, 1, 2])).limit(5);

// SELECT embedding <-> '[3,1,2]' AS distance FROM items;
db.select({ distance: l2Distance(items.embedding, [3, 1, 2]) }).from(items);

// SELECT * FROM items ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1) LIMIT 5;
const subquery = db.select({ embedding: items.embedding }).from(items).where(eq(items.id, 1));
db.select().from(items).orderBy(l2Distance(items.embedding, subquery)).limit(5);

// SELECT (embedding <#> '[3,1,2]') * -1 AS inner_product FROM items;
db.select({ innerProduct: sql`(${innerProduct(items.embedding, [3, 1, 2])}) * -1` }).from(items);
```

The operator class passed to `.op(...)` on an index must match the distance function used in the query (`vector_cosine_ops` with cosine distance, `vector_l2_ops` with L2, `vector_ip_ops` with inner product) or the planner will not use the index.
