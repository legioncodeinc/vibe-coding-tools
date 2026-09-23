# CRM Data Models

Read this guide before doing any field mapping or sync design. Every CRM has a fundamentally different object model, and the taxonomy gap is the #1 cause of CRM integration failure.

## The core taxonomy problem

Most products model "people" and "companies" as flat records. CRMs add commercial-stage semantics on top: some call an early-stage contact a "Lead", some don't. Some require an Account before an Opportunity can exist. Some have no fixed schema at all. The mapping decision you make here ripples through every downstream sync design.

---

## HubSpot data model

**Standard objects:** Contact, Company, Deal, Ticket. (Custom objects require Enterprise plan.)

**The Lead-object gap:** HubSpot has no native Lead object. "Lead" in HubSpot is a lifecycle stage value on a Contact record. The lifecycle stage field (`lifecyclestage`) moves a Contact through: `subscriber → lead → marketingqualifiedlead → salesqualifiedlead → opportunity → customer → evangelist → other`.

**Implications for sync design:**
- If your product has a "Lead" concept, map it to Contact with a lifecycle stage of `lead` on write.
- Lifecycle stage transitions should be driven by HubSpot workflows, not by direct API writes (direct writes do not trigger associated automation unless you also fire a workflow enrollment via API).
- HubSpot's original source and latest source attribution fields (`hs_analytics_source`, `hs_analytics_latest_source`) have no direct Salesforce equivalent -- you need a custom Salesforce field if you want to preserve attribution.

**Deal-Company association requirement:** HubSpot Deals must be associated with a Company before syncing to Salesforce Opportunities. Salesforce Opportunities require an Account link. Orphaned Deals (no Company) will fail Salesforce validation rules.

**Rate limits (2026):**
- Free/Starter: 100 requests per 10 seconds; 500,000 API calls/day
- Professional: 150 requests per 10 seconds; 500,000 API calls/day
- Enterprise: 150 requests per 10 seconds; 500,000 API calls/day (some endpoints have higher daily caps)
- OAuth token expiry: access tokens expire in 30 minutes; use refresh token rotation

**Webhook format:** HMAC-SHA256 v3 signature (v1 deprecated). Validate with `X-HubSpot-Signature-v3` header. Timestamp anti-replay within 5 minutes. No ordering guarantee. `eventId` is NOT unique -- use `(portalId, objectId, occurredAt)` as the dedupe key.

---

## Salesforce data model

**Standard objects:** Lead, Contact, Account, Opportunity, Task, Event, Campaign, CampaignMember.

**The Lead/Contact split:** This is the most common source of Salesforce integration failure.

- **Lead:** Pre-qualification record. Flat -- has no Account association. Represents an unvetted prospect.
- **Contact:** Post-conversion record. Always associated with an Account. Represents a known person at a company you do business with.
- **The conversion lifecycle:** Lead → [convert] → Account + Contact + Opportunity (optional). Conversion is one-way. A converted Lead cannot be "unconverted."

**The critical rule:** Never let Lead and Contact coexist for the same person at the same company.

**Decision rule:**
- Account-based motion (B2B, known accounts): Convert Lead to Contact immediately on creation. Do not stage as Lead.
- BDR qualification motion (outbound, unknown accounts): Stage as Lead until qualification criteria are met, then convert.
- The "lead coexistence failure pattern": teams that convert some leads and leave others as leads end up with the same person appearing as both a Lead and a Contact, which breaks dedup, attribution, and sequence enrollment simultaneously.

**Opportunity-Account requirement:** Opportunities must have an Account. Cannot be orphaned.

**Rate limits:** Governed by API Edition allocations and governor limits. Use Salesforce Change Data Capture (CDC) for real-time events rather than polling SOQL. CDC events are retained for 72 hours -- a service outage longer than 72 hours means events are permanently lost; design a reconciliation job as the safety net.

---

## Attio data model

**Core model:** Graph-based. Records are arbitrary nodes; relationships are typed edges. No fixed "Lead" or "Contact" concept at the platform layer.

**Default objects:** People, Companies, Workspaces (their version of Deals/Opportunities). Exact names depend on workspace configuration.

