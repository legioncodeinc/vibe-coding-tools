---
source_url: https://kollabe.com/posts/noestimates-debate-when-story-points-help-and-hurt
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: estimation
stinger: agile-scrum-stinger
---

# The #NoEstimates Debate - When Story Points Help and When They Hurt (February 2026)

## Summary
A balanced February 2026 analysis of the #NoEstimates movement vs. story point estimation, covering when each approach is appropriate. Key insight: the estimation debate is a false dichotomy, and the real question is "are we getting value from this ceremony?" Teams should use throughput-based forecasting when it's more accurate than velocity tracking, not as an ideology.

## Key quotations / statistics
- "Historical throughput data (how many items you finish per sprint) predicts delivery dates more reliably than summing up story points."
- "Teams spend hours in estimation sessions that could be spent building software."
- "Story points get misused as commitments, deadlines, and performance metrics."
- "The #NoEstimates camp has a viable alternative here, but it requires historical data that many teams don't have, especially early in a project or after significant team changes."
- "The pro-estimation camp is right that structured discussion about upcoming work prevents surprises. Planning poker works not because the numbers are accurate, but because the conversations surface hidden complexity before it becomes a mid-sprint problem."

## Velocity Gaming Anti-Patterns (to add to guides/05-anti-patterns.md)
Teams game velocity when management treats it as a performance target:
- Inflate estimates to make velocity targets easier to hit
- Split stories in ways that maximize points rather than value
- Cut corners on quality (invisible technical debt) to hit sprint goals
- Avoid complex, risky work that might endanger velocity targets
- Triggered by: arbitrary velocity increases ("deliver 40 points, you were doing 30")

## Context-Based Estimation Decision Matrix
| Context | Recommended Approach |
|---|---|
| New team, complex product | Planning Poker with story points (conversations matter more than numbers) |
| Established team, varied work | Lightweight estimation (T-shirt sizing or quick planning poker) |
| Established team, uniform work | Track throughput. Skip estimation. |
| Cross-team roadmap planning | Story points or T-shirt sizes for high-level forecasting |
| Support/maintenance | Track cycle time and throughput. Don't estimate individual tickets |

## #NoEstimates How-To (for teams ready for it)
1. Break every story into pieces small enough to complete in 1-2 days
2. Track throughput: count how many stories the team completes per sprint
3. Forecast: remaining_stories ÷ average_throughput = estimated sprints remaining
4. Use Monte Carlo simulation for probabilistic confidence intervals
- Prerequisites: stable team (18+ months), consistent item sizing, historical throughput data

## Annotations for stinger-forge
- The velocity gaming anti-pattern list is essential for `guides/05-anti-patterns.md`.
- The context-based decision matrix is the cleanest synthesis for `guides/03-estimation.md` - it answers "which estimation method for my team?" in one table.
- #NoEstimates section should come after Fibonacci and T-shirt sizing in the estimation guide, positioned as "for mature teams."
- Companion source: agility-at-scale.com/principles/agile-planning-story-points provides the psychological history of why story points were invented (manager cover).
