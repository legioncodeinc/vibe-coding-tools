---
name: "audit-reporting-stinger"
description: "Generates customer- and auditor-facing reports (Markdown + styled HTML), subtly Legion Code Inc.-branded, rendered only from the scored findings register."
license: AGPL-3.0-or-later
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-drone: audit-reporting-wasp-drone
  research-window: 2026-08-18 (rounds 1-3, same day sweep)
  primary-surface: external-website-audit
---

# Audit Reporting Stinger

> **Forge status:** stages 1-6 complete for this pair (Topic, Research, Distillation, References, Guides, final Skill/Drone authorship). Stage 7 (Register - pest-controller-suit registration, cross-harness deploy, repo-reference sync) has not run yet. Everything below this line is grounded: every factual claim traces either to this pair's own research archive (`references/research/raw/`, five sources, distilled in `references/research/distilled-audit-reporting.md`) or to a named binding source in this repo (prd-021, prd-001, prd-020, the build plan). Where a claim is this Stinger's own design judgment rather than sourced fact, it is labelled as such inline, most notably the subtle-branding placement decisions in `guides/03-subtle-branding-application.md`.

You are equipping **audit-reporting-wasp-drone**, part of the Website Auditor by Legion Code Inc. plugin. Full scope and acceptance criteria: [prd-021-audit-reporting](../../library/requirements/backlog/prd-021-audit-reporting/prd-021-audit-reporting-index.md).

This Stinger's job is narrow and intentionally so: render the findings the upstream Drones and `audit-scoring-wasp-drone` already produced into four documents. It never scores, invents, softens, or drops a finding. Per prd-021's Non-Goals: "Does not invent findings not present in `scoring/findings-register.csv`; report generation is a rendering step, not an analysis step."

## When to use this skill

- Wave W8 of every audit run, the final step, always after `audit-scoring-wasp-drone` completes and `scoring/audit-scorecard.xlsx` and `scoring/findings-register.csv` exist
- Regenerating a report after a manual correction to the findings register (a re-render, not a re-audit)
- Building or updating this pair's report templates or the `brand.json` config themselves
- Verifying a rendered report's four-file set satisfies prd-021's acceptance criteria (same findings across variants, AI-authorship/de-anonymization disclosed plainly in the customer register, footer credit line exactly once)

## When not to use this skill

- Before `audit-scoring-wasp-drone` has written `scoring/audit-scorecard.xlsx` and `scoring/findings-register.csv` - there is nothing to render yet, and this Stinger does not have upstream Drones' evidence-gathering authority
- To adjudicate whether a candidate finding should have been rejected, reframed, or promoted to the register - that determination belongs to the originating Drone and, for the rollup, `audit-scoring-wasp-drone`; this Stinger renders whatever verification-log disposition already exists, per `guides/04-verification-log-procedure.md`
- To decide category weights, the critical-security override, or the 0-6 scoring scale - those are `audit-scoring-stinger`'s domain (build plan section 4), consumed here only as already-final numbers

## Procedure

1. **Confirm the upstream artifacts exist.** `scoring/audit-scorecard.xlsx`, `scoring/findings-register.csv`, `_shared/evidence-index.md`. If any is missing, this run is not ready for W8; do not proceed with partial or invented data.
2. **Read `guides/01-dual-audience-structuring.md`.** Build one shared in-memory data context from the findings register; both report pairs render from it, never from two independent reads.
3. **Resolve the verification log per `guides/04-verification-log-procedure.md`.** Look for `_shared/verification-log.md` first, then a status column on the findings register, then fall back to the template's "none rejected" branch - never invent an entry.
4. **Load `references/templates/brand.json`** (or an engagement-specific override, per the layering model in `guides/02-markdown-to-html-rendering.md`).
5. **Render all four documents per `guides/02-markdown-to-html-rendering.md`**, using `references/templates/customer-report-template.md`, `references/templates/auditor-report-template.md`, and their paired `.html` shells. `references/scripts/render-report.py` is the working reference implementation of this exact pipeline against sample data - read it before writing a real renderer, do not reinvent the templating/Markdown-conversion approach from scratch.
6. **Apply the subtle-branding rules per `guides/03-subtle-branding-application.md`** as part of that render, not as a separate pass: footer credit line, mark, and website link exactly once per document (prd-021 AC-3), brand accent color scarce, JetBrains Mono reserved for technical strings, severity color kept semantically separate from brand color.
7. **State the AI-authorship and de-anonymization findings plainly in the customer report**, per prd-021 AC-2, whenever they are present in the register: probability band, method, and stated error rate for AI-authorship; presence and category for de-anonymization tooling. Never omit or vague these out of the plain-language register - this is a binding acceptance criterion, not a style choice.
8. **Write the four files to `reports/`:** `customer-report.md`, `customer-report.html`, `auditor-report.md`, `auditor-report.html`, per the folder spec in `plan/website-auditor-build-plan.md` section 3.
9. **Verify before declaring the run complete.** No unresolved template placeholder remains in any output file; the footer credit-line string appears exactly once in each HTML file; every finding ID present in the auditor report's Summary of Findings table is also represented (in translated form) somewhere in the customer report, or its absence is explainable by the customer template's own structure (raw evidence dumps only, never a whole missing finding).

## References map

