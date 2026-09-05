# 06 — Experiment Design

How to design the smallest experiment that validates or invalidates the riskiest assumption of a solution.

**Research source:** `research/external/2026-05-20-assumption-mapping-dvf-2x2-2026.md`, `research/external/2026-05-20-nielsen-five-users-heuristic-2026.md`

---

## The four prototype archetypes

| Archetype | What it is | Best for | Time to build |
|---|---|---|---|
| **Paper mock** | Printed or sketched UI; user narrates actions out loud | Usability assumptions (U axis); early-stage concept validation | Hours |
| **Wizard of Oz** | Real-looking interface; humans perform the "automated" backend actions manually | Desirability + feasibility assumptions when the back-end would take weeks to build | 1-3 days |
| **Concierge** | The team does the job manually for a small set of real users, with no product UI at all | Desirability validation; "will they pay for/value this?" | Days |
| **Fake door / landing page** | A page or button that looks like a real feature but captures intent signals (clicks, sign-ups) before the feature exists | Demand signal for a new audience or feature; tests whether users want to engage | Hours to 1 day |

(Source: `research/external/2026-05-20-assumption-mapping-dvf-2x2-2026.md`)

---

## Choosing the right archetype

Match the archetype to the Kill Zone assumption:

- **D (Desirability) is the risk:** Use Concierge (do they actually change behavior?) or Fake Door (is there initial interest?).
- **U (Usability) is the risk:** Use Paper Mock or Wizard of Oz with task observation.
- **F (Feasibility) is the risk:** Build the hardest technical piece as a spike, not a user-facing prototype. But check first — often what teams label as "feasibility risk" is actually desirability risk in disguise.
- **V (Viability) is the risk:** Use a Concierge or a pricing-page variation; direct pricing tests are the most honest viability experiments.

---

## Pre-stated success criterion

Before running any experiment, write down the success criterion. The criterion must be:

1. **Pre-stated** — written before the experiment runs, not after seeing results.
2. **Behavioral** — based on what people do, not what they say.
3. **Specific** — includes a threshold (e.g., "≥ 5 out of 8 participants complete the core task without assistance" not "participants seem to find it usable").

If you cannot state a success criterion before running the experiment, the experiment is not ready. Redefine the assumption or the archetype until a pre-stated criterion is achievable.

---

## The five-user heuristic (and its limits)

Nielsen's guideline that "5 users reveal 85% of usability problems" applies specifically to:
- **Qualitative usability testing** (paper mock, think-aloud tasks).
- A **homogeneous user segment** (if you have two distinct user types, you need 5 per type).
- **Finding problems**, not measuring frequency.

It does NOT apply to:
- Quantitative demand-signal tests (fake doors, landing pages) — you need statistical significance.
- JTBD discovery interviews — run until saturation (5-7+ with no new opportunity nodes), regardless of the 5-user rule.
- A/B tests — require proper sample size calculation.

(Source: `research/external/2026-05-20-nielsen-five-users-heuristic-2026.md`)

---

## What "validated" means

An assumption is **validated** when the pre-stated success criterion is met. It is **invalidated** when it is not met. Both outcomes are good discovery outcomes; the only bad outcome is not knowing.

When an assumption is invalidated:
- Don't conclude "the solution is dead" — conclude "this assumption is false; revisit the solution or the opportunity."
- Loop back to the OST: does the invalidated assumption suggest a different opportunity node, a different solution under the same opportunity, or a need to update the opportunity itself?

---

## Output

Write the experiment plan to: `library/discovery/experiments/<YYYY-MM-DD>-<experiment-slug>.md`

Use `templates/experiment-plan.md` which includes assumption, archetype, success criterion, run protocol, and results sections.

See `examples/happy-path-saas-onboarding.md` for a worked experiment with pre-stated criterion and outcome recorded.
