# Phase 6 — Marketing / Account Report Analysis

## Goal
If ADA charged for social media management ($549.99/mo "Silver" tier is the standard line item) and/or produced quarterly Account Reports, extract the metrics and compare to industry benchmarks. The output is Section 4 of the ADA report and a key part of the damages calculation for the agency-services overpayment.

## ADA's Account Report format

ADA produces quarterly "Example Booking Co. Account Report — {dates}" PDFs covering:
1. Google Analytics (90 days)
2. Google Search Console
3. Google My Business
4. Facebook
5. Instagram
6. LinkedIn

The reports are dashboard exports with no narrative — pure metric tables and time-series charts. They are slick-looking but content-thin.

## Methodology

### Step 1: Extract metrics from the most recent quarterly reports

For each report available, capture:
- Google Analytics: total users, new users, sessions, bounce rate, avg session duration, sessions/user
- Channel breakdown: direct, organic search, organic social, referral
- Search Console: clicks, impressions, average CTR
- GMB: reviews, avg star rating, website visits, phone calls, search impressions (desktop + mobile), direction requests
- Facebook: page likes, post impressions, post engagements, reach
- Instagram: profile reach, post engagement, post likes, new followers
- LinkedIn: page impressions, page likes, engagement, engagement rate, new followers

### Step 2: Compare to industry benchmarks

Use the pre-compiled industry benchmark table from `assets/reference-data/industry-pricing.md`. Key benchmarks:

| Metric | Industry (Sprout Social 2025, Rival IQ 2025) |
|---|---|
| Facebook engagement rate | 0.06% – 0.20% (cross-industry median) |
| Instagram engagement rate | 0.45% – 0.60% |
| LinkedIn engagement rate | 3.0% – 6.2% |
| Healthy bounce rate | 40% – 60% |
| Avg session duration (B2B SaaS) | 2:00 – 3:00 |
| GMB reviews for active SMB | 5 – 50 per year typical |
| Search Console CTR | 2% – 3% industry standard |

### Step 3: Build the comparison table

Per Section 4.1 of the ADA report template:

| Metric | ADA Result | Industry Benchmark | Verdict |
|---|---|---|---|
| Instagram engagement rate | 0.0% | 0.45 – 0.60% | ZERO engagement |
| LinkedIn engagement rate | 0.0% | 3.0 – 6.2% | ZERO engagement |
| Facebook post engagements (90 days) | 2 | 20 – 200 typical | Near-zero |
| GMB reviews (90 days) | 0 | 5 – 50/yr typical | ZERO |
| GMB website visits | 0 | 20 – 500/quarter | ZERO |
| Search Console clicks (90 days) | 28 (down 51.72%) | ~100 – 500 | CATASTROPHIC trend |

### Step 4: Inspect the post content

The ADA reports include thumbnails of social posts. Capture screenshots of representative posts. The pattern: emoji-laden, generic, AI-template-style titles like:
- "⚖️ Work-Life Balance Starts Here"
- "⏳ SAVE TIME with Example Booking Co."
- "📊 Manage Projects with Example Booking Co."
- "🚀 Boost Your Productivity"

These are not custom-written, business-specific content. They are AI-generated templates with no targeting or audience signal. Industry standard at the $550/month price point is custom content with audience growth and engagement-driven optimization.

### Step 5: Quantify the social media overpayment

```
$549.99/month charged
- ($100–$300/month fair value for AI-template content at this engagement level)
= $250–$450/month overcharge
× N months billed
= Total overpayment
```

For Example Booking Co.: 20 months × $249.99 = $5,000 minimum overpayment.

### Step 6: Capture the account-manager email correspondence

ADA sends quarterly account reports via email from `helen@acmedigitalagency.example` (account manager) or similar. The covering emails sometimes contain remarkable acknowledgments. For Example Booking Co., Helen wrote in May 2025:

> "Engagement was low (34), so we may want to revisit post formats or frequency. Instagram & LinkedIn had very limited engagement and impressions, which signals an opportunity to improve strategy or reduce focus if not a priority channel."

This is the account manager DOCUMENTING the failure in writing without changing strategy. That email is gold for the case — it shows ADA's own staff acknowledged the failure and continued billing anyway. Capture it as a specific exhibit citation in the ADA report.

## What goes into the ADA report

Section 4 of the ADA report covers:
- 4.1 ADA's own quarterly metrics vs. industry benchmarks (table above)
- 4.2 What "engagement = 0" means in practice (no likes, no comments, no shares, no reposts)
- 4.3 Industry pricing comparison (table from industry-pricing.md)
- 4.4 The account-manager correspondence (with email citations)

## Update `case-facts.json`

```json
{
  "marketing": {
    "social_media_billed_per_month": 549.99,
    "social_media_fair_value_low": 100,
    "social_media_fair_value_high": 300,
    "social_media_months_billed": 20,
    "social_media_overpayment_low": 5000,
    "social_media_overpayment_high": 9000,
    "engagement_rates_observed": {
      "instagram": 0.0,
      "linkedin": 0.0,
      "facebook": 0.59
    },
    "gmb_reviews_during_engagement": 0,
    "gmb_website_visits_per_quarter": 0
  }
}
```

## Output checklist

- [ ] At least one quarterly ADA Account Report is parsed for metrics
- [ ] Industry benchmarks are cited with source URLs (Sprout Social, Rival IQ, etc.)
- [ ] Specific zero-engagement metrics are identified for at least one social platform
- [ ] At least one account-manager email is captured as evidence of acknowledged failure
- [ ] The overpayment calculation is in case-facts.json
