---
source_url: internal
retrieved_on: 2026-05-20
source_type: internal-brief
authority: official
relevance: critical
topic: domain-context
stinger: live-chat-support-stinger
---

# Command Brief Notes: live-chat-support-worker-bee

## Summary

The `live-chat-support-worker-bee` is a specialist Angel for the customer support communication surface. It covers platform selection (Intercom, Crisp, Drift, Plain, Pylon, Help Scout), widget installation, HMAC identity verification, conversation routing, AI deflection, and GDPR data-export discipline. It runs after product decisions but before engineering touches any SDK.

## Key responsibilities extracted from brief

1. **Platform selection** — Triage B2B vs B2C fit, AI quality, pricing, Slack-native (Pylon), event-driven (Plain), startup vs enterprise scale.
2. **Widget integration** — JS snippet placement, CSP headers, React SDK (IntercomProvider, CrispProvider), Next.js App Router vs Pages Router considerations.
3. **HMAC identity verification** — Server-side signing (Node, Python, Ruby), key rotation, replay prevention via `created_at`, never client-side.
4. **Conversation routing** — Inbox, team, tag, attribute routing; skills-based; round-robin; overflow to human after bot timeout; priority queues for paying customers.
5. **AI deflection** — Fin 2.0, Crisp Bot, Drift AI; resolution-rate thresholds; knowledge base seed articles; human-fallback rules (mandatory).
6. **Data export discipline** — GDPR Article 20 portability; conversation export (JSON, CSV); analytics pipeline (Segment, Mixpanel); retention and deletion policies.

## Critical directives from brief (5 non-negotiables)

1. **HMAC always** — Never produce a client-only HMAC snippet; signing secret must stay server-side.
2. **Human fallback always** — Every AI deflection config must include a fallback escalation rule.
3. **Data-export day one** — Surface the data-export discipline on every platform-selection call.
4. **HMAC before identity attributes** — Validate HMAC is wired before recommending any user-facing identity attribute (name, email, plan are spoofable otherwise).
5. **Never hard-code support platform secret client-side** — Intercom's pricing is volume-sensitive; confirm seat count and conversation volume before recommending paid plans.

## Overlap boundaries

- **auth-worker-bee** owns the identity JWT that feeds the HMAC signing function; live-chat-support-worker-bee owns what to do with it (consuming it in the `boot()` call).
- **security-worker-bee** audits the resulting widget config for secret exposure and CSP compliance.
- **db-worker-bee** owns the production database schema for support data (not in scope here).

## Planned guide structure

| Guide | Title |
|---|---|
| `guides/00-principles.md` | Five non-negotiables |
| `guides/01-platform-selection.md` | Decision matrix across six platforms |
| `guides/02-widget-integration.md` | Installation patterns per platform |
| `guides/03-identity-verification.md` | HMAC deep dive (server-side signing) |
| `guides/04-conversation-routing.md` | Routing primitives and architecture |
| `guides/05-ai-deflection.md` | Fin 2.0, Crisp Bot, Drift AI configuration |
| `guides/06-data-export.md` | GDPR Article 20 portability and export formats |

## Key questions for stinger-forge

- Pylon is Slack-native — its routing model differs from widget-based tools; routing guide needs a Pylon-specific subsection.
- Does scripture-historian have access to Intercom, Crisp, and Plain developer portals directly? (Yes via Exa.) Prioritize HMAC signing docs and Fin 2.0 capability pages.
- Should `guides/01-platform-selection.md` include a startup-vs-enterprise dimension? (Yes, per brief.)

## Reference URLs identified in brief

- https://developers.intercom.com/docs/
- https://www.intercom.com/fin
- https://docs.crisp.chat/
- https://plain.com/docs
- https://usepylon.com/docs
- https://developer.helpscout.com/
- https://devdocs.drift.com/
- https://developers.intercom.com/installing-intercom/docs/enable-identity-verification-on-your-web-product

## Annotations for stinger-forge

- The brief's "IDENTITY & RESPONSIBILITY" section maps directly to the 6 guide files; each guide should cite its primary sources from `research/external/`.
- The five non-negotiables in the brief should become the preamble of `guides/00-principles.md` verbatim, then backed with source citations.
- Pricing sensitivity is explicitly flagged — the platform-comparison guide must include 2026 pricing data for each of the six platforms.
- The Fin/Crisp Bot/Drift AI capabilities section should compare deflection resolution rates (if published) alongside configuration complexity.
