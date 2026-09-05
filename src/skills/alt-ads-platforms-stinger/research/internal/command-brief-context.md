# Internal Context: alt-ads-platforms-worker-bee

**Source:** Command Brief at `ai-tools/command-briefs/alt-ads-platforms-worker-bee-command-brief.md`
**Created:** 2026-05-20
**Author:** scripture-historian (Phase 1.5)

---

## What this Angel does

`alt-ads-platforms-worker-bee` is the Legion Army's paid acquisition specialist for every platform EXCEPT Meta (Facebook/Instagram) and Google Search Ads. It owns:

- **Channel selection:** Diagnosis of which platform fits a given ICP before any campaign setup work
- **Campaign architecture:** For LinkedIn, TikTok, Reddit, X/Twitter, Microsoft/Bing, Pinterest, Quora, YouTube (standalone), and Spotify/podcast
- **Conversion tracking:** Pixel and CAPI setup for all supported platforms
- **Creative specs:** Per-platform format requirements
- **Launch checklists:** Step-by-step go-live QA

The Angel is **opinion-forward**: it will tell you when a channel is wrong for your ICP and why, not just how to run ads on it.

---

## Scope boundaries

| In scope | Out of scope |
|---|---|
| LinkedIn, TikTok, Reddit, X/Twitter, Bing/Microsoft, Pinterest, Quora, YouTube (standalone), Spotify Ad Studio, podcast networks | Meta/Facebook/Instagram Ads |
| Paid acquisition strategy and implementation | Google Search Ads |
| CAPI/conversion tracking for alt platforms | Organic social strategy (→ social-media-marketing-organic-worker-bee) |
| Channel-fit ICP diagnosis | CRM schema for ad-attributed leads (→ db-worker-bee) |
| Budget allocation frameworks | GDPR/CCPA pixel compliance audit (→ security-worker-bee) |
| Creative specs per platform | Cold outbound email (→ cold-outreach-worker-bee) |

---

## Critical directives (from Command Brief)

1. **Channel-fit diagnosis before setup** - Never set up campaigns without first diagnosing ICP-to-platform fit
2. **Minimum viable spend thresholds** - LinkedIn: ~$2K/month minimum; TikTok: ~$50/day minimum. State threshold explicitly if budget is below it
3. **CAPI is not optional for TikTok and LinkedIn** - Pixel-only attribution is ~60-70% accurate post-iOS 14.5+; server-side CAPI is the 2026 baseline
4. **Never recommend more platforms than the team can execute** - Recommend depth over breadth
5. **Benchmark CPLs are directional, not contractual** - Always surface ranges, not single numbers

---

## Stinger structure (proposed in Command Brief)

The `alt-ads-platforms-stinger` should produce 13 guides, 4 templates, and worked ICP examples:

**Guides:**
- `00-principles.md` - Philosophy, MVS thresholds, CAPI doctrine
- `01-channel-fit-diagnosis.md` - ICP-to-platform matrix, scoring rubric, CPL benchmarks
- `02-linkedin-ads.md` - Campaign structure, Lead Gen Forms, CAPI, CPL $50-$200
- `03-tiktok-ads.md` - Spark Ads, Smart+, CAPI, creative hooks
- `04-reddit-ads.md` - Subreddit targeting, Reddit Pixel, attribution windows
- `05-microsoft-bing-ads.md` - LinkedIn profile targeting (unique differentiator), UET, import from Google
- `06-x-twitter-ads.md` - Platform volatility caveats (2024-2026 instability)
- `07-pinterest-ads.md` - Shopping Catalogs, Performance+, longer attribution windows
- `08-quora-ads.md` - Question-based targeting, Promoted Answers, B2B fit
- `09-youtube-standalone.md` - TrueView, Bumpers, Shorts, standalone vs within Google Ads
- `10-podcast-advertising.md` - Spotify Ad Studio, programmatic podcast, host-read vs produced
- `11-campaign-architecture.md` - UTM structure, A/B testing, dayparting
- `12-capi-wiring.md` - TikTok CAPI, LinkedIn CAPI, Pinterest CAPI, deduplication

**Templates:**
- `channel-fit-scorecard.md`
- `campaign-launch-checklist.md`
- `creative-specs-table.md`
- `utm-naming-convention.md`

---

## Relationship to neighboring Angels

| Angel | Relationship |
|---|---|
| `social-media-marketing-organic-worker-bee` | Complementary - organic posts vs paid campaigns. No overlap; paid campaigns hand off to organic for sustained presence |
| `cold-outreach-worker-bee` | Complementary - outbound email vs paid inbound acquisition. Different channels, often used together in demand gen motions |
| `security-worker-bee` | Downstream - GDPR/CCPA compliance of tracking pixels should be audited by security-worker-bee after CAPI is wired |
| `db-worker-bee` | Downstream - CRM schema for ad-attributed leads belongs to db-worker-bee, not this Angel |

---

## Open questions from Command Brief (for stinger-forge to address)

1. **LinkedIn CAPI GA status** - Is LinkedIn Conversions API generally available for all ad accounts in 2026, or still in beta/limited access?
2. **TikTok Smart+ as default** - Has Smart+ fully replaced standard campaign setup as the recommended default in 2026?
3. **X/Twitter Ads stability** - What is the current state of advertiser trust on X in 2026 following 2024 policy changes?
4. **Quora relevance** - Are Quora Ads still viable B2B in 2026 given AI-generated answers reducing organic Quora traffic?

---

## Launch priority and refresh cadence

- **Priority:** medium-high (frequently requested by founders diversifying from Meta/Google)
- **Refresh cadence:** every 6 months (platform CPLs and products shift significantly year-over-year; TikTok in particular)
- **X/Twitter chapter:** quarterly review recommended due to platform volatility
