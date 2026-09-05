-- audit-missing-indexes.sql — db-stinger helper
--
-- Three audits in one file:
--   1. Foreign keys without an index on the FK column(s).         (must-fix)
--   2. Redundant indexes — (a) is redundant when (a, b) exists.   (should-refactor)
--   3. Apparently-unused indexes — `idx_scan = 0` since stats reset. (should-refactor)
--
-- Run as a superuser or a role with read access to pg_catalog and pg_stat_*.
--
-- Source: guides/02-indexing.md, research/2026-04-25-index-families-decision-tree.md.

\echo
\echo === 1. Foreign keys without a covering index (MUST-FIX) ===
\echo

WITH fkeys AS (
  SELECT
    c.conname           AS constraint_name,
    n.nspname           AS schema,
    rel.relname         AS table,
    c.conrelid          AS tableoid,
    c.conkey            AS fkey_columns
  FROM pg_constraint c
  JOIN pg_class rel ON rel.oid = c.conrelid
  JOIN pg_namespace n ON n.oid = rel.relnamespace
  WHERE c.contype = 'f'
    AND n.nspname NOT IN ('pg_catalog', 'information_schema')
),
fkey_cols AS (
  SELECT
    f.constraint_name,
    f.schema,
    f.table,
    f.tableoid,
    f.fkey_columns,
    array_agg(att.attname ORDER BY array_position(f.fkey_columns, att.attnum)) AS column_names
  FROM fkeys f
  JOIN pg_attribute att ON att.attrelid = f.tableoid AND att.attnum = ANY(f.fkey_columns)
  GROUP BY 1, 2, 3, 4, 5
),
indexed AS (
  SELECT DISTINCT
    i.indrelid AS tableoid,
    (string_to_array(pg_get_indexdef(i.indexrelid), ' '))[1] AS junk,
    i.indkey AS index_columns
  FROM pg_index i
)
SELECT
  fc.schema,
  fc.table,
  fc.constraint_name,
  array_to_string(fc.column_names, ', ') AS fk_columns
FROM fkey_cols fc
WHERE NOT EXISTS (
  SELECT 1
  FROM pg_index i
  WHERE i.indrelid = fc.tableoid
    AND (i.indkey::int[])[0:array_length(fc.fkey_columns, 1)-1] = fc.fkey_columns::int[]
)
ORDER BY fc.schema, fc.table, fc.constraint_name;

\echo
\echo === 2. Redundant indexes (SHOULD-REFACTOR) ===
\echo

WITH idx AS (
  SELECT
    n.nspname AS schema,
    t.relname AS table,
    i.relname AS index_name,
    string_to_array(replace(pg_get_indexdef(ix.indexrelid), '  ', ' '), ' ') AS def_parts,
    ix.indkey::text AS key
  FROM pg_index ix
  JOIN pg_class i ON i.oid = ix.indexrelid
  JOIN pg_class t ON t.oid = ix.indrelid
  JOIN pg_namespace n ON n.oid = i.relnamespace
  WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')
)
SELECT
  a.schema, a.table, a.index_name AS redundant_to, b.index_name AS covered_by_index
FROM idx a
JOIN idx b
  ON a.schema = b.schema
 AND a.table  = b.table
 AND a.index_name <> b.index_name
 AND b.key LIKE a.key || ' %'   -- a's key is a prefix of b's
ORDER BY a.schema, a.table, a.index_name;

\echo
\echo === 3. Unused indexes since last stats reset (SHOULD-REFACTOR) ===
\echo

SELECT
  s.schemaname AS schema,
  s.relname    AS table,
  s.indexrelname AS index_name,
  s.idx_scan   AS scans,
  pg_size_pretty(pg_relation_size(s.indexrelid)) AS size
FROM pg_stat_user_indexes s
JOIN pg_index i ON i.indexrelid = s.indexrelid
WHERE s.idx_scan = 0
  AND NOT i.indisunique          -- skip unique indexes (constraint enforcement)
  AND NOT i.indisprimary         -- skip primary keys
ORDER BY pg_relation_size(s.indexrelid) DESC;

\echo
\echo Note: idx_scan = 0 since the last `pg_stat_reset()`. Confirm stats window covers
\echo at least a full quarter before dropping any index based on this signal.
\echo
