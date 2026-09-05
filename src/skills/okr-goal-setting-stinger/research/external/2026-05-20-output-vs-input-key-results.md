---
source_url: https://weekdone.com/resources/objectives-key-results/
retrieved_on: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: key-result-writing
stinger: okr-goal-setting-stinger
---

# Output vs. Input Key Results: The Discipline and Its Anti-Patterns

## Summary

The single most common OKR failure mode is writing Key Results that measure inputs (activities, tasks, effort) rather than outputs (outcomes, results, impact). An input KR looks like "conduct 20 customer interviews" or "ship the onboarding redesign." An output KR looks like "increase onboarding completion rate from 40% to 70%" or "achieve NPS score of 45 among new users." The distinction matters because input KRs allow a team to "succeed" at the KR while failing the Objective - you can run 20 interviews and still have terrible customer retention.

The test for an output KR is Grove's binary: can you, at the end of the period, look at this KR and say unambiguously "yes" or "no" whether it was achieved? If the KR is "ship the redesign," the answer is always yes once you ship anything - the signal is meaningless. If the KR is "increase conversion from trial to paid from 5% to 12%," the answer is a clear number with no gaming possible.

Defensible exceptions for input KRs exist in specific early-stage contexts: when a team has no baseline data (e.g., "conduct first 20 user research sessions" for a new product feature), when the activity is itself the leading indicator with proven correlation to the desired outcome, or when the team is building organizational capability (e.g., "implement a continuous deployment pipeline") rather than optimizing a metric. These exceptions should be named explicitly, not silently accepted, and should sunset as soon as outcome data is available.

The rewrite pattern from Weekdone and Doerr's work: take the input KR ("run performance reviews for all 15 engineers") and ask "what outcome would this activity produce if it worked?" ("increase engagement survey score from 6.2 to 7.5" or "achieve 90% of engineers have documented growth plans"). Then write the outcome as the KR and note the activity as a strategy.

## Key quotations / statistics

- Doerr, Measure What Matters: "Key results should be aggressive yet realistic. When used correctly, they force clarity and commitment." - The "aggressive yet realistic" framing implies output KRs that stretch the team; input KRs cannot be aggressive in a meaningful sense.
- Common anti-pattern categories: (1) Task/activity KRs ("complete X") (2) Output-not-outcome KRs ("ship X feature") (3) Binary yes/no KRs without a measurable scale ("improve user satisfaction") (4) Input proxy KRs ("hold 3 product reviews per month")
- Weekdone research: teams that use output-based KRs achieve 31% higher OKR cycle success rates than teams using mixed input/output KRs.

## Annotations for stinger-forge

- This source is foundational for `guides/03-writing-key-results.md`. The stinger should include a table of 8-10 input KR anti-patterns with their output KR rewrites.
- The defensible-exception framework (early-stage, no baseline data, capability-building) should be explicitly coded as a named exception with conditions, NOT as general permission for input KRs.
- The "what outcome would this produce if it worked?" rewrite prompt is the single most actionable coaching tool in the stinger and should appear in both the guide and the worked example template.
- `examples/weak-to-strong-rewrite.md` should include at least 4 input-to-output rewrites, each labeled with which exception category (if any) would have made the input KR defensible.
