# 01 — OKR Canon: Grove/Doerr Lineage and Framework Comparison

The intellectual origin of OKRs, the canonical definition, and how OKRs differ from KPIs and MBOs.

*Sources: `research/external/2026-05-20-grove-doerr-okr-canon.md`, `research/external/2026-05-20-okr-vs-kpi-vs-mbo.md`, `research/external/2026-05-20-google-rework-okr-guide.md`*

---

## 1. The intellectual lineage

**Andy Grove invented OKRs at Intel in the early 1970s**, building on Peter Drucker's Management by Objectives (MBO) framework while deliberately removing the compensation-linkage that made MBOs dysfunctional. Grove's core insight: separating goal-setting from pay unlocks honest scoring and ambitious target-setting. He published the framework in "High Output Management" (1983) but practiced it at Intel for a decade before that.

**John Doerr learned OKRs from Grove** as a young Intel engineer and brought the framework to Google in 1999. Doerr's "Measure What Matters" (2018) is the modern canonical reference and the primary reason OKRs became mainstream. Google applied the framework from the start and grew to 60,000 employees running quarterly OKR cycles.

**The Google re:Work guide** (https://rework.withgoogle.com/guides/set-goals-with-okrs/) distills Google's application of Doerr's framework into public guidance. It is the most widely cited practitioner reference and the basis for most OKR tooling defaults.

---

## 2. The canonical OKR definition

**Objective:** What do we want to achieve? Qualitative, inspirational, time-bound.
- Good: "Build a product our best customers are proud to recommend."
- Bad: "Improve product quality." (too vague, no aspiration)
- Bad: "Ship 3 major features." (milestone, not an objective)

**Key Result:** How will we know we achieved the Objective? Measurable, specific, outcome-focused.
- Good: "NPS improves from 34 to 55 by end of Q3."
- Good: "Churn drops from 5.2% to under 2% by Sept 30."
- Bad: "Run 10 customer interviews." (input, not outcome)
- Bad: "Improve the onboarding flow." (project task, not a result)

Grove's binary test for a Key Result: *"Did I do that, or did I not?"* should produce a clear yes/no — or better, a number on a scale.

**Canonical structure:**
- 3–5 Objectives per cycle (company level); 1–3 at team or individual level
- 3–5 Key Results per Objective
- Quarterly cycle is the dominant practice; annual for directional Objectives

---

## 3. OKRs vs. KPIs vs. MBOs

### OKRs vs. KPIs

| Dimension | OKR | KPI |
|---|---|---|
| **Purpose** | Aspirational goal for a cycle | Continuous operational health metric |
| **Frequency** | Quarterly (or annual) | Ongoing (weekly/monthly dashboard) |
| **Direction** | Forward-looking (where we want to go) | Present-state (how we're doing now) |
| **Failure mode** | Input KRs (activity tracking dressed as OKRs) | No stretch targets; KPI becomes the ceiling |
| **Relationship** | KRs are often derived from current KPI baselines | KPIs become KR targets when in OKR context |

**Practical rule:** KPIs measure the health of your current engine. OKRs describe where you want to move the needle. A KPI that you want to change becomes an OKR Key Result.

Example: "Monthly active users" is a KPI. "Monthly active users grow from 12,000 to 20,000 by Q4" is an OKR Key Result.

### OKRs vs. MBOs

| Dimension | OKR | MBO |
|---|---|---|
| **Compensation link** | Explicitly prohibited by Grove and Doerr | Typically linked to annual bonus |
| **Cycle** | Quarterly; fast iteration | Annual; slow feedback |
| **Ambition** | Aspirational; 70% success is normal for "moonshot" OKRs | Conservative; 100% expected because pay is on the line |
| **Transparency** | Public across the organization | Often private (individual/manager) |
| **Direction** | Bottom-up + top-down cascade | Top-down mandates |

Grove's key insight: MBOs fail because compensation linkage incentivizes sandbagging. OKRs succeed precisely because they remove that incentive.

---

## 4. The "are these actually OKRs?" audit

Use this table to diagnose a team's goal practice:

| Test | Pass | Common failure mode |
|---|---|---|
| Objectives are inspirational | Qualitative, memorable, time-bound | KPI targets dressed as Objectives |
| KRs are outcomes, not activities | Measures a result | Input/task KRs |
| KRs are measurable | Baseline + target + unit | Immeasurable KRs ("improve quality") |
| 3–5 KRs per Objective | Not 1, not 10+ | Task lists (10+) or single-point fragility (1) |
| Not compensation-linked | No pay link | Sandbagging across the board |
| Quarterly cadence | Cycle defined | Annual goals with no check-ins |
| Graded honestly | Scores < 1.0 appear | All scores are 1.0 (sandbagged) |

If 3+ tests fail, name the failure mode: "KPI dashboard with OKR branding", "MBOs with quarterly labels", or "task list with targets."

---

## 5. Common OKR anti-patterns

| Anti-pattern | Description | Fix |
|---|---|---|
| **KPI-washing** | Existing health metrics relabeled as OKRs | Ask: "Is this an aspirational change or a steady-state metric?" |
| **Task-list OKRs** | KRs are project milestones or activities | Rewrite: "What outcome would shipping that produce?" |
| **Too many OKRs** | 10+ Objectives; 15+ KRs | Prioritize: "If we could only achieve 3 things this quarter, what would they be?" |
| **Compensation linkage** | OKR scores used in performance review | Decouple; create a separate evaluation framework |
| **Set-and-forget** | OKRs written in January, reviewed in December | Mandate mid-quarter check-ins (see `guides/05-cadence.md`) |
| **Cascade overload** | Every employee has cascaded OKRs from company to individual | Keep cascade optional; team OKRs only when they genuinely add alignment |

---

*Example: `examples/weak-to-strong-rewrite.md` shows before/after rewrites for each anti-pattern above.*
*Calibration guidance: `guides/04-calibration.md`*
*Cadence guidance: `guides/05-cadence.md`*
