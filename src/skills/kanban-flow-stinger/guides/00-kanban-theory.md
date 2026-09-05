# 00. Kanban Theory: Foundations and the Toyota Lineage

*Sources: `research/internal/command-brief-summary.md`; `research/external/2026-05-20-wip-limits-atlassian-official.md`; `research/external/2026-05-20-kanban-vs-scrum-atlassian.md`*

---

## The Toyota origin

Kanban (看板, "visual card" or "signboard") was invented by Taiichi Ohno at Toyota in the 1950s as a pull-signal mechanism inside the Toyota Production System (TPS). The idea: a production station downstream signals upstream when it has capacity to receive more work, rather than upstream pushing work forward regardless of downstream readiness. The physical kanban card was the signal. The insight was profound: **WIP accumulation is waste** (Ohno's seventh muda), and the system should pull work in only when capacity exists to process it.

David J. Anderson formalized the Kanban Method for knowledge work in 2007-2010, publishing *Kanban: Successful Evolutionary Change for Your Technology Business* (2010). Anderson's key translation: software delivery systems are knowledge-work production systems. The same TPS principles (pull over push, WIP limits, make work visible) apply. But software teams need explicit policies, not just physical cards, because work items are abstract.

---

## The four core properties

Anderson's Kanban Method requires four properties before a system can be called Kanban:

1. **Visualize the workflow.** Map the actual steps work goes through (not the idealized process) as columns on a board. Every work item in flight must be visible.
2. **Limit WIP.** Set explicit maximum counts per workflow stage. Without WIP limits, the system is a task list with sticky-note aesthetics, not Kanban.
3. **Manage flow.** Measure and optimize the movement of work through the system. Flow metrics (cycle time, throughput, WIP age) are the instrumentation.
4. **Make policies explicit.** Each column and class of service has documented entry criteria, exit criteria, and escalation rules. Implicit policies create invisible bottlenecks.

---

## The six general practices

Anderson added two further practices that complete the method:

5. **Implement feedback loops.** Kanban uses cadences (replenishment meeting, queue replenishment, operations review, delivery planning) rather than sprints. Cadences are triggered by flow signals, not the calendar.
6. **Improve collaboratively, evolve experimentally.** The method is explicitly evolutionary: change one thing at a time, observe the flow-metric impact, keep or revert. This is the "evolutionary change" in the book's subtitle.

---

## Why WIP limits are the core innovation

A common misunderstanding: teams treat WIP limits as a constraint on productivity ("you can only work on N things at once"). The correct framing from the TPS lineage is that WIP limits are a **flow optimization mechanism**. Little's Law (L = λW) formally shows why:

- If throughput (λ) is constant and WIP (L) increases, cycle time (W) increases proportionally.
- Reducing WIP with constant throughput reduces cycle time.
- **The single most reliable way to reduce cycle time is to reduce WIP.** Not to work faster, not to hire more people.

See `guides/01-wip-limits.md` for implementation and `guides/03-littles-law.md` for the formal proof.

---

## Pull vs push: the key coaching distinction

**Push systems:** work is assigned to people when it arrives (sprints, task assignment, manager-driven allocation). The result: everyone is busy all the time; the work piles up in queues between stages.

**Pull systems:** a person pulls the next highest-priority item only when they have capacity to start AND finish it. WIP limits enforce this mechanically: once a stage is full, the upstream stage cannot push new work in.

When coaching teams, the transition from push to pull is usually the hardest cultural shift. The visual board and explicit WIP limits make the change tangible.

---

## Scope boundary

`kanban-flow-worker-bee` owns the Kanban method. It does NOT own:

- Scrum ceremonies (sprint planning, retrospectives, velocity): no peer Bee today; surface to user.
- CI/CD pipeline flow (deployment throughput, lead time for changes in the DORA sense): `devops-worker-bee`.
- Database schema for storing flow metrics: `db-worker-bee`.
- Building custom Kanban tooling: `react-worker-bee` / `python-worker-bee`.
