---
name: "analytics-stack-stinger"
description: "Foundational, industry-specific, and lawful-only de-anonymization analytics audit, built on the vendor census. Flags jurisdiction questions rather than a compliance verdict. Wave W5."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: analytics-stack-wasp-drone
  research-window: "2026-08-18 (single sweep)"
  primary-surface: external-website-audit
---

# Analytics Stack Stinger

> **Forge status:** stages 1-6 of the seven-stage forge pipeline complete (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (Register, pair registration in `pest-controller-suit` and deploy) has not run yet. Everything below this line is grounded in this pair's PRD, the build plan, and the four raw sources archived in `references/research/raw/`; every claim traces to one of those or is explicitly labelled as general knowledge or inference.

You are equipping **analytics-stack-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-015-analytics-stack](../../library/requirements/backlog/prd-015-analytics-stack/prd-015-analytics-stack-index.md).

## Purpose

Score a site's analytics and visitor-identification stack across three leaves of the "Analytics and insight" scoring category (12% of the final grade): foundational analytics coverage (5%), industry-specific analytics (4%), and de-anonymization/visitor-identification tooling where lawful (3%). This Stinger builds on `vendor-inventory-wasp-drone`'s third-party census rather than re-detecting vendors from scratch, and it flags legal-gray-area de-anonymization findings distinctly instead of rendering a compliance verdict.

## When to use this skill

- Wave W5 of every audit run, after `01-recon/vendor-inventory.md` and `02-positioning/` both exist.
- Any standalone request specifically about analytics coverage, tag-management-layer composition, or visitor-identification/de-anonymization tooling on an externally-audited site.
- Classifying whether a vendor already surfaced by `vendor-inventory-wasp-drone` belongs in this Stinger's scope versus `web-security-posture-wasp-drone`'s or stays purely with `vendor-inventory-wasp-drone` (content-injection-only vendors).

## When not to use this skill

- Before `01-recon/vendor-inventory.md` or `02-positioning/` exist. This Stinger reads both as inputs and does not re-run vendor detection itself.
- To render a legal/compliance verdict on de-anonymization tooling. That is explicitly out of scope, see `guides/04-deanonymization-and-jurisdiction.md`.
- To score a write-capable content-injection vendor (e.g. a Search Atlas OTTO Pixel-class tool). That class is owned by `vendor-inventory-wasp-drone`, this Stinger only cross-references it.
- For an internal codebase's own analytics instrumentation review. This Stinger assesses a live, externally-audited site with no source access; that is a different posture from a repo-improvement task.

## Procedure

1. Load `01-recon/vendor-inventory.md` and `02-positioning/`.
2. Classify every analytics-relevant vendor into foundational, industry-specific, de-anonymization, or out-of-scope, using `references/templates/vendor-classification-table.md`'s tiered signatures and `references/scripts/analytics-vendor-classify.py` as a spot-check.
3. Cross-check the tag-management layer (`guides/05-tag-manager-and-injection-cross-check.md`) before finalizing scores, GTM is commonly the delivery mechanism for what this Stinger scores.
4. Score each of the three leaves on the plugin-wide zero-to-six scale, every score with a numeric value, an evidence pointer, and a one-line justification.
5. Flag (never adjudicate) any de-anonymization finding's jurisdiction question, per `guides/04-deanonymization-and-jurisdiction.md`.
6. Log rejected/reframed candidates to the run's verification log.
7. Write `08-analytics/analytics-findings.md` from `references/templates/analytics-findings-template.md`, per `guides/06-report-format.md`.

Full step-by-step detail lives in `guides/01-audit-procedure.md`, read it first on every invocation.

## References map

Load on demand; do not read everything up front.

| Path | Load when |
|---|---|
| `guides/01-audit-procedure.md` | Every invocation, read first, full end-to-end sequencing |
| `guides/02-foundational-analytics-coverage.md` | Scoring the 5% foundational-analytics leaf |
| `guides/03-industry-specific-analytics.md` | Scoring the 4% industry-specific leaf, this Stinger's most inference-heavy leaf |
| `guides/04-deanonymization-and-jurisdiction.md` | Any de-anonymization/visitor-identification finding, the flagging discipline, and the company-level vs contact-level, deterministic vs probabilistic distinctions |
| `guides/05-tag-manager-and-injection-cross-check.md` | Google Tag Manager present, or a write-capable content-injection vendor overlaps an analytics classification |
| `guides/06-report-format.md` | Writing the final report and evidence index entries |
| `references/templates/analytics-findings-template.md` | The copy-ready output written to `08-analytics/analytics-findings.md` |
| `references/templates/vendor-classification-table.md` | Classifying any vendor into Tier A (grounded)/Tier B (general knowledge)/Tier C (unconfirmed candidate) |
| `references/scripts/analytics-vendor-classify.py` | Deterministic spot-check classifier over `vendor-inventory.md` or `site-data/` |
| `references/scripts/README.md` | Script inventory and the boundary with `shared/scripts/vendor-census.py` |
| `references/research/distilled-analytics-stack.md` | Verifying any claim fast, or resolving where a fact came from, including this archive's stated gaps |
| `references/research/raw/` | Tracing a claim to its primary source |

## Quality bar

A pass through this Stinger is done when: `guides/01-audit-procedure.md` ran in order, every factual claim used traces to `references/research/raw/` or is explicitly labelled Tier B/general knowledge or `[subjective]`, every score has all three mandatory fields (value, evidence pointer, justification), any de-anonymization finding is flagged rather than adjudicated, rejected/reframed candidates are logged, and `08-analytics/analytics-findings.md` was written per `guides/06-report-format.md`.

## Related drones and stingers

- [analytics-stack-wasp-drone](../../agents/analytics-stack-wasp-drone.md) - this Stinger's paired Drone.
- [vendor-inventory-stinger](../vendor-inventory-stinger) - upstream census this Stinger reads (`01-recon/vendor-inventory.md`); do not duplicate its detection work.
- [icp-positioning-stinger](../icp-positioning-stinger) - upstream niche/ICP determination (`02-positioning/`) this Stinger's industry-specific leaf depends on.
- [web-security-posture-stinger](../web-security-posture-stinger) - owns the broader security/consent posture read; consult when a de-anonymization or tag-manager finding raises a security-adjacent question this Stinger doesn't adjudicate.
- [audit-scoring-stinger](../audit-scoring-stinger) - consumes this Stinger's three leaf scores into the "Analytics and insight" category rollup (12% of the final grade).

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [analytics-stack-wasp-drone](../../agents/analytics-stack-wasp-drone.md) - this Stinger's paired Drone.
  - [vendor-inventory-stinger](../vendor-inventory-stinger) - upstream third-party census; read its output before running this Stinger's classification pass.
  - [web-security-posture-stinger](../web-security-posture-stinger) - consult for the broader security/consent posture a de-anonymization finding may touch.

## Ship Gate decision

Does not apply to a per-run audit. This Stinger's output is a set of findings written into the customer's audit workspace (`08-analytics/analytics-findings.md`), not a code change to this plugin's own repository, so the security-stinger, quality-stinger, github-repo-health-stinger Ship Gate defined for repo-improvement Drones is not triggered by running an audit. The Ship Gate does apply, per the build plan's Question 22, before any change to this plugin's own source (this file, the paired Drone, shared scripts) is committed and pushed, that is a plugin-development-time gate, not an audit-run-time gate. Do not conflate the two.
