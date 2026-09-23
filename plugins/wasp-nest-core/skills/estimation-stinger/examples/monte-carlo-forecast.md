# Worked Example: Monte Carlo Delivery Forecast

Demonstrates a Monte Carlo simulation for a 40-item backlog, using real-looking throughput data, showing P50/P85/P95 interpretation and stakeholder communication.

## Context

**Team:** 4 engineers, 1-week sprints, 12 weeks of history.
**Problem:** Engineering manager needs to tell the product team when the Q3 feature set will be ready with "some confidence level."
**Diagnosis result:** Team has sufficient history for Monte Carlo (Category 4 + Category 5 dysfunctions: commitment trap + wrong granularity).

## Step 1: Export throughput history

From Jira (completed items per sprint over last 12 sprints):

| Sprint | Items completed |
|---|---|
| 1 | 5 |
| 2 | 7 |
| 3 | 4 |
| 4 | 6 |
| 5 | 5 |
| 6 | 8 |
| 7 | 6 |
| 8 | 5 |
| 9 | 7 |
| 10 | 4 |
| 11 | 6 |
| 12 | 9 |

Distribution: min=4, max=9, median=6. This is the distribution we sample from.

## Step 2: Count the backlog

Current remaining backlog: 40 items. These are all sprint-ready stories, decomposed to roughly 1-3 day items each.

Apply scope creep multiplier: historically this team sees ~20% scope growth. Adjusted backlog: 40 × 1.2 = **48 effective items**.

## Step 3: Run the simulation (ScopeCone or mcprojsim)

**Using mcprojsim (CLI):**
```
mcprojsim --throughput "5,7,4,6,5,8,6,5,7,4,6,9" --backlog 48 --percentiles 50,85,95
```

**Using ScopeCone (web):** Paste the 12 throughput values, enter backlog = 48, click Run.

**Illustrative output:**

| Percentile | Sprints to complete | Calendar date (starting June 2) |
|---|---|---|
| P50 | 8 sprints | July 28 |
| P85 | 10 sprints | August 11 |
| P95 | 12 sprints | August 25 |

## Step 4: Interpret the output

**P50 (July 28):** This is the realistic team target. 50% of simulated futures show completion by this date. Use for internal planning and sprint goals.

**P85 (August 11):** This is the recommended external commitment. 85% of simulated futures show completion. Present this date to the product team as "the date we're confident in."

**P95 (August 25):** This is the contingency date. If the product launch has hard dependencies (marketing campaign, customer announcement), use this as the hard deadline that drives scope decisions.

**The gap between P50 and P85 is ~2 sprints.** This is the "risk buffer." If the product team wants an earlier date, the conversation is: "What scope can we drop to shift the P85 date by 2 sprints?"

## Step 5: Stakeholder communication (recommended framing)

> "Based on our delivery data from the last 12 sprints, here's our Q3 forecast:
>
> - **Most likely by July 28** (50% confidence)
> - **Confident by August 11** (85% confidence) - this is our recommended commitment date
> - **Contingency by August 25** (95% confidence)
>
> These forecasts update every sprint as new delivery data comes in. If scope changes, we re-run the forecast. The delta between July 28 and August 11 represents the natural variance in our delivery pace; it's not a negotiating position, it's the mathematical reality of building software."

## What this demonstrates

- Monte Carlo produces a **range**, not a point. Communicate all three percentiles.
- The scope creep multiplier is essential: ignoring it systematically produces over-optimistic forecasts.
- The forecast updates automatically as new sprint data arrives: run it every sprint, not just once.
- Stakeholder conversations become evidence-based: "we can close the 2-sprint gap by cutting these 5 stories" is a negotiable trade, not a guess.

## NoEstimates interpretation

Note: in this example, we did NOT use story points at all. We counted items and tracked throughput. This is exactly the #NoEstimates approach in practice. The team produced a more defensible delivery forecast than they would have from dividing total story points by velocity, because velocity was already variable (4-9 items/sprint), and that variability is correctly modeled in the Monte Carlo distribution.

---

*Guides referenced: `guides/04-monte-carlo.md`, `guides/03-noestimates.md`, `guides/01-diagnosis.md`*
*Cited research: `research/external/03-monte-carlo-forecasting.md`, `research/external/01-noestimates.md`*
