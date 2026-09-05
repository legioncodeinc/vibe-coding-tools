# 06. Framework Selection

When to use Scrum, ScrumBan, Kanban, or Shape Up. Data-backed decision framework grounded in State of Agile 2026 research and structured comparison matrices.

---

## State of Agile 2026: baseline data

- **70%** of Agile teams use Scrum or a Scrum variant (eitt.academy survey 2026)
- **25%** primarily use Kanban
- **45%** of Scrum teams adopt WIP limits (a Kanban practice) after 2-3 years: evidence for ScrumBan evolution
- Shape Up adoption is growing but remains a small minority; strongest in product-led companies < 50 engineers

---

## Decision matrix: primary framework selector

Score each dimension 1-3. Sum scores to reach a recommendation.

| Dimension | 1 (Scrum) | 2 (ScrumBan) | 3 (Kanban) |
|---|---|---|---|
| Work predictability | Mostly planned, clear backlogs | Mix of planned and interrupt | Mostly interrupt / support |
| Sprint commitment comfort | Team can commit to fixed scope | Partial commitment is fine | No fixed commitment needed |
| Unplanned work % | < 15% per Sprint | 15-40% per Sprint | > 40% per Sprint |
| Stakeholder cadence | Regular reviews (Sprint Review works) | Irregular / on-demand demos | Continuous delivery to stakeholders |
| Team Scrum experience | New to Agile; needs structure | Experienced with Scrum; wants flow | Mature team; optimizing throughput |

**Scoring guidance:**
- Score 5-8: Recommend Scrum
- Score 9-11: Recommend ScrumBan
- Score 12-15: Recommend Kanban

---

## Scrum

### Best fit for
- Product development teams building iterative features
- Teams that benefit from a regular cadence of planning, review, and retrospection
- Organizations that need Sprint-level predictability for stakeholder reporting
- New teams that need the structure of prescribed roles, events, and artefacts

### Caution signals
- > 30% of Sprint work is unplanned at Sprint start: consider ScrumBan
- PO role cannot be filled with sufficient authority: the framework will not work as designed
- Team size consistently > 10: split the team before Scrum becomes unwieldy

### Sprint length guidance
- **1 week:** Maximum inspect-and-adapt; high ceremony overhead; best for early-stage product with rapid learning
- **2 weeks:** Most common; balances cadence with ceremony overhead
- **3 weeks:** Less common; useful when 2-week Sprints feel rushed for the type of work
- **4 weeks:** Maximum; useful for infrastructure or platform work; risk of delayed feedback

---

## ScrumBan

### What it is
ScrumBan is not a codified framework: it is an evolution pattern where Scrum teams add Kanban's WIP limits and pull-based workflow to their Scrum foundation. Not sanctioned by the Scrum Guide; developed by Corey Ladas (2008) and now widespread in practice.

### Best fit for
- Mature Scrum teams where Sprints feel artificial relative to the actual work flow
- Support/product hybrid teams (planned feature work + interrupt support)
- Teams transitioning away from Scrum toward Kanban without losing all Scrum structure

### ScrumBan migration protocol (6-step)
1. **Keep Sprint cadence** (don't abandon Sprint rhythm immediately)
2. **Add WIP limits** to the Sprint Backlog columns (In Progress: max N items)
3. **Replace sprint commitment** with a replenishment trigger (pull new items when WIP falls below threshold)
4. **Retain Retrospective and Sprint Review**: these improve quality; don't drop them
5. **Measure throughput** alongside velocity for 2-3 Sprints; compare predictive accuracy
6. **Remove Sprint Planning** when the team can reliably self-replenish from the backlog

### Unplanned work threshold
The research-backed trigger: when > 30% of Sprint work was unplanned at Sprint start for 3 consecutive Sprints, recommend ScrumBan evaluation.

---

## Kanban

### Best fit for
- Support, maintenance, incident response, or ops teams
- Teams with highly variable work item sizes (trivial to multi-week)
- Teams where the goal is throughput optimization and predictable cycle time, not Sprint-level delivery
- Teams that have moved beyond Scrum and want a more mature, flow-based model

### Core Kanban practices
1. **Visualize the workflow**: explicit columns with clear start/end criteria
2. **Limit WIP**: hard WIP limits per column
3. **Manage flow**: track cycle time, lead time, throughput
4. **Make policies explicit**: written entry criteria, exit criteria, escalation paths
5. **Implement feedback loops**: Replenishment meeting (what enters the backlog), Delivery cadence (when items exit), Operations review (system health)
6. **Improve collaboratively**: retrospective-equivalent practices (Kanban retrospective focuses on metrics, not feelings)

**Note:** For deep Kanban guidance, route to `kanban-flow-worker-bee`.

---

## Shape Up (Basecamp / 37signals)

### What it is
A product development framework for small, empowered teams. 6-week "cycles" (not sprints), "shaping" work before it is bet on, "cool-down" between cycles, and "betting table" for deciding what gets built.

### Best fit for
- Small product teams (3-8 people) with a strong product manager / founder
- Organizations where the betting table (executive decision on what gets built) can be maintained
- Teams frustrated by backlog-driven Scrum who want ownership of the problem, not the task list
- Products where 6 weeks of uninterrupted work produces meaningful value

### Shape Up key concepts

| Concept | Description |
|---|---|
| Shaping | 6-week pre-work to define appetite (time budget) and rough solution before pitching |
| Betting table | Leadership selects which shaped pitches to bet on for the next cycle |
| Cycle | 6 weeks of uninterrupted delivery work; no additions or check-ins from management |
| Cool-down | 2 weeks after each cycle for cleanup, exploration, and rest |
| No sprint backlog | Teams own the problem; they figure out the solution during the cycle |
| Appetite | Fixed time budget (6 weeks or 2 weeks); scope varies to fit the appetite |

### When Shape Up is a poor fit
- Organizations where leadership cannot commit to hands-off delivery during cycles
- Teams > 10 people (betting table becomes complex)
- Teams where work is continuous support / interrupt-driven (Shape Up assumes predictable, bounded work)
- Organizations that need detailed Sprint-by-Sprint reporting to stakeholders

---

## Multi-framework reality

Most mature teams blend frameworks. The framework selection question is not "pick one forever": it is "what framework gives us the most value today, and where are we likely to evolve?"

Common evolution path:
1. New team: Scrum (structure, ceremony, roles)
2. 1-2 years: Scrum + WIP limits (ScrumBan emergent)
3. 3+ years: Kanban or hybrid (optimize throughput; retain retrospectives and reviews)

Recommend the path, not just the destination.
