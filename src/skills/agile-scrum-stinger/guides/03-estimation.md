# 03. Estimation

Estimation is one of the most debated topics in Scrum, and the debate is productive: different techniques suit different teams. This guide covers the four main approaches, when each fits, coaching on calibration, and the velocity gaming anti-pattern.

**Important:** The Scrum Guide 2020 does not mention story points, velocity, or Fibonacci. Estimation is a community practice, not a Scrum requirement. Teams that do not use story points are not violating Scrum.

---

## Fibonacci Story Points

### What it is
Relative sizing using the Fibonacci sequence (1, 2, 3, 5, 8, 13, 21, 34, 55, 89, ∞). Numbers represent relative effort/complexity, not hours. The gaps between higher numbers acknowledge increasing uncertainty.

### How to calibrate
1. Select a "reference story": the smallest recently completed story the whole team remembers
2. Assign it a value of 2 (or 3, or 5, the anchor point)
3. Size new items relative to the reference: "Is this bigger or smaller than the reference? How much bigger?"
4. After 3-4 sprints, calculate team velocity (story points completed per Sprint)
5. Use velocity to forecast: "At 30 points per sprint, we'll complete the 120-point backlog in ~4 Sprints"

### Fibonacci calibration reference table (community practice)

| Points | Meaning | Examples |
|---|---|---|
| 1 | Trivial; team knows exactly how to do it | Fix a typo in UI copy |
| 2 | Small; low complexity, no unknowns | Add a field to an existing form |
| 3 | Medium-small; some complexity | Wire a new API endpoint with basic validation |
| 5 | Medium; moderate complexity or one unknown | Implement paginated list with server-side filtering |
| 8 | Large; significant complexity or multiple unknowns | Build a new feature end-to-end with new DB schema |
| 13 | Very large; needs splitting | Full authentication flow with OAuth |
| 21+ | Too large; must split before sprint | "Redesign the checkout experience" |

### Planning Poker protocol
1. PO reads the story and answers clarifying questions
2. Each Developer secretly selects a card (Fibonacci number)
3. All reveal simultaneously
4. Discuss the highest and lowest estimate only
5. Re-vote until consensus or until team accepts an average

### When Fibonacci fits
- Teams that need velocity-based forecasting
- Teams with variable story sizes that benefit from relative comparison
- Retrospective process improvement: "why are our 8-point stories taking 3x longer than 3-point stories?"

---

## Planning Poker

Planning Poker is the facilitation ritual for Fibonacci estimation: they are the same technique with different packaging. Planning Poker decks typically include: 0, 1, 2, 3, 5, 8, 13, 20, 40, 100, ∞ (and sometimes a ☕ card for "let's take a break").

The simultaneous reveal is the critical protocol. It prevents anchoring bias (the first person to speak influences everyone else).

---

## T-Shirt Sizing

### What it is
Relative sizing using XS, S, M, L, XL, XXL. Useful for roadmap-level estimation where precision is not the goal.

### When T-shirt sizing fits
- Early-stage backlog grooming before stories are well-defined
- Roadmap estimation ("roughly how big is the 'new reporting module' epic?")
- Stakeholder conversations where Fibonacci numbers cause confusion
- Teams that want to avoid the false precision of story points

### T-shirt sizing to story point mapping (community practice, not normative)

| T-shirt | Fibonacci |
|---|---|
| XS | 1-2 |
| S | 3 |
| M | 5 |
| L | 8 |
| XL | 13 |
| XXL | 21+ (split the story) |

---

## #NoEstimates

### What it is
A movement arguing that story-point estimation creates overhead and false precision without improving predictability. Instead, teams track throughput (number of items completed per Sprint) and use probabilistic forecasting based on historical cycle time.

### The case for #NoEstimates
- Teams often spend more time estimating than the estimate is worth
- Velocity is easy to game (inflate estimates, hit "velocity targets")
- Throughput-based forecasting (using historical data) often predicts better than story points
- Removes the perverse incentive to estimate conservatively to "hit velocity"

### The case against
- Teams without historical data have no baseline for throughput forecasting
- T-shirt sizing (a lightweight estimation form) is often still needed for roadmapping
- Some organizations require story points for reporting; #NoEstimates is impractical without organizational buy-in

### When #NoEstimates fits
- Teams with 6+ months of throughput history
- Teams whose estimates are consistently wrong (signal: plan 30 points, complete 30 points but stories are half-done)
- Teams where velocity gaming has destroyed trust in estimates
- Mature Kanban teams who have already moved beyond Scrum's sprint model

### Implementation
Track: items started per Sprint, items completed per Sprint, average cycle time per item size category. Use Monte Carlo simulation for delivery forecasting.

---

## Velocity gaming: the anti-pattern catalog

Velocity gaming occurs when teams optimize for the velocity metric rather than for delivering value. Signs:

| Anti-pattern | Signal | Repair |
|---|---|---|
| Estimate inflation | Story points gradually increase without stories getting harder | Zero-base estimation periodically; compare current to historical reference stories |
| Sprint-end rush | Stories that were "almost done" are suddenly "done" in the last 2 hours | Check DoD compliance; "done" means DoD met, not "we said so" |
| Carry-over avoidance | Undone stories "moved to Done" to avoid carry-over | SM must record actual completion dates; carry-over is not a failure, gaming is |
| Velocity as KPI | Management tracks velocity and celebrates increases | Educate: velocity is a planning tool, not a performance metric; compare team to itself only |
| Story splitting to hit targets | 13-point story split into three 5-point stories with no new clarity | Splits must add information (clearer AC, smaller scope), not just lower numbers |

**Core principle:** velocity is a capacity planning tool. It tells the team how much to take on next Sprint. It is not a performance indicator and should not be compared across teams.

---

## Estimation decision matrix

| Team situation | Recommended approach |
|---|---|
| New team, no history | Fibonacci + Planning Poker; build 3-sprint velocity baseline |
| Mature team, reliable velocity | Continue Fibonacci or trial #NoEstimates with throughput data |
| Roadmap/epic sizing | T-shirt sizing |
| Support/maintenance team | #NoEstimates + cycle-time tracking (most work is small and homogeneous) |
| Team where estimates are consistently gamed | Trial #NoEstimates; remove the metric that is being gamed |
| Organization requires story points for reporting | Fibonacci, but educate management on velocity's limits |
