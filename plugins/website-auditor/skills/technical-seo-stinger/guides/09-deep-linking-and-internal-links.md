# 09. Deep-linking and internal links (cross-linked, not duplicated)

PRD-008 names "deep-linking analysis" as one of this Stinger's four goals, and explicitly notes it overlaps with prd-011's internal-linking-wasp-drone, which is being built independently in the same Wave-5 dispatch. Both PRDs are unambiguous about the division of labor:

- PRD-008 (this Stinger): "Runs deep-linking analysis, cross-linked with prd-011's internal-linking graph rather than duplicating it," and its Non-Goals confirm this explicitly: "Does not duplicate `seo-aeo-wasp-drone`'s ... scope" and, by the same logic named in the PRD's overview, does not re-derive internal-linking-stinger's own graph methodology.
- PRD-011 (internal-linking-stinger): owns the full internal link-graph build - orphan-page detection with reachability states, click-depth/BFS methodology, anchor-text quality scoring, link-equity distribution - and writes its output to `03-seo/internal-linking.md`, in the same `03-seo/` folder this Stinger writes its own `technical-seo.md` into.

## What this Stinger does own

Signals it observes directly while working through guides 02-06, without building a link graph:

- Orphan-status flags noticed incidentally while checking a page's crawlability (guide 02) - report them, but as a flag, not a full orphan-detection pass.
- Canonical-vs-internal-link mismatches noticed while checking a page's own canonical tag (guide 05) - the specific case where a page's canonical says one URL but the crawl shows internal links using a different (pre-redirect, parameterized, or otherwise non-canonical) form.
- Redirect-chain hops noticed while checking crawlability, when those chains sit on paths reached via internal links.

## What this Stinger does NOT own

- Click-depth / BFS distance-from-homepage computation.
- Anchor-text quality/distribution scoring.
- Link-equity (PageRank-style) flow modelling.
- The full orphan-page reachability-state taxonomy (source-reachable, render-only, sitemap-only, external-only, unobserved).

For all of the above, read and reference `internal-linking-stinger`'s output at `03-seo/internal-linking.md` and its own research archive at `skills/internal-linking-stinger/references/research/distilled-internal-linking.md`. If that file has not been written yet when this Stinger's report is due, note it as a pending cross-reference in the section report rather than fabricating a link-graph finding this Stinger has no grounded methodology to produce.

## Report integration

Section 3 of `references/templates/technical-seo-section-report.md` is the exact spot this cross-reference belongs: a short paragraph plus a pointer to `03-seo/internal-linking.md`, not a re-summary of that file's content in this Stinger's own words (a re-summary risks silently drifting out of sync as internal-linking-stinger's own file gets updated).
