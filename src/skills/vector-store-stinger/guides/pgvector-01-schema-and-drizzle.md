# pgvector: schema and Drizzle column definition

Implementation guide for the default option on this stack: Neon Postgres, pgvector, Drizzle ORM. Sourced from `references/research/raw/neon--pgvector--extension-official-docs.md`, `references/research/raw/drizzle-orm--pgvector-similarity-search-guide.md`, and `references/research/raw/drizzle-orm--postgres-extensions-pgvector-operators.md`.

## Enable the extension

pgvector ships on every Neon plan, no add-on required. It installs per database, not per project; if a branch has more than one database, enable it in each:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Drizzle Kit does not scaffold this statement. Write it by hand into a custom migration:

```bash
npx drizzle-kit generate --custom
```

Then add `CREATE EXTENSION vector;` as the body of the generated empty migration file, and run it before any migration that adds a `vector` column.

## Define the column

```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const documents = pgTable(
  'documents',
  {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('documents_embedding_hnsw').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

## Dimension discipline

The `dimensions` value is not a suggestion; it is the exact output width of the embedding model in use (1536 for OpenAI `text-embedding-3-small`, 1024 for Cohere `embed-english-v3.0`, 768 for nomic-embed-text-v1.5, and so on; see `embeddings-runtime-stinger` for the model landscape). A write with a mismatched vector length fails outright. A model swap that changes dimension is a schema event:

1. Add a new column (or a new table) at the new dimension. Do not resize the existing column in place.
2. Backfill by re-embedding the corpus into the new column.
3. Cut reads over once the backfill is verified against a recall check (see `retrieval-stinger` `10-recall-quality-eval.md`).
4. Drop the old column only after the cutover is confirmed in production.

Never let one column silently mix embeddings from two different models. Even if the dimension happens to match, the vector spaces are not comparable and similarity scores across them are meaningless.

## The known Drizzle Kit quoting bug

Older Drizzle Kit versions generated `ADD COLUMN "embedding" "vector(1536)"` (with the type name itself quoted), which Postgres rejects with `type "vector(1536)" does not exist`, because the quotes turn the type name into an identifier instead of a type reference. The fix landed in drizzle-orm upstream (PR #2360). Pin a Drizzle ORM/Kit version at or after that fix, and regardless, diff every generated migration that touches a `vector` column before applying it. This is exactly the kind of silent-failure class of bug that a schema review should catch before it ships.

## halfvec for storage-constrained columns

pgvector also ships `halfvec` (half-precision, ~half the storage of `vector`, indexed up to 4,000 dimensions versus 2,000 for `vector`). For large corpora where index memory is the binding constraint, storing as `halfvec` is usually the first, lowest-risk cost lever to reach for, before reaching for a different store entirely. Drizzle does not yet expose a first-class `halfvec` column builder as cleanly as `vector`; treat it as a `customType` or raw-SQL migration until first-class support lands, and confirm current support before committing to it in a schema review.
