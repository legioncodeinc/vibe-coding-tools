---
title: "Flow Metrics Explained: Cycle Time, Lead Time, Throughput, WIP"
source_url: https://cylenivo.org/flow-metrics/
source_type: practitioner-blog
authority: high
relevance: critical
date_retrieved: 2026-05-20
topics:
  - cycle-time
  - lead-time
  - throughput
  - flow-efficiency
  - wip
  - little's-law
stinger: kanban-flow-stinger
---

# Flow Metrics Explained: Cycle Time, Lead Time, Throughput, WIP

**Source:** Cylenivo: "Flow Metrics Explained: Cycle Time, Lead Time, Throughput, WIP"
**URL:** https://cylenivo.org/flow-metrics/
**Published:** Not dated (retrieved 2026-05-20)

## Summary

This is a crisp, authoritative reference on the four core Kanban flow metrics plus flow efficiency as a derived metric. It is written specifically to distinguish flow metrics from velocity (story points), which is a frequent conflation in Agile teams. The article is the clearest concise definitions source found in this research run.

**The four core metrics defined precisely:**

- **Cycle Time:** Time from "work started" to "work done" on a ticket. Measures how fast the team moves once they pick something up, not how long it sat in the backlog. Cycle time is the metric the team itself can most directly influence.
- **Lead Time:** Time from "request entered the system" to "work done." Includes backlog wait, prioritization, everything upstream. Lead time is what stakeholders and customers actually feel.
- **Throughput:** Number of tickets finished per unit of time (usually per week). Counts completions, not story points. This is the raw input for Monte Carlo forecasting.
- **WIP (Work in Progress):** Number of tickets the team has started but not finished. Little's Law says Lead Time = WIP / Throughput: the math behind WIP limits.

**Flow Efficiency:** Share of cycle time that is active work vs. waiting. Typical software teams land around 15-20%, meaning 80%+ of a ticket's lifetime is queue time. The article frames this explicitly as a system problem, not a people problem: "Developers aren't slow; the system has too many queues."

**Velocity vs. throughput distinction:** Velocity measures story points completed per sprint. Story points are estimates, not measurements. Velocity goes up when teams learn to estimate higher, not when they actually deliver faster. "That's why 'our velocity doubled' often means 'we inflated our points' — not 'we're twice as fast'." Flow metrics measure what actually happened.

**Little's Law stated explicitly:** "WIP limits — they're not a productivity hack, they're arithmetic."

## Key quotations / statistics

- "Cycle Time: The time from 'work started' to 'work done' on a ticket... Cycle time is the metric the team itself can most directly influence."
- "Lead Time: The time from 'request entered the system' to 'work done'... Lead time is what stakeholders and customers actually feel."
- "Throughput counts completions (a measurement). It's also the raw input for Monte Carlo forecasting."
- "Typical software teams land around 15–20% [flow efficiency] — meaning 80%+ of a ticket's lifetime is queue time."
- "Developers aren't slow; the system has too many queues. Low flow efficiency is a system problem, not a people problem."

## Annotations for stinger-forge

- **Critical** for `guides/02-flow-metrics.md`: this article provides the canonical simple definitions for all five metrics. The cycle time vs. lead time distinction with clear start/end clock descriptions is exactly what the worker-bee's critical directive demands ("Distinguish cycle time from lead time every time you use them").
- **Supports** `guides/03-littles-law.md`: the explicit Little's Law link (Lead Time = WIP / Throughput) is stated cleanly for non-mathematical audiences.
- The velocity vs. throughput contrast in the last section should be included in `guides/07-kanban-vs-scrum.md`: teams migrating from Scrum to Kanban need to unlearn velocity as a primary metric.
- The 15-20% flow efficiency benchmark (industry average) is a key statistic for `guides/02-flow-metrics.md`. Stinger-forge should note this alongside the Daniel Vacanti benchmark (he reports similar figures in Actionable Agile Metrics).
