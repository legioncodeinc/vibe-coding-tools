# Platform Selection: Decision Matrix from SMB to Enterprise

*Grounded in: `research/external/2026-05-20-rewardful-vs-firstpromoter-vs-tolt-detailed.md`, `research/external/2026-05-20-partnerstack-review-pricing-bootstrap-trap.md`, `research/external/2026-05-20-partnerstack-vs-impact-enterprise-comparison.md`, `research/external/2026-05-20-firstpromoter-vs-rewardful-setup-payout-tax.md`, `research/external/2026-05-20-smb-platform-comparison-rewardful-firstpromoter-tolt.md`*

## The two-tier market

SaaS affiliate platforms split cleanly into two tiers with almost no overlap:

- **SMB / bootstrapped tier:** Rewardful, FirstPromoter, Tolt. Self-serve, low base fee, Stripe-native.
- **Enterprise tier:** PartnerStack, Impact. Requires sales-led onboarding (4-8 weeks), $500+/month base + revenue override. Not appropriate for early-stage.

## SMB tier decision matrix

| Criterion | Rewardful | FirstPromoter | Tolt |
|---|---|---|---|
| Base price | $49+/month | $99+/month | $47+/month* |
| Transaction fee | Up to 9% (on lower plans) | 0% | 2.9% + $0.30/conversion* |
| Starter revenue cap | $7,500/month affiliate revenue | $5,000/month affiliate revenue | $10,000/month affiliate revenue |
| Billing integrations | Stripe (+ Paddle, verify) | Stripe, Paddle, Recurly, Braintree, Chargebee | Stripe + Paddle |
| Fraud controls | Mid-tier | Strongest of three | Weakest |
| Embeddable widget | No (external portal) | No (external portal) | Yes (custom domain) |
| Self-serve setup | Yes | Yes | Yes |
| Best for | Stripe-native SaaS, rapid launch | Scale past $5K/mo affiliate revenue; 5 billing integrations | Needs branded embedded portal |

*Tolt pricing is volatile -- has appeared at $29/mo and $47/mo + fees in different sources. ALWAYS verify current pricing at tolt.io before including in a recommendation.*

### Break-even analysis: Rewardful vs FirstPromoter

At low affiliate revenue, Rewardful's 9% fee on a $49/month base is cheaper than FirstPromoter's $99/month flat fee.

Break-even calculation:
- Rewardful cost at volume `V` = $49 + 0.09 * V
- FirstPromoter cost at volume `V` = $99
- Break-even: 0.09V = $50 → V = ~$556/month

But this understates the real break-even: as programs grow, Rewardful revenue-cap plans escalate. The practical crossover where FirstPromoter becomes more cost-effective is around $5,000/month in affiliate-tracked revenue. Model both before recommending.

### Tolt: when to choose it

Tolt's differentiator is the **embeddable affiliate portal widget** with custom domain support. Neither Rewardful nor FirstPromoter offers this -- both use external portal pages. Choose Tolt when:
- The product requires a fully branded affiliate portal embedded inside the product UI
- The team is willing to accept weaker fraud controls

Do not choose Tolt if fraud control depth is a priority.

## Enterprise tier

### PartnerStack (B2B SaaS)

**Best for:** Series B+ SaaS with dedicated partnerships headcount and $50K+/year budget for the platform.

**Strengths:**
- Marketplace of 800,000+ pre-vetted B2B SaaS affiliates (primary reason to choose PartnerStack)
- First-party cookies + S2S attribution (avoids Safari ITP)
- Recurring commissions and subscription churn-adjusted payout
- CRM integration (HubSpot, Salesforce) for long B2B sales cycles
- Global payouts in 100+ currencies with built-in tax/VAT compliance and 1099-NEC issuance

**Pricing warning:** PartnerStack charges a base fee (~$500-1,000+/month, custom contract) PLUS a revenue override on commissions paid (typically 10-15%). At $10,000/month in commissions, a 15% override adds $1,500/month in additional platform cost. Annual contracts are standard -- no month-to-month. Total cost is unpredictable and scales with program success.

**Do not recommend PartnerStack for:**
- Pre-Series B companies (high cost before ROI is proven)
- Teams without a dedicated partnerships manager
- Physical products or non-SaaS

### Impact (B2C / enterprise)

**Best for:** Large B2C brands doing $50M+ revenue with complex multi-channel partner ecosystems (consumer influencers, retail affiliates, D2C programs).

**Attribution risk:** Impact relies on third-party redirects that can be blocked by Safari ITP and ad blockers -- attribution misses are common. Not recommended for B2B SaaS with enterprise buyers who frequently use Safari.

**Verdict for SaaS:** Impact is the wrong tool for SaaS affiliate programs. Use PartnerStack for B2B, SMB platforms for smaller programs.

### Mid-market alternative: Tapfiliate

Research surfaced Tapfiliate ($69-$254/month, flat fee, self-serve, S2S tracking, no revenue override) as a strong mid-market option for teams that have outgrown Rewardful/FirstPromoter but cannot justify PartnerStack pricing. Include in platform shortlists when the team is past early-stage but below Series B.

## Decision flowchart

```
Is the product Stripe-only and pre-$5K/month affiliate revenue?
  YES → Rewardful (simplest path, lowest setup friction)
  NO ↓

Does the team need 5+ billing integrations (Paddle, Recurly, Braintree, Chargebee)?
  YES → FirstPromoter
  NO ↓

Does the product need an embedded affiliate portal widget?
  YES → Tolt (verify current pricing, accept weaker fraud controls)
  NO ↓

Is the team Series B+ with dedicated partnerships headcount and $12K+/year budget?
  YES → PartnerStack (B2B SaaS) or Impact (B2C enterprise)
  NO → FirstPromoter or Tapfiliate at mid-market
```

## Before finalising the recommendation

1. Verify Tolt's current pricing at tolt.io (pricing has changed repeatedly).
2. Verify PartnerStack's current contract terms (revenue override percentage varies).
3. Confirm whether Rewardful's Paddle support is live on current plan (research notes it was added recently, verify in docs).
4. Model the break-even math for Rewardful vs FirstPromoter at the product's projected affiliate revenue volume.
