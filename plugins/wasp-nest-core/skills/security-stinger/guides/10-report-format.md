# 10. Report format

The report is not optional and is not skippable even on a clean audit. Use [references/audit-output-format.md](../references/audit-output-format.md) as the skeleton - fill it in, do not improvise a different section order.

## Destination

Per Library Schema v2's `library/requirements/reports/README.md` convention:

- Standalone audit: `library/requirements/reports/<YYYY-MM-DD>-security-audit.md`
- Feature-tied: `library/requirements/{backlog,in-work,completed}/prd-<###>-<slug>/qa/<YYYY-MM-DD>-security-audit.md`
- Issue-tied: `library/issues/{backlog,in-work,completed}/ird-<###>-<slug>/qa/<YYYY-MM-DD>-security-audit.md`

Determine which applies from the branch/plan under audit before writing anything - do not default to the standalone path out of convenience if the work is actually tied to a specific PRD or IRD.

## What "done" looks like for the report itself

- Every surface in [references/audit-checklist.md](../references/audit-checklist.md) has an entry, even if it's "None detected." A missing section is indistinguishable from "not checked" to a downstream reader, which defeats the purpose of the report.
- Every finding has a `path/to/file.ts:LINE` citation and a quoted vulnerable pattern - evidence over opinion, per [01-audit-procedure.md](01-audit-procedure.md).
- Every finding has a severity assigned per [references/severity-rubric.md](../references/severity-rubric.md), assigned BEFORE remediation began, not adjusted after the fact to match whatever got fixed.
- The re-evaluation section is filled in truthfully: either it documents a completed re-evaluation pass after Medium-or-above fixes landed, or it states plainly that no such fixes were required.
- The "next step" section states unambiguously whether the branch is cleared to proceed to `quality-stinger`, or what's still blocking.

## Report is not the last step

Producing the report does not itself clear the Ship Gate. Per the Ship Gate contract (reproduced verbatim in `SKILL.md`): all Medium-or-above findings must be resolved, followed by another full re-evaluation pass, before proceeding to `quality-stinger`. The report documents that this happened; it does not substitute for it. The user must also have the opportunity to review the report and the agent's summary and approve committing/pushing before that happens - this skill does not commit or push code itself, and does not tell the orchestrating agent to skip that approval step.
