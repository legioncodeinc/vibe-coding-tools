---
source_url: https://scopecone.io/tools/monte-carlo-calculator
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: monte-carlo
stinger: estimation-stinger
additional_sources:
  - https://johan162.github.io/mcprojsim/
  - https://github.com/johan162/mcprojsim
  - https://pypi.org/project/mcprojsim/
  - https://montecarloestimation.com/
  - https://kitmul.com/en/agile-project-management/monte-carlo-forecaster
  - https://devseer.ai/tools/monte-carlo-estimator
  - https://monte.one/
  - https://forese.ai/
  - https://energer.com/montecarlo
---

# Monte Carlo Simulation for Software Delivery Forecasting

## Summary

Monte Carlo simulation for software delivery takes historical throughput data (items completed per sprint or week), runs thousands of simulated futures by sampling from that distribution, and produces a probability distribution over completion dates. Standard output: P50 (median - realistic target), P85 (safe commitment for external stakeholders), P95 (contingency planning). The method requires at minimum 20-30 completed items to produce meaningful confidence bands; more history produces tighter bands.

Key insight: Monte Carlo does NOT require normally distributed data. Skewed and fat-tailed cycle time distributions (common in real software teams) are expected and correctly modeled by sampling with replacement. This is a major advantage over PERT/three-point estimation which assumes normal or triangular distributions.

**Active 2026 tooling landscape:**
- `mcprojsim` (open source, Python CLI, Johan Persson) - v0.15.1 released April 2026. Full-featured: three-point estimates, T-shirt sizes, story points, critical path, Tornado sensitivity charts, risk modeling, sprint-based forecasting, MCP server for AI integration. Most actively developed open-source option.
- `ScopeCone` - free web tool; paste cycle times, get P50/P85/P95 instantly
- `Kitmul` - free online forecaster; 10,000 iterations default; P50/P85/P95
- `Monte.one` - Jira + GitHub connectors; runs 1,000,000 simulations; evidence-based scheduling
- `Forese.ai` - visual project planning with Monte Carlo, risk cascade simulation, P50/P85/P95
- `Energer` - up to 10,000 scenarios, triangular distribution default
- `montecarloestimation.com` - 500-simulation browser tool with split factor, risk modeling, three-point estimates

**Free DIY alternative:** Export completed items from Jira, Linear, or Azure DevOps → calculate cycle time (start to finish) → run simulation in spreadsheet or any free tool above.

## Key quotations / statistics

- "Monte Carlo simulation is typically provides 85-95% accuracy when based on quality historical data, significantly outperforming traditional estimation methods." (montecarloestimation.com)
- "Monte Carlo skips the subjective scoring and relies on actual cycle time data, so it adapts faster when work mixes change." (ScopeCone, contrasting with velocity-based approaches)
- "Your past project data has all of the variables in it. Design changes, bugs, sickness, unexpected delays, vacations, even indecisive bosses." (monte.one)
- "Most teams present both the median (P50) and a safer commitment level such as P85. The delta between them is a great conversation starter about scope trade-offs, staffing, or risk mitigation." (ScopeCone)
- P50 vs P85 framing: "P50 is your realistic target, P85 is your conservative commitment, P95 is your contingency plan."
- mcprojsim v0.15.1 (April 24, 2026) - most recent stable release. Example output: Auth Service Rewrite: P50=34 working days, P80=40 days, P90=43 days.
- "Aim for at least 20-30 cycle times. The more representative history you have, the smoother the distribution becomes." (Kitmul)
- "Velocity works when teams keep point estimation discipline and the backlog composition stays stable. Monte Carlo skips the subjective scoring." (ScopeCone)

## Annotations for stinger-forge

- Primary source for `guides/04-monte-carlo.md` - inputs, how the simulation works, confidence percentile interpretation, and the 2026 free tooling landscape
- Key inputs to document in the guide: (1) historical throughput samples (items/sprint or cycle times), (2) backlog count with optional min/max range, (3) number of simulations (1,000-10,000 standard), (4) optional split factor for scope creep
- The mcprojsim tool is the best recommendation for teams who want CLI/CI integration with risk modeling; ScopeCone/Kitmul are best for quick stakeholder demos
- Important nuance for stinger-forge: Monte Carlo for throughput-based teams vs. Monte Carlo for task-estimate-based teams are different modes. Document both in the guide.
- Worked example for `examples/` folder: take a 40-item backlog, 8 weeks of throughput data showing 4-7 items/week, run simulation, show P50=~8 weeks / P85=~11 weeks interpretation
- Open question from Command Brief: "What cycle-time tooling is most popular in 2026 (ActionableAgile, LinearB, etc.)?" - Research finding: LinearB (enterprise, PR-lifecycle metrics, DORA integration) and ActionableAgile (Jira plugin, kanban flow metrics including Cycle Time Histogram, percentile lines) are the leading platforms. Both are active in 2025-2026 based on documentation updates.
