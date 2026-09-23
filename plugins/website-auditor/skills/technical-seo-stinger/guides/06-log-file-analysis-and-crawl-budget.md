# 06. Log-file analysis and crawl budget

Grounded in `references/research/distilled-technical-seo.md` Section 7. **Read this section's scope limit first**: this audit is an external, read-only assessment of a third-party site (build plan section 0). Server access logs are, by definition, something only the site owner (or someone they grant access to) can supply. This Stinger does not and cannot fetch server logs on its own. This guide exists so that, when a customer does supply logs as part of intake, the analysis is grounded and consistent - not to pretend this checkpoint runs by default.

## When this checkpoint applies at all

Check `00-intake/` for whether the customer supplied server logs or Search Console Crawl Stats export as part of the four recorded intake questions. If neither exists, write this section of the report as explicitly out of scope for this run ("server log access not provided at intake; crawl-budget analysis not performed"), not as a silent omission. Log analysis ROI also scales with site size: for most sites under 10,000 pages, Google crawls all crawlable, canonical, non-blocked URLs within normal timeframes without any optimization needed, so even when logs are available, treat this as a secondary checkpoint for a small site and a primary one for a large one. [raw/clarigital-com-log-file-analysis-for-seo.md]

## Why logs over Search Console alone

Server access logs record every HTTP request with no sampling, no delay, and no aggregation. Search Console's Crawl Stats report aggregates and is limited to a 90-day window - a useful fallback when raw logs are unavailable, but a weaker instrument. [raw/clarigital-com-log-file-analysis-for-seo.md]

## Verifying genuine Googlebot (User-Agent is spoofable)

Two methods, in order of rigor: (1) reverse DNS - look up the requesting IP, confirm the hostname resolves to something ending in `googlebot.com`, then forward-resolve that hostname and confirm it matches the original IP; (2) bulk analysis - filter against Google's published crawler IP-range JSON at `https://developers.google.com/static/search/apis/ipranges/googlebot.json`, using User-Agent only as a secondary confirmation. Do not trust the User-Agent string alone for anything you plan to report as a confirmed Googlebot behavior. [raw/clarigital-com-log-file-analysis-for-seo.md]

## What to extract when logs are available

| Metric | Action trigger |
|---|---|
| Crawl frequency by URL | Important pages crawled infrequently -> improve internal linking to them |
| HTTP status codes for Googlebot | High 404 rate -> fix broken links; high 301 rate -> update internal links to point at canonical URLs directly |
| Response time for Googlebot | High response times reduce crawl rate -> fix TTFB |
| Crawl volume by URL type | Concentration on low-value patterns (faceted nav, session-ID URLs) -> block them |
| Crawl volume over time | A sharp drop is the single most actionable finding - check robots.txt changes, server errors, or budget issues first |

[raw/clarigital-com-log-file-analysis-for-seo.md]

## Common problems log analysis reveals

Googlebot wasting budget on parameter/filter-combination URLs at ecommerce scale; redirect chains consuming budget (Googlebot follows up to 5 hops before giving up); orphaned pages still being crawled via stale sitemap entries or external backlinks (a link-graph finding surfaced by log data, not by crawling alone - cross-reference with internal-linking-stinger's orphan findings if both exist); server 5xx errors clustering during high-traffic periods, indicating capacity rather than SEO issues; new content simply absent from logs for extended periods. [raw/clarigital-com-log-file-analysis-for-seo.md]

## Fixes to recommend

Block low-value URL patterns via robots.txt or noindex; fix soft 404s (pages returning 200 for "not found" states get crawled repeatedly, should return 404/410); reduce TTFB since Googlebot reduces crawl rate on slow servers; keep the XML sitemap current and limited to canonical/indexable URLs. [raw/clarigital-com-log-file-analysis-for-seo.md]
