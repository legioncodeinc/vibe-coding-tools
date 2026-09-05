# NoEstimates: Throughput as Forecasting

The #NoEstimates movement argues that replacing story-point estimation with throughput-based forecasting produces more accurate delivery predictions with less overhead. This guide covers the argument, its evidence base, its prerequisites, and the balanced view.

## The core argument (Vasco Duarte)

Vasco Duarte's 2012-2026 body of work makes a falsifiable empirical claim: for teams with 6+ months of cycle-time data, historical throughput (items completed per sprint/week) predicts future delivery more accurately than story-point velocity. The mechanism is the outside view applied at the item level rather than the size level.

The central empirical finding (2025 interview, Maria Chec): "We looked at real team data: 3-point stories taking anywhere from a day to 100+ days. Replacing all story point values with '1' only changed the forecast by 8%." See `research/external/01-noestimates.md`.

This means: story-point precision (distinguishing 3-point from 5-point stories) accounts for approximately 8% of forecast accuracy. The other 92% comes from throughput: how many items the team finishes per time unit. This is the statistical justification for NoEstimates.

### The Nokia case study

Vasco Duarte at Nokia: tracked system-level throughput across 500 people on 100 teams. Six months into a 12-month program, throughput data showed the project would be at least 6 months late. He reported this. The PM emailed all 100 teams asking if they'd finish on time. All 100 said yes. The project was cancelled at 18 months. The throughput signal was correct; the team consensus was the commitment trap at scale. See `research/external/01-noestimates.md`.

## What NoEstimates is NOT

A persistent misconception: NoEstimates means "no planning." It does not.

NoEstimates means:
- Replace story-point estimates with throughput-based forecasting
- Use cycle-time history (items/sprint) to generate probabilistic delivery dates
- Communicate uncertainty explicitly (P50/P85/P95 ranges) rather than point estimates
- Treat the backlog as a count, not a points total

NoEstimates still requires:
- Backlog decomposition (items need to be roughly similar in size: splitting large items is still necessary)
- Cycle-time data collection (Jira/Linear "lead time" or "cycle time" reports)
- Honest communication about confidence levels

## Prerequisites (non-negotiable)

Do NOT recommend NoEstimates to a team without:

1. **6+ months of cycle-time data** for a stable team working on stable work types. Less history produces wide uncertainty bands that look like "no forecast."
2. **Item-size discipline**: items in the backlog should be decomposed to roughly comparable sizes (1-3 days ideally). If items range from 1 hour to 6 months, throughput sampling is meaningless.
3. **Organizational willingness to receive probabilistic forecasts**: if the organization will only accept point-estimate commitments ("done by March 15"), #NoEstimates will fail politically before it fails technically. Address Category 4 dysfunction first.

## The evidence gap (honest disclosure)

No peer-reviewed randomized controlled trial comparing #NoEstimates teams to estimation teams has been published as of 2026. The evidence base is:

- Retrospective case studies (Nokia, F-Secure, Avira)
- The "story points → 1" empirical finding (single dataset, Maria Chec / Duarte)
- Practitioner surveys (limited statistical power)

stinger-forge note from `research/research-summary.md`: "stinger-forge should acknowledge this gap in `guides/03-noestimates.md` and present #NoEstimates as 'evidence-based practice' not 'scientifically proven superiority.'"

Present #NoEstimates as a well-reasoned, empirically-supported alternative with strong practitioner evidence, not as a scientifically proven superior method.

## Throughput-based forecasting in practice

When a team is ready to try NoEstimates:

1. **Export cycle-time data.** From Jira: `Time in Status` report → filter for "In Progress → Done" transitions. From Linear: `Cycle Time` analytics. Aim for 20-30+ completed items minimum.

2. **Calculate throughput distribution.** Count items completed per week/sprint for the last 20+ time periods. You will see a distribution, not a fixed number. This variance is real. Do not smooth it.

3. **Count the backlog.** How many similar-sized items remain? Include a scope creep factor (typically 1.15x-1.3x based on the team's historical scope growth).

4. **Run a Monte Carlo simulation.** Use the throughput distribution + backlog count as inputs. See `guides/04-monte-carlo.md`.

5. **Report P50/P85/P95.** "We'll finish 70% of the time by March 15 (P50), 85% of the time by April 2 (P85), and 95% of the time by April 28 (P95)."

## The Ron Jeffries critique

Ron Jeffries (XP originator and co-creator of Planning Poker) has written critically about story points but from a different angle: he argues that the decay of story points into political gaming is a symptom of dysfunctional management, not a reason to abandon estimation entirely. His position is closer to "fix the culture" than "use NoEstimates."

Note from `research/research-summary.md`: Ron Jeffries's canonical critique essay at ronjeffries.com was not retrieved in this research pass. The balanced guide should acknowledge his position from secondary sources and flag that his original essays are the authoritative source.

## When to recommend NoEstimates

Recommend NoEstimates when ALL of:
- Team has 6+ months of cycle-time data
- Organizational culture can accept probabilistic forecasts
- Story-point velocity has decayed (Category 3 dysfunction)
- The team is ready for the discipline of small, consistently-sized items

When to recommend NOT (yet):

- New team with no history
- Highly variable work types (services + features + infrastructure in one team)
- Organization that will contractualize P50 as a commitment

---

*Cited research: `research/external/01-noestimates.md`, `research/external/02-story-points-fibonacci.md`*
*Example: `examples/monte-carlo-forecast.md` (shows what throughput forecasting produces)*
