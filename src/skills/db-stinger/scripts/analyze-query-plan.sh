#!/usr/bin/env bash
# analyze-query-plan.sh — db-stinger helper
#
# Wraps `EXPLAIN (ANALYZE, BUFFERS)` with a reading checklist.
#
# Usage:
#   ./analyze-query-plan.sh "<sql query>"
#
# Or pipe a query in:
#   cat query.sql | ./analyze-query-plan.sh -
#
# Reads connection from $DATABASE_URL or flags. Defaults to local socket.
#
# Output: the plan + a checklist of red flags to inspect.
#
# Source: guides/05-performance-pooling.md.

set -euo pipefail

DB_URL="${DATABASE_URL:-postgres://localhost:5432/postgres}"
QUERY=""

if [[ "${1:-}" == "-" ]]; then
  QUERY="$(cat)"
elif [[ -n "${1:-}" ]]; then
  QUERY="$1"
else
  echo "Usage: $0 \"<sql query>\"" >&2
  echo "       cat query.sql | $0 -" >&2
  exit 1
fi

echo "=== Query ==="
echo "$QUERY"
echo
echo "=== EXPLAIN (ANALYZE, BUFFERS) ==="
psql "$DB_URL" -c "EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT) $QUERY"

cat <<'EOF'

=== Reading checklist ===

[ ] Headline node. Top of the tree. Is it Seq Scan, Index Scan, Index Only Scan, Bitmap Heap Scan?

[ ] Rows estimated vs. actual. If off by 10x at any node, statistics are stale or the planner
    is missing context. Run ANALYZE on the affected table.

[ ] Buffer hits and reads. shared hit = cache, shared read = disk. Lots of read on a hot
    query means working set doesn't fit memory or effective_cache_size is wrong.

[ ] Loop counts on Nested Loop nodes. loops=N where N is large = the classic N+1 plan.

[ ] Sort method. external sort = work_mem too small or query is over-sorting.

[ ] Index Scan vs Index Only Scan. If the column is in the SELECT list, an Index Only Scan
    is faster — add an INCLUDE clause to the index to enable it.

[ ] Was the index you expected actually used? If not — wrong column order, wrong type, or
    the planner thinks Seq Scan is cheaper because of skewed statistics.

=== Common diagnoses ===

Seq Scan on >10k rows for a selective predicate     →  Missing or unused index
Estimated rows off by 10x                           →  Stale statistics; ANALYZE
Nested Loop with loops=1000+                        →  Implicit N+1; rewrite as join
external sort ... Disk: 50000kB                     →  work_mem too small
High shared read on a frequent query                →  Working set > memory
Index Scan instead of Index Only Scan               →  Add INCLUDE to the index

EOF
