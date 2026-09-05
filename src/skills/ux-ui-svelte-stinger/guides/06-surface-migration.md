# 06: Surface-by-surface migration (Phase 1+)

> ADR-007 Decision E: the rollout is phased and incremental. Each primitive
> migrates one surface at a time. This guide is the per-surface procedure and
> the upstream-sync discipline.

**Research:** `../research/shadcn-svelte-cli.md` (the `add` and `diff`
commands), `../research/shadcn-svelte-button-component.md` (the copy-in
shape), `../research/shadcn-svelte-theming.md`.

## The migration unit

A "surface" is one place a primitive is used: a button on a screen, a dialog
in a flow, an input in a form. The migration unit is **one primitive on one
surface**, not "all buttons everywhere." This is what makes the rollout
reversible and low-risk.

Each migration is a small, reviewable PR: copy in the component (if not already
present), swap the bespoke markup for the component, delete the now-dead
`<style>` block, verify the surface.

## The per-surface procedure

### Step 1: Confirm Phase 0 is done for the app

Before migrating any surface, the app must have Tailwind v4 + the token bridge
in place (`01-installation-phase-0.md` done-ness checklist). Migrating a
surface before Phase 0 means the copy-in component renders un-themed.

### Step 2: Copy in the component (if not present)

```bash
cd apps/<app>
npx shadcn-svelte@latest add <component>
```

Per `../research/shadcn-svelte-cli.md`, this writes to
`$lib/components/ui/<component>/`. If the component is already present (from a
prior surface migration), skip this step: reuse the existing copy.

**Inspect the copied-in source** against `03-component-anatomy.md`. Confirm
the four universal patterns are intact. If the registry shipped something
unusual, read it before using.

### Step 3: Identify the bespoke surface to replace

Grep for the surface. Example for a button:

```bash
grep -rn 'class="btn\|class="button\|<button' apps/portal/src/routes/<route>/
```

Read the existing markup and its `<style>` block. Note:

- What variant is needed (`default`, `outline`, `ghost`, etc.).
- What size is needed.
- Whether the button is a link (renders `<a>` via `href`).
- Any OSPRY-specific behavior (a `disabled` state tied to a form, an icon).

### Step 4: Swap the markup

Replace the bespoke element with the copy-in component:

```svelte
<!-- Before -->
<button class="btn-primary" on:click={save}>
  Save changes
</button>

<style>
  .btn-primary {
    background: var(--interactive);
    color: var(--text-inverse);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }
</style>

<!-- After -->
<Button variant="default" onclick={save}>
  Save changes
</Button>
<!-- <style> block deleted -->
```

Notes:

- `on:click` → `onclick` in Svelte 5 (runes mode drops the `on:` prefix).
- The variant's classes come from `buttonVariants`; the bespoke `<style>` is
  dead and gets deleted.
- If the bespoke button had OSPRY-specific spacing, pass it via `class`:
  `<Button class="px-8">`. The `cn()` merge lets caller overrides win.

### Step 5: Verify the surface

1. **Visual:** the surface renders identically to before (or intentionally
   better: the token bridge may resolve a color the bespoke style got wrong).
2. **Behavior:** click/submit/focus all work. The copy-in component's
   accessibility (focus ring, keyboard activation) should be AT LEAST as good
   as the bespoke version.
3. **White-label:** if the surface is a primary action, resolve an agency brand
   and confirm it picks up the brand color via the chain in
   `05-white-label-preservation.md`.
4. **Dark mode:** confirm the surface renders correctly in the OSPRY dark
   default (`04-dark-mode-inversion.md`).

### Step 6: Delete the dead `<style>` block

The bespoke styles for the migrated element are dead. Delete them. Leaving
them is how drift re-accumulates. If a `<style>` block served multiple elements
and only one migrated, delete only the migrated element's rules.

### Step 7: Commit with a scoped message

```
ux-ui-svelte: migrate <route> <element> to <Component>

Part of ADR-007 Phase <N>. Replaces bespoke <element> styling with the
copy-in <Component> primitive. The token bridge (app.css) handles theming;
the white-label contract flows through --primary → --interactive → --brand-accent.
```

## The primitive ordering (recommended)

Migrate in this order; each unlocks the next:

1. **Button**: the highest-frequency primitive. Cuts the most bespoke styles
   per surface. Validates the token bridge end-to-end.
2. **Input / Textarea / Label**: form primitives. Often paired with Button.
3. **Card**: the surface container. Many dashboard widgets become Cards.
4. **Dialog** (and AlertDialog): replaces bespoke modals. The accessibility
   win (focus trap, scroll lock, ARIA) is large.
5. **Toast / Sonner**: replaces bespoke notifications.
6. **Select / Checkbox / Switch**: form controls with non-trivial behavior.
7. **Tabs / Tooltip / Popover**: layout and overlay primitives.
8. **Table**: data display. Migrate last (highest bespoke complexity).

The ordering is a recommendation, not a rule. If a specific PRD needs Dialog
before Button, do Dialog first.

## New screens and components (from Phase 0 forward)

Once Phase 0 lands for an app, **every new screen and component uses
shadcn-svelte primitives from the start.** No new bespoke `<style>` blocks for
things a copy-in primitive covers. This is how the drift stops accumulating
even before the legacy surfaces all migrate.

If a new screen needs a primitive not yet copied in, copy it in as part of the
screen's PR. The `add` command is cheap.

## The upstream-sync discipline

Copy-in components are owned source. shadcn-svelte ships behavior and security
patches via the registry. Periodically check for updates:

```bash
npx shadcn-svelte@latest diff
```

Per `../research/shadcn-svelte-cli.md`, `diff` shows what changed in the
registry since your copy was made. When a relevant patch ships (an
accessibility fix, a security patch, a behavior bug):

1. **Read the diff.** Understand what changed and why.
2. **Check for OSPRY-specific edits.** If the local copy has an
   `// OSPRY:` marker (per `03-component-anatomy.md`), make sure the merge
   preserves it.
3. **Re-add the component with `-o` (overwrite)** or manually merge the diff.
4. **Re-verify the surface** per Step 5 above.

**Cadence (resolved 2026-06-30):**

- **Monthly cadence:** run `shadcn-svelte diff` once a month as a standing
  task, and roll up behavior patches and accessibility fixes into a single
  merge PR per month.
- **Same-day for security:** if shadcn-svelte, Bits UI, Melt UI, or
  `tailwind-variants` publishes a security advisory, run `diff` that day,
  review the security-relevant changes, and ship a hotfix PR; do not wait for
  the monthly batch.

## When NOT to migrate a surface

- **When the bespoke surface has behavior the copy-in does not cover** and
  cannot easily be extended to cover. Document the gap; revisit when the
  primitive matures or escalate to `design-system-worker-bee`.
- **When the surface is on `apps/cms`, `apps/cmp`, or `apps/edge/*`**: out of
  scope per ADR-007.
- **When Phase 0 is not done for the app**: the component would render
  un-themed.
- **When the migration would change behavior, not just styling**: split it
  into two PRs (behavior change first, then the style migration) so each is
  reviewable on its own.
