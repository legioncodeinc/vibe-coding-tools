---
title: "Atlassian: Working with WIP Limits for Kanban (Updated 2025)"
source_url: https://www.atlassian.com/agile/kanban/wip-limits
source_type: official-docs
authority: high
relevance: critical
date_retrieved: 2026-05-20
topics:
  - wip-limits
  - jira
  - wip-enforcement
  - kanban-method
  - bottleneck-detection
stinger: kanban-flow-stinger
---

# Atlassian: Working with WIP Limits for Kanban

**Source:** Atlassian: "Working with WIP limits for kanban"
**URL:** https://www.atlassian.com/agile/kanban/wip-limits
**Published:** 2025-11-21

## Summary

Atlassian's canonical reference guide on WIP limits, updated November 2025. This is the most recently-updated official source in the research run. It covers WIP limit rationale, team adoption guidance, goals for healthy WIP limit practice, and the key behavioral shift teams need to make.

**Core rationale statement:** "WIP limits improve throughput and reduce the amount of work 'nearly done', by forcing the team to focus on a smaller set of tasks. At a fundamental level, WIP limits encourage a culture of 'done.'"

**Bottleneck visibility:** "WIP limits make blockers and bottlenecks visible. Teams can swarm around blocking issues to get them understood, implemented, and resolved when there is a clear indicator of what existing work is causing a bottleneck."

**Recommended setup approach for teams new to WIP limits:**
1. Monitor average number of work items in each status for a few sprints
2. Set WIP limits based on observed averages (not guesses)
3. Resist the temptation to raise a WIP limit just because the team keeps hitting it: that opportunity is a signal to increase capacity or efficiency, not to raise the limit

**The "in progress" column WIP reasoning:** "As a best practice, some teams set the maximum WIP limit below the number of team members. The idea is to bake in room for good agile practices. If a developer finishes an item, but the team is already at their WIP limit, they know it's time to knock out a few code reviews or join another developer for some pair programming."

**Four goals for healthy WIP practice:**
1. Size individual tasks consistently (no task > 16 hours): prevents big items from clogging the pipeline
2. Map WIP limits to the team's skills: if specialists exist, create specialist-specific columns and WIP limits
3. Reduce idleness: when a team member has downtime, encourage them to help upstream/downstream
4. Protect sustainable engineering culture: WIP limits do not mean rushing; they support solid practices

**On psychological resistance:** "For teams new to WIP limits, they will feel awkward. Take the time to discuss them in the first few iterations." This validates the worker-bee's coaching role: the resistance is predictable and manageable with the right framing.

## Key quotations / statistics

- "WIP limits improve throughput and reduce the amount of work 'nearly done'."
- "At a fundamental level, WIP limits encourage a culture of 'done.'"
- "WIP limits make blockers and bottlenecks visible."
- "Resist the temptation to raise a WIP limit just because the team keeps hitting it."
- "Set WIP limits after monitoring the average number of work items in each status for a few sprints."

## Annotations for stinger-forge

- **Critical** for `guides/01-wip-limits.md`: the four goals (task sizing, skills mapping, idleness reduction, culture protection) are a clean framework for the "WIP limit health" section of the guide. The "culture of done" framing is the best one-sentence description of why WIP limits matter.
- The specialist column advice (create specialist-specific WIP columns) addresses the real-world scenario where not all engineers are interchangeable: common in teams with a dedicated security or platform engineer.
- The "monitor before setting" advice (observe averages for a few sprints, then set limits) is the Atlassian-endorsed approach and should be positioned as the recommended default in `guides/01-wip-limits.md`, alongside the "current WIP minus one" quickstart heuristic from the Agile Flow Consulting source.
