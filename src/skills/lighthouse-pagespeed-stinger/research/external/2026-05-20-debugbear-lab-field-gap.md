---
source_url: https://www.debugbear.com/blog/lighthouse-lab-data-not-matching-field-data
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: lab-vs-field
stinger: lighthouse-pagespeed-stinger
---

# Why Does Lighthouse Lab Data Not Match Field Data? - DebugBear (Updated 2026-01-23)

## Summary

Practitioner-authored deep-dive explaining the specific mechanisms behind lab vs field
divergence, with quantified data. Provides the exact default Lighthouse throttling settings
and compares them to real-world US averages. Explains the "pessimistic slow device" design
philosophy: Lighthouse intentionally tests the slowest 5-10% of user experiences, not the
median. Updated in 2024 to note that INP replaced FID; TBT remains the lab proxy for
responsiveness.

## Key quotations / statistics

- "Lighthouse uses a fairly slow test device by default, so typically the lab metrics are worse than the real user data. It doesn't try to describe a typical user experience, but rather shows how the slowest 5% - 10% experience your website."
- Default Lighthouse mobile settings: 1.6 Mbps bandwidth, 150 ms latency.
- US average mobile: ~41 Mbps download, 47 ms latency.
- "When you compare the Lighthouse test result to real users in the US you'll see a big difference. The different network environments often explain most of the differences in Largest Contentful Paint."
- "While network differences are the main source of discrepancies between lab and field data, CPU speeds also differ. Lighthouse throttles the CPU by a factor of 4 to approximate a mobile CPU."
- "2024 Update: Interaction to Next Paint (INP) has now replaced First Input Delay (FID) as a Core Web Vital."

## Throttling comparison (quantified)

| Parameter | Lighthouse Default (Mobile) | US Average Mobile |
|---|---|---|
| Download bandwidth | 1.6 Mbps | ~41 Mbps |
| Latency (RTT) | 150 ms | ~47 ms |
| CPU throttle | 4x slowdown | No slowdown |

This means Lighthouse simulates conditions approximately 25x slower than typical US mobile
broadband, and 4x slower CPU. This deliberate pessimism explains why Lighthouse scores are
often lower than CrUX field data for well-optimized sites.

## Reconciliation implications

- If your Lighthouse score is BETTER than CrUX field data: likely caused by geographic variation
  (you run from a fast location but users are globally distributed), third-party scripts behaving
  differently in production, or intermittent server issues.
- If your Lighthouse score is WORSE than CrUX field data: expected behavior. Lighthouse is
  simulating slow conditions. Repeat visitors benefit from warm cache and connection reuse.

## Annotations for stinger-forge

- Complement to `web.dev/articles/lab-and-field-data-differences`: provides the quantified numbers
  (1.6 Mbps vs 41 Mbps) that are missing from the official doc.
- The "slowest 5-10%" framing is excellent for explaining to stakeholders why Lighthouse scores
  look so bad even for well-performing sites. Encode this in `guides/02-lab-vs-field.md`.
- Practical reconciliation heuristic to encode: if field data (CrUX) is BETTER than lab (Lighthouse),
  the Lighthouse score is still actionable for catching regressions. If field data is WORSE, investigate
  geographic distribution, third-party scripts, and CDN configuration.
- Note: DebugBear also has a Lighthouse performance score calculator at debugbear.com/docs/metrics/lighthouse-performance
  that confirms Lighthouse 12 weights match Lighthouse 10 (TBT 30%, LCP 25%, CLS 25%, etc.).
