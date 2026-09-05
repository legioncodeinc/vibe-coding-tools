# Example: migrating a bespoke button to `<Button>`

> A worked before/after of the Phase 1 unit: one button on one surface.
> Demonstrates `06-surface-migration.md` end to end.

**Guides demonstrated:** `../guides/03-component-anatomy.md`,
`../guides/06-surface-migration.md`, `../guides/05-white-label-preservation.md`.

## Before (bespoke, in a portal route)

```svelte
<!-- apps/portal/src/routes/(app)/settings/+page.svelte -->
<script lang="ts">
  let saving = $state(false);
  async function save() {
    saving = true;
    // ... save logic ...
    saving = false;
  }
</script>

<button
  class="save-btn"
  disabled={saving}
  on:click={save}
>
  {saving ? "Saving..." : "Save changes"}
</button>

<style>
  .save-btn {
    background: var(--interactive);
    color: var(--text-inverse);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 150ms ease;
  }
  .save-btn:hover {
    background: var(--accent-blue-hover);
  }
  .save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .save-btn:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
</style>
```

**Problems with the bespoke version:**

- 25 lines of `<style>` for one button: exactly the drift ADR-007 ends.
- Hand-rolled focus ring (works, but the copy-in's is more robust).
- Hand-rolled hover/disabled: the variant handles these.
- If the agency brand changes, this button tracks it via `--interactive`, but
  only because the author happened to use that token. A different bespoke
  button might hard-code `#2BA8FF` and silently break white-label.

## Step 1: Copy in Button (if not present)

```bash
cd apps/portal
npx shadcn-svelte@latest add button
```

Confirm `$lib/components/ui/button/{index.ts,button.svelte}` exists and matches
the anatomy in `03-component-anatomy.md`.

## Step 2: Swap the markup

```svelte
<!-- apps/portal/src/routes/(app)/settings/+page.svelte -->
<script lang="ts">
  import { Button } from "$lib/components/ui/button";

  let saving = $state(false);
  async function save() {
    saving = true;
    // ... save logic ...
    saving = false;
  }
</script>

<Button variant="default" onclick={save} disabled={saving}>
  {saving ? "Saving..." : "Save changes"}
</Button>

<!-- No <style> block. -->
```

**What changed:**

- `on:click` → `onclick` (Svelte 5 runes mode).
- 25 lines of CSS deleted.
- `variant="default"` resolves (via the token bridge) to `bg-primary` →
  `--primary` → `--interactive` → OSPRY blue (or the agency brand via
  `--brand-accent`).
- `disabled={saving}` works out of the box (the variant has
  `disabled:opacity-50 disabled:pointer-events-none`).
- Focus ring comes from the variant's `focus-visible:ring-1 focus-visible:ring-ring`.

## Step 3: Verify (per `06-surface-migration.md` Step 5)

1. **Visual:** the button looks the same (OSPRY blue background, inverse text,
   correct padding, rounded).
2. **Hover:** background shifts to `--accent-blue-hover` (the variant's
   `hover:bg-primary/90` darkens primary 10%: verify this matches the bespoke
   hover; if not, add `class="hover:bg-accent-blue-hover"` to override).
3. **Disabled:** opacity drops to 50%, cursor is not-allowed.
4. **Focus:** ring appears on keyboard focus, not on mouse click.
5. **White-label:** resolve an agency brand server-side; the button picks up
   the agency color via the chain in `05-white-label-preservation.md`.
6. **Submit:** confirm `type="button"` is correct here (it is, this is a
   save action triggered by `onclick`, not a form submit). If it were a form
   submit, pass `type="submit"`.

## Step 4: Commit

```
ux-ui-svelte: migrate settings save button to <Button>

ADR-007 Phase 1. Replaces 25 lines of bespoke button CSS with the copy-in
<Button> primitive. The token bridge handles theming; the white-label
contract flows through --primary → --interactive → --brand-accent.
```

## An edge case: the button needs an icon

shadcn-svelte's Button supports child content. For an icon + label:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Loader2, Save } from "@lucide/svelte";  // or wherever icons live
</script>

<Button variant="default">
  <Save class="h-4 w-4" />
  Save changes
</Button>

<Button variant="default" disabled>
  <Loader2 class="h-4 w-4 animate-spin" />
  Saving...
</Button>
```

The variant's `base` includes `inline-flex items-center gap-2`, so the icon and
label align without extra CSS.

## An edge case: the button is actually a link

```svelte
<!-- Renders an <a> because href is set — no separate variant needed -->
<Button variant="outline" href="/settings">
  Go to settings
</Button>
```

Per `03-component-anatomy.md`, the Button component renders `<a>` when `href`
is set. The variant classes apply to the `<a>`.

## What NOT to do

- **Do not** wrap the bespoke button in a new bespoke wrapper. Replace it.
- **Do not** keep the `<style>` block "just in case." Delete it; the drift
  accumulates if you leave it.
- **Do not** pass `class="bg-[#2BA8FF]"` to override the color. Use the token
  (`bg-primary` via the variant, or add a token if the color is genuinely new).
- **Do not** change `variant="default"` to a hand-rolled `class=...` that
  re-implements the default. The variant IS the default.
