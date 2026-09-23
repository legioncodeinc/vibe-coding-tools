---
example: b2b-plain-linear-slack
scenario: B2B SaaS developer tool (25 enterprise customers, 3 support agents)
stinger: customer-support-tooling-stinger
guides_demonstrated:
  - guides/01-tool-selection.md
  - guides/02-shared-inbox-config.md
  - guides/04-sla-design.md
  - guides/05-integrations.md
---

# Worked Example — B2B SaaS with Plain + Linear + Slack Connect

## Scenario

A B2B developer tool company with 25 enterprise customers, 3 support agents, and all customers communicating via Slack Connect channels. They're evaluating support tooling and want Linear integration for engineering escalations.

## Tool selection (applying `guides/01-tool-selection.md`)

**Decision tree path:**
1. Primary channel: Slack Connect → Plain or Pylon
2. Need strong Linear integration: Yes → **Plain** (native, best-in-class) > Pylon (basic)

**Recommended:** Plain Pro ($100/agent/month × 3 agents = $300/month)

**Comparison table produced:**

| Criterion | Plain | Pylon |
|---|---|---|
| Slack Connect inbox | Best-in-class | Strong |
| Linear integration | Native + auto-close | Native (no auto-close) |
| API quality | GraphQL | REST |
| Price (3 agents) | $300/month | ~$225/month (est.) |
| Score | **4.6/5** | 3.8/5 |

**Rationale:** The $75/month price premium for Plain over Pylon is justified by the native Linear auto-close integration, which eliminates a manual step that would otherwise require a workflow or Zapier.

## Shared inbox configuration (applying `guides/02-shared-inbox-config.md`)

**Inbox structure:**
```
Plain Inbox
├── Unassigned (triage — assign within 15 min)
├── P1 — Active (SLA: 15 min first response)
├── P2 — In Progress
├── Waiting on Customer (paused SLA)
└── Closed (last 7 days)
```

**Routing rules:**
- All threads start in Unassigned.
- P1-tagged threads: auto-assign to on-call agent (rotated weekly).
- P2-tagged threads: round-robin among 3 agents.
- `billing`-tagged threads: assign to agent-1 (billing specialist).

**Tags configured:** `bug`, `feature-request`, `how-to`, `billing`, `account`, `p1`, `p2`, `p3`, `needs-eng`, `waiting-on-eng`

## SLA configuration (applying `guides/04-sla-design.md`)

| Tier | Tag | First-response | Resolution | Breach alert |
|---|---|---|---|---|
| P1 | `p1` | 15 min (24/7) | 4 hours | Slack #oncall |
| P2 | `p2` | 2 hours (biz hours) | 1 business day | Slack #support-sla |
| P3 | `p3` | 1 business day | Best effort | Weekly email |

**Plain workflow configuration:**
- Trigger: `label is "p1"` → SLA target 15 min.
- Breach action at 80% elapsed: Slack alert to #oncall + reassign to senior queue.

## Integration wiring (applying `guides/05-integrations.md`)

**Slack Connect:** 25 Slack channels connected → Plain inbox. Agent replies in Plain appear in customer's Slack channel. Configured in Plain → Settings → Channels.

**Linear integration:**
1. Plain → Settings → Linear → Connected to `Engineering` team, `Customer-Reported Bugs` project.
2. Agents click "Create Linear issue" on any `needs-eng` thread.
3. Linear issue auto-created with Plain thread URL in description.
4. On Linear issue close: Plain thread auto-resolved with message "The issue has been fixed in [version]."

**Notion knowledge base:** Customer knowledge base lives in Notion. Workaround: top 30 Notion articles exported to Plain Notes monthly (manual, scheduled task). AI deflection deferred until 30+ Plain Notes published.

## Outcome

- Support team configured in 3 hours.
- All 25 Slack Connect channels connected to Plain inbox.
- P1/P2/P3 SLA tiers configured with breach alerts.
- Linear integration live; first engineering escalation closed the Plain thread automatically.
- Knowledge base migration scheduled for next sprint (30 articles target).
