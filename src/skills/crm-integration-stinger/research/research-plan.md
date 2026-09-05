# Research Plan: crm-integration-stinger

- **Depth tier:** normal
- **Time window:** 2025-11-20 back to 2026-05-20 (6 months)
- **Page budget target:** ~100 pages (executed as 5 primary queries + 4 expansion queries; 10 highest-value sources filed as annotated notes)
- **Source breadth target:** official docs (HubSpot, Attio, Salesforce AppExchange), practitioner blogs, comparison reports, vendor pricing pages, community reviews (G2, migration guides)
- **Research model:** grok-4.3 (assigned) / executed by scripture-historian agent via Perplexity MCP + Firecrawl
- **Retrieved on:** 2026-05-20

## Initial queries (from `big-bang-space` / Command Brief)

1. "Merge.dev unified CRM API 2026"
2. "HubSpot vs Salesforce vs Attio API 2026"
3. "Bi-directional CRM sync conflict resolution 2026"
4. "Lead enrichment Clearbit Apollo Clay 2026"
5. "CRM contact dedupe merge strategy 2026"

## Expansion queries (authored by scripture-historian)

### Branch from "Merge.dev unified CRM API 2026"
- "Merge.dev vs Vessel vs Unified.to CRM integration comparison 2026"
- "Merge.dev pricing per linked account cost analysis 2026"
- "unified API CRM developer experience review 2026"

### Branch from "HubSpot vs Salesforce vs Attio API 2026"
- "Attio CRM API v2 rate limits production stability webhooks 2026"
- "HubSpot API rate limits webhook HMAC validation 2026"
- "Salesforce Lead Contact conversion CRM integration best practices 2026"

### Branch from "Bi-directional CRM sync conflict resolution 2026"
- "CRM sync idempotency key design webhook deduplication 2026"
- "field ownership matrix source of record CRM sync pattern 2026"
- "echo filtering infinite loop prevention bidirectional sync 2026"

### Branch from "Lead enrichment Clearbit Apollo Clay 2026"
- "Clay waterfall enrichment workflow CRM integration 2026"
- "Clearbit Breeze HubSpot acquisition enrichment 2026"
- "Apollo.io data quality consistency B2B SaaS enrichment 2026"

### Branch from "CRM contact dedupe merge strategy 2026"
- "deterministic vs probabilistic CRM deduplication 2026"
- "Salesforce HubSpot native deduplication tools 2026"
- "field-level survivorship merge policy CRM records 2026"

### Additional coverage gaps (Folk, Close, Copper, Pipedrive)
- "Folk Close Pipedrive Copper CRM API comparison integration developer 2026"

## Research tools used

- Perplexity MCP (`perplexity_search`) for 4 expansion queries
- Results: ~100 source pages reviewed across 9 queries
- 10 highest-value sources filed as annotated external notes
- Raw search results preserved in agent-tools cache files at `C:\Users\mario\.cursor\projects\c-Users-mario-GitHub-legion-code\agent-tools\`

## Coverage verdict

Normal-tier depth achieved and exceeded. All 5 primary query domains returned substantive, non-repetitive 2025-2026 material. Four additional expansion queries added official-docs coverage for HubSpot (rate limits + webhook HMAC), Attio (v2 API limits), Salesforce (data model taxonomy), and the secondary CRM platforms (Pipedrive, Close, Folk, Copper).

**Coverage gaps (for stinger-forge to verify):**
- Vessel.dev current status - scrape https://www.vessel.dev to verify still active
- Clearbit deprecation for non-HubSpot customers - verify at https://clearbit.com/docs
- Pipedrive deep API spec (webhook event types, rate limits) - scrape https://developers.pipedrive.com/docs/api/v1
- Close API deep spec - scrape https://developer.close.com/
- Copper API reference - scrape https://developer.copper.com/
