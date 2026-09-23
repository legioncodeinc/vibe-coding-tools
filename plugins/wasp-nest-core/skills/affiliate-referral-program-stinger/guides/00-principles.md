# Principles: Affiliate vs Referral Taxonomy, Economic Levers, and Evaluation Criteria

*Grounded in: `research/external/2026-05-20-rewardful-state-of-saas-affiliate-programs-report.md`, `research/external/2026-05-20-rewardful-vs-firstpromoter-vs-tolt-detailed.md`*

## 1. The affiliate vs referral distinction

**Affiliate program:** Third-party publishers (bloggers, review sites, content creators, agencies) who drive traffic to the product in exchange for a commission on conversions they generate. The affiliate is typically not a customer. They are motivated by EPC (earnings per click) and the quality of the product's conversion funnel.

**Referral program:** Existing customers who invite peers. The referrer is a satisfied user with social credibility. Incentive is usually a discount, credit, or cash reward for both parties. Motivated by relationship trust, not traffic economics.

**Why the distinction matters before platform selection:**

| Dimension | Affiliate | Referral |
|---|---|---|
| Participant | Third-party publisher | Existing customer |
| Trust signal | SEO/ad-driven traffic | Peer word-of-mouth |
| Primary fraud vector | Cookie stuffing, click fraud | Self-referral |
| Commission structure | Percentage of revenue, EPC | Credits, cash, discounts |
| Platform fit | Rewardful, FirstPromoter, PartnerStack | Viral Loops, ReferralHero, or built-in platform feature |
| Economics driver | EPC, conversion rate | Activation rate, viral coefficient |

Running both simultaneously is rarely justified at early stage -- start with one, prove economics, then layer the second.

## 2. The three economic levers

Every program design bottoms out in three variables:

1. **Commission rate** -- What percentage of revenue (or flat amount) the affiliate earns. Industry benchmark: 20-30% for SaaS, average 24.16% (Rewardful 2026). Setting rate without modeling LTV payback is the most common early mistake.

2. **Cookie / attribution window** -- How long after a click the program awards credit for a conversion. Standard: 30-90 days. Critical caveat: the configured window is only honored for Chrome users. Safari ITP caps JavaScript-set first-party cookies at 7 days regardless. Model this in your LTV payback calculation.

3. **Hold period** -- The delay between conversion and payout, designed to cover the product's refund window. Minimum recommendation: match the product's refund or chargeback window (typically 30 days). Longer hold periods improve fraud resistance but hurt affiliate satisfaction.

## 3. The three fraud attack vectors

1. **Self-referral:** Affiliate creates a new account using their own referral link to collect commission. Detection: IP address match, device fingerprint match.

2. **Cookie stuffing:** Affiliate places tracking cookies on browsers without the user's knowledge (hidden iframes, pixel images, browser extensions). Detection: session bounce rate under 5 seconds correlated with high click volume.

3. **Velocity fraud:** Automated click generation to inflate EPC or trigger payout thresholds. Detection: click volume at 10,000+/hour, or 3-5x daily baseline in a single period.

## 4. Five platform evaluation criteria

When selecting a platform, evaluate in this order:

1. **Billing provider compatibility** -- Does the platform natively integrate with the product's payment stack (Stripe, Paddle, Chargebee, Recurly)? Native integration means automatic commission calculation from subscription events. Custom webhook work is a significant engineering investment.

2. **Transaction fee structure** -- Flat monthly fee vs. percentage of affiliate revenue paid. At low volume, percentage fees are tolerable. At scale ($5K+/month), flat-fee platforms become cheaper. Always model the break-even point.

3. **Attribution model** -- Does the platform support server-side (S2S postback) attribution? Cookie-only platforms lose 30-35% of attributable conversions in 2026.

4. **Fraud controls** -- Native controls vary significantly: FirstPromoter has the strongest built-in fraud suite; Tolt has the weakest. Evaluate whether supplemental tools (IPQS, Fingerprint.com) are needed.

5. **API access and white-labeling** -- Can you embed the affiliate portal under your own domain? Tolt is the only SMB platform offering an embeddable widget on a custom domain. PartnerStack and Impact have deep API access at enterprise pricing.

See `guides/01-platform-selection.md` for the full decision matrix.
