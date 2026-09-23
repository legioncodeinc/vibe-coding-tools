# 03. XML sitemap validation

Grounded in `references/research/distilled-technical-seo.md` Section 4. Run `shared/scripts/seo-technical.py sitemap` first for the mechanical checks below; this guide covers what the script cannot decide on its own.

## The three-part validation

1. The sitemap URL itself returns 200 and parses as valid XML. The script's `sitemap.xml well-formedness` checkpoint covers this directly.
2. Every URL inside it returns 200, not 3xx or 4xx (Google warns on either). Run the script with `--verify-urls --max-verify N` to sample this live; document the sample size and cap in the report if the sitemap has more entries than were checked.
3. Indexable pages that exist on the site but are NOT in the sitemap. This requires cross-referencing the sitemap's URL list against `site-data/`'s crawled URL set - a page present and indexable in `site-data/` but absent from the sitemap is a coverage gap, flag it even though the sitemap itself validated cleanly.

[raw/seoxpert-io-complete-technical-seo-audit.md]

## Sitemap honesty

Sitemaps containing redirects, 404s, or noindexed URLs are described in this archive as training Google to distrust the sitemap over time - a pattern-over-time concern, not just a one-off finding. If the same URL fails the honesty check across a re-run, escalate it rather than re-reporting it as a fresh finding each time. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

## The "silent killer" failure mode

A cited real-world case: a WordPress site had 4,200 indexable URLs but its sitemap contained only the 600 oldest posts, because the SEO plugin's sitemap generator had silently failed years earlier. Three years of new content was crawled late or not at all. Framework-specific note carried into this archive: default Next.js sitemap generation also mishandles this if dynamic routes are not explicitly included. When `stack-fingerprint-wasp-drone`'s output (read via `_shared/target-profile.json`, not re-derived here) names WordPress or Next.js, treat this failure mode as higher prior probability and check the coverage-gap step above with extra care. [raw/seoxpert-io-complete-technical-seo-audit.md]

## Segmentation for large sites

Large sites should use segmented sitemaps per section so a coverage problem can be localized to a specific segment rather than diagnosed site-wide. If the audit target uses a `sitemapindex` root (the script reports this in its `kind` field), validate each child sitemap individually rather than treating the index file's own validity as sufficient. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

## Sitemap as a canonicalization signal

Sitemap inclusion is a comparatively weak canonicalization signal versus a redirect or an actual `rel=canonical` tag. Do not treat "this URL is in the sitemap" as proof it is the canonical version if the on-page canonical tag says otherwise - the on-page tag wins for this audit's purposes. [raw/developers-google-com-search-updates.md]
