# Distilled internal linking research

Dense reference distilled from `raw/`. Every claim below cites its source file in brackets. Organized for internal-linking-worker-bee's job: crawling a site's internal link graph and scoring orphan pages, click depth, anchor-text quality, and link-equity distribution.

Research window: round 1/2 single sweep, 2026-08-18. Round 3 deeper research pass added four new sources specifically targeting internal link-graph mechanics, 2026-08-18.

## 0. Gap-closure note (read this first)

The round 1/2 archive contained only two sources (Google Search Central's changelog and a Semrush recap of a Google generative-AI guide), and a full-text search of both found zero occurrences of the word "link." That gap is now closed. Four new sources were fetched in round 3 specifically for link-graph mechanics: a graph-theory-first methodology piece, a practitioner audit checklist/template, a PageRank-mechanics explainer with concrete diagnostic thresholds, and a piece specifically on anchor-text/link-signal quality versus link-plumbing. Together they give this Stinger real, citable coverage of orphan-page detection, click-depth methodology, anchor-text scoring, and internal-PageRank-style link equity flow. The two original sources remain in the archive and are cited only where they are genuinely relevant (canonicalization/site-move edge cases that intersect with link audits); they are not stretched to cover link-graph topics they do not address. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md] [raw/kennytan-net-internal-link-equity-auditor.md] [raw/unveilseo-com-internal-link-audit.md] [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

## 1. Source authority in this archive

| Source | Type | What it covers | Authority note |
|---|---|---|---|
| sulayman-bowles.dev, "Internal Linking as a Directed Retrieval Graph" | Community/practitioner research blog | Graph-theoretic methodology: edge schema, reachability states, orphan diagnosis, metric misuse warnings | Most rigorous and most epistemically careful source in this archive; explicitly states its own evidence boundary (graph metrics are not proprietary ranking weights) rather than overclaiming |
| library.linkbot.com, "Internal Link Audit: How to Find & Fix Issues" | Vendor blog (linked to an internal-linking SaaS tool) | Practical, step-by-step audit checklist with a reusable issue/detection/fix template | Practitioner-grade, but promotes its own tool; treat specific numeric thresholds as rules of thumb, not disclosed algorithm behavior |
| kennytan.net, "Internal Link Equity Auditor" | Vendor/community tool page | PageRank-style internal-equity computation mechanics: damping factor, iteration convergence, dangling-node handling, equity-distribution thresholds | Gives the most complete worked mechanics of internal PageRank of any source here; explicitly flags what its own computed score does NOT represent (Google's real ranking signal) |
| unveilseo.com, "How to Audit Internal Links for Signal, Not Plumbing" | Vendor blog (linked to an anchor-audit SaaS tool) | Anchor-text quality scoring dimensions, dead-end/authority-pooling detection, anchor cannibalization | Most detailed anchor-quality rubric in this archive; cites a third-party stat (Botify orphan-crawl-budget research) attributed by name |
| Google Search Central "What's new" changelog | Official docs (Google) | Canonicalization and site-move mechanics tangential to link audits | Only relevant where explicitly noted below; does not cover link-graph topics directly |
| Semrush blog on Google's generative AI search guide | Vendor blog | Google's stance on not requiring llms.txt/content-chunking | Not about internal linking; retained only for the one general-audit caveat below |

Where sources disagree or make claims about Google's actual algorithm (as opposed to a computed proxy), that is flagged explicitly in the relevant section rather than presented as confirmed Google behavior. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/kennytan-net-internal-link-equity-auditor.md]

## 2. Orphan page detection

| Concept | Definition / method | Source |
|---|---|---|
| Orphan page | A page with zero internal inbound links; discoverable (if at all) only via sitemap, external backlink, analytics, or log file, not via the internal crawl | [raw/library-linkbot-com-internal-link-audit.md] [raw/kennytan-net-internal-link-equity-auditor.md] [raw/unveilseo-com-internal-link-audit.md] |
| Detection method | Compare the crawled link graph (nodes reached via crawlable anchors) against every other known-URL source: XML sitemap, CMS export, analytics, Search Console, backlink data, and server logs; a URL present in any of those but absent from the crawl is an orphan candidate, not an automatic orphan | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md] |
| Orphan candidate is not automatically wrong | Redirect targets, campaign pages, utility endpoints, legal notices, feed documents, and intentionally private pages may legitimately have zero internal inbound links; the decision per candidate is one of: keep and link, consolidate and redirect, retain with bounded reachability, noindex, or remove. Do not reflexively add a link to every zero-inlink URL | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Reachability states (finer-grained than binary orphan/not-orphan) | source-reachable (path exists in raw server-delivered HTML), render-only (path appears only after JavaScript execution), sitemap-only (nominated in sitemap but no internal path), external-only (known inbound reference but no internal path), unobserved (no captured path or nomination at all) | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Orphan vs. dead-end asymmetry | Orphans (0 inbound) are worse than dead-ends (0 outbound): orphans are undiscoverable via internal crawl and get no equity in; dead-ends still receive equity and can still rank, they just fail to pass equity forward. Remediation priority should fix orphans first | [raw/kennytan-net-internal-link-equity-auditor.md] |
| Orphan crawl-budget cost (cited stat) | Botify research, as cited by Unveil SEO, found orphan pages consume 26% of crawl budget on average, with extreme cases reaching 70% | [raw/unveilseo-com-internal-link-audit.md] |
| Fix pattern | Add a contextual (body-text) link from a topically relevant hub, pillar page, or high-traffic related article, using descriptive anchor text; not a random footer link | [raw/library-linkbot-com-internal-link-audit.md] [raw/kennytan-net-internal-link-equity-auditor.md] |

## 3. Click-depth (crawl depth) methodology

| Concept | Detail | Source |
|---|---|---|
| Definition | Depth is the number of hops (clicks) from a defined entry point to a target page, computed via breadth-first search over the crawlable internal-link graph after resolving known redirects | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Entry-point set is not just the homepage | Category hubs, section roots, locale roots, authenticated app shells, and campaign/feed landings can each represent a distinct user journey; the entry set should be defined explicitly before computing depth, rather than assuming homepage-only | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Report more than shortest path | Report shortest depth AND count of independent parent sources; a page reachable in 2 hops through a single soon-to-be-retired article is more fragile than a page with several relevant parents even at the same depth. Path diversity is an architecture-resilience measure, not a ranking metric | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Source graph vs. rendered graph | Keep them separate when client-side JavaScript adds navigation; a page reachable only after script execution is "render-only," a different finding than genuinely orphaned | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Common depth threshold cited across sources | "Within about 3 clicks of the homepage" for important pages is the most commonly repeated rule of thumb across practitioner sources; treat as a heuristic, not a hard Google-documented rule | [raw/library-linkbot-com-internal-link-audit.md] [raw/unveilseo-com-internal-link-audit.md] |
| Depth-outlier flag | Pages requiring more than 3 clicks are commonly flagged as "buried too deep" and treated as lower crawl priority in practitioner audits; a commonly cited attribution is John Mueller stating "a flatter site structure is easier for us to crawl" (quoted secondhand via a vendor blog, not independently verified against a primary Google source in this archive) | [raw/unveilseo-com-internal-link-audit.md] |
| Redirect-chain interaction with depth | Redirect hops inside a path to a page count against effective reachability; audits should resolve chains to a single hop and flag chains discovered during depth calculation separately from genuine architectural depth | [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md] |

## 4. Anchor-text quality and distribution scoring

| Dimension | What to check | Red flag / threshold | Source |
|---|---|---|---|
| Generic ratio | Share of anchors that are "click here," "read more," "learn more" and similar non-descriptive phrases | Greater than 30% generic anchors on a page's inbound set | [raw/unveilseo-com-internal-link-audit.md] |
| Diversity | Number of unique anchor-text strings pointing at a given important page | Fewer than 3 unique anchors pointing to an important page | [raw/unveilseo-com-internal-link-audit.md] |
| Topical relevance | Whether the anchor text shares vocabulary with the destination page's topic | Zero word overlap between anchor and target-page topic | [raw/unveilseo-com-internal-link-audit.md] |
| Length | Word count of the anchor text | Mostly 1-word or empty (e.g., image-link-with-no-alt-text) anchors | [raw/unveilseo-com-internal-link-audit.md] |
| Anchor text cannibalization | The identical exact-match anchor text pointing at two or more distinct destination URLs, sending Google conflicting signals about which page the phrase should rank for | Detect by exporting all internal links, grouping by anchor text, and flagging any anchor with 2+ distinct destinations | [raw/unveilseo-com-internal-link-audit.md] |
| Over-optimization / exact-match repetition | Repeating the identical exact-match keyword anchor across many links to the same URL reads as manipulated rather than natural, and can trigger the same concern Google's anchor-spam detection is tuned for | Practitioner rule of thumb: vary anchor text (primary keyword sometimes, synonym sometimes, longer descriptive phrase sometimes, branded/navigational anchors for a meaningful share); no single disclosed numeric Google threshold exists in this archive | [raw/library-linkbot-com-internal-link-audit.md] |
| Why surrounding context matters | Google is described (secondhand, vendor framing) as reading a window of surrounding text around a link, not just the anchor string itself, to determine what signal a link carries; an empty or generic anchor embedded in a generic sentence transmits close to nothing regardless of inbound link count | [raw/unveilseo-com-internal-link-audit.md] |
| Practical scoring approach | Score each page's inbound-anchor profile across generic-ratio, diversity, topical-relevance, and length dimensions (a 0-100 composite is one vendor's approach) to prioritize which pages have technically-fine links that nonetheless carry weak signal | [raw/unveilseo-com-internal-link-audit.md] |

