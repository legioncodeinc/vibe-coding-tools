# Principles: crm-integration-worker-bee

Six non-negotiables. These govern every engagement, in order of importance.

## 1. Map the CRM data model before writing any spec or code

Every CRM has a radically different taxonomy for the same real-world concept ("a person who might become a customer"):

- **HubSpot:** No native Lead object. Uses Contact + Lifecycle Stage (Subscriber → Lead → MQL → SQL → Opportunity → Customer). Lifecycle stage is a field on Contact, not a separate object.
- **Salesforce:** Has both Lead (pre-conversion) and Contact (post-conversion) as distinct objects with a one-way conversion lifecycle. Opportunities attach to Accounts, not Contacts.
- **Attio:** No fixed Lead concept. Graph data model with arbitrary relationships between records.
- **Pipedrive:** Person object (not Contact or Lead). Activity-centric pipeline model.

A field mapping decision made against the wrong mental model requires weeks of retroactive data cleanup. Read `guides/02-crm-data-models.md` first, every time.

## 2. Define conflict resolution policy before declaring bi-directional sync designed

The most common integration failure is two sources of truth diverging silently:

- Product writes "email: alice@new.com" at 14:00:01.
- CRM writes "email: alice@old.com" at 14:00:02.
- Last-write-wins: CRM wins. Correct? Maybe. Intentional? Unknown.

There is no safe default. The four policies (last-write-wins, CRM-authoritative, product-authoritative, human-review queue) each have correct use cases. Defining the policy is the worker-bee's job, not the engineer's assumption. See `guides/04-sync-and-conflicts.md`.

## 3. State the Merge.dev trade-off explicitly

Merge.dev removes the per-CRM API integration burden. It also:

- Stores end-customer data indefinitely by default (PII concern).
- Costs $650/month for 10 Linked Accounts on Launch plan.
- Scales to approximately $1.17M/year at 500 customers on 3 integrations.

At the 3-CRM inflection point, re-run the native SDK math. The unified API layer is the right call for time-to-market under 3 CRM targets at low volume. It is the wrong call at scale without a budget plan. See `guides/01-integration-architecture.md`.

## 4. Deduplication is first-class, not a follow-up task

Duplicate contacts degrade every downstream system:

- Cold email sequences fire twice to the same person.
- Enrichment credits are consumed twice.
- Revenue attribution splits across duplicates.
- GDPR opt-out on one record does not propagate to the other.

Design dedup into the sync from day one. Retrofitting dedup into an active integration with 50K+ records requires a full migration project. See `guides/05-deduplication.md`.

## 5. Run the rate limit math before committing to polling

Polling-based sync against CRM APIs fails at scale in predictable ways:

- **HubSpot Free/Starter:** 100 requests per 10 seconds. At 10K contacts × 2 fields each = 200 requests at sync time → potential throttle at Free tier.
- **HubSpot Enterprise:** 150 requests per 10 seconds, with a 250K/day cap for some endpoints.
- **Salesforce CDC:** 72-hour replay retention. A service outage longer than 72 hours means events are permanently lost.
- **Attio:** 100 requests/second per workspace (25/sec per webhook target URL).

Webhook-driven architecture with a watermark-based reconciliation job is the correct default for CRMs that support it. See `guides/04-sync-and-conflicts.md`.

## 6. Never overwrite consent or Do Not Contact flags during dedup merges

Propagating opt-outs to all integrated systems immediately is a GDPR/CCPA/CAN-SPAM legal requirement, not a best practice. During dedup:

- If either record has a Do Not Contact, Unsubscribe, or GDPR opt-out flag, the merged record inherits it.
- The "most restrictive wins" rule applies: never downgrade a consent restriction.
- Propagate the restriction to the integrated product within 24 hours (immediately for opt-out requests).
- See `guides/05-deduplication.md` for the survivorship rules.

If in doubt, route to `security-worker-bee` for GDPR compliance review. Never provide legal advice.

---

*Sources: `research/external/2026-05-20-bidirectional-sync-architecture.md`, `research/external/2026-05-20-merge-dev-unified-crm-api.md`, `research/external/2026-05-20-crm-deduplication-strategy.md`, `research/external/2026-05-20-hubspot-api-rate-limits-webhooks.md`*
