---
title: "Bi-Directional CRM Sync - Conflict Resolution, Idempotency, and Echo Prevention 2026"
url: https://truto.one/blog/architecting-real-time-crm-syncs-for-enterprise-a-technical-guide/
source_type: practitioner-blog
authority: high
relevance: high
topic: sync-architecture
retrieved: 2026-05-20
---

# Bi-Directional CRM Sync Architecture - 2026 Best Practices

## Summary

Production-grade bi-directional CRM sync requires four explicit loops: **event ingestion, write propagation, conflict resolution, and reconciliation**. The most common failure modes are infinite update loops (echo events), out-of-order webhook delivery, and missing reconciliation jobs. All three are solvable with known patterns.

### The four-loop architecture

**1. Event Ingestion: Accept Fast, Validate, Enqueue**
Treat webhook endpoints as ingest APIs, not workers. Validate HMAC signature, respond `200` within 5 seconds (HubSpot timeout), push payload to queue. Never do database writes synchronously in the webhook handler.

**2. Deduplication and Rate-Limit Aware Workers**
Use pragmatic dedupe keys per provider: e.g., `(portalId, objectId, occurredAt)` for HubSpot. Queue consumers enforce per-tenant/per-provider rate limits using token bucket + adaptive backoff. Respect `Retry-After` headers from CRM APIs.

**3. Conflict Resolution: Pick a Policy and Encode It**
Three viable policies:
- **Last-write-wins (timestamp):** Simplest. Breaks down when timestamps are unreliable (HubSpot webhook delivery timestamps are NOT the event timestamps).
- **Source-of-truth flag (field ownership matrix):** Each field has a designated "owner" system. Only that system's value propagates. This is the recommended approach.
- **User-mediated merge queue:** Conflicting writes go to a human review queue. Expensive but correct for high-stakes fields.

**Field ownership matrix pattern (recommended):**
| Field | Owner | Sync direction | Notes |
|---|---|---|---|
| Contact email | CRM | CRM → Product | Never let product change identity keys |
| Lifecycle stage | Product | Product → CRM | Product behavior drives stage |
| Opportunity stage | CRM | CRM → Product | Sales process lives in CRM |
| Account health score | Product | Product → CRM | Write as derived metric |

**4. Reconciliation: The Truth Pass**
Every real-time pipeline needs a nightly or hourly reconciliation job that compares `updated_at` timestamps across both systems. Webhooks can be missed during vendor outages. Without reconciliation, data drift accumulates silently.

### Echo prevention: Two methods

**Method 1 - Echo filtering at ingestion:** Drop webhook events triggered by your own writes. Use actor metadata, correlation IDs, or provider-specific origin headers to detect echoes at the edge before they reach sync logic.

**Method 2 - Watermark-based delta sync:** Track `last_successful_run` timestamp per resource per account. Only pull records modified since that watermark. Your own writes fall inside the completed window and are skipped on next pass.

### CRM-specific webhook guarantees (2026)

- **HubSpot:** Does NOT guarantee ordering. MAY send same notification multiple times. `eventId` is NOT guaranteed unique. 5-second response timeout; retries up to 10 times. Must use `(portalId, objectId, occurredAt)` as dedupe key.
- **Salesforce CDC:** 72-hour retention. `replay_id` values not guaranteed contiguous. Requires own deduplication and replay strategy.
- **General rule:** Never trust webhook delivery time as event time. Use `updated_at` from the CRM API payload.

## Key quotations / statistics

- "HubSpot states plainly that its webhooks do not guarantee ordering, may send the same notification multiple times, and `eventId` is not guaranteed to be unique." (truto.one, 2026-03-06)
- "Bidirectional sync without a conflict policy causes infinite update loops." (truto.one, 2026-03-06)
- "Define ownership and reconciliation rules upfront. Use a sync status tracker or hash comparison to detect drift before it becomes a problem." (prayagvakharia on Medium, 2025-07-08)
- "Every real-time pipeline needs a 'truth pass' due to vendor outages or webhook delivery gaps." (truto.one, 2026-03-06)
- "Use strict identity resolution policies and maintain an audit trail for correlated updates." (prayagvakharia, 2025-07-08)

## Annotations for stinger-forge

- **guides/03 (Sync Architecture):** This source is the primary reference for the entire sync guide. The four-loop architecture should be the top-level structure of the guide. The field ownership matrix table is a template the worker-bee should deliver as output.
- **guides/03:** Include a Mermaid event flow diagram showing: CRM webhook → HMAC validate → queue push → worker deduplication → field-ownership check → write/skip → reconciliation job loop. The Command Brief explicitly calls for this diagram.
- **guides/08 (Code Review Checklist):** The critical review items map directly to this research: (1) HMAC signature verification present? (2) Webhook handler responds 200 before doing work? (3) Idempotency key design uses `(provider, objectId, occurredAt)` not delivery timestamp? (4) Reconciliation job exists? (5) Field ownership matrix documented?
- **templates/sync-state-schema.sql:** The reconciliation job needs a table tracking `last_successful_run` per `(tenant_id, provider, resource_type)`. This is the table the Command Brief wants stinger-forge to produce for db-worker-bee review.
