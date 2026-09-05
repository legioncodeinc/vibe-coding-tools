# Economics Model: EPC, LTV Payback, Break-Even Formula, and Benchmarks

*Grounded in: `research/external/2026-05-20-rewardful-state-of-saas-affiliate-programs-report.md`*

## Why model before setting a commission rate

A commission rate that feels competitive can be economically destructive if:
- The product's LTV is low (high churn, low ARPU).
- The refund window is long (commissions paid before revenue is certain).
- The affiliate activation rate is lower than expected (only 1.28% of enrolled affiliates generate a sale).

Always model the break-even point before finalising commission rate, recurrence terms, and hold period.

## Industry benchmarks (Rewardful 2026)

| Metric | Benchmark |
|---|---|
| Average commission rate | 24.16% |
| Affiliate activation rate (generates 1+ referral) | 7.6% of enrolled affiliates |
| Affiliate activation rate (generates 1+ sale) | 1.28% of enrolled affiliates |
| Average referral-to-sale conversion rate | 0.8% (strong programs: 2-5%) |
| Average payout per commission | $14.10 |
| Strong EPC benchmark | $1.50-$3.00 |
| Program durability (survive long-term) | 15.6% |

**Key implication:** Most affiliates are inactive. Program design should optimize for the active 1-7% rather than trying to activate all enrolled affiliates. Commission rate is rarely the bottleneck -- activation quality, onboarding, and creatives matter more.

## EPC (Earnings Per Click)

EPC is the primary metric affiliates use to evaluate program attractiveness. It tells affiliates how much they can expect to earn per click they send.

**Formula:**
```
EPC = (Total commissions earned) / (Total clicks sent)
```

**Example:**
- 1,000 clicks in a month.
- 8 conversions (0.8% conversion rate).
- Average commission per conversion: $14.10.
- EPC = (8 × $14.10) / 1,000 = $0.113/click.

**Benchmark:** A strong EPC for SaaS affiliate programs is $1.50-$3.00. The example above ($0.11) is weak -- affiliates will deprioritize sending traffic.

**How to improve EPC:**
- Increase the conversion rate of the landing page (not within the affiliate program -- this is a product/marketing problem).
- Increase the commission rate.
- Increase the product's ARPU (higher payout per conversion).

**Communicate EPC to affiliates.** Affiliates immediately understand it -- it lets them forecast revenue from their existing traffic. Publishing a program EPC or estimated EPC benchmarks improves affiliate recruitment.

## LTV payback calculation

**Formula:**
```
Commission cost as % of LTV = Commission rate × (1 + months_of_recurring / months_of_avg_retention)
```

**Simplified break-even formula:**
```
Maximum affordable commission rate = (Target affiliate CAC contribution) / (Customer LTV)
```

**Worked example:**
- Product ARPU: $50/month.
- Average customer retention: 18 months.
- Customer LTV: $50 × 18 = $900.
- Target affiliate CAC (as % of LTV): 25%.
- Maximum affordable commission = 0.25 × $900 = $225.
- If the product charges annual ($600/year), a 30% one-time commission = $180 -- within budget.
- If commission is 20% recurring for 12 months: 0.20 × $50 × 12 = $120 -- well within budget.

**Hold period adjustment:** If commission is paid immediately but the customer churns in month 1, the commission cannot be recovered. Multiply the expected commission cost by (1 - churn rate in the hold period) to get the net expected cost.

## Break-even commission rate

For programs where the primary question is "can we afford X% recurring?":

```
Break-even rate = (Total affiliate program costs) / (Total lifetime revenue from affiliate-sourced customers)
```

**Total program costs include:**
- Commission payments.
- Platform fee (Rewardful/FirstPromoter/PartnerStack base + transaction fees).
- Internal time for program management.
- Fraud-related commission clawbacks.

**Flag:** If the total program cost as a percentage of affiliate-sourced LTV exceeds the blended gross margin, the program is subsidizing growth below profitability. This is acceptable for a period (as with any CAC investment) but must be time-bounded.

## Blended CAC impact

Affiliate programs should be compared to other CAC channels:
```
Affiliate CAC = (Commission + Platform cost) / (New customers from affiliate channel)
```

Compare this to:
- Paid acquisition CAC (Google Ads, LinkedIn Ads).
- Content/SEO CAC (loaded team cost / organic signups).
- Direct sales CAC (AE salary + tools / closed deals).

If affiliate CAC is lower than paid CAC and conversion quality is equal (churn rate parity), the program is a strong investment.

## When to pause or kill a program

Signs a program is not working and should be paused before doubling down:

- After 90 days: fewer than 5% of enrolled affiliates have generated a referral.
- Average affiliate-sourced customer churns at 2x+ the program average.
- EPC has not reached $0.50 after 3 months of active traffic.
- Commission payments as % of affiliate-sourced revenue exceed gross margin after 6 months.

Pausing a program is not a failure. Running a program with negative unit economics is.

## Economics summary template (fill per engagement)

```
Product ARPU:           $___/month
Average retention:      ___ months
Customer LTV:           $___ (ARPU × retention)
Refund window:          ___ days
---
Commission type:        percentage / flat-fee
Commission rate:        ___%
Recurring?:             one-time / recurring (capped: ___months / lifetime)
Hold period:            ___ days
---
Break-even commission:  $___/sale (LTV × target CAC%)
Estimated EPC:          $___ (at ___% conversion rate)
Platform cost:          $___/month base + ___% transaction fee
Estimated affiliate CAC:$___ vs paid CAC $___
---
Program is affordable:  YES / NO / MARGINAL
```

See `templates/program-config-spec.md` for the full per-engagement structured template.
