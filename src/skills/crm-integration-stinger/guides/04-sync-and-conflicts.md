# Bi-Directional Sync and Conflict Resolution

The canonical architecture for bi-directional CRM sync. This is the most complex guide in the stinger because conflict resolution has no universally correct answer -- the worker-bee's job is to make the policy explicit before any code is written.

## The four-loop architecture

All production bi-directional CRM syncs should implement four loops:

### Loop 1: Event ingestion

**Input:** Webhook payload from CRM (or product event)
**Action:** Validate signature → respond HTTP 200 immediately (before processing) → enqueue event with idempotency key → return

**Critical rules:**
- Respond 200 before processing. CRM webhooks time out in 5 seconds (HubSpot, Attio). A slow processing path causes retries and duplicate events.
- Store the raw payload. You will need it for debugging and reconciliation.
- The idempotency key should be `(source_crm_id, object_id, event_type, occurred_at)` -- NOT the webhook's `eventId` (HubSpot's `eventId` is NOT globally unique).

### Loop 2: Write propagation (worker)

**Input:** Dequeued event
**Action:** Deduplicate → rate-limit check → transform → write to target system → record result

**Echo prevention (choose one):**

**Option A -- Actor metadata:** Tag writes with an actor identifier (`"updated_by": "crm-sync-service"`). In the ingestion loop, discard any event where `actor == crm-sync-service`. Requires the CRM to propagate actor metadata through webhooks (Salesforce CDC supports this; HubSpot does not as of 2026).

**Option B -- Watermark-based delta sync:** Track `last_successful_sync_at` per resource per account. On each sync run, only process records modified after the watermark. Two simultaneous writes from different sides will both appear as "modified after watermark" -- rely on conflict resolution to handle them.

Option A is cleaner. Option B is more portable. Use Option A when the CRM supports actor metadata in webhooks; fall back to Option B otherwise.

### Loop 3: Conflict resolution

**Input:** Two competing writes for the same field from two sources
**Action:** Apply the conflict resolution policy → write the winning value → log the conflict

**The four conflict resolution policies (choose exactly one):**

| Policy | When to use | Risk |
|---|---|---|
| **Last-write-wins** | Simple, low-stakes data where the latest value is almost always correct (e.g., last login timestamp) | Silent data corruption when writes cross in flight |
| **CRM-authoritative** | CRM is the system of record; product is a read consumer (common for sales-owned data) | Product writes are silently overwritten by CRM |
| **Product-authoritative** | Product is the system of record; CRM is a display layer (common for usage data, billing data) | CRM edits are silently overwritten by product sync |
| **Human-review queue** | High-stakes fields where the correct value requires human judgment (e.g., legal contact name, contract value) | Operational overhead; queue must be monitored |

**The field ownership matrix (recommended for complex integrations):**

Don't pick one policy for all fields. Apply policies per field category:

| Field category | Recommended policy | Example fields |
|---|---|---|
| Product-generated data | Product-authoritative | `last_login_at`, `monthly_active_days`, `subscription.plan` |
| Sales-generated data | CRM-authoritative | `deal_stage`, `close_date`, `sales_notes` |
| Shared data (either side can edit) | Last-write-wins with timestamp | `email`, `phone`, `company_name` |
| High-stakes / legal | Human-review queue | `contract_value`, `legal_entity_name` |
| Consent / Do Not Contact | Most-restrictive-wins | `unsubscribed`, `do_not_contact`, `gdpr_opt_out` |

### Loop 4: Reconciliation job

**Input:** All records in both systems
**Action:** Nightly truth pass -- compare product and CRM state for all records modified in the last 48 hours → resolve discrepancies → log differences

**Why reconciliation is required:** Webhooks are at-most-once (HubSpot) or at-least-once (Attio) but never exactly-once. The reconciliation job is the safety net that catches events dropped during service outages, rate limit exhaustion, or deployment windows.

Schedule: nightly, during off-peak hours. Scope: records modified in the last 24-48 hours (not full scan -- that blows rate limits).

---

## CRM-specific webhook characteristics

| CRM | Delivery guarantee | Ordering guarantee | Dedupe key | Timeout | Retries |
|---|---|---|---|---|---|
| HubSpot | At-most-once | None | `(portalId, objectId, occurredAt)` | 5 seconds | 10 over 24 hours |
| Salesforce CDC | At-least-once | None (replay_id not contiguous) | `replayId` per channel | Governed | 72-hour retention |
| Attio | At-least-once | None | `Idempotency-Key` header | 5 seconds | 10 over ~3 days |
| Pipedrive | At-most-once | None | Event ID (verify) | Verify | Verify |

**Design implication:** Treat all CRM webhooks as unreliable. The reconciliation job (Loop 4) is the guarantee, not the webhooks.

---

*Sources: `research/external/2026-05-20-bidirectional-sync-architecture.md`, `research/external/2026-05-20-hubspot-api-rate-limits-webhooks.md`, `research/external/2026-05-20-attio-api-v2-rate-limits-stability.md`, `research/external/2026-05-20-salesforce-data-model-lead-contact-lifecycle.md`*
*Demonstrates: `examples/hubspot-bidirectional-sync.md` (sync architecture section)*
