---
url: https://linear.app/docs/slack
title: "Linear Slack Integration Docs + Runbear Middleware Pattern"
source_type: official_docs_plus_middleware
authority: high
relevance: 5
fetched: 2026-05-20
topic: Slack-to-ticket sync, Linear issue creation, Runbear, bi-directional patterns
---

# Slack-to-Linear Support Integration

Developer-first SaaS companies often route support through Slack before a ticket system. The canonical integration pattern connects three layers: Slack (customer conversation surface) → support tool (Plain, Intercom, or Pylon as inbox) → Linear (engineering issue tracker for escalations).

## Native vs. middleware patterns

**Plain + Linear (native):** Plain's native Linear integration is the cleanest path. Workflow: Plain thread is escalated → agent clicks "Create Linear issue" in Plain UI → Linear issue appears in the configured team/project with a backlink to the Plain thread → when the Linear issue is closed, Plain thread is automatically resolved. No middleware required.

**Intercom + Linear (via Zapier/Make):** Intercom does not have a native Linear integration. The common pattern uses Zapier: trigger on "Intercom conversation tagged 'engineering'" → create Linear issue → post Linear URL back to Intercom conversation. This is fragile; Zapier task limits and webhook failures cause sync drift.

**Runbear (Slack-native middleware):** Runbear is a Slack-native middleware that creates a bi-directional sync between Slack threads and support/project management tools. It can route a Slack thread to Linear as a bug report or feature request without going through a support tool as an intermediate. Useful for teams that want to skip the dedicated support inbox and route Slack threads directly to Linear. Pattern: Customer messages in #support-acme-corp Slack channel → Runbear detects message → creates Linear issue → posts issue link in Slack thread → Linear issue assignee can reply from Linear and the reply appears in Slack.

**Unthread / Thena / ClearFeed:** Three competing Slack-native support inbox tools that aggregate shared Slack channels (similar to Pylon) and offer Linear integration. Coverage of these is limited in primary sources; flagged as open question in research-summary.

## SLA tracking across Slack channels

A recurring practitioner pain point: when support happens in Slack channels, SLA tracking requires instrumenting every channel. Plain's Slack Connect inbox handles this natively — each Slack thread gets an SLA timer in Plain. Pylon does the same for its Slack Connect channels. For Runbear-style direct routing, SLA tracking must be done in Linear itself (Linear has first-response SLA tracking as of 2025).

## Key takeaways

- Plain + Linear native is the lowest-friction integration for developer-first B2B products; recommend it as the default.
- Intercom + Linear requires middleware (Zapier/Make) and is fragile at scale; factor in maintenance overhead.
- Runbear is a viable choice when the team wants to skip a dedicated support inbox and route Slack threads directly to Linear.
- SLA tracking in Slack-only flows requires either a support tool inbox (Plain/Pylon) or Linear's own SLA feature.
- Always wire Linear issue resolution back to Slack thread reply to close the loop with the customer.
