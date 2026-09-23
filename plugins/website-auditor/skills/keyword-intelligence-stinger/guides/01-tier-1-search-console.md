# 01. Tier 1: Google Search Console MCP

Grounded in `references/research/distilled-keyword-intelligence.md` section 1
(`raw/getdadseo-com-blog-export-google-search-console-data-csv-api.md`).

## What "connected and has data" means, concretely

Per PRD-006 AC-1: "Given a Search Console MCP connection exists and returns query data for the
domain, when keyword-intelligence runs, then tier 1 is used." Two conditions, both required:

1. **Connected.** An MCP server exposing Search Console's Search Analytics API is discoverable via
   this Drone's normal MCP tool-discovery mechanism. PRD-006's Open Questions section is explicit
   that "exact MCP tool-discovery mechanism for detecting whether the (not-yet-built) Search
   Console MCP is connected" is unresolved and will be "resolved when that separate project
   exists." Do not block on this; treat "no matching MCP tool discoverable" as equivalent to "not
   connected" whatever the eventual discovery mechanism turns out to be.
2. **Has data.** A connected MCP with no verified-ownership property, or a property whose 16-month
   rolling window returns zero rows, does NOT satisfy this tier. This is the condition that falls
   through to Tier 2, not an error state.

## The constraint to design around: the API's row cap, not the UI's

The GSC dashboard's own CSV export caps at 1,000 rows and gives no signal that more rows exist,
but that cap does not apply to an MCP built on the underlying Search Analytics API, which allows up
to 25,000 rows per request for query/page/country/device breakdowns, or 50,000 rows for less
granular reports, paginated via `startRow`. If a connected MCP's single-call result looks
suspiciously capped at exactly 1,000, treat that as a UI-export-shaped integration, not a true
API-shaped one, and check whether pagination is available before treating the pull as complete.

## Known data-quality caveats to carry into the output, not silently smooth over

- **16-month rolling window.** GSC (dashboard and Search Analytics API both) only exposes the
  trailing 16 months. A site's older historical query data is not visible through this tier at all
  unless a Bulk Data Export to BigQuery has separately been running (a forward-only stream, it does
  not backfill).
- **Anonymized queries are excluded from the row-level results but still counted in impression
  totals**, typically 30-50% of impressions, described in the archive as "often the most
  informative" (the long tail). This is why a Tier-1 pull will never exactly match the GSC
  dashboard's own totals, and why Tier-1 output should not claim to represent literally every
  query the domain ranks for.
- **Auth is OAuth, per-property**, not an API key. A property with unverified ownership cannot
  return data regardless of whether the MCP itself is reachable; this is a "has data" failure, not
  a connectivity failure, and both should fall through to Tier 2 identically.

## What to record when this tier is used

Every keyword/question sourced from this tier is tagged `search-console` in
`content-targets/keywords.md` / `content-targets/questions.md` (see
`references/templates/keywords-template.md`), with its real click/impression-derived volume
carried forward, never marked `volume-unknown` (Tier 1 data is real search-volume data by
definition).
