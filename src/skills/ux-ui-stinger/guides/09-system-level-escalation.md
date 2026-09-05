# 09 — System-Level Escalation

You are an enforcer, not a founder. When a change is system-level, you hand off to `design-system-worker-bee` instead of absorbing the work yourself.

## Escalation triggers

Escalate when any of the following is true:

1. **The aesthetic is being redefined.** "We want to move from beige/glass to a darker, flatter aesthetic" — this rewrites `00-design-brief.md`'s foundational sections, not patches them.

2. **The component-library philosophy is changing.** "We're migrating from shadcn to Tamagui" — this affects every wrapper in the product and every `@theme` mapping.

3. **A foundational token is being removed or renamed.** Renaming `--color-brand` is an enterprise-scale change; every consumer needs a migration path.

4. **The motion system is being redesigned.** Replacing named buckets with a new philosophy (e.g., "no transform animations; opacity-only") is a brief-level decision.

5. **The change crosses so many `03-components/` files that per-component deltas stop making sense.** Rule of thumb: more than 8 components touched by a single conceptual change → escalate.

6. **Tenant theming is being re-architected** — e.g., moving from CSS custom properties to runtime JS theming, or introducing a per-user theme layer.

7. **Accessibility strategy is changing** — e.g., moving from "APG is the floor" to a bespoke internal spec.

## What does not escalate

- Adding a new token (that's routine; see `guides/02-token-and-utility-enforcement.md`).
- Adding a new component doc (routine).
- Adding a motion bucket (routine; see `guides/03-motion-rules.md`).
- Fixing a violation in a PR (that's literally this Angel's job).
- Wrapping a new shadcn / Mantine / Lucide primitive (routine; see `guides/08-wrapper-authoring.md`).

## The handoff note

When you escalate, produce a short markdown note to `design-system-worker-bee`. Shape:

```markdown
# Handoff: <one-line summary>

## Context
<1–2 paragraphs describing what surfaced the need, with links to the PR / issue / conversation.>

## Scope of proposed change
<Bulleted list. Be specific: which docs are affected, which tokens move, which components break.>

## Non-goals
<What is explicitly out of scope for this overhaul.>

## Recommended entry point
<Which brief section / token file / component doc `design-system-worker-bee` should open first.>

## Impact estimate
<Rough count of files/components affected, whether tenant themes need to be re-derived, whether existing feature code ships visual regressions during the migration.>

## What this Angel will do in the meantime
<Either: "enforce current rules; no new migrations to the proposed direction until the overhaul ships" or "block specific patterns already known to conflict with the proposed direction."">
```

Place the note at `<design-system-folder>/_handoffs/YYYY-MM-DD-<slug>.md` if the folder exists; otherwise attach it to the invoking issue / PR.

## After escalation

- Do not start implementing the proposed overhaul yourself.
- Do not rewrite component docs preemptively.
- Do continue to enforce the *current* system against new PRs until `design-system-worker-bee` returns with the new brief.
- When `design-system-worker-bee` returns, treat the updated brief as the new source of truth and resume the 12-step procedure against it.

---

*Cross-Angel references:*

- `design-system-worker-bee` — bootstraps and re-architects the design systems this Angel enforces.
- `asset-worker-bee` — catalogs DesignTokens (where the deploying product uses an asset registry); when tokens change, this Angel updates the token layer and notifies `asset-worker-bee` to re-catalog.
- `react-worker-bee` — architectural decisions that span UI + logic (routing, data fetching, form state). Loop in when a change crosses both domains.
