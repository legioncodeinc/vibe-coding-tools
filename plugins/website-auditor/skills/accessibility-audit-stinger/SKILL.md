---
name: "accessibility-audit-stinger"
description: "Automated-plus-heuristic WCAG 2.1 AA audit across crawled site-data/, a 0-100% score and AA/AAA-style rating, every finding cited with evidence. Not a legal EAA-conformance determination."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-drone: accessibility-audit-wasp-drone
  research-window: 2026-08-18 (single sweep)
  primary-surface: external-website-audit
---

# Accessibility Audit Stinger

> **Forge status:** stages 1-6 complete. Stage 7 (Register: pest-controller-suit pairing registration, deploy, sync references across harness targets) has not run yet. Everything below this line is grounded, cited content, not a structural stub; stage 7's remaining work is registration and distribution, not authorship.

You are equipping **accessibility-audit-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-013-accessibility-audit](../../library/requirements/backlog/prd-013-accessibility-audit/prd-013-accessibility-audit-index.md).

Every factual claim this skill makes traces to a downloaded primary source in `references/research/raw/`, unless explicitly marked as this Stinger's own construction (the checklist's full success-criteria scaffold, the 0-100%/rating-band formula, the AA/AAA-style band definitions) with the reason stated at the point of use. This Stinger's raw archive is thin by design: two sources, both concentrated on the European Accessibility Act's WCAG-version mapping and EU enforcement, neither documenting per-criterion WCAG testing methodology or non-EU regimes. Read `references/research/distilled-accessibility-audit.md` first for exactly what is and is not covered before treating anything as settled.

## When to use this skill

- Wave W5 of every audit run, reading only `site-data/`, writing only to `06-accessibility/`.
- Any request specifically about accessibility/WCAG conformance for a given site or page.
- Determining whether an audited party qualifies for the EAA's Article 4(5) microenterprise exemption before framing findings as EAA-compliance risk.
- Deciding what WCAG version to score against, and whether WCAG 2.2 items should be reported as a compliance requirement or a forward-looking indicator.

## When not to use this skill

- Auditing this plugin's own codebase for accessibility issues in its own UI (there is none; this is a CLI/agent toolset). If a future component needs internal-product accessibility review, that is a different scope than this external-site auditor.
- Producing a legal EAA-conformance determination. This skill produces an audit input; the audited party's own counsel makes conformance determinations.
- Non-EU accessibility regimes (US ADA/Section 508, etc.). This Stinger's archive does not cover them; flag the gap rather than answering from unsourced general knowledge, per `guides/05-manual-vs-automated-confidence-and-non-goals.md`.
- Full manual accessibility audits requiring real assistive-technology user testing. This is an automated-plus-heuristic pass; say so, per PRD-013's stated non-goal.

## Procedure

Full step-by-step in `guides/01-audit-procedure.md`. Summary: confirm `site-data/` exists, run the scope gate (`guides/03`), run `shared/scripts/a11y-scan.py` for the automatable subset, walk the full checklist (`references/templates/wcag-2.1-aa-checklist-scoring-table.md`) for every remaining row, roll up the 0-100% score and assign the AA/AAA-style band (`guides/04`), write the dated accessibility statement (never an unqualified compliance verdict), and write output plus the evidence-index update per `guides/06`.

## References map

Load on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `references/research/distilled-accessibility-audit.md` | Verifying any EAA/WCAG-version claim fast, or resolving where a fact came from |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-audit-procedure.md` | Running a full pass end to end |
| `guides/02-eaa-and-wcag-version-selection.md` | Choosing which WCAG version to score, or writing anything characterizing EAA enforcement risk |
| `guides/03-scope-gate-microenterprise-and-applicability.md` | Running the pre-score exemption gate |
| `guides/04-scoring-and-rating-bands.md` | Computing the 0-100% score, assigning the band, or writing the compliance-claim language rule |
| `guides/05-manual-vs-automated-confidence-and-non-goals.md` | Deciding how confidently to state any given finding, or scoping a request outside the EU/EAA |
| `guides/06-report-and-handoff-to-scoring.md` | Writing final output and handing off to `audit-scoring-wasp-drone` |
| `references/templates/wcag-2.1-aa-checklist-scoring-table.md` | The per-criterion checklist to work through during a pass |
| `references/templates/a11y-score-rollup-and-rating-bands.md` | The 0-100% formula and AA/AAA-style band definitions |
| `references/templates/eaa-conformance-statement-template.md` | Writing the dated, gap-disclosing accessibility statement |
| `references/templates/microenterprise-and-scope-gate-checklist.md` | The exemption/applicability gate checklist |
| `references/templates/accessibility-findings-output-template.md` | The exact `06-accessibility/` file skeleton and its evidence-index handoff |
| `shared/scripts/a11y-scan.py` | Running the automated structural subset over `site-data/`; six checks, see `references/scripts/README.md` |

## Related drones and stingers

- [accessibility-audit-wasp-drone](../../agents/accessibility-audit-wasp-drone.md) - this Stinger's paired Drone.
- [audit-scoring-stinger](../audit-scoring-stinger) - reads this pair's `06-accessibility/` output in wave W7; the category-weight placement of this pair's leaves inside the build plan's eight-category table is an unresolved handoff item, named explicitly in `guides/04-scoring-and-rating-bands.md` section 5, for that pair's own forge to settle.
- [site-crawler-stinger](../site-crawler-stinger) - upstream dependency; this pair reads `site-data/` that pair writes.
- [web-security-posture-stinger](../web-security-posture-stinger) - sibling Wave-5 pair; both read `site-data/` independently with no write contention, no shared scope overlap beyond the workspace.

## Quality bar

A pass is done when: `guides/01` through `guides/06` were followed in order, every checklist row is scored with an evidence pointer and justification or explicitly marked N/A, the 0-100% score and AA/AAA-style band are computed via the sourced formula and never presented without the dated accessibility statement alongside them, the scope gate ran and its result is recorded regardless of outcome, the WCAG 2.2 forward-looking band is reported separately from the AA baseline, the category-placement gap is flagged rather than guessed, and `06-accessibility/` plus `_shared/evidence-index.md` are fully written per `references/templates/accessibility-findings-output-template.md`.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [accessibility-audit-wasp-drone](../../agents/accessibility-audit-wasp-drone.md) - this Stinger's paired Drone.

## Ship Gate decision

Does not apply. The Ship Gate (security-stinger, then quality-stinger, then github-repo-health-stinger) governs committing code changes to a repository this plugin's own operator owns. This Stinger equips an external, read-only audit of a third-party site; it produces report artifacts inside the engagement workspace (`06-accessibility/`), not a code change to this plugin's repository, so no Ship Gate applies to its own output. If a future engagement's findings lead to the operator editing their own codebase based on this report, that edit (if made in a repo this plugin's operator owns) would separately go through the Ship Gate via the existing `security-wasp-drone`/`quality-wasp-drone`/`github-repo-health-wasp-drone` chain, not through this pair.
