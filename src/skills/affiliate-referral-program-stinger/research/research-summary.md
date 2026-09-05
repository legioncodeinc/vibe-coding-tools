# Research Summary: affiliate-referral-program-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 to 2026-05-20 (6 months)
- **Files written:** 12 external source notes across 5 topics
- **Queries executed:** 5 seed + 15 expansion (via Perplexity recency-filtered)

## Five most influential sources

1. **`research/external/2026-05-20-rewardful-state-of-saas-affiliate-programs-report.md`** -- Rewardful's 2026 benchmark report: empirical data on commission rates (avg 24.16%), activation rates (only 1.28% of affiliates generate a sale), conversion benchmarks (0.8% referral-to-sale), program durability (only 15.6% survive long-term). Grounds all economics-model guides.

2. **`research/external/2026-05-20-rewardful-vs-firstpromoter-vs-tolt-detailed.md`** -- Three-way SMB-tier comparison with pricing math: Rewardful (up to 9% transaction fees on lower plans), Tolt (2.9% + $0.30/conversion, pricing volatile), FirstPromoter (no transaction fees, breaks even vs Rewardful above ~$5K/month affiliate revenue). Critical for the platform decision matrix.

3. **`research/external/2026-05-20-itp-first-party-cookie-7day-limit-explanation.md`** -- Definitive ITP explainer: client-side JS-set first-party cookies are capped at 7 days by Safari; URL-tracked clicks (gclid, fbclid, utm_source) get 24-hour expiry. Only server-set cookies via HTTP Set-Cookie header escape the cap. Foundational for the attribution-architecture guide.

4. **`research/external/2026-05-20-cookieless-affiliate-tracking-s2s-postback-guide.md`** -- S2S postback architecture guide: 30-35% of global traffic already cookie-blocked (Safari ITP + Firefox ETP + ad blockers). Provides the full hybrid tracking stack (S2S primary, first-party secondary, conversion APIs tertiary, probabilistic fallback). Chrome reversed 3PC deprecation (April 2025), but Safari is the irreversible problem.

5. **`research/external/2026-05-20-affiliate-fraud-prevention-saas-guide.md`** -- Fraud detection thresholds: legitimate affiliates have 1-10% conversion rate; <0.01% = click fraud; >90% = self-referral. Cookie stuffing detection (session bounce under 5 seconds), IP-based self-referral (exact IP or /24 subnet), velocity alerts (flag at 3-5x daily click baseline). Grounds fraud-detection guide.

## Open questions flagged for user decision

1. **Paddle/Chargebee compatibility:** Brief cites Paddle as second billing platform; research confirms Rewardful added Paddle support recently (verify current docs). FirstPromoter supports Paddle, Recurly, Braintree, Chargebee. Tolt: Stripe + Paddle only. Teams on Chargebee may face limited SMB platform options.

2. **Google's Chrome 3PC reversal impact:** Research confirms Google announced April 22, 2025, it would NOT deprecate third-party cookies in Chrome; Privacy Sandbox APIs shut down October 17, 2025. The attribution guidance must be precise: Chrome 3PC still works, but Safari ITP and Firefox ETP affect 30-35% of traffic NOW, regardless.

3. **PartnerStack pricing verification:** Research shows ~$500-1,000+/month base + 10-15% revenue override on commissions paid. This scales painfully as programs succeed. Recommend verifying current PartnerStack contract terms before including in any estimate.

4. **Tolt pricing stability:** Multiple sources flag Tolt pricing as volatile (seen $29/mo and $47/mo + 2.9% in different sources). The platform decision matrix must recommend verifying Tolt's current pricing page before any recommendation.

5. **Tax compliance (1099/W-9):** Brief flags IRS 1099 obligations for US affiliates paid above threshold. Research does not cover EU VAT compliance for affiliate payouts in depth -- a future `scripture-historian` pass on EU digital services VAT and affiliate payout obligations is recommended.
