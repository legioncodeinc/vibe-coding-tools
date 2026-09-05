# 03. Little's Law: Diagnostics and Forecasting

*Sources: `research/external/2026-05-20-littles-law-abstract-algorithms.md`; `research/external/2026-05-20-littles-law-agile-application.md`*

---

## The formal statement

Little's Law (John D.C. Little, 1961):

> **L = λ × W**

Where:
- **L** = average number of items in the system (WIP)
- **λ** (lambda) = average throughput (items per unit time)
- **W** = average cycle time (time an item spends in the system)

In software delivery terms: **WIP = Throughput × Cycle Time**

Source: `research/external/2026-05-20-littles-law-abstract-algorithms.md`

---

## The three rearrangements (diagnostic dials)

Each rearrangement answers a different question:

| Rearrangement | Form | Question answered |
|---|---|---|
| Classic | L = λ × W | "Given our throughput and cycle time, what WIP are we committing to?" |
| Cycle time solver | W = L / λ | "Given our current WIP and throughput, what is our predicted cycle time?" |
| WIP limit setter | L = λ × W_target | "To achieve a target cycle time W, what WIP limit do we need?" |

**The WIP limit setter is the most actionable form for Kanban practitioners.** It directly answers "what WIP limit do I need?" from the data the team already has.

### Worked example (from `research/external/2026-05-20-littles-law-agile-application.md`)

> Team throughput: 8 items/week. Current WIP: 20 items. Current cycle time: 20/8 = 2.5 weeks.
> Target cycle time: 1 week.
> Required WIP limit: L = 8 × 1 = 8 items.
> The team needs to reduce WIP from 20 to 8 to halve cycle time, without changing throughput.

---

## The cascade effect

From `research/external/2026-05-20-littles-law-abstract-algorithms.md`:

When large or slow-moving items stay in the system, they inflate L without contributing to λ. This creates the cascade effect:

1. One large item sits in "In Progress" for 3 weeks.
2. WIP count rises.
3. Little's Law predicts longer cycle times for all other items.
4. The team sees slowdowns across the board and attributes it to "being busy."
5. The real cause is one blocker holding the WIP count high.

**Diagnostic test:** Is the WIP count high because there are many items, or because a few items are old and stuck? Sort your board by age. If the oldest 20% of items account for 60%+ of WIP, you have a cascade problem, not a capacity problem.

---

## Steady-state requirement: when NOT to apply

Little's Law requires steady state: the arrival rate, throughput, and WIP must be stable over the measurement window. From `research/external/2026-05-20-littles-law-abstract-algorithms.md`:

**Do NOT apply Little's Law when:**

- More than 20% of current WIP is blocked (the effective throughput is lower than the measured throughput).
- An expedite lane is active and contains 2+ items (expedite items bypass normal flow, distorting both λ and L).
- WIP has been deliberately reduced in the past 2 weeks (a non-equilibrium transition).
- The team size has changed in the past 4 weeks.
- Holiday periods or significant context switches have occurred.

**Safety factor:** Apply a 1.5-2× safety factor to WIP-limit-setter calculations to account for real-world variance. L_limit = λ × W_target × 1.5.

---

## Monte Carlo forecasting note

Monte Carlo simulation uses throughput history to probabilistically forecast how many items a team can complete in N weeks, or how long N items will take.

Tools: ActionableAgile Analytics (https://actionableagile.com/), Troy Magennis FocusedObjective Resources (https://github.com/FocusedObjective/FocusedObjective.Resources).

**Small team caveat:** With fewer than 15-20 historical data points, Monte Carlo results have wide confidence intervals. The simulation is still useful (it is more honest than planning-poker estimates), but present ranges rather than point forecasts to stakeholders.

> TODO: Daniel Vacanti / ActionableAgile has not published 2025-2026 guidance specific to sub-5-person teams. Until resolved, recommend using the tools above with explicit confidence-interval reporting and caution stakeholders about the small-sample caveat.

---

## Little's Law applied to a CI/CD pipeline

From `research/external/2026-05-20-littles-law-abstract-algorithms.md`, the law applies to any queued system, including automated pipelines:

| System | L (WIP) | λ (throughput) | W (cycle time) |
|---|---|---|---|
| Software delivery board | Items in flight | Items/week | Days from start to done |
| Code review queue | PRs open | PRs merged/day | Hours PR is open |
| CI pipeline | Builds running | Builds/hour | Build duration |
| Deployment queue | Deploys queued | Deploys/day | Deploy lead time |

When `devops-worker-bee` is diagnosing a slow CI pipeline, this table provides the handoff framing: the diagnosis is the same (reduce WIP / queue depth to reduce cycle time), the implementation is `devops-worker-bee`'s domain.

---

## Forecast table template

See `templates/littles-law-forecast.md` for the WIP-scenario forecast table stub.

---

*Example: `examples/wip-limit-setup-happy-path.md`: includes a Little's Law calculation in the WIP limit derivation step*
