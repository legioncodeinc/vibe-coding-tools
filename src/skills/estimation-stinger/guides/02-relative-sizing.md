# Relative Sizing: Fibonacci Story Points, T-shirt Sizing, and Planning Poker

Relative sizing methods answer "how big is this work relative to other work we've done?" They do NOT answer "how many days/hours will this take?" and should never be converted directly to dates without forecasting.

## Fibonacci story points

### Why Fibonacci?

The Fibonacci sequence (1, 2, 3, 5, 8, 13, 21) reflects an important cognitive truth: as complexity grows, our uncertainty grows faster. The increasing gaps between Fibonacci numbers force teams to acknowledge that big stories are big in a non-linear way. A story estimated at 13 is not "1.3x bigger than 10"; it is "genuinely uncertain and probably needs splitting."

The "Not in the Scrum Guide" note: story points are not a Scrum artifact. The Scrum Guide (2020) mentions them nowhere. They are a community convention that evolved from Extreme Programming. Teams that treat them as sacred Scrum objects confuse convention with requirement. See `research/external/02-story-points-fibonacci.md`.

### When story points apply

- Teams new to estimation who need a shared sizing vocabulary
- Sprint-level work planning (2-4 week horizon)
- When the team needs a common language for backlog grooming conversations
- Teams where "days" estimates are instantly converted to commitments (abstraction helps avoid this)

### When to stop using story points

- Team composition or work type has changed so much that calibration has drifted (Category 3 dysfunction)
- The team has 6+ months of cycle-time data and wants more accurate delivery forecasts
- Story points are being used to generate delivery dates: that's a forecasting job, not an estimation job

### Reference story calibration (essential for meaningful points)

1. Select a "1-point reference story": the smallest piece of work the team regularly does. Write it on a card. Keep it visible.
2. Select a "5-point reference story": a typical medium-complexity story the team knows well.
3. All future estimates are relative to these two anchors.
4. Re-calibrate when: team changes, technology stack changes, reference stories are forgotten.

### Anti-patterns to flag

- **Decimal points / fractions**: If someone proposes "2.5 story points," the story should be split, not micro-estimated.
- **Estimating in hours disguised as points**: If points correlate 1:1 with hours, the team is doing time estimates with extra steps.
- **Averaging estimates instead of discussing**: The value of Planning Poker is the CONVERSATION when estimates diverge, not the average number.
- **Treating story-point velocity as a commitment contract**: velocity is a statistical average, not a guarantee.

## T-shirt sizing (S / M / L / XL / XXL)

### When T-shirt sizing applies

T-shirt sizing is optimized for non-technical stakeholder audiences and roadmap-level planning (3-12 month horizon). It sacrifices precision for accessibility. A product manager or executive can immediately understand "this is an XL initiative" without needing to know what story points mean.

Specifically use T-shirt sizing when:

- Presenting a roadmap to leadership or customers
- Sizing epics or features before sprint-level decomposition
- Running "Now / Next / Later" roadmap conversations where relative investment signals matter more than dates

From `research/external/05-t-shirt-sizing.md`: The Now/Next/Later roadmap format (Janna Bastow) pairs naturally with T-shirt sizing because it decouples the "what we're working on" conversation from date commitments.

### T-shirt size → story point conversion (optional)

When teams need to bridge T-shirt sizes to sprint planning, a common mapping is:

| T-shirt | Story points | Rough week range (for illustration, NOT commitment) |
|---------|-------------|-----------------------------------------------------|
| S | 1-3 | 1-3 days |
| M | 5-8 | 1-2 weeks |
| L | 13-20 | 2-4 weeks |
| XL | 40+ | 4-8+ weeks (strongly consider splitting) |
| XXL | Epic/project | Needs decomposition before sizing |

**Important:** Always label these as rough illustrations for team calibration, never as delivery date commitments.

### Anti-patterns to flag

- **T-shirt-to-date conversion**: "We have 3 M-sized features for Q3" is not a delivery forecast.
- **XL and XXL without decomposition**: Stories larger than L almost always contain hidden complexity; flag them for decomposition before committing any roadmap slot.
- **Using T-shirt sizes as performance metrics**: Counting T-shirt points per sprint is not a useful metric.

## Planning Poker

Planning Poker is the process by which a team produces story-point estimates. It is a structured consensus-building ritual, not just a voting tool.

### How a Planning Poker session runs

1. Product owner reads the story and acceptance criteria.
2. The team asks clarifying questions until they understand the scope.
3. Each team member privately selects a Fibonacci card.
4. All cards are revealed simultaneously (the simultaneous reveal prevents anchoring).
5. If all estimates agree (or are within one Fibonacci value), record the estimate.
6. If estimates diverge significantly (e.g., 2 vs. 13), the highest and lowest estimators explain their reasoning. This is the most valuable part of the process: it surfaces hidden assumptions.
7. Vote again until consensus or near-consensus.

### The value is in the outliers

The session earns its time investment when a "2" and a "13" appear simultaneously. The developer who said 13 likely knows about a hidden complexity the others don't. Surface it, discuss it, update the estimate. The team has just avoided a surprise.

### Remote Planning Poker tooling (2026)

Free tools: PlanningPoker.com, Agile Poker (free tier), Scrum Poker app. All support Fibonacci and custom scales. Use any; the specific tool matters less than the simultaneous reveal.

---

*Cited research: `research/external/02-story-points-fibonacci.md`, `research/external/05-t-shirt-sizing.md`*
*Example: `examples/fibonacci-estimation-session.md`*
