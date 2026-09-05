# Reports

> This folder collects past UX/UI review runs over time. Each review follows
> the shape in `../templates/ui-review-output.md`. Past runs are kept as an
> audit trail of what was flagged, what was fixed, and how the standardization
> health trended over the ADR-007 rollout.

## Naming convention

`<YYYY-MM-DD>-<app>-<surface-or-pr>.md`

Examples:

- `2026-07-15-portal-button-migration-sweep.md`
- `2026-08-02-web-pr-1234.md`
- `2026-09-10-portal-quarterly-drift-audit.md`

## What goes here

- Per-PR UX reviews of Svelte surfaces (use `../templates/ui-review-output.md`).
- Periodic drift audits: grep the portal/web/wl for arbitrary-value utilities,
  bespoke primitive `<style>` blocks, and other violations from
  `../guides/07-violations-and-guardrails.md`, and record the trend.
- Phase-completion summaries: when a primitive (Button, Dialog, etc.) finishes
  migrating across an app, record what was migrated, what was deferred, and
  any open issues.

## What does NOT go here

- Phase 0 done-checklists (those live in the ADR-007 follow-up PRD; the
  template is at `../templates/phase-0-done-checklist.md`).
- The ADR itself (`library/knowledge/private/architecture/ADR-007-...md`).
- Research dumps (those live in `../research/` and are read-only).
