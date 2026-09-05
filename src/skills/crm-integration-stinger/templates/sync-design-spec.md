# Bi-Directional Sync Design Spec

*Template for `guides/04-sync-and-conflicts.md`. Required for all bi-directional CRM integrations.*

**Product:** {product name}
**CRM:** {CRM name}
**Date:** {YYYY-MM-DD}

---

## Conflict resolution policy (field ownership matrix)

*Must be completed before any sync code is written.*

| Field | Ownership | Policy | Rationale |
|---|---|---|---|
| {e.g., email} | Shared | Last-write-wins (timestamp) | Either side may update |
| {e.g., deal_stage} | CRM | CRM-authoritative | Sales team owns pipeline |
| {e.g., plan_tier} | Product | Product-authoritative | Billing owns plan data |
| {e.g., do_not_contact} | Shared | Most-restrictive-wins | GDPR non-negotiable |

---

## Echo prevention

**Method chosen:** {Option A: actor metadata | Option B: watermark-based delta sync}

**If Option A:**
- Actor ID written to CRM writes: `{actor identifier}`
- Discard logic: events where `actor == {actor identifier}` are dropped at ingestion

**If Option B:**
- Watermark field: `{field name, e.g., last_successful_sync_at}`
- Watermark scope: `{per resource | per account | global}`

---

## Loop 1: Event ingestion endpoint

**URL:** `{/webhooks/{crm-name}}`
**Validation:** {HMAC-SHA256 v3 with timestamp anti-replay | other}
**Idempotency key:** `{scheme, e.g., portalId:objectId:propertyName:occurredAt}`
**Queue:** `{queue name / type}`
**Response latency target:** `<200ms (before queuing)`

---

## Loop 2: Write propagation worker

**Queue consumer:** `{worker name}`
**Rate limit budget:** `{requests/second available, with calculation}`
**Batch endpoint used:** `{yes/no -- endpoint URL if yes}`
**Retry policy:** `{max retries, backoff strategy}`

---

## Loop 3: Conflict resolution

**Policy applied per:** `{field ownership matrix above}`
**Human review queue (if applicable):** `{queue name | N/A}`

---

## Loop 4: Reconciliation job

**Schedule:** `{cron expression, e.g., 0 2 * * * for 2am daily}`
**Scope:** `{records modified in last N hours}`
**Discrepancy resolution:** `{apply field ownership matrix | log and alert for human review}`
**Alert on:** `{discrepancy count > N | any critical field discrepancy}`

---

*See `guides/04-sync-and-conflicts.md` for the four-loop architecture detail. See `examples/hubspot-bidirectional-sync.md` for a worked example.*
