---
title: "Kanban vs Scrum: Atlassian Official Comparison 2026"
source_url: https://www.atlassian.com/agile/kanban/kanban-vs-scrum
source_type: official-docs
authority: high
relevance: high
date_retrieved: 2026-05-20
topics:
  - kanban-vs-scrum
  - wip-limits
  - tool-configuration
  - jira
  - cycle-time
  - lead-time
stinger: kanban-flow-stinger
---

# Kanban vs Scrum: Atlassian Official Comparison

**Source:** Atlassian: "Kanban vs Scrum"
**URL:** https://www.atlassian.com/agile/kanban/kanban-vs-scrum
**Published:** 2026-02-11

## Summary

Atlassian's official Kanban vs. Scrum comparison page, updated in February 2026. As the maker of Jira (the dominant enterprise Kanban/Scrum tool), this source carries both practitioner authority and direct tool context. The page is notable for what it explicitly says about Jira's Team-managed boards allowing teams to mix Scrum and Kanban.

**Core framing:** Kanban is "all about visualizing your work, limiting work in progress, and maximizing efficiency (or flow)." Scrum teams "commit to completing an increment of work... through set intervals called sprints." The distinction is not "which is better" but which matches the team's work pattern.

**Cycle time / lead time treatment:** Atlassian explicitly names cycle time and lead time as the primary Kanban metrics: "Lead time and cycle time are important metrics for kanban teams. The deal with the average amount of time that it takes for a task to move from start to finish. Improving cycle times indicates the success of kanban teams."

**WIP limits in Jira:** "Another way to deal with bottlenecks is through Work In Progress (WIP) limits. A WIP limit caps the number of cards that can be in any one column at one time. When you reach your WIP limit, a tool like Jira caps that column, and the team swarms on those items to move them forward." The article thus positions WIP limit enforcement as a Jira board feature: important for the worker-bee's tool-configuration guides.

**Flexibility and workflow change:** "A kanban workflow can change at any time. New work items can get added to the backlog and existing cards can get blocked or removed based on prioritization." This supports the worker-bee's framing of Kanban as the right method for interrupt-heavy teams.

**Jira's Team-managed spaces:** Teams can "progressively layer on more and more powerful features" rather than committing to one framework on day one. Boards can evolve from simple Kanban to incorporate Scrum elements (or vice versa) without a replatforming event.

**Atlassian's position on Jira WIP limits:** The article confirms Jira does enforce WIP limits in the Kanban board view: it is not just a visual indicator. This is significant because one practitioner blog (DevTo) claims Jira WIP limits are "technically there but a scavenger hunt" and work oddly with swimlanes. Both can be true: Jira has WIP limit enforcement, but its swimlane behavior is non-obvious.

## Key quotations / statistics

- "Lead time and cycle time are important metrics for kanban teams... Improving cycle times indicates the success of kanban teams."
- "When you reach your WIP limit, a tool like Jira caps that column, and the team swarms on those items to move them forward."
- "Team-managed spaces allow you to progressively layer on more and more powerful features."
- "A kanban workflow can change at any time."

## Annotations for stinger-forge

- **Supports** `guides/08-tool-implementation.md` (Jira section): the official Atlassian confirmation that Jira enforces WIP limits in the board view is authoritative. Stinger-forge should use this alongside the DEV Community source (which covers the swimlane WIP count bug) for a complete, honest Jira WIP limits section.
- **Supports** `guides/07-kanban-vs-scrum.md`: Atlassian's "progressively layer on features" message validates the worker-bee's coaching approach: teams don't need to choose definitively upfront.
- The "swarming" behavior description (team gathers around blocked column) maps directly to the worker-bee's WIP limit violation response protocol.
