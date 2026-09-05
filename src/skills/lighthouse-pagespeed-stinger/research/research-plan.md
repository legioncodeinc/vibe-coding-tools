# Research Plan: lighthouse-pagespeed-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months, with select sources from 2024 for foundational concepts)
- **Page budget target:** ~100 pages (executed at ~80 due to high-quality primary sources found quickly)
- **Source breadth target:** official docs, practitioner blogs, GitHub READMEs, tool-specific docs, community articles

## Initial queries (from `big-bang-space`)

- "Lighthouse v12 CI integration 2026"
- "PageSpeed Insights CrUX 2026"
- "Treo SpeedCurve performance monitoring 2026"
- "Lighthouse score budget CI 2026"
- "Lighthouse plugin custom audit 2026"

## Expansion queries (authored by scripture-historian)

### Branch from "Lighthouse v12 CI integration 2026"

- "Lighthouse CI GitHub Actions LHCI treosh/lighthouse-ci-action 2025 2026"
- "LHCI 0.15.x configuration lighthouserc.js assert collect upload 2025"

### Branch from "PageSpeed Insights CrUX 2026"

- "CrUX API release notes 2025 2026 INP origin statistics"
- "CrUX tools comparison BigQuery API PageSpeed Insights 2025"

### Branch from "Lighthouse score budget CI 2026"

- "Lighthouse performance score weighting INP TBT LCP CLS FCP 2025"
- "lab vs field data divergence INP replaced FID Core Web Vitals 2025"

## Research execution summary

All 7 queries were executed via Perplexity MCP (recency filter: year, ~2025-2026).
Sources prioritized by official authority (developer.chrome.com, github.com/GoogleChrome), then
practitioner depth (debugbear.com, unlighthouse.dev, web.dev), then community synthesis.
Firecrawl was unavailable (authentication required) so Perplexity was used for all discovery.

## Key findings from query triage

1. **LHCI current state**: `@lhci/cli@0.15.x` uses Lighthouse 12.6.1. The PWA category was removed
   in Lighthouse 12 (May 2024). Lighthouse 13 is not yet supported (requires Node 22.19+).
   `treosh/lighthouse-ci-action@v12` audits using Lighthouse v12.6 and is the recommended GA wrapper.

2. **Performance score weighting (Lighthouse 10 and later, including v12)**: TBT 30%, LCP 25%,
   CLS 25%, FCP 10%, Speed Index 10%. Time-to-Interactive was removed in Lighthouse 10. INP does
   NOT appear in the Lighthouse performance score - TBT is its lab proxy.

3. **CrUX 2026 state**: April 2026 dataset covers 18,350,375 origins. 56.4% pass all Core Web Vitals
   (LCP + INP + CLS). INP replaced FID on March 12, 2024. CrUX Dashboard deprecated November 2025.

4. **Lab vs field divergence**: Primary causes are network throttling mismatch, cold vs warm cache,
   geographic variation, user interaction patterns (INP is field-only; TBT is the lab proxy),
   and browser optimizations (bfcache). TBT correlates poorly with INP in practice.

5. **SpeedCurve acquisition**: Acquired by Embrace (mobile observability) in November 2025.
   Pricing: $90/month Starter, $576/month Growth, $1,680/month Enterprise.

6. **Plugin API**: Stable semver API with `Audit` class; plugins add custom categories. Gatherer
   access is NOT available to plugins (only to custom configs). Available artifacts are limited.
