---
source_url: https://gosprintplanning.com/guides/fibonacci-agile-estimation/
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: critical
topic: estimation
stinger: agile-scrum-stinger
---

# Fibonacci Sequence in Agile Estimation - 2026 Guide

## Summary
A February 2026 guide covering the Fibonacci sequence as the de facto standard for agile estimation. Explains the mathematical rationale, practical Planning Poker protocol, reference story calibration, and comparison with T-shirt sizing and #NoEstimates. Key point: Fibonacci is NOT in the Scrum Guide; it is a community best practice.

## Key quotations / statistics
- "The Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13, 21, 34…) is the de facto standard in agile estimation."
- "The difference between small numbers is small (2 vs 3 = difference of 1), but between large numbers is huge (13 vs 21 = difference of 8). The gap forces you to think: 'Is it a 5 or really an 8?' You don't waste time debating 6 vs 7."
- "Story points are NOT in the Scrum Guide. The Scrum Guide doesn't prescribe any specific estimation technique." (teachingagile.com)
- "Most teams set [maximum point value] at 13 points. Anything estimated at 13 or above gets broken into smaller stories before entering a Sprint."
- "Research shows Fibonacci teams achieve consistent velocity within 3-4 sprints, while T-shirt teams converting to numbers take 5-6 sprints to stabilize." (freescrumpoker.com)

## Fibonacci Reference Story Calibration Template
| Points | Example Story | Complexity |
|---|---|---|
| 1 | Change button text | Trivial |
| 2 | Add a field to existing form | Very simple |
| 3 | Create basic REST endpoint | Simple |
| 5 | Implement complex form validation | Moderate |
| 8 | Integrate external payment service | Complex |
| 13 | Migrate database with existing data | Very complex |
| 20/21 | Redesign authentication architecture | Extremely complex (split this) |

## Planning Poker Protocol
1. Product Owner reads the story and acceptance criteria
2. Team asks clarifying questions
3. Each person privately selects a card
4. Everyone reveals simultaneously
5. If estimates vary significantly, low and high voters explain their reasoning
6. Team discusses and re-votes until reaching consensus
- Time-box: 3 minutes per item; if no consensus, take the higher estimate or split the story

## Fibonacci vs T-Shirt Sizing Decision
- **Use Fibonacci when**: Sprint-level refinement, velocity tracking needed, team has 2+ sprints of history, precise capacity planning matters
- **Use T-shirt sizing when**: Initial backlog sizing, roadmap planning, non-technical stakeholders, early team with no velocity baseline
- **Use both**: T-shirt sizing for high-level epics; convert to Fibonacci for sprint-ready stories

## Annotations for stinger-forge
- The reference story table above should appear directly in `guides/03-estimation.md`: it is the most practical tool for teaching relative estimation.
- Critical coaching directive: Never convert story points to hours. The moment a team does this, estimation gaming begins.
- The Planning Poker Protocol belongs in `templates/sprint-planning-agenda.md` as the estimation ceremony section.
- Companion sources: freescrumpoker.com/articles/fibonacci-vs-tshirt-sizing.html and teachingagile.com/scrum/psm-1/estimation/story-points provide additional depth.
