---
guide: 02-shared-inbox-config
stinger: customer-support-tooling-stinger
research_sources:
  - research/external/2026-05-20-plain-docs-overview.md
  - research/external/2026-05-20-front-shared-inbox.md
  - research/external/2026-05-20-sla-tracking-patterns.md
---

# Shared Inbox Configuration — Routing, Tags, SLA Tier Mapping

## Routing rules

Configure routing before agents start working the queue. Unrouted conversations are invisible to the right person and create SLA misses.

### Assignment rule patterns

| Pattern | When to use | Example |
|---|---|---|
| **Round-robin** | Teams of 2-8 with similar skills | Distribute new threads evenly across available agents |
| **First-available** | High-volume B2C with fast SLAs | Assign to whoever picks up first |
| **Tag-based routing** | Specialized teams (billing, technical) | Threads tagged "billing" → billing team queue |
| **Priority-first** | P1/P2 must jump queue | P1 threads auto-assigned to senior agent on call |

### Inbox structure (recommended)

```
Inbox
├── Unassigned (triage view — assign within 15 min)
├── P1 — Active (SLA: 15 min first response)
├── P2 — In Progress
├── Waiting on Customer (paused SLA)
└── Closed (last 7 days)
```

## Tag taxonomy

Keep the tag list flat and < 20 tags. Tags that multiply without governance become useless.

**Reason codes (apply to every thread):**
- `bug` — reproducible defect
- `feature-request` — enhancement ask
- `how-to` — usage question
- `billing` — payment/subscription issue
- `account` — access, SSO, permissions

**Priority tags (SLA tier mapping):**
- `p1` — production down / data loss
- `p2` — feature broken, no workaround
- `p3` — how-to, enhancement (default if untagged)

**Escalation tags:**
- `needs-eng` — requires engineering investigation
- `waiting-on-eng` — Linear issue created, blocked on fix
- `escalated` — escalated to account manager / CTO

## Merge and split policies

- **Merge:** When the same customer opens duplicate threads on the same topic, merge into the oldest open thread. Always notify the customer in the merged thread.
- **Split:** When a single thread contains two unrelated issues, split and tag each with the appropriate reason code. Assign each split thread separately.
- **Never merge:** Threads from different companies (in B2B); threads with different SLA tiers.

## SLA tier mapping to tags

| Tag | First-response SLA | Resolution SLA | Breach alert |
|---|---|---|---|
| `p1` | 15 min (24/7) | 4 hours | Slack #oncall immediately |
| `p2` | 2 hours (biz hours) | 1 business day | Slack #support-sla |
| `p3` | 1 business day | Best effort | Email weekly digest |

Configure breach alerts per tool:
- **Plain:** Workflow trigger on SLA > 80% → assign to senior queue + Slack alert.
- **Intercom:** SLA policy → breach notification to team lead.
- **Help Scout:** Requires Zapier for Slack alert on breach (not native). Source: `research/external/2026-05-20-sla-tracking-patterns.md`.
- **Front:** Built-in SLA escalation rules → auto-reassign to team lead queue.
