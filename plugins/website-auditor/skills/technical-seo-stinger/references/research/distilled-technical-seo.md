# Distilled technical SEO research

Dense reference distilled from `raw/`. Every claim below cites its source file in brackets. Organized for technical-seo-worker-bee's job: a 100-page-depth technical SEO audit covering crawlability, indexability, XML sitemaps, robots.txt, canonicalization, keyword-frequency analysis, long-tail semantic analysis, and deep-linking analysis (the last of which overlaps with internal-linking-stinger's own archive by design).

Research window: round 1/2 single sweep, 2026-08-18. Round 3 deeper research pass added three new sources specifically targeting crawlability/indexability/sitemap/robots/canonicalization mechanics and log-file/crawl-budget analysis, 2026-08-18.

## 0. What changed in this round

Round 1/2 left this file with only two sources: an official Google changelog and a Semrush recap of one Google guide, both centered on generative-AI-search documentation updates rather than core technical-SEO checklist mechanics (title/meta length, robots.txt syntax, sitemap requirements, keyword-frequency scoring). Round 3 added three practitioner sources chosen specifically to fill that mechanical gap: a 47-point dependency-ordered audit checklist, a narrative "why audit order matters" guide with concrete failure-mode case studies, and a dedicated log-file-analysis/crawl-budget guide. These three give real, citable coverage of crawlability, indexability, sitemap and robots.txt mechanics, canonicalization failure modes, and log-file-based crawl-budget diagnosis. Keyword-frequency and long-tail semantic analysis remain thinly covered in this archive; see Section 7 (gaps) below rather than treating this as solved. [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/clarigital-com-log-file-analysis-for-seo.md]

## 1. Source authority in this archive

| Source | Type | What it covers | Authority note |
|---|---|---|---|
| ECOSIRE, "Technical SEO Audit Checklist 2026: 47 Checks" | Vendor/agency blog | Dependency-ordered 47-point checklist: crawlability/crawl budget, indexation, canonicals/duplication, hreflang, rendering, performance | States it is the literal checklist an agency team runs on every client engagement; specific numeric thresholds (e.g., "under ~70% of Googlebot hits on money pages") are the agency's own operating heuristics, not disclosed Google thresholds |
| Seoxpert, "The Complete Technical SEO Audit: A 2026 Checklist" | Vendor/practitioner blog | Audit ordered by Google's actual discovery-to-rank pipeline (discover, fetch, render, index, rank), with named real-world failure case studies | Practitioner-grade with named anecdotes (a $4,000 misdirected Core Web Vitals engagement, a silently-failed WordPress sitemap plugin); useful for "why this order" reasoning, not a primary standards source |
| Digital Codex (clarigital.com), "Log File Analysis for SEO: The Complete Guide" | Vendor/educational blog | Server log mechanics, genuine-Googlebot verification, crawl-budget signs and fixes, key log metrics, tool comparison | Most mechanically detailed log-analysis source in this archive; includes a concrete log-line example and reverse-DNS verification commands |
| Google Search Central "What's new" changelog | Official docs (Google) | Structured-data/rich-result changes, canonicalization timing, AMP/site-move mechanics, generative-AI documentation additions | Highest-authority source in this archive where it applies, but it is a changelog of documentation edits, not a primary checklist itself |
| Semrush blog on Google's generative AI search guide | Vendor blog | Secondary reporting on one Google document published 2026-05-15 | Reporting on, not independently verifying, the underlying Google document; official docs remain the higher-authority reading where the two overlap |

[raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/clarigital-com-log-file-analysis-for-seo.md] [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

## 2. Audit dependency order (why sequence matters)

Google's own pipeline, as framed by practitioner sources: discovery (find the URL via links or sitemap) -> fetch (download HTML, respecting robots.txt) -> render (execute JavaScript) -> index (decide whether to keep it and which canonical URL to attribute it to) -> rank (compete for queries). An audit should follow this order because upstream failures invalidate downstream findings: a Critical crawl-access problem makes indexation analysis moot, and a Critical indexation problem makes on-page/content analysis moot. [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

Cited failure-mode example: a Shopify storefront was billed $4,000 for a 30-page Core Web Vitals optimization report while a Shopify app installed two months earlier was silently injecting `noindex,nofollow` into every product detail page. The Core Web Vitals work was not wrong, just sequenced wrong, since indexing had to be fixed first (a 90-second fix: uninstalling the app) before performance work could matter. [raw/seoxpert-io-complete-technical-seo-audit.md]

## 3. Crawlability and indexability mechanics

| Check | Detail | Failure mode / what to flag | Source |
|---|---|---|---|
| robots.txt reachability | Fetch `/robots.txt` on every subdomain; a 404 is fine (no rules, full crawl allowed); a 500 or timeout is bad because Googlebot pauses crawling entirely until the file responds | Worst case: a `Disallow: /` meant for staging deployed to production; cited real cases (a Webflow "backup" export of staging, a Next.js developer-only middleware left in) each dropped the site out of Google for about 4 days | [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| robots.txt intentionality | Every `Disallow` line should have a known, documented reason; diff the file against its last known version on every audit, since silent robots.txt changes are described as causing more outages than any other single file | Undocumented or unexplained Disallow lines | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Server responsiveness to bots | TTFB under roughly 600ms at origin; 5xx rate effectively zero in logs; confirm no bot-specific throttling or WAF rule is serving 403s to Googlebot specifically | Slow or error-prone responses cause Googlebot to reduce crawl rate | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Internal 404s / broken links | Full crawl lists every internal link pointing at a 4xx target | A handful is normal hygiene; hundreds signals an architecture problem | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Redirect chains and loops | Every redirect on an important path should resolve in a single hop | Chains waste crawl budget, leak link equity per hop, and break silently when one link in the chain changes; two hops max is a common target, three hops is described as triggering Search Console warnings | [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Parameter / faceted-navigation traps | Filter, sort, and session parameters should be either canonicalized-and-uncrawled or deliberately indexable with genuinely unique content | Combinatorial URL explosion on ecommerce/listing sites is named as the single most common Critical finding in one agency's audit history | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Orphan pages (deep-linking overlap) | Cross-reference the crawl link graph against sitemaps and analytics; pages with traffic or revenue but no internal links should be linked, orphans with neither should be evaluated for removal | See internal-linking-stinger's own distilled archive for full orphan-detection and click-depth methodology; this Stinger should flag orphan status as part of crawlability scoring, not re-derive the full link-graph methodology | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md] |

## 4. XML sitemap mechanics

| Check | Detail | Source |
|---|---|---|
| Sitemap validity and honesty | Every URL listed should return 200, be canonical, and be indexable; sitemaps containing redirects, 404s, or noindexed URLs are described as training Google to distrust the sitemap over time | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Three-part validation | (1) the sitemap URL itself returns 200 and parses as valid XML, (2) every URL inside it returns 200 (not 3xx or 4xx, since Google warns on either), (3) indexable pages on the site that are NOT in the sitemap are flagged separately | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| The "silent killer" failure mode | A cited real-world case: a WordPress site had 4,200 indexable URLs but its sitemap contained only the 600 oldest posts because the SEO plugin's sitemap generator had silently failed years earlier; three years of new content was crawled late or not at all. Framework-specific note: default Next.js sitemap generation also mishandles this if dynamic routes are not explicitly included | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Segmentation for large sites | Large sites should use segmented sitemaps per section so coverage problems can be localized to a specific segment rather than diagnosed site-wide | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Sitemap as a canonicalization signal | Sitemap inclusion is a comparatively weak canonicalization signal versus a redirect or rel=canonical tag (carried forward from round 1/2 sourcing; see Section 6) | [raw/developers-google-com-search-updates.md] |

## 5. Robots.txt and noindex mechanics

| Check | Detail | Source |
|---|---|---|
| robots.txt is not a noindex mechanism | robots.txt controls crawling, not indexing; a page blocked in robots.txt can still appear in search results (without a snippet) because Google cannot read a noindex directive on a page it is not permitted to crawl. Never apply both robots.txt blocking and noindex to the same URL expecting a combined effect | [raw/seoxpert-io-complete-technical-seo-audit.md] (consistent with general Google guidance referenced across practitioner sources) |
| noindex audit | Crawl for meta robots tags and the `X-Robots-Tag` HTTP header together; every noindex found must be confirmed intentional. CMS template changes are described as regularly noindexing entire sections without anyone noticing | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Template-level noindex as a Critical failure | Equally catastrophic as a staging robots.txt reaching production; remediation is to grep the codebase for noindex, audit every occurrence, and confirm only intended pages carry it (internal search results, filtered views, login pages, thank-you pages, draft/preview routes). For WordPress: check Yoast/RankMath settings; for headless CMS: check the metadata pulled from the CMS API | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Staging/dev leakage | Check for staging, dev, and test environments appearing in the index (site: queries, Performance-report host data for staging subdomains); the fix for a leaked staging environment is authentication, not just noindex, since noindex alone does not prevent crawl-time resource waste or accidental discovery | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |

## 6. Canonicalization mechanics and failure modes

| Failure mode | Detail | Source |
|---|---|---|
| Self-canonical mismatch | Self-canonicals pointing to a different URL due to protocol or trailing-slash mismatch | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Canonical pointing to a non-200 URL | Canonicals pointing to pages that return 3xx, 4xx, or 5xx | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Canonical/noindex signal conflict | A canonical pointing to a noindex page creates conflicting signals; both may be ignored by Google | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Multiple canonical tags | Only one canonical tag is honoured when multiple are present on the same page | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Unintentional cross-domain canonicals | A canonical pointing to a different domain, which may not be an intentional decision | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| One canonical host, one hop | http-to-https, www/non-www, trailing-slash, and case variants should all 301 to a single canonical form in one hop, never via chained redirects or split server configs | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Parameterized duplicates | UTM, sort, and pagination-irrelevant parameters should never produce competing indexed versions; canonicalize to the clean URL | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Internal links must agree with canonicals | If the canonical says `/products/x` but the site internally links `/collections/y/products/x`, Google receives contradictory signals daily; internal links should point at canonical forms directly | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Cross-domain/syndication duplication | Content republished to partners, marketplaces, or international sister sites needs an explicit canonical or noindex agreement, otherwise the larger/higher-authority domain can win rankings for syndicated content | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Canonicalization re-evaluation timing (round 1/2 carryover) | Google's troubleshooting guide was updated to clarify how long it takes to re-evaluate a canonical signal after a change; a fresh canonical change may not have propagated through the index yet, so a recently-changed canonical mismatch should not be treated as a confirmed failure | [raw/developers-google-com-search-updates.md] |

## 7. Log-file analysis and crawl budget

| Concept | Detail | Source |
|---|---|---|
| Why logs over Search Console alone | Server access logs record every HTTP request with no sampling, no delay, and no aggregation; Search Console's Crawl Stats report aggregates and is limited to a 90-day window | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Log line contents | Requesting IP, exact timestamp, HTTP method, requested URL, HTTP status code, response size in bytes, User-Agent string. Example Combined Log Format entry: `66.249.66.1 - - [04/Apr/2026:09:15:22 +0000] "GET /seo/technical/lcp-optimisation/ HTTP/1.1" 200 34521 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"` | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Verifying genuine Googlebot (User-Agent is spoofable) | Method 1, reverse DNS: look up the requesting IP, confirm the hostname resolves to something ending in `googlebot.com`, then forward-resolve that hostname and confirm it matches the original IP. Method 2, bulk analysis: filter against Google's published crawler IP-range JSON at `https://developers.google.com/static/search/apis/ipranges/googlebot.json`, using User-Agent only as a secondary confirmation | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Crawl budget definition | The number of URLs Googlebot crawls on a site within a given period, determined by crawl capacity (how fast Google can crawl without overloading the server) and crawl demand (how many URLs Google considers worth crawling, based on PageRank, freshness, and recrawl signals) | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| When crawl budget matters | A significant concern mainly for sites over 100,000 pages; for most sites under 10,000 pages, Google crawls all crawlable, canonical, non-blocked URLs within normal timeframes without any optimization needed. Log analysis ROI increases with site size | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Signs of a crawl-budget problem | New important pages taking weeks to appear in the index; logs showing repeated crawling of low-value URLs (faceted nav, session-ID URLs, filtered listings) at the expense of important pages; entire large site sections absent from logs for weeks/months; a large gap between Search Console's indexed-URL count and the site's actual URL count | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Fixes for crawl-budget efficiency | Block low-value URL patterns via robots.txt or noindex; fix soft 404s (pages returning 200 for "not found" states get crawled repeatedly, should return 404/410); reduce TTFB since Googlebot reduces crawl rate on slow servers; keep the XML sitemap current and limited to canonical/indexable URLs | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Key log metrics to extract | Crawl frequency by URL (action trigger: important pages crawled infrequently, improve internal linking to them); HTTP status codes for Googlebot (action trigger: high 404 rate, fix broken links; high 301 rate, update internal links to point at canonical URLs directly); response time for Googlebot (action trigger: high response times reduce crawl rate, fix TTFB); crawl volume by URL type (action trigger: concentration on low-value patterns, block them); crawl volume over time (action trigger: a sharp drop is the single most actionable finding, check robots.txt changes, server errors, or budget issues) | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Common problems log analysis reveals | Googlebot wasting budget on parameter/filter-combination URLs at ecommerce scale; redirect chains consuming budget (Googlebot follows up to 5 hops before giving up); orphaned pages still being crawled via stale sitemap entries or external backlinks (a link-graph finding surfaced by log data, not by crawling alone); server 5xx errors clustering during high-traffic periods, indicating capacity rather than SEO issues; new content simply absent from logs for extended periods | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Tooling by scale | Command-line grep/awk/cut for quick one-off analysis, no setup; Screaming Frog Log File Analyser as a desktop GUI entry point with pre-built SEO reports; JetOctopus for enterprise sites with millions of log lines, correlating logs with crawl data and GSC; ELK Stack (Elasticsearch/Logstash/Kibana) for self-hosted continuous monitoring; Google Search Console Crawl Stats as a no-log-access fallback limited to a 90-day summary window | [raw/clarigital-com-log-file-analysis-for-seo.md] |
| Recommended workflow | (1) Establish a baseline crawl-pattern read; (2) rank findings by potential crawl-budget recapture, typically blocking high-volume low-value URL patterns has the most immediate impact; (3) implement changes and re-run analysis after 2-4 weeks to verify Googlebot redirected budget toward valuable pages; (4) correlate with Search Console's Crawl Stats and Index Coverage reports for the complete picture | [raw/clarigital-com-log-file-analysis-for-seo.md] |

## 8. Structured data and rich-result changes (round 1/2 carryover, official docs)

| Change | Detail | Audit implication | Source |
|---|---|---|---|
| Merchant listing `Product.category` | Now documented to accept both `Text` and `CategoryCode` types, aligned with Merchant Center's `product_type`/`google_product_category` feed attributes | Flag product pages using only one type if the site sells in a vertical where Google's category taxonomy benefits from `CategoryCode` | [raw/developers-google-com-search-updates.md] |
| Sale price effective dates | New "Sale duration" guidance for `validFrom`, `validThrough`, `priceValidUntil` on `Offer` or `PriceSpecification` nodes | Check e-commerce pages with sale pricing for these properties; placement on either node is acceptable per the current guide | [raw/developers-google-com-search-updates.md] |
| Review snippet guideline | New guideline prohibiting fake and undisclosed incentivized reviews | Flag review markup on pages where incentivized-review disclosure is missing | [raw/developers-google-com-search-updates.md] |
| FAQ rich result feature | Documentation removed; the feature stopped appearing in Google Search results as of 2026-05-07 | Do not score a page down for lacking FAQ rich-result eligibility markup; this is distinct from FAQPage schema's separate role in AI-answer-engine citation, out of scope for this Stinger | [raw/developers-google-com-search-updates.md] |

## 9. AMP and site-move mechanics (round 1/2 carryover, official docs)

| Topic | Current guidance | Audit implication | Source |
|---|---|---|---|
| AMP | Google now routes users directly to the publisher's AMP host page; AMP Cache and signed exchange references were removed from documentation as outdated | Do not flag missing AMP Cache/signed-exchange configuration as an issue; AMP content ranks like any other page | [raw/developers-google-com-search-updates.md] |
| Site moves and domain variants | The site-move guide explicitly covers using the Change of Address tool for all subdomain variants (www and non-www) during a domain migration | When auditing a post-migration site, check that both www and non-www variants were addressed, not just the primary domain | [raw/developers-google-com-search-updates.md] |

## 10. Google's generative-AI-optimization guidance and mythbusting (round 1/2 carryover)

Google added a "Generative AI fundamentals" documentation section (announced 2026-05-15) titled "Optimizing your website for generative AI features on Google Search." Core position, in Google's own framing as quoted by Semrush: AI Overviews and AI Mode use retrieval-augmented generation and query fan-out over content already in the Search index, so a page that is not technically sound and high-quality enough to rank traditionally will not perform in AI-generated answers either. [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

Mythbusting, what NOT to flag as a technical gap:

| Practice | Google's position | Audit implication | Source |
|---|---|---|---|
| llms.txt | Google's crawler may discover it but treats it like any other text file, no special indexing pathway | Do not score a site down for missing llms.txt for Google Search visibility specifically; note other AI crawlers/services may still use it | [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] |
| Content chunking | Not required; Google's systems can parse multi-topic pages and extract the relevant passage without pre-fragmentation | Do not recommend breaking articles into micro-sections purely for AI extraction | [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] |
| AI-specific long-tail rewriting | Not required; AI features understand synonyms and general meaning | Do not flag a page for lacking exhaustive long-tail keyword-variation coverage | [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] |
| Special schema/Markdown versions | Not required for inclusion in generative AI features | Do not require a parallel Markdown/AI-only version of a page | [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md] |

The llms.txt point is independently corroborated across the two round 1/2 sources: the official changelog states it directly (added 2026-06-15), and Semrush reports the same position from the May 15 guide. [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]

## 11. Evaluating third-party SEO tooling (round 1/2 carryover)

Google added guidance (2026-06-05) on evaluating third-party SEO tools, services, and advice, alongside updates to its "Do you need an SEO?" page. No further mechanical detail beyond the what/why summary was captured in the archived changelog entry. [raw/developers-google-com-search-updates.md]

## 12. Remaining research gaps (honest accounting)

Even after this round's additions, the archive still has real limits this Stinger should not overstate:

- Keyword-frequency analysis methodology (the specific mechanics of scoring on-page keyword density/frequency) is not covered by any source in this archive. No claim should be asserted about specific frequency thresholds or scoring formulas.
- Long-tail semantic analysis methodology is likewise not covered by a dedicated source here; the round 1/2 mythbusting material (Section 10) only establishes what Google says is NOT required, not a positive methodology for scoring long-tail coverage.
- Title tag length, meta description conventions, and other classic on-page mechanics are mentioned only briefly in one practitioner source (Seoxpert: title 55-60 characters, meta description 120-160 characters) and are not cross-validated against a second source or an official Google document in this archive.
- No source in this archive is a primary/official Google document specifically about robots.txt syntax rules, XML sitemap protocol requirements, or crawl-budget management for large sites; the mechanics above come from practitioner/vendor synthesis of that official guidance, not the guidance itself.
- Numeric thresholds throughout this file (the 70% Googlebot-hits-on-money-pages target, the 600ms TTFB target, the 3-hop redirect-chain warning) are individual agencies' or vendors' own operating heuristics, not disclosed Google standards; they should be presented to auditors as reasonable starting points, not authoritative cutoffs.

[raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/clarigital-com-log-file-analysis-for-seo.md] [raw/developers-google-com-search-updates.md] [raw/www-semrush-com-blog-google-publishes-generative-ai-search-guide.md]
