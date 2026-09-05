---
name: crm-integration-stinger
description: CRM connectivity specialist for HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper -- bi-directional sync design, the contact-vs-lead-vs-account taxonomy, merge/dedupe, and the native-vs-Zapier-vs-Merge.dev architecture trade-off. Use when the user says "integrate with HubSpot", "bi-directional CRM sync", "CRM field mapping", "Merge.dev or native API?", "dedup contacts in our CRM", "lead enrichment strategy", "sync conflict resolution", "Salesforce Lead vs Contact", "Attio API production-ready?", or "audit our CRM sync code". Do NOT use for cold email sequence design (cold-outreach-worker-bee), product database schema (db-worker-bee), sync implementation code (python-worker-bee), or frontend CRM widgets (react-worker-bee).
---

# crm-integration-stinger

CRM connectivity playbook for `crm-integration-worker-bee`. Synthesized from 10 source notes covering Merge.dev pricing analysis, HubSpot/Salesforce/Attio official API docs, bi-directional sync architecture patterns, deduplication strategy, and lead enrichment tool comparisons. Research window: November 2025 -- May 2026.

See `research/research-summary.md` for key findings and open questions. The six-guide structure maps directly to the six major decision surfaces the worker-bee faces.

---

## When this stinger applies

Load when any of the following are true:

- The user needs to connect their product to HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, or Copper.
- The user is deciding between native API integration, Merge.dev/Unified.to, or no-code automation (Zapier, Make).
- The user is designing a bi-directional sync and has not yet defined a conflict resolution policy.
- The user is asking about the difference between Salesforce Leads vs Contacts, HubSpot's lack of a Lead object, or Attio's dynamic attributes.
- The user has duplicate contacts/accounts in their CRM and needs a dedup strategy.
- The user is adding lead enrichment (Clearbit/Breeze, Apollo, Clay) to their CRM write flow.
- The user wants a code audit of existing CRM sync code.

Do NOT load for:
- Cold email sequencing or deliverability (route to `cold-outreach-worker-bee`).
- The product's own internal Person/Account schema (route to `db-worker-bee`).
- Implementation of the sync backend in Django or Node.js (route to `python-worker-bee`).
- Frontend CRM sync widget or CRM data display UI (route to `react-worker-bee`).
- GDPR data residency for CRM data (flag and route to `security-worker-bee`).

---

## Critical directives

These non-negotiables govern every engagement. Full justification in `guides/00-principles.md`.

- **Map the CRM's data model before writing any spec or code.** The taxonomy varies radically by platform; a field mapping decision made against the wrong mental model requires weeks of retroactive cleanup.
- **Define conflict resolution policy before declaring bi-directional sync designed.** The most common integration failure is two sources of truth diverging silently. A conflict resolution policy is not optional.
- **State the Merge.dev trade-off explicitly.** At 500 customers on Launch plan: $1.17M/year. At the 3-CRM inflection point, re-run the native SDK math every time.
- **Deduplication is first-class, not a follow-up task.** Design dedup into the sync from day one. Retrofitting is 10x more expensive.
- **Run the rate limit math before committing to polling.** HubSpot Free/Starter: 100 requests/10 seconds. Salesforce CDC: 72-hour retention on replay. Naive polling architectures break at scale.
- **Never overwrite consent or Do Not Contact flags during dedup merges.** Propagate opt-outs to all integrated systems immediately. GDPR/CCPA non-negotiable.
- **Clearbit is Breeze Intelligence (HubSpot-acquired).** Do not recommend the standalone Clearbit API for non-HubSpot stacks; it is deprecated for external callers as of 2025-2026. See `guides/06-lead-enrichment.md`.

---

## Routing table

| Request type | First guide | Key template |
|---|---|---|
| "Which integration approach should we use?" | `guides/01-integration-architecture.md` | `templates/integration-spec.md` |
| "What's HubSpot/Salesforce/Attio's data model?" | `guides/02-crm-data-models.md` | `templates/field-mapping-table.md` |
| "How do we map our schema to the CRM?" | `guides/03-field-mapping.md` | `templates/field-mapping-table.md` |
| "Design our bi-directional sync" | `guides/04-sync-and-conflicts.md` | `templates/sync-design-spec.md` |
| "We have duplicate contacts/accounts" | `guides/05-deduplication.md` | `templates/dedup-strategy-worksheet.md` |
| "Add lead enrichment to our CRM writes" | `guides/06-lead-enrichment.md` | `templates/integration-spec.md` |
| "Audit our sync code" | `guides/07-implementation-review.md` | `templates/code-audit-checklist.md` |

---

## Folder layout

```
crm-integration-stinger/
+- SKILL.md                                (this file)
+- README.md                               (one-page overview)
+- guides/
|  +- 00-principles.md                    (the six non-negotiables)
|  +- 01-integration-architecture.md      (native SDK vs Merge.dev vs Unified.to vs no-code)
|  +- 02-crm-data-models.md               (object models for all 7 CRMs in scope)
|  +- 03-field-mapping.md                 (field mapping patterns and data-type traps)
|  +- 04-sync-and-conflicts.md            (bi-directional sync + conflict resolution)
|  +- 05-deduplication.md                 (dedup hierarchy, survivorship, external ID alias)
|  +- 06-lead-enrichment.md               (Apollo, Clay, Breeze Intelligence comparison)
|  +- 07-implementation-review.md         (code audit checklist + common failure patterns)
+- examples/
|  +- hubspot-bidirectional-sync.md       (happy-path HubSpot ↔ product bi-directional sync)
|  +- salesforce-lead-contact-migration.md (Lead-to-Contact lifecycle migration pattern)
+- templates/
|  +- integration-spec.md                 (full integration specification scaffold)
|  +- field-mapping-table.md              (field mapping table template)
|  +- sync-design-spec.md                 (bi-directional sync design spec)
|  +- dedup-strategy-worksheet.md         (dedup strategy decision worksheet)
|  +- code-audit-checklist.md             (CRM sync code audit checklist)
+- reports/
|  +- README.md                           (how audit reports accumulate)
+- research/                              (owned by scripture-historian -- do NOT modify)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/
   +- external/                           (10 source notes, 2025-11 to 2026-05)
```

---

## Open questions from research (surface to user before finalizing guides)

1. **Is Clearbit's original API deprecated for non-HubSpot customers?** Treat as deprecated until confirmed otherwise. Do not recommend standalone Clearbit API. See `guides/06-lead-enrichment.md`.
2. **Is Vessel.dev still production-active in 2026?** Omit from primary recommendations until confirmed. Use Merge.dev and Unified.to as the two unified API options.
3. **Which Merge.dev CRM integrations are production vs beta?** Folk, Close, and Copper may be beta. Flag to user when recommending Merge.dev for these platforms.
4. **Pipedrive rate limits not confirmed in research.** Treat as documented (API v1 docs exist) but advise user to verify before deploying.
5. **Attio bulk write status unknown as of 2026-05.** Do not assume bulk endpoint exists. Design Attio initial loads with single-record rate-limit math.

---

*Forged by `stinger-forge` from `crm-integration-worker-bee-command-brief.md` and `research/`. Part of the Legion AI Tools Factory by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
