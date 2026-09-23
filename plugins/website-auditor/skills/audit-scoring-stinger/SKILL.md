---
name: "audit-scoring-stinger"
description: "N/A-aware weighted rollup engine (leaf to sub-audit to category to final), critical-security-override, populates the branded named-range-driven XLSX scorecard."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: audit-scoring-wasp-drone
  research-window: "2026-08-18 (round 2 core-formula sweep; round 3 deeper sweep: N/A-aware formula mechanics, openpyxl branding mechanics, multi-level rollup design)"
  primary-surface: external-website-audit
---

# Audit Scoring Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides,
> final Drone/Stinger authorship). Stage 7 (Register: pairing into `pest-controller-suit`, deploy,
> reference sync) has not run yet.

You are equipping **audit-scoring-wasp-drone**, part of the Website Auditor by Legion Code
Inc. plugin. Full scope and acceptance criteria: [prd-020-audit-scoring](../../library/requirements/backlog/prd-020-audit-scoring/prd-020-audit-scoring-index.md).

This is one of the most load-bearing pairs in the plugin: wave W7, sync, needs every
applicable Wave-5/W6 Drone's findings before it can run at all, and its output (the populated
`scoring/audit-scorecard.xlsx`) is what `audit-reporting-wasp-drone` renders into both
customer- and auditor-facing deliverables in wave W8. Every factual claim below traces to a
downloaded primary source in `references/research/raw/`, or is explicitly flagged as this
Stinger's own engineering design where the research archive itself says the design is not
directly sourced - see `guides/03-nesting-structure-design.md` for the full accounting.

## Purpose

Roll every leaf finding (0-6 score, evidence pointer, one-line justification) up through
sub-audit, category, and final scores using N/A-aware masked-SUMPRODUCT formulas at every
level; apply the critical-security-override (any Security leaf scored 1 caps the final grade
at C); and populate the branded, named-range-driven XLSX scorecard, per build plan sections
4.1-4.4 and prd-020's acceptance criteria.

## When to use this skill

- Wave W7 of every audit run, after every applicable Wave-5/W6 Drone has written its findings
  (`03-seo/` through `12-ecommerce/`, per the shared workspace contract).
- Verifying a final letter grade or the security-override cap by hand against the workbook's
  own formulas (e.g. during a QA pass on this pair, or when a client questions a grade).
- Retuning category or sub-audit weights via the `Rubric` sheet's named ranges for one
  engagement, without editing any formula (`guides/04-retuning-weights.md`).
- Validating an incoming leaf finding against `references/templates/leaf-finding.schema.json`
  and deciding whether to score it or reject it back to its originating Drone
  (`guides/05-rejecting-a-leaf-finding.md`).
- Regenerating the branded XLSX template itself after a design change to the category/
  sub-audit weighting structure (`references/scripts/generate-scorecard-xlsx.py`).

## When not to use this skill

- To re-score, second-guess, or reinterpret an upstream Drone's own leaf finding. That is the
  originating Drone's domain judgement, not this Stinger's arithmetic. A malformed or
  unevidenced finding is rejected back to its origin, never silently corrected here
  (`guides/05-rejecting-a-leaf-finding.md`).
- To generate the customer- or auditor-facing narrative reports. That is
  `audit-reporting-wasp-drone` / `audit-reporting-stinger`'s job in wave W8, reading this
  pair's output as its own input.
- To crawl, capture evidence, or produce a finding from scratch. This pair only consumes
  already-produced leaf findings; it has no domain expertise in security, SEO, accessibility,
  or any of the other audited domains.
- To determine category weights or the override rule from first principles. Both are binding
  product requirements straight from `plan/website-auditor-build-plan.md` section 4.2/4.3 and
  prd-020's acceptance criteria (AC-2, AC-3), not this Stinger's discretion to redesign; only
  the numeric VALUES in the named ranges are meant to be retuned per engagement.

## Procedure

1. **Copy the template.** Copy `references/templates/website-audit-scorecard-template.xlsx`
   to the run's `scoring/audit-scorecard.xlsx` (build plan section 3's shared workspace path).
   Never edit the template in place; never hand-edit a formula cell in the copy either
   (`guides/04-retuning-weights.md` section 6).
2. **Read every applicable category folder's output** (`03-seo/` through `12-ecommerce/`) and
   `_shared/evidence-index.md`, per the shared workspace contract in prd-020.
3. **Validate each candidate leaf finding** against
   `references/templates/leaf-finding.schema.json`. A finding that fails validation, is a
   malformed boolean checkpoint, or targets an unknown category/sub-audit coordinate is
   rejected back to its `originating_bee` per `guides/05-rejecting-a-leaf-finding.md` - never
   scored anyway.
4. **Transcribe every valid leaf finding** into its row on the `Scorecard` sheet (score,
   evidence pointer, justification - a direct write, never a formula edit).
5. **Recalculate** (open in Excel/LibreOffice, or force a headless recalculation pass) and
   read back the rollups: sub-audit (`guides/01-rollup-procedure.md` section 1-2), category
   (section 3), and final (section 4). The critical-security-override
   (`guides/02-critical-security-override.md`) resolves automatically on the
   `Executive Scorecard` sheet from the same recalculation - no separate step is needed.
6. **Verify, don't just trust.** Spot-check at least one sub-audit rollup and the final letter
   grade by hand against the raw leaf scores before treating the run as complete, per
   `guides/01-rollup-procedure.md` section 5's verification method.
