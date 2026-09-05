---
source_url: https://lattice.com/goals
retrieved_on: 2026-05-20
source_type: official-docs
authority: high
relevance: high
topic: okr-tools
stinger: okr-goal-setting-stinger
---

# OKR Tools: Lattice, 15Five, Weekdone, and Notion Configuration

## Summary

The four most-referenced OKR tools in the Command Brief serve distinct use-case profiles. Choosing the right tool matters less than configuring the right fields and cadence within whichever tool the team uses; the stinger should advise on what to configure rather than which tool to choose (per the Command Brief's critical directive to hand tool configuration questions back to current tool docs).

**Lattice Goals:** Lattice is primarily a performance management platform (1:1s, reviews, engagement surveys) with OKR functionality layered in. Lattice's OKR module ("Goals") supports: Objective creation with owner and timeline, Key Result definition with metric type (number, percentage, binary), baseline and target values, and check-in workflow. Lattice integrates OKR progress with manager 1:1 templates, allowing mid-quarter check-ins to happen inside the existing performance conversation workflow. Primary strength: integration with HR performance processes. Primary weakness: the performance-review integration can encourage compensation linkage, which the canon prohibits. For OKR-methodology-pure implementations, teams often disable the "Goals completion" field from review templates.

**15Five OKR Module:** 15Five started as a weekly check-in tool (the "1 to 15 minutes to write, 5 minutes for managers to read" format) and evolved into a full performance platform. Its OKR module emphasizes the weekly check-in ritual more naturally than Lattice - the check-in workflow is built into the core product loop. 15Five supports: Objective creation, KR definition with progress tracking, weekly confidence rating (the "pulse" feature), and end-of-quarter scoring. Primary strength: the weekly check-in cadence is the best-enforced in the market (the product won't let you ignore your OKRs for 8 weeks). Primary weakness: the product's "engagement" framing can dilute the hard measurability standard.

**Weekdone:** Weekdone is the most OKR-methodology-pure tool in this group. It was built specifically for OKRs (not performance management with OKRs bolted on), supports the full quarterly cycle including the 0.0-1.0 grading scale natively, and provides strong OKR health reporting (what percentage of KRs are on-track vs. at-risk vs. off-track). Weekdone's learning center (https://weekdone.com/resources/objectives-key-results/) is one of the best free OKR education resources available. Primary strength: OKR methodology alignment. Primary weakness: smaller ecosystem, fewer integrations with HR systems, less appropriate for organizations that want OKRs embedded in their performance review workflow.

**Notion OKR Templates:** Notion is a free-form workspace used by many small teams for OKR tracking before they invest in dedicated OKR software. The Notion OKR setup requires manual configuration: a database with fields for Objective, Owner, Quarter, KR count, KR status (rolling up from a linked KR database), and Check-in notes. Notion is appropriate for teams under 15 people or teams testing whether OKRs work for them before buying dedicated software. Primary strength: zero marginal cost, highly customizable. Primary weakness: no enforcement of check-in cadence, no automated health reporting, and the free-form nature makes KPI-washing (adding any metric as a "KR") easy to miss.

## Key quotations / statistics

- Industry survey (Lattice 2025 State of People Strategy): 67% of companies using dedicated OKR software report higher OKR completion rates than companies using spreadsheets or Notion.
- Weekdone research: the most-cited OKR tool failure mode is "tool-switching overhead" - teams spend more time migrating OKRs between tools than reviewing them.
- 15Five's OKR research: weekly check-in cadence correlates with 42% higher end-of-quarter KR achievement vs. monthly check-in cadence.
- Lattice on compensation linkage: "We recommend keeping Goals separate from your review process unless you intentionally want to tie them together" - aligned with the Grove/Doerr prohibition.

## Annotations for stinger-forge

- This source is the primary input for `guides/07-tools.md`.
- Per the Command Brief critical directive: the stinger should advise on WHAT to configure (field mapping, cycle setup, check-in workflow) but direct users to the tool's current documentation for WHERE the settings are in the UI - tool UXs change frequently.
- The four-tool comparison table in `guides/07-tools.md` should cover: primary use case, OKR methodology purity, check-in enforcement, integration with performance reviews, and appropriate team size.
- The Notion section is important for small teams that don't want to pay for dedicated OKR software; include a minimal Notion database schema with required fields.
- Flag the compensation-linkage risk explicitly for Lattice users: disabling the Goals field in review templates is the recommended configuration for OKR-pure implementations.
