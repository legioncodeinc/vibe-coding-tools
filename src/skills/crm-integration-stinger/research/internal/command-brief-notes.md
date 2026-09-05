# Command Brief Notes: crm-integration-worker-bee

Extracted by scripture-historian on 2026-05-20 from `ai-tools/command-briefs/crm-integration-worker-bee-command-brief.md`.

---

## Key identity and scope decisions

**The worker-bee is opinionated.** It does not hedge between platforms - it evaluates against the builder's specific context (team size, deal complexity, API quality, pricing, ecosystem) and makes a recommendation. This is a deliberate design choice: users come to it for a decision, not a feature grid.

**Eight action surfaces in order:**
1. Platform selection (guides/01)
2. Integration approach decision - native SDK vs Zapier/Make vs unified API (guides/02)
3. Sync architecture design - webhook ingestion, polling, idempotency, conflict resolution (guides/03)
4. Field mapping and taxonomy (guides/04)
5. Deduplication and merge (guides/05)
6. Lead enrichment - Clearbit, Apollo, Clay, Lusha (guides/06)
7. Attribution handoff - UTM → CRM → revenue (guides/07)
8. Code review mode (guides/08)

**Platforms in scope:** HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, Copper.

**Unified APIs in scope:** Merge.dev, Vessel, Alloy. (Note: Unified.to also emerged prominently in research as a strong competitor - stinger-forge should include it in guides/02.)

**Enrichment tools in scope:** Clearbit (now "Breeze by HubSpot"), Apollo, Clay, Lusha.

---

## Scope boundaries (explicit hand-offs)

| Concern | Owner |
|---|---|
| Postgres schema for sync state | `db-worker-bee` |
| OAuth token lifecycle beyond CRM-specific flow | `auth-worker-bee` |
| Stripe revenue data overlaps with CRM deal stages | `payments-worker-bee` |
| PII encryption-at-rest and access logging | `security-worker-bee` |

---

## Critical directives surfaced in brief

1. **Always verify webhook signatures.** HMAC verification is the most common CRM integration security failure. Replay and spoofing attacks are trivial without it.
2. **Design sync state as idempotent from day one.** Duplicate delivery is guaranteed in webhook infrastructure.
3. **Never trust CRM timestamps for ordering.** HubSpot webhooks deliver out of order; use sequence number or `updated_at` from the API payload, NOT webhook delivery time.
4. **Unified API is cost-vs-control, not default.** Justified when supporting 3+ CRMs; overkill for single-CRM integration.
5. **Map to canonical object model first, then adapt.** Prevents expensive lock-in to a single CRM's schema.
6. **Surface PII fields and hand off to security-worker-bee.** Contact records are PII by definition.

---

## Open questions surfaced during Command Brief intake

1. **Multi-tenant CRM support?** Does the user need each customer to have their own CRM instance? This changes architecture significantly (Merge.dev / OAuth per customer). The brief calls this out explicitly as a design fork.
2. **Vessel vs Alloy coverage?** Vessel and Alloy are named in the brief but the search queries focus on Merge.dev. stinger-forge should check Vessel (vessel.dev) and Alloy current status - both may have pivoted or been acquired since brief was written.
3. **Folk and Close API quality?** These two are in scope for platform selection (guides/01) but no research was conducted specifically on their APIs. stinger-forge should add a shallow-tier search for "Folk CRM API 2026" and "Close.com CRM API 2026" before finalizing guides/01.
4. **Clearbit rebranding.** Clearbit was acquired by HubSpot and rebranded as "Breeze Intelligence." The original Clearbit Enrichment API may be deprecated or sunset for non-HubSpot customers. stinger-forge must verify current status before authoring guides/06.

---

## Proposed template noted in brief

`templates/sync-state-schema.sql` - an idempotency + sync-state Postgres table for `db-worker-bee` to review. This should be authored by stinger-forge as a companion template file alongside guides/03.

---

## Refresh cadence

6 months. CRM API versioning and Merge.dev pricing/coverage change rapidly. Next re-run should be `shallow` tier, focused specifically on the unified-API pricing query and any HubSpot/Salesforce API breaking changes.
