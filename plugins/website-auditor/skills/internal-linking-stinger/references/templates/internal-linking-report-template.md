# Internal linking report template

Copy this into `03-seo/internal-linking.md` for the run and fill in every
`{placeholder}`. Section order and headings are fixed so `audit-scoring-wasp-drone`
can find each checkpoint by heading text. Every score row needs its three
mandatory fields per the conduct rules: numeric value, evidence pointer,
one-line justification. Findings below `N/A` are excluded from scoring per
the build plan's zero-to-six scale.

Run this report's numbers through `references/scripts/link-graph.py` first;
this template's tables mirror that script's JSON output field for field so
population is mechanical, not another judgment pass.

---

# Internal Linking

**Run:** {engagement_ref}
**Pages analyzed:** {page_count} (from `site-data/`, {html_file_count} `.html` files)
**Entry points used for depth (BFS):** {entry_points_csv}
**Generated:** {run_timestamp_iso8601}
**Script params:** damping {damping_factor}, {iterations_run} iterations run, depth threshold {depth_threshold} clicks

Per distilled section 3, the entry-point set above was chosen deliberately
(not homepage-only) to reflect the site's real navigation roots. State the
reasoning here: {entry_point_choice_reasoning}.

## 1. Orphan pages

A page with zero internal inbound links, per distilled section 2. Every row
here is an orphan CANDIDATE, not an automatic defect; classify each per the
reachability states below before recommending a fix. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

| Slug | Reachability state | In sitemap? | Recommended action | Evidence |
|---|---|---|---|---|
| {slug} | {source-reachable / render-only / sitemap-only / external-only / unobserved} | {yes/no} | {keep-and-link / consolidate-and-redirect / retain-bounded / noindex / remove} | `site-data/{slug}.html` |

**Orphan count:** {orphan_count} of {page_count} pages ({orphan_pct}%).

Crawl-budget context (cited, single-source, see distilled section 2): orphan
pages have been found to consume an average of 26% of crawl budget in one
vendor's data, with extreme cases reaching 70%. [raw/unveilseo-com-internal-link-audit.md]

## 2. Dead-end pages

A page with zero outbound internal links. Distinct from and less severe than
an orphan: a dead-end still receives equity and can still rank, it just does
not pass equity forward. [raw/kennytan-net-internal-link-equity-auditor.md]

| Slug | Outbound count | Note |
|---|---|---|
| {slug} | 0 | {intentional (e.g. legal/utility page) or fix candidate} |

**Dead-end count:** {dead_end_count} of {page_count} pages.

## 3. Click depth (BFS from entry points)

Depth is hops from the nearest entry point, computed via breadth-first
search over the crawlable graph. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
Path diversity (distinct parents at minimum depth) is reported alongside
depth because a page reachable through a single fragile path is a
different finding than one with several relevant parents at the same depth. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

| Slug | Depth | Parents at min depth | Depth outlier (> {depth_threshold})? | Evidence |
|---|---|---|---|---|
| {slug} | {depth} | {parent_count} | {yes/no} | `site-data/{slug}.html` |

**Depth-outlier count:** {depth_outlier_count} pages beyond {depth_threshold} clicks. The
3-click threshold is a commonly repeated practitioner heuristic, not a
documented Google rule; treat it as a flag for review, not a hard failure
on its own. [raw/library-linkbot-com-internal-link-audit.md] [raw/unveilseo-com-internal-link-audit.md]

**Unreachable from every entry point:** {unreachable_count} pages. These are
worse than depth outliers: no BFS path exists at all from the defined entry
set, which is a stronger signal than "deep."

## 4. Anchor-text quality

Scored per destination page across four dimensions per distilled section 4:
generic ratio, diversity (unique anchor strings), topical relevance (word
overlap with the destination's own title/H1), and length. [raw/unveilseo-com-internal-link-audit.md]
Reported twice per page: across all inbound anchors, and contextual-only
(main-content links, excluding nav/header/footer/aside boilerplate), since
template links are present everywhere by construction and reveal nothing
about relative importance. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md]

