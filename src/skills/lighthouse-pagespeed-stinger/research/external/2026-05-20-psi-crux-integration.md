---
source_url: https://developer.chrome.com/docs/crux/methodology/tools
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: psi-crux-api
stinger: lighthouse-pagespeed-stinger
---

# CrUX Tools Comparison - Chrome for Developers (Updated Sep 9, 2025)

## Summary

Official Google reference comparing all CrUX-powered tools: CrUX API, CrUX History API,
PageSpeed Insights, PageSpeed Insights API, Google Search Console, and CrUX on BigQuery.
Each tool differs in update frequency, metric coverage, dimensions available, and whether
historical data is accessible. This is the key reference for understanding which tool to
use for which purpose when correlating lab data with field data.

## Tool comparison table (from official source)

| Tool | Update Frequency | Metrics | Historical Data | Granularity |
|---|---|---|---|---|
| CrUX API | 28-day rolling (daily updates) | Subset of key metrics | No (use History API) | Origin & Page |
| CrUX History API | Weekly updates | Subset of key metrics | Yes | Origin & Page |
| PageSpeed Insights | 28-day rolling (daily updates) | Subset (CWVs + TTFB + FCP) | No | Origin & Page |
| PSI API | 28-day rolling (daily updates) | Same as PSI | No | Origin & Page |
| Google Search Console | 28-day rolling (daily updates) | Core Web Vitals only | 3 months | URL Group |
| CrUX on BigQuery | Monthly (second Tuesday after month end) | All metrics | Since 2017 | Origin only |

## Key quotations / statistics

- "The CrUX API returns more quickly than the PageSpeed Insights API but does not include the additional Lighthouse data provided by PageSpeed Insights."
- "The PageSpeed Insights API returns slower than the CrUX API, but includes additional data provided by Lighthouse."
- "PageSpeed Insights does not provide historical data, and does not include country or effective connection type dimensions."
- "CrUX on BigQuery provides a publicly accessible database of all origin-level data collected by CrUX... Page-level data is not available in BigQuery tables."
- "PSI aggregates new data every day encompassing the previous 28 days. So the results you see today may be different tomorrow."

## PSI API response structure

The PSI API response contains two key blocks:
1. **`loadingExperience`** - CrUX field data (real-user metrics: p75 LCP, INP, CLS, FCP, TTFB)
2. **`lighthouseResult`** - Lab data from Lighthouse simulation

The `loadingExperience` block will fall back from URL-level to origin-level if there is
insufficient URL-level CrUX data. If neither is available, `lighthouseResult` is still
returned but `loadingExperience` will indicate no data.

## Annotations for stinger-forge

- This table is the foundation of `guides/02-lab-vs-field.md`'s "which tool to use" section.
- Key workflow to encode in the stinger:
  1. Use PSI API for on-demand checks that need both lab + field in one call
  2. Use CrUX API directly for fast field-only checks
  3. Use CrUX History API for trend analysis over time (weekly granularity)
  4. Use Google Search Console for ranking-signal-relevant URL groups (3-month history)
  5. Use BigQuery for advanced analysis across dimensions
- The PSI API's `loadingExperience` block is the primary way to surface CrUX data for
  specific URLs programmatically. Document the fallback from URL to origin level.
- Note for stinger-forge: No country/ECT dimension in PSI/PSI API: only BigQuery has those.
  This is a common source of confusion when teams try to debug geographic performance.
- The CrUX Dashboard (deprecated November 2025) is NOT listed in this table. Teams using
  it need to migrate. Recommend CrUX Vis as a simpler replacement, or BigQuery for advanced use.
