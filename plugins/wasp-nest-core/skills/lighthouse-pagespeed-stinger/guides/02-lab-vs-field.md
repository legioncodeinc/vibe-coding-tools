# Guide 02: Lab vs Field Data

> Research source: `research/external/2026-05-20-lab-vs-field-data-differences.md`, `research/external/2026-05-20-psi-crux-integration.md`, `research/external/2026-05-20-debugbear-lab-field-gap.md`
> Example: `examples/lab-field-reconciliation.md`

**The single most important conceptual guide in this stinger.** Read before interpreting any Lighthouse score alongside CrUX data.

---

## The core distinction

| | Lab data (Lighthouse) | Field data (CrUX / PSI `loadingExperience`) |
|---|---|---|
| Source | Controlled simulation in Lighthouse | Real Chrome users in the wild |
| Measurement | Single synthetic load | Aggregated from user sessions (28-day rolling) |
| Metric availability | All Lighthouse metrics, including TBT | INP, LCP, CLS, FCP, TTFB (no TBT) |
| INP | Not available (TBT is proxy) | Available as p75 |
| Throttling | Fixed (mobile 4x CPU / 1.6 Mbps) | Actual user device and connection |
| Cache state | Always cold | Mixed (new and repeat visitors) |
| Use for | Debugging and regression detection | Prioritization and real-user impact |

> "As a general rule, if you have both field data and lab data for a given page, field data is what you should use to prioritize your efforts." (`research/external/2026-05-20-lab-vs-field-data-differences.md`)

---

## Why lab and field diverge: the cause table

| Cause | Metrics affected | Direction of lab vs field gap |
|-------|-----------------|-------------------------------|
| Network throttling mismatch (Lighthouse: 1.6 Mbps / 150ms RTT; US average: ~41 Mbps / 47ms) | LCP, FCP | Lab typically worse than field |
| CPU throttling (4x mobile simulation) | LCP, TBT | Lab typically worse than field |
| Cold vs warm cache (Lighthouse always cold; repeat visitors cache resources) | LCP, TTFB | Lab worse; field improves for repeat visitors |
| Geographic variation (Lighthouse runs from one location) | LCP, TTFB | Field varies by user geography |
| User interaction (Lighthouse doesn't interact) | INP | INP unavailable in lab |
| bfcache / platform optimizations | LCP | Field benefits from bfcache; lab cannot replicate |

> Source: `research/external/2026-05-20-lab-vs-field-data-differences.md`

---

## The TBT / INP gap: the critical caveat

TBT measures blocking tasks during page load. INP measures the full interaction lifecycle (delay + processing + presentation). They are related but not the same.

**A page can have excellent TBT (< 200ms) and still fail INP (> 200ms).**

Why: "This delay counts toward a page's INP because it contributes to the real input latency that users experience. But since this delay is not technically a Long Task, it doesn't affect a page's TBT." (web.dev, `research/external/2026-05-20-lab-vs-field-data-differences.md`)

Real-world example from the research: Discord homepage has 3+ seconds TBT but INP of 81ms. The reverse is also true and more common.

**Practical rule:** Never conclude that INP is fine because TBT is green. Always check field INP via PSI or CrUX API directly.

---

## The PSI API: lab + field in one call

The PageSpeed Insights API response contains two top-level blocks:

1. **`lighthouseResult`**: the full Lighthouse lab audit (score, audits, opportunities)
2. **`loadingExperience`**: CrUX field data for the URL (p75 LCP, INP, CLS, FCP, TTFB, with GOOD/NEEDS_IMPROVEMENT/POOR category per metric)

The `loadingExperience` block falls back from URL-level to origin-level if insufficient URL-level CrUX data exists. If even origin-level data is unavailable, the block indicates no data.

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://example.com&strategy=mobile&key=YOUR_KEY
```

> Source: `research/external/2026-05-20-psi-crux-integration.md`

---

## Which tool for which job

| Job | Tool |
|-----|------|
| On-demand lab + field in one call | PSI API |
| Fast field-only query for a URL | CrUX API |
| Weekly field trends over time | CrUX History API |
| 3-month CWV by URL group (ranking signals) | Google Search Console |
| Historical field data with country/ECT dimensions | CrUX on BigQuery |
| Historical lab data with commit-level regression tracking | Self-hosted LHCI server |

**Note:** The CrUX Dashboard was deprecated in November 2025. Migrate to CrUX Vis or BigQuery.

> TODO: open question: confirm whether CrUX Vis is now the official Google-maintained replacement for the Dashboard (needs human verification at https://developer.chrome.com/docs/crux/tools/crux-vis).

---

## The reconciliation workflow

When a user reports "Lighthouse says 90 but CrUX says I'm failing":

1. Pull the PSI API response for the exact URL and strategy (mobile vs desktop).
2. Compare `lighthouseResult.categories.performance.score` vs `loadingExperience.metrics`.
3. Identify which specific metric is failing in field data (usually INP, sometimes LCP).
4. Check if Lighthouse lab score is green because TBT is excellent, but field INP is poor.
5. If LCP diverges: check for cold vs warm cache, geographic variation, bfcache.
6. Use Chrome DevTools Performance panel with CPU throttling matching Lighthouse settings for deeper lab debugging.
7. Use `examples/lab-field-reconciliation.md` for a worked walkthrough.

---

## Field data thresholds (Core Web Vitals, 2026)

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| LCP | ≤ 2.5s | 2.5s - 4.0s | > 4.0s |
| INP | ≤ 200ms | 200ms - 500ms | > 500ms |
| CLS | ≤ 0.1 | 0.1 - 0.25 | > 0.25 |

Field data passes a metric if the **p75 (75th percentile)** is in the "Good" bucket. 3 of every 4 user sessions must be Good.

As of April 2026: 56.4% of origins pass all three Core Web Vitals. (`research/external/2026-05-20-crux-release-notes-2026.md`)
