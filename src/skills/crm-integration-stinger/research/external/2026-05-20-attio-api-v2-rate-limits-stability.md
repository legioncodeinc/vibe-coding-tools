---
source_url: https://docs.attio.com/rest-api/guides/rate-limiting
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: attio-api
stinger: crm-integration-stinger
---

# Attio API v2 - Rate Limits, Webhook Delivery, and Production Integration Readiness (2026)

## Summary

Attio's v2 REST API is production-ready in 2026, with documented rate limits, v2 webhook delivery, and an official migration path from v1. The API is well-documented at docs.attio.com. Key concerns for production integration: no bulk write API (one record per request), strict per-workspace rate limits shared across all integrations, and a v1-to-v2 webhook migration that must be completed before v1 endpoints are removed.

### API Rate Limits (Official, 2026)

| Limit Type | Value |
|---|---|
| Read requests | 100 per second (per workspace) |
| Write requests | 25 per second (per workspace) |
| HTTP response on limit | 429 Too Many Requests with `Retry-After` header |
| List query scoring | Score-based, 10-second sliding window |

**Critical detail: limits are per-workspace, not per-integration.** If Zapier, a webhook, and a custom script are all writing to the same Attio workspace simultaneously, they share the 25 writes/sec budget. During bulk import operations, pause other integrations.

**Score-based rate limits on List endpoints:** `GET /v2/objects/{object}/records` and list entry endpoints use a complexity score. Complex filters and sorts burn more of the score budget. If a single query exceeds the per-query score limit, simplify the filter - retrying the same complex query will not help; the limit is per-query, not per-window.

**Practical implication for bulk sync:** At 25 writes/second, importing 50,000 records takes a minimum of ~33 minutes of pure write time (not including reads, retries, or relationship linking). There is **no Bulk API equivalent** for Attio - all writes are one record per request.

**At `500 writes/sec` target with `25/sec` actual limit:** You cannot import large datasets quickly. Plan for extended sync windows for initial data loads.

### Webhook Delivery (v2)

Attio's v2 webhooks replace v1 webhooks and must be used for new integrations:

- **At-least-once delivery** (not exactly-once). Attio may send duplicate messages due to network instability.
- **Idempotency-Key header:** Different for each message, but the **same across retries and redeliveries**. Use this as your dedupe key for webhook handlers.
- **5-second response timeout:** Must respond within 5 seconds or the delivery is treated as failed.
- **Retry policy:** Up to 10 retries with exponential backoff, over ~3 days total. After that, webhook marked as degraded and email notification sent.
- **Delivery rate limiting:** 25 requests/sec per target URL. Contact Attio support to increase.

**v2 improvements over v1:**
- New filtering system on webhook subscriptions (filter events by attribute values before delivery)
- Payloads consistent with the v2 API (uses "lists" terminology instead of "collections")
- Both v1 and v2 will be delivered during migration overlap period - make webhook handlers idempotent for this transition

**V1 deprecation:** v1 webhook endpoints will eventually be removed. Migrate to v2 at the earliest opportunity.

### Object and Record Limits by Plan

| Plan | Users | Records | Custom Objects | API Tier |
|---|---|---|---|---|
| Free ($0) | Up to 3 | 50,000 | 3 custom objects | Rate limited |
| Plus ($29/user/mo, annual) | Unlimited | 250,000 | More custom objects | Standard |
| Pro ($59/user/mo, annual) | Unlimited | 1,000,000 | Full custom objects | Standard |
| Enterprise (custom) | Unlimited | Custom | Unlimited | Custom SLAs |

**No monthly billing available** on paid plans - annual commitment required.

### Production Readiness Assessment (May 2026)

Attio's API is **production-ready** for bi-directional sync with the following caveats:
1. No bulk write API - large initial data loads require patience and careful rate-limit management
2. Rate limits are per-workspace and shared - concurrent integrations compete for budget
3. Score-based limits on list queries require thoughtful query design
4. v1 webhooks must be migrated to v2 before v1 endpoints are removed
5. Custom objects require Pro or Enterprise plan

**G2 and market signals (2026):** Attio has G2 ratings of 4.7/5 with 96% satisfaction for pipeline management. Product Direction score of 9.4 vs HubSpot 8.7 and Salesforce 8.3 - the highest momentum CRM in the market.

## Key quotations / statistics

- "Our rate limit across the whole API is 100 requests per second for read requests, 25 requests per second for write requests." (docs.attio.com/rest-api/guides/rate-limiting, Feb 2026)
- "Rate limiting is implemented on a per-target URL basis. We restrict delivery per URL to a maximum of 25 requests per second." (docs.attio.com/rest-api/guides/webhooks, Apr 2026)
- "Webhooks guarantee at-least-once message delivery. Attio includes an Idempotency-Key header which will be different for each message, but the same between retries and redeliveries." (docs.attio.com, Jan 2026)
- "Attio's rate limits are per-workspace, not per-integration. If another tool is writing to the same Attio workspace during your migration, you share the 25 writes/sec budget." (clonepartner.com Attio migration guide, Apr 2026)
- "At 25 writes/sec, importing 50,000 records takes a minimum of ~33 minutes of pure write time — not counting reads, retries, or relationship linking." (clonepartner.com, Apr 2026)
- "No native bulk API. Attio's API handles one record per request." (clonepartner.com, Apr 2026)

## Annotations for stinger-forge

- **guides/01-integration-architecture.md:** Add Attio-specific rate limit math to the polling architecture section. At 25 writes/sec, Attio is substantially more constrained than HubSpot for write-heavy sync patterns. For bi-directional sync, budget write capacity carefully and design bulk-load windows before enabling real-time sync.
- **guides/02-crm-data-models.md:** Add an Attio-specific section covering: (1) no fixed Lead object (use custom objects or the built-in People and Companies objects), (2) per-workspace rate limits shared across all apps, (3) Idempotency-Key pattern for webhook handlers using Attio's native header.
- **guides/04-sync-and-conflicts.md:** The Attio `Idempotency-Key` header is the correct dedupe key for Attio webhook handlers - encode this specifically, as it differs from HubSpot's `(portalId, objectId, occurredAt)` pattern.
- **Command Brief question answered:** Is Attio's API stable enough for production bi-directional sync in 2026? **Yes**, with caveats around rate limits (25 writes/sec per workspace, no bulk API) and the mandatory v1→v2 webhook migration. Not suitable for high-volume sync (>500K records/day) without dedicated rate-limit engineering.
- **guides/07-implementation-review.md:** Add Attio-specific checklist item: Is the webhook handler using `Idempotency-Key` header for dedupe, not attempting to extract a dedupe key from the payload itself?
