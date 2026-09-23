# Example: Series B+ SaaS Evaluating PartnerStack with S2S Attribution

*Demonstrates: `guides/01-platform-selection.md` (enterprise tier), `guides/02-attribution-architecture.md` (S2S postback), `guides/03-payout-design.md` (global payouts), `guides/04-fraud-detection.md` (platform-native controls)*

## Scenario

- **Product:** B2B SaaS data platform.
- **ARPU:** $800/month per customer (enterprise ACV $10K+/year).
- **Average retention:** 24 months.
- **Customer LTV:** $800 × 24 = $19,200.
- **Payment stack:** Stripe (annual contracts, ACH transfers).
- **Team size:** 15 people, first dedicated partnerships hire being made.
- **Budget:** Series B, $500K+ allocated to growth for the year.
- **Desired program type:** Partner program (agencies, system integrators, technology partners) + affiliate (bloggers, review sites).
- **Geography:** US, UK, Germany.

## Platform evaluation: why PartnerStack

**Applying the decision flowchart (guide 01):**
- Pre-$5K/month affiliate revenue? → NO (projected $30K+/month at launch).
- Need 5+ billing integrations? → No (Stripe only).
- Need embedded portal widget? → No.
- Series B+ with dedicated partnerships headcount and $12K+/year budget? → YES → PartnerStack.

**PartnerStack advantages at this scale:**
- Marketplace of 800,000+ pre-vetted B2B SaaS affiliates and agencies -- partner recruitment is dramatically easier.
- Native S2S attribution + first-party cookies: no Safari ITP issues.
- Recurring commission tracking with subscription churn adjustment.
- Built-in global payout in 100+ currencies.
- W-8/W-9 collection and 1099-NEC issuance for US affiliates -- critical at program scale.
- CRM sync (HubSpot or Salesforce) for long B2B sales cycles.

**Total cost model (mandatory before signing):**
- Base fee: ~$1,000/month (custom contract -- get this in writing).
- Revenue override: 15% on commissions paid.
- At $30,000/month commissions paid: override cost = $4,500/month.
- Total PartnerStack cost: $1,000 + $4,500 = $5,500/month.
- Annual: $66,000.

This is a significant cost. Model the incremental revenue from PartnerStack marketplace access vs. self-managed program before signing the annual contract.

## Commission structure

**Economics check:**
- LTV: $19,200.
- Target affiliate CAC as % of LTV: 15% → $2,880 budget per customer.
- 15% one-time commission on $10K ACV: $1,500 -- well within budget.
- Agency/reseller partners: 10-15% recurring on expansion revenue (PartnerStack handles expansion revenue tracking natively).

**Commission configured:**
- Direct affiliates (bloggers, review sites): 15% one-time on first-year ACV.
- Agency partners: 10% recurring on all managed customer revenue (no cap -- this rewards long-term partner investment).
- Hold period: 60 days (annual contracts, no refund risk after 60 days).
- Minimum payout: $100.

## S2S attribution setup (guide 02)

At enterprise scale, S2S postback is non-negotiable. PartnerStack supports this natively.

**PartnerStack S2S implementation:**
1. PartnerStack generates click ID on affiliate link click.
2. Append click ID to landing page URL (`ps_partner_key` parameter).
3. Landing page server captures click ID and stores in session/database.
4. On Stripe `customer.subscription.created` event: backend fires postback to PartnerStack with click ID + conversion data.
5. PartnerStack attributes conversion, calculates commission, enters hold period.

**Browser test:** Validate attribution flow in Safari (private mode) and Firefox (strict mode). Confirm conversion is attributed without any browser cookie dependency.

## CRM integration for long sales cycles

B2B deals with 6-month sales cycles are common. PartnerStack's HubSpot/Salesforce integration:
- Tracks partner-sourced leads from first touch through closed-won.
- Associates partner credit to the deal regardless of time elapsed.
- Reports partner influence on pipeline for attribution credit in CRM.

Configure HubSpot deal stage sync so the partnerships team can see partner-sourced pipeline in real time.

## Fraud controls at scale (guide 04)

PartnerStack's native fraud suite covers the basics. Add:

- **Fingerprint.com** for device fingerprinting: at this revenue level, sophisticated self-referral using VPNs is financially motivated.
- **Churn rate monitoring by partner:** flag any partner whose referred customers churn at 2x+ the program average within the first 6 months.
- **Dedicated quarterly fraud review:** pull all conversion events by partner, review IP distribution, session quality, and conversion timing patterns.

## Implementation timeline

| Week | Action |
|---|---|
| 1-2 | PartnerStack contract signed, implementation manager assigned |
| 2-4 | PartnerStack account setup, commission rules configured |
| 4-6 | S2S postback implementation (engineering sprint) |
| 6-8 | HubSpot CRM integration, partner tracking fields live |
| 8-10 | Affiliate portal live, first partner invitations sent via PartnerStack marketplace |
| 10-12 | First commission cycle review, fraud review pass, EPC reported to partners |
