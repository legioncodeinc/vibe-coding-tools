# 04-aeo/aeo-audit.md output template

Copy-ready skeleton for this Stinger's write into the shared audit workspace's `04-aeo/` folder (build plan section 3). Fill every bracketed field; a clean pass still produces "None detected" per checked-and-clear section, never a silent skip (conduct rule 4). PRD-009 AC-2 requires the technical and subjective sections to stay structurally separate - this template enforces that with two distinct top-level sections.

```markdown
# AEO (Answer Engine Optimization) audit

Run date: <ISO date>
Site: <domain>
Pages evaluated for schema signals: <count from site-data/>
Coverage note: <state plainly if a checkpoint could not run, e.g. "No customer-supplied per-engine citation data exists for this run; all findings below are structural/technical or this audit's own subjective read, never a claimed citation-rate outcome.">

## PART A: Technical AEO standards (objective, evidence-scored)

### A.1 llms.txt

<results table from references/templates/llms-txt-validation-checklist.md>

### A.2 AI-crawler robots.txt access

<results table from references/templates/ai-crawler-access-checklist.md>

### A.3 Structured-data / schema signals for citation

<per-page or rollup table from references/templates/schema-signals-checklist.md>

## PART B: Subjective topical and content-shape alignment [subjective]

Everything in this section is a content-shape judgment against `content-targets/questions.md`, not a technical pass/fail. See `references/templates/subjective-alignment-worksheet.md`.

<worksheet rollup, referencing Q-### IDs>

## Audit register

<link to or embed of this run's AEO-### rows, per references/templates/audit-register-row-template.md>

## Research gaps disclosed to the auditor

Carried forward from `references/research/distilled-aeo-audit.md`: this archive has only two sources, both vendor/practitioner blogs, no official llms.txt spec or engine-vendor primary document. Any weighting or ranking claim in this report (e.g. which schema type "matters most") is one vendor's stated heuristic, not an industry-agreed standard - see Section 6 of the distillation for the two sources' differing tier models. Citation-rate statistics quoted anywhere in this report (e.g. the 34% Perplexity heading-structure figure) are single-source, self-reported, and not independently corroborated in this archive.
```
