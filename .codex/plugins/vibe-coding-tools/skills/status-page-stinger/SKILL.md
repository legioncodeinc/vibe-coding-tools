---
name: "status-page-stinger"
description: "Public status page specialist: platform selection, incident communication templates, subscriber notifications, compliance. Use when setting up or auditing a status page."
---

# Status Page Stinger

Public status page playbook: from platform selection through post-incident discipline. Backed by May 2026 research on pricing, API surfaces, and practitioner communication norms.

Command Brief: `ai-tools/command-briefs/status-page-worker-bee-command-brief.md`
Research: `../status-page-stinger/research/research-summary.md`

---

## When this stinger applies

Covers platform selection (Statuspage/Atlassian, Better Stack, Instatus, Cachet OSS), component tree architecture, incident communication templates (initial/update/resolution), subscriber notification setup (email, SMS, webhook, Slack), GDPR/CAN-SPAM compliance for notification lists, post-incident update discipline, and API-driven automation integration, for React/Next.js and SaaS products.

Load this stinger when `status-page-worker-bee` is invoked. Typical triggers:

- "Set up a status page for our SaaS product"
- "Which status page tool should we use, Statuspage vs Better Stack vs Instatus?"
- "We're on Statuspage; should we migrate to Better Stack?"
- "Write me an incident communication template"
- "Configure subscriber SMS notifications for our status page"
- "Our incident updates are confusing: audit them"
- "Write a maintenance window announcement"
- "Connect PagerDuty to our status page"
- "We're getting complaints about radio silence during incidents"
- "Cross-link this post-mortem to the status page incident"

Do NOT load for:
- Monitoring/alerting infrastructure configuration → `devops-worker-bee`
- On-call rotation design, PagerDuty/OpsGenie setup → `devops-worker-bee`
- Observability dashboards, SLO/SLI definitions → `devops-worker-bee`
- Operational runbooks → `runbook-writing-worker-bee`

---

## First action when this stinger is loaded

1. Read `guides/00-platform-selection.md` to understand the 2026 platform landscape: pricing has changed significantly since 2024.
2. Read `guides/10-failure-modes.md` first on every invocation. Covers the three most common status page anti-patterns that erode user trust.
3. Read the appropriate domain guide based on what the user needs.

---

## Critical directives

These non-negotiables apply on every invocation. Full justification in each guide.

- **Separate the detection layer from the communication layer.** Status pages that require manual updates produce stale pages at exactly the moment users are watching. Always surface the automation integration path. See `guides/05-automation-integration.md`.

- **Never deliver an incident template without a time-box commitment.** The "next update in X minutes" slot is not optional. It is the single highest-impact element in a template. See `guides/02-incident-communication.md`.

- **Cachet v3 is NOT production-ready as of 2026.** Subscriber/notification features are absent from v3.x. Recommend v2.4.1 for production. See `guides/00-platform-selection.md` for the full Cachet decision.

- **Statuspage component status changes do NOT trigger subscriber notifications.** Only incidents do. Teams that rely on component status changes to communicate downtime will silently fail to notify subscribers. Flag this in every Statuspage recommendation.

- **Instatus SMS is BYOC (bring your own carrier).** The team is responsible for A2P 10DLC registration, carrier compliance, and STOP keyword handling when using Instatus SMS. See `guides/03-subscriber-notifications.md`.

- **Always include GDPR opt-in and CAN-SPAM unsubscribe in every subscriber notification design.** These are legal requirements, not best-effort suggestions. See `guides/03-subscriber-notifications.md`.

---

## Folder layout

```text
status-page-stinger/
+- SKILL.md                             (this file)
+- README.md                            (one-page human overview)
+- guides/
|  +- 00-platform-selection.md          (Statuspage vs Better Stack vs Instatus vs Cachet decision matrix)
|  +- 01-component-architecture.md      (service component tree, grouping heuristics, metric display)
|  +- 02-incident-communication.md      (three-template set, cadence, tone, severity taxonomy)
|  +- 03-subscriber-notifications.md    (email, SMS, webhook, Slack setup + GDPR/CAN-SPAM)
|  +- 04-post-incident-discipline.md    (resolution timing, maintenance windows, post-mortem links)
|  +- 05-automation-integration.md      (API-driven updates, monitoring webhooks, CI/CD integration)
+- examples/
|  +- happy-path-setup.md               (end-to-end: new SaaS product choosing Instatus, configuring components, first incident)
|  +- live-incident-walkthrough.md      (realtime incident communication from page creation to resolution)
+- templates/
|  +- incident-initial.md               (investigating/acknowledged template)
|  +- incident-update.md                (live update with time-box commitment)
|  +- incident-resolved.md              (resolution with post-mortem cross-link slot)
|  +- maintenance-window.md             (scheduled maintenance announcement template)
+- reports/
|  +- README.md                         (status page audit report shape)
+- research/
   +- research-summary.md               (executive summary from scripture-historian)
   +- index.md                          (manifest of all source files)
   +- external/                         (11 source notes from literature sweep)
```

---

## Platform quick-reference (2026)

| Platform | Free tier | Entry paid | SMS | Self-host | Best for |
|---|---|---|---|---|---|
| Atlassian Statuspage | 100 subs / 25 components | $29/mo | Included (create/resolve only) | No | Atlassian/PagerDuty shops |
| Better Stack | 10 monitors | $29/mo | $29/mo per responder (unlimited) | No | All-in-one consolidation |
| Instatus | 200 subs / 15 monitors | $20/mo | BYOC (Twilio/Vonage) | No | Value + channel breadth |
| Cachet | N/A | Free | v2.x only | Yes (BSD-3) | OSS communication layer |
| OpenStatus | Yes | $30/mo | No | Yes (MIT) | OSS with cloud option |

Full decision tree and scoring in `guides/00-platform-selection.md`.

---

## Pairing

| Role | Artifact |
|---|---|
| This stinger | `../status-page-stinger/` |
| Paired Bee | `.claude/agents/status-page-worker-bee.md` |
| Command Brief | `ai-tools/command-briefs/status-page-worker-bee-command-brief.md` |
| Related: monitoring/alerting | `devops-worker-bee` |
| Related: operational runbooks | `runbook-writing-worker-bee` |
| Related: incident postmortem authorship | `library-worker-bee` |

---

*Forged by `stinger-forge` from `status-page-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
