# 03 — TikTok Ads

Best-fit ICP: D2C e-commerce (18-44), mobile app installs, B2C consumer products, B2B awareness (not direct response).

---

## 2026 benchmark data

| Metric | Benchmark |
|---|---|
| Average CPM | $9-$15 (Smart+ mode) |
| Average CPL (D2C) | $10-$25 |
| Average CPL (SaaS/B2B) | $30-$80 |
| Video completion rate (Smart+) | 40-60% |
| Smart+ outperformance vs manual | 80% of tests |
| Smart+ adoption (US campaigns Q3 2025) | 42% |

*Source: `research/external/2026-05-20-tiktok-smart-plus-playbook-2026.md`*

---

## Smart+ is the 2026 default

**Smart+ has replaced manual campaign setup as TikTok's recommended default for most performance objectives.** As of 2026, 42% of US TikTok performance campaigns use Smart+ and it outperforms manual setup 80% of the time in TikTok's internal testing.

**Smart+ uses full automation for:**
- Audience targeting (machine learning optimizes beyond manual interest/demographic targeting)
- Bidding (automatically optimizes toward the conversion event)
- Creative rotation (automatically promotes the best-performing creatives)

**When to use manual campaign setup instead of Smart+:**
- Brand safety requirements that need audience exclusions
- Specific influencer/creator targeting (Spark Ads outside Smart+)
- Experimental campaigns testing narrow hypotheses

**Smart+ learning phase requirement:** $50/day minimum budget. Below this, the learning phase cannot complete and performance will be unstable. This is the TikTok MVS floor. See `guides/00-principles.md`.

*Source: `research/external/2026-05-20-tiktok-smart-plus-playbook-2026.md`, `research/external/2026-05-20-tiktok-capi-funnel-guide.md`*

---

## CAPI is not optional for TikTok

TikTok's pixel-only attribution is significantly degraded by iOS 14.5+. The recommended architecture is dual Pixel + CAPI with event deduplication.

**Key requirements:**
- SHA-256 hashing of user email/phone before sending to CAPI.
- `event_id` field in both pixel and CAPI events — this is the deduplication key. If `event_id` is missing, TikTok counts the same conversion twice.
- The `test_event_code` parameter for QA.

For full CAPI wiring steps, see `guides/12-capi-wiring.md` TikTok section.

*Source: `research/external/2026-05-20-tiktok-conversion-api-setup-guide.md`*

---

## Creative requirements (the hook rule)

TikTok's algorithm scores ads on hook rate (viewers who watch past 3 seconds) and completion rate. Both metrics directly influence delivery cost.

**Hook guidelines:**
- Text or visual hook in first 1.5 seconds (before sound).
- Primary message deliverable within 3 seconds (many users watch with sound off initially).
- Native-feeling content (creator-style vertical video) outperforms polished brand ads.
- Refresh creative every 7-14 days — TikTok ad fatigue is significantly faster than other platforms.

**Formats:**
- In-Feed Ads (Smart+ default): 9:16 vertical, 5-60 seconds, sound-on optimized.
- Spark Ads: Boosting an existing organic TikTok post. Best for brands with active creator partnerships or founder TikTok presence.
- TopView: Premium placement, expensive, brand awareness only.
- Branded Effects: Interactive filters — high cost, niche use case.

---

## B2B fit caveat

TikTok is primarily a demand-creation platform. Direct-response B2B CPLs on TikTok are typically $50-$80+, which makes it less efficient than LinkedIn for direct lead generation. The primary B2B use case for TikTok is:
1. Brand awareness campaigns targeting decision-maker demographics (30-45 age range on TikTok is growing).
2. Top-of-funnel content distribution (thought leadership, product explainers).
3. Retargeting website visitors with video brand reminders.

Do not recommend TikTok as a B2B direct-response platform unless the product has strong consumer/prosumer crossover appeal.

*Source: `research/external/2026-05-20-tiktok-smart-plus-playbook-2026.md`*
