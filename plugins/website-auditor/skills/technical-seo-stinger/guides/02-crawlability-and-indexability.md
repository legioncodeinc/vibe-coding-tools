# 02. Crawlability and indexability

Grounded in `references/research/distilled-technical-seo.md` Section 3. Google's own pipeline framing, as read by the practitioner sources in this archive: discovery -> fetch -> render -> index -> rank. A Critical crawlability finding invalidates everything downstream for that page, so this category runs first. [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

## Checkpoints

**robots.txt reachability.** Fetch `/robots.txt` on every subdomain in scope. A 404 is fine (no rules, full crawl allowed). A 500 or timeout is Critical: Googlebot pauses crawling entirely until the file responds. Run `shared/scripts/seo-technical.py robots` first. [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

**robots.txt intentionality.** Every `Disallow` line should have a known, documented reason. This Stinger cannot determine intent from the file alone - hand the parsed rule list to the human auditor for review, and where a prior audit's robots.txt snapshot exists, diff against it; silent robots.txt changes are described in this archive as causing more traffic-loss incidents than any other single file. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

**Server responsiveness to bots.** TTFB under roughly 600ms at origin, near-zero 5xx rate. This is a vendor operating heuristic, not a disclosed Google threshold - present it that way. Confirm no bot-specific throttling or WAF rule is serving 403s to Googlebot specifically (a finding that looks like a generic "slow site" issue but is actually a targeted block). [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/clarigital-com-log-file-analysis-for-seo.md]

**Internal 404s / broken links.** Cross-reference every internal link found in the crawled `site-data/*.html` against the crawl's own known-URL set. A handful is normal hygiene; hundreds signals an architecture problem worth escalating as its own finding rather than one row per broken link. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

**Redirect chains and loops.** Every redirect on an important path should resolve in a single hop. Chains waste crawl budget, leak link equity per hop, and break silently when one link in the chain changes; two hops is a common target, three hops is described as triggering Search Console warnings (vendor heuristic, not verified against an official Google threshold in this archive). [raw/seoxpert-io-complete-technical-seo-audit.md] [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

**Parameter / faceted-navigation traps.** Filter, sort, and session parameters should be either canonicalized-and-uncrawled or deliberately indexable with genuinely unique content. Combinatorial URL explosion on ecommerce/listing sites is named in this archive as the single most common Critical finding in one agency's audit history - treat any parameterized-URL family found in `site-data/` as worth a dedicated look, not a one-line note. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

**Orphan pages.** Flag orphan status as part of crawlability scoring when observed directly (a page present in `site-data/` or the sitemap but with zero inbound internal links seen during this pass). Do not re-derive the full orphan-detection methodology (reachability states, entry-point-set definition, path-diversity reporting) - that is internal-linking-stinger's own researched scope; see guide 09 for the cross-reference pattern. [raw/ecosire-com-technical-seo-audit-checklist-2026.md] [raw/seoxpert-io-complete-technical-seo-audit.md]

## Cited failure-mode example (why order matters)

A Shopify storefront was billed $4,000 for a 30-page Core Web Vitals optimization report while a Shopify app installed two months earlier was silently injecting `noindex,nofollow` into every product detail page. The performance work was not wrong, just sequenced wrong: the 90-second fix (uninstalling the app) had to happen before performance work could matter at all. Carry this ordering discipline into every pass: check indexation before spending scoring effort on downstream on-page quality. [raw/seoxpert-io-complete-technical-seo-audit.md]

## What this guide does NOT cover

X-Robots-Tag HTTP header checks require a live header capture this guide's `site-data/*.html`-only inputs cannot see. If no header capture artifact exists for this run, mark that specific checkpoint REDUCED COVERAGE rather than silently skipping or guessing.
