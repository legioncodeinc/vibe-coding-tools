# 02. Flow Metrics: Definitions, Calculation, and Benchmarks

*Sources: `research/external/2026-05-20-flow-metrics-definitions-cylenivo.md`; `research/external/2026-05-20-value-stream-metrics-axify.md`*

---

## The four core flow metrics

These definitions come from `research/external/2026-05-20-flow-metrics-definitions-cylenivo.md`. Apply them exactly: conflation is the primary source of team confusion.

### 1. Cycle Time

**Definition:** The time from when work *actively starts* to when it *completes*.

- Clock starts: when the item enters the first active work stage (not the input queue).
- Clock ends: when the item exits the last active work stage (the "done" column).
- **Unit:** calendar days (not working days, to keep the metric honest about wait time).

Analogy: in a restaurant, cycle time is from "chef starts cooking" to "dish is served," not from "customer seated."

### 2. Lead Time

**Definition:** The time from when work is *requested* (enters the system) to when it *completes*.

- Clock starts: when the item is created / enters the input queue (the "ready" or "to-do" column).
- Clock ends: when the item exits the last active work stage.
- **Lead time ≥ Cycle time always.** The difference is time spent waiting in the input queue.

Analogy: lead time starts when the customer places the order.

### 3. Throughput

**Definition:** The number of work items completed per unit time.

- Unit: items/week (use weeks, not days, to smooth daily noise).
- Do NOT use story points. Points are a planning unit, not a flow unit. See the DORA note below.
- Rolling 4-week throughput is the standard window for a stable signal.

### 4. WIP (Work in Progress)

**Definition:** The number of work items that have started but not yet completed, at a given moment.

- Measure WIP at a specific point in time (snapshot), not as an average: snapshots are more actionable.
- WIP by stage (per-column WIP) is more useful than total WIP for bottleneck diagnosis.

### 5. Flow Efficiency (derived)

**Definition:** Active time / Total elapsed time, expressed as a percentage.

> Flow Efficiency = (Time actively being worked on) / (Total lead time) × 100

- "Actively worked on" = time in active-work columns, excluding queue/wait columns.
- A team with 15% flow efficiency is spending 85% of lead time in queues. That is normal. It is a system problem, not a people problem. Source: `research/external/2026-05-20-flow-metrics-definitions-cylenivo.md`.

---

## 2026 Benchmarks

From `research/external/2026-05-20-value-stream-metrics-axify.md`:

| Metric | Typical range | Elite (top quartile) |
|---|---|---|
| Flow efficiency | 5-20% | 20%+ |
| Cycle time (p75) | 3-10 days | 1.8 days |
| Lead time | 5-30 days | Sub-24 hours |
| Throughput | Team-dependent | n/a |

Use these benchmarks carefully: they aggregate across diverse team types. A team doing architectural spikes will have different numbers than a team doing support tickets. The useful comparison is *your own team's trend over time*, not a cross-industry average.

---

## How to calculate each metric

### Cycle time (from tool data)

Most tools (Jira, Linear, GitHub Projects) track state-transition timestamps. Export to CSV or use the tool's API:

```
Cycle Time = Done Timestamp - First-Active-Stage-Entry Timestamp
```

Compute the distribution, then report:
- **p50 (median):** typical experience
- **p85:** most items complete in this time or less (use for SLA commitments)
- **p95:** the "tail": rare outliers; investigate these items for systemic blockers

### Throughput (rolling average)

```
Weekly Throughput = count of items moved to "Done" in the past 4 calendar weeks / 4
```

Track weekly snapshots in a spreadsheet. Plot as a run chart. A stable throughput chart is a sign of a mature Kanban system.

### Flow efficiency (manual)

Most tools do not natively compute this. Methods:

1. For a sample of 10-20 items: interview the team or review comments to estimate active vs. wait time.
2. For systematic measurement: add a "Blocked" status and track time in that status. Active time = lead time minus blocked time (approximation).
3. Full measurement: use ActionableAgile Analytics or a similar tool that tracks time-in-state.

---

## The DORA overlap

Several sources (`research/external/2026-05-20-value-stream-metrics-axify.md`) discuss DORA metrics alongside Kanban flow metrics:

- **Lead time for changes** (DORA) is a subset of Kanban lead time, scoped to the code-review-to-production segment.
- **Deployment frequency** (DORA) is a throughput proxy scoped to deployments.

`kanban-flow-worker-bee` uses Kanban-native flow metrics. DORA metrics are complementary but owned by `devops-worker-bee`. When a team asks about both, explain the relationship and scope the conversation.

---

## Common calculation errors

| Error | Correct approach |
|---|---|
| Using story points as throughput | Use item count; points add noise and encoding error |
| Measuring cycle time in working days | Use calendar days to expose weekend/queue wait |
| Reporting only mean cycle time | Mean is misleading in skewed distributions; always report p50/p85/p95 |
| Starting cycle time from "backlog creation" | That is lead time; be explicit about which clock you are using |
| Measuring WIP as an average | Use snapshots; averages obscure spikes that cause cycle time bloat |

---

*Example: `examples/cycle-time-diagnosis.md`: diagnosing a cycle-time spike using CFD and percentile data*
