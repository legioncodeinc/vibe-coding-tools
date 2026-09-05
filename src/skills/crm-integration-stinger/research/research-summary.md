# Research Summary: crm-integration-stinger

- **Angel:** `crm-integration-worker-bee`
- **Depth tier consumed:** normal
- **Time window covered:** 2025-11-20 to 2026-05-20 (6 months)
- **Files written:** 10 source note files in `research/external/`
- **Research tools:** Perplexity MCP (`perplexity_search`), prior run (Perplexity + synthesis), official documentation scrapes (HubSpot dev docs, Attio docs, Salesforce AppExchange)
- **Completed by:** scripture-historian on 2026-05-20

---

## Top 5 Most Influential Sources

### 1. `external/2026-05-20-bidirectional-sync-architecture.md`
**Why it matters:** This is the primary reference for the entire `guides/04-sync-and-conflicts.md` guide. It provides the four-loop architecture (event ingestion → write propagation → conflict resolution → reconciliation), the field ownership matrix pattern, two concrete echo-prevention methods, and CRM-specific webhook guarantee failures (HubSpot does NOT guarantee ordering; Salesforce CDC 72-hour retention). This is the foundational engineering pattern the worker-bee must deliver in every bi-directional sync engagement.

### 2. `external/2026-05-20-hubspot-api-rate-limits-webhooks.md`
**Why it matters:** Official HubSpot developer documentation covering the v3 webhook HMAC signature validation spec (the current standard as of 2026), all rate limit tiers by account type, retry policies, and the OAuth v3 migration. This is the authoritative source for the `guides/07-implementation-review.md` code audit checklist - specifically the signature validation, timestamp anti-replay, and constant-time comparison requirements. Any HubSpot integration that skips v3 signature validation is vulnerable to webhook spoofing.

### 3. `external/2026-05-20-salesforce-data-model-lead-contact-lifecycle.md`
**Why it matters:** Explains the single most common cause of Salesforce integration failure: the Lead-Contact-Account taxonomy confusion and inconsistent conversion rules. Provides the authoritative decision rule (account-based motion → convert immediately; BDR qualification motion → stage as Lead), the critical "never run both models simultaneously" rule, and the HubSpot vs Salesforce object model comparison table. This is the opening content for `guides/02-crm-data-models.md`.

### 4. `external/2026-05-20-merge-dev-unified-crm-api.md`
**Why it matters:** Establishes the sync-and-cache architecture of Merge.dev, the data storage and PII concerns (stores end-customer data indefinitely by default), the passthrough escape hatch, and current pricing ($650/month for 10 Linked Accounts, scaling to $1.17M/year at 500 customers). This is the primary reference for the unified API evaluation in `guides/01-integration-architecture.md`. The pricing math is the forcing function for the "native SDK for single-CRM" recommendation.

### 5. `external/2026-05-20-crm-deduplication-strategy.md`
**Why it matters:** Provides the deterministic-first, probabilistic-second dedup hierarchy, the confidence-tier matching signal table, the selective survivorship pattern for merge field selection, the external ID alias requirement post-merge, and the AI-in-dedup governance model (rules first, AI second, human decides). The "always preserve consent/Do Not Contact flags" rule is a GDPR/CCPA compliance non-negotiable. The external ID alias pattern is a critical integration stability requirement often missed.

---

## Key Findings by Guide Area

### Integration Architecture (`guides/01`)
- **Four-tier decision framework** is validated: native SDK (single CRM), Merge.dev (3+ CRMs, time-to-market priority), Unified.to (privacy-sensitive, usage-based cost model), Zapier/Make (non-technical, simple unidirectional flows).
- **Merge.dev pricing reality:** At 500 customers × 3 integrations = $97,500/month ($1.17M/year) on Launch plan. This is the forcing function that makes native SDK economical for single-CRM products.
- **Unified.to's advantage:** Pass-through architecture (no data storage at rest), usage-based pricing ($750/month for 750K API calls), custom fields on every plan. Better than Merge for privacy-sensitive B2B SaaS at scale.
- **2026 market signal:** Merge launched an MCP server option in 2025-2026 for AI-native integrations. Worth monitoring.

### CRM Data Models (`guides/02`)
- **HubSpot:** No native Lead object. Uses Contact + Lifecycle Stage field. Lifecycle stage must be workflow-driven (not manual). Four standard objects: Contact, Company, Deal, Ticket. Custom objects only on Enterprise.
- **Salesforce:** Lead/Contact split. The conversion lifecycle (Lead → Account + Contact + Opportunity) must have explicit, documented rules. Never let Lead and Contact coexist for the same person at the same company. Account-based motion → convert immediately.
- **Attio:** Graph data model with arbitrary relationships. No fixed Lead object. Custom objects require Pro/Enterprise plan. Record limits by plan (50K Free → 1M Pro).
- **Pipedrive:** Activity-centric sales pipeline. Unlimited contacts and custom fields on all plans. Strongest for Microsoft 365 environments.
- **Close:** Flat contact/opportunity model with native call/SMS activity objects. Best for inside sales teams needing call activity sync.
- **Folk:** Early-stage API. Not suitable for production bi-directional sync with complex field mapping.

### Field Mapping (`guides/03`)
- **HubSpot "original source" / "latest source"** → Salesforce has no direct equivalent; requires custom Salesforce field.
- **Attio graph model** creates taxonomy impedance: Attio "Person" relationships are not a direct equivalent to a HubSpot Contact's flat associations.
- **HubSpot dropdown values and Salesforce picklist API** require care with data type conversion; invalid picklist values will silently fail or reject writes depending on Salesforce validation rules.
- **Opportunity/Deal orphan prevention:** HubSpot Deals must have a Company association before syncing to Salesforce Opportunities (Salesforce requires Account link).

