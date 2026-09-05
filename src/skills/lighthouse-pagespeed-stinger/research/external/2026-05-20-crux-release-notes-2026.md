---
source_url: https://developer.chrome.com/docs/crux/release-notes
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: crux-field-data
stinger: lighthouse-pagespeed-stinger
---

# Chrome UX Report Release Notes - 2025/2026

## Summary

The official monthly CrUX dataset release notes from Google, covering notable stats, API
additions, and methodology changes. Key data points from April 2026 and earlier months
confirm the current state of the web's Core Web Vitals performance, what metrics are
available in CrUX (including recent additions like LCP image subparts, Round Trip Time),
and the deprecation of the CrUX Dashboard in November 2025. INP officially became a Core
Web Vital and replaced FID on March 12, 2024. The CrUX dataset updates daily in PSI (28-day
rolling), but BigQuery releases are monthly.

## Key quotations / statistics

**April 2026 dataset (published May 12, 2026):**
- 18,350,375 origins (↑ 0.5%)
- 68.9% of origins had good LCP
- 81.3% of origins had good CLS
- 87.1% of origins had good INP
- **56.4% of origins have good Core Web Vitals (all three: LCP + INP + CLS)**

**October 2025 dataset:**
- 18,438,315 origins
- 67.7% good LCP (↑ 1.4%)
- 80.3% good CLS
- 85.9% good INP
- 54.4% good all three CWVs

**January 2026 dataset:**
- CrUX Dashboard deprecated at end of November 2025. CrUX Connector shut down.
- The November 2025 data was the last to be included in the CrUX Dashboard.

**Recent API additions (from earlier months):**
- LCP image subparts added to CrUX API
- LCP resource types (text or image) added to CrUX API
- Round Trip Time (RTT) tri-bins added to CrUX API
- ECT (Effective Connection Type) dimension retired from BigQuery (RTT replaces it)
- Collection period dates added to PSI's "Discover what your real users are experiencing" section

**March 2024:**
- INP officially replaced FID as a Core Web Vital on March 12, 2024
- FID deprecated and removed from Chrome tools on September 9, 2024

## Annotations for stinger-forge

- Use the April 2026 stats in the `guides/02-lab-vs-field.md` guide to give context on current
  state of the web: only 56.4% of origins pass all three CWVs. INP and CLS have higher pass
  rates than LCP (LCP at 68.9%, CLS at 81.3%, INP at 87.1%).
- The CrUX Dashboard deprecation is important to document: teams that used it for historical
  tracking need to migrate to CrUX Vis or BigQuery queries.
- The RTT addition replaces ECT: document this in the PSI API section of `guides/02-lab-vs-field.md`.
- The 28-day rolling window is the key update frequency for PSI/CrUX API; BigQuery is monthly.
  This affects how quickly teams see the impact of optimizations in field data.
- Note: FID was removed from tools on September 9, 2024. Any LHCI assertions referencing FID
  should be updated to INP (field) or TBT (lab proxy).
