# Example: Bootstrapped SaaS Launching on Rewardful with 20% Recurring Commission

*Demonstrates: `guides/01-platform-selection.md`, `guides/02-attribution-architecture.md`, `guides/03-payout-design.md`, `guides/04-fraud-detection.md`, `guides/05-economics-model.md`*

## Scenario

- **Product:** B2B SaaS project management tool.
- **ARPU:** $49/month per customer.
- **Average retention:** 14 months.
- **Customer LTV:** $49 × 14 = $686.
- **Payment stack:** Stripe.
- **Team size:** Solo founder, no partnerships headcount.
- **Budget signal:** Bootstrapped, sub-$10K MRR, < $5K/month affiliate revenue expected at launch.
- **Desired program type:** Affiliate (third-party publishers, bloggers, tool comparison sites).

## Step 1: Platform selection (guide 01)

**Inputs:** Stripe-only, bootstrapped, < $5K/month affiliate revenue at launch.

**Applying the decision flowchart:**
- Stripe-only and pre-$5K/month? → YES → Rewardful is the primary candidate.
- Need 5+ billing integrations? → NO.
- Need embedded portal widget? → NO.

**Selected platform:** Rewardful.

**Pricing check:**
- Rewardful starter plan: $49/month + revenue-based transaction fee (verify current plan structure on rewardful.com).
- At $2K/month in affiliate revenue, the 9% fee adds $180 -- total cost $229/month.
- At $5K/month affiliate revenue: 9% = $450, total $499/month -- time to re-evaluate vs FirstPromoter ($99/month, 0% fee = $99 total).

**Re-evaluation trigger:** Switch to FirstPromoter when monthly affiliate-tracked revenue approaches $556 (the mathematical break-even) -- or proactively at $3K/month to reduce risk.

## Step 2: Attribution architecture (guide 02)

**Concern:** 30-35% of global traffic is Safari/Firefox -- cookie-only attribution would miss these sessions.

**Implementation choice:** Rewardful's client-side cookie as starting point (simplest for solo founder), with a commitment to add S2S postback in the first 90 days.

**Short-term (launch):**
- Rewardful's standard integration: JS snippet sets first-party cookie on click.
- Cookie duration configured to 60 days in Rewardful dashboard.
- **Known limitation:** Safari users get 7 days maximum, not 60 days.

**90-day target:**
- Add server-side conversion event via Stripe webhook → Rewardful API postback.
- This bypasses browser cookie dependency for all Stripe-captured conversions.

**GDPR note:** The tool serves US market only at launch. No cookie consent banner required for affiliate cookies in the US. Document this in the NOTES section if EU expansion is planned.

## Step 3: Commission structure (guide 03, guide 05)

**Economics check first:**
- LTV: $686.
- Target affiliate CAC as % of LTV: 25% → target commission budget: $171/customer.
- 20% recurring for 12 months on $49/month: 0.20 × $49 × 12 = $117.60 per customer.
- $117.60 < $171 budget → 20% recurring for 12 months is affordable.

**EPC estimate:**
- Assumed referral-to-sale conversion rate: 1.5% (above industry average of 0.8% -- optimistic for B2B tool with strong SEO affiliates).
- Monthly commission per affiliate per 1,000 clicks: 15 conversions × $9.80 avg first-month commission = $147.
- EPC: $147 / 1,000 = $0.147/click.
- This is below the $1.50-$3.00 strong EPC benchmark -- expected for a bootstrapped program early on.

**Commission configured:**
- Type: percentage.
- Rate: 20%.
- Recurrence: recurring for 12 months.
- Hold period: 30 days (matches refund window).
- Minimum payout: $25.

**Payout mechanics:** Stripe Express through Rewardful. Collects W-9 at affiliate onboarding automatically.

## Step 4: Fraud controls (guide 04)

**Minimum viable fraud stack for launch:**

1. **Self-referral:** Rewardful provides basic IP check -- enabled in platform settings.
2. **Conversion rate monitoring:** Set up weekly manual review of affiliate conversion rates for the first 3 months.
3. **Velocity alerts:** Not native in Rewardful -- set a calendar reminder to check the clicks dashboard weekly and flag any affiliate with 10x their usual click volume.
4. **Disposable email block list:** Implement Rewardful's email domain restrictions to block known disposable providers.
5. **Hold period:** 30 days gives time to detect obvious self-referral before payout.

**Supplemental tools:** IPQS added at 6-month review if fraud signals emerge. Not required at launch with < 50 affiliates.

## Step 5: Launch checklist

- [ ] Rewardful account created, Stripe integration connected.
- [ ] Commission configured: 20% recurring, 12 months, 30-day hold, $25 minimum.
- [ ] Cookie duration set to 60 days in Rewardful.
- [ ] Stripe Express payout enabled (W-9 collected at onboarding).
- [ ] Rewardful email domain restrictions configured.
- [ ] Affiliate portal page published on product's marketing site.
- [ ] Minimum 3 promotional assets created for affiliates: banner, social copy, email template.
- [ ] Weekly fraud review calendar reminder set.
- [ ] 90-day target: implement Stripe webhook → Rewardful postback for S2S attribution.
- [ ] 6-month review: model Rewardful vs FirstPromoter economics at actual affiliate revenue volume.