### Bi-Directional Sync and Conflicts (`guides/04`)
- **Four-loop architecture is the canonical pattern:** event ingestion (queue, validate, respond 200 immediately), worker (dedupe, rate-limit-aware), conflict resolution (field ownership matrix recommended over last-write-wins), reconciliation (nightly truth pass).
- **Echo prevention:** Two approaches validated: echo filtering at ingestion (actor metadata/correlation IDs) and watermark-based delta sync (`last_successful_run` per resource per account).
- **CRM-specific webhook guarantees:**
  - HubSpot: no ordering guarantee, eventId not unique, 5s timeout, 10 retries over 24h
  - Attio: at-least-once, Idempotency-Key header for dedupe, 5s timeout, 10 retries over ~3 days, 25/sec per target URL
  - Salesforce CDC: 72-hour retention, replay_id not contiguous

### Deduplication (`guides/05`)
- **Hierarchy:** data contract (prevention) → deterministic matching (email exact, external ID, E.164 phone, normalized domain) → probabilistic matching (fuzzy name, address proximity).
- **Selective survivorship** over "one record wins": field-level rules by category (most recent, most complete, union, always-preserve).
- **Non-negotiables:** Never overwrite consent flags or Do Not Contact markers. Propagate opt-outs to all integrated systems immediately.
- **External ID alias pattern:** Keep old IDs as aliases post-merge. Any downstream system holding the non-surviving ID will break without a lookup.
- **AI role:** Recommend, not decide. Human review required for large enterprise accounts and records with conflicting consent flags.

### Lead Enrichment (`guides/06`)
- **Clearbit is now Breeze Intelligence (HubSpot acquisition):** No longer a standalone enrichment tool for non-HubSpot stacks. Do NOT recommend for users not on HubSpot.
- **Apollo:** Best for high-volume outbound prospecting. Budget-friendly ($49/month). Data inconsistency issues for SMBs, local businesses, and non-US/non-tech markets.
- **Clay:** Most powerful for technical RevOps teams. Waterfall enrichment from 50+ sources simultaneously. Requires ongoing technical ownership - not fire-and-forget.
- **Enrichment idempotency rule:** Only write enriched values to null/empty fields. Stamp `_enriched_at` and `_enrichment_source` for every enriched field.

### Implementation Review (`guides/07`)
- **HubSpot webhook checklist** (from official docs, Jan 2026): v3 HMAC SHA-256 validation; timestamp within 5 minutes; constant-time comparison; respond 200 before processing; dedupe key is `(portalId, objectId, occurredAt)` not `eventId`.
- **Attio webhook checklist:** Use `Idempotency-Key` header for dedupe; respond within 5 seconds; handle rate limit (25/sec per target URL).
- **Common failure patterns:** Missing idempotency keys; N+1 CRM API calls in sync loops; missing reconciliation job; absent webhook signature validation; using delivery timestamp instead of payload `updated_at` for conflict detection.

---

## 5 Open Questions for stinger-forge

1. **Is Clearbit's original API deprecated for non-HubSpot customers?** Multiple practitioner sources in 2026 treat it as HubSpot-only ("Breeze Intelligence"). Stinger-forge should scrape https://clearbit.com/docs before authoring guides/06 to confirm API status for non-HubSpot stacks. If deprecated, remove Clearbit from the enrichment comparison entirely.

2. **Is Vessel.dev still production-active in 2026?** The Command Brief includes it in the unified API options, but 2026 search results have limited coverage for Vessel. Scrape https://www.vessel.dev to verify it is still operating and maintained before listing it as a primary recommendation in guides/01.

3. **What is Merge.dev's current CRM integration production vs beta status?** Merge's CRM category page shows some integrations as "Beta/Coming Soon." Stinger-forge should scrape https://www.merge.dev/categories/crm-api to verify which CRM integrations (specifically Folk, Close, Copper) are production-ready vs still beta before documenting them as supported.

4. **What are Pipedrive's current rate limits and webhook event types?** The Folk/Close/Pipedrive comparison source confirms Pipedrive's API is mature but does not document specific rate limits. Stinger-forge should scrape https://developers.pipedrive.com/docs/api/v1 before finalizing the CRM data model guide for Pipedrive.

5. **Does Attio's v2 API support batch/bulk writes for initial data loads, or is it strictly one-record-per-request?** Current research confirms no bulk API as of April 2026, but this is a significant constraint that should be verified directly at https://developers.attio.com/reference/ before advising teams on Attio initial sync strategies. If a bulk endpoint has been added, the rate limit math changes significantly.

---

## Sources stinger-forge should re-fetch for deeper context

- `https://developers.hubspot.com/docs/apps/legacy-apps/authentication/validating-requests` - Full v3 HMAC validation code samples in Node.js and Python for guides/07 examples
- `https://developers.attio.com/reference/` - Full Attio v2 API endpoint reference to verify bulk write status and current authentication spec
- `https://www.merge.dev/docs/crm/overview` - Current Merge.dev CRM Common Models spec for guides/02 Merge section
- `https://developer.close.com/` - Close CRM REST API spec for rate limits and webhook event types
- `https://developers.pipedrive.com/docs/api/v1` - Pipedrive API v1 rate limits and webhook event schema
