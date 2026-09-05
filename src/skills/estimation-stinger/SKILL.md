---
name: "estimation-stinger"
description: "Software estimation and forecasting specialist. Covers relative-sizing frameworks (story points, Fibonacci, T-shirt sizing, Planning Poker), the NoEstimates movement and its evidence base, the planning-fallacy literature explaining why estimates are systematically wrong, and cycle-time / throughput-based probabilistic forecasting (Monte Carlo simulation, percentile-based delivery predictions). Invoke when the user says \\\\\\\"our story points mean nothing\\\\\\\", \\\\\\\"should we use NoEstimates?\\\\\\\", \\\\\\\"how do I do T-shirt sizing for a roadmap?\\\\\\\", \\\\\\\"we need a 90% confidence delivery date\\\\\\\", \\\\\\\"explain Monte Carlo to my PM\\\\\\\", \\\\\\\"why are our estimates always wrong\\\\\\\", or any question about sizing, forecasting, or the NoEstimates debate. Do NOT invoke for sprint cadence design, Jira/Linear tool configuration, or team-capacity math -- those belong to the team's agile process or tooling domains."
---

# Estimation Stinger

Procedural arsenal for `estimation-worker-bee`, the Hive's authority on software estimation and probabilistic delivery forecasting.

This stinger encodes:

- The canonical relative-sizing frameworks: Fibonacci story points, T-shirt sizing, Planning Poker, and when each applies.
- The NoEstimates movement: Vasco Duarte's throughput-as-forecast argument, prerequisites, and the honest evidence gap (no controlled RCTs).
- The planning-fallacy literature: why expert estimators are systematically wrong, the inside-view / outside-view distinction, and Kahneman/Tversky/Flyvbjerg's recommended remedy (reference class forecasting).
- Monte Carlo simulation: how it works, what data it needs, the 2026 free tooling landscape, and practical setup for teams with cycle-time history.
- The five-category dysfunction diagnosis that tells you WHICH technique to recommend before you recommend anything.

It does NOT encode sprint planning ritual design, Jira/Linear configuration, team capacity planning formulas, or vendor procurement.

## When this stinger applies

Load when `estimation-worker-bee` is invoked. Typical user phrases:

- "Our velocity is meaningless / our story points drift every sprint"
- "Should we adopt NoEstimates?"
- "How do we T-shirt size our roadmap?"
- "We need a date with a confidence level for Q3"
- "Why do our estimates always come out wrong?"
- "Monte Carlo for delivery forecasting: explain it to my PM"
- "Our team says 2 weeks, it always takes 6"

Do NOT load for:

- Sprint ceremony design (retrospectives, planning, refinement): agile coaching domain
- Jira/Linear/Azure DevOps configuration: tooling domain
- Velocity tracking or charting: project management tooling domain

## First action when this stinger is loaded

Read these three files before doing anything:

1. **`guides/00-principles.md`**: the estimation-vs-forecasting distinction, the commitment trap, and the single most important framing: estimates are a communication tool, not a planning oracle.
2. **`guides/01-diagnosis.md`**: the five dysfunction categories. Always diagnose before recommending; the wrong framework for the wrong dysfunction makes things worse.
3. **`research/research-summary.md`**: the research manifest; tells you which external files cover which topics so you can fetch evidence when you need it.

Then read the specific guide for the technique the team needs.

## Folder layout

```text
estimation-stinger/
+- SKILL.md                     (this file — master index)
+- README.md                    (one-page human overview)
+- guides/
|  +- 00-principles.md          (estimation vs. forecasting; the commitment trap; scope and handoffs)
|  +- 01-diagnosis.md           (five dysfunction categories; decision tree for technique selection)
|  +- 02-relative-sizing.md     (Fibonacci story points, T-shirt sizing, Planning Poker)
|  +- 03-noestimates.md         (NoEstimates movement; prerequisites; throughput substitution; evidence base)
|  +- 04-monte-carlo.md         (Monte Carlo simulation; inputs; confidence percentiles; 2026 tooling)
|  +- 05-planning-fallacy.md    (planning fallacy; optimism bias; inside vs. outside view; remedies)
+- examples/
|  +- fibonacci-estimation-session.md  (worked estimation session from backlog → sized stories)
|  +- monte-carlo-forecast.md          (worked 40-item backlog forecast with P50/P85/P95 output)
+- templates/
|  +- estimation-advisory.md    (the output shape: diagnosis + recommendation + implementation steps)
+- reports/
|  +- README.md                 (advisory reports accumulate here over time)
+- research/                    (owned by scripture-historian — do NOT modify)
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- external/
      +- 01-noestimates.md
      +- 02-story-points-fibonacci.md
      +- 03-monte-carlo-forecasting.md
      +- 04-planning-fallacy.md
      +- 05-t-shirt-sizing.md
      +- 06-ai-estimation-and-tooling.md
```

## Critical directives (from Command Brief)

- **Never frame estimates as commitments without explicit stakeholder negotiation.** Why: the commitment trap is the primary driver of estimate-driven burnout.
- **Always distinguish relative sizing from probabilistic forecasting.** Why: story points answer "how big is this relative to that?"; they are not date predictors.
- **When recommending NoEstimates, always state the prerequisite: reliable cycle-time history.** Why: NoEstimates without data is not a methodology, it is an absence of information.
- **Cite the planning-fallacy literature when explaining why estimates are wrong.** Why: teams that understand the cognitive root cause accept data-driven alternatives; teams that think they need better estimators repeat the cycle.
- **Escalate velocity-configuration and sprint-ceremony questions.** Why: Jira/Linear setup and sprint ritual design are outside this Bee's domain.

## The evidence that matters (from research)

Key data points for advisory conversations:

- Replacing all story point values with "1" changes the forecast by only 8% (Maria Chec, 2025 Vasco Duarte interview). See `research/external/01-noestimates.md`.
- Only ~30% of software projects complete on time and on budget (Standish CHAOS). See `research/external/04-planning-fallacy.md`.
- IT projects average 27% cost overrun; 1 in 6 exceed 200% overrun (Flyvbjerg). See `research/external/04-planning-fallacy.md`.
- Initial software estimates are typically off by 2x-4x (McConnell). See `research/external/04-planning-fallacy.md`.
- Monte Carlo accuracy is 85-95% when based on quality historical data (montecarloestimation.com). See `research/external/03-monte-carlo-forecasting.md`.

---

*Command Brief: [`ai-tools/command-briefs/estimation-worker-bee-command-brief.md`](../../command-briefs/estimation-worker-bee-command-brief.md)*
*Part of The Hive, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*
