---
source_url: https://developers.hubspot.com/docs/developer-tooling/platform/usage-guidelines
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: hubspot-api-limits-webhooks
stinger: crm-integration-stinger
---

# HubSpot API Rate Limits, Webhook HMAC Validation, and OAuth Token Management (2026)

## Summary

HubSpot's 2026 API governance comprises three interlocking concerns: rate limits (per-app burst and per-account daily quotas), webhook security (HMAC SHA-256 signature validation with v3 as the current standard), and OAuth token lifecycle (30-minute access token TTL with proactive refresh). All three must be encoded in any production HubSpot integration and in the code review checklist for `guides/07-implementation-review.md`.

### Rate Limits (as of March 2026)

HubSpot's rate limit model is split by app distribution type:

**Publicly distributed OAuth apps (2025.2 and 2026.03 developer platform versions):**
- 110 requests per 10 seconds per HubSpot account that installed the app (does not apply to CRM Search API)

**Privately distributed apps:**

| Product Tier | Per 10 Seconds (per app) | Per Day (shared across account) |
|---|---|---|
| Free and Starter (any Hub) | 100 / app | 250,000 / account |
| Professional (any Hub) | 190 / app | 625,000 / account |
| Enterprise (any Hub) | 190 / app | 1,000,000 / account |
| With API Limit Increase add-on | 250 / app | +1,000,000 / account per add-on (max 2) |

Rate limit responses return HTTP 429 with a `message` and `policyName` indicating whether the daily or 10-second limit was hit. The daily limit resets at midnight in the account's configured timezone.

**Engineering guidance:** If repeatedly hitting the `TEN_SECONDLY_ROLLING` limit, throttle requests using exponential backoff with jitter. Use batch APIs and cache results - for any data fetched on page load or in batch jobs, cache it rather than calling the API repeatedly. Webhook calls via HubSpot workflows do NOT count against the API rate limit.

### Webhook HMAC Signature Validation

**Current standard (v3):** Look for `X-HubSpot-Signature-v3` and `X-HubSpot-Request-Timestamp` headers.

**v3 validation steps:**
1. Check the timestamp header; reject any request older than 5 minutes (prevents replay attacks)
2. Decode specific URL-encoded characters in the request URI: `:`, `/`, `?`, `@`, `!`, `$`, `'`, `(`, `)`, `*`, `,`, `;`
3. Create an HMAC SHA-256 hash using the app's client secret
4. Base64-encode the result
5. Compare to the `X-HubSpot-Signature-v3` header using **constant-time comparison** (`crypto.timingSafeEqual()` in Node.js)

**v2 and v1 (legacy):** SHA-256 (not HMAC); `clientSecret + method + uri + requestBody` (v2) or `clientSecret + requestBody` (v1); returns hex not base64. These are encountered in legacy workflows; upgrade to v3 for new integrations.

**Critical security rules:**
- Always validate signatures before processing webhook data. Never trust a POST to your endpoint just because it arrived.
- Use constant-time comparison to prevent timing attacks.
- Reject requests older than 5 minutes (timestamp check).

### Webhook Delivery Guarantees

- HubSpot retries failed deliveries up to **10 times** over the next 24 hours.
- Retry triggers: connection failure, timeout (> 5 seconds to respond), any 4xx or 5xx response.
- Retries use randomized delays to prevent thundering herd.
- **Ordering and uniqueness:** HubSpot does NOT guarantee delivery order. MAY send the same notification multiple times. `eventId` is NOT guaranteed unique.
- **Max subscriptions:** 1,000 per app.
- **Required:** Webhook endpoint must be HTTPS.

### OAuth Token Lifecycle

- Access tokens expire in **1,800 seconds (30 minutes)**. Store the expiration timestamp at token receipt and refresh proactively before expiry, not reactively on 401.
- HubSpot released OAuth v3 API endpoints in January 2026 with enhanced security features. v1 is deprecated but still operational. New integrations should use v3.
- Use locking with 10-30 second timeout on token refresh operations to handle concurrent refresh attempts from multiple servers.

## Key quotations / statistics

- "HubSpot includes signature headers in every webhook request. The signature is an HMAC SHA-256 hash (for v3) or SHA-256 hash (for v2 and v1), built using your app's client secret and details from the request." (developers.hubspot.com, Jan 2026)
- "For v3 signature validation... First, check the timestamp and reject any request older than 5 minutes. This prevents replay attacks." (developers.hubspot.com, Jan 2026)
- "Use constant-time comparison when checking signatures (like crypto.timingSafeEqual() in Node.js). This prevents timing attacks." (developers.hubspot.com, Jan 2026)
- "Notifications will be retried up to 10 times... spread out over the next 24 hours with varying delays." (developers.hubspot.com/docs/api-reference/legacy/webhooks/guide, Apr 2026)
- "POST requests that HubSpot sends to your service via webhook subscriptions will not count against your app's API rate limits." (HubSpot webhook docs, Apr 2026)
- "Privately distributed apps [Enterprise]: 190 requests per 10 seconds per app; 1,000,000 per day shared across the account." (HubSpot usage guidelines, Mar 2026)

## Annotations for stinger-forge

- **guides/07-implementation-review.md (Code Audit Checklist):** This is the authoritative source for HubSpot-specific webhook validation. The checklist must include: (1) Is `X-HubSpot-Signature-v3` validated using HMAC SHA-256? (2) Is timestamp checked against a 5-minute window? (3) Is constant-time comparison used? (4) Does the webhook handler return 200 before doing work? (5) Is `eventId` not used as the idempotency key (use `(portalId, objectId, occurredAt)` instead)?
- **guides/04-sync-and-conflicts.md:** Encode the "does NOT guarantee ordering" and "may send same notification multiple times" rules as first-class warnings. Handlers must be idempotent and use payload `updated_at`, not delivery timestamp.
- **guides/01-integration-architecture.md:** Rate limit math for polling-based sync on HubSpot: a Professional-tier account allows 625,000 calls/day. At 100ms/call, that is ~17 hours of pure polling capacity. For a 10,000-contact account synced hourly, that requires roughly 240 daily calls - well within limits. But N+1 patterns (fetching associated records per contact) multiply this by 5-10x, potentially busting limits for accounts over 50,000 contacts.
- **guides/07:** Flag that `eventId` is not unique - a common bug where developers use `eventId` as the primary dedupe key for webhook handlers, creating missed-update holes when HubSpot sends the same event twice.
