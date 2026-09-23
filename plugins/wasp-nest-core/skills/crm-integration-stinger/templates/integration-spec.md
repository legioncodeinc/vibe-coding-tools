# CRM Integration Spec

*Template — replace all `{placeholder}` values before use.*

**Product:** {product name}
**CRM(s):** {HubSpot | Salesforce | Attio | Pipedrive | Close | Copper}
**Sync direction:** {read-only | write-only | bi-directional}
**Date:** {YYYY-MM-DD}
**Author:** {name}

---

## 1. Integration architecture

**Chosen approach:** {Native SDK | Merge.dev | Unified.to | Zapier/Make}
**Rationale:** {1-2 sentences explaining why this approach was chosen over the alternatives}
**Tools/libraries:** {e.g., `@hubspot/api-client` v{version}, Node.js {version}}

**Trade-off acknowledged:** {If Merge.dev: "Data stored at Merge.dev by default. GDPR data residency reviewed." | If native: "Engineering cost accepted for single-CRM scenario."}

---

## 2. Object mapping

| Product object | CRM object | Notes |
|---|---|---|
| {e.g., User} | {e.g., Contact} | |
| {e.g., Workspace} | {e.g., Company} | |
| {e.g., Subscription} | {e.g., Deal} | |

---

## 3. Field mapping

See `templates/field-mapping-table.md` for the complete table.

**Computed fields requiring transformation:**
- {field}: {transformation logic}
- {field}: {transformation logic}

---

## 4. Conflict resolution policy

*Required for bi-directional sync. Leave as "N/A" for unidirectional.*

| Field / Field category | Policy | Rationale |
|---|---|---|
| {e.g., email, phone} | {last-write-wins} | {rationale} |
| {e.g., deal stage} | {CRM-authoritative} | {rationale} |
| {e.g., subscription plan} | {product-authoritative} | {rationale} |
| {e.g., do_not_contact} | most-restrictive-wins | GDPR non-negotiable |

**Echo prevention method:** {Option A: actor metadata | Option B: watermark-based}

---

## 5. Sync trigger design

**Product → CRM:** {webhook | polling | event-driven background job}
**Trigger event(s):** {list product events that trigger CRM writes}

**CRM → Product:** {webhook URL | polling interval}
**Trigger event(s):** {list CRM webhook event types}

**Idempotency key scheme:** {e.g., `(portalId, objectId, propertyName, occurredAt)` for HubSpot}

---

## 6. Deduplication strategy

**Dedup check at create:** {describe the query used to check for existing records before creating new ones}
**External ID alias:** {yes | no | N/A -- if yes, describe the alias storage mechanism}
**Dedicated dedup tool (if any):** {tool name | "none"}

---

## 7. Lead enrichment (if in scope)

**Enrichment tool:** {Apollo | Clay | Breeze Intelligence | none}
**Enrichment timing:** {on-write | post-create job | lifecycle trigger}
**Fields enriched:** {list}
**Idempotency rule:** "Only write enriched values to null/empty fields. Stamp `_enriched_at` and `_enrichment_source`."

---

## 8. Rate limit analysis

**CRM rate limits:** {list relevant limits from `guides/02-crm-data-models.md`}
**Peak volume estimate:** {estimated max records/day}
**Rate limit risk:** {low | medium | high -- with calculation}

---

## 9. Error handling and reconciliation

**Failed event retry:** {queue name, retry policy, dead-letter handling}
**Reconciliation job:** {schedule, scope (e.g., records modified in last 48 hours), run time estimate}

---

## 10. Security

**Webhook signature validation:** {HubSpot v3 HMAC-SHA256 | Attio signing key | other}
**Timestamp anti-replay:** {yes | N/A}
**Data residency:** {jurisdiction, any GDPR concerns flagged}

---

*Derived from `guides/01-integration-architecture.md` through `guides/07-implementation-review.md`. See `examples/hubspot-bidirectional-sync.md` for a worked example.*
