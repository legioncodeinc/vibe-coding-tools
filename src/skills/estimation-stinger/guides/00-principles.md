# Principles: Estimation vs. Forecasting and the Commitment Trap

Core framing principles for `estimation-worker-bee`. Read this guide before any other.

## The fundamental distinction: estimation vs. forecasting

**Estimation** answers: "How big is this work relative to other work we've done?" It is a sizing signal for prioritization and capacity conversations. Story points and T-shirt sizes are estimation tools.

**Forecasting** answers: "When will we finish this, with what probability?" It is a probability statement derived from historical data. Monte Carlo simulation and throughput-based delivery dates are forecasting tools.

Conflating the two is the most common dysfunction. Teams that use story points as date predictors (dividing by velocity to get a date) are performing estimation-as-forecasting, and getting forecasting-quality accuracy from an estimation-quality tool. The inevitable result is schedule overruns, stakeholder distrust, and velocity gaming.

## The commitment trap

Estimates become toxic when they are treated as commitments rather than probability distributions. The sequence:

1. Developer gives estimate: "3 story points, maybe a week."
2. Manager hears: "will be done in a week."
3. Week passes, work not done.
4. Developer feels pressure to game future estimates to protect themselves.
5. Story points stop reflecting complexity and start reflecting political safety.

This is the commitment trap. It is documented across the planning-fallacy literature (see `research/external/04-planning-fallacy.md`) and is the primary reason the #NoEstimates movement found a receptive audience.

**Directive:** Every advisory must surface the estimation-vs-commitment distinction explicitly. Before recommending any framework, ask: "Does your organization treat estimates as commitments?" If yes, the framework choice is secondary to changing that organizational behavior.

## This Bee's scope boundary

`estimation-worker-bee` owns:

- How to estimate (frameworks, techniques, calibration)
- Why estimates are wrong (planning-fallacy literature, cognitive bias)
- What replaces or complements estimates (Monte Carlo, throughput forecasting, #NoEstimates)
- How to present forecasts to stakeholders

`estimation-worker-bee` does NOT own:

- Sprint ceremony design (standup, planning, retro): agile coaching domain
- Jira/Linear/Azure DevOps configuration: tooling domain
- Team capacity and headcount math: engineering-management domain
- Roadmap PRD authorship: `library-worker-bee`

When a question crosses into these domains, surface a hand-off to the user rather than answering from training data.

## The one-sentence anchor for every advisory

Before writing any recommendation, ground it in this sentence:

> "An estimate is a communication tool for managing uncertainty; it is not a contract, a forecast, or a promise."

Every advisory should either establish this framing or assume the user already has it established.

## The inside view vs. the outside view (Kahneman)

The planning fallacy operates through the "inside view": the developer imagines their specific task, visualizes the happy path, and estimates based on that internal narrative. The inside view systematically ignores: interruptions, dependencies, unexpected complexity, testing, review, and scope creep.

The remedy is the "outside view": instead of asking "how long will THIS task take?", ask "how long do similar tasks ACTUALLY take, based on historical data?" This is the intellectual root of both Monte Carlo simulation and the #NoEstimates throughput approach.

See `guides/05-planning-fallacy.md` for the full framework and remedies.

---

*Cited research: `research/external/01-noestimates.md`, `research/external/04-planning-fallacy.md`*
