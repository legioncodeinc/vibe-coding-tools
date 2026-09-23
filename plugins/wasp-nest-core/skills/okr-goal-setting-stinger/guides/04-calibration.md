# 04 — Calibration: Ambitious vs. Sandbagged, Scoring Conventions

How to calibrate OKR ambition level and grade OKRs honestly.

*Sources: `research/external/2026-05-20-ambitious-vs-sandbagged-calibration.md`, `research/external/2026-05-20-grove-doerr-okr-canon.md`, `research/external/2026-05-20-google-rework-okr-guide.md`*

---

## The two OKR modes

Before applying any scoring convention, classify each OKR as one of two modes:

### Aspirational OKRs (Moonshots)
- **Purpose:** Push the team toward step-change outcomes; accept that you might fall short.
- **Grading target:** 70% is a "good" score. 100% means the target was sandbagged. 40% or below means the target was a fantasy.
- **Application:** Product innovation, growth leaps, market expansion, engineering platform improvements.
- **Google's convention:** Most company-level OKRs are aspirational. A score of 0.6-0.7 is healthy.

### Committed OKRs
- **Purpose:** Track deliverables where the team has full control and 100% is expected.
- **Grading target:** 1.0 (100%) is the goal. Anything under 0.8 requires explanation.
- **Application:** Operational SLAs (uptime targets), regulatory compliance deadlines, customer commitments, safety-critical work.
- **Warning:** Do NOT apply the 70% rule to committed OKRs. Telling the team that 70% uptime is "good" creates dangerous expectations.

---

## The 70% moonshot rule in detail

The rule from Google's application of Doerr's framework:

> "If you achieve your OKR at a rate of 70%, you're on target. If you're always achieving 100% of your OKRs, they aren't ambitious enough."

**When this rule applies:**
- Aspirational OKRs only
- Teams with at least one full OKR cycle of history (so "70% of what?" has meaning)
- Teams that have explicitly adopted the moonshot convention

**When this rule does NOT apply:**
- Committed OKRs (operational, compliance, contractual)
- Teams new to OKRs (recommend starting with committed OKRs and 100% expectation for the first 1-2 cycles)
- Any KR that, if not achieved, creates legal, safety, or customer-trust consequences

**Recommended default for new OKR practitioners:** Start with committed OKRs and 100% expectation. Once the team has 2-3 OKR cycles of experience and a history of honest scoring, introduce aspirational OKRs with the 70% convention.

---

## The sandbagging problem

Research documents that 89% of teams under compensation linkage pressure set sandbagged targets (see `research/external/2026-05-20-ambitious-vs-sandbagged-calibration.md`). Even without compensation linkage, sandbagging is the default human tendency.

**Signs of sandbagging:**
- Every OKR scores 0.9-1.0 every cycle
- Targets are lower than the previous cycle's actual results
- The team never expresses discomfort when committing to targets
- Targets don't change even when the company's strategic priorities shift

**Diagnostic question:** "If you hit every KR at 100%, will the company be in a materially different position than if you'd set the same targets 15% higher?" If yes, the targets are sandbagged.

**Fix:** Ask "what would we need to believe is true for the target to be 30% higher?" This surfaces hidden assumptions. Then ask whether those assumptions are actually false or just unfamiliar.

---

## The scoring scale

Use the 0.0–1.0 scale (Google convention) or a 0-100% equivalent:

| Score | Meaning (aspirational OKR) | Meaning (committed OKR) |
|---|---|---|
| 0.9–1.0 | Target was sandbagged | Excellent; on track |
| 0.7–0.8 | Strong; the "moonshot sweet spot" | Good; minor shortfall |
| 0.5–0.6 | Acceptable; real stretch was attempted | Needs explanation |
| 0.3–0.4 | Missed, but something valuable was learned | Significant problem |
| 0.0–0.2 | Fantasy target; revisit goal-setting process | Critical failure |

**Grading convention for the traffic-light variant:** Green (0.7+), Yellow (0.4-0.69), Red (below 0.4).

---

## Common calibration mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Applying 70% rule to committed OKRs | Team accepts 70% uptime as "fine" | Classify OKRs as aspirational vs. committed before grading |
| All-1.0 scores every cycle | Hidden sandbagging; no learning | Ask "why did nothing fail this cycle?" |
| Punishing low scores | Team sandbagging in future cycles | Treat scores as learning data, not performance review input |
| Setting KRs without a baseline | Can't grade fairly | Establish baseline in week 1 of the cycle |
| Changing KR targets mid-cycle | Defeats the purpose of ambitious goal-setting | Only update targets if the company context changes materially (pivot, major funding event) |

---

## Mid-cycle calibration check

At the mid-quarter check-in (see `guides/05-cadence.md`), apply the confidence rating:

> "On a scale of 1-10, how confident are you that you'll hit this KR by end of quarter?"

A confidence of 7+ on an aspirational KR suggests the target may be too easy. A confidence of 2 suggests either the target is a fantasy or a blocker needs to be cleared.

The confidence rating is not the same as the end-of-cycle score. It's a leading indicator that allows the team to take action while there's still time.
