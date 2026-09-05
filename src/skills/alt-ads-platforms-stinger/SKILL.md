---
name: alt-ads-platforms-stinger
description: Paid acquisition specialist for alternative ad platforms beyond Meta and Google Search — LinkedIn Ads (B2B), TikTok Ads + CAPI, Reddit Ads, Microsoft/Bing Ads with LinkedIn Profile Targeting, Pinterest Ads, Quora Ads, YouTube standalone video, Spotify Ad Studio + podcast advertising, and the channel-fit-by-ICP heuristic that selects among them. Invoke when the user says "which ad platform should I use besides Meta/Google", "set up LinkedIn Ads for B2B SaaS", "TikTok CAPI setup", "Reddit Ads for technical buyers", "Microsoft Ads LinkedIn targeting", "podcast advertising Spotify Ad Studio", "channel diversification paid acquisition", or "our CPL on Meta is too high, what else should we try". Do NOT invoke for Meta/Facebook/Instagram Ads (no peer Angel — handle inline), Google Search Ads (no peer Angel — handle inline), or organic social strategy (route to social-media-marketing-organic-worker-bee).
---

# alt-ads-platforms Stinger

Arsenal for `alt-ads-platforms-worker-bee` — the Legion Army's specialist for paid acquisition across the 10 alternative platforms: LinkedIn, TikTok, Reddit, Microsoft/Bing, X/Twitter, Pinterest, Quora, YouTube (standalone), Spotify Ad Studio, and the podcast advertising ecosystem.

**Always start with `guides/01-channel-fit-diagnosis.md`.** No platform setup work begins until the ICP-to-platform fit is scored and the channel stack is prioritized. Running LinkedIn campaigns for a consumer ICP, or TikTok campaigns below $50/day, wastes budget regardless of execution quality.

See `guides/00-principles.md` for the six non-negotiables.

---

## Routing table

| Situation | Guide |
|---|---|
| Which platforms fit my ICP? | `guides/01-channel-fit-diagnosis.md` |
| LinkedIn Ads setup, LGF, benchmarks | `guides/02-linkedin-ads.md` |
| TikTok Ads, Smart+, CAPI | `guides/03-tiktok-ads.md` |
| Reddit Ads, community targeting | `guides/04-reddit-ads.md` |
| Microsoft/Bing Ads, LinkedIn Profile Targeting | `guides/05-microsoft-bing-ads.md` |
| X/Twitter Ads | `guides/06-x-twitter-ads.md` |
| Pinterest Ads, Shopping Catalogs | `guides/07-pinterest-ads.md` |
| Quora Ads, B2B niche targeting | `guides/08-quora-ads.md` |
| YouTube standalone video ads | `guides/09-youtube-standalone.md` |
| Spotify Ad Studio, podcast ads | `guides/10-podcast-advertising.md` |
| Campaign structure, naming, UTMs | `guides/11-campaign-architecture.md` |
| Server-side CAPI wiring, deduplication | `guides/12-capi-wiring.md` |
| Full channel-fit scorecard (to fill in) | `templates/channel-fit-scorecard.md` |
| Per-platform launch QA checklist | `templates/campaign-launch-checklist.md` |

---

## Critical directives

- **Channel-fit diagnosis before setup.** Never scaffold a campaign architecture before running the ICP-to-platform scoring. An incorrectly selected channel cannot be rescued by good execution. See `guides/00-principles.md`.

- **Minimum viable spend thresholds are gates, not guidelines.** LinkedIn under $1,500/month produces unoptimizable data. TikTok under $50/day has no learning phase. State these thresholds explicitly when the budget is below them. See `guides/00-principles.md`.

- **CAPI is the 2026 baseline for TikTok and LinkedIn.** Pixel-only attribution is ~60-70% accurate post-iOS 14.5. Server-side CAPI is not optional. See `guides/12-capi-wiring.md`.

- **Depth over breadth.** Never recommend more platforms than the team can execute well. One well-run LinkedIn campaign beats three mediocre ones across three platforms. See `guides/00-principles.md`.

- **Benchmark CPLs are ranges, not targets.** Initial testing will typically be 2-3x above mature-campaign benchmarks. State this explicitly. See `guides/01-channel-fit-diagnosis.md`.

- **X/Twitter is the most volatile platform in this stinger's universe.** The X/Twitter guide requires quarterly review. Always flag this to the user. See `guides/06-x-twitter-ads.md`.

---

## Platform benchmark quick-reference (2026)

