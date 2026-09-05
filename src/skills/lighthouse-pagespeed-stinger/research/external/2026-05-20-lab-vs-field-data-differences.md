---
source_url: https://web.dev/articles/lab-and-field-data-differences
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: lab-vs-field
stinger: lighthouse-pagespeed-stinger
---

# Lab and Field Data Differences - web.dev

## Summary

The canonical Google web.dev reference explaining why lab data (Lighthouse) and field data
(CrUX) diverge. Lab data is generated under controlled conditions (fixed network, device,
location). Field data aggregates real-user experiences (75th percentile). The document covers
each major metric (LCP, CLS, INP) and explains why each behaves differently in lab vs field.
Crucially: INP requires real-user interaction and CANNOT be accurately measured in a lab. TBT
is Lighthouse's lab proxy for INP, but it only captures the input-delay component (blocking
tasks), not the full interaction processing or presentation delay phases.

## Key quotations / statistics

- "Field data is based on real-user visits, it reflects the actual devices, network conditions, and geographic locations of your users. Field data is also commonly known as Real User Monitoring (RUM) data."
- "The most important thing to understand about field data is that it is not just one number, it's a distribution of numbers."
- "Tools that report Core Web Vitals field scores do so using the 75th percentile."
- "INP requires real-user interaction. The INP metric measures how responsive a page is to user interactions, at the time when users actually chose to interact with it."
- "As a general rule, if you have both field data and lab data for a given page, field data is what you should use to prioritize your efforts."
- "This delay counts toward a page's INP because it contributes to the real input latency that users experience. But since this delay is not technically a Long Task, it doesn't affect a page's TBT. This means a page may have poor INP despite having very good TBT scores."

## Causes of lab-vs-field divergence

| Cause | Affected Metric(s) |
|---|---|
| Network throttling mismatch (Lighthouse default: 1.6 Mbps / 150ms RTT; US avg: ~41 Mbps / 47ms) | LCP, FCP |
| CPU throttling (4x for mobile simulation vs real device) | LCP, INP proxy |
| Cold vs warm cache (Lighthouse always cold; repeat visitors have cached resources) | LCP, TTFB |
| Geographic variation (Lighthouse runs from a single location) | LCP, TTFB |
| User interaction timing (Lighthouse doesn't interact with the page) | INP (field-only) |
| Simulated throttling inaccuracies (can be over- or under-estimated) | LCP |
| bfcache / AMP cache / platform optimizations (field benefits, lab cannot replicate) | LCP, INP |
| LCP element variation (different users see different LCP elements) | LCP |

## Annotations for stinger-forge

- This is the primary source for `guides/02-lab-vs-field.md`: the most important conceptual guide in the stinger.
- The INP/TBT limitation is the single most critical piece of information: a site can have excellent TBT
  (under 200ms) but terrible field INP because INP captures interaction processing and presentation delay
  too. Example cited: Discord homepage has 3+ seconds TBT but INP of 81ms.
- The reconciliation framework for stinger-forge: use field data to prioritize (what is actually hurting users),
  use lab data to debug (reproducible, on-demand). Never optimize for lab data alone.
- The p75 threshold: CrUX passes a metric if the 75th percentile is in the "good" bucket. This means
  3 of every 4 user sessions must have a good experience.
- Note for stinger-forge: mention that PSI's `loadingExperience` block surfaces CrUX field data
  alongside the Lighthouse `lighthouseResult` block. This is the primary API reconciliation surface.
