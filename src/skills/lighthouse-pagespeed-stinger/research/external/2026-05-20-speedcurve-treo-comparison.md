---
source_url: https://www.speedcurve.com
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: performance-tracking-tools
stinger: lighthouse-pagespeed-stinger
---

# SpeedCurve and Treo: Performance Monitoring Tools 2025-2026

## Summary

SpeedCurve is an enterprise-grade performance monitoring platform combining synthetic testing
(built on WebPageTest) and Real User Monitoring (LUX). In November 2025, SpeedCurve was
acquired by Embrace (mobile observability platform). Treo specializes in Core Web Vitals
monitoring powered by Lighthouse data. Both tools are used as alternatives or complements to
the self-hosted LHCI server for historical performance tracking.

## SpeedCurve (post-Embrace acquisition, Nov 2025)

**Core capabilities:**
- Synthetic monitoring (automated tests from multiple global locations via Amazon EC2)
- Real User Monitoring (LUX) - captures actual visitor experiences
- Tracks 100+ metrics including Core Web Vitals, Lighthouse scores, and custom metrics
- Competitive benchmarking (compare against competitor sites)
- Performance budgets with CI/CD API integration
- Vitals Overview dashboard for instant site-wide issue spotting (added Oct 2025)
- Heat maps in Favorites dashboards (added 2025)

**Pricing (post-acquisition, current):**
| Tier | Price/Month | Key Limits |
|---|---|---|
| Starter | $90 | 25,000 synthetic checks/month |
| Growth | $576 | 13-month data retention, priority testing |
| Enterprise | $1,680 | SSO, private agents, consulting |

**Important constraint:** SpeedCurve Synthetic always loads from empty cache on consistent
Amazon EC2 hardware at a throttled connection. "Running tests on your local machine will
generally be very different from what you see in SpeedCurve Synthetic."

**Shopify integration:** SpeedCurve RUM available directly from Shopify App Store.

## Treo

**Core focus:** Core Web Vitals optimization, especially for improving Google search rankings.
Powered by Lighthouse. Strips away everything except the metrics that impact Google rankings
(LCP, INP, CLS). Pricing starts around $8,000 annually for continuous CWV monitoring (per
third-party comparison from 2026-03-20).

**Use case:** Content sites and ecommerce platforms where organic search visibility drives revenue.
Recommendations prioritize fixes that improve specific CWV metrics rather than chasing
Lighthouse scores that don't directly influence rankings.

## Key quotations / statistics

- "SpeedCurve was acquired by Embrace in November [2025], marking a strategic exit for the bootstrapped company." (checkthat.ai, 2026)
- "Synthetic monitoring is designed to give you a very consistent environment in which you can see the effect changes in code have on performance, but don't necessarily represent what all your users are experiencing." (SpeedCurve docs)
- "SpeedCurve Synthetic always loads websites: from a completely empty cache, on consistent hardware, within Amazon EC2, at a throttled average connection speed." (SpeedCurve docs)
- "The most important thing to track is consistency and changes within a single testing tool and settings." (SpeedCurve docs)

## Annotations for stinger-forge

- Primary source for `guides/04-performance-tracking.md` covering Treo vs SpeedCurve vs self-hosted LHCI server.
- Key differentiators to encode in the comparison guide:
  - SpeedCurve: synthetic + RUM, enterprise focus, acquired by Embrace Nov 2025, WebPageTest-based synthetic
  - Treo: CWV-focused, Lighthouse-based, smaller/simpler
  - Self-hosted LHCI server: free, runs in CI, no RUM, good for commit-level regression tracking
- The "empty cache" note is important for lab/field reconciliation: SpeedCurve Synthetic is
  always cold-cache, like Lighthouse. RUM captures warm-cache repeat visits, closer to CrUX.
- Stinger-forge should document the self-hosted LHCI server as the free alternative - it stores
  historical data, shows regression diffs per commit, but requires infra to run and has no RUM.
- Note: CrUX Vis (free, Google-maintained) can visualize CrUX History API data over time without
  needing a paid tool. Mention this as the zero-cost historical field data option.
