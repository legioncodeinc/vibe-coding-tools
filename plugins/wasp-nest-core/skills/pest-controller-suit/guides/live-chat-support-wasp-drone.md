# live-chat-support-wasp-drone

## Domain
This Drone owns the live chat and helpdesk communication surface across Plain, Pylon, Intercom, Crisp, and Help Scout (Drift is sunset as of March 2026 and is never recommended for new projects). It covers platform selection, widget installation and CSP configuration, server-side-only HMAC-SHA256 and JWT identity verification, conversation routing architecture (teams, skills-based, priority queues, overflow), AI deflection configuration (Fin 2.0, Plain Ari, Crisp Bot) with a mandatory human-fallback rule, and the data-export discipline for GDPR Article 20 portability. The domain exists because unsigned widget identity and missing day-one export setup are both invisible until they become incidents.

## Paired Stinger
[live-chat-support-stinger](../../live-chat-support-stinger) - the platform decision matrix, identity-verification deep dive, routing spec templates, AI deflection configuration, and the data-export checklist.

## Trigger phrases
- "integrate live chat"
- "add a support widget"
- "set up Intercom"
- "configure Fin AI"
- "wire HMAC identity verification"
- "design conversation routing"
- "which live chat should we use?"
- "GDPR data export for our support platform"

## Do NOT route when
- The task is application-layer authentication such as sign-in flows or session tokens: that is `auth-wasp-drone`.
- The task is database schema for support records: that is `db-wasp-drone`.
- The task is a security audit of the completed widget integration: that is `security-wasp-drone`.
- The task is support inbox routing, ticketing, or SLA tiers outside the chat widget itself: that is `customer-support-tooling-wasp-drone`.
- The platform in question is outside the five covered (for example Zendesk, Freshdesk, Salesforce Service Cloud): answer from general knowledge and flag the coverage gap rather than treating it as fully researched.

## Inputs the Drone needs
- Whether the request is platform selection, widget installation, identity verification, routing design, AI deflection, or an audit of an existing setup
- Seat count and monthly conversation volume before recommending any paid plan upgrade
- Whether the target platform is one of the five covered (Plain, Pylon, Intercom, Crisp, Help Scout); anything else is answered from general knowledge with the coverage gap flagged
- Confirmation that identity-verification secrets will be signed server-side, never placed in client-side code
- Whether the user mentioned Drift, which is sunset as of March 2026 and must be redirected to an active platform

## Outputs
- A concrete platform recommendation with a two-sentence rationale, never just a comparison
- A server-side HMAC or JWT signing function, with `Cache-Control: no-store` on the signing endpoint
- A structured routing spec ready to paste into the platform's routing settings
- An AI deflection configuration that always includes a human-fallback escalation path
- A data-export checklist surfaced on every platform-selection call, and a scored audit report when requested
- A confirmed seat count and monthly conversation volume before any paid plan upgrade is recommended

## Commonly sequenced with
- `auth-wasp-drone` alongside, never merged: application sign-in flows and widget identity verification are distinct trust boundaries
- `security-wasp-drone` after: audits the completed HMAC/JWT integration once this Drone has wired it
- `customer-support-tooling-wasp-drone` alongside: when AI deflection in the chat widget must coordinate with ticketing SLA policy
- `knowledge-base-help-center-wasp-drone` alongside: when the AI deflection bot needs a knowledge source seeded from the help center
