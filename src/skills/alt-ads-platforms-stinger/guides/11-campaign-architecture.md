# 11 — Campaign Architecture

Cross-platform conventions for naming, UTMs, budget pacing, A/B testing, and optimization cadence.

---

## Campaign naming convention

Consistent naming allows multi-platform performance aggregation and makes historical campaign data interpretable.

**Recommended structure:** `[Platform]-[Product/Line]-[Audience]-[Format]-[Objective]-[YYYY-MM]`

**Examples:**
- `LI-ProductA-VPEng-LGF-LeadGen-2026-05`
- `TT-ProductA-D2C25-35-InFeedSmart-Conv-2026-05`
- `RD-ProductA-r-devops-PromPost-Traffic-2026-05`
- `BING-ProductA-JobTitle-Search-Leads-2026-05`

**Ad group naming:** `[Audience Segment]-[Bid Strategy]`
**Ad naming:** `[Creative Type]-[Variant]-[Launch Date]`

---

## UTM parameter schema

Define a consistent UTM schema across all platforms and never deviate. Inconsistent UTMs produce a fragmented analytics picture.

| Parameter | Format | Example |
|---|---|---|
| `utm_source` | Platform code | `linkedin`, `tiktok`, `reddit`, `bing`, `twitter`, `pinterest`, `quora`, `youtube`, `spotify` |
| `utm_medium` | Channel type | `paid-social`, `paid-search`, `display`, `video`, `audio` |
| `utm_campaign` | Campaign name (matches ad platform naming) | `LI-ProductA-VPEng-LGF-2026-05` |
| `utm_content` | Ad variant identifier | `LGF-v1-headline-a` |
| `utm_term` | Audience segment or keyword | `vp-engineering` or `kubernetes+monitoring` |

**Auto-tagging:** Enable auto-tagging in LinkedIn, TikTok, and Microsoft Ads where available. Auto-tags append platform-specific click IDs that enable server-side attribution reconciliation.

See `templates/utm-naming-convention.md` for the fillable template.

---

## Budget pacing by platform

| Platform | Budget type | Pacing recommendation |
|---|---|---|
| LinkedIn Ads | Daily budget (default) | Daily budget preferred over lifetime for ongoing campaigns; set daily budget at 1/30 of monthly target |
| TikTok Ads Smart+ | Daily budget | Smart+ requires daily minimum ($50/day). Do not use campaign-level lifetime budgets with Smart+ |
| Reddit Ads | Daily or total budget | Daily budget for ongoing; total budget for test campaigns with defined end dates |
| Microsoft/Bing | Daily budget | Standard daily pacing; use Automated Rules to pause campaigns at monthly limit |
| Pinterest | Daily budget | Daily budget; platform's "flexible budget" (±40%) produces smoother delivery |

**General rule:** Increase budgets by no more than 20% in any single week to avoid triggering platform learning phase resets.

---

## A/B testing framework

**Test one variable at a time.** The most common mistake in multi-channel advertising is testing audience, creative, and bid strategy simultaneously — this makes results uninterpretable.

**Variable priority (test in this order):**
1. Audience/targeting (highest impact, test first)
2. Creative concept (image/video/copy tone, test second)
3. Creative format (LGF vs website traffic, test third)
4. Bid strategy (test last — usually the least impactful variable)

**Statistical significance threshold:** 95% confidence required before declaring a winner. For most platforms, this requires 50+ conversions per variant. See `templates/channel-fit-scorecard.md` for the sample size calculator.

**Test duration minimums:**
- LinkedIn: 2-3 weeks minimum per test (low volume requires longer window)
- TikTok: 7-14 days (higher volume; faster signal)
- Reddit: 3-4 weeks (lower volume)
- Microsoft/Bing: 14-21 days

---

## Optimization cadence by platform

| Platform | Recommended review cycle | Key optimization actions |
|---|---|---|
| LinkedIn | 2 weeks | Audience segment pruning, LGF vs landing page split, creative rotation |
| TikTok | 3-5 days | Creative refresh (ad fatigue fast), Smart+ module adjustment |
| Reddit | Weekly | Subreddit performance comparison, keyword expansion |
| Microsoft/Bing | Weekly | Bid modifier adjustment, LPT audience expansion, search term review |
| Pinterest | Bi-weekly | Product catalog optimization, creative A/B testing |
| Quora | Weekly | Question targeting expansion, topic audience pruning |
| Podcast/Spotify | Monthly | Show performance vs promo code redemption, creative refresh |

**Frequency caps:**
- LinkedIn: 4 impressions/member/day recommended to prevent fatigue.
- Reddit: No official frequency cap UI; monitor CPM increases as signal of saturation.
- TikTok: Smart+ manages frequency automatically. For manual campaigns, cap at 5-6/day.

---

## Evaluation framework: when to scale, pivot, or kill

After the minimum test period and minimum budget for each platform:

**Scale when:** CPL is within 2x benchmark AND volume is scaling without CPL degradation.
**Optimize when:** CPL is 2-4x benchmark. Run the optimization cadence for one more full review cycle before deciding.
**Kill when:** CPL remains above 4x benchmark after 2 full optimization cycles, OR audience frequency is maxing out at minimum budget.

**Warning signs to watch for:**
- CPM increasing more than 30% without budget increase (audience saturation signal on LinkedIn/Reddit).
- Creative frequency >3 on TikTok (ad fatigue).
- Conversion rate dropping without budget or audience changes (landing page issue, not platform issue).
