# Guide 2: click depth via BFS

## 1. Define the entry-point set explicitly, before computing anything

`link-graph.py` requires `--entry-points` and will not silently default to
homepage-only, because doing so is a documented methodology error: category
hubs, section roots, locale roots, authenticated app shells, and
campaign/feed landings can each represent a distinct real user journey, and
assuming homepage-only produces depth numbers that understate how buried a
page actually is from the journey that matters. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

1. Before running the script, decide the entry-point set for this specific
   audited site. At minimum, include the homepage. Add any additional
   section roots or hubs that `02-positioning/` or `content-targets/`
   identify as a primary journey start (cross-reference rather than
   re-deriving; do not duplicate `icp-positioning-wasp-drone`'s taxonomy
   work here).
2. Write the chosen entry-point set and the reasoning behind it into the
   report template's header line ("Entry points used for depth" plus
   "reasoning"). A reader should be able to tell why THESE slugs were
   chosen, not just which ones.

## 2. Run the BFS

1. `link-graph.py`'s `compute_depth` performs a multi-source breadth-first
   search over the crawlable internal-link graph (destination resolved to
   a known `site-data/` slug), starting all entry points at depth 0. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
2. For every page, the script reports both the shortest depth AND the
   count of distinct parent slugs that reach it at that minimum depth
   (`parent_count_at_min_depth`). Report both, not just depth: a page
   reachable in 2 hops through a single soon-to-be-retired article is more
   fragile than a page with several relevant parents at the same depth,
   even though their depth number is identical. Path diversity is an
   architecture-resilience measure, not a ranking metric, present it as
   such. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
3. A page the BFS never reaches from any entry point
   (`reachable_from_entry_points: false`) is a stronger finding than a
   depth outlier: no path exists at all, not merely a long one. List these
   separately in the report, do not fold them into the depth-outlier table.

## 3. Apply the depth-outlier threshold as a heuristic, not a hard rule

1. Default `--depth-threshold` is 3 clicks, the most commonly repeated
   practitioner rule of thumb across sources in this archive for
   "important pages should be within about 3 clicks of the homepage." [raw/library-linkbot-com-internal-link-audit.md] [raw/unveilseo-com-internal-link-audit.md]
2. This is a heuristic, not a documented Google rule; one source attributes
   a related sentiment ("a flatter site structure is easier for us to
   crawl") to John Mueller, quoted secondhand via a vendor blog and not
   independently verified against a primary Google source in this archive.
   State that provenance honestly if citing it, do not upgrade it to an
   official Google position. [raw/unveilseo-com-internal-link-audit.md]
3. Adjust `--depth-threshold` if the site's own scale or navigation
   philosophy makes 3 clicks obviously the wrong bar (e.g. a large
   documentation site), and say so in the report.

## 4. Redirect-chain caveat

`site-data/` (per PRD-007) stores only the final fetched page per slug, not
the redirect chain that led there. `link-graph.py` therefore cannot
distinguish "genuinely deep in the architecture" from "deep because of an
unresolved redirect hop mid-path." [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md]
State this limitation in the report rather than presenting depth numbers as
if redirect-adjusted; flag it as a gap this pair cannot close without
redirect data from `site-crawler-wasp-drone`.

## 5. Populate section 3 of the report template

Write the per-page depth table, the depth-outlier count, and the
unreachable-page list into
`references/templates/internal-linking-report-template.md` section 3.
