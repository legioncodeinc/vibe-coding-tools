# pgvector: Drizzle migrations for vector columns

Migration mechanics specific to `vector` columns on this stack, beyond ordinary Drizzle migration discipline.

## The extension migration comes first, always

`CREATE EXTENSION vector;` has to exist as its own migration, generated with `drizzle-kit generate --custom`, and it has to run before any migration that references the `vector` type. Drizzle Kit has no awareness that a later migration depends on the extension; ordering is the developer's responsibility. Verify the extension migration is committed and applied before reviewing any migration that adds a `vector` column.

## Diff every generated vector-column migration

Confirmed upstream bug history: Drizzle Kit has generated `ADD COLUMN "embedding" "vector(1536)"` (type name quoted, which Postgres rejects) in past versions. The fix is in current drizzle-orm, but a schema review should still diff the generated SQL for any migration touching a `vector` column rather than trusting the generator blindly, especially on a pinned or slightly older Drizzle version. The failure mode is a migration that fails outright at apply time, not a silent data problem, so it will not reach production undetected, but it will block a deploy if not caught in review.

## Adding an index is a separate, reviewable step

```sql
CREATE INDEX CONCURRENTLY documents_embedding_hnsw
  ON documents USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
```

Use `CREATE INDEX CONCURRENTLY` for any index added to a table that already has production traffic; a plain `CREATE INDEX` takes a lock that blocks writes for the build's full duration, which for an HNSW index on a large table can be minutes. `CONCURRENTLY` cannot run inside a transaction block, so it needs its own migration step outside Drizzle's normal transactional migration wrapper; confirm the migration runner supports non-transactional statements before relying on this, or run the index build manually against the target database as a deploy step.

## A dimension change is a migration plan, not a single ALTER

pgvector has no `ALTER COLUMN ... TYPE vector(n)` path that reinterprets existing data at a new width; changing the embedding model's dimension means:

1. A migration that adds a new `vector(new_dim)` column (or a new table).
2. An application-level or scripted backfill that re-embeds existing rows into the new column.
3. A cutover migration (or feature flag) that points reads at the new column once the backfill is verified.
4. A cleanup migration that drops the old column, only after the cutover has been live long enough to be confident.

Never write a migration that attempts to resize an existing `vector` column in place; there is no such thing at the SQL level, and a migration that pretends otherwise will fail at apply time in the best case or silently write garbage in the worst.

## Rebuilding an index after a parameter change

Changing `m` or `ef_construction` on an HNSW index, or `lists` on an IVFFlat index, requires a full rebuild; neither is a session-scoped setting the way `hnsw.ef_search` and `ivfflat.probes` are. Treat a parameter change the same as any other index migration: build the new index `CONCURRENTLY` under a new name, confirm the planner picks it and recall/latency improved with `EXPLAIN (ANALYZE, BUFFERS)`, then drop the old index in a follow-up migration once confirmed.
