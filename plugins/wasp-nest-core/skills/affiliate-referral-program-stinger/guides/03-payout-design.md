# Payout Design: Commission Structures, Hold Periods, and Payout Mechanics

*Grounded in: `research/external/2026-05-20-rewardful-state-of-saas-affiliate-programs-report.md`, `research/external/2026-05-20-firstpromoter-vs-rewardful-setup-payout-tax.md`, `research/external/2026-05-20-partnerstack-vs-impact-enterprise-comparison.md`*

## Commission type: percentage vs flat-fee

**Industry data (Rewardful 2026 benchmark):**
- 96.4% of SaaS affiliate commissions are percentage-based.
- Only 3.6% are flat-amount commissions.
- Average commission rate: 24.16%.
- Average payout per commission: $14.10.

**When to use percentage:** When the product has variable pricing tiers and you want affiliate incentives to align with upsell (affiliates earn more for higher-tier customers). Standard for SaaS subscriptions.

**When to use flat-fee:** When simplicity matters more than alignment (e.g., referral programs, one-time purchase products). Easier for affiliates to understand and forecast.

**Competitive commission rates by SaaS type:**
- Early-stage / bootstrapped SaaS: 20-25% is competitive.
- PLG SaaS with free tier: 30%+ may be needed to compensate for lower ARPU.
- Enterprise SaaS ($500+/month ACV): 10-15% can still be attractive given high absolute payout.

## One-time vs recurring commission

**One-time commission:** Affiliate earns once on the first payment. Simpler accounting, but affiliates prefer recurring for high-LTV products.

**Recurring commission:** Affiliate earns on every renewal as long as the customer remains. Common structures: lifetime recurring, or capped at 12/24 months.

**Which to choose:**
- Products with ARPU < $50/month and strong retention: lifetime recurring is affordable and highly attractive to affiliates.
- Products with ARPU > $200/month: cap recurring at 12 months to control cost; the absolute payout is already large.
- Products with high churn (> 20% monthly): avoid lifetime recurring -- payout outlives customer value quickly.

## Tiered commission structures

Tiered commissions reward high-performing affiliates. Common pattern:
- 0-10 customers referred: 20% commission.
- 11-50 customers: 25% commission.
- 51+ customers: 30% commission.

**Caution:** Tiers create incentives for affiliates to push customers across thresholds, which can generate low-quality signups near tier boundaries. Monitor affiliate-specific churn rates when using tiers.

## Hold periods

The hold period is the delay between conversion and commission payout. Purpose: ensures payout does not occur before refund / chargeback risk clears.

**Minimum recommended hold:** match the product's refund policy window.
- 30-day refund window → 30-day hold minimum.
- Annual plans with 14-day refund → 14-day hold is sufficient but 30 is conservative.

**Hold periods and fraud:** Longer holds give more time to detect self-referral or quality fraud (e.g., churned customers) before payout occurs. 60-90 day holds for programs in early fraud-detection stages are reasonable.

## Minimum payout threshold

Setting a minimum payout threshold ($25-$100 is common) reduces transaction costs and deters low-effort affiliates. However, it also delays legitimate micro-affiliates. Balance: $25 minimum is reasonable for most SMB SaaS programs.

## Payout mechanics

### Stripe Express (recommended for most SaaS programs)

Stripe Express accounts allow affiliate payouts via Stripe's payout infrastructure:
- Affiliates onboard with a Stripe-hosted KYC flow.
- Merchant initiates payouts from Stripe dashboard.
- Stripe handles currency conversion and international payouts.
- Stripe collects W-9 / W-8 from affiliates during onboarding (critical for 1099 compliance in the US).

**Supported by:** Rewardful (native), FirstPromoter (native), PartnerStack (native with global payout).

### Manual payouts (PayPal, bank transfer)

Common in Tolt and other platforms with basic payout infrastructure. Requires manual W-9 collection and 1099-NEC issuance above IRS thresholds. Higher operational overhead.

### Platform-managed payouts

PartnerStack handles global payouts with built-in tax compliance (W-8/W-9 collection, 1099-NEC issuance, VAT). This is a primary advantage for programs with international affiliates.

## Tax compliance (mandatory, not optional)

### United States (1099-NEC)

- Any affiliate paid $600+ in a calendar year must receive a 1099-NEC form.
- To issue a 1099, the merchant must collect a W-9 form (or W-8BEN for non-US affiliates) before any payout.
- Failure to collect W-9 and issue 1099 creates IRS filing liability.
- **Collect W-9 at affiliate onboarding, not at payout time.** Stripe Express handles this automatically.

### European Union (GDPR + VAT)

- Affiliate payout data (name, tax ID, bank account) is personal data under GDPR. Document the legal basis for processing.
- For B2B affiliates (companies, not individuals): typically handled under B2B reverse charge.
- For consumer affiliates in EU: VAT obligations vary by jurisdiction. Consult a local tax advisor.

> **TODO: open question -- needs human decision before next refresh.** Research does not cover EU affiliate payout VAT obligations in depth. Before recommending EU affiliate programs, verify with legal counsel.

## Commission configuration checklist

- [ ] Confirm commission type (percentage or flat).
- [ ] Confirm one-time vs recurring (if recurring: cap duration or lifetime?).
- [ ] Set commission rate based on LTV payback model (`guides/05-economics-model.md`).
- [ ] Set hold period >= product refund window.
- [ ] Set minimum payout threshold ($25-$100).
- [ ] Choose payout mechanism (Stripe Express recommended).
- [ ] Collect W-9/W-8BEN at onboarding (if using Stripe Express, this is automatic).
- [ ] Confirm 1099-NEC issuance plan for affiliates paid $600+/year.
