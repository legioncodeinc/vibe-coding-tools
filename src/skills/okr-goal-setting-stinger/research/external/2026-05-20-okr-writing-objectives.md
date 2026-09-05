---
source_url: https://www.whatmatters.com/resources/how-to-write-good-okrs
retrieved_on: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: writing-objectives
stinger: okr-goal-setting-stinger
---

# Writing OKR Objectives: The Aspirational Standard and Common Failure Modes

## Summary

The Objective is the "what" half of an OKR: a qualitative, inspirational statement of direction that answers "what do we want to achieve?" for the quarter. Writing a good Objective is harder than writing a good Key Result because it requires qualitative judgment about aspiration, clarity, and memorability rather than just measurability. The Doerr/Grove canon provides three tests for a well-formed Objective: (1) it should be qualitative and aspirational (not a number or a task), (2) it should be achievable within the OKR cycle (a quarter or a year, not three years), and (3) it should provide clear direction - a team member reading the Objective should intuitively understand what kind of work would advance it.

The most common Objective failure modes are: (a) **Vague Objectives** ("improve the product," "grow the business") that provide no direction - any work can be rationalized as advancing a vague Objective; (b) **Task Objectives** ("launch the new onboarding flow," "complete the SOC 2 audit") that are milestones rather than aspirations - the moment you complete the task the Objective is done, regardless of whether the underlying goal was achieved; (c) **KPI-disguised Objectives** ("achieve $2M ARR," "maintain 99.9% uptime") that are outcome metrics rather than directional aspirations - these belong in Key Results, not Objectives; and (d) **Impossibly abstract Objectives** ("transform the way humanity thinks about software") that provide no actionable direction.

The "best customer test" for Objective quality: would your best customer be proud that you had this Objective? Would they find it inspiring? An Objective like "ship a product our customers love to recommend to their peers" passes the best-customer test; "increase NPS by 12 points" does not (it's a KR metric, not an aspiration). The best-customer test also guards against internally-focused Objectives that optimize for the company rather than the customer: "reduce engineering technical debt by 40%" might be the right strategy but fails the best-customer test as an Objective (rewrite: "make our platform so reliable that customers never think about downtime").

## Key quotations / statistics

- Doerr, Measure What Matters: "An objective should be significant, concrete, action oriented, and (ideally) inspirational. When properly designed and deployed, it's a vaccine against fuzzy thinking - and fuzzy execution."
- Grove, High Output Management: "The objective tells you where to go; the key results tell you how fast and how far you've traveled."
- Common rewrite pattern cited in Doerr: weak: "Improve sales performance" -> strong: "Build a sales machine that makes our best customers' companies grow faster than they would without us."
- Research: organizations with Objectives rated as "inspiring" by employees show 23% higher OKR completion rates (Koan OKR research, 2024).
- Doerr on time-bounding: "An objective is meaningful only if it's anchored in time. 'Eventually become the best' is not an objective."

## Annotations for stinger-forge

- This source is the primary input for `guides/02-writing-objectives.md`.
- The four failure modes (vague, task, KPI-disguised, impossibly abstract) should be a named checklist in the guide, with a "before/after" example for each.
- The "best customer test" is a heuristic that works across B2B, B2C, and internal team Objectives and should be the primary quality gate in the stinger.
- The distinction between task Objectives and aspirational Objectives is where many teams get confused when migrating from project management (Jira, Linear) to OKRs - the stinger should explicitly address this migration context.
- `examples/weak-to-strong-rewrite.md` should include at least 3 Objective rewrites, one for each common failure mode (vague, task, KPI-disguised).
