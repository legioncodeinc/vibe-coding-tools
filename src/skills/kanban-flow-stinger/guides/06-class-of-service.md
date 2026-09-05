# 06. Class of Service: Four Tiers and Queue-Bypass Rules

*Sources: `research/internal/command-brief-summary.md`; `research/external/2026-05-20-wip-limits-atlassian-official.md`*

---

## Why class of service exists

Not all work items have the same cost of delay. A bug that is costing the company $50,000/day in lost revenue has a different urgency than a feature that would be nice to have next quarter. Class of service is the mechanism that makes different cost-of-delay profiles visible on the board and routes items through the system according to their urgency.

Without class of service, urgency is handled by informal escalation ("just put it at the top of the backlog") which is invisible, inconsistent, and erodes the team's ability to reason about their WIP.

---

## The four canonical tiers

Anderson's Kanban Method defines four tiers. Each has a distinct cost-of-delay profile.

### Tier 1: Standard

- **Cost of delay:** Linear: cost increases at a constant rate over time.
- **Examples:** planned features, routine improvements, tech debt.
- **Queue treatment:** FIFO within the input queue.
- **WIP limit:** subject to normal column limits.
- **Visual marker:** default card color.

### Tier 2: Fixed-Date

- **Cost of delay:** Step function: nearly zero before the date, then infinite (or very high) after.
- **Examples:** compliance deadlines, external event launches, contractual delivery dates.
- **Queue treatment:** pull into active work when it needs to start to hit the date (work backwards from deadline).
- **WIP limit:** subject to normal column limits unless the fixed date is imminent; in that case, escalate to the team lead.
- **Visual marker:** orange or calendar icon.

### Tier 3: Expedite

- **Cost of delay:** Near-infinite: every day of delay is critical.
- **Examples:** production outages, security breaches, critical data corruption, highest-priority customer escalations.
- **Queue treatment:** bypasses the input queue entirely; enters active work immediately.
- **WIP limit:** the Expedite lane has its own limit of **1** (hard constraint). A second Expedite item cannot start until the first is done. If the team routinely exceeds 1 Expedite item, the Expedite lane has been misused and the class-of-service definitions need tightening.
- **Visual marker:** red swimlane, all other work pauses.

**The Expedite anti-pattern:** teams that route every "important" item through Expedite destroy the pull system. Every item that bypasses the queue is WIP outside the limit. An Expedite lane with 5 items is not a Kanban system anymore. Enforce the definition of Expedite ruthlessly.

### Tier 4: Intangible

- **Cost of delay:** Low or unknown: the work has strategic value but no immediate revenue or risk impact.
- **Examples:** exploratory research, tooling improvements, documentation, internal productivity investments.
- **Queue treatment:** FIFO, pulled only when capacity exists.
- **WIP limit:** subject to normal column limits; may have a lower per-class WIP limit to prevent intangible work from crowding out standard work.
- **Visual marker:** grey or lighter card color.

---

## Visual implementation on the board

Use swimlanes to separate tiers on a Jira or physical board. Note the Jira swimlane WIP counting bug (see `guides/08-tool-implementation.md`): if using Jira swimlanes, validate that WIP counts are correct per swimlane, not per column-total.

On Linear (no native WIP limits, no swimlanes): use labels for class of service and track per-class WIP manually or via GraphQL query.

---

## Class-of-service reference card

See `templates/class-of-service-card.md` for a printable reference card the team can post next to the board.

---

## Setting entry criteria for each tier

Each tier's definition must include explicit entry criteria to prevent arbitrary escalation. Example for the Expedite tier:

```
## Expedite — Entry Criteria

An item qualifies for the Expedite lane if ALL of the following are true:
- [ ] Production system is actively affected OR customer data is at risk
- [ ] The business cost of one additional day of delay exceeds $X (define X with your product owner)
- [ ] The item has been approved by [named role: e.g., Product Lead or Engineering Manager]

An item does NOT qualify for Expedite because:
- A stakeholder feels it is important
- A sprint deadline is approaching
- The item was planned for this week
```

Publish this definition in the team's handbook and review it quarterly. Escalation requests that do not meet the criteria should be routed to Fixed-Date or Standard tier.

---

*Example: `examples/wip-limit-setup-happy-path.md`: includes class-of-service swimlane configuration in the Jira setup section*
