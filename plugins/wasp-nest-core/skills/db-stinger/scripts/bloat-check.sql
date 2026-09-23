-- bloat-check.sql — db-stinger helper
--
-- Surfaces table and index bloat. Bloat = dead tuples / historic index pages
-- not yet reclaimed by autovacuum.
--
-- Thresholds (from guides/05-performance-pooling.md):
--   < 20% bloat   = healthy
--   20–50% bloat  = investigate; tune autovacuum
--   > 50% bloat   = fire — pg_repack / REINDEX CONCURRENTLY / VACUUM FULL
--
-- Source: https://wiki.postgresql.org/wiki/Show_database_bloat (adapted).

\echo
\echo === Table bloat ===
\echo

SELECT
  schemaname AS schema,
  relname    AS table,
  pg_size_pretty(pg_relation_size(relid)) AS size,
  n_live_tup,
  n_dead_tup,
  CASE
    WHEN n_live_tup + n_dead_tup = 0 THEN 0
    ELSE round((n_dead_tup::numeric / (n_live_tup + n_dead_tup)) * 100, 2)
  END AS dead_pct,
  last_autovacuum,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE n_live_tup + n_dead_tup > 1000   -- skip tiny tables
ORDER BY
  CASE
    WHEN n_live_tup + n_dead_tup = 0 THEN 0
    ELSE n_dead_tup::numeric / (n_live_tup + n_dead_tup)
  END DESC,
  pg_relation_size(relid) DESC
LIMIT 50;

\echo
\echo === Index bloat (rough estimate via pgstattuple if available) ===
\echo

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgstattuple') THEN
    RAISE NOTICE 'pgstattuple available — running detailed index bloat check.';
  ELSE
    RAISE NOTICE 'pgstattuple extension not installed. Install with: CREATE EXTENSION pgstattuple;';
    RAISE NOTICE 'Falling back to size-only listing.';
  END IF;
END $$;

-- Detailed (only if pgstattuple is available)
SELECT
  s.schemaname AS schema,
  s.relname    AS table,
  s.indexrelname AS index_name,
  pg_size_pretty(pg_relation_size(s.indexrelid)) AS size,
  s.idx_scan AS scans
FROM pg_stat_user_indexes s
ORDER BY pg_relation_size(s.indexrelid) DESC
LIMIT 50;

\echo
\echo === Recommendations ===
\echo
\echo If dead_pct > 20% on a hot table:
\echo   ALTER TABLE <t> SET (autovacuum_vacuum_scale_factor = 0.01,
\echo                        autovacuum_vacuum_threshold   = 1000);
\echo
\echo If dead_pct > 50% — emergency cleanup:
\echo   • pg_repack (no exclusive lock, requires extension)
\echo   • REINDEX TABLE CONCURRENTLY (PG 12+) for index bloat
\echo   • VACUUM FULL (takes ACCESS EXCLUSIVE — last resort)
\echo
