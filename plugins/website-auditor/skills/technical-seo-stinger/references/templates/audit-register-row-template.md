# Audit register row template (technical SEO)

Matches the plugin-wide `Findings Register` sheet columns exactly (build plan section 4.4: `scoring/findings-register.csv`, columns ID, severity, category, page, evidence, remediation, effort), so audit-scoring-stinger can ingest this Stinger's output without a translation step. Every issue this Stinger surfaces gets one row here before it is rolled into a page-level scorecard score.

```markdown
| ID | Severity | Category | Sub-audit | Page | Evidence | Remediation | Effort |
|---|---|---|---|---|---|---|---|
| TSEO-001 | Critical | Search presence | Technical SEO | site-wide | robots.txt returns 500 at fetch time (`03-seo/evidence/robots-check.json`) | Fix server error on robots.txt; Googlebot pauses crawl entirely on a 5xx here | S |
| TSEO-002 | High | Search presence | Technical SEO | /products/example | Multiple `<link rel=canonical>` tags found (`site-data/products-example.html`) | Remove all but the one intended canonical tag | S |
| TSEO-003 | Review | Search presence | Technical SEO | /blog/old-post | Canonical points to a URL that returns 404 (`03-seo/evidence/canonical-check.json`) | Point canonical at a live URL or remove the page from the sitemap | S |
```

Column conventions:
- **ID**: `TSEO-###`, sequential within this Stinger's run, never reused across runs.
- **Severity**: use the plugin's named bands (Critical/High/Medium/Low/Review/Informational), not the raw 0-6 number; the 0-6 number lives on the page-level scorecard, this register is the flat issue list.
- **Category / Sub-audit**: `Search presence` / `Technical SEO` for everything this Stinger produces, so audit-scoring-stinger's rollup can filter by sub-audit cleanly. Deep-linking issues that are actually internal-linking-stinger's own output should carry `Internal linking` as the sub-audit and NOT be duplicated here, cross-reference instead (see `guides/09-deep-linking-and-internal-links.md`).
- **Evidence**: a file path or artifact reference into `03-seo/evidence/` or `site-data/`, never a description reconstructed from memory, per the plugin's conduct rule 2.
- **Remediation**: one line, specific enough for the customer report to use directly.
- **Effort**: S/M/L, this Stinger's own estimate, not a formal engineering estimate.

An issue without an evidence pointer is not ready for the register yet, per conduct rule 2 - hold it back until the evidence is captured.
