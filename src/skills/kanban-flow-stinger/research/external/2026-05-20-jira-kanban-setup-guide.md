---
title: "How to Set Up a Kanban Board in Jira: April 2026 Guide"
source_url: https://hamsterstack.com/how-to/jira/set-up-kanban-board/
source_type: practitioner-blog
authority: medium
relevance: high
date_retrieved: 2026-05-20
topics:
  - jira
  - board-design
  - tool-implementation
  - wip-limits
  - swimlanes
stinger: kanban-flow-stinger
---

# How to Set Up a Kanban Board in Jira (April 2026 Guide)

**Source:** HamsterStack: "How to set up Kanban board on Jira [April 2026 Guide]"
**URL:** https://hamsterstack.com/how-to/jira/set-up-kanban-board/
**Published:** April 2026 (exact date not available)

## Summary

Step-by-step Jira Kanban board configuration guide from April 2026. This complements the DEV Community source (honest WIP limit review) with detailed configuration instructions: it is the "how to configure" companion to the "here are the gotchas" article.

**Complete setup sequence for Jira Kanban:**
1. Navigate to project → Boards → Create board → Choose "Create a Kanban board"
2. Configure board settings: name, project filter (JQL), issue types to include
3. Customize columns: Board Settings → Columns → add/rename/remove columns; map workflow statuses to columns
4. Set WIP limits: In the Columns section → enter a number in "Maximum issues" field per column
5. Configure swimlanes (optional): Board Settings → Swimlanes → group by Assignee, Priority, Epic, or custom JQL
6. Set up quick filters: Board Settings → Quick filters → add JQL-based filters (e.g., `assignee = currentUser()`)

**WIP limits configuration detail:**
- Navigate: Board Settings → Columns → Maximum issues field per column
- Recommended starting values: 2-3 items per person per column, then adjust based on workflow data
- Key limitation: WIP limits ONLY apply to columns mapped to "In Progress" category statuses. If a column is not mapped to an "In Progress" status, WIP limits will not work there.

**Common issues and fixes:**
- "WIP limits not working or showing" → Go to Board Settings → Columns and ensure columns are properly mapped to workflow statuses, then re-enter WIP limit values.
- Issues missing from board → Modify the board filter JQL to include your project key.

**Column status mapping:** This is the most commonly misconfigured part of Jira Kanban boards. Every column must be mapped to one or more workflow statuses. A column that is not mapped correctly will not enforce WIP limits and will not show issues in the correct state.

## Key quotations / statistics

- "WIP limits only apply to columns mapped to In Progress category statuses."
- "Start with conservative WIP limits (2-3 items per person per column) and adjust based on your team's capacity and workflow."
- Configuration path: "Board Settings → Columns → enter a number in the Maximum issues field."

## Annotations for stinger-forge

- **Supports** `guides/08-tool-implementation.md` (Jira section): provides the exact navigation path for WIP limit configuration in Jira as of April 2026. The column-to-status mapping requirement is a critical prerequisite that many teams miss.
- The "2-3 items per person per column" starting heuristic is a simpler entry point than team-size-plus-one for teams new to Jira Kanban configuration. Stinger-forge can offer both options in the guide.
- The JQL-based quick filters section is useful for the class-of-service swimlane setup guide (`guides/06-class-of-service.md`): teams can create swimlanes per service tier using JQL.