**Dynamic attributes:** Attributes on objects are user-defined. No fixed schema. This means field mapping against Attio requires reading the workspace's attribute configuration at runtime, not from documentation.

**Custom objects:** Available on Pro/Enterprise plans only. Free plan: 50K record limit. Pro: 1M record limit.

**API v2 (current as of 2026-05):**
- Rate limit: 100 requests/second per workspace; 25 requests/second per webhook target URL
- Authentication: OAuth 2.0 with token refresh
- Webhooks: at-least-once delivery; use `Idempotency-Key` header for dedupe; 5-second timeout; 10 retries over ~3 days
- No confirmed bulk write endpoint as of 2026-05 (verify at developers.attio.com). Design initial loads with single-record rate-limit math.

**Attio for PLG products:** Attio is the preferred CRM for modern PLG stacks because of its flexible data model and native integration with product telemetry. If the product is usage-led, Attio is the most natural fit.

---

## Pipedrive data model

**Core objects:** Person, Organization, Deal, Activity, Lead (Leads Inbox -- a separate pre-pipeline concept added in 2019).

**Activity-centric model:** Pipedrive's differentiator is that every Deal is driven by Activities (calls, emails, meetings). The pipeline visualizes Activity completion, not contact status.

**Microsoft 365 fit:** Pipedrive has the strongest Microsoft 365 integration of any mid-market CRM. Best choice for teams running Outlook-based workflows.

**API maturity:** Stable v1 API. Webhooks available. Rate limits: documented in Pipedrive API v1 docs (verify current limits at developers.pipedrive.com before deploying).

---

## Close CRM data model

**Core objects:** Lead (unusual -- Close's "Lead" is closer to an Account/Company), Contact, Opportunity, Activity (Call, Email, SMS, Meeting).

**Close's "Lead" is not a prospect:** In Close, a "Lead" is an account-level record (a company or prospect group), not an individual. Contacts belong to Leads. This is the opposite of Salesforce's Lead object and a common source of confusion.

**Best fit:** Inside sales teams that live in the phone. Native call/SMS activity objects, local presence dialing, and power dialer are Close's differentiators.

---

## Folk CRM data model

**Core objects:** People, Companies, Sequences, Pipeline.

**API status (2026-05):** Early-stage API. Limited webhook support. Not suitable for production bi-directional sync with complex field mapping as of 2026-05. Verify at folk.app/developers before recommending for technical integration.

**Best fit:** Small teams who want a lightweight, Notion-like CRM for relationship management rather than a sales pipeline. Not recommended for automated CRM integration at scale.

---

## Copper CRM data model

**Core objects:** People, Companies, Opportunities, Projects, Activities.

**Google Workspace integration:** Copper is the CRM with the deepest Google Workspace integration (email, calendar, Drive). Best choice for Google-native teams.

**API:** Stable REST API. Rate limits documented at developer.copper.com. Webhook support available.

---

## Object model comparison table

| Concept | HubSpot | Salesforce | Attio | Pipedrive | Close | Copper |
|---|---|---|---|---|---|---|
| Pre-qual prospect | Contact (lifecycle: lead) | Lead | (user-defined) | Leads Inbox | Contact | Person |
| Person (qualified) | Contact | Contact | People | Person | Contact | Person |
| Company/Account | Company | Account | Companies | Organization | Lead* | Company |
| Revenue opportunity | Deal | Opportunity | (user-defined) | Deal | Opportunity | Opportunity |
| Activity | Activity | Task/Event | (user-defined) | Activity | Activity | Activity |
| Custom objects | Enterprise only | Yes | Pro/Enterprise | No | No | No |

*Close's "Lead" is an account-level record, not an individual.

---

*Sources: `research/external/2026-05-20-salesforce-data-model-lead-contact-lifecycle.md`, `research/external/2026-05-20-hubspot-api-rate-limits-webhooks.md`, `research/external/2026-05-20-attio-api-v2-rate-limits-stability.md`, `research/external/2026-05-20-folk-close-pipedrive-copper-api-comparison.md`, `research/external/2026-05-20-crm-platform-comparison.md`*
