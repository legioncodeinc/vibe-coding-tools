# Happy-Path OKR Coaching Session

An end-to-end walkthrough of a typical `okr-goal-setting-worker-bee` coaching engagement.

*Demonstrates: `SKILL.md` fast-path checklist, `guides/01-okr-canon.md`, `guides/02-writing-objectives.md`, `guides/03-writing-key-results.md`, `guides/04-calibration.md`*

---

## Scenario

**User:** "We're a 15-person SaaS team planning Q3 OKRs. Here's our draft — can you review it?"

**Draft submitted:**
> **Objective:** Improve product  
> **KR1:** Ship the new dashboard  
> **KR2:** Fix bugs  
> **KR3:** Talk to 10 customers  

---

## Step 1: Run the fast-path audit

Using the checklist from `SKILL.md`:

| Check | Status | Finding |
|---|---|---|
| Objective is aspirational | FAIL | "Improve product" is generic, not inspiring |
| Objective is time-bound | FAIL | No cycle reference |
| 3-5 KRs | PASS | 3 KRs |
| KRs are outputs | FAIL | KR1 and KR3 are inputs (milestone, activity) |
| KRs are measurable | FAIL | KR2 lacks baseline and target |
| No compensation linkage | N/A | Not mentioned |

**Diagnosis:** 4 out of 6 checks fail. This is a task list with OKR branding, not an OKR.

---

## Step 2: Rewrite the Objective

Opening the `guides/02-writing-objectives.md` playbook:

**Coaching question:** "What outcome, from the perspective of your customers, would this product improvement create? Why does it matter in Q3 specifically?"

**User response:** "We're losing trials because users can't get to their 'aha moment' in the first session. The new dashboard is supposed to fix that."

**Rewritten Objective:** "Turn every trial user's first session into their 'aha moment' — this quarter"

**Check:** Aspirational (yes), qualitative (yes), time-bound (this quarter), customer-centric (yes). Pass.

---

## Step 3: Rewrite the Key Results

Using the input-to-output conversion from `guides/03-writing-key-results.md`:

| Original | Type | Output rewrite |
|---|---|---|
| Ship the new dashboard | Milestone (input) | Trial-to-activation rate from 28% to 52% by Sep 30 |
| Fix bugs | Activity (input) | P1 bugs per week from 7 to 1 by Sep 30 |
| Talk to 10 customers | Activity (input) | NPS (trial cohort, day-7) from 22 to 45 by Sep 30 |

**Resulting OKR:**

> **Objective:** Turn every trial user's first session into their "aha moment" — this quarter
>
> **KR1:** Trial-to-activation rate from 28% to 52% by Sep 30  
> **KR2:** P1 bugs reported during trial from 7/week to 1/week by Sep 30  
> **KR3:** Trial cohort NPS (day-7) from 22 to 45 by Sep 30  

---

## Step 4: Calibration check

Using `guides/04-calibration.md`:

**Question:** "Are these aspirational or committed OKRs?"

- KR1 (activation rate): Aspirational — depends on product changes + user behavior, not fully in the team's control. Apply 70% rule: hitting 44% would be a strong score.
- KR2 (P1 bugs): Committed — the team controls their own bug rate. 100% expectation; below 0.8 requires explanation.
- KR3 (NPS): Aspirational — NPS is influenced by product, support, and external factors. 70% rule applies.

**Sandbagging check:** "If you hit all three at 100%, will the company be in a materially different position than if you'd set them 20% more aggressively?" User confirms activation rate could be 60% if everything works perfectly — adjust KR1 target from 52% to 58% to give 70% of that as ~45% (already the baseline). Keep at 52% as the aspirational target; it's genuinely ambitious.

---

## Step 5: Cadence recommendation

Team size: 15 people. Recommendation from `guides/06-small-team-adaptation.md`:
- Monthly check-in (not weekly) for this team size
- Weekly RAG status pulse for the dashboard project (critical-path initiative)
- End-of-quarter scoring session: 45 minutes; use retrospective question set from `templates/okr-retrospective.md`

---

## Step 6: Deliver the artefact

If a persistent artefact is requested, write to `library/qa/okr-goal-setting/2026-Q3-product-team-okr.md` using `templates/okr-draft.md` as the base structure.

Otherwise, deliver inline as shown above.

---

## What made this session successful

1. The fast-path audit **named the failure modes specifically** before starting rewrites — the user understood WHY the drafts were weak, not just that they were.
2. The Objective rewrite came from the user's own answer to a coaching question, not from the Angel imposing a new Objective. User ownership increases commitment.
3. The KR rewrites were explained as transformations: "this input becomes this output." The user can apply the pattern themselves next time.
4. Calibration was done per KR, not per Objective — aspirational and committed KRs exist in the same OKR set; they just follow different scoring conventions.
