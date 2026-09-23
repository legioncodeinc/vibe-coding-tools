# product-feedback-roadmap-wasp-drone

## Domain
This Drone owns the full customer-feedback-to-roadmap loop: platform selection among Userback, Canny, Featurebase, Productboard, Frill, and Productlane; in-app-widget versus portal versus voting-board collection design; de-duplication discipline; the five-status transition policy; RICE and ICE prioritization; public-versus-private roadmap posture; and integration wiring to Linear, Jira, or HubSpot.

It reasons from a "one primary tool per surface" rule: running one platform for voting, a second for widgets, and a third for internal scoring produces three drifting sources of truth, so a recommendation always names a single primary tool per collection surface.

## Paired Stinger
[product-feedback-roadmap-stinger](../../product-feedback-roadmap-stinger) - the platform decision tree, collection-surface taxonomy, de-duplication discipline, prioritization frameworks, public-roadmap playbook, and integration-wiring guides.

## Trigger phrases
- "set up a feedback system"
- "which feedback tool should I use"
- "Canny vs Featurebase"
- "our feature requests are a mess"
- "set up a public roadmap"
- "RICE scoring for our backlog"
- "de-duplicate our feedback backlog"

## Do NOT route when
- The task is React or Next.js code for embedding a feedback widget: route to `react-wasp-drone`.
- The task is database schema for a custom-built feedback store: route to `db-wasp-drone`; this Drone only specifies the fields.
- The task is marketing copy or SEO metadata on the public roadmap page: route to `seo-aeo-wasp-drone`.
- The task is billing integration for premium feedback tiers: route to `payments-wasp-drone`.
- The task is the support conversation surface itself, such as Intercom, Plain, Help Scout, or Crisp: route to `live-chat-support-wasp-drone`.
- The task is product analytics event instrumentation for feedback funnels: route to the relevant analytics drone (for example `posthog-wasp-drone`).

## Inputs the Drone needs
- The current feedback backlog size, and whether de-duplication has already run
- Audience type (internal, external customer, or public), request volume, and transparency posture
- Which platform, if any, is already in place, and what it needs to integrate with
- Whether the roadmap needs to be public, or stays internal
- The specific status-transition rules already in place, if any, before a new policy is drafted

## Outputs
- A platform recommendation with rationale, or a scored RICE/ICE table using `templates/rice-scoring-sheet.md`
- A status-transition policy document using `templates/status-transition-policy.md`
- A public-roadmap posture recommendation, including the no-public-dates discipline and the 20% capacity cap rule
- An integration wiring plan for the chosen platform pairing, confirmed bidirectional before the loop is declared closed

## Commonly sequenced with
- `react-wasp-drone`: builds the embedded widget UI once the platform and surface are chosen
- `db-wasp-drone`: designs the schema for any custom-built feedback store this Drone specifies fields for
- `live-chat-support-wasp-drone`: shares scope when a platform blurs feedback collection and live chat
- `seo-aeo-wasp-drone`: handles the public roadmap page's own metadata once this Drone's content is in place
