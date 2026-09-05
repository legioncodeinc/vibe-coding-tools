---
source_url: https://funnel.io/blog/tiktok-conversion-api
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: tiktok-capi
stinger: alt-ads-platforms-stinger
---

# What is TikTok's Conversion API? A Guide for Performance Marketers - Funnel.io

## Summary
Funnel.io's guide to TikTok CAPI focused on the supported event types, required payload parameters, and integration options (including no-code tools like Funnel itself). Good secondary reference for the technical implementation requirements and supported standard events.

## Key quotations / statistics
- "TikTok's Conversion API lets you push data from your CRM, data warehouse or custom events directly into your ad platform for better tracking."
- **Five-step CAPI flow:**
  1. Record the action
  2. Format the event (add parameters + hashed match keys)
  3. Send to TikTok Events API endpoint with access token
  4. Deduplicate with Pixel via event_id
  5. Match and report
- **Required event payload fields:**
  - event_name (e.g., CompletePayment, SubmitForm)
  - event_time (UNIX timestamp)
  - event_id (deduplication)
  - value and currency (for transactions)
  - hashed match keys (email, phone, IP address)
- **Supported event types:**
  - Standard events: Purchase, Add to Cart, Submit Form, Subscribe, View Content
  - Custom events: loyalty sign-ups, trial activations
  - Multiple sources: web, mobile apps, offline (in-store, phone orders)
- "This setup works best when used alongside the TikTok Pixel" — not one replacing the other
- "Pair the TikTok Pixel with the Conversion API to capture both browser and server-side actions so reporting stays accurate even when cookies are blocked."

## Annotations for stinger-forge
- **Secondary technical reference for `guides/12-capi-wiring.md`** TikTok section - use TikAdTools source as primary, this as confirmation
- The offline event support (in-store, phone orders) is notable for B2B SaaS companies tracking demo calls or offline conversions from CRM
- The "custom events for trial activations" use case is directly relevant to SaaS products - should be called out specifically in `guides/03-tiktok-ads.md`
- The standard event list should inform the `templates/campaign-launch-checklist.md` conversion event setup checklist