| Path | Load when |
|---|---|
| `references/research/distilled-audit-reporting.md` | Verifying any structural or branding-mechanics claim, or tracing where it came from |
| `references/research/raw/` | Tracing a claim to its primary source (5 files: sitegrade, sitemapfixer, ForensicSpot, the IIA toolkit, mcp-md-html-pdf) |
| `guides/01-dual-audience-structuring.md` | Building or auditing the two report pairs' shared-data-source structure |
| `guides/02-markdown-to-html-rendering.md` | Running or extending the Markdown-to-branded-HTML rendering pipeline |
| `guides/03-subtle-branding-application.md` | Deciding where/how much brand mark and color to apply, and why this guide's placement choices are design judgment, not sourced |
| `guides/04-verification-log-procedure.md` | Rendering the verification-log section, and understanding the open question on its canonical source file |
| `references/templates/customer-report-template.md` | Starting or reviewing the customer-facing Markdown deliverable's structure |
| `references/templates/customer-report-template.html` | Starting or reviewing the customer-facing styled HTML shell |
| `references/templates/auditor-report-template.md` | Starting or reviewing the auditor-facing Markdown deliverable's structure |
| `references/templates/auditor-report-template.html` | Starting or reviewing the auditor-facing styled HTML shell |
| `references/templates/brand.json` | The brand definition every HTML shell themes from - logo, palette, fonts, footer toggles |
| `references/scripts/render-report.py` | The working, runnable reference implementation of the full render pipeline against sample data |
| `references/scripts/README.md` | Pointer to `shared/scripts/` for this domain's other deterministic scripts (none of which belong to this pair; reporting has no upstream-audit script of its own) |

## Related drones and stingers

- [audit-scoring-wasp-drone](../../agents/audit-scoring-wasp-drone.md) / [audit-scoring-stinger](../audit-scoring-stinger) - the direct upstream dependency. This pair cannot run until `audit-scoring-wasp-drone` has written `scoring/audit-scorecard.xlsx` and `scoring/findings-register.csv`; wave W8 does not start otherwise.
- [audit-intake-wasp-drone](../../agents/audit-intake-wasp-drone.md) / [audit-intake-stinger](../audit-intake-stinger) - owns the workspace scaffolding this Stinger writes `reports/` into, and the engagement reference/client-name metadata this Stinger renders into both report headers.
- Every wave W5/W6/W7 Drone (technical-seo, aeo-audit, web-security-posture, performance-cwv, accessibility-audit, analytics-stack, blog-content, ecommerce-catalog, social-presence, visual-funnel, icp-positioning, keyword-intelligence, internal-linking, content-semantics, vendor-inventory) is an indirect upstream: each one's findings and, where applicable, verification-log entries flow through `audit-scoring-wasp-drone` into the data this Stinger renders. None are read directly by this Stinger.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [audit-reporting-wasp-drone](../../agents/audit-reporting-wasp-drone.md) - this Stinger's paired Drone.
  - [audit-scoring-stinger](../audit-scoring-stinger) - the direct upstream Stinger; this pair reads what that pair populates.

## Ship Gate decision

**Not applicable at runtime, applicable at forge-commit time - two different questions, answered separately, per `queen-wasp-stinger`'s own Topic-stage distinction between "development-focused (Ship Gate)" and "research-only" components:**

- **At runtime, this Drone/Stinger pair is not development-focused in the Ship Gate sense.** Per `plan/website-auditor-build-plan.md` section 0: this whole toolset "assesses a live third-party website from the outside, with no source access, no deploy rights, and a hard read-only constraint" - the opposite posture from `security-wasp-drone`/`security-stinger`, which improve a repository the operator owns and therefore does run the security -> quality -> github-repo-health Ship Gate before every commit. `audit-reporting-wasp-drone` writes only into the audit workspace's own `reports/` folder on a target it does not own; it never touches this plugin repo's source at runtime.
- **At forge-commit time, building this pair's own files (this repository's source) IS development work on a repo the operator owns, and the Ship Gate default applies.** The build plan's own Q22 asks exactly this question and its stated default is "yes, full Ship Gate, with your approval before any commit or push" before anything from this build lands via `git commit`/`git push`.
- **Stated explicitly, both ways, per this task's instruction:** the four template files, `brand.json`, the render script, and these guides are real, non-empty, committed-to-this-plugin-repo deliverable files - not a spec document describing what they would contain. `references/scripts/render-report.py` was executed against a sample data dict during this authoring pass and ran to completion with no unresolved placeholders and the footer credit-line count verified at exactly one per HTML file (prd-021 AC-3), which is the standard this repo's own `queen-wasp-stinger` sets for a References-stage deliverable ("reusable templates, deterministic scripts... material the component loads on demand... earns its tokens or it goes").
- **Whether the Ship Gate has actually run for this specific change is a repo-state fact, not a content fact:** at the time this pair's stages 4-6 were authored, this working directory was not yet a git repository (no `.git`), matching the same situation `library/requirements/reports/step1-get-started-setup-report.md` already recorded for this repo's earlier setup work. The Ship Gate (`security-stinger` -> `quality-stinger` -> `github-repo-health-stinger`, per `plan/website-auditor-build-plan.md` Q22's default) therefore applies once this repository is formalized under git and a commit is about to happen, not to the act of authoring these files on disk.
