# 03. Template hydration

Why and how `audit-intake-wasp-drone` hydrates downstream templates with the four intake answers at scaffold time, not at report time. This guide is the depth layer for the third of this Drone's three goals stated in PRD-002.

## Why at scaffold time

PRD-002's goals state hydration happens "at scaffold time, not at report time, so a mid-run failure doesn't lose intake data." The reasoning: `auditor_name`, `contact_name`, `business_name`, and `website_url`/`domain` are needed by templates that other Drones write much later in the run (the XLSX cover sheet in wave W7, report headers in wave W8). If those four values were only recorded in `00-intake/answers.md` and left for the scoring/reporting Drones to re-read and re-populate themselves, a failure anywhere in the eight-wave run would leave those late-stage templates without the values, and every downstream Drone would need its own logic to go find and re-parse the intake record. Hydrating once, at scaffold time, into every template that carries these fields removes that dependency entirely.

No source in this pair's research archive discusses template-hydration mechanics directly (distilled research section 6: "No source in this archive discusses... template-hydration mechanics"). This entire guide is therefore this Drone's own engineering procedure, built to satisfy PRD-002's stated goal and acceptance criterion, not a sourced practice.

## What "no `{placeholder}` tokens remaining" means (PRD-002 AC-3)

AC-3 requires that once scaffolding completes, inspecting any downstream template (XLSX cover, report headers) shows the auditor name, contact name, business name, and domain already populated, with **no `{placeholder}` tokens remaining for those four fields specifically**. This does not mean every placeholder in every template must be resolved at this stage - templates carry many other fields (scores, findings, dates of later events) that legitimately remain unpopulated until their owning Drone runs. Only the four intake-sourced fields are this Drone's responsibility to hydrate.

## Procedure

1. After workspace scaffolding completes (`02-workspace-scaffolding.md`), identify every template file this Drone is responsible for hydrating. At minimum: the `scoring/audit-scorecard.xlsx` cover-sheet fields (per build plan section 4.4, the `Cover` sheet holds "Auditor, audited party, business, domain, date, engagement reference") and the header blocks of the `reports/` templates (`customer-report.md`/`.html`, `auditor-report.md`/`.html`). These template source files themselves belong to `audit-scoring-stinger` and `audit-reporting-stinger` (their own pairs, not yet forged past stage 1 as of this writing); if the XLSX/report template files do not yet exist on disk when this Drone runs against a real engagement, that is a build-sequencing gap in the plugin as a whole, not something this Drone should paper over by inventing template content that belongs to another pair.
2. For each, replace the four token fields (`{auditor_name}`, `{contact_name}`, `{business_name}`, `{domain}`) with the confirmed intake values. Also populate the date and engagement reference where those fields exist, since they are derived directly from the intake step (timestamp, domain-plus-date) rather than from any later Drone's work.
3. Do not touch any other field in these templates. Scores, findings, and content-derived fields belong to the Drones that own those sections; this Drone's hydration pass is scoped to exactly the four intake fields plus date/engagement reference.
4. Record each hydrated file as a row in `_shared/evidence-index.md`, per the append rule in `references/templates/evidence-index-stub-template.md`.

## Verification before declaring this Drone's work complete

Before marking `audit-intake-wasp-drone`'s status as `complete` in `_shared/run-ledger.json`, re-open every template touched in step 2 and confirm no `{auditor_name}`, `{contact_name}`, `{business_name}`, or `{domain}` token remains anywhere in it. This is the literal check PRD-002 AC-3 describes, and it is cheap enough to run as a final step every time rather than trusting that step 2 succeeded silently.
