# 01. Audit procedure

How to run an aeo-audit-stinger pass end to end for one audit workspace, and what it must produce. This is the procedural spine; guides 02-04 cover the technical checks, guide 05 covers the subjective read, guide 06 covers scoring and report format.

## Where this sits in the audit run

This Stinger equips `aeo-audit-wasp-drone`, one of the nine Drones in Wave 5 of the audit run (build plan section 2). It starts only after `site-crawler-wasp-drone` has finished writing `site-data/` and `keyword-intelligence-wasp-drone` has finished writing `content-targets/questions.md`. It reads both read-only and writes only into its own `04-aeo/` subfolder, with no write contention against the other eight Wave-5 Drones (build plan section 3).

## Phase 1 - scope the pass

- Confirm `site-data/` exists and is populated. If missing or empty, stop and report a blocking dependency failure.
- Confirm `content-targets/questions.md` exists, needed for PRD-009 AC-2 (subjective findings must reference specific entries). If missing, run Part A of the report (the objective technical checks) and flag Part B as out of scope rather than skipping silently.

## Phase 2 - deterministic sweep (Part A: technical)

Run `shared/scripts/aeo-technical.py all --site <base-url>` first (see [references/scripts/README.md](../references/scripts/README.md)): llms.txt presence/shape and per-engine AI-crawler robots.txt access. Every script hit is a lead; confirm each against the actual fetched content before it goes in the register, per conduct rule 2. Then work the schema-signals checklist against `site-data/*.html` per [04-structured-data-for-citation.md](04-structured-data-for-citation.md) - this one is NOT covered by the script, since it needs the crawled page bodies, not a live site-root fetch.

Depth guides for Part A:

- [02-llms-txt-validation.md](02-llms-txt-validation.md)
- [03-ai-crawler-robots-access.md](03-ai-crawler-robots-access.md)
- [04-structured-data-for-citation.md](04-structured-data-for-citation.md)

## Phase 3 - subjective read (Part B)

Only after Part A is complete, work [05-subjective-topical-alignment.md](05-subjective-topical-alignment.md) against `content-targets/questions.md` and `site-data/`. Keep this section structurally separate from Part A in every output artifact - the register, the scorecard, and the section report all enforce this split per PRD-009 AC-2.

## Phase 4 - severity triage and register

Every checkpoint result becomes a row in the audit register per [references/templates/audit-register-row-template.md](../references/templates/audit-register-row-template.md) before any 0-6 scorecard value is assigned.

## Phase 5 - scoring and report

Write the section report to `04-aeo/aeo-audit.md` per [references/templates/aeo-section-report.md](../references/templates/aeo-section-report.md) and [06-scoring-and-report-format.md](06-scoring-and-report-format.md).

## Non-negotiable operating rules

1. Never silent-pass. A clean sweep still produces the full report with "None detected" in every checked-and-clear section (conduct rule 4).
2. Evidence over opinion - every technical checkpoint cites a fetch result, status code, or `site-data/` path (conduct rule 2).
3. Subjective judgements are labelled `[subjective]` and kept in a fully separate report section, never blended into Part A (conduct rule 3, PRD-009 AC-2).
4. This archive is thin (two vendor/practitioner sources, no official spec) - present weighting/ranking claims as attributed vendor heuristics, never as an industry-agreed or Google-disclosed standard (distillation Sections 1, 6, 7).
5. Never assert a citation-rate outcome as a prediction; the only citation-rate figure in this archive (The AEO Report's 34% Perplexity heading-structure statistic) is a single self-reported internal test, cite it as such if referenced at all.
