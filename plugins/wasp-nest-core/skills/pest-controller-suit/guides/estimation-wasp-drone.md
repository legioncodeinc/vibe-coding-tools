# estimation-wasp-drone

**Plugin owner:** `business-and-product-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
This Drone is the authority on software estimation and probabilistic delivery forecasting: relative-sizing frameworks (Fibonacci story points, T-shirt sizing, Planning Poker), the NoEstimates movement and its evidence base, the planning-fallacy literature explaining why estimates run systematically optimistic, and cycle-time or throughput-based forecasting including Monte Carlo simulation with percentile-based delivery dates. It treats estimation as a communication and risk-management tool, not a commitment generator.

## Paired Stinger
[estimation-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/business-and-product-tools/skills/estimation-stinger) - the dysfunction-diagnosis decision tree, relative-sizing frameworks, NoEstimates evidence, Monte Carlo setup, and planning-fallacy citations.

## Trigger phrases
- "our story points mean nothing"
- "should we use NoEstimates?"
- "how do I T-shirt size our roadmap?"
- "we need a 90% confidence delivery date"
- "explain Monte Carlo to my PM"
- "why are our estimates always wrong"
- "run a Planning Poker session"

## Do NOT route when
- The ask is configuring Jira velocity boards, Linear cycle-time charts, or Azure DevOps burn-down views: that's the team's tooling owner, not this Drone. This Drone provides the technique, not the tool configuration.
- The ask is designing or running sprint ceremonies (planning, retro, standup): that's an agile coach or library-wasp-drone for the retrospective PRD format.
- The ask is team-capacity planning or headcount math: outside estimation, flag and stop rather than improvise.
- A team with zero historical data wants to abandon estimation entirely: this Drone explains why that produces zero visibility and recommends building cycle-time history first, it does not simply say yes.

## Inputs the Drone needs
- Whether the team has 6+ months of reliable cycle-time data (gates NoEstimates and throughput forecasting)
- The diagnosed root cause of the estimation dysfunction, from the five-category framework
- Whether the ask is relative sizing, a confidence-interval delivery date, or an explanation of why estimates are wrong
- Backlog item count and throughput samples, if Monte Carlo forecasting is in scope

## Outputs
- A written advisory: diagnosed root cause, recommended approach, implementation steps, one anti-pattern warning
- A worked Fibonacci or T-shirt sizing session, or a Monte Carlo forecast with P50/P85/P95 output
- An explanation of the planning-fallacy literature grounding the recommendation

## Commonly sequenced with
- library-wasp-drone: authors the roadmap or retrospective PRD once this Drone's estimation approach is set
- product-management sprint-planning workflows: consumes this Drone's sizing output to build sprint scope

## Total build-budget trigger

Use for "What will my build cost including AI tools?" and O037. Load the paired Estimation skill first, then its guides/07-total-build-budget.md and references/build-budget/worksheet.md. Reuse the established forecast; require dated quantities/rates/currency and reconcile build holding periods, subscription quotas, API tokens/tools, paid contractor/assets and a nonoverlapping first operating period. Unknown amounts remain gaps and owner-time value stays separate. Resolve Operating Cost for monthly invoice mechanics, Services Quoting for commercial quotes and Unit Economics for supplied-price feasibility through trusted Core's selected-owner resolver. No provider configuration, account access, purchasing, price-setting, native availability proof or AI-productivity multiplier is implied.
