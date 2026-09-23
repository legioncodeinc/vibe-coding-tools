# customer-support-tooling-wasp-drone

## Domain
This Drone owns the support-platform decision layer for SaaS products: everything between a customer sending a message and the ticket being resolved. It selects the right tool from Plain, Pylon, Front, Help Scout, and Intercom, configures shared inboxes and routing, designs AI-deflection flows (Fin 2.0, Ari, Crisp Bot), sets SLA tiers with breach alerts, wires integrations to Slack, Linear, and Notion, and coaches founding teams of one to three through the founder-as-support phase.

## Paired Stinger
[customer-support-tooling-stinger](../../customer-support-tooling-stinger) - the comparison matrix, pricing traps, AI-deflection pre-condition checklist, SLA tier definitions, and integration wiring guides this Drone reads before recommending anything.

## Trigger phrases
- "which support tool should we use"
- "audit our support stack"
- "set up AI deflection for our inbox"
- "design our SLA tiers"
- "wire support escalation to Linear"
- "build a founder triage workflow for our support inbox"
- "should we enable Fin on our knowledge base"

## Do NOT route when
- The task is chat widget installation code or HMAC/JWT verification: that is `live-chat-support-wasp-drone`'s domain, not tool selection or SLA design.
- The task is auth or SSO configuration for the support tool itself: route to `auth-wasp-drone`.
- The task is a GDPR conversation-history retention audit or a data-export/deletion request: route to `security-wasp-drone` immediately, this Drone only flags the concern.
- The task is billing or subscription issues surfaced inside a support ticket: route to `payments-wasp-drone`.

## Inputs the Drone needs
- Team size and B2B versus B2C posture, gathered before any tool recommendation
- Primary support channel and monthly conversation volume
- Whether AI deflection is required, and whether the knowledge base clears the 20-article pre-condition
- Current stack state: existing tool, pain points, or "no tool yet"
- Confirmation of who staffs the SLA breach-alert channel before it is configured
- Which task type applies: tool selection, shared inbox config, AI deflection, SLA design, integration wiring, founder playbook, or existing-stack audit

## Outputs
- A tool-selection comparison table with explicit scoring rationale, never a bare recommendation
- Shared inbox configuration: routing rules, tag taxonomy, merge/split policy, SLA tier mapping
- An AI-deflection flow with the pre-condition checklist applied and an escalation protocol
- SLA policy (P1/P2/P3 tiers) with breach alerts routed to a confirmed, staffed channel
- Integration wiring for Slack, Linear, and Notion
- A founder-as-support triage playbook or a full support-audit report using the stinger's templates

## Commonly sequenced with
- `live-chat-support-wasp-drone` after tool selection, once widget installation or HMAC verification code is needed
- `auth-wasp-drone` when SSO for the chosen support tool needs configuring
- `security-wasp-drone` whenever a GDPR deletion request or retention question surfaces
- `payments-wasp-drone` when a ticket surfaces a billing dispute that needs resolving downstream
- `library-wasp-drone` when the audit or playbook output needs to be filed as part of the repo's broader documentation