Caveat on anchor-text thresholds: the specific percentage cutoffs above (30% generic, <3 unique anchors, etc.) come from a single vendor's internal audit tool and are not independently corroborated by a second source in this archive or by an official Google document. Use them as reasonable starting heuristics for flagging, not as a validated industry standard. [raw/unveilseo-com-internal-link-audit.md]

## 5. Internal PageRank-style link-equity flow

| Concept | Detail | Source |
|---|---|---|
| Underlying algorithm | Classic Brin/Page PageRank power-iteration: initialize each page's rank at 1/N, then iteratively update PR(p) = (1-d)/N + d * sum(PR(q)/out_degree(q)) for every page q linking to p, using damping factor d (Google's original published value, 0.85) | [raw/kennytan-net-internal-link-equity-auditor.md] |
| Iteration/convergence | Graphs under roughly 10,000 nodes typically stabilize in 20-30 iterations | [raw/kennytan-net-internal-link-equity-auditor.md] |
| Dangling-node handling | Pages with zero outbound internal links ("dangling nodes" / dead-ends) accumulate equity but never redistribute it if handled naively, which distorts convergence; correct implementations redistribute each iteration's "dangling mass" uniformly across all nodes | [raw/kennytan-net-internal-link-equity-auditor.md] |
| Equity-distribution classification thresholds (one vendor's scale, useful as a diagnostic starting point) | HEALTHY: top 20% of pages, 20+ inbound internal links, equity flows here by design. MODERATE: 40th-80th percentile, 8-20 inbound links, underweight but indexed/ranking. UNDER-SERVED: bottom 20% / equity-starved, fewer than 8 inbound links, important-per-strategy but structurally orphaned. ORPHAN: 0 inbound, sitemap-only discoverability. DEAD-END: 0 outbound, receives but does not redistribute equity. OVER-LINKED: greater than 5% of total site equity or 150+ inbound links, usually boilerplate/footer over-exposure | [raw/kennytan-net-internal-link-equity-auditor.md] |
| Distribution shape as a health signal | A healthy hub-and-spoke site concentrates roughly 40-70% of total equity in its top 20% of pages (Gini coefficient roughly 0.40-0.65 in this vendor's framing). A flat distribution (Gini under ~0.3) signals no discernible hub structure. An over-concentrated distribution (Gini over ~0.75) means hubs rank but spoke pages never receive enough equity to compete | [raw/kennytan-net-internal-link-equity-auditor.md] |
| What internal PageRank does NOT measure (explicit boundary) | (1) External link equity, i.e. backlinks from other domains, which this computation excludes entirely; (2) link-context quality, i.e. anchor relevance and page position (header vs. footer), which is topology-blind; (3) historical equity flow over time, which needs longitudinal crawls, not a single-graph snapshot; (4) Google's actual post-PageRank ranking layers (topical authority, E-E-A-T, query-specific adjustments), which a computed internal-graph proxy does not replicate. Treat any internal-PageRank-style score as a structural-health signal, not a rank predictor | [raw/kennytan-net-internal-link-equity-auditor.md] [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] |
| Nofollow handling | Internal links carrying `rel="nofollow"` do not pass equity in this model and should be excluded from the graph before computing equity flow; nofollow on internal links is described as almost always unintentional (CMS default, template error, plugin side effect) rather than a deliberate signal | [raw/unveilseo-com-internal-link-audit.md] |
| Honest framing on why this still matters despite being a proxy | The recursive insight (a link's value depends on the linker's own value) is not Google's disclosed live ranking formula, but it remains the underlying logic behind successor signals Google is understood to use (TrustRank, topic-sensitive PageRank, Navboost-adjacent link-graph signals); a site controls its internal graph fully even though it cannot control external backlinks, making internal-link engineering the highest-leverage link lever available to most sites | [raw/kennytan-net-internal-link-equity-auditor.md] |

## 6. Edge-level audit data model (what to actually capture per link)

A rigorous internal-link audit should capture each link as a full edge record, not just a destination count, to distinguish genuinely different link types that happen to point at the same URL (global nav vs. editorial citation vs. related-content card vs. pagination control). [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

| Field | Example | Purpose |
|---|---|---|
| source_key | /guides/crawling | Which canonical page emits the edge |
| observed_href | ../tools/crawler?ref=guide | The literal href as authored, before resolution |
| destination_key | /tools/crawler | Canonical identity the edge resolves to |
| label | crawler architecture tool | The anchor text itself |
| placement | main/editorial vs. nav/footer/sidebar | Contextual (in-body) vs. template/boilerplate link |
| artifact_ref | run/url/source#node-184 | Reproducibility reference for the specific crawl observation |

[raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]

Contextual vs. template distinction matters for scoring: a link in the body of an article that a reader benefits from carries materially more topical/equity signal than the same URL appearing in global navigation, footer, or sidebar boilerplate that appears identically on every page. Several sources recommend filtering to contextual (main-content) links specifically when computing "under-linked" status, since template links are present everywhere by construction and reveal nothing about relative importance. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md] [raw/unveilseo-com-internal-link-audit.md]

## 7. Practical audit sequence (synthesized across sources)

1. Crawl the site (or export via a tool) to build a link graph capturing source, destination, anchor text, placement, and HTTP status per edge. [raw/library-linkbot-com-internal-link-audit.md] [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
2. Fix plumbing first: 4xx internal links, redirect chains/hops, unintended nofollow on internal links. [raw/unveilseo-com-internal-link-audit.md] [raw/library-linkbot-com-internal-link-audit.md]
3. Cross-reference the crawl against sitemap, analytics, Search Console, and log data to identify orphan candidates; classify each by reachability state rather than a binary flag. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md]
4. Compute click depth via breadth-first search from a defined entry set; flag pages beyond the site's depth threshold (commonly ~3 clicks as a starting heuristic) for promotion. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md]
5. Score anchor-text quality per important destination page (generic ratio, diversity, topical relevance, length) and flag anchor-text cannibalization. [raw/unveilseo-com-internal-link-audit.md]
6. Optionally compute internal-PageRank-style equity distribution to identify under-served priority pages and over-linked boilerplate sinks; treat the output as a structural proxy, not a disclosed Google score. [raw/kennytan-net-internal-link-equity-auditor.md]
7. Re-crawl after fixes to confirm the new edges are crawlable, resolve without avoidable redirects, and that depth/reachability actually changed. [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md] [raw/library-linkbot-com-internal-link-audit.md]

## 8. Tangential material from the original two sources (retained, scope-limited)

| Topic | Relevance to internal-linking audits | Source |
|---|---|---|
| Canonicalization re-evaluation timing | If an internal-link audit flags links pointing at a URL whose canonical target recently changed, a fresh canonical change may not yet have propagated through Google's index; this is a timing caveat for interpreting audit findings, not a link-graph finding itself | [raw/developers-google-com-search-updates.md] |
| Site moves and domain-variant redirects | Post-migration, an internal-link audit should check for links still pointing at a pre-migration domain variant (www/non-www, subdomain) that was not covered by the Change of Address tool configuration | [raw/developers-google-com-search-updates.md] |
| llms.txt / content-chunking not required | Google's own guidance (as reported by Semrush) states llms.txt and content pre-chunking are not required for Google Search visibility; not itself an internal-linking finding, but relevant if an audit is tempted to recommend link-adjacent AI-crawler accommodations as a "gap" | [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] |

These two sources remain in the archive but are not stretched to cover orphan-page detection, anchor scoring, or link-equity mechanics; they simply do not address those topics, and Section 0 above already states that plainly. [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

## 9. Remaining research gaps (honest accounting)

Even after this pass, the archive has real limits:

- No source here is an official Google Search Central document specifically about internal linking (Google's official guidance on internal linking exists but was not fetched in this round; the closest official material in this archive is the changelog entries in Section 8, which do not address link-graph mechanics directly).
- Anchor-text percentage thresholds (Section 4) come from a single vendor and are not cross-validated against a second independent source or an official Google document.
- Internal-PageRank equity-distribution thresholds (Section 5) come from a single vendor's tool documentation; treat the specific Gini/percentile cutoffs as one reasonable heuristic scale, not an industry-standard benchmark.
- No source in this archive presents a controlled experiment isolating internal-link changes from other ranking factors; all equity-flow and depth claims are architectural/theoretical or practitioner-observational, not causally proven.

[raw/kennytan-net-internal-link-equity-auditor.md] [raw/unveilseo-com-internal-link-audit.md] [raw/sulayman-bowles-dev-internal-links-directed-retrieval-graph.md]
