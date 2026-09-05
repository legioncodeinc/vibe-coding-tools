---
source_url: https://asana.com/resources/t-shirt-sizing
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: t-shirt-sizing
stinger: estimation-stinger
additional_sources:
  - https://talent500.com/blog/agile-estimation-techniques-story-points-vs-t-shirt-sizing/
  - https://www.knowledgehut.com/blog/agile/t-shirt-sizing-use-to-estimate-delivery
  - https://www.ituonline.com/blogs/agile-estimation-techniques-that-actually-work-planning-poker-t-shirt-sizes-and-beyond/
  - https://agilesm.net/t-shirt-sizing.html
  - https://nevolearn.com/blog/t-shirt-sizing-agile
  - https://activecollab.com/blog/project-management/agile-epics
  - https://pensero.ai/blog/agile-roadmap
---

# T-Shirt Sizing: High-Level Agile Estimation for Roadmaps and Discovery

## Summary

T-shirt sizing (XS, S, M, L, XL, XXL) is a relative estimation technique designed for high-level planning contexts where items are not yet ready for precise story-point estimation. It is intentionally coarse - the labels are intuitive to non-technical stakeholders, and the lack of numbers reduces false-precision pressure. Standard use cases: early product discovery, large backlog triage (50-200 items), roadmap-level epic sizing, portfolio prioritization across teams.

T-shirt sizing is typically the first tier in a progressive refinement pipeline: T-shirt sizes for quarterly roadmap → story points for sprint-level planning → hours for task execution. Teams can assign numeric equivalents (XS=1, S=2, M=3, L=5, XL=8, XXL=13) to enable velocity calculations while keeping the communication layer simple.

Key distinction from story points: T-shirt sizes answer "how big is this relative to other items on this roadmap?" at a strategic level. Story points answer "how many of these can we fit in a sprint?" at a tactical level. Neither answers "when will it be done?" without additional forecasting.

**Why it works for non-technical audiences:**
- Labels are universally understood without explanation
- Reduces cognitive load vs. assigning specific numbers
- Encourages relative thinking, not false precision
- Can estimate 50 roadmap items in a single session (10-20 seconds per item)

**2026 context:** Agile roadmap tools (Jira, ProductPlan, Pensero.ai) explicitly support T-shirt size fields. The "Now / Next / Later" roadmap format (common in 2025-2026) pairs naturally with T-shirt sizing - items in "Later" are sized to XL/XXL by default due to high uncertainty.

## Key quotations / statistics

- "T-shirt sizing is a tool for quick, high-level planning when you need a general sense of effort without getting stuck on exact numbers." (Asana, Jan 2026)
- "A product owner can sort by business value, technical risk, and size to decide what to analyze first. If two features have similar value but one is XL and the other is M, the smaller item may be the better near-term choice." (ITU Online, April 2026)
- "If you need to categorize 100+ items quickly, T-shirt sizing saves time." (Talent500, March 2026)
- "T-shirt sizing pairs well with prioritization frameworks." (ITU Online, April 2026)
- Technique speed comparison: Planning Poker=2-5 min/item, T-shirt sizing=15-60 sec/item, Affinity estimation=10-20 sec/item
- "T-shirt sizing is intentionally 'good enough' for early decisions. It supports transparency by making assumptions visible, inspection by highlighting outliers and disagreements, and adaptation by triggering the next best action (split, clarify, prototype, spike, or defer)." (AgileSM.net)
- "Use T-shirt sizing for epics, roadmap planning, and early product discovery... Not for sprints where you need precision." (ITU Online, April 2026)
- Typical numeric conversion: S=1, M=3, L=5, XL=8 (enabling velocity calculation when needed)

## Common patterns and anti-patterns

**Patterns that work:**
- Set reference items before sizing (one XS, one S, one M example) to calibrate the team
- Time-box debates: if a team can't agree in 2-3 minutes, it's a signal the item needs decomposition
- Treat XL and above as "too uncertain to commit to without decomposition" - use it to drive discovery
- Review and recalibrate T-shirt definitions regularly (they drift over time)

**Anti-patterns to avoid:**
- Forcing T-shirt sizes to map directly to time estimates ("L means 2 sprints") without validation
- Using T-shirt sizing for sprint-level commitment (use story points instead)
- Different team members using different mental models for what "Medium" means (calibration required)

## Annotations for stinger-forge

- Primary source for `guides/02-relative-sizing.md` section on T-shirt sizing; also feeds into `guides/00-principles.md` for the audience selection framework (when to use T-shirt vs. story points vs. Monte Carlo)
- The progressive refinement pipeline (T-shirt → story points → hours) is the canonical model for stinger-forge to document
- Non-technical stakeholder framing is a unique strength of T-shirt sizing vs. story points - worth a dedicated section
- The "XL as decomposition signal" pattern is important: oversized items in T-shirt sizing should trigger a split, not a bigger estimate
- "Now/Next/Later" roadmap format pairing is a 2026-era context that stinger-forge should reference as the current standard for product roadmaps
- Open question from research: Is there a standard approach to converting T-shirt sizes to Monte Carlo inputs? Yes - assign point values (S=1, M=3, L=5, XL=8), build a cycle-time dataset from past items in each size, use that as simulation input. This bridges T-shirt sizing with the Monte Carlo approach in `guides/04-monte-carlo.md`.
