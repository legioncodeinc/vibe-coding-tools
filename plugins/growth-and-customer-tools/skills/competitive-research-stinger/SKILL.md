---
name: "competitive-research-stinger"
description: "Build competitor workbooks and reports. Use for market mapping, feature gaps, or sales battlecards. Read guides/ for the decision path."
license: AGPL-3.0-or-later
compatibility: "Claude Code 2.1 or newer, Cursor 2.4 or newer, Codex, Cowork"
metadata:
  hive-drone: "competitive-research-wasp-drone"
  domain: "competitive research, market analysis, sales enablement"
  pair-drone: "competitive-research-wasp-drone"
---

# Competitive Research Stinger

## Purpose

Produces two linked deliverables from one research pass: an XLSX competitor-landscape workbook (benchmark row against the subject company, category-organized comparison rows, optional feature-gap-analysis tab) and a brand-matched PDF report (executive summary, computed market-pattern insights, per-category competitor tables, sales battlecards, feature roadmap). The differentiator versus a generic "make me a spreadsheet" pass is that observed claims have source/date evidence, sample statistics are computed from the collected records, and qualitative interpretations are labeled, the PDF is styled with the SUBJECT company's actual, verified brand kit, and the whole pipeline is guarded against four specific, field-verified defects (invisible logo, orphaned blank pages, banned punctuation, an inaccessible chart palette).

## When to use

- Building a competitor comparison spreadsheet or "who else is in this space" workbook
- A request to research and report on competitors, alternatives, or a market category
- Turning a bounded web-research question into a dated source/claim ledger with acquisition and passage-support receipts
- Turning an existing competitor list into a feature-gap analysis ("what should we build to compete")
- A branded PDF version of competitive research, for internal or sales use
- Sales battlecards or "how do we win against X" enablement material
- A follow-up request to add more insight/data/analysis to a competitive deliverable that currently reads as just tables and bullets

## When not to use

- A single company's own SEO, marketing copy, or brand-voice work with no competitive comparison involved, that is a content or brand-voice skill's job, not this one
- Valuation or calibrated financial forecasting; supplied-input reachable-account scenarios are supported by guide 08, with unmeasured inputs and uncertainty explicit
- Building the actual product features identified as gaps; this stinger's output is the roadmap and rationale, implementation is the relevant engineering Drone's job

## Procedure

1. **Scope.** Confirm the subject company, the category boundary, and the deliverable shape (Markdown evidence packet, XLSX only, PDF only, or both) per `guides/01-scoping-and-taxonomy.md` before any research tool call.
2. For a bounded web-research evidence packet, load guide 10 and its acquisition worksheet; Markdown-only receipts are supported when requested. For buyer alternatives, reachable-account scenarios, wedge tests or dated refresh, read guides 07-09 and the competitive evidence schema before selecting the research. Keep vendor statements separate from observed proof.
3. **Research.** Run the aggregator-first sweep in `guides/02-research-sweep.md`: fetch the subject's own site first, then 2-3 roundup articles per category, sorting every discovered company by the five-role competitive taxonomy.
4. **When XLSX is requested, build the XLSX** per `guides/03-building-the-xlsx-workbook.md` and `references/xlsx-workbook-template.md`. Read the base `xlsx` skill first for the general openpyxl/recalc mechanics this guide builds on top of.
5. **If a PDF is in scope**, discover and confirm the correct brand kit, then build per `guides/04-building-the-branded-pdf.md` and `references/pdf-report-outline.md`. Read the base `pdf` skill and, if any chart shows more than one hue at once, the `dataviz` skill's validator, before writing chart code.
6. **Raise the deliverable from a table to an asset** using `guides/05-market-insights-and-battlecards.md`: compute real statistics, write the market-pattern page in prose, build Fact/Impact/Act battlecards for the closest competitors. Do this by default when the deliverable includes a PDF or when the user asks for insight/analysis, not only when explicitly told the first draft was too plain.
7. **Run the full `guides/06-qa-checklist.md`** before delivery. Every unchecked item needs a fix or a stated reason it does not apply.
8. **Deliver** through the actual authorized local-file/media surface with artifact paths and evidence limits. A historical SendUserFile/device example does not establish a tool or authorize a commit, send or publication. Preserve revisions in the authorized output path.

## References map

- `guides/10-web-research-to-evidence-ledger.md`, `references/templates/web-research-receipt.md`, `examples/web-research-evidence/README.md`: load for acquisition provenance, passage support, contradictions and partial-source limits.

- `guides/07-buyer-alternatives-and-wedge.md`, `guides/08-reachable-market-scenarios.md`, `guides/09-fact-ledger-and-refresh.md`: load for dated outcome-based competitive decisions.
- `references/competitive-evidence-schema.md`, `references/templates/competitive-evidence.json`, `scripts/README-competitive-evidence.md`: explicit bookkeeping/assumption contract and optional bounded checker.
- `references/research/2026-10-outcome-enhancement/distilled.md`: fresh update facts and limitations. This is source-repository research that is not shipped with the plugin, so do not require it; guides `07` to `09` carry its conclusions.

- `references/xlsx-workbook-template.md`, load when building or reviewing the XLSX tab structure and column set
- `references/pdf-report-outline.md`, load when building or reviewing the PDF's page sequence
- `references/research/distilled-competitive-research.md`, load when a procedural claim in a guide needs verification (competitor taxonomy, defect root causes, what raises a deliverable's value)
- Source research archive (not shipped with the plugin): the shipped distillation summarizes it; do not require it.

## Related drones and stingers

- `xlsx` (external skill, not bundled in Wasp Nest; use only when actually available): base spreadsheet mechanics (openpyxl, recalc, formula discipline) this stinger's XLSX guide builds on top of; read it first for any formula-bearing tab
- `pdf` (external skill, not bundled in Wasp Nest; use only when actually available): base PDF manipulation mechanics; this stinger's PDF guide covers the HTML-to-PDF-via-Playwright construction path specifically, not covered there
- `dataviz` (external skill, not bundled in Wasp Nest; use only when actually available): chart form, color, and accessibility method; load its validator before any multi-hue chart in the PDF
- [csv-xlsx-import-export-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/csv-xlsx-import-export-stinger): a different domain (building an in-product spreadsheet upload/export FEATURE); do not confuse with this stinger, which produces a one-off research deliverable, not application code
- [competitive-research-wasp-drone](../../agents/competitive-research-wasp-drone.md): the paired Drone; delegate to it for a scoped competitive-research task rather than running this stinger inline mid-conversation on an unrelated Drone's work
- [icp-research-stinger](../icp-research-stinger): evidence-backed ideal customer profile from a company domain; its market and customers lanes are useful input to a competitor landscape

## Audience document packets

Use [library-packets-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/skills/library-packets-stinger/SKILL.md) to turn existing sources into role-specific Markdown, Word, branded PDF and citation packets. Source authoring remains with this skill.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - `xlsx` (external skill, not bundled in Wasp Nest; use only when actually available): base spreadsheet mechanics this stinger builds on
  - `pdf` (external skill, not bundled in Wasp Nest; use only when actually available): base PDF mechanics this stinger builds on
  - `dataviz` (external skill, not bundled in Wasp Nest; use only when actually available): required before authoring any multi-series chart

Ship Gate removed: research-only stinger, produces XLSX and PDF deliverables, never committable application code.
