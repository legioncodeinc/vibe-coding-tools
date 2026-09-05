# Lead Enrichment

Enrichment adds data to CRM records at write time or post-create. This guide covers timing, tool selection, and the idempotency rule.

## Enrichment timing

Three patterns, ordered from least to most invasive:

### Pattern A: On CRM write (recommended for new records)

When the product creates a new Contact/Company in the CRM, append enrichment data in the same sync job before committing the record.

**Pros:** CRM record is complete on creation. No "empty record" window that triggers CRM automations with missing data.
**Cons:** Adds latency to the sync path. Enrichment API failures can block the CRM write.
**Mitigation:** Write the record first (without enrichment), then enqueue an enrichment job. Do NOT block the CRM write on enrichment success.

### Pattern B: Post-create enrichment job

A background job runs after the CRM write and fills in enrichment fields for records created in the last N hours with null enrichment fields.

**Pros:** Decoupled from sync critical path. Enrichment failures don't cause CRM write failures.
**Cons:** Brief "empty record" window. CRM automations may fire before enrichment data is available.
**Recommended for:** High-volume integrations where enrichment latency is acceptable.

### Pattern C: Triggered by CRM activity

Enrich a record when it reaches a specific lifecycle stage (e.g., when a Contact becomes MQL in HubSpot).

**Pros:** Targeted -- only enriches records worth the enrichment credit spend.
**Cons:** Records below the threshold have no enrichment data.
**Recommended for:** Budget-constrained enrichment where only sales-qualified leads warrant enrichment credits.

---

## Enrichment tool comparison

> **IMPORTANT:** Clearbit is now Breeze Intelligence, acquired by HubSpot in 2023. The standalone Clearbit API is deprecated for non-HubSpot customers as of 2025-2026. Do NOT recommend standalone Clearbit to users not on HubSpot. If the user is on HubSpot, Breeze Intelligence is the correct recommendation (natively integrated, no separate API key required).

### Apollo.io Enrichment API

**Best for:** High-volume outbound prospecting. Budget-friendly at $49/month (Basic plan). Strong B2B tech market coverage for US and European companies.

**Strengths:** Large database (275M+ contacts). Email finder + enrichment in one API. Native HubSpot and Salesforce connectors. Budget-friendly for early-stage teams.

**Weaknesses:** Data inconsistency for SMBs, local businesses, and non-US/non-tech markets. Company data can be stale for fast-growing startups.

**API pattern:** `POST /api/v1/people/match` with email or LinkedIn URL as the lookup key. Returns job title, company, LinkedIn URL, and estimated phone.

### Clay enrichment

**Best for:** Technical RevOps teams who want maximum data coverage and are willing to invest in setup.

**Strengths:** Waterfall enrichment from 50+ data sources simultaneously (Apollo, Clearbit/Breeze, Zoominfo, LinkedIn, PDL, custom sources). Returns the best match across all sources. The most complete data picture available.

**Weaknesses:** Requires ongoing technical ownership -- not a fire-and-forget setup. Clay's pricing is credit-based and can scale unexpectedly if enrichment queries are not scoped tightly.

**API pattern:** Clay provides a webhook-based integration. Define enrichment "tables" in Clay that fire against incoming contact data and return enriched fields via webhook callback.

**The SKIP rule (from cold-outreach-worker-bee):** When using Clay Claygent for AI-driven enrichment fields, if no specific insight is found, return "SKIP" rather than a generic fallback value. Applies to personalization fields; enrichment fields (job title, company size) should always return a deterministic value or null.

### HubSpot Breeze Intelligence

**Recommended for:** HubSpot customers only. Natively integrated -- no API key, no additional billing per enrichment (included in HubSpot Pro/Enterprise).

**What it enriches:** Company data (size, industry, revenue), Contact data (job title, LinkedIn URL), buyer intent signals (website visits to competitor pages, technology usage).

**Limitation:** Only available for HubSpot workspaces. Not usable for Salesforce or Attio integrations.

---

## The enrichment idempotency rule

Only write enriched values to fields that are currently null or empty. Never overwrite a human-entered value with an enriched value.

```
if (crm_record.job_title == null || crm_record.job_title == "") {
  crm_record.job_title = enrichment_result.job_title;
  crm_record.job_title_enriched_at = now();
  crm_record.job_title_enrichment_source = "apollo";
}
// else: skip; human-entered value takes precedence
```

**Required audit trail fields per enriched value:**
- `{field_name}_enriched_at` (timestamp)
- `{field_name}_enrichment_source` (string: "apollo" | "clay" | "breeze" | etc.)

Without the audit trail, you cannot distinguish human-entered data from enrichment data in dedup conflict resolution.

---

## Enrichment budget estimate

Before recommending an enrichment tool, run the volume math:

1. How many new CRM records are created per month?
2. What is the enrichment credit cost per record for the chosen tool?
3. What percentage of records are expected to be enrichable (tool's coverage for the ICP)?

Apollo Basic ($49/month) includes 500 enrichment credits. At 200 new contacts/month with 80% coverage rate = 160 enrichment requests = fits Apollo Basic comfortably.

At >2,000 new contacts/month with high enrichment needs, evaluate Apollo Organization ($149/month) or Clay.

---

*Sources: `research/external/2026-05-20-lead-enrichment-comparison.md`, `research/external/2026-05-20-crm-platform-comparison.md`*
*Open question: Verify Clearbit standalone API status at clearbit.com/docs before advising any non-HubSpot user on Clearbit. See `research/research-summary.md` Open Question #1.*
