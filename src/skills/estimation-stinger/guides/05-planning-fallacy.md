# Planning Fallacy: Why Estimates Are Systematically Wrong

Understanding the planning fallacy is the prerequisite for every estimation advisory. Teams that understand the cognitive root cause accept data-driven alternatives; teams that think they just need "better estimators" repeat the cycle.

## Origin: Kahneman and Tversky (1979)

The planning fallacy was first described by Daniel Kahneman and Amos Tversky: the universal human tendency to underestimate the time, costs, and risks of future actions while overestimating their benefits. The critical property: this bias persists even in people who have direct, first-hand experience of their own past tasks taking longer than expected.

The planning fallacy is not a learning problem. Developers who have been 2x over-estimate for 10 years are just as likely to be 2x over-estimate on year 11. This is because the mechanism is cognitive, not informational: the "inside view" is baked into how humans plan.

## The inside view vs. the outside view

**Inside view (default human mode):** The developer imagines the specific task. They visualize writing the core logic, see it working, and estimate based on that narrative. The inside view systematically excludes: edge cases, testing, code review cycles, dependency failures, interruptions, documentation, deployment, and unexpected complexity.

**Outside view (Kahneman's remedy):** Instead of imagining how the task will unfold, look at how similar tasks actually unfolded in the past. "How long did our last 10 stories of similar complexity take?" This is the intellectual ancestor of Monte Carlo simulation and the #NoEstimates throughput approach.

Prescriptive tool: when an estimate feels confident, ask: "What's the reference class? How long did the last 5 stories like this actually take?" If the answer is unknown, the estimate is inside-view only.

## The software evidence base

From `research/external/04-planning-fallacy.md`:

| Statistic | Source |
|---|---|
| Only ~30% of software projects completed on time and on budget | Standish Group CHAOS Reports |
| Average cost overrun 27%; 1 in 6 projects > 200% overrun | Bent Flyvbjerg |
| Initial estimates typically off by 2x-4x | Steve McConnell |
| Requirements failures drive ~78% of project failures | Multiple sources |
| Technical debt silently drains ~33% of organizational productivity | The Serious CTO, Dec 2025 |

These numbers are consistent across 20+ years of software project research. The implication: the problem is structural and cognitive, not individual. You cannot hire your way to accurate estimation.

## The five root causes (operational taxonomy)

1. **Planning fallacy / optimism bias**: happy path thinking; underestimating risks and interruptions.
2. **Anchoring bias**: imposed deadlines cause estimates to be adjusted toward the target rather than toward reality.
3. **Strategic misrepresentation** (Flyvbjerg): organizational incentives reward underestimating to gain executive approval. Political pressure compounds cognitive bias.
4. **Linear velocity extrapolation**: story-point velocity varies by work type; projecting a single velocity number across 20 sprints ignores variance.
5. **Single-expert anchoring**: one expert's estimate becomes the anchor for the whole team; divergent opinions are suppressed.

## The Cone of Uncertainty

The Cone of Uncertainty (Barry Boehm, widely used) visualizes that estimate variance is a function of project phase:

- At project start: ±4x variance (high uncertainty)
- After requirements: variance narrows
- After design: narrows further
- After prototyping: further
- At completion: zero uncertainty (known)

Practical implication: early roadmap estimates should always be presented as ranges (T-shirt sizes or confidence intervals), never as point commitments. The cone is the honest answer to "why can't you tell me how long it will take?": you can tell them a range, and you can narrow it over time as uncertainty resolves.

## Reference class forecasting: Flyvbjerg's remedy

Bent Flyvbjerg (megaprojects researcher): the systematic remedy for the planning fallacy is "reference class forecasting": base predictions on the outcomes of a reference class of similar projects or tasks, not on the internal narrative of the current project.

For software teams:
1. Define the reference class: "stories estimated at 3 points, completed in the last 6 months."
2. Pull the actual cycle-time distribution for that reference class.
3. Use that distribution (not the story-level estimate) as the forecasting input.

This is exactly what Monte Carlo simulation does when fed cycle-time data rather than task estimates.

Note from `research/research-summary.md`: Bent Flyvbjerg's reference class forecasting methodology was not fully retrieved in primary form. The above is from secondary sources. For a full treatment, see Flyvbjerg's "Survival of the Unfittest" (2009) and his megaprojects database.

## Practical remedies for teams without Monte Carlo history

1. **Multiply by two**: If the team is consistently 2x off, explicitly multiply estimates by 2 as a calibration factor. It feels wrong; it is more accurate.
2. **Pre-mortem**: Before committing to an estimate, imagine it is 6 months later and the project failed. What caused it? This surfaces risks the inside view missed.
3. **Three-point estimation (PERT)**: Require an Optimistic, Most Likely, and Pessimistic estimate. This makes uncertainty visible and prevents the Most Likely estimate from being treated as a guarantee.
4. **Planning session retrospective**: Track estimate accuracy (story points estimated vs. actual cycle time) and review quarterly. Teams that see their own data break the "we're different" illusion.

---

*Cited research: `research/external/04-planning-fallacy.md`*
*See also: `guides/04-monte-carlo.md` (the data-driven remedy), `guides/03-noestimates.md` (the NoEstimates alternative)*
