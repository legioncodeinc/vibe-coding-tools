---
name: affiliate-referral-program-stinger
description: Affiliate and referral program specialist for SaaS products -- platform selection (Rewardful, FirstPromoter, Tolt, PartnerStack, Impact, Refersion), the affiliate-vs-referral distinction, cookie-based and server-side attribution (post-ITP, post-3PC era), payout automation, fraud detection (self-referral, cookie stuffing, velocity fraud), and EPC/LTV program economics. Invoke when the user says "set up an affiliate program", "which affiliate platform should I use", "Rewardful vs FirstPromoter", "my attribution is broken in Safari", "referral program fraud", "EPC or LTV for our program", "20% recurring commission", "postback tracking setup", or "PartnerStack vs FirstPromoter". Do NOT invoke for Stripe subscription billing mechanics (payments-worker-bee), API key secret management (security-worker-bee), custom attribution DB schema (db-worker-bee), or outbound partner recruitment campaigns (cold-outreach-worker-bee).
---

# Affiliate and Referral Program Stinger

Practitioner arsenal for `affiliate-referral-program-worker-bee`. Encodes the domain knowledge to select, configure, instrument, and economically validate affiliate and referral programs for SaaS products in 2026.

## When to use this stinger

The Angel reads this SKILL.md first for every invocation. Then navigates to the specific guide for the task. Common triggers:

- Platform selection: "Which affiliate platform should I use?"
- Attribution design: "Our Safari users aren't being attributed."
- Fraud configuration: "How do we prevent self-referral fraud?"
- Payout design: "Should we do 20% recurring or a flat fee?"
- Economics modeling: "Will this program pay back at 30% commission?"

## Platform tiers (2026 snapshot)

### SMB / bootstrapped tier (< $5K/month affiliate revenue)

| Platform | Monthly base | Transaction fee | Stripe | Fraud | Best for |
|---|---|---|---|---|---|
| **Rewardful** | $49+ | Up to 9% (revenue-cap plans) | Yes | Mid | Stripe-native SaaS, simplest setup |
| **FirstPromoter** | $99+ | 0% | Yes + Paddle, Recurly, Braintree | Strongest | Scale past $5K/mo affiliate revenue; 5 billing integrations |
| **Tolt** | $47+* | 2.9% + $0.30/conversion* | Stripe + Paddle | Weakest | Needs embeddable widget on custom domain |

*Tolt pricing has changed repeatedly. Always verify current pricing page before recommending.

**Break-even rule:** FirstPromoter ($99/mo, 0% fees) becomes cheaper than Rewardful (9% fees) when monthly affiliate-tracked revenue exceeds ~$5,000. Model this before recommending.

See `guides/01-platform-selection.md` for the full decision matrix including mid-market and enterprise tiers (PartnerStack, Impact, Tapfiliate).

## Attribution in 2026 (the ITP problem)

The single most important context for any new program:

- **Safari ITP** caps JavaScript-set first-party cookies at **7 days** (24 hours if the URL contains tracking parameters like `utm_source`, `gclid`, `fbclid`).
- **Firefox ETP** blocks third-party cookies by default since v103.
- **Chrome** reversed third-party cookie deprecation (April 2025); 3PC remain on by default in Chrome as of 2026. Safari is the irreversible problem.
- **Combined impact:** 30-35% of global web traffic already operates without functional cookie-based attribution.

The only escape: set affiliate tracking cookies via **HTTP `Set-Cookie` response headers from your own server** (not via JavaScript). Server-set cookies respect the full configured duration (up to ~400 days). S2S postback is the architecturally sound primary attribution path.

See `guides/02-attribution-architecture.md` for implementation patterns.

## Fraud controls (minimum viable set)

Before any commission runs, wire:

1. Self-referral detection (IP match + /24 subnet check)
2. Conversion rate anomaly monitoring (flag if outside 2 std dev of program average)
3. Velocity alerts (flag at 3-5x daily click baseline)
4. Click-to-conversion time distribution (flag clustering at 0 seconds OR at exact cookie-window boundary)
5. Disposable email domain block list

See `guides/04-fraud-detection.md` for detection thresholds and per-platform native controls.

## Economics benchmarks (2026, Rewardful dataset)

| Metric | Industry benchmark |
|---|---|
| Average commission rate | 24.16% (range: 20-30%) |
| Affiliate activation rate | 7.6% generate a referral; 1.28% generate a sale |
| Referral-to-sale conversion | 0.8% average; 2-5% for strong programs |
| Average payout per commission | $14.10 |
| Program durability | Only 15.6% survive long-term |
| Strong EPC benchmark | $1.50-$3.00 range |

See `guides/05-economics-model.md` for the full break-even formula and EPC/LTV model.

## Critical directives (from Command Brief)

- **Always distinguish affiliate from referral before recommending a platform.** Different economics, fraud profiles, and participant incentives; conflating them causes expensive platform mismatches.
- **Never recommend cookie-only attribution without disclosing ITP / Firefox ETP risk.** 30-35% of traffic is already affected.
- **Flag self-referral and velocity fraud controls as mandatory.** Programs without minimum controls are abused within days.
- **Always model EPC and LTV payback before finalising a commission rate.** A competitive-looking rate can be economically destructive if LTV is low.
- **Do not configure Stripe payout automation without verifying US 1099/W-9 obligations and EU GDPR data obligations.** Tax liability risk is real.

## Folder layout

```text
affiliate-referral-program-stinger/
+- SKILL.md                           (this file — master index)
+- README.md                          (one-page overview)
+- guides/
|  +- 00-principles.md                (taxonomy, three levers, five evaluation criteria)
|  +- 01-platform-selection.md        (decision matrix: SMB to enterprise)
|  +- 02-attribution-architecture.md  (cookie-based vs first-party vs S2S postback)
|  +- 03-payout-design.md             (commission structures, hold periods, payout mechanics)
|  +- 04-fraud-detection.md           (detection thresholds, platform controls, supplemental layers)
|  +- 05-economics-model.md           (EPC, LTV payback, break-even formula, benchmarks)
+- examples/
|  +- bootstrapped-saas-rewardful-setup.md     (happy path: sub-$10K MRR, Rewardful, Stripe)
|  +- enterprise-partnerstack-checklist.md     (Series B+ scenario, PartnerStack, S2S attribution)
+- templates/
|  +- program-config-spec.md          (per-engagement structured capture template)
+- reports/
|  +- README.md                       (report format and past-run accumulation notes)
+- research/                          (owned by scripture-historian — do not modify)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- external/                       (12 source notes)
```
