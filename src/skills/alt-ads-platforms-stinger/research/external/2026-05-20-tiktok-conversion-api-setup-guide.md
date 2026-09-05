---
source_url: https://tikadtools.com/blog/tiktok-conversion-api/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: tiktok-capi
stinger: alt-ads-platforms-stinger
---

# TikTok Conversion API: What It Is & How It Works in 2026 - TikAdTools

## Summary
Comprehensive technical guide to TikTok's Conversion API (CAPI / Events API). Covers the full data flow from user action to TikTok attribution, the dual Pixel+CAPI setup (TikTok's recommended approach), step-by-step setup process, deduplication via event_id, and match-key optimization. The recommended standard for 2026 CAPI implementation.

## Key quotations / statistics
- "The TikTok Conversion API, also called the TikTok Events API or CAPI, is a server-to-server connection that sends conversion event data directly from your server to TikTok, bypassing ad blockers, browser restrictions, and cookie limitations entirely."
- "TikTok explicitly recommends a dual setup: Pixel plus CAPI running together, not one replacing the other."
- "If your Pixel also fired for the same action, TikTok uses a shared event ID to remove the duplicate and avoid double-counting."
- "If you spend $50/day or more, CAPI is a must."
- **Five-step data flow:**
  1. User takes action
  2. Server formats event (adds event type, timestamp, hashed user identifiers)
  3. Server sends to TikTok Events API endpoint via secure HTTP POST
  4. TikTok deduplicates using event_id
  5. TikTok matches, attributes, and reports

### Step-by-step setup
1. TikTok Events Manager → Connect data source → Web
2. Manual Setup or Partner Integration (Shopify, GTM, CDP)
3. Choose "TikTok Pixel + Events API" (dual setup)
4. Generate access token (treat like a password)
5. Implement server-side API calls (developer or third-party tool)
6. Configure event deduplication with unique event_id
7. Test with Test Events tool in Events Manager

### Match key optimization
- Send hashed email + hashed phone on every event (highest match weight)
- Add IP address and user agent (captures consent-safe signals)
- Use SHA-256 hashing on ALL personal data before sending
- Keep event timestamps accurate (send within seconds of action)
- Prioritize Purchase and Lead events first (strongest optimization signal)

### Platform integrations (no-code CAPI)
- Shopify: Install TikTok app, connect Business account, set data sharing to "Maximum"
- WooCommerce: TikTok for WooCommerce plugin
- GTM server-side: Use TikTok CAPI tag template

## Annotations for stinger-forge
- This is the **primary technical reference for `guides/12-capi-wiring.md`** TikTok section
- The dual Pixel+CAPI recommendation with event_id deduplication should be the canonical 2026 standard, not optional
- The "if you spend $50/day or more, CAPI is a must" rule aligns with the Command Brief's "CAPI is not optional" directive - should be included verbatim in `guides/00-principles.md`
- The no-code Shopify/WooCommerce paths are important for non-technical founders; should be documented as the recommended starting point in `guides/03-tiktok-ads.md`
- SHA-256 hashing requirement must be mentioned - sending raw PII will cause the call to fail
