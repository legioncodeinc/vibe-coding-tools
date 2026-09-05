---
source_url: https://developer.chrome.com/docs/lighthouse/performance/performance-scoring
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: performance-score-weighting
stinger: lighthouse-pagespeed-stinger
---

# Lighthouse Performance Scoring - Official Reference

## Summary

The official Chrome for Developers reference for how the Lighthouse Performance score is
calculated. The score is a weighted average of five metric scores (not Opportunities or
Diagnostics). The scoring curve uses HTTP Archive data: the 25th percentile maps to a score of
50, and the 8th percentile maps to a score of 90. This means scoring 90+ requires being in the
top 8% of sites for a given metric. Weights changed between Lighthouse 8 and Lighthouse 10.
Lighthouse 10 and later (including v12) use the same weights. Importantly, INP does NOT appear
in the Lighthouse Performance score - TBT (30%) serves as the lab proxy for INP.

## Key quotations / statistics

- "In general, only metrics contribute to your Lighthouse Performance score, not the results of Opportunities or Diagnostics."
- "The weightings have changed over time because the Lighthouse team is regularly doing research and gathering feedback to understand what has the biggest impact on user-perceived performance."
- "Around a score of 0.96 is the 'point of diminishing returns' as above it, the curve pulls away, requiring increasingly more metric improvement to improve an already high score."

## Lighthouse 10 / v12 weights (confirmed current for Lighthouse 12.6.1)

| Audit | Weight |
|---|---|
| Total Blocking Time (TBT) | 30% |
| Largest Contentful Paint (LCP) | 25% |
| Cumulative Layout Shift (CLS) | 25% |
| First Contentful Paint (FCP) | 10% |
| Speed Index (SI) | 10% |

**Notable changes from Lighthouse 8**: Time to Interactive (TTI) was removed (was 10%),
CLS weight increased from 15% to 25%. INP is a field-only metric - it does not appear in
the lab-based Lighthouse Performance score.

## Score color ranges

- 0-49 (red): Poor
- 50-89 (orange): Needs Improvement
- 90-100 (green): Good

## Key additional facts (from DebugBear synthesis, 2026-04-15)

- Desktop and mobile use DIFFERENT score thresholds. E.g., to score LCP 90+ on desktop requires
  under 1.2 seconds; on mobile requires under 2.5 seconds.
- The 8th percentile of HTTP Archive data sets the "Good" (90+) bar for each metric.
- TBT is the lab proxy for INP, but correlation is imperfect - TBT measures input delay during
  page load; INP measures full interaction latency at any point in the session.

## Annotations for stinger-forge

- This is the authoritative source for `guides/06-audit-category-glossary.md` score weighting section.
- Critical to clarify: INP replaced FID as a Core Web Vital (March 12, 2024), but INP does NOT
  appear in the Lighthouse Performance score. TBT remains the lab proxy for responsiveness.
- The command brief's question "Does Lighthouse v12 change weighting for INP?" is answered here:
  No. Lighthouse 12 uses the same weights as Lighthouse 10. TBT remains at 30%, not INP.
- The PWA category (fifth category visible in older reports) was removed from Lighthouse 12 entirely.
  Stinger-forge should update any templates that reference five categories.
- Contradiction to watch: some community articles (dev.to) still list TTI in the weights: these
  reference Lighthouse 8 or earlier. Lighthouse 10+ dropped TTI.
