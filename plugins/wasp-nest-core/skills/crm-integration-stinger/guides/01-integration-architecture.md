# Integration Architecture Decision

The four-tier decision framework for how to connect a product to a CRM. Apply this guide before any field mapping or sync design work.

## The four options

### Option A: Native SDK (direct CRM API)

**Use when:** Single CRM target, or 2 CRMs with distinct enough usage patterns to justify separate codebases. Volume is high enough that per-request cost matters.

**Strengths:** Full control, no data stored at a third party, CRM-specific features fully accessible (custom objects, CRM workflows, audit logs), no per-seat or per-customer cost scaling.

**Weaknesses:** Engineering cost per CRM is substantial. HubSpot, Salesforce, and Attio each have meaningfully different auth flows, object models, webhook formats, and error handling.

**Recommended stack:**
- HubSpot: `@hubspot/api-client` (Node.js) or `hubspot-api` (Python). OAuth 2.0 with token refresh. Webhook HMAC v3 validation.
- Salesforce: `jsforce` (Node.js) or `simple-salesforce` (Python). OAuth 2.0 or Connected App JWT flow. Change Data Capture (CDC) for real-time events.
- Attio: REST API directly (no official SDK as of 2026-05). OAuth 2.0. Idempotency-Key header on all mutating requests.

### Option B: Unified API layer -- Merge.dev

**Use when:** 3+ CRM targets, time-to-market is the primary constraint, and the team can accept the data-storage trade-off and cost scaling.

**Strengths:** Single integration covers HubSpot, Salesforce, Pipedrive, Attio, Close, Copper (production-ready status varies -- verify at merge.dev/categories/crm-api before committing). Normalized Common Models reduce per-CRM data model knowledge required.

**Weaknesses:**
- Stores end-customer data indefinitely by default (GDPR PII risk -- review data residency settings before deploying).
- Pricing: $650/month for 10 Linked Accounts (Launch). At 500 customers × 3 integrations: approximately $1.17M/year. Re-run the math at every growth milestone.
- Passthrough requests count against your API budget and add latency.
- Folk, Close, and Copper integrations may be beta as of 2026-05 -- verify production status before committing.

**Passthrough escape hatch:** Merge provides a passthrough endpoint for CRM-specific API calls not covered by Common Models. Use this for custom objects, CRM-specific workflow triggers, or audit log access.

### Option C: Unified API layer -- Unified.to

**Use when:** Privacy-sensitive B2B SaaS at scale. The key differentiator is that Unified.to is a **pass-through architecture** -- it does not store end-customer data at rest.

**Strengths:** No data storage by default (resolves Merge.dev's PII concern). Usage-based pricing ($750/month for 750K API calls) scales predictably at high volume. Custom fields included on every plan.

**Weaknesses:** Smaller platform surface than Merge.dev. Fewer total integrations. Verify CRM coverage at unified.to before committing.

**When to choose Unified.to over Merge.dev:** Privacy-first products, EU data residency requirements, products with very large per-customer contact volumes where Merge.dev's Linked Account pricing becomes prohibitive.

> **Note on Vessel.dev:** Vessel is listed in some integration comparisons but has limited 2026 coverage. Verify production status at vessel.dev before recommending. Omit from primary recommendations until confirmed.

### Option D: No-code automation -- Zapier / Make

**Use when:** Non-technical team, simple unidirectional flows, no bi-directional sync requirement, low data volume, and the team accepts Zapier/Make task execution limits as the system's throughput ceiling.

**Strengths:** Zero engineering required. Fast to deploy. Native triggers and actions for most CRMs.

**Weaknesses:** No reliable bi-directional sync (Zapier does not handle conflict resolution). Task limits create invisible data loss at volume (Zapier Free: 100 tasks/month). Error handling is limited. Custom field mapping requires Zapier Formatter steps that are fragile to CRM schema changes.

**Do not use for:** Bi-directional sync, conflict resolution, deduplication logic, or any integration where data loss during Zapier outages is unacceptable.

---

## Decision matrix

| Factor | Native SDK | Merge.dev | Unified.to | Zapier/Make |
|---|---|---|---|---|
| # of CRM targets | 1-2 | 3+ | 3+ | 1-2 |
| Bi-directional sync | Yes | Yes | Yes | No |
| Data stored at vendor | No | Yes | No | No |
| Engineering cost | High | Low | Low | None |
| Cost at 500 customers | Variable | ~$1.17M/yr (3 CRMs) | Usage-based | Variable |
| Custom fields | Full access | Plan-dependent | Every plan | Limited |
| Production readiness | Full | Most CRMs | Verify | Full |

---

## Recommended stacks by company stage

**Pre-PMF / single CRM:** Native SDK. Time cost is real, but Merge.dev pricing punishes scale. Build once, own it.

**Growth-stage / 3+ CRMs / time-to-market pressure:** Merge.dev on Launch plan. Accept the data storage trade-off consciously. Set a review trigger at 100 Linked Accounts to re-evaluate pricing.

**Scale-stage / EU data residency / privacy-first:** Unified.to. Usage-based cost model survives growth without budget surprises.

**Internal ops / non-engineering team:** Zapier or Make for unidirectional notification flows only. Never for bi-directional sync.

---

*Sources: `research/external/2026-05-20-merge-dev-unified-crm-api.md`, `research/external/2026-05-20-unified-api-comparison.md`, `research/external/2026-05-20-crm-platform-comparison.md`*
*Demonstrates: `examples/hubspot-bidirectional-sync.md` (Option A), `examples/salesforce-lead-contact-migration.md` (Option A, Salesforce-specific)*
