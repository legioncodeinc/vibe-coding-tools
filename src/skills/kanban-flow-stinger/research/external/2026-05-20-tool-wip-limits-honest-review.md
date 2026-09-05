---
title: "Kanban Board Design: Linear, Jira, and GitHub Projects, 2026 Tool Comparison"
source_url: https://dev.to/ericwoooo_kr/5-kanban-tools-ive-actually-used-with-agile-teams-and-why-i-keep-switching-48c9
source_type: practitioner-blog
authority: high
relevance: critical
date_retrieved: 2026-05-20
topics:
  - tool-implementation
  - linear
  - jira
  - github-projects
  - wip-limits
  - board-design
stinger: kanban-flow-stinger
---

# Kanban Tool WIP Limits: Honest Practitioner Review (Linear, Jira, GitHub Projects, 2026)

**Source:** DEV Community: "5 Kanban Tools I've Actually Used With Agile Teams (And Why I Keep Switching)"
**URL:** https://dev.to/ericwoooo_kr/5-kanban-tools-ive-actually-used-with-agile-teams-and-why-i-keep-switching-48c9
**Published:** 2026-04-30

## Summary

This is the most honest and practically useful tool comparison source in the research run. The author has hands-on experience with all three major tools (Linear, Jira, GitHub Projects) and documents the specific WIP limit behaviors, bugs, and workarounds from actual team use, not from marketing pages.

**The key finding:** WIP limit enforcement capabilities are almost always locked behind paid tiers, poorly surfaced in onboarding, and have surprising edge-case behaviors that experienced teams only discover in production.

**Linear: WIP Limits:**
- "WIP limits don't exist as a native feature. On a real Kanban board, limiting work in progress is the entire point — it's not a nice-to-have. In Linear, you can't set 'max 3 issues in In Progress' and get a visual warning when someone pushes a fourth."
- Workaround: enforce through team conventions ("we verbally agreed to max 3 per person") or build around it with the GraphQL API.
- The GraphQL API is solid for pulling in-progress issues: the article includes a real query.
- Linear is optimized for speed and developer experience. Kanban board view is fast and clean. Just no native WIP limits.
- **2026 status confirmed:** No native WIP limit enforcement in Linear as of April 2026. This answers Command Brief open question Q1 definitively.

**Jira: WIP Limits:**
- "Setting WIP limits sounds straightforward: Board Settings → Columns → enter a number in the 'Max' field for each column. And for a flat board with no swimlanes, it actually works."
- The board turns the column header orange when over the limit: not a hard block, just a visual warning.
- **Swimlane bug:** When swimlanes are added, "Jira counts issues per column across all swimlanes combined, not per swimlane. So if your WIP limit is 3 and you have two swimlanes with 2 issues each, Jira flags it as over-limit even if both swimlanes are perfectly reasonable." No native fix; documented Atlassian limitation they have not resolved.
- WIP limits only apply to columns mapped to "In Progress" category statuses.
- Finding WIP limit settings in Jira: Board Settings → Columns → enter a number in the "Maximum issues" field for each column.

**GitHub Projects: WIP Limits:**
- "There is zero WIP limit UI. None. You cannot set a column cap."
- If teams want WIP limit enforcement, they must write a GitHub Action to check column count and post a comment: "a weekend project in itself."
- Column limits in GitHub Projects are soft indicators only (confirmed by GitHub docs): "Setting a limit does not restrict anyone from adding cards that would exceed the column's limit."
- No native cycle time or CFD reporting. Reporting is essentially non-existent: no velocity charts, no cumulative flow diagrams, no burndown. Teams must export to CSV and build their own charts.
- **2026 status confirmed:** GitHub Projects still does NOT support native WIP limits with enforcement. Column limits are visual indicators only, not enforced constraints. This answers Command Brief open question Q4 definitively.

**Key observation on tool selection:** All tools gate their most valuable Kanban features (WIP limit enforcement, cycle time analytics, CFD) behind paid tiers or require workarounds. Teams that select a tool based on the free tier demo will not get a functional Kanban system.

## Key quotations / statistics

- "WIP limits don't exist as a native feature [in Linear]." (2026-04-30)
- "In Linear, you can't set 'max 3 issues in In Progress' and get a visual warning when someone pushes a fourth."
- "[Jira's] WIP limit logic gets weird [with swimlanes]. Jira counts issues per column across all swimlanes combined, not per swimlane."
- "[GitHub Projects:] There is zero WIP limit UI. None. You cannot set a column cap."
- "The reporting is essentially non-existent [in GitHub Projects] — no velocity charts, no cumulative flow diagrams, no burndown."

## Annotations for stinger-forge

- **Critical** for `guides/08-tool-implementation.md`: this source provides the definitive 2026 WIP limit status for all three tools, including specific navigation paths (Jira) and specific workarounds (Linear GraphQL API, GitHub Action). Stinger-forge should use this as the primary source for the tool implementation guide.
- **Answers open question Q1 from Command Brief:** Linear does NOT have native WIP limits as of April 2026. Stinger-forge must document this limitation and the API workaround.
- **Answers open question Q4 from Command Brief:** GitHub Projects does NOT support native WIP limits with enforcement. Column limits are soft visual indicators only.
- **The Jira swimlane bug** (WIP counted across all swimlanes, not per swimlane) is a critical gotcha. Stinger-forge should flag this as a known limitation in `guides/08-tool-implementation.md` under the Jira section, with the workaround: use a flat board without swimlanes if WIP limit accuracy is required.
