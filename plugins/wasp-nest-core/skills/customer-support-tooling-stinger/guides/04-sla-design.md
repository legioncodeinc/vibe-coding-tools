---
guide: 04-sla-design
stinger: customer-support-tooling-stinger
research_sources:
  - research/external/2026-05-20-sla-tracking-patterns.md
  - research/external/2026-05-20-plain-docs-overview.md
  - research/external/2026-05-20-front-shared-inbox.md
---

# SLA Design — Tier Definitions, Breach Alerts, CSAT Collection

Source: `research/external/2026-05-20-sla-tracking-patterns.md`

## Standard three-tier SLA model (B2B SaaS default)

| Tier | Label | Trigger definition | First-response SLA | Resolution SLA |
|---|---|---|---|---|
| P1 | **Customer Down** | Production outage, data loss, account inaccessible | 15 min (24/7) | 4 hours |
| P2 | **Feature Broken** | Core workflow impaired, no workaround | 2 hours (biz hours) | 1 business day |
| P3 | **How-To / Enhancement** | Usage questions, feature requests, cosmetic bugs | 1 business day | Best effort |

**When to adjust:** P1 first-response to 30 min if no 24/7 on-call rotation exists. Extend P3 resolution to 3 business days for teams of 1-2.

## SLA configuration per tool

### Plain

1. Navigate to Settings → Workflows.
2. Create a workflow: `Trigger: thread created with label "p1"` → `Action: set SLA 15 min first-response`.
3. Add a breach step: `If SLA > 80% elapsed` → `Slack alert to #oncall` + `Reassign to senior queue`.

### Intercom

1. Settings → SLAs → Create SLA policy.
2. Set conditions (tag = P1) and time targets.
3. Enable breach notifications to team lead's email + Slack via Intercom's notification center.

### Front

1. Settings → SLA policies → Create.
2. Scope per inbox or conversation attribute.
3. Configure escalation rules: breach → auto-reassign to team lead queue.
4. Front's SLA reporting dashboard shows first-response compliance by agent and inbox.

### Help Scout

1. Available on Plus and Pro plans only.
2. Settings → SLAs → create time-window policy.
3. Slack breach alert requires Zapier workaround (native Slack alerts not supported).

## Breach alert configuration checklist

Before enabling breach alerts:
- [ ] Slack channel is monitored during business hours (or 24/7 for P1).
- [ ] At least one named owner is responsible for SLA breach response.
- [ ] Alert thresholds set at 80% of SLA limit (not 100%) to allow recovery time.
- [ ] P1 alerts go to #oncall (or equivalent) — not #support-general.
- [ ] P2 alerts go to support team lead.
- [ ] P3 alerts go to weekly digest email (not real-time Slack — avoid alert fatigue).

## CSAT collection

| Tool | Native CSAT | Method | When triggered |
|---|---|---|---|
| Intercom | Yes | 1-question rating + optional text | Auto on conversation close |
| Front | Yes | 1-question rating + follow-up text | Auto on conversation close |
| Help Scout | Yes (Pro plan) | 1-question rating | Auto on conversation close |
| Plain | No | Typeform webhook or custom link in resolution message | Manual |
| Pylon | No | Delighted or Typeform integration | Manual |

**CSAT target benchmarks (B2B SaaS):**
- > 90% positive: excellent
- 80-90%: acceptable, investigate the 10-20% negative cases weekly
- < 80%: flag to product/eng; systemic issue likely

**Weekly CSAT review workflow:** Export last 7 days of CSAT responses. Filter negative scores. Read associated conversations. Tag root causes (product bug, slow response, missing docs). Feed into roadmap triage.
