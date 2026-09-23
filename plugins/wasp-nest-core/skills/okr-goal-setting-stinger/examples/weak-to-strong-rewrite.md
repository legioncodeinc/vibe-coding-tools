# Weak-to-Strong OKR Rewrites

Annotated before-and-after examples showing how to rewrite weak OKRs into strong ones.

*Demonstrates: `guides/02-writing-objectives.md`, `guides/03-writing-key-results.md`*

---

## How to use this example

For each example: (1) read the "Before" version, (2) identify the failure modes using the checklist from `guides/01-okr-canon.md`, (3) read the "After" version and the annotation explaining each change.

---

## Example 1: Engineering team — quality objective

### Before (weak)

**Objective:** Improve product quality

**KR1:** Fix more bugs  
**KR2:** Improve test coverage  
**KR3:** Run 5 sprint retrospectives about quality  

### Failure mode analysis

| Problem | KR1 | KR2 | KR3 |
|---|---|---|---|
| Not measurable | ✓ | ✓ | — |
| Input KR (activity) | — | — | ✓ |
| No baseline | ✓ | ✓ | — |
| No target | ✓ | ✓ | — |

**Objective failures:** "Improve product quality" is aspirational-ish but vague and not time-bound. It also doesn't create any emotion or direction — why quality? For whom?

### After (strong)

**Objective:** Ship a product our best customers are proud to recommend — this quarter

**KR1:** Customer-reported P1 bugs from 12/week to 3/week by July 31  
**KR2:** Test coverage from 41% to 70% on all customer-facing services by July 31  
**KR3:** P95 API latency from 820ms to 200ms on the checkout flow by July 31  

### Annotation

- **Objective:** "Our best customers are proud to recommend" is qualitative, aspirational, and customer-centric. The "this quarter" clause makes it time-bound. The rewrite borrows the "best customer" test from Doerr.
- **KR1:** "Fix more bugs" → measurable rate (bugs/week) with explicit baseline (12), explicit target (3), explicit owner period (by July 31). Output: fewer customer-experienced bugs per week.
- **KR2:** "Improve test coverage" → specific metric (coverage %), baseline (41%), target (70%), scope (customer-facing services). Still an engineering proxy metric but defensible as an output leading to reliability.
- **KR3:** New KR added: latency is a customer-felt outcome. Baseline (820ms) and target (200ms) are concrete. This replaces "Run 5 sprint retrospectives" (input KR) with a real outcome.

---

## Example 2: Sales team — pipeline objective

### Before (weak)

**Objective:** Grow the business

**KR1:** Make 100 sales calls per month  
**KR2:** Attend 3 conferences  
**KR3:** Increase revenue  

### Failure mode analysis

- Objective: "Grow the business" — not aspirational, not time-bound, not qualitative. This is a directive, not an Objective.
- KR1: Input KR (100 calls = activity). Success at this KR doesn't guarantee any outcome.
- KR2: Input KR (conferences = activity). Zero revenue connection.
- KR3: "Increase revenue" — output KR but no baseline, no target, no unit. Ungrадable.

### After (strong)

**Objective:** Win the mid-market segment before our main competitor launches their Q3 product

**KR1:** Qualified pipeline from $1.2M to $3.5M by September 30  
**KR2:** Average deal size from $18K to $28K by September 30  
**KR3:** Win rate (qualified to closed-won) from 22% to 35% by September 30  

### Annotation

- **Objective:** Names a specific segment (mid-market), names the urgency (before competitor's Q3 launch), and creates genuine forward tension. The team now has a reason to make decisions, not just execute tasks.
- **KR1:** Pipeline value is a leading indicator for revenue — an output, not an activity. Baseline ($1.2M) and target ($3.5M) are concrete.
- **KR2:** Deal size is an output that reflects qualification quality and positioning, not call volume.
- **KR3:** Win rate is a quality-of-pipeline metric — output, not input. Replaces both "100 calls" and "attend conferences" with the result those activities are supposed to produce.

---

## Example 3: Product team — user engagement

### Before (weak)

**Objective:** Make the onboarding better

**KR1:** Redesign the onboarding flow  
**KR2:** Ship 3 onboarding improvements  
**KR3:** Get user feedback on onboarding  

### Failure mode analysis

- Objective: "Make the onboarding better" — no inspiration, no customer framing, sounds like a task.
- KR1: Milestone KR (redesign = deliverable). Zero measurement.
- KR2: Milestone KR (3 improvements = task count). What does "improvement" mean?
- KR3: Input KR (get feedback = activity). Getting feedback is the means, not the end.

### After (strong)

**Objective:** Turn new sign-ups into confident, activated users within their first week

**KR1:** 7-day activation rate from 31% to 55% by end of Q3  
**KR2:** Median time-to-first-value from 4.2 days to 1.5 days by end of Q3  
**KR3:** Onboarding-related support tickets from 45/week to 12/week by end of Q3  

### Annotation

- **Objective:** "Confident, activated users within their first week" is customer-centric, time-bounded (first week after sign-up), and aspirational. The quarter scope is implicit from the KR dates.
- **KR1:** Activation rate (defined by the product) is the primary outcome the redesign is supposed to produce. This replaces "Redesign the onboarding flow" entirely.
- **KR2:** Time-to-first-value is a user-experience output metric that captures quality of the journey, not just completion.
- **KR3:** Support tickets are a downstream quality signal — fewer onboarding questions means the experience is self-explanatory. This replaces "Get user feedback" with the result that feedback-driven improvement is supposed to achieve.

---

## General rewrite heuristic

1. For every input KR, ask: "What result am I doing this activity to achieve?" That result is the output KR.
2. Add a baseline and a target to every KR. If you can't find a baseline, plan to measure one in Week 1 of the cycle.
3. For every Objective, ask: "If a new employee read this, would they understand why it matters and feel some excitement?" If not, rewrite.
4. For every OKR set, check: are there 3-5 KRs per Objective? Are they triangulating a real outcome (not just one metric)? Do they collectively prove the Objective was achieved if all hit?
