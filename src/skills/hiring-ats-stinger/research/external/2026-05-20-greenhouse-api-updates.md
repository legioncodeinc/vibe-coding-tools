---
source_type: docs
authority: high
relevance: high
topic: Greenhouse API updates integrations 2025-2026
url: https://support.greenhouse.io/hc/en-us/articles/48148047128987-Release-Notes-March-2026
fetched: 2026-05-20
---

# Greenhouse ATS API and Integration Updates (2025-2026)

## Summary

Greenhouse's release notes from August 2025 through March 2026 reveal two major changes stinger-forge must encode: a hard breaking-change deprecation of Harvest API v1/v2, and the launch of Hire Link for Workday as a native HRIS handoff integration. These are operationally critical facts that affect any team building on or integrating with Greenhouse.

**CRITICAL: Harvest API v1/v2 Deprecation (August 31, 2026)**
- Harvest API v1 and v2 will be deprecated and unavailable after August 31, 2026
- All existing custom integrations built on v1 or v2 must migrate to Harvest API v3 by this date
- Harvest API v3 has reached full feature parity with v2 as of August 2025
- Teams conducting integrations reviews should treat any Greenhouse integration older than ~2 years as a candidate for migration audit

**New in September 2025:**
- Connected Integrations Page in Dev Center (early access): centralized management of all Harvest v3 Partner integrations using OAuth
- New partner integrations added:
  - Candidate testing: IKM, Codeaid, DigAI
  - Candidate sourcing: JobMinglr, Pin
  - Relocation services: PerchPeek

**New in March 2026:**
- Harvest v3 API usage monitoring within Greenhouse: view total request volume, success rates for the month, and daily HTTP response code breakdowns - helps identify integration errors before they cause candidate record issues
- Hire Link for Workday: out-of-the-box integration that automatically exports new hire data to Workday, creating pre-hire profiles and initiating onboarding for new hires, rehires, and internal transfers

**Other notable 2025 updates:**
- Microsoft SCIM integration for automatic user sync from Microsoft Entra ID (September 2025)
- Application custom fields available to all customers (previously limited to Advanced/Expert tiers) - expands what smaller Greenhouse customers can capture per-application

## Key Quotations / Statistics

- "Harvest API v1 and v2 will be deprecated and unavailable after August 31, 2026"
- "Harvest API v3 has reached full feature parity with v2"
- Hire Link for Workday launches March 2026: "automatically exports new hire data to Workday to create pre-hire profiles and initiate onboarding for new hires, rehires, and internal transfers"

## Annotations for stinger-forge

- The August 31, 2026 Harvest API v1/v2 deprecation is a **time-sensitive, actionable fact** that belongs prominently in guides/05 (sourcing integrations) and guides/06 (HRIS handoff) - any Greenhouse customer using custom integrations needs to audit NOW
- Hire Link for Workday is directly relevant to guides/06 as the Greenhouse-native HRIS handoff option for Workday shops; not all teams use Rippling - document both Workday and Rippling paths
- The Connected Integrations Page is a quality-of-life improvement for TA ops teams managing multiple integrations - worth a mention in guides/05 as the centralized management location
- The Harvest v3 API usage monitoring dashboard is relevant for teams troubleshooting integration failures - mention in the troubleshooting section of guides/06
- No contradiction with other research files; this is primary source material from Greenhouse's own release notes
