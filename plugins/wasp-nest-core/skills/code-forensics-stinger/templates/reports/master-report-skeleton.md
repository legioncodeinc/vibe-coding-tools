# Master Forensic Report — Skeleton

The Node script `scripts/build_master_report.js` is the production builder. This skeleton documents what each section contains so a fresh case can be adapted from the same structure.

## Cover Page

- Title: `{PROJECT_NAME} FORENSIC INVESTIGATION`
- Subtitle: `Build-Value, Maintenance, Hosting, and Cost Forensic Report`
- Prepared For: `{CLIENT_PRINCIPAL} — {CLIENT_LEGAL_NAME}`
- Counterparties: (read from `case-facts.json` → `defendants[]`)
  - `{DEFENDANT_1_LEGAL_NAME}` / `{DEFENDANT_1_DBA_NAMES}` — `{DEFENDANT_1_PRINCIPAL}`
  - `{DEFENDANT_2_LEGAL_NAME}` / `{DEFENDANT_2_DBA_NAMES}` — `{DEFENDANT_2_PRINCIPAL}`
  - (continue for additional defendants)
- Date of Report: `{REPORT_DATE}`
- Engagement Period: `{ENGAGEMENT_START_DATE}` – `{ENGAGEMENT_END_DATE}` (`{ENGAGEMENT_MONTHS}` months)
- Documented + Extrapolated Payments Captured: `${DOCUMENTED_PLUS_EXTRAPOLATED}`
- Client-Reported Total Spend: `${CLIENT_SPEND_LOW}` – `${CLIENT_SPEND_HIGH}`
- Git-Evidence Senior-Engineer Work: `{GIT_HOURS_DELIVERED}` hours = `{GIT_HOURS_DELIVERED_AT_100}` @ $100/hr

## Executive Summary

Two paragraphs synthesizing:
1. The forensic record summary (what was paid vs. what was delivered)
2. The most damaging single finding (typically the git evidence)

Followed by a "Headline Numbers (Version 2)" table with 12-15 rows of the most important metrics, each with a source citation.

## Part 1 — Git Commit History Forensic Log

- Date range, total commits, total hours, value at $100/hr
- Effort by Author table (combined GitHub identity aliases)
- Monthly Effort table (color-coded by activity level)
- Idle and Anomalous Months (within paid maintenance window)
- Suspicious Commit Patterns subsection (bulk-import, revert pairs, dump-and-remove)

Reference: `phase-3-git-analysis.md`

## Part 2 — Independent Senior-Engineer Build Estimate

- Feature-by-feature table with hour ranges
- Aggregation (delivered vs professional vs full-contracted scope)
- Cross-check against git log

Reference: bottom-up estimation methodology used in Example Booking Co. Part 2

## Part 3 — Combined Build Cost & Timeframe Estimate

- Convergence table (git method vs bottom-up method at three rate anchors)
- Build-cost conclusion
- Calendar duration analysis

## Part 4 — DigitalOcean Hosting Recommendation

- GOOD / BETTER / BEST tiers
- Each tier: spec table + setup hours + concurrent tenant capacity
- Recommendation

## Part 5 — Code Efficiency and Critical Inefficiencies

Eleven specific findings (N+1 queries, sequential inserts, unpaginated lists, single-threaded gunicorn, god files, circular dependencies, react monolith, no caching, accumulated migrations, missing indexes, no rate limiting).

## Part 6 — Last Meaningful Routine Maintenance

- Lockfile evidence table (each CVE-affected package with months behind)
- Cross-reference against git log (no commits ever update these packages)
- Conclusion: substantive routine maintenance was never performed

## Part 7 — Month-by-Month Maintenance Schedule & Variance

- Maintenance budget calculation
- Fair maintenance cost vs likely actual table
- Month-by-month schedule table (26 months for Example Booking Co.)
- Bottom line / overpayment conclusion

## Appendices

- A: Forensic Packet Contents
- B: Methodology Notes for Counsel (effort calibration, extrapolation rule, authorship attribution)

## Placeholder Substitutions

All `{PLACEHOLDER}` values come from `case-facts.json`. The build script substitutes them via search-and-replace before generating the .docx.
