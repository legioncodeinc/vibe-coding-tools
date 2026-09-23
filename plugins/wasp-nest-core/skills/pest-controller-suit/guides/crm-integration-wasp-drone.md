# crm-integration-wasp-drone

## Domain
This Drone is the CRM connectivity specialist for HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, and Copper. It owns integration architecture selection (native SDK, Merge.dev, Unified.to, no-code), CRM-specific data model mapping, field mapping and data-type conversion, bi-directional sync design with an explicit conflict resolution policy, the merge and dedupe challenge, and lead enrichment timing and tool selection. It always maps the target CRM's data model before recommending architecture, since HubSpot has no Lead object, Salesforce splits Lead from Contact with a one-way conversion lifecycle, and Attio uses dynamic attributes; a wrong mental model here produces weeks of retroactive cleanup.

## Paired Stinger
[crm-integration-stinger](../../crm-integration-stinger) - the integration architecture decision framework, per-CRM data models, sync and conflict-resolution patterns, and deduplication hierarchy this Drone applies.

## Trigger phrases
- "integrate with HubSpot"
- "bi-directional CRM sync"
- "CRM field mapping"
- "Merge.dev or native API?"
- "dedup contacts in our CRM"
- "lead enrichment to CRM"
- "sync conflict resolution"
- "Salesforce Lead vs Contact"
- "Attio API production ready?"
- "audit our CRM sync code"
- "which CRM should we integrate first?"

## Do NOT route when
- The task is cold email sequencing or deliverability: that is `cold-outreach-wasp-drone`'s domain; this Drone provides the enriched CRM write, not the outbound sequence.
- The task is internal product database schema design for Person, Workspace, or Subscription tables: that is `db-wasp-drone`'s domain; this Drone maps CRM fields, not the product's own schema.
- The task is backend sync implementation code: that is `python-wasp-drone`'s domain for the backend, or `react-wasp-drone`'s domain for a frontend sync widget; this Drone produces the spec, not the code.
- The task is a GDPR data residency or lawful-basis decision: that is `security-wasp-drone`'s domain; this Drone flags the risk and routes rather than advising on compliance.

## Inputs the Drone needs
- Which CRM or CRMs are in scope, and whether the integration is single-CRM or multi-CRM
- Budget, time-to-market pressure, and data residency requirements, to evaluate native SDK against Merge.dev or Unified.to
- The product's own schema to map against the target CRM's Contact/Lead/Account taxonomy
- The current state of duplicate contacts or accounts, and whether a conflict resolution policy already exists
- Expected request volume, so the rate-limit math is run before committing to a polling architecture

## Outputs
- A field mapping table and a bi-directional sync design spec covering event ingestion, write propagation, conflict resolution, and reconciliation
- A dedup strategy worksheet with survivorship rules and an external ID alias pattern
- A lead enrichment plan naming Apollo or Clay for non-HubSpot stacks, since standalone Clearbit is deprecated outside HubSpot
- A full integration spec, or a code audit report with severity-rated findings when auditing existing sync code

## Commonly sequenced with
- `cold-outreach-wasp-drone`: consumes the enriched CRM write this Drone designs to drive outbound sequences
- `db-wasp-drone`: owns the internal product schema this Drone maps CRM fields against
- `python-wasp-drone` and `react-wasp-drone`: implement the backend sync and frontend widget this Drone specifies
- `security-wasp-drone`: reviews GDPR data residency and lawful basis for the CRM sync this Drone designs
