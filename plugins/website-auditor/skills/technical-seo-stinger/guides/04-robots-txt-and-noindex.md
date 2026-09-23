# 04. robots.txt and noindex mechanics

Grounded in `references/research/distilled-technical-seo.md` Section 5.

## robots.txt is not a noindex mechanism

robots.txt controls crawling, not indexing. A page blocked in robots.txt can still appear in search results (without a snippet) because Google cannot read a `noindex` directive on a page it is not permitted to crawl. Never apply both robots.txt blocking and `noindex` to the same URL expecting a combined effect - if both are found on the same URL, flag it as a conflicting-signal finding, not a doubly-safe one. [raw/seoxpert-io-complete-technical-seo-audit.md]

## noindex audit

Crawl `site-data/*.html` for both signals together: the `<meta name="robots" content="noindex">` tag and the `X-Robots-Tag` HTTP header. The meta-tag check is covered by `shared/scripts/seo-technical.py canonicals`. The header check needs a live header capture that this Stinger's `site-data/`-only inputs do not provide by default - mark that half of the checkpoint REDUCED COVERAGE unless a header-capture artifact exists elsewhere in the workspace (e.g. from `web-security-posture-stinger`'s own pass, which does fetch live headers for its own purposes - check `07-security/` for a reusable capture before assuming none exists). Every `noindex` found must be confirmed intentional; CMS template changes are described in this archive as regularly noindexing entire sections without anyone noticing. [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md]

## Template-level noindex as a Critical failure

Equally catastrophic as a staging robots.txt reaching production. Remediation pattern to recommend in the report: grep the codebase (not available to this externally-facing audit - recommend it to the customer as a next step) or, from the outside, sample every template type observed in `site-data/` (product pages, category pages, blog posts, static pages) and confirm only intended pages carry `noindex` (internal search results, filtered views, login pages, thank-you pages, draft/preview routes). For WordPress: note that Yoast/RankMath settings are the likely source if `stack-fingerprint-wasp-drone`'s output names WordPress. For a headless CMS: note the metadata is likely pulled from the CMS API. [raw/seoxpert-io-complete-technical-seo-audit.md]

## Staging/dev leakage

Check for staging, dev, and test environments appearing in the index. From outside the target with no Search Console access, this is necessarily a best-effort external check: look for staging-pattern subdomains referenced anywhere in the crawled content or sitemap (e.g. `staging.`, `dev.`, `test.` prefixes), and note in the report that a full check requires the customer's own Search Console `site:` data, which this audit does not have access to unless the customer supplied it via `keyword-intelligence-wasp-drone`'s tier-1 path. The fix for a leaked staging environment is authentication, not just `noindex` - `noindex` alone does not prevent crawl-time resource waste or accidental discovery, say so in any remediation note. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]
