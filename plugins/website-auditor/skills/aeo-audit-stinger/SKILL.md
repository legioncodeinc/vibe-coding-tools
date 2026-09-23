---
name: "aeo-audit-stinger"
description: "100-page AEO audit: llms.txt presence, per-engine AI-crawler robots.txt access (GPTBot, PerplexityBot, ClaudeBot, etc.), citation-relevant structured data, subjective topical alignment. Wave W5."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-drone: aeo-audit-wasp-drone
  research-window: 2026-08-18 (single sweep; archive is thin, two vendor/practitioner sources, no official spec)
  primary-surface: external-website-audit
---

# Aeo Audit Stinger

> **Forge status:** stages 1-6 of the seven-stage forge pipeline complete for this pair (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (Register: pest-controller-suit registration, harness deployment, repo-reference sync) has not run yet. Every factual claim below traces to a raw source in `references/research/raw/`, cited inline. This archive is honestly thin - read the grounding note below before trusting a weighting or ranking claim as more than one vendor's own heuristic.

You are equipping **aeo-audit-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-009-aeo-audit](../../library/requirements/backlog/prd-009-aeo-audit/prd-009-aeo-audit-index.md).

**Archive honesty note.** `references/research/distilled-aeo-audit.md` has exactly two sources, both vendor/practitioner blogs (Ranki.io, The AEO Report), neither an official standard, spec, or engine-vendor primary document. Every technical presence/absence finding this Stinger produces (llms.txt exists, GPTBot is disallowed) is a directly observed fact. Every weighting, ranking, or citation-rate figure is one vendor's own self-reported heuristic - present it as attributed, never as an industry-agreed standard.

## When to use this skill

- Wave 5 of every website-auditor run, after `site-crawler-wasp-drone` has written `site-data/` and `keyword-intelligence-wasp-drone` has written `content-targets/questions.md`
- Checking whether a site is citation-friendly for AI answer engines (ChatGPT, Perplexity, Claude, Gemini, Cohere)
- Validating llms.txt presence, shape, and length against the practitioner heuristics this archive documents
- Auditing per-engine AI-crawler robots.txt access, including the GPTBot-blocked-but-CCBot-allowed trap
- Distinguishing a technical AEO failure (llms.txt missing, a crawler blocked) from a merely subjective content-shape gap (no definitional first paragraph, no answer-style headings)

## When NOT to use this skill

- Traditional-search technical SEO (crawlability, sitemap, robots.txt beyond AI-crawler-specific access, canonicalization) - that is `technical-seo-stinger`'s scope, sharing this Stinger's `site-data/` and `content-targets/questions.md` inputs but scoring distinct checkpoints (PRD-008)
- General JSON-LD/structured-data validity for traditional search rich results (Product, Offer, Review schema) - that is `technical-seo-stinger`'s own Section 8 coverage; this Stinger's schema checklist is narrower, scoped specifically to citation-relevant types
- Asserting a citation-rate prediction for the audited site - no source in this archive is a controlled, reproducible study; the one citation-rate-adjacent statistic here (a 34% Perplexity figure) is a single vendor's single self-reported internal test
- Improving a repository you own - that is `seo-aeo-stinger`'s scope (a different plugin, `vibe-coding-tools`; see Related section)

## Procedure

Full procedure lives in `guides/`, run in this order:

