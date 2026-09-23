# Guide 4: internal-PageRank-style link-equity flow

## 1. What the script computes

`link-graph.py`'s `compute_pagerank` runs the classic Brin/Page power
iteration: initialize every page's rank at 1/N, then iteratively update
`PR(p) = (1-d)/N + d * sum(PR(q)/out_degree(q))` for every page q linking to
p, using damping factor d (Google's original published value, 0.85, the
script's default). [raw/kennytan-net-internal-link-equity-auditor.md]

1. Graphs under roughly 10,000 nodes typically stabilize in 20-30
   iterations; the script's default `--max-iterations 30` reflects that,
   with an early stop once the iteration's total delta drops below
   `--tolerance`. [raw/kennytan-net-internal-link-equity-auditor.md]
2. Dangling nodes (pages with zero outbound internal links, i.e. the same
   pages flagged as dead-ends in guide 1) accumulate equity but never
   redistribute it if handled naively, distorting convergence. The script
   redistributes each iteration's dangling mass uniformly across all
   nodes, per the cited correct-implementation rule. [raw/kennytan-net-internal-link-equity-auditor.md]
3. `rel="nofollow"` internal links are excluded from the equity graph
   entirely before computing anything, because they do not pass equity in
   this model, and internal nofollow is almost always unintentional (CMS
   default, template error, plugin side effect) rather than deliberate. [raw/kennytan-net-internal-link-equity-auditor.md] [raw/unveilseo-com-internal-link-audit.md]
   Report every nofollow'd internal edge in section 7 of the report
   template and flag whether it looks intentional.

## 2. Classify every page

Apply the cited single-vendor classification scale, in this priority order
(the script implements the same order): [raw/kennytan-net-internal-link-equity-auditor.md]

1. **ORPHAN**: 0 inbound (same finding as guide 1, restated here in equity
   terms).
2. **OVER-LINKED**: greater than 5% of total site equity, or 150+ inbound
   links. Usually boilerplate/footer over-exposure.
3. **HEALTHY**: top 20% of pages by equity, 20+ inbound internal links.
   Equity flows here by design.
4. **MODERATE**: 40th-80th percentile, 8-20 inbound links. Underweight but
   indexed/ranking.
5. **UNDER-SERVED**: bottom 20% / equity-starved, fewer than 8 inbound
   links, but important per strategy, structurally orphaned in effect even
   if technically reachable.

DEAD-END (0 outbound) is reported as its own field alongside the equity
classification, not as a substitute for it, since a page can be both, say,
MODERATE and a dead-end simultaneously.

## 3. Distribution shape as a health signal

Compute the Gini coefficient of the equity distribution across all pages
(the script's `gini_coefficient`). A healthy hub-and-spoke site concentrates
roughly 40-70% of total equity in its top 20% of pages, corresponding to a
Gini coefficient roughly 0.40-0.65 in this vendor's framing. A flat
distribution (Gini under about 0.3) signals no discernible hub structure.
An over-concentrated distribution (Gini over about 0.75) means hubs rank
but spoke pages never receive enough equity to compete. [raw/kennytan-net-internal-link-equity-auditor.md]
The script labels the 0.30-0.40 and 0.65-0.75 bands "transitional," since
the cited source does not define those gaps precisely; report them as
such rather than forcing them into the healthy or unhealthy bucket.

## 4. State the boundary every time this section is used

This computation does NOT measure, and the report must say so explicitly
each time section 6 of the report template is populated: [raw/kennytan-net-internal-link-equity-auditor.md] [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

1. External link equity (backlinks from other domains); excluded entirely.
2. Link-context quality (anchor relevance, header vs. footer position);
   topology-blind by construction. Cross-reference guide 3's anchor
   scoring for that dimension instead.
3. Historical equity flow over time; this is a single-graph snapshot, not
   a longitudinal measure.
4. Google's actual post-PageRank ranking layers (topical authority,
   E-E-A-T, query-specific adjustments); a computed internal-graph proxy
   does not replicate these.

Despite being a proxy, the recursive insight (a link's value depends on the
linker's own value) is not Google's disclosed live ranking formula but
remains the underlying logic behind successor signals Google is understood
to use; a site fully controls its internal graph even though it cannot
control external backlinks, which makes internal-link engineering the
highest-leverage link lever available to most sites. This is the honest
framing for WHY this section still matters despite its limits, not a claim
that the score itself is a ranking signal. [raw/kennytan-net-internal-link-equity-auditor.md]

## 5. Populate section 6 of the report template

Write the per-page equity table, the Gini coefficient and distribution
shape, the under-served-priority-page list, and the over-linked-page list
into `references/templates/internal-linking-report-template.md` section 6,
with the explicit boundary statement from step 4 above included verbatim
or paraphrased faithfully, not omitted for brevity.
