# Index Families: Decision Tree

**Sources:**
- https://www.postgresql.org/docs/current/indexes.html
- https://www.postgresql.org/docs/current/indexes-types.html
- https://www.postgresql.org/docs/current/indexes-partial.html
- https://www.postgresql.org/docs/current/indexes-index-only-scans.html
- https://www.tigerdata.com/learn/postgresql-performance-tuning-designing-and-implementing-database-schema
- https://www.instaclustr.com/education/postgresql/top-10-postgresql-best-practices-for-2025/

**Retrieved:** 2026-04-25

## Summary

Postgres ships seven index access methods. Choosing wrong is one of the top three causes of "we need a bigger database": almost always the answer is "you need the right index, not a bigger box".

## The decision tree

Ask, in order:

1. **What is the column type?** That eliminates most options immediately.
2. **What is the predicate shape?** Equality, range, containment, full-text, similarity.
3. **What is the data distribution?** Skewed, sparse, append-only, random.
4. **What is the read/write ratio?** GIN is slow to write; BRIN is tiny to write.

| Index type | Best for | Bad for |
|---|---|---|
| **B-tree** (default) | Equality + range on scalar columns; sorting; PK; FK; status filters | Containment, FTS, geometry |
| **GIN** | `jsonb`, arrays, FTS (`tsvector`), `pg_trgm` similarity | High write throughput (writes are expensive) |
| **GiST** | Range types, geometry, exclusion constraints, FTS | Equality on plain scalars (B-tree wins) |
| **BRIN** | Very large tables where physical order ≈ logical order (time-series, append-only) | Random-access updates; small tables |
| **Hash** | Equality only on simple types (rare; B-tree usually equivalent) | Range queries |
| **SP-GiST** | Specialized partition / quad-tree shapes | General use |
| **Bloom** | Many low-selectivity predicates AND-ed together (data warehousing) | Single-predicate filters |

## Index modifiers (compose with the above)

- **Partial**: `WHERE status = 'active'`: index only the rows you query. Halves index size when most rows are not interesting.
- **Covering** (`INCLUDE`): append non-key columns to enable index-only scans. Massive read speedup; writes pay for the extra columns.
- **Expression**: `lower(email)`, `(payload->>'tenant_id')`: index a derived value. Required for case-insensitive searches and `jsonb` field shortcuts.
- **Unique**: enforce uniqueness; `UNIQUE INDEX ... WHERE ...` for partial uniqueness.

## FK indexes: the must-fix

Postgres does **not** auto-create indexes on foreign keys. Every FK that participates in a join, an `ON DELETE`, or an `ON UPDATE` needs a B-tree index. The first hot join under load tips a missing one.

`scripts/audit-missing-indexes.sql` finds these.

## `pgvector` indexes (special-purpose)

- `ivfflat`: partition-based; faster build, slower query at scale; tune `lists` parameter.
- `hnsw`: graph-based; slower build, faster query; tune `m` and `ef_construction`. **2026 default for most workloads** because build is now reasonable on `pgvector` 0.8+.

Hand off to `mind-worker-bee` for retrieval strategy; `db-worker-bee` picks the index family and the column shape.

## Relevance to this stinger

Spine of `guides/02-indexing.md` and `templates/indexes-decision-tree.md`. Drives the "every FK gets an index" hard rule.
