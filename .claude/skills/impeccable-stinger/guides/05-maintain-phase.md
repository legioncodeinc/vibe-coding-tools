# 05 — Maintain Phase (cohesion)

Derived from `research/09-maintenance-doctor.md`.

## The two commands that close the gap

1. **`/impeccable extract <target>`** — find patterns used 3+ times with the same intent; propose tokens and primitives; consolidate drift before it solidifies.
2. **`/impeccable document`** — re-capture the system: scans tokens, components, and rendered routes, writes `DESIGN.md` in Stitch format. The more it points at real components and live routes, the closer it reads your design language.

## Doctor (three kinds of "out of date")

- **Tool version** — installed skill older than published; `npx impeccable update` fixes.
- **Schema drift** — artifact written by an older Impeccable; mechanical, doctor repairs most of it.
- **Truth drift** — code moved on and the document no longer describes it; route to `init`/`document`, never auto-repair.

`/impeccable doctor` also checks: config unknown keys, ignored rule ids that no longer exist, ignored file paths that are gone, `projectRoots` globs matching nothing, hook script paths that stopped resolving, orphaned surface briefs, and monorepo apps inheriting a web-only root record while carrying native build files.

## Rules

- **Never repair drift as a side effect of a design task.** A `CONTEXT_STALE` finding is reported, not acted on, unless the user asks (except `auto` findings).
- Run `npx impeccable check` / `update` on a cadence; the installed side self-updates, the stinger's vendored reference needs a manual refresh cadence.
- Every new element or surface inherits the established world unless the classification says greenfield; the detector's design-system rules mechanically flag drift.
