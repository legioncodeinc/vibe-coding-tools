---
source_url: https://teachingagile.com/scrum/psm-1/scrum-planning-estimation/estimation-techniques/story-points
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: story-points
stinger: estimation-stinger
additional_sources:
  - https://blog.logrocket.com/product-management/fibonacci-story-points-guide
  - https://mountaingoatsoftware.com/blog/why-the-fibonacci-sequence-works-well-for-estimating
  - https://teachingagile.com/scrum/psm-1/scrum-planning-estimation/estimation-techniques/planning-poker
---

# Story Points, Fibonacci Scale, and Planning Poker

## Summary

Story points are a unit of measure combining effort, complexity, and uncertainty into a single relative number. The standard Fibonacci scale (1, 2, 3, 5, 8, 13, 21) is used because gaps between numbers grow larger as numbers increase, reflecting the fundamental truth that bigger items carry more estimation uncertainty. Story points are NOT in the Scrum Guide; they are a complementary practice. The primary output is velocity - average story points completed per sprint - used for sprint capacity planning.

Planning Poker is the standard facilitation technique: simultaneous reveal prevents anchoring bias. Teams use Modified Fibonacci (0, ½, 1, 2, 3, 5, 8, 13, 20, 40, 100) with special cards (?, ☕, ∞). Created by James Grenning in 2002, popularized by Mike Cohn.

Mike Cohn (Mountain Goat Software) modified the original Fibonacci: replaced 21 with 20 (easier to reason about), added 40 and 100 for large items that need splitting. His canonical argument: numbers too close to each other (e.g., 19 vs. 20) are impossible to distinguish as estimates; the growing gaps reflect estimation uncertainty proportionally.

## Key quotations / statistics

- "Story points are NOT in the Scrum Guide. The Scrum Guide doesn't prescribe any specific estimation technique." (Teaching Agile, 2026)
- "The difference between a 1-point and a 2-point story is meaningful and detectable. The difference between a 20-point and a 21-point story is not." (Teaching Agile, 2026)
- "Story points do not equate to time. They relate to the complexity of a task and are determined differently in every development team." (LogRocket, 2025)
- "Research shows [Planning Poker is] notably more accurate than individual estimates." (Teaching Agile - citing unspecified research)
- Standard reference table: 0=trivial, ½=under an hour, 1=few hours, 2=half day, 3=about a day, 5=1-2 days, 8=2-3 days, 13=3-5 days, 20+=should split
- Common technique progression: Affinity estimation for initial backlog (100+ stories) → T-shirt sizing for quarterly roadmap → Planning Poker for sprint-level stories

## Annotations for stinger-forge

- Primary source for `guides/02-relative-sizing.md` - the Fibonacci scale rationale, Planning Poker facilitation steps, and the "max point threshold for splitting" rule
- The "story points are NOT in Scrum Guide" fact is important for framing: story points are an industry practice, not a Scrum requirement
- The simultaneous reveal mechanic is the crucial anti-anchoring mechanism - explain WHY it matters in the guide, not just HOW to do it
- Anti-pattern to document: converting story points to hours. Multiple sources explicitly warn against this; it defeats the purpose
- The technique comparison table (Planning Poker vs. T-shirt Sizing vs. Affinity vs. Individual) is useful for stinger-forge to adapt into `guides/02-relative-sizing.md`
- Key contradiction with #NoEstimates sources: Mike Cohn's work supports velocity-based forecasting from story points; Vasco Duarte argues story points add noise over raw item counts. stinger-forge should resolve this honestly: story points work well for sprint capacity; they are NOT reliable long-range forecasting tools
- Ron Jeffries critique of story points (ronjeffries.com) was not directly retrieved in this research pass; stinger-forge should note this gap and potentially re-fetch
