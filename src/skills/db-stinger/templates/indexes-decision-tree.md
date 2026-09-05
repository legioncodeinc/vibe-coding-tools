# Indexes Decision Tree

Printable cheat sheet. Keep within arm's reach during schema review.

---

## Step 1: What is the column type?

| Column type | First-pass index family |
|---|---|
| `int`, `bigint`, `text`, `timestamptz`, `uuid`, `boolean` | B-tree |
| `jsonb` | GIN (`jsonb_path_ops`) |
| Array (`int[]`, `text[]`) | GIN |
| `tsvector` (FTS) | GIN |
| Range types (`tstzrange`, `int4range`) | GiST |
| Geometry (`point`, `polygon`, PostGIS types) | GiST |
| `vector` (pgvector) | HNSW (default 2026) or IVFFlat |
| Append-only time-series scalar | BRIN |

## Step 2: What is the predicate shape?

| Predicate | Best |
|---|---|
| `=`, `<`, `>`, `BETWEEN`, `ORDER BY` | B-tree |
| `@>` containment on `jsonb` | GIN `jsonb_path_ops` |
| `?`, `?&`, `?|` on `jsonb` (key existence) | GIN `jsonb_ops` |
| `&&` overlap on ranges | GiST |
| `@@` FTS match | GIN on `tsvector` |
| `LIKE 'foo%'` (prefix) | B-tree on `text_pattern_ops` |
| `ILIKE '%foo%'` (substring) | GIN `pg_trgm` |
| `<->` distance (vector) | HNSW or IVFFlat |

## Step 3: Apply modifiers

| Modifier | When |
|---|---|
| **Partial** (`WHERE ...`) | Index only sparse rows; halves size when most rows aren't queried |
| **Covering** (`INCLUDE (...)`) | Enable index-only scans on hot SELECT lists |
| **Expression** (`lower(email)`, `(payload->>'k')`) | Match the form of the predicate exactly |
| **Unique** | Enforce uniqueness; partial uniqueness via `WHERE` |

## Must-have indexes

- [ ] **Every primary key.** (Auto.)
- [ ] **Every foreign key column.** (NOT auto: Postgres does not create these.)
- [ ] **Every column in a frequent `WHERE` clause.**
- [ ] **Every column in a frequent `ORDER BY` (when paired with the WHERE column).**
- [ ] **Every `tsvector` column you query with `@@`.** (GIN)
- [ ] **Every `jsonb` column you query with `@>`.** (GIN `jsonb_path_ops`)

## Avoid

- [ ] Indexing a column that's never filtered.
- [ ] Multi-column index where the leading column rarely appears in the predicate.
- [ ] Redundant index: `(a)` when `(a, b)` exists (the leading-column lookup uses the longer index).
- [ ] `CREATE INDEX` (not `CONCURRENTLY`) on a hot table in production.
- [ ] An invalid index (`indisvalid = false`) left in place after a failed concurrent build.

## Maintenance

- [ ] Reindex on hot tables: `REINDEX INDEX CONCURRENTLY` (PG 12+).
- [ ] Watch for unused indexes: `pg_stat_user_indexes` with `idx_scan = 0` over a quarter.
- [ ] Watch for bloat: `scripts/bloat-check.sql`.
- [ ] Watch for index size growth: `pg_indexes_size('table')`.

---

*Source: `guides/02-indexing.md`, `research/2026-04-25-index-families-decision-tree.md`.*
