---
title: "Little's Law in Agile Software Development: Applied to WIP and Forecasting"
source_url: https://agilelaws.com/littles-law.html
source_type: practitioner-blog
authority: high
relevance: critical
date_retrieved: 2026-05-20
topics:
  - little's-law
  - wip-limits
  - cycle-time
  - throughput
  - forecasting
  - steady-state
stinger: kanban-flow-stinger
---

# Little's Law in Agile: WIP = Throughput × Cycle Time

**Source:** Agile Laws: "Little's Law"
**URL:** https://agilelaws.com/littles-law.html
**Author:** Sean Sweeney
**Published:** Not dated (retrieved 2026-05-20)

## Summary

This reference-style article applies Little's Law exclusively to Agile/Kanban software delivery contexts, making it the clearest single source for how the formula maps to WIP, throughput, and cycle time in a team's workflow. It includes worked numeric examples showing the cost of increasing WIP without increasing throughput.

**Agile-specific formula expression:**
- WIP = Throughput × Cycle Time (equivalent to L = λW)
- Cycle Time = WIP ÷ Throughput (the diagnostic rearrangement)
- Throughput = WIP ÷ Cycle Time

**Worked example (critical for the worker-bee's Little's Law forecast template):**
- Team delivers 5 user stories per week; a story spends 2 weeks in the system on average.
- WIP = 5 stories/week × 2 weeks = 10 stories (steady state)
- If team increases WIP to 18 stories WITHOUT increasing throughput: Cycle Time = 18 ÷ 5 = 3.6 weeks (was 2 weeks). This is a direct 80% increase in cycle time from a 80% increase in WIP.

**Forecasting application:** With two variables known, teams can predict the third. Stable cycle times enable reliable forecasting of when work will be completed, improving stakeholder trust and planning.

**Key reasons to apply Little's Law:**
1. Identify the right constraint to change (WIP is usually easier to constrain than throughput)
2. Forecast delivery dates under different WIP scenarios
3. Detect non-steady-state systems (if the formula's implied values don't match observed metrics, the system is not in steady state)
4. Communicate trade-offs to stakeholders in plain arithmetic

**The steady-state assumption in Agile:** The article notes that Little's Law requires a stable system in equilibrium. Software teams often violate this with sudden influxes of urgent work, team size changes, or technology migrations. When the formula's outputs are wildly inconsistent with observed metrics, that is itself a diagnostic signal: the system is not in steady state and needs stabilization before flow metrics become reliable.

## Key quotations / statistics

- "WIP = Throughput x Cycle Time (L = λ x W)."
- "W = L / λ: Average Cycle Time = Average Work in Progress / Average Throughput."
- "Increasing WIP to 18 stories without increasing throughput: Cycle time becomes 18 ÷ 5 = 3.6 weeks" (from 2 weeks, an 80% increase).
- "Teams overloaded with too much work will see delivery slow, even if they are busy."
- "Limiting WIP improves focus, flow, and predictability."

## Annotations for stinger-forge

- **Critical** for `guides/03-littles-law.md`: the worked 5-story/week example with the WIP 10 → 18 → 3.6 week cycle time calculation is exactly the kind of concrete illustration the worker-bee needs for its "Little's Law forecast" output template.
- **Supports** `templates/littles-law-forecast.md`: stinger-forge should use the WIP-scenario table structure from this article (show cycle time at WIP = 10, 15, 18, 25 with constant throughput) as the template scaffold.
- The "forecasting application" section directly supports the worker-bee's expected output: "a table showing predicted cycle time under 3-5 WIP scenarios."
- Note: this source does not discuss Monte Carlo simulation. For probabilistic forecasting on small teams, stinger-forge needs to reference Daniel Vacanti's Actionable Agile Metrics (see Command Brief reference material): the Monte Carlo extension of Little's Law. This is a known gap in the research at normal depth tier.
