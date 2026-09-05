# 07. Kanban vs Scrum: Decision Framework and Migration Path

*Sources: `research/external/2026-05-20-kanban-vs-scrum-decision-eitt.md`; `research/external/2026-05-20-kanban-vs-scrum-atlassian.md`*

---

## 2026 adoption context

From `research/external/2026-05-20-kanban-vs-scrum-decision-eitt.md`, State of Agile Report 2026:

- 94% of IT teams use some form of Agile
- Scrum: 70% adoption
- Kanban: 25% adoption
- **45% of Scrum teams migrate to a Scrumban hybrid after 2-3 years**; the most significant data point for this decision: most teams eventually blend the two methods

This means "Kanban vs Scrum" is often the wrong framing. The real question is: where on the Scrum-Kanban spectrum should this team sit?

---

## The three-path decision framework

From `research/external/2026-05-20-kanban-vs-scrum-decision-eitt.md`:

### Path 1: Scrum (Sprint-based)

**Choose Scrum when:**
- The team is new to Agile (Scrum's ceremonies build the habits first)
- Work type is predominantly feature development with relatively stable scope
- Stakeholders need predictable release cadence (sprint reviews align expectations)
- The team benefits from explicit retrospectives and ceremonies to build culture
- Planning horizon is 1-4 weeks

**Signs Scrum is struggling:**
- Sprint planning regularly over-commits and items carry over to the next sprint
- Retrospectives are skipped or perfunctory
- The team feels "sprint overhead" is too high for the work type

### Path 2: Kanban (Continuous flow)

**Choose Kanban when:**
- Work type is predominantly operational (support tickets, bug fixes, maintenance)
- Work arrives continuously and unpredictably (can't meaningfully batch into sprints)
- The team has already internalized Agile habits and wants to optimize flow
- Speed of individual items matters more than batch predictability
- Planning horizon is indefinite (pull when ready)

**Signs Kanban is a good fit:**
- Current backlog always has clearly prioritized ready items
- Team can articulate their WIP and throughput without being asked
- Stakeholders care more about individual item lead time than sprint velocity

### Path 3: Scrumban (Hybrid)

**Choose Scrumban when:**
- The team does features AND operations (mixed work types)
- The team wants sprint-level stakeholder communication rhythms but needs pull-system flow for the actual work
- Transitioning from Scrum to Kanban incrementally
- Building a new product (Scrum planning rhythm) while maintaining a live system (Kanban operational flow)

**The 45% migration path:** most teams start with Scrum, find that sprints create artificial urgency and batch planning overhead after the product is live, and evolve to Scrumban by keeping sprint-level cadences (demos, retrospectives) while replacing sprint backlogs with a continuous Kanban board.

---

## A note on Shape Up (Basecamp method)

> TODO: No formal 2025-2026 comparison of Kanban vs Shape Up was found in the research window. Source: `research/research-summary.md` Q3.

From first principles: Shape Up uses 6-week appetite-based cycles with explicit no-estimates and a "cool-down" period between cycles. It is closer to a modified Scrum with a different planning rhythm than to Kanban. Key distinctions:

| Dimension | Kanban | Shape Up |
|---|---|---|
| Work unit | Continuous pull | 6-week shaped batches |
| WIP discipline | Explicit WIP limits | Appetite limits (time-boxed) |
| Estimation | No estimation; use throughput | No estimation; use appetite |
| Planning horizon | Indefinite (pull as ready) | 6-week fixed cycles |
| Best for | Operations, maintenance, mature product | Product development with high design complexity |

Shape Up is not a formal competitor to Kanban; they are designed for different contexts. A team can use Kanban for operational work and Shape Up for strategic product cycles: the two can coexist.

---

## Migration timeline from Scrum to Kanban

From `research/external/2026-05-20-kanban-vs-scrum-decision-eitt.md`:

| Week | Action |
|---|---|
| 1-2 | Visualize current workflow on a board without changing anything |
| 3-4 | Add WIP limits (Method 3: current WIP minus one). Keep sprint cadence. |
| 5-8 | Replace sprint backlog with continuous input queue. Keep sprint demos and retrospectives. |
| 9-12 | Switch from sprint planning to replenishment meetings triggered by capacity signals. |
| 13+ | Drop sprint timebox. Operate on fully continuous flow. |

This is the Scrumban evolution path. The sprint ceremonies are kept until the team no longer needs them for stakeholder alignment, then dropped. Do not drop them prematurely; they serve real coordination needs.

---

## The sprint-vs-flow coaching conversation

When a Scrum team asks "should we switch to Kanban?", the productive reframe is:

> "What specific problem are you trying to solve? Sprint carryover? Unpredictable delivery? Context switching? Let's look at your flow metrics first. The method change may or may not solve the actual problem."

Often the answer is: improve WIP discipline within the current method first, then reassess whether the method itself needs to change. A Scrum team with implicit WIP discipline and good throughput data is already doing Kanban in spirit.
