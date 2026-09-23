# 05. Canonicalization mechanics and failure modes

Grounded in `references/research/distilled-technical-seo.md` Section 6. Run `shared/scripts/seo-technical.py canonicals` first; it covers presence/multiplicity/cross-domain/target-mismatch directly. This guide covers the judgment calls the script deliberately leaves to a human (it flags "review", never auto-fails these).

## The seven failure modes

| Failure mode | What to look for | Source |
|---|---|---|
| Self-canonical mismatch | Self-canonical pointing to a different URL due to a protocol or trailing-slash mismatch | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Canonical to a non-200 URL | Canonical target returns 3xx, 4xx, or 5xx | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Canonical/noindex conflict | A canonical points to (or from) a `noindex` page; both signals may be ignored by Google when they conflict | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Multiple canonical tags | Only one is honoured when several are present on the same page | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Unintentional cross-domain canonical | Points to a different domain, which may or may not be an intentional decision | [raw/seoxpert-io-complete-technical-seo-audit.md] |
| Multi-hop canonical host | http/https, www/non-www, trailing-slash, and case variants should all 301 to a single canonical form in ONE hop, never via chained redirects or split server configs | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |
| Parameterized duplicates | UTM, sort, and pagination-irrelevant parameters should never produce competing indexed versions | [raw/ecosire-com-technical-seo-audit-checklist-2026.md] |

## Internal links must agree with canonicals

If the canonical says `/products/x` but the site internally links `/collections/y/products/x`, Google receives contradictory signals daily. Internal links should point at canonical forms directly. This is one of the few places this Stinger's scope and internal-linking-stinger's scope touch directly - this Stinger flags the canonical-vs-internal-link mismatch when it sees it while scanning a page's own canonical tag; it does not re-derive internal-linking-stinger's full link-graph audit to find every instance across the site (see guide 09). [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

## Cross-domain/syndication duplication

Content republished to partners, marketplaces, or international sister sites needs an explicit canonical or `noindex` agreement, otherwise the larger/higher-authority domain can win rankings for syndicated content. This is only checkable if the auditor knows syndication exists (from intake notes or the site's own content); a cross-domain canonical found by the script is a lead, not a confirmed problem, until that context is available. [raw/ecosire-com-technical-seo-audit-checklist-2026.md]

## The re-evaluation-timing caveat

Google's troubleshooting guide clarifies how long it takes to re-evaluate a canonical signal after a change. A recently-changed canonical mismatch should not be treated as a confirmed failure - if the target's deployment history (visible in `01-recon/stack-fingerprint.md` or site metadata) suggests a recent site change, note the caveat explicitly in the finding rather than scoring it as a hard failure on first sight. [raw/developers-google-com-search-updates.md]
