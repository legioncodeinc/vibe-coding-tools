# 02 — LinkedIn Ads

Best-fit ICP: B2B buyers at companies with >50 employees; job title + seniority targeting need; deal value >$5K.

---

## 2026 benchmark data

| Metric | Benchmark |
|---|---|
| Average CPL (all industries) | $94 |
| Lead Gen Form conversion rate | 6.1% (vs 1.6% landing page) |
| LGF vs landing page drop-off | 28% drop-off (LGF) vs 65% (landing page) |
| Thought Leader Ads CTR | 2.68% (vs 0.42% single image) |
| Average CPC | $5.26-$10+ depending on audience |

**CPL by industry (ranges):**
- Technology / SaaS: $75-$150
- Financial Services: $100-$200
- Healthcare: $80-$180
- Professional Services: $60-$120
- Recruiting / Staffing: $40-$100

*Source: `research/external/2026-05-20-linkedin-ads-benchmarks-2026-by-industry.md`, `research/external/2026-05-20-linkedin-thought-leader-ads-zenabm-benchmarks.md`*

---

## Minimum viable spend

**$1,500-$3,000/month** for early testing (enough for LGF optimization over 4-6 weeks).
**$3,000-$5,000/month** is the practical floor for meaningful A/B testing and audience segmentation.
**$5,000+/month** required for proper account-based marketing (ABM) layers.

*Sources: `research/external/2026-05-20-linkedin-b2b-saas-pipeline-guide-growthspree.md`*

---

## Campaign structure

```
Campaign Group: [Product / Funnel Stage]
  Campaign: [Audience Segment] + [Ad Format] + [Objective]
    Ad Set → defines audience, bid, budget
      Ads → 3-5 creative variants for A/B testing
```

**Recommended campaign objectives by funnel stage:**
- Top of funnel: Brand Awareness, Video Views
- Mid funnel: Lead Generation (LGF), Website Visits
- Bottom funnel: Website Conversions (requires CAPI or pixel + verified event)

---

## Audience targeting layers (in priority order)

1. **Company list upload** (ABM) — upload a CSV of target accounts for highest precision.
2. **Job title + seniority** — target specific titles OR use seniority + job function (avoids title inflation issue — many VPs are listed as "Director" or "Head of").
3. **Company size + industry** — layer on top of job targeting for further precision.
4. **LinkedIn Groups** — niche professional communities signal high intent in the group's domain.
5. **Skills** — useful for technical roles (e.g., "Kubernetes" + "DevOps" to reach platform engineers).
6. **Lookalike audiences** — seed with your existing customer email list; LinkedIn's algorithm matches similar profiles.

**Avoid:** Interest-based targeting as a primary layer — it is too broad and wastes CPL budget. Use it only for awareness campaigns at scale.

*Source: `research/external/2026-05-20-linkedin-b2b-account-influence-2026.md`*

---

## Ad formats ranked by 2026 effectiveness for B2B lead gen

1. **Lead Gen Forms (LGF)** — highest CVR (6.1% vs 1.6% landing page). Pre-fills user data from LinkedIn profile. Use for: ebook downloads, webinar signups, demo requests.
2. **Thought Leader Ads (TLA)** — boosts personal posts of employees/founders as sponsored content. 2.68% CTR vs 0.42% single image. Most cost-effective format for awareness. Requires a person with existing content.
3. **Document Ads** — promotes downloadable PDFs (whitepapers, reports). High engagement for research-stage buyers.
4. **Single Image Ads** — standard sponsored content. Workhorse of LinkedIn advertising.
5. **Video Ads** — higher CPM, lower CVR than static; best for brand awareness campaigns.
6. **Conversation Ads (Message Ads)** — LinkedIn DM-based ads. Effective for hyper-targeted ABM lists; banned in EU/UK under GDPR.
7. **Dynamic Ads** — spotlight and follower ads. Lower priority; niche use cases.

*Source: `research/external/2026-05-20-linkedin-thought-leader-ads-zenabm-benchmarks.md`*

---

## LinkedIn Insight Tag + CAPI setup

The LinkedIn Insight Tag is the browser pixel. Layer CAPI on top for full attribution accuracy.

**Setup steps:**
1. Install LinkedIn Insight Tag via `<head>` script or Google Tag Manager.
2. Create a Conversion Action in Campaign Manager (Measure > Conversions > Create).
3. For CAPI: go to Measure > Conversions > Connect to partner or add event source.

> **OQ-1 flag:** LinkedIn CAPI GA availability depends on account type and age. If "Connect to partner" is not visible in Campaign Manager, the account may need to request access via LinkedIn support. Verify at [linkedin.com/help/lms](https://www.linkedin.com/help/lms) before relying on CAPI in your setup.

For technical CAPI wiring including event deduplication, see `guides/12-capi-wiring.md`.

---

## 2026 LinkedIn-specific notes

- **Thought Leader Ads breakout:** The 300+ account dataset shows Thought Leader Ads (promoting personal posts) outperform standard single image ads by 6x on CTR (2.68% vs 0.42%). For early-stage founders who post content, this is the highest-leverage entry point — low creative overhead, high engagement.
- **Account influence model:** LinkedIn recommends targeting across the full buyer committee, not just the decision-maker. Target 3-5 job titles per campaign (Champion + Economic Buyer + Technical Evaluator) at the same target companies.
- **Dayparting signal:** 80% of LinkedIn impressions deliver within ±2 hours of business hours. Automatic dayparting is not available in LinkedIn's UI; budget naturally self-adjusts. Do not manually daypart unless running Conversation Ads.

*Source: `research/external/2026-05-20-linkedin-b2b-account-influence-2026.md`*
