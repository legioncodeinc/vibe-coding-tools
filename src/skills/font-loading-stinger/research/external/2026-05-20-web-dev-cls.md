---
url: https://web.dev/articles/cls
fetched: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: cls-metric
---

# Cumulative Layout Shift (CLS): web.dev

## Summary

The canonical Google definition and measurement methodology for CLS, a Core Web Vitals metric. Defines what constitutes a layout shift (visible element changes start position between rendered frames), how the CLS score is calculated (impact fraction × distance fraction, aggregated as "largest session window"), and what constitutes a good score. Font-swap is one of the primary named causes of layout shift alongside images/videos with unknown dimensions, dynamically injected DOM elements, and third-party ads.

## Key quotations / statistics

- "Cumulative Layout Shift (CLS) is a stable Core Web Vital metric... It's an important, user-centric metric for measuring visual stability."
- "To provide a good user experience, sites should strive to have a CLS score of 0.1 or less."
- Good: ≤ 0.1. Needs improvement: 0.1 to 0.25. Poor: > 0.25.
- Target: "75th percentile of page loads, segmented across mobile and desktop devices."
- Font shift cause: "fonts that render larger or smaller than its initial fallback" listed as a primary cause alongside images, ads.
- "A layout shift occurs any time a visible element changes its position from one rendered frame to the next."
- "layout shift score = impact fraction × distance fraction"
- Session window definition: "when one or more individual layout shifts occur in rapid succession with less than 1-second in between each shift and a maximum of 5 seconds for the total window duration."
- "The largest burst is the session window with the maximum cumulative score of all layout shifts within that window." (This is the CLS metric value)

## Annotations for stinger-forge

- This article provides the metric context for `guides/05-cls-elimination.md` and `guides/06-performance-checklist.md`. The 0.1 target is the quantitative CLS budget stinger-forge should encode as the pass/fail threshold.
- Font swap CLS reduction from 0.28 to 0.02 (sourced from webvitals.tools search result) is a concrete before/after data point to include.
- The session window definition explains why a single font swap during initial load can disproportionately impact the CLS score: it occurs during the high-impact early session window.
- Confirms: the 75th percentile measurement means fixing font CLS for slow-loading scenarios (not just fast-loading) is critical.
- Provides the mathematical grounding for why fallback-metric matching is effective: if the fallback and web font occupy the same space, the impact fraction approaches zero.
