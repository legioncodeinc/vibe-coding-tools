# 02: Indexing

Pick the right index family per workload + column type. Choosing wrong is one of the top three causes of "we need a bigger database".

Source: `research/2026-04-25-index-families-decision-tree.md`.

## The decision tree

Ask, in order:

1. **What is the column type?** Eliminates most options.
2. **What is the predicate shape?** Equality, range, containment, FTS, similarity.
3. **What is the data distribution?** Skewed, sparse, append-only, random.
4. **What is the read/write ratio?** GIN is slow to write; BRIN is tiny to write.

## Index families

| Index | Best for | Bad for |
|---|---|---|
| **B-tree** (default) | Equality + range on scalars; sorting; PK; FK; status filters | Containment, FTS, geometry |
| **GIN** | `jsonb`, arrays, FTS (`tsvector`), `pg_trgm` similarity | High write throughput |
| **GiST** | Range types, geometry, exclusion constraints, FTS | Plain scalar equality (B-tree wins) |
| **BRIN** | Very large tables where physical order ≈ logical order (time-series append) | Random access; small tables |
| **Hash** | Equality only; rarely better than B-tree | Range queries |
| **SP-GiST** | Specialized partition / quad-tree shapes | General use |
| **Bloom** | Many low-selectivity predicates AND-ed (warehousing) | Single-predicate filters |

## Index modifiers

### Partial
Index only the rows you actually query:
```sql
CREATE INDEX ON orders (created_at) WHERE status = 'pending';
```
Halves the index size when 95% of orders are not pending. Particularly powerful with skewed status fields.

### Covering (`INCLUDE`)
Append non-key columns for index-only scans:
```sql
CREATE INDEX ON orders (user_id) INCLUDE (status, total);
```
The query `SELECT status, total FROM orders WHERE user_id = $1` never touches the heap. Massive read speedup; writes pay the cost of the extra columns.

### Expression
Index a derived value:
```sql
CREATE INDEX ON users (lower(email));
CREATE INDEX ON events ((payload->>'tenant_id'));
```
Required for case-insensitive searches and `jsonb` shortcuts.

### Unique
```sql
CREATE UNIQUE INDEX users_email_active
  ON users (email)
  WHERE deleted_at IS NULL;
```
Partial uniqueness: soft-deleted users can have repeated emails; active users cannot.

## FK indexes: must-fix

Postgres does **not** auto-create indexes on FK columns. Every FK gets a B-tree index:

```sql
ALTER TABLE posts ADD COLUMN author_id BIGINT NOT NULL REFERENCES users(id);
CREATE INDEX ON posts (author_id);  -- This line is mandatory.
```

`scripts/audit-missing-indexes.sql` finds every FK column that lacks an index on the same column set.

## Index for status / hot filters

Status columns with skewed distributions (95% `'completed'`, 5% other) almost always want a partial index on the rare values:

```sql
CREATE INDEX ON orders (created_at) WHERE status IN ('pending', 'failed');
```

The "ops dashboard" query that lists pending orders becomes near-instant.

## Index for `jsonb`

```sql
CREATE INDEX ON events USING gin (payload jsonb_path_ops);
```

`jsonb_path_ops`: smaller, faster, supports only `@>` containment. Use this 90% of the time.
`jsonb_ops`: full operator support (`?`, `?&`, `?|`); larger and slower.

For a single hot key, an expression index beats GIN:
```sql
CREATE INDEX ON events ((payload->>'tenant_id'));
```

## Index for FTS

```sql
ALTER TABLE articles ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(body, '')), 'B')
  ) STORED;

CREATE INDEX ON articles USING gin (search_vector);
```

Stored generated column means writes pay the tokenization cost; reads are GIN-fast.

## Index for ranges and exclusion

GiST powers range overlap queries and `EXCLUDE` constraints:
```sql
CREATE INDEX ON bookings USING gist (during);
```

## BRIN for time-series append-only

For tables that are append-only and queried by a time predicate:
```sql
CREATE INDEX ON events USING brin (created_at) WITH (pages_per_range = 32);
```

BRIN indexes are 1000x smaller than B-tree on a large append-only table. The trade-off: scans are looser (page-range filtering), so they win when correlation between physical and logical order is high.

## `pgvector` indexes

For embedding columns (`vector(1536)`):
```sql
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
```

`hnsw` is the 2026 default; `ivfflat` for very fast build / smaller datasets. Hand off retrieval strategy to `mind-worker-bee`. See `06-special-purpose.md`.

## Anti-patterns

- **Indexing every column "just in case".** Each index slows writes and bloats. Index by query plan, not paranoia.
- **Multi-column indexes in the wrong column order.** Leading column is the key; trailing columns help only when the leading column is part of the predicate.
- **Redundant indexes.** `(a)` is redundant when `(a, b)` exists. `scripts/audit-missing-indexes.sql` flags these.
- **Building `CREATE INDEX` (not `CONCURRENTLY`) on a hot table in production.** This takes a `SHARE` lock that blocks writes for the duration. Always `CREATE INDEX CONCURRENTLY` on hot tables.
- **`CREATE INDEX CONCURRENTLY` left invalid.** A concurrent build that fails leaves an `INVALID` index that doesn't help queries. `\d` shows it; drop and rebuild.

## Maintenance

- Reindex periodically on hot tables: `REINDEX INDEX CONCURRENTLY` (PG 12+).
- Watch for bloat: `scripts/bloat-check.sql`.
- Monitor unused indexes via `pg_stat_user_indexes`: `idx_scan = 0` over a quarter is a candidate to drop.

## Cross-references

- `01-schema-design.md`: every queried column needs an index plan.
- `05-performance-pooling.md`: interpret `EXPLAIN (ANALYZE, BUFFERS)` to confirm the index is used.
- `templates/indexes-decision-tree.md`: printable cheat sheet.
