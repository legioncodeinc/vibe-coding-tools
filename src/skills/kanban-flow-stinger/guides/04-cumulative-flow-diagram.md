# 04. Cumulative Flow Diagram: Reading Shapes and Spotting Anti-Patterns

*Sources: `research/external/2026-05-20-flow-metrics-definitions-cylenivo.md`; `research/external/2026-05-20-value-stream-metrics-axify.md`; `research/internal/command-brief-summary.md`*

---

## What the CFD shows

A Cumulative Flow Diagram (CFD) plots the count of items in each workflow stage over time. The x-axis is time; the y-axis is item count. Each stage is a colored band. The vertical distance between two adjacent stage bands at any point in time is the WIP in that stage. The horizontal distance between the entry of a stage and its exit is the cycle time for that stage.

A healthy CFD has:
- Bands of roughly constant width (stable WIP per stage)
- A steady upward slope (consistent throughput)
- No flat spots or sudden expansions

---

## The seven canonical anti-pattern shapes

These shapes and their diagnoses are sourced from Vacanti's *Actionable Agile Metrics* framework (the canonical CFD anti-pattern catalog). They are referenced in `research/internal/command-brief-summary.md` and partially corroborated by `research/external/2026-05-20-flow-metrics-definitions-cylenivo.md`.

| Shape name | What it looks like | What it means |
|---|---|---|
| **1. Step** | A band suddenly steps up vertically | A large batch of items entered a stage at once: a batch push, not a pull system |
| **2. Staircase** | A band grows in discrete steps rather than a smooth slope | Work is released in batches (sprints pushing items) rather than continuous flow |
| **3. Reverse staircase** | A band suddenly drops vertically | A large batch was pushed through a stage at once: same root cause as the step, downstream |
| **4. Bow-tie** | A stage band pinches to near-zero in the middle | The stage is a bottleneck; it clears occasionally but then refills: indicates variable capacity or context switching |
| **5. Vertical bands** | Multiple stage bands widen simultaneously | WIP is growing across the system: WIP limits are missing or being ignored |
| **6. Horizontal bands** | A stage band becomes flat (no items exiting) | Throughput has dropped to zero: a blockage, team absence, or blocked pipeline |
| **7. Explosion** | The diagram expands rapidly upward | Demand is outpacing throughput significantly: replenishment meeting is adding more than the system can handle |

---

## Leading vs lagging indicators

The CFD is a **lagging indicator**: it shows what has already happened. But because the bands are continuous, you can see trends forming:

- A **widening band** in one stage means WIP is growing there: a bottleneck is forming.
- A **narrowing band** in one stage while a downstream band widens: the downstream stage is the bottleneck.
- A **flattening upper edge** (items-done line): throughput is dropping.

Compare the CFD to the **cycle-time scatterplot** (each item's start date vs. cycle time plotted as a dot). The scatterplot is more granular; the CFD shows systemic patterns. Use both.

---

## How to generate a CFD from tool data

Most tools do not generate a CFD natively. Methods:

- **Jira:** Use the built-in Control Chart (approximate CFD) or export issue transitions to CSV and plot in Google Sheets / Excel.
- **Linear:** No native CFD. Use a CSV export of cycle time data and build in a spreadsheet.
- **GitHub Projects:** No native CFD. Export via GraphQL and plot externally.
- **ActionableAgile Analytics:** Generates proper CFDs from CSV export of any tool. Recommended for teams that need accurate CFD analysis. (https://actionableagile.com/)

---

## Coaching the CFD conversation

When presenting a CFD to a team for the first time:

1. **Start with the healthy shape.** Show what it should look like. Set expectations.
2. **Ask the team to identify the widest band.** That stage is accumulating WIP. Is it intentional?
3. **Point to the flattest point on the done-items line.** When did throughput drop? What happened that week?
4. **Connect the CFD reading to a WIP limit proposal.** "This band keeps widening: if we set a WIP limit of N here, what would we need to change to honor it?"

The CFD is a conversation starter, not a verdict. Teams that feel judged by the chart become defensive. Teams that feel like they are reading a weather map together become curious.