| Slug | Composite (all inbound) | Composite (contextual only) | Generic ratio | Unique anchors | Topical overlap | Flags |
|---|---|---|---|---|---|---|
| {slug} | {score}/100 | {score}/100 | {pct} | {count} | {pct} | {flag list} |

The composite formula and its weights are this Stinger's own construction
(distilled section 4 confirms a 0-100 composite is a reasonable approach
but does not disclose a specific vendor's weights); see
`references/scripts/link-graph.py`'s docstring for the exact weights and
that caveat stated again in the script itself.

**Caveat on the numeric flags** (30% generic, fewer than 3 unique anchors):
single-vendor thresholds, not independently corroborated in this archive.
Use as a starting heuristic. [raw/unveilseo-com-internal-link-audit.md]

## 5. Anchor-text cannibalization

The identical anchor text pointing at 2+ distinct destination URLs, which
sends conflicting ranking signals about which page the phrase should rank
for. [raw/unveilseo-com-internal-link-audit.md] Navigational/boilerplate
anchors (Home, Contact, etc.) are excluded from this table since their
reuse across many destinations is expected, not cannibalization.

| Anchor text | Destinations | Recommended resolution |
|---|---|---|
| "{anchor text}" | {slug-a, slug-b} | {pick one canonical target, differentiate the other anchor's phrasing, or merge the pages} |

**Cannibalized anchor count:** {cannibalization_count}.

## 6. Internal-PageRank-style link-equity flow `[structural proxy, not a Google score]`

Computed via classic power-iteration PageRank (damping {damping_factor},
dangling-node mass redistributed each iteration) over the equity graph,
which excludes `rel="nofollow"` internal links. [raw/kennytan-net-internal-link-equity-auditor.md]

**Explicit boundary** (state this every time this section is used, per
distilled section 5): this proxy excludes external backlink equity,
link-context quality (position/anchor relevance), and historical flow over
time, and it does not replicate Google's actual post-PageRank ranking
layers. Treat it as a structural-health signal, not a rank predictor. [raw/kennytan-net-internal-link-equity-auditor.md]

| Slug | Equity score | Equity share | Percentile | Classification | Evidence |
|---|---|---|---|---|---|
| {slug} | {score} | {pct}% | {percentile} | {HEALTHY/MODERATE/UNDER-SERVED/ORPHAN/DEAD-END/OVER-LINKED} | `link-graph.py` run {run_timestamp_iso8601} |

**Distribution shape:** Gini coefficient {gini} ({flat / healthy hub-and-spoke /
over-concentrated}, per distilled section 5's single-vendor scale). [raw/kennytan-net-internal-link-equity-auditor.md]

**Under-served priority pages** (important per ICP/keyword strategy but
structurally starved of equity): {list, cross-referencing content-targets/
and 02-positioning/ for "important per strategy"}.

**Over-linked pages** (likely boilerplate/footer over-exposure): {list}.

## 7. Nofollow on internal links

Internal `rel="nofollow"` is almost always unintentional (CMS default,
template error, plugin side effect) rather than a deliberate signal, and
was excluded from the equity computation in section 6 above. [raw/unveilseo-com-internal-link-audit.md]

| Slug (source) | Destination | Anchor text | Likely intentional? |
|---|---|---|---|
| {slug} | {slug} | "{anchor text}" | {yes/no, with reasoning} |

## 8. Findings register rows (for `scoring/findings-register.csv`)

One row per checkpoint this sub-audit owns, each with the mandatory
numeric value (0-6), evidence pointer, and one-line justification.

| Checkpoint | Score | Evidence | Justification |
|---|---|---|---|
| Orphan pages | {0-6} | section 1 above | {one line} |
| Click depth | {0-6} | section 3 above | {one line} |
| Anchor-text quality | {0-6} | section 4 above | {one line} |
| Link-equity distribution `[subjective interpretation of a structural proxy]` | {0-6} | section 6 above | {one line} |

## 9. Rejected or reframed candidates

Per conduct rule 4, any candidate finding that failed verification is
logged here with the reason, not silently dropped.

| Candidate | Reason rejected/reframed |
|---|---|
| {finding} | {reason} |
