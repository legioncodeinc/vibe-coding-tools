# Page-level technical SEO scorecard (copy per page or per representative sample)

Copy-ready. One block per crawled page, or per representative page when a checkpoint is site-wide (robots.txt, sitemap.xml) rather than page-specific. Every score is scored on the plugin's 0-6 scale (build plan section 4.1): 0 = N/A/excluded, 1 = Critical/F, 2 = High/D, 3 = Medium/C, 4 = Low/B-minus, 5 = Cosmetic/B, 6 = Complete/A. Boolean checkpoints resolve only to 6 or 1, nothing between. Every score needs all three of: numeric value, evidence pointer, one-line justification, or the scoring Drone rejects it and returns it to this Drone.

```markdown
## Page: <path, e.g. /products/example>
- Source file: `site-data/<slug>.html` / `site-data/<slug>.md`
- Crawled at: <timestamp from site-data/, not reconstructed>

### Site-wide checkpoints (score once per audit, reference here)
| Checkpoint | Score | Evidence | Justification |
|---|---|---|---|
| robots.txt reachability | | `seo-technical.py robots` output, or manual fetch artifact path | |
| robots.txt intentionality (no undocumented Disallow) | | | |
| XML sitemap validity (well-formed, 200) | | `seo-technical.py sitemap` output | |
| XML sitemap honesty (listed URLs return 200/canonical/indexable) | | | |
| Sitemap coverage (indexable pages present in site-data/ that are missing from the sitemap) | | | |

### Per-page checkpoints
| Checkpoint | Score | Evidence | Justification |
|---|---|---|---|
| Title tag present and in range (~55-60 chars, single practitioner source, not cross-validated - see distillation Section 12) | | | |
| Meta description present and in range (~120-160 chars, single practitioner source, not cross-validated) | | | |
| Canonical tag present, single, self-consistent or intentionally cross-page | | `seo-technical.py canonicals` output | |
| Canonical target returns 200 (not 3xx/4xx/5xx) | | | |
| No canonical/noindex signal conflict | | | |
| Meta robots / X-Robots-Tag noindex is intentional (not an unnoticed template-level noindex) | | note: X-Robots-Tag needs a live header capture, static `site-data/*.html` alone cannot see it - flag REDUCED COVERAGE if no header capture exists | |
| H1 present, single | | | |
| Internal links point at canonical URL forms, not pre-redirect variants (deep-linking overlap - see `guides/09-deep-linking-and-internal-links.md`, defer full link-graph scoring to internal-linking-stinger) | | | |
| Structured data present and matches current guidance where applicable (see `references/research/distilled-technical-seo.md` Section 8; do not score down for missing FAQ rich-result markup, that feature was removed) | | | |
| Redirect chain to reach this URL is 1 hop or fewer (site-wide crawl-link finding, page-referenced) | | | |
| Page not orphaned (cross-reference internal-linking-stinger's link graph rather than re-deriving it) | | | |

### Notes
- Any checkpoint this archive does not cover with a disclosed standard (see distillation Section 12: numeric thresholds are vendor heuristics, not Google standards) must say so in the justification column, not present the heuristic as an authoritative cutoff.
- A recently-changed canonical should not be treated as a confirmed failure; Google's re-evaluation timing for a canonical signal is not instantaneous (distillation Section 6).
```
