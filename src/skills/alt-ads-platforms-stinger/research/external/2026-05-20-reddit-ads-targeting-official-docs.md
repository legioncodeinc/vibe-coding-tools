---
source_url: https://www.business.reddit.com/learning-hub/articles/how-reddit-ads-targeting-works-for-smbs
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: reddit-targeting
stinger: alt-ads-platforms-stinger
---

# How Reddit Ads Targeting Works | Reddit for Business (Official)

## Summary
Official Reddit Business documentation on the targeting system. Covers the full targeting taxonomy: community (subreddit) targeting, interest targeting, keyword targeting, demographic filters, and first-party retargeting via Reddit Pixel and Conversions API. Includes the recommended 8-step campaign setup workflow.

## Key quotations / statistics
- "The most effective campaigns layer multiple targeting types. Combine broad interests with specific community and keyword targeting to build a precise audience."
- "Install the Reddit Pixel and Conversions API to build powerful retargeting audiences based on site visitors, cart abandoners, and existing customers."
- "A successful strategy relies on A/B testing. Structure your campaigns with one targeting variable per ad group to clearly identify what drives performance."
- "Rotate your ad creatives every 7-10 days to prevent 'ad fatigue.'"
- **Bidding models by objective:** CPM for awareness, CPC for traffic, automated bidding for conversions
- **8-step setup framework:**
  1. Map ICP → community → keywords
  2. Define campaign objective (Awareness/Traffic/Conversions)
  3. Choose targeting (communities, interests, keywords)
  4. Install Reddit Pixel and/or CAPI
  5. Build first-party retargeting pools
  6. Layer demographic + device filters
  7. Launch and monitor
  8. Measure and attribute (Reddit Pixel event schema + UTM)
- "Check your attribution window (e.g., 28-day click, 1-day view) to understand how Reddit attributes conversions."
- Community segments: broad (500K+ members), medium (50K-500K), niche (<50K members): "Mix one large community with 2-4 medium/niche communities to balance reach and quality"

## Annotations for stinger-forge
- **Official source for `guides/04-reddit-ads.md`** - the targeting taxonomy and 8-step setup should be the canonical structure
- The one-targeting-type-per-ad-group rule is a critical structural requirement for Reddit campaign architecture
- The 7-10 day creative rotation cadence (faster than other platforms) should be in `guides/04-reddit-ads.md` and `guides/11-campaign-architecture.md`
- The CPM/CPC/automated bidding mapping to objectives should be in the campaign architecture section
- Attribution window (28-day click, 1-day view) is longer than some platforms - important for `guides/01-channel-fit-diagnosis.md` ROI expectations
