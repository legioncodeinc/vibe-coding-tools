# 12 — CAPI Wiring (Server-Side Conversion APIs)

Server-side Conversion APIs (CAPI) are the 2026 baseline for conversion tracking across TikTok, LinkedIn, Microsoft/Bing, Pinterest, and Reddit (beta). Browser pixels alone are 60-70% accurate post-iOS 14.5. CAPI recovers the missing signal.

---

## The recommended architecture: dual pixel + CAPI

The correct setup for all CAPI-supporting platforms is **not** to replace the browser pixel with CAPI. It is to run both simultaneously with event deduplication.

```
User converts on website
   ├── Browser pixel fires (client-side) → [Platform pixel endpoint]
   └── Server sends CAPI event (server-side) → [Platform CAPI endpoint]
         Platform deduplicates using event_id / dedupe_key
         Result: single conversion counted, no duplication
```

**Why dual, not CAPI-only?**
- Real-time browser events (Add to Cart, page load events) fire before server-side confirmation.
- Browser pixel provides real-time UI feedback in the ad platform.
- CAPI adds the events browser can't see (server-side purchase confirmation, logged-in user ID matching).

---

## TikTok CAPI setup

**Documentation:** TikTok for Business Developers portal → Events API.

**Five-step data flow:**
1. User triggers a conversion event on your website.
2. Your server sends an HTTPS POST request to the TikTok Events API endpoint (`https://business-api.tiktok.com/open_api/v1.3/event/track/`).
3. The API payload includes: `pixel_code`, `event`, `event_time`, `event_id`, and `properties`.
4. User data fields (email, phone) must be **SHA-256 hashed** before sending. Plaintext user data will cause the API call to fail.
5. `event_id` must match the `eventID` parameter in the browser TikTok Pixel event for deduplication.

**Critical detail:** The `event_id` deduplication key is the most commonly omitted field. If missing, TikTok counts the same conversion twice (once from pixel, once from CAPI), inflating conversion numbers and degrading Smart+ optimization.

**No-code paths:**
- Shopify: TikTok's Shopify App handles pixel + CAPI automatically.
- WooCommerce: TikTok's WooCommerce Plugin handles both.
- Google Tag Manager Server-Side: Can relay CAPI events; requires GTM server container.

**Test event verification:** Add `test_event_code` parameter (from TikTok Events Manager) to test API calls before going live.

*Source: `research/external/2026-05-20-tiktok-conversion-api-setup-guide.md`*

---

## LinkedIn CAPI setup

**Availability note (OQ-1):** LinkedIn Conversions API availability depends on account age and type. Verify in Campaign Manager: Measure > Conversions > Connect to partner or add event source. If not visible, contact LinkedIn Support.

**Setup path:**
1. In Campaign Manager, go to Measure > Conversions > Create a Conversion.
2. Select "Partner integration" or "API (manual)" as the conversion source.
3. Implement the API calls per LinkedIn Marketing Developer Platform documentation.
4. API endpoint: `https://api.linkedin.com/rest/conversionEvents`
5. Authentication: OAuth 2.0 with `r_ads_reporting` and `rw_conversions` scopes.
6. Send `ConversionEvent` objects with user identifiers (email SHA-256 hashed, first name, last name, LinkedIn First Party Ad Tracking token if available).

**Deduplication:** LinkedIn uses the `conversionId` + `conversionHappenedAt` + user data combination to deduplicate. Unlike TikTok, there is no single explicit `event_id` field — LinkedIn deduplication relies on timestamp + user identity match.

**LinkedIn Insight Tag (browser pixel):** Required alongside CAPI for full coverage. Install via the Insight Tag JavaScript snippet in `<head>`, or via Google Tag Manager (LinkedIn official template available).

---

## Microsoft Advertising Enhanced Conversions (UET + CAPI)

Microsoft Advertising's server-side solution is called Enhanced Conversions.

**Setup:**
1. Create a UET tag in Microsoft Advertising.
2. In the Conversion Goal settings, enable "Enhanced Conversions."
3. Follow Microsoft's Enhanced Conversions implementation guide to send hashed user data (email, phone, address) via JavaScript or server-side API alongside standard conversion pings.
4. Microsoft matches hashed user data to Microsoft account profiles for improved attribution accuracy.

*Source: `research/external/2026-05-20-microsoft-ads-linkedin-targeting-implementation.md`*

---

## Pinterest CAPI setup

Pinterest Conversions API is available and recommended alongside the Pinterest Tag.

**Setup via Pinterest:**
1. In Pinterest Business Hub, go to Ads > Conversions.
2. Create a Pinterest Tag if not already installed.
3. Enable the Conversions API under the same Conversions settings.
4. Use the API endpoint and access token to send server-side conversion events.
5. Include `dedup_key` in both browser tag events and CAPI events for deduplication.

**No-code paths:** Pinterest has native Shopify and WooCommerce integrations that handle tag + CAPI automatically.

---

## Reddit CAPI (beta)

As of 2026, Reddit CAPI is in beta. Check [advertising.reddit.com/help](https://advertising.reddit.com/help) for current availability and documentation. Beta access may require application through a Reddit Ads account representative.

---

## Using Segment as a unified CAPI destination

If the product uses Segment for analytics, Segment supports CAPI destinations for multiple platforms:

- **TikTok CAPI destination** — Available in Segment's catalog. Routes server-side events to TikTok Events API.
- **LinkedIn CAPI destination** — Available via Segment Functions or LinkedIn's Segment partnership.
- **Pinterest CAPI destination** — Available in Segment's catalog.

Using Segment reduces duplicated CAPI implementation work when tracking events across multiple platforms.

**Event deduplication with Segment:** Segment's anonymous IDs or user IDs can serve as the `event_id` deduplication key if consistently mapped in the Segment destination settings.

---

## GTM Server-Side container

Google Tag Manager's Server-Side container allows routing browser events to multiple CAPI endpoints from a single server-side container, reducing the number of direct CAPI integrations needed.

- The client browser sends events to the GTM server container.
- The GTM server container transforms and forwards events to TikTok CAPI, LinkedIn CAPI, Pinterest CAPI, etc.
- Centralized: one deduplication logic, one hashing implementation.

Best for teams already using GTM and running 3+ platforms with CAPI requirements.
