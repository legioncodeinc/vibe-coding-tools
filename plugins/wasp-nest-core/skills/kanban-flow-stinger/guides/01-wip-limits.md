# 01. WIP Limits: Setting, Enforcing, and Iterating

*Sources: `research/external/2026-05-20-wip-limits-agile-flow-consulting.md`; `research/external/2026-05-20-wip-limits-uplevel-engineering.md`; `research/external/2026-05-20-wip-limits-atlassian-official.md`*

---

## Why WIP limits exist

WIP limits are the defining mechanism of Kanban. Without them, the board is a visualization tool, not a flow system. WIP accumulation directly increases cycle time via Little's Law (L = λW): as WIP grows, cycle time grows proportionally if throughput holds constant.

The Atlassian Kanban documentation names four goals WIP limits achieve:
1. **Surface bottlenecks**: when a column fills to its limit and the downstream column is empty, the bottleneck becomes visible and actionable.
2. **Reduce context switching**: people finish before starting, rather than juggling.
3. **Enable flow optimization**: you cannot diagnose a system that never constrains itself.
4. **Make capacity explicit**: limits reveal how much the team can actually handle vs how much they want to start.

Source: `research/external/2026-05-20-wip-limits-atlassian-official.md`

---

## The "never without data" rule

Arbitrary WIP limits ("let's try 3") are worse than no limits because they create false confidence and cause real harm when set too low (constant limit violations that the team learns to ignore) or too high (limits that never bind and therefore change nothing).

**The only principled starting points:**

### Method 1: Throughput-derived (preferred when data exists)

Formula from `research/external/2026-05-20-wip-limits-agile-flow-consulting.md`:

> WIP limit = throughput per week × target cycle time in weeks

Example: team completes 8 items/week, wants a target cycle time of 1 week. WIP limit = 8. Adjust per stage by the fraction of time work spends in that stage.

### Method 2: Capacity-based (for active-work columns)

Formula from `research/external/2026-05-20-wip-limits-uplevel-engineering.md`:

> Active work WIP limit = number of people serving that stage × 1.5 (or 2 for pairing tolerance)

Rationale: 1 item per person guarantees serial focus. The 0.5 slack accommodates one blocked item being passively watched while the person starts the next.

### Method 3: Empirical quickstart (no data available)

From `research/external/2026-05-20-wip-limits-agile-flow-consulting.md`:

> Set the limit to current average WIP minus one.

Observe for two weeks. If the limit is never hit, reduce by one again. Repeat until it binds, then adjust based on flow outcome. This method is slower than throughput-derived but safe to start with.

---

## Per-stage vs global WIP limits

**Per-stage limits** (column limits) are the standard. Each workflow stage has its own limit. This is the Kanban default.

**Global WIP limits** (total in-flight across all active stages) are a useful additional signal for leadership dashboards, but they do not replace per-stage limits because they cannot locate the bottleneck.

**Swimlane WIP** (per class of service per stage): see `guides/06-class-of-service.md`. The Jira swimlane bug (see `research/external/2026-05-20-tool-wip-limits-honest-review.md`) counts total WIP across all swimlanes for a column, not per swimlane. This means Jira's WIP limit display is unreliable when swimlanes are active.

---

## Enforcement models

| Model | Mechanism | When to use |
|---|---|---|
| **Hard stop** | Tool blocks adding a card when limit reached | Azure DevOps Boards; mature teams with discipline |
| **Soft warning** | Tool shows count in red / alert color | Jira (column limit), GitHub Projects (visual only) |
| **Social enforcement** | Team agreement: no one adds a card to a full column | Linear (no native WIP limits); early-stage adoption |
| **API enforcement** | Automated check (e.g., GitHub Action, Linear GraphQL query) | Linear for teams that want hard stops |

For Linear-specific implementation of API enforcement, see `guides/08-tool-implementation.md`.

---

## WIP limit rollout sequence

From `research/external/2026-05-20-wip-limits-uplevel-engineering.md`:

1. **Week 0-1:** Visualize current WIP. Do not add limits yet. Measure baseline cycle time and throughput.
2. **Week 2:** Set limits using Method 3 (current WIP minus one) or Method 1 if data is available. Communicate the *why* to the team.
3. **Weeks 3-6:** Enforce limits. When a limit is hit, stop starting and start finishing. Record limit-violation events.
4. **Week 7+:** Review flow metrics. If cycle time has improved and limit violations are decreasing, reduce limits incrementally. If violations are chronic, investigate whether the limit is too low or a bottleneck needs resolution.

---

## The WIP limit case study

From `research/external/2026-05-20-wip-limits-agile-flow-consulting.md`:

> A 12-person software delivery team implemented throughput-derived WIP limits over 6 weeks. Result: p85 cycle time fell from 62 days to 36 days, a 42% reduction. No additional headcount. No process change other than the WIP limits.

This is the canonical ROI reference. Use it when teams are skeptical that WIP limits alone will move the needle.

---

## Common objections and responses

**"WIP limits slow us down."**
Response: WIP limits surface the slowdown that was already happening: it was invisible before because items were blocked quietly. Little's Law shows that reducing WIP reduces cycle time; the team was working hard but finishing slowly.

**"We can't have a limit because some work is urgent."**
Response: Urgent work belongs in an Expedite swimlane with its own WIP limit of 1. The expedite lane is a bypass, not an exception to the system. See `guides/06-class-of-service.md`.

**"Our work types are too different to compare."**
Response: This is a class-of-service problem, not a WIP limit problem. Use swimlanes per work type with separate WIP counts. See `guides/06-class-of-service.md`.

---

*Example: `examples/wip-limit-setup-happy-path.md`: end-to-end from throughput data to Jira configuration*
