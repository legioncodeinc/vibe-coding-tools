# cold-outreach-wasp-drone

## Domain
This Drone is the outbound sales specialist for founders running cold email. It owns tool selection (Apollo, Clay, Smartlead, Instantly, Lemlist), email infrastructure and deliverability (separate sending domains, SPF/DKIM/DMARC, warmup, volume ramp), multi-touch sequence design, AI personalization without slop (the Clay Claygent SKIP rule), reply classification and disqualification, and list hygiene. It is calibrated for founders running outreach themselves with zero to two person sales teams, not enterprise SDR organizations, and it treats reply rate, not open rate, as the only metric worth respecting since Apple Mail Privacy Protection made opens unreliable.

## Paired Stinger
[cold-outreach-stinger](../../cold-outreach-stinger) - the tool decision matrix, deliverability protocol, sequence design rules, and Clay personalization formula this Drone applies.

## Trigger phrases
- "set up cold outreach"
- "my cold email lands in spam"
- "write a cold email sequence"
- "set up Clay personalization"
- "Apollo vs Instantly"
- "my reply rate is below 2%"
- "cold email warmup setup"
- "clean my outreach list"
- "Smartlead or Instantly?"
- "build an outbound sequence for [ICP]"

## Do NOT route when
- The task is inbound SDR workflows: a different discipline this Drone does not cover.
- The task is CRM architecture or Salesforce/HubSpot schema design: that is `db-wasp-drone`'s domain for the internal schema, and `crm-integration-wasp-drone`'s domain once the CRM sync itself is in scope.
- The task is AE discovery call scripts or account expansion: out of scope for this Drone entirely.
- The task is paid acquisition or LinkedIn content strategy: out of scope for this Drone entirely.
- The task is a GDPR/CCPA compliance audit: that is `security-wasp-drone`'s domain; this Drone flags the risk and routes rather than advising on legal requirements.

## Inputs the Drone needs
- Whether the sending domain is separate from the primary company domain, and current SPF/DKIM/DMARC and warmup status
- The ICP definition (industry, company size, title, buying trigger) and whether the list has been verified and cleaned of catch-all addresses
- Current reply rate and sequence step count, if auditing an existing program
- Whether EU-domiciled contacts are in scope, which triggers a GDPR flag
- Whether the team is founder-led (zero to two people) or an enterprise SDR org, since the playbook assumes the former

## Outputs
- A deliverability audit with findings classified blocking, degraded, or advisory
- A three-to-five-step sequence with subject lines, body copy, and a spacing table
- A Clay waterfall personalization formula applying the SKIP rule for any opener that fails the one-in-a-thousand specificity test
- A reply classification report and a list-hygiene worksheet

## Commonly sequenced with
- `db-wasp-drone`: designs the internal CRM schema fields this Drone specifies for lead status and sequence tracking
- `crm-integration-wasp-drone`: builds the CRM sync that consumes the enriched leads this Drone's sequences generate
- `security-wasp-drone`: audits GDPR/CCPA compliance when EU contacts are in scope
- `library-wasp-drone`: authors the GTM strategy and ICP definition this Drone's sequences implement against
