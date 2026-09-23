# Guide 1: graph construction and orphan detection

Applies to: `internal-linking-wasp-drone`, wave W5, reading `site-data/`
read-only. Do not crawl. If a page a link references is not already in
`site-data/`, report it as external or uncrawled, do not fetch it, per this
Drone's own frontmatter scope boundary and PRD-011's non-goal.

## 1. Build the graph

1. Confirm `site-data/` exists and contains `<slug>.html` / `<slug>.md`
   pairs written by `site-crawler-wasp-drone`. If it does not exist yet,
   this Drone cannot run; report that dependency gap rather than guessing at
   an empty graph.
2. Run `references/scripts/link-graph.py --site-data <path> --entry-points
   <slugs> [--url-map <path>] --out internal-linking-graph.json`. This is
   the one deterministic step in this pair's procedure; do not hand-derive
   the graph, the BFS depth, the anchor scores, or the equity numbers by
   reading pages one at a time, the script exists specifically so those
   numbers are reproducible and not reconstructed from memory (conduct
   rule 2).
3. Every edge the script extracts carries the full edge record shape in
   `references/templates/edge-record-template.md`: `source_key`,
   `observed_href`, `destination_key`, `label`, `placement`, `nofollow`,
   `artifact_ref`. This is deliberate: collapsing to a bare destination
   count would erase the contextual-vs-template distinction section 3
   below depends on. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
4. If the script reports `edges_uncrawled_or_external_count` greater than
   zero, spot-check a sample of the `uncrawled` ones (the script's
   `--url-map` argument, once `site-crawler-wasp-drone` exposes a real
   path-to-slug map, removes most of this guesswork; until then some
   internal links may be misclassified as uncrawled by the script's
   fallback heuristic, note this explicitly in the report rather than
   treating the script's classification as ground truth).

## 2. Cross-reference against every known-URL source before calling anything an orphan

An orphan page is one with zero internal inbound links, discoverable (if at
all) only via sitemap, external backlink, analytics, or log file, not the
internal crawl. [raw/library-linkbot-com-internal-link-audit.md] [raw/kennytan-net-internal-link-equity-auditor.md] [raw/unveilseo-com-internal-link-audit.md]

1. Take the script's `summary.orphan_pages` list as orphan CANDIDATES, not
   confirmed orphans.
2. Cross-reference each candidate against every other known-URL source
   available to this run: an XML sitemap if the crawl captured one, the
   audited site's own navigation as observed, and any analytics/Search
   Console signal already gathered upstream in the run. A URL present in
   one of those sources but absent from the crawl's internal-link graph is
   still an orphan candidate, not yet a confirmed orphan; a URL absent from
   every source and unreachable by BFS is a stronger finding. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md]
3. Classify each confirmed candidate into one of the five reachability
   states before recommending a fix: source-reachable, render-only,
   sitemap-only, external-only, or unobserved. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
   This Drone reads only `site-data/` (static crawl output), so it generally
   cannot distinguish render-only pages from genuinely unobserved ones
   without a rendering signal from `site-crawler-wasp-drone`; state that
   limitation explicitly in the report rather than picking a state by
   default.
4. Do not reflexively recommend adding a link to every zero-inbound URL.
   Redirect targets, campaign pages, utility endpoints, legal notices, feed
   documents, and intentionally private pages can legitimately have zero
   internal inbound links. The per-candidate decision is one of: keep and
   link, consolidate and redirect, retain with bounded reachability,
   noindex, or remove. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
5. Fix pattern when a real orphan needs linking: add a contextual (main
   body) link from a topically relevant hub, pillar page, or high-traffic
   related article, with descriptive anchor text, not a random footer
   link. [raw/library-linkbot-com-internal-link-audit.md] [raw/kennytan-net-internal-link-equity-auditor.md]

## 3. Dead-ends are a distinct, lower-severity finding

A dead-end page has zero outbound internal links. It still receives equity
and can still rank, it just fails to pass equity forward, which makes it
less severe than an orphan and should not be conflated with one in the
report or the scoring rubric. Prioritize fixing orphans first. [raw/kennytan-net-internal-link-equity-auditor.md]

## 4. Populate section 1 and section 2 of the report template

Write findings into `references/templates/internal-linking-report-template.md`
sections 1 and 2 (`03-seo/internal-linking.md` once copied). Every row
needs its evidence pointer (`site-data/<slug>.html`) and a one-line
justification, per conduct rule 2.