1. [guides/01-audit-procedure.md](guides/01-audit-procedure.md) - the procedural spine: scope, Part A (technical) sweep, Part B (subjective) read, triage, scoring, report. Read this first, every run.
2. [guides/02-llms-txt-validation.md](guides/02-llms-txt-validation.md)
3. [guides/03-ai-crawler-robots-access.md](guides/03-ai-crawler-robots-access.md)
4. [guides/04-structured-data-for-citation.md](guides/04-structured-data-for-citation.md)
5. [guides/05-subjective-topical-alignment.md](guides/05-subjective-topical-alignment.md) - `[subjective]`, structurally separate from guides 02-04, per PRD-009 AC-2
6. [guides/06-scoring-and-report-format.md](guides/06-scoring-and-report-format.md) - the 0-6 rubric and the `04-aeo/` output contract

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `references/research/distilled-aeo-audit.md` | Verifying any AEO claim fast, and checking which of the two sources it comes from |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-audit-procedure.md` | Running a full pass end to end |
| `guides/02`, `guides/03` | llms.txt and AI-crawler-access depth (the two scripted checks) |
| `guides/04` | Schema-for-citation depth (no script, reads `site-data/` directly) |
| `guides/05` | The subjective topical-alignment read |
| `guides/06` | Scoring and where output artifacts go |
| `references/templates/llms-txt-validation-checklist.md` | Working the llms.txt checkpoint |
| `references/templates/ai-crawler-access-checklist.md` | Working the AI-crawler-access checkpoint |
| `references/templates/schema-signals-checklist.md` | Working the citation-schema checkpoint |
| `references/templates/subjective-alignment-worksheet.md` | Working the subjective read |
| `references/templates/audit-register-row-template.md` | Writing a finding into the plugin-wide findings register |
| `references/templates/aeo-section-report.md` | Writing the final `04-aeo/aeo-audit.md` deliverable |
| `references/scripts/README.md` | Running the deterministic `aeo-technical.py` script (shared at plugin root, `shared/scripts/`) |

## References map

- **Research**: `references/research/distilled-aeo-audit.md` (dense, cited synthesis, with an explicit thinness disclosure) and `references/research/raw/` (2 sources: Ranki.io's 2026 AEO checklist, The AEO Report's answer-engine-optimization checklist).
- **Templates**: llms.txt checklist, AI-crawler-access checklist, schema-signals checklist, subjective-alignment worksheet, audit-register row, section-report skeleton - all in `references/templates/`.
- **Scripts**: `shared/scripts/aeo-technical.py` (stdlib-only Python, llms.txt + AI-crawler-access validation), pointed to from `references/scripts/README.md`. Schema-for-citation has no script; it reads `site-data/*.html` directly (guide 04).
- **Guides**: `guides/01` through `guides/06`, run in the order listed above.

## Related drones and stingers

- [aeo-audit-wasp-drone](../../agents/aeo-audit-wasp-drone.md) - this Stinger's paired Drone.
- [technical-seo-stinger](../technical-seo-stinger) - shares `site-data/` and `content-targets/questions.md`; scores distinct technical-SEO checkpoints. See that Stinger's guide 08 for the boundary between its long-tail semantic read and this Stinger's own subjective topical-alignment read (guide 05).
- [keyword-intelligence-stinger](../keyword-intelligence-stinger) - produces `content-targets/questions.md`, the source this Stinger's `Q-###` worksheet rows reference by ID; reconcile the exact ID convention against that Stinger's own final schema once it is authored.
- [audit-scoring-stinger](../audit-scoring-stinger) - rolls this Stinger's `AEO-###` register rows and scores into the plugin-wide XLSX scorecard.
- `seo-aeo-stinger` - a **different plugin** (`vibe-coding-tools`, not this plugin), the internal-repo SvelteKit/Payload SEO-and-AEO specialist. Consult it by skill name (there is no valid relative path from this plugin into another installed plugin's skill folder) for AI-citation/llms.txt baseline reading where it overlaps. Do not duplicate its research archive; that Stinger optimizes a repo you own, this one audits a site you do not.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [aeo-audit-wasp-drone](../../agents/aeo-audit-wasp-drone.md) - this Stinger's paired Drone.
  - [technical-seo-stinger](../technical-seo-stinger) - the technical-SEO sibling audit sharing this Stinger's inputs; consult for the boundary on long-tail semantic vs. AEO topical-alignment findings.
  - `seo-aeo-stinger` (vibe-coding-tools plugin, installed separately) - internal-repo SEO/AEO specialist; consult for AI-citation/llms.txt baseline research where it overlaps.

## Ship Gate

This Stinger's per-run output writes only into an external customer's audit workspace (`04-aeo/` inside `<domain>-audit/`, build plan section 3), never into this plugin's own repository. The Ship Gate (`security-stinger`, `quality-stinger`, `github-repo-health-stinger`, per the build plan's Q22 answer) governs commits **to this repository** - it applies when this Stinger's or its paired Drone's own files change and those changes are being committed here, not to the audit findings this Drone produces about a customer's site. A per-run audit pass does not trigger the Ship Gate; a change to this SKILL.md, its guides, or its Drone file, committed to this repo, does.