| Platform | Avg CPL/CPM | Best ICP fit | MVS/month | CAPI available? |
|---|---|---|---|---|
| LinkedIn Ads | $94 CPL (avg); $40-500 by vertical | B2B, job title/seniority targeting | $1,500-$5,000 | Yes (verify GA status) |
| TikTok Ads | $10-25 CPL (D2C); $30-80 CPL (SaaS) | D2C, app installs, B2B awareness | $1,500/month ($50/day) | Yes (GA) |
| Reddit Ads | $0.50-$2.00 CPC (vs LinkedIn $5.26-$10+) | Technical B2B, developer tools, niche interest | $1,000/month | Yes (Reddit Pixel + CAPI beta) |
| Microsoft/Bing Ads | 20-35% lower CPA than Google Search | B2B, older demographics, LinkedIn-profile-matched | $500/month | Yes (UET + CAPI) |
| Pinterest Ads | 2.0-3.5x ROAS (avg); 3.5-5.0x (DIY/crafts) | D2C, home/garden/fashion/food | $500/month | Yes |
| Quora Ads | $8-15 CPM (vs LinkedIn $75-90 CPM) | B2B niche, technical comparison queries | $500/month | Yes (Quora Pixel) |
| YouTube Standalone | $0.01-0.03 CPV; $5-30 CPM | Brand awareness, explainer video, D2C | $1,000/month | Via Google Tag Manager |
| Spotify Ad Studio | 0.3-0.8% audio CTR; 95%+ completion | B2C mass market, engaged listeners | $1,000/month ($250 min) | No (promo codes + vanity URL) |
| X/Twitter Ads | Variable — platform volatile | Brand/thought leadership; NOT conversion-focused | $500/month test budget only | Yes (X Pixel) |

*Sources: `research/external/` — LinkedIn benchmarks from `2026-05-20-linkedin-ads-benchmarks-2026-by-industry.md`; Reddit CPCs from `2026-05-20-reddit-ads-b2b-saas-community-targeting-2026.md`; Pinterest ROAS from `2026-05-20-pinterest-roas-benchmarks-2026.md`; Spotify benchmarks from `2026-05-20-spotify-ads-benchmarks-2026.md`.*

---

## Open questions (from scripture-historian)

The following questions require either human decision or direct platform verification before the relevant guides can be fully authoritative. See `research/research-summary.md` for full context.

> **OQ-1 (LinkedIn CAPI GA status):** LinkedIn Conversions API availability depends on account type and may require applying for access. Verify in Campaign Manager: Measure > Conversions > Connect to partner. See `guides/12-capi-wiring.md` note.

> **OQ-2 (X/Twitter 2026 stability):** No 2026-specific X/Twitter Ads platform data was found in research. `guides/06-x-twitter-ads.md` is synthesized from training knowledge; verify at [business.twitter.com](https://business.twitter.com) before acting.

> **OQ-3 (Quora 2026 traffic):** Quora B2B effectiveness survives AI competition for technical comparison queries but is no longer a mass-volume channel. Scale expectations should be conservative.

---

## Folder layout

```text
alt-ads-platforms-stinger/
+- SKILL.md                                    (this file — master index)
+- README.md                                   (one-page human overview)
+- guides/
|  +- 00-principles.md                         (six non-negotiables, budget thresholds, CAPI doctrine)
|  +- 01-channel-fit-diagnosis.md              (ICP scoring matrix, demand capture vs creation, investment ladder)
|  +- 02-linkedin-ads.md                       (campaign structure, audience, LGF, benchmarks, CAPI)
|  +- 03-tiktok-ads.md                         (Smart+, CAPI, creative hooks, B2B vs B2C fit)
|  +- 04-reddit-ads.md                         (community targeting, AI citation value, CPCs, 90-day rule)
|  +- 05-microsoft-bing-ads.md                 (LinkedIn Profile Targeting, UET, import from Google Ads)
|  +- 06-x-twitter-ads.md                      (Amplify, Promoted Posts, platform volatility caveats)
|  +- 07-pinterest-ads.md                      (Shopping Ads, Catalogs, 70-90 day attribution)
|  +- 08-quora-ads.md                          (question targeting, B2B case studies, AI-competition caveat)
|  +- 09-youtube-standalone.md                 (TrueView, Bumpers, Shorts, when to run outside Google Ads)
|  +- 10-podcast-advertising.md                (Spotify Ad Studio, host-read, programmatic, attribution)
|  +- 11-campaign-architecture.md              (naming, UTMs, A/B testing, budget pacing, frequency caps)
|  +- 12-capi-wiring.md                        (TikTok CAPI, LinkedIn CAPI, Microsoft UET, deduplication)
+- examples/
|  +- b2b-saas-channel-fit.md                  (worked scorecard for B2B SaaS ICP, LinkedIn + Reddit stack)
|  +- tiktok-capi-setup.md                     (step-by-step CAPI wiring for a D2C brand)
+- templates/
|  +- channel-fit-scorecard.md                 (ICP input form + platform scoring matrix)
|  +- campaign-launch-checklist.md             (per-platform QA before going live)
|  +- creative-specs-table.md                  (format, dimensions, copy limits per platform)
|  +- utm-naming-convention.md                 (UTM parameter schema for multi-platform attribution)
+- reports/
|  +- README.md                                (how audit reports accumulate)
+- research/                                   (DO NOT MODIFY — owned by scripture-historian)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/
   +- external/                                (19 source notes, 2026-05-20)
```

---

*Command Brief: [`ai-tools/command-briefs/alt-ads-platforms-worker-bee-command-brief.md`](../../command-briefs/alt-ads-platforms-worker-bee-command-brief.md)*
*Forged by stinger-forge from `command-brief` + `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
