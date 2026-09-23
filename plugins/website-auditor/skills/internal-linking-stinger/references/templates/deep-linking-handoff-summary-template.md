# Deep-linking handoff summary template

PRD-011 (this pair) and PRD-008 (`technical-seo-wasp-drone`) both touch
deep-linking. Per PRD-011's Goals, this Drone "feeds a summary back for
prd-008's deep-linking sub-check rather than duplicating the full graph
analysis there." Copy this short block into `03-seo/internal-linking.md`'s
top (or a shared handoff location the run ledger points at) so
technical-seo-wasp-drone can cite it instead of re-deriving a link graph.

Do not duplicate the full report here. This is a summary, not a re-export.

---

## Deep-linking summary, for technical-seo-wasp-drone

**Source:** `03-seo/internal-linking.md` (full internal-linking-wasp-drone
report), computed via `link-graph.py` on {run_timestamp_iso8601}.

| Metric | Value |
|---|---|
| Pages analyzed | {page_count} |
| Orphan pages (0 inbound) | {orphan_count} |
| Pages beyond {depth_threshold}-click depth threshold | {depth_outlier_count} |
| Pages unreachable from every defined entry point | {unreachable_count} |
| Anchor-text cannibalization instances | {cannibalization_count} |
| Link-equity distribution shape | {flat / healthy hub-and-spoke / over-concentrated} (Gini {gini}) |

**Top 5 deepest reachable pages:** {slug (depth), ...}

**Top 5 most under-served pages by inbound link count that also carry
keyword targets** (cross-referenced against `content-targets/keywords.md`
if available): {slug (inbound count), ...}

Full detail, per-page rows, and the anchor-quality/equity tables are in
`03-seo/internal-linking.md`. Do not re-run `link-graph.py`;
technical-seo-wasp-drone should read this summary and the full report
rather than recomputing the graph, per the shared-workspace contract's
write-once/read-many rule.
