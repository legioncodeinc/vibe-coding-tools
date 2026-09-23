# 03 — Writing Key Results

The output-vs-input discipline, KR patterns, anti-patterns, and the rewrite heuristic.

*Sources: `research/external/2026-05-20-output-vs-input-key-results.md`, `research/external/2026-05-20-grove-doerr-okr-canon.md`, `research/external/2026-05-20-15five-okr-methodology.md`*

---

## The output-vs-input discipline

This is the single most important and most violated rule in OKR practice.

**Output KR:** Measures a result in the world — a change in a metric, a customer behavior, a system state.  
**Input KR:** Measures work done — activities, milestones, deliverables.

| Output KR (correct) | Input KR (reject) |
|---|---|
| "NPS improves from 34 to 55" | "Run 10 customer interviews" |
| "Churn drops from 5.2% to under 2%" | "Build churn-prediction model" |
| "P95 API latency falls below 200ms" | "Refactor the database connection pool" |
| "Sign 3 enterprise contracts (>$50K ARR each)" | "Send 50 outbound emails" |
| "Week-1 retention rises from 32% to 55%" | "Launch the new onboarding flow" |

---

## The rewrite heuristic

When you encounter an input KR, ask: *"What outcome would this activity produce if it worked?"*

That answer is the output KR. The input KR becomes a task, a project milestone, or an entry in the execution plan — not a Key Result.

**Example:**
- Input KR: "Run 10 customer discovery calls"
- Question: "What would 10 discovery calls produce if they worked?"
- Answer: "We would understand the top 3 jobs-to-be-done for our target segment"
- Output KR: "Identify and document the top 3 customer jobs-to-be-done, validated by at least 8 discovery sessions"

Note: the output KR still references the activity (8 sessions) as a leading indicator, not the result itself.

---

## The SMART-KR checklist

A well-formed Key Result passes all five:

| Letter | Test | Example |
|---|---|---|
| **S** Specific | Names what changes and in which context | "Week-1 D7 retention" not "retention" |
| **M** Measurable | Has a number, a unit, and a baseline | "From 32% to 55%" |
| **A** Achievable | In the 60-80% confidence zone (aspirational OKRs) | Not "100% certain" or "1% likely" |
| **R** Relevant | Directly proves progress on its parent Objective | KR maps clearly to O |
| **T** Time-bound | Scoped to the cycle end date | "by Sept 30" or implicit in quarter label |

---

## KR anatomy

A complete KR has three components:

```
[Metric] [changes from] [Baseline] [to] [Target] [by] [Date]
```

Examples:
- "Monthly active users grow from 12,000 to 20,000 by end of Q3"
- "Support ticket median time-to-resolution decreases from 48h to 12h by Oct 1"
- "New customer NPS rises from 34 to 55 by September 30"

If you don't have a baseline yet, measure it in week 1 and note it as "TBD — establish in week 1 of Q3."

---

## Defensible input KR exceptions

Three situations where an input KR is acceptable for one cycle:

1. **No baseline exists yet.** The team needs to establish the measurement infrastructure before they can set outcome targets. KR: "Instrument the onboarding funnel and establish a week-1 retention baseline." Sunset rule: this KR's output becomes next cycle's outcome KR.

2. **Capability-building.** The team is building a new capability (e.g., "establish a weekly customer interview practice") that has no direct metric outcome in the current cycle but enables outcomes in the next. Name it explicitly as a capability-building KR.

3. **Pure binary milestones with high strategic value.** Sometimes a binary outcome ("launch in EU by Q3") is the only meaningful measure. These are acceptable when the milestone has clear external accountability (regulatory deadline, customer commitment).

In all three cases: name it as an input or milestone KR explicitly, set a 1-cycle sunset, and define the outcome KR it will enable.

---

## Number of Key Results per Objective

- **3 KRs per Objective** is the Google re:Work recommendation and the most common practitioner convention.
- **4-5 KRs** is acceptable when the Objective spans multiple dimensions (growth + retention + quality).
- **1-2 KRs** risks single-point-of-failure measurement; gaming is easy.
- **6+ KRs** indicates either (a) multiple Objectives merged into one, or (b) a task list. Split or prune.

The "triangulation" principle: 3 KRs from different angles make it hard to hit the Objective by gaming one metric.

---

## Common KR anti-patterns

| Anti-pattern | Example | Fix |
|---|---|---|
| **Activity KR** | "Run 10 interviews" | Apply rewrite heuristic |
| **Milestone KR** | "Launch feature X" | "Time-to-first-value drops from 4 days to 45 min after feature X ships" |
| **Immeasurable KR** | "Improve team morale" | "eNPS rises from 22 to 40 by end of Q3" |
| **Irrelevant KR** | KR doesn't prove the Objective | Ask: "If this KR hits 1.0, does it prove the Objective was achieved?" |
| **Vanity metric KR** | "Reach 10K Twitter followers" | Ask: "Does this metric change our business?" |
| **Lagging-only KRs** | All KRs measure 3-month outcomes | Mix leading indicators (week-1 retention) with lagging (quarterly churn) |

---

*Worked examples: `examples/weak-to-strong-rewrite.md`*  
*Calibration guidance: `guides/04-calibration.md`*  
*Template: `templates/okr-draft.md`*
