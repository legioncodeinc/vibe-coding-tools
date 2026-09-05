# Vector similarity search with pgvector extension - Drizzle ORM

- URL: https://orm.drizzle.team/docs/guides/vector-similarity-search
- Fetched: 2026-08-14
- Source type: official-docs
- Component: vector-store (Drizzle schema for pgvector)

## Summary

Drizzle ORM supports pgvector's `vector` column type and HNSW/IVFFlat indexes directly in the schema DSL. Drizzle Kit does not create the `vector` extension automatically; that has to be a hand-written migration.

## Enabling the extension via a custom migration

```bash
npx drizzle-kit generate --custom
```

Then add to the generated empty migration file:

```sql
CREATE EXTENSION vector;
```

## Schema: table with a vector column and an HNSW index

```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

Generated SQL:

```sql
CREATE TABLE IF NOT EXISTS "guides" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "url" text NOT NULL,
  "embedding" vector(1536)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "embeddingIndex" ON "guides" USING hnsw (embedding vector_cosine_ops);
```

## Querying similarity with Drizzle helpers

```ts
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { generateEmbedding } from './embedding';
import { guides } from './schema';

const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;

  return db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);
};
```

Drizzle exposes `l2Distance`, `cosineDistance`, and `innerProduct` (via `sql`) as first-class query builder helpers that map to the underlying `<->`, `<=>`, and `<#>` operators.

## Known gotcha: quoted vector type in generated migrations

`drizzle-kit` historically generated `ADD COLUMN "embedding" "vector(1536)"` (with the type quoted), which Postgres rejects with `type "vector(1536)" does not exist` because the quotes turn the type name into an identifier. The fix landed upstream (drizzle-orm PR #2360); pin a Drizzle ORM/Kit version at or after that fix, and diff any generated vector-column migration before applying it if using an older pinned version.
