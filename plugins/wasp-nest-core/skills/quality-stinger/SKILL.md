---
name: "quality-stinger"
description: "Audit a completed implementation against its PRD or IRD. Use after security review for evidence-backed QA findings. Read README.md for the guide map."
license: AGPL-3.0-or-later
---

# quality-stinger

Start with [README.md](README.md) for the workflow map and detailed references.

The Stinger that equips `quality-wasp-drone` to audit completed implementations against their source plan documentation. The Drone reads a plan, reads the diff, and produces a structured findings report classified by severity.

This SKILL.md is a navigation layer. Each step below points to a focused guide. Read the guide before acting on its step.

---

## When to invoke

Invoke `quality-wasp-drone` with this Stinger when:

- A plan's implementation work is complete and ready for the final review pass.
- `security-wasp-drone` has already run (or will run first, see below).
- The user says any of: "QA this", "audit this", "check the plan against the code", "run quality-wasp-drone", "verify the PRD was built", "is this done?".

Do **not** invoke before `security-wasp-drone`. If `quality-wasp-drone` detects it ran first, it flags the ordering violation and recommends re-running after security fixes land. Security fixes invalidate QA snapshots. See `guides/00-principles.md`.

---

## The six-step audit procedure

Each step has its own guide. Work through them in order.

1. **Locate the plan document.** `guides/01-locate-plan.md`, find the PRD/spec that guided the implementation.
2. **Inventory all changes.** `guides/02-inventory-changes.md`, `git diff <base>...HEAD` and `git status` to capture every file touched.
3. **Cross-reference plan against implementation.** `guides/03-cross-reference-audit.md`, walk every plan item and trace it to code (or mark it as a gap).
4. **Evaluate on five axes.** `guides/04-five-axis-evaluation.md`, Completeness, Correctness, Alignment, Gaps, Detrimental Patterns.
5. **Classify findings by severity.** `guides/05-severity-classification.md`, Critical / Warning / Suggestion with a decision tree.
6. **Write the findings report.** `guides/06-report-writing.md` using `templates/qa-report.md` and `templates/traceability-table.md`.

Cross-cutting reference: `guides/07-common-gaps.md` catalogs the recurring "implied but missing" patterns worth checking proactively on every audit. This is the final close-out step in the loop: it runs after `security-wasp-drone` and verifies the implementation against the source plan before merge.

---

## Critical directives

These are absolute. See `guides/00-principles.md` for the rationale behind each.

- **Evidence over opinion.** Every finding cites a specific `file.ts:LN` (or `LN-LN` range) and a short code snippet. A finding without coordinates is not actionable.
- **The plan is the source of truth.** If the plan says X and the code does Y, that is a gap, regardless of whether Y is reasonable. Do not judge plan quality; that belongs to `library-wasp-drone`.
- **Severity matters.** Critical = must fix, blocks ship. Warning = should fix. Suggestion = consider improving. Inflating severity burns the invoker's attention budget.
- **No silent passes.** Even a clean audit produces the full report. Missing report = missing audit.
- **Report, don't fix.** The Drone identifies issues; it never implements fixes. That is the invoking developer's job (or another Drone's).
- **Run after `security-wasp-drone`, never before.** If invoked first, flag the ordering violation in the report and halt.

---

## Cross-Drone relationships
- **swarm-audit-wasp-drone** runs whole-repository fleet audits (every branch, state of the union, delivery failures, next steps) and borrows this Stinger's evidence-over-opinion rule for its critic; hand single-change QA back here. See [swarm-audit-stinger](../swarm-audit-stinger).

- **`library-wasp-drone`** authors the plan. `quality-wasp-drone` audits against it. Never rewrite the plan; defer ambiguity back to `library-wasp-drone` via the Notes column of the traceability table.
- **`security-wasp-drone`** runs immediately before `quality-wasp-drone`. If the diff shows active security findings not yet resolved, flag the ordering violation and recommend re-running after fixes land.

---

## Expected output

A markdown report at one of:

- `library/requirements/<lifecycle>/prd-<###>-<title>/reports/<date>-qa-report.md` (feature audits)
- `library/issues/<lifecycle>/ird-<###>-<title>/reports/<date>-qa-report.md` (issue audits)
- `library/requirements/reports/<domain>/<date>-qa-report.md` (standalone audits with no source plan)

with these sections, in order:

1. **Summary**, 2 to 3 sentences on verdict.
2. **Scorecard**, five-axis status table.
3. **Critical Issues (must fix)**, blockers with file:line citations.
4. **Warnings (should fix)**, with file:line citations.
5. **Suggestions (consider improving)**, with file:line citations.
6. **Plan Item Traceability**, full table.
7. **Files Changed**, one-line summary per file.

Use `templates/qa-report.md` as the skeleton. Fill it; do not improvise section order. See `examples/` for three worked reports (happy path, blocker-heavy, ordering-violation).

---

## Worked examples

Read these before producing your first report. They show the voice, depth, and structure expected.

- `examples/01-happy-path-clean-audit.md`, a cleanly implemented plan with one Suggestion.
- `examples/02-blocker-heavy-audit.md`, an implementation with three Criticals and four Warnings.
- `examples/03-ordering-violation-escalation.md`, Drone invoked before `security-wasp-drone` ran; flags the violation and halts.

---

## Helpers

- `scripts/extract-plan-items.py`, parses a PRD markdown file for User Stories and Acceptance Criteria and emits a skeleton traceability table. Run before step 3 to speed extraction. See `guides/03-cross-reference-audit.md` for usage.

---

## Templates

- `templates/qa-report.md`, the findings-report skeleton. Always use this.
- `templates/traceability-table.md`, the plan-item traceability table alone, useful when you want to generate the table standalone.

---

## Report archive

Per-stinger `reports/` has been retired. The teaching set (happy-path, blocker-heavy, ordering-violation) lives in [`examples/`](examples/). Real audit reports are written to the source plan's `reports/` subfolder under `library/requirements/`, or to `library/requirements/reports/<domain>/` for standalone audits.

---

Part of The Wasp Nest, curated by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).