7. **Write `scoring/findings-register.csv`** from the same validated leaf findings (one row
   per finding: ID, severity, category, page, evidence, remediation, effort), per the shared
   workspace contract.
8. **Hand off to `audit-reporting-wasp-drone`** (wave W8) once every applicable Wave-5/W6 Drone's
   findings are either scored or logged as an unresolved rejection in the run's verification
   log - never hand off with a silently-dropped finding.

## References map

| Path | Load when |
|---|---|
| `references/research/distilled-audit-scoring.md` | Verifying any formula-mechanics claim fast, or tracing where it came from |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-rollup-procedure.md` | Running or verifying the leaf-to-sub-audit-to-category-to-final rollup |
| `guides/02-critical-security-override.md` | Understanding or verifying the override mechanics, or retuning its two named ranges |
| `guides/03-nesting-structure-design.md` | Understanding which parts of the hierarchy are sourced vs. this Stinger's own design, before trusting or changing the structure |
| `guides/04-retuning-weights.md` | Retuning any category or sub-audit weight, the grade thresholds, or the override cap for one engagement |
| `guides/05-rejecting-a-leaf-finding.md` | Deciding whether an incoming leaf finding should be scored or rejected back to its originating Drone |
| `references/scripts/generate-scorecard-xlsx.py` | Regenerating the template after any design change; read its module docstring for the full sourced-vs-invented accounting |
| `references/scripts/README.md` | Full script inventory for this pair, including the shared plugin-root scripts this pair is listed against |
| `references/templates/website-audit-scorecard-template.xlsx` | The real, working branded XLSX template - copy this at the start of every run, never edit the template file itself |
| `references/templates/leaf-finding.schema.json` | The intermediate findings format every upstream Drone must write; validate every incoming finding against this before scoring it |
| `references/templates/README.md` | What each template file is for and how it is regenerated |

## Related drones and stingers

- [technical-seo-stinger](../technical-seo-stinger) - one of twelve Wave-5/W6 Drones whose leaf findings this pair consumes.
- [aeo-audit-stinger](../aeo-audit-stinger) - consumed, Wave 5.
- [content-semantics-stinger](../content-semantics-stinger) - consumed, Wave 5.
- [internal-linking-stinger](../internal-linking-stinger) - consumed, Wave 5.
- [visual-funnel-stinger](../visual-funnel-stinger) - consumed, Wave 5.
- [accessibility-audit-stinger](../accessibility-audit-stinger) - consumed, Wave 5.
- [web-security-posture-stinger](../web-security-posture-stinger) - consumed, Wave 5; the sole source of the leaves that can trigger the critical-security-override.
- [analytics-stack-stinger](../analytics-stack-stinger) - consumed, Wave 5.
- [performance-cwv-stinger](../performance-cwv-stinger) - consumed, Wave 5.
- [social-presence-stinger](../social-presence-stinger) - consumed, Wave 5.
- [blog-content-stinger](../blog-content-stinger) - consumed, Wave 6a, conditional on blog detection.
- [ecommerce-catalog-stinger](../ecommerce-catalog-stinger) - consumed, Wave 6b, conditional on commerce detection.
- [audit-reporting-stinger](../audit-reporting-stinger) - downstream consumer, Wave 8; renders this pair's populated `scoring/audit-scorecard.xlsx` and `findings-register.csv` into the customer- and auditor-facing reports.
- [audit-intake-stinger](../audit-intake-stinger) - upstream, Wave 0; scaffolds the shared workspace this pair reads from and writes into.
- `csv-xlsx-import-export-stinger` (in the `vibe-coding-tools` plugin, not this one - no relative path resolves across plugins) - general-purpose CSV/XLSX mechanics; consult for openpyxl or spreadsheet-format questions beyond this pair's own scoring-specific research archive, per the build plan's "cite as related, reuse rather than duplicate" instruction for transferable knowledge the existing Wasp Nest roster already holds.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [audit-scoring-wasp-drone](../../agents/audit-scoring-wasp-drone.md) - this Stinger's paired Drone.

## Ship Gate decision

Does not apply in the usual "before committing code to this repo" sense: this pair's
day-to-day output (a populated `scoring/audit-scorecard.xlsx` inside an external customer's
audit workspace) is a client deliverable, not a change to this plugin's own source tree, so
the security-stinger / quality-stinger / github-repo-health-stinger Ship Gate sequence that
governs committing code has no natural trigger point in this pair's normal operation.

**Stated explicitly rather than left implicit, because one part of this pair's own forge output
genuinely IS a committed repository artifact:** the generated template file itself,
`references/templates/website-audit-scorecard-template.xlsx`, together with its generator
script, are real files committed to THIS plugin repository as part of Stage 4 (References).
Any future change to `references/scripts/generate-scorecard-xlsx.py` or to the weighting
design it encodes should go through this repo's normal commit discipline (and, if the change
touches code logic rather than pure data/content, the Ship Gate) before being committed -
this Stinger's own forge work in this session was reviewed for correctness by direct
verification (LibreOffice headless recalculation of the generated formulas, `openpyxl`
load-back, JSON Schema self-validation) rather than by the code-security/quality Ship Gate,
since it is template-generation tooling and reference content, not application source code
serving live traffic or handling secrets.
