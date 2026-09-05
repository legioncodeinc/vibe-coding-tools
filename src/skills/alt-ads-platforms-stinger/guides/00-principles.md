# 00 — Principles

Six non-negotiables that govern every `alt-ads-platforms-worker-bee` engagement.

---

## 1. Channel-fit diagnosis before setup

Never scaffold a campaign architecture before scoring ICP-to-platform fit. An incorrectly selected channel cannot be rescued by excellent execution. The most common waste pattern in alternative paid acquisition is technically correct LinkedIn campaigns running for a consumer ICP, or TikTok campaigns for a B2B audience with $20/day budget. The diagnosis step in `guides/01-channel-fit-diagnosis.md` gates all downstream work.

**Enforcement:** If a user asks "how do I set up LinkedIn Ads?" without providing an ICP, ask for ICP before any setup guidance.

---

## 2. Minimum viable spend thresholds are gates, not guidelines

Each platform requires a minimum budget to produce optimizable data. Below these thresholds, campaign performance data is statistically meaningless and optimization decisions are random.

| Platform | MVS / month | Why |
|---|---|---|
| LinkedIn Ads | $1,500-$5,000 | Lead Gen Form optimization requires 50+ conversions; below $1,500 this takes months |
| TikTok Ads | ~$1,500 ($50/day) | Smart+ learning phase requires $50/day minimum to exit learning |
| Reddit Ads | ~$1,000 | CPM campaigns need enough impressions to reach statistical significance |
| Microsoft/Bing Ads | ~$500 | Lower than LinkedIn/TikTok because import-from-Google shortens learning time |
| Quora/Pinterest/Spotify | ~$500 | Minimum to generate enough data for creative iteration |

**Enforcement:** When user budget is below the MVS for their target platform, state the threshold explicitly, explain why optimization requires it, and offer two options: (a) delay launch until budget is available, (b) test at reduced scale knowing results will be directional only.

*Source: `research/external/2026-05-20-linkedin-b2b-saas-pipeline-guide-growthspree.md`, `research/external/2026-05-20-tiktok-smart-plus-playbook-2026.md`*

---

## 3. CAPI is the 2026 baseline for TikTok and LinkedIn

Browser pixels are ~60-70% accurate for attribution post-iOS 14.5 (2021), macOS Safari ITP, and Firefox's Enhanced Tracking Protection. For platforms that support server-side Conversion APIs (TikTok, LinkedIn, Microsoft/Bing, Pinterest, Reddit in beta), CAPI is not an advanced feature — it is the accuracy baseline.

**Enforcement:** When setting up any TikTok, LinkedIn, or Microsoft/Bing campaign, always include CAPI wiring instructions. Never deliver a pixel-only setup as the complete implementation. See `guides/12-capi-wiring.md`.

*Source: `research/external/2026-05-20-tiktok-conversion-api-setup-guide.md`, `research/external/2026-05-20-tiktok-capi-funnel-guide.md`*

---

## 4. Depth over breadth

Under-resourced multi-channel setups produce mediocre results everywhere. A founder or small growth team running 3-4 platforms simultaneously will run each at 25-33% of the creative velocity, audience refinement cadence, and bidding attention required to optimize.

**Recommendation protocol:**
1. Always recommend a primary platform (highest ICP match, highest intent).
2. Optionally add one test platform (asymmetric opportunity, lower CPL, or unique audience).
3. Never recommend more than 3 platforms simultaneously for a team smaller than 3 marketers.
4. State the optimization cadence each platform requires (LinkedIn: 2-week review cycles; TikTok: 3-5 day creative refresh).

*Source: `research/external/2026-05-20-b2b-paid-media-channel-selection-framework.md`*

---

## 5. Benchmark CPLs are ranges, not targets

Published CPL benchmarks reflect mature, optimized campaigns run by experienced operators. Initial campaign launches will typically produce CPLs 2-3x above the benchmarks. Always:
- State the benchmark range (not a single number) from the research.
- Explicitly tell the user that 2-3x above benchmark is normal for the first 30-90 days.
- Define a success threshold for the test budget that accounts for this (e.g., "if CPL is under 3x benchmark after 30 days, continue optimizing").

*Source: `research/external/2026-05-20-linkedin-ads-benchmarks-2026-by-industry.md`*

---

## 6. X/Twitter is the most volatile platform in this stinger's universe

X/Twitter Ads has had significant policy changes, advertiser trust disruptions, and platform instability since 2022. `guides/06-x-twitter-ads.md` is the only guide in this stinger that carries a mandatory quarterly review flag. Always tell users to verify current X/Twitter platform status at [business.twitter.com](https://business.twitter.com) before acting on any X Ads guidance.

**Enforcement:** Never recommend X/Twitter as a primary or core platform for conversion-focused campaigns. Position it as a brand/thought-leadership supplementary channel only, and only for teams with existing X audience engagement.

*No 2026 research sources found for X/Twitter — synthesized from training knowledge with caveats.*
