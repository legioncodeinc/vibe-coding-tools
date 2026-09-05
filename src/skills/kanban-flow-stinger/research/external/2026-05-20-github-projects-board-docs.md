---
title: "GitHub Projects Board Layout: Official Docs 2026"
source_url: https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout
source_type: official-docs
authority: high
relevance: medium
date_retrieved: 2026-05-20
topics:
  - github-projects
  - board-design
  - tool-implementation
  - wip-limits
stinger: kanban-flow-stinger
---

# GitHub Projects Board Layout: Official Documentation

**Source:** GitHub Docs: "Customizing the board layout"
**URL:** https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-board-layout
**Published:** Not dated (current as of retrieval 2026-05-20)

## Summary

Official GitHub documentation for the board layout in GitHub Projects. This is the authoritative source on what column limits actually do (and don't do) in GitHub Projects.

**Board layout basics:**
- The board layout spreads issues, pull requests, and draft issues across customizable columns.
- Teams create a Kanban board by setting the column field to a "Status" field (single select field or iteration field).
- Items can be dragged between columns; dragging an item changes its field value to match the column.

**Column limits, the critical finding:**
The official documentation states clearly: "Setting a limit does not restrict anyone from adding cards that would exceed the column's limit, nor does it restrict any automations from adding cards."

This confirms the DEV Community practitioner finding: GitHub Projects column limits are soft visual indicators only. The column shows the current count and the limit (e.g., "3/2" displayed in red when over limit), but there is NO enforcement. Anyone can add cards beyond the limit at any time.

Column limits are per-view (unique to each view in the project), not global. This means different views can have different limits for the same column.

**Setting a column limit (navigation path):**
1. Click next to the column name
2. In the menu, click "Set column limit"
3. Under "Column limit," type the card limit for this column
4. Optionally, to remove the limit, clear the entry
5. Click Save

**Additional board features:**
- Grouping by field values creates horizontal sections (swimlanes equivalent): useful for organizing by work stream, team, or urgency
- Field sums can be displayed per column (e.g., sum of story points per column)
- Board can be created from any single select or iteration field, not just Status

**What GitHub Projects does NOT support natively:**
- Hard WIP limit enforcement (soft visual only)
- Cumulative flow diagrams
- Cycle time analytics
- Throughput charts
- Any flow metrics: must export to CSV and use external tooling

## Key quotations / statistics

- "Setting a limit does not restrict anyone from adding cards that would exceed the column's limit, nor does it restrict any automations from adding cards." (Official confirmation of no enforcement)
- "Column limits are unique to each view in your project."

## Annotations for stinger-forge

- **Critical** for `guides/08-tool-implementation.md` (GitHub Projects section): the official confirmation that column limits are soft/visual only is the authoritative source for this well-known limitation. Stinger-forge should cite both this (official) and the DEV Community source (practitioner corroboration) in the guide.
- **Answers open question Q4 from Command Brief definitively:** GitHub Projects does NOT have native WIP limit enforcement. The worker-bee must document the GitHub Actions workaround for teams that need enforcement.
- The lack of any native flow metrics in GitHub Projects means teams using this tool will need a separate analytics tool (e.g., ActionableAgile, LinearB, Swarmia, or a custom Google Sheets/Looker setup). Stinger-forge should recommend options in the GitHub Projects section of the tool guide.
