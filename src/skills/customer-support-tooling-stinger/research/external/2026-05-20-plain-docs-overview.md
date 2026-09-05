---
url: https://plain.com/docs
title: "Plain Documentation — API Reference, Slack Connect, Workflows"
source_type: official_docs
authority: canonical
relevance: 5
fetched: 2026-05-20
topic: Plain API, Slack Connect, pricing, workflow automation
---

# Plain Documentation Overview

Plain is a developer-first customer support platform built for B2B SaaS companies. Its core design philosophy is "inbox as API": every action in Plain is a typed event accessible via GraphQL, webhooks, and a REST-compatible API. This distinguishes it sharply from Help Scout and Front, which are primarily UI-first tools with API access as an afterthought.

## Key findings

Plain's inbox model treats each customer as a "company entity" rather than a "contact". This is critical for B2B SaaS where one customer account may have multiple users. Support threads are scoped to the company, not the individual email sender — conversations from `alice@acme.com` and `bob@acme.com` both appear under the `Acme Corp` account.

**Slack Connect support:** Plain supports Slack Connect channels as a first-class inbox surface. Customers in a shared Slack channel can send messages that appear as Plain threads. Agents can reply from Plain's UI; replies appear in Slack. This is the primary competitive differentiator over Help Scout and Front for developer-tool companies whose enterprise customers prefer async Slack over email tickets.

**Pricing (2026):** Plain's public pricing offers three tiers: Starter ($50/agent/month), Pro ($100/agent/month), Enterprise (custom). The Starter tier has a 500 thread/month limit; Pro is unlimited threads with priority API rate limits. Enterprise includes SLA tracking dashboards, custom reporting, and dedicated onboarding. Note: the Pro tier's pricing for > 20 agents is not published and requires a sales call.

**Workflow automation:** Plain supports workflow triggers (e.g., "if SLA > 4h with no reply, reassign to senior queue") via its Workflow editor. Workflows are version-controlled in Plain's UI but can also be managed via API.

**Linear integration:** Plain ships a native Linear integration (not middleware-dependent). When a Plain thread is escalated, agents click "Create Linear issue" directly in the Plain UI. The Linear issue links back to the Plain thread; when the Linear issue closes, the Plain thread is automatically resolved.

## Key takeaways

- Plain is the strongest choice for developer-tool B2B SaaS with < 5K threads/month and teams that want code-level control over support workflows.
- Slack Connect inbox makes Plain the default recommendation when enterprise customers insist on Slack as their support channel.
- The native Linear integration removes the need for Zapier/Make/Runbear middleware for the eng-escalation use case.
- Pricing scales linearly with agents; cost becomes significant at > 15 agents vs. Help Scout's contact-based model.
- API quality is the highest of the five tools reviewed; every concept is a typed GraphQL schema.
