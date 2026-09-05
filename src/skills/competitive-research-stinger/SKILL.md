---
name: "competitive-research-stinger"
description: "Builds an XLSX competitor-landscape workbook and a brand-matched PDF report from scratch: research sweep, category taxonomy, feature-gap analysis, computed market-pattern insights, and sales battlecards. Invoke on phrases like build a competitor comparison spreadsheet, research our competitors, make a battlecard deck, competitive landscape report, or feature gap analysis against competitors."
license: MIT
compatibility: "Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork"
metadata:
  hive-bee: "competitive-research-worker-bee"
  domain: "competitive research, market analysis, sales enablement"
  pair-bee: "competitive-research-worker-bee"
---

# Competitive Research Stinger

## Purpose

Produces two linked deliverables from one research pass: an XLSX competitor-landscape workbook (benchmark row against the subject company, category-organized comparison rows, optional feature-gap-analysis tab) and a brand-matched PDF report (executive summary, computed market-pattern insights, per-category competitor tables, sales battlecards, feature roadmap). The differentiator versus a generic "make me a spreadsheet" pass is that every claim in the output is a number computed from the collected research, the PDF is styled with the SUBJECT company's actual, verified brand kit, and the whole pipeline is guarded against four specific, field-verified defects (invisible logo, orphaned blank pages, banned punctuation, an inaccessible chart palette).

## When to use

- Building a competitor comparison spreadsheet or "who else is in this space" workbook
- A request to research and report on competitors, alternatives, or a market category
- Turning an existing competitor list into a feature-gap analysis ("what should we build to compete")
- A branded PDF version of competitive research, for internal or sales use
- Sales battlecards or "how do we win against X" enablement material
- A follow-up request to add more insight/data/analysis to a competitive deliverable that currently reads as just tables and bullets

## When not to use

- A single company's own SEO, marketing copy, or brand-voice work with no competitive comparison involved, that is a content or brand-voice skill's job, not this one
- Financial modeling or valuation work; this produces qualitative/feature comparison, not a spreadsheet model with live formulas driving a forecast
- Building the actual product features identified as gaps; this stinger's output is the roadmap and rationale, implementation is the relevant engineering Bee's job

## Procedure

1. **Scope.** Confirm the subject company, the category boundary, and the deliverable shape (XLSX only, PDF only, or both) per `guides/01-scoping-and-taxonomy.md` before any research tool call.
2. **Research.** Run the aggregator-first sweep in `guides/02-research-sweep.md`: fetch the subject's own site first, then 2-3 roundup articles per category, sorting every discovered company by the five-role competitive taxonomy.
3. **Build the XLSX** per `guides/03-building-the-xlsx-workbook.md` and `references/xlsx-workbook-template.md`. Read the base `xlsx` skill first for the general openpyxl/recalc mechanics this guide builds on top of.
4. **If a PDF is in scope**, discover and confirm the correct brand kit, then build per `guides/04-building-the-branded-pdf.md` and `references/pdf-report-outline.md`. Read the base `pdf` skill and, if any chart shows more than one hue at once, the `dataviz` skill's validator, before writing chart code.
5. **Raise the deliverable from a table to an asset** using `guides/05-market-insights-and-battlecards.md`: compute real statistics, write the market-pattern page in prose, build Fact/Impact/Act battlecards for the closest competitors. Do this by default when the deliverable includes a PDF or when the user asks for insight/analysis, not only when explicitly told the first draft was too plain.
6. **Run the full `guides/06-qa-checklist.md`** before delivery. Every unchecked item needs a fix or a stated reason it does not apply.
7. **Deliver** per the base file-sharing conventions: SendUserFile, then commit to a connected device folder if one has a natural home for the file, reusing the same path on any revision so it lands as an update.

## References map

- `references/xlsx-workbook-template.md`, load when building or reviewing the XLSX tab structure and column set
- `references/pdf-report-outline.md`, load when building or reviewing the PDF's page sequence
- `references/research/distilled-competitive-research.md`, load when a procedural claim in a guide needs verification (competitor taxonomy, defect root causes, what raises a deliverable's value)
- `references/research/raw/`, load when tracing a distilled claim back to its primary source

## Related bees and stingers

- [xlsx](../../../xlsx): base spreadsheet mechanics (openpyxl, recalc, formula discipline) this stinger's XLSX guide builds on top of; read it first for any formula-bearing tab
- [pdf](../../../pdf): base PDF manipulation mechanics; this stinger's PDF guide covers the HTML-to-PDF-via-Playwright construction path specifically, not covered there
- [dataviz](../../../dataviz): chart form, color, and accessibility method; load its validator before any multi-hue chart in the PDF
- [csv-xlsx-import-export-stinger](../csv-xlsx-import-export-stinger): a different domain (building an in-product spreadsheet upload/export FEATURE); do not confuse with this stinger, which produces a one-off research deliverable, not application code
- [competitive-research-worker-bee](../../agents/competitive-research-worker-bee.md): the paired Bee; delegate to it for a scoped competitive-research task rather than running this stinger inline mid-conversation on an unrelated Bee's work

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [xlsx](../../../xlsx): base spreadsheet mechanics this stinger builds on
  - [pdf](../../../pdf): base PDF mechanics this stinger builds on
  - [dataviz](../../../dataviz): required before authoring any multi-series chart

Ship Gate removed: research-only stinger, produces XLSX and PDF deliverables, never committable application code.
