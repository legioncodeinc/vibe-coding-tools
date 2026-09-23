# Monte Carlo Simulation for Delivery Forecasting

Monte Carlo simulation is the most defensible method for producing probabilistic delivery date forecasts. It replaces gut-feel estimates with data-driven probability distributions. This guide covers how it works, what data it needs, and the 2026 free tooling landscape.

## How Monte Carlo simulation works (for delivery forecasting)

1. **Input: historical throughput distribution.** You need the number of items your team completed per sprint or week, for at least 20-30 time periods. This is not a point estimate. It is a distribution. Example: the team completed 4, 7, 6, 5, 4, 8, 6, 5, 7, 4 items over 10 sprints.

2. **Input: backlog count.** How many items remain? Use a count, not a story-points total. Apply a scope creep multiplier (1.15-1.3x is typical for most teams).

3. **Simulation: sample and sum.** The simulation runs 1,000 to 10,000 trials. Each trial: randomly sample a throughput value from your historical distribution (sampling with replacement). Keep sampling until the cumulative throughput reaches your backlog size. Record how many time periods it took.

4. **Output: probability distribution over completion dates.** Sort the trial results. P50 is the date by which 50% of simulations completed; P85 is 85%, P95 is 95%.

Key technical note: Monte Carlo does NOT require normally distributed data. Skewed cycle-time distributions (common in real teams, where occasionally items take much longer than typical) are correctly modeled by sampling with replacement. This is a major advantage over PERT and three-point estimation. See `research/external/03-monte-carlo-forecasting.md`.

## Confidence percentile interpretation

| Percentile | Meaning | Use case |
|---|---|---|
| P50 | 50% of simulations completed by this date. Realistic internal target. | Sprint planning; internal team goals |
| P85 | 85% of simulations completed. Safe external commitment. | Stakeholder commitments; release planning |
| P95 | 95% of simulations completed. Conservative contingency. | External client SLAs; contractual dates |

The delta between P50 and P85 is a productive conversation starter: "We're 85% confident by April 2, but only 50% by March 15. What would it take to close that gap? Scope reduction? Added capacity? Risk acceptance?"

Quote: "Most teams present both the median (P50) and a safer commitment level such as P85. The delta between them is a great conversation starter about scope trade-offs, staffing, or risk mitigation." (ScopeCone, 2026). See `research/external/03-monte-carlo-forecasting.md`.

## Minimum data requirements

- **20-30 completed items minimum** to produce meaningful confidence bands.
- More is always better: 50+ items produces significantly tighter bands.
- If you have fewer than 20 items, Monte Carlo will produce very wide ranges. Use three-point estimation (PERT: Optimistic + 4 × Most Likely + Pessimistic) / 6 as a lighter-weight alternative while you build history.
- The data must be from a stable team doing stable work types. If team composition or work type changed dramatically 6 weeks ago, use only the post-change data.

## 2026 free tooling landscape

All tools below are free or have a meaningful free tier as of May 2026. See `research/external/03-monte-carlo-forecasting.md` for the full landscape.

### For quick demos and stakeholder conversations

- **ScopeCone** (scopecone.io): Paste cycle times, get P50/P85/P95 instantly. Best for quick stakeholder demos.
- **Kitmul** (kitmul.com): Free online; 10,000 iterations by default. Clean visualization.
- **Monte.one**: Jira + GitHub connectors; 1,000,000 simulations; evidence-based scheduling.

### For teams who want CLI/CI integration

- **mcprojsim** (Python, open source): `pip install mcprojsim`. v0.15.1 released April 2026. Full-featured: three-point estimates, T-shirt sizes, story points, Tornado sensitivity charts, risk modeling, MCP server integration for AI workflows. Best for teams that want to automate forecasting in their toolchain.
  - Install: `pip install mcprojsim`
  - Basic usage: `mcprojsim --throughput "4,7,6,5,4,8,6,5,7,4" --backlog 40 --percentiles 50,85,95`

### For teams using Jira/Linear

- **ActionableAgile**: Jira plugin; provides Cycle Time Histogram, percentile lines, throughput charts. Designed for Kanban/flow-based teams. Best for teams transitioning from story points to throughput.
- **LinearB**: Enterprise engineering intelligence platform; integrates with Linear/GitHub; DORA metrics + cycle time; better suited for engineering management reporting than daily forecasting.

### Tooling selection heuristic

- Team wants quick demo → ScopeCone or Kitmul
- Team wants CLI/automation/MCP integration → mcprojsim
- Team is Kanban/flow-based using Jira → ActionableAgile
- Team is engineering intelligence / DORA-focused → LinearB

## Worked example (sketch)

**Setup:** Team of 5; 8 weeks of history; throughput (items/week): 4, 6, 5, 7, 4, 6, 5, 8. Backlog: 40 items remaining. Scope creep multiplier: 1.2 (estimate 48 effective items).

**Monte Carlo output (illustrative):**
- P50: 8.5 weeks (~60 calendar days)
- P85: 11 weeks (~77 calendar days)
- P95: 13.5 weeks (~95 calendar days)

**Stakeholder message:** "Based on our historical delivery rate, we'll finish 50% of the time in about 9 weeks and 85% of the time in about 11 weeks. If you need a firm commitment, we recommend targeting the 11-week date, and we'll update the forecast every 2 weeks as new data comes in."

Full worked example with step-by-step: `examples/monte-carlo-forecast.md`.

## Three-point estimation (PERT) as a lightweight fallback

When a team lacks cycle-time data (< 20 items), PERT provides a lightweight alternative:

**Formula:** Estimate = (Optimistic + 4 × Most Likely + Pessimistic) / 6

**Apply per story or per epic, then sum.** PERT does NOT substitute for Monte Carlo: it requires normally-distributed variation, which software work rarely exhibits. Use it as a temporary tool while building cycle-time history.

From `research/external/04-planning-fallacy.md`: PERT is the "Cone of Uncertainty" at the task level. It explicitly captures uncertainty range, which is its main advantage over single-point estimates.

---

*Cited research: `research/external/03-monte-carlo-forecasting.md`, `research/external/04-planning-fallacy.md`*
*Example: `examples/monte-carlo-forecast.md`*
