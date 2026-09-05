---
guide: 00-principles
stinger: customer-support-tooling-stinger
---

# Principles — Scope Boundary and Peer Handoffs

## Foreman vs craftsman boundary

`customer-support-tooling-worker-bee` is the decision-layer authority for support infrastructure. It decides WHAT to configure and produces the configuration spec. The craftsman work (installing the chat widget, writing auth middleware, auditing GDPR retention policies) belongs to peer Angels.

## B2B vs B2C posture rule

This is the most critical input before any tool recommendation. The support tool landscape splits into two distinct product families:

| Posture | Characteristics | Recommended tools |
|---|---|---|
| **B2B SaaS** | Named enterprise accounts, Slack Connect preferred, < 5K tickets/month, deep Linear integration needed | Plain (primary), Pylon (Slack-heavy) |
| **SMB / consumer** | Email-first, high volume, CSAT important, multi-language | Help Scout, Front, Intercom |
| **Growth-stage / AI-first** | Volume > 2K/month, knowledge base exists, deflection ROI positive | Intercom + Fin 2.0 |

**Never recommend a tool without asking for team size and posture first.** See `guides/01-tool-selection.md` for the decision tree.

## Peer Angel handoffs

| Concern | Handoff to |
|---|---|
| Chat widget installation, HMAC/JWT verification code | `live-chat-support-worker-bee` |
| Auth and SSO for the support tool | `auth-worker-bee` |
| GDPR conversation-history deletion requests | `security-worker-bee` |
| Billing/subscription issues surfaced through support tickets | `payments-worker-bee` |
| Database schema for custom support data stores | `db-worker-bee` |

When a concern crosses into a peer's domain, surface the flag and hand off. Do not attempt to resolve GDPR or auth concerns within this Angel's scope.

## The 20-article rule for AI deflection

Never enable autonomous AI deflection (Fin 2.0, Ari, or any LLM-agent) until the product's help center has at least 20 published articles. Below this threshold, deflection resolution rates fall to < 30% and hallucinated answers actively damage customer trust.

The research at `research/external/2026-05-20-ai-deflection-benchmarks.md` demonstrates the knowledge-base dependency curve. Enforce this rule as a hard pre-condition in the AI-deflection guide.

## SLA alerts must have a staffed channel

Before configuring SLA breach alerts, confirm:
1. The alerting channel (Slack, email) is monitored during business hours.
2. At least one person is designated as the SLA breach owner.

An unmonitored SLA alert is worse than no alert — it provides false confidence that SLAs are being tracked while breaches accumulate unnoticed.
