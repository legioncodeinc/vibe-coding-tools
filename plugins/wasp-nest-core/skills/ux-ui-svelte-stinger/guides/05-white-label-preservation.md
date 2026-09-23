# 05: White-label brand contract preservation

> ADR-007 Decision D: the `brand.css` `--brand-*` contract and the
> `render-guard.ts` server gate survive the shadcn-svelte migration unchanged
> in mechanism. This guide is the verification and the rules that keep that
> true.

**Research:** `../research/shadcn-svelte-theming.md` (tokens flow through
everywhere), `../research/tailwind-v4-theme-variables.md` (the `inline`
propagation that makes white-label work).

## The existing white-label contract

From `apps/portal/src/lib/styles/brand.css` and the server
`apps/portal/src/lib/server/branding/render-guard.ts`:

- A bounded set of `--brand-*` variables (`--brand-accent`,
  `--brand-accent-2`) is the ONLY style sink for an agency's brand.
- `render-guard.ts` validates everything server-side: colors flow ONLY into
  these variables (gated), asset URLs flow only into `src`/`href` after URL
  validation, text is HTML-escaped.
- There is NO raw-CSS / free-text-style field anywhere (a security property).
- `brand.css` propagates the brand accent into the semantic surfaces:
  ```css
  :root {
    --brand-accent: var(--brand-primary);
    --brand-accent-2: var(--brand-primary-hover);
    --sight: var(--brand-accent);
    --app-accent: var(--brand-accent);
    --text-link: var(--brand-accent);
    --border-focus: var(--brand-accent);
  }
  ```
- The SSR'd `<head>` emits `:root{--brand-accent:<token>;--brand-accent-2:<token>}`
  for a resolved agency brand, BEFORE paint, so there is no flash of wrong brand.

## How shadcn-svelte picks up the brand (the chain)

The token bridge (`02-token-bridge.md`) points `--primary` at `--interactive`.
The `brand.css` contract re-points `--interactive`-adjacent tokens at
`--brand-accent` (verify the exact propagation in `brand.css`).

So the chain is:

```
agency brand color (server-validated)
  → --brand-accent (SSR'd in <head>, before paint)
    → --interactive (via brand.css re-points)
      → --primary (via the app.css token bridge)
        → bg-primary (Tailwind v4 @theme inline utility)
          → <Button> rendered background
```

A shadcn-svelte `<Button variant="default">` therefore renders with the
agency's brand color, with ZERO component edits and ZERO new CSS surfaces.

**This is the load-bearing claim of ADR-007 Decision D.** Verify it on every
Phase 0 completion and every primary-action surface migration.

## The verification procedure

Run this whenever Phase 0 lands for an app, and whenever a primary-action
surface (Button, the nav active state, links) migrates:

1. **Resolve an agency brand server-side.** Use the existing test fixture or a
   known agency with a non-default `--brand-accent`.
2. **Inspect the SSR'd HTML `<head>`.** Confirm
   `:root{--brand-accent:<agency-token>;--brand-accent-2:<agency-token>}` is
   present in the initial server response (not injected client-side).
3. **Render a copy-in `<Button variant="default">`** on a test route.
4. **Inspect the rendered button's computed `background-color`.** It must
   resolve to the agency brand color, NOT the default OSPRY blue, NOT a
   shadcn default.
5. **Switch to a different agency** (or no agency). The button must re-resolve
   to the new brand (or the default) with no hard-coded override.

If any step fails, the break is almost always in the chain above, usually
either:

- The `app.css` bridge points `--primary` at a fixed token instead of
  `--interactive` (which is what `brand.css` re-points). Fix the bridge.
- `brand.css` is imported AFTER `app.css`, so its re-points are overridden.
  Fix import order.
- A copy-in component hard-codes `bg-blue-500` instead of `bg-primary`. Fix
  the component (it violates Pattern 1 of `03-component-anatomy.md`).

## The rules that preserve the contract

### Rule 1: No new raw-CSS surface for theming

The `--brand-*` variables are the only brand sink. Do NOT:

- Add a `style="background: <agency color>"` to a component.
- Add a new CSS custom property for an agency to theme.
- Allow an agency to inject a stylesheet or a `<style>` block.

If an agency needs a new theming knob, the answer is: add it to the bounded
`--brand-*` set in `brand.css`, validate it in `render-guard.ts`, then bridge
it through. Never bypass the gate.

### Rule 2: shadcn-svelte components theme via the bridge, not via props

A copy-in `<Button>` does not take a `brandColor` prop. It themes via
`--primary`, which the bridge chains to `--brand-accent`. Do not add brand
props to components; do not let a caller pass an agency color inline.

### Rule 3: The server gate stays server-side

`render-guard.ts` runs at SSR. shadcn-svelte components render on the server
too (SvelteKit SSR). The brand color is in the SSR'd `:root` before any
component renders. Do not move brand resolution client-side; do not add a
client-side fetch that re-themes after paint.

### Rule 4: Test the gate's security property periodically

The reason `render-guard.ts` exists is that an agency could otherwise inject
arbitrary CSS (an XSS vector via `style`/`<style>`/`url()`). The bounded
`--brand-*` set + server validation is the defense. shadcn-svelte does not
weaken this, but a careless edit (adding a `style={...}` prop that interpolates
an agency value) would. Audit copy-in components for any prop that takes a
raw string and lands it in `style=` or `class=` un-`cn()`-merged.

## What changes vs what stays

**Changes (Phase 0):**

- `app.css` is added, with the token bridge pointing `--primary` at
  `--interactive`.
- shadcn-svelte components are copied in and render via the bridge.

**Stays (verbatim):**

- `brand.css`: the bounded `--brand-*` contract.
- `render-guard.ts`: the server validation gate.
- The SSR `<head>` brand-emission mechanism.
- The "no raw-CSS / free-text-style field anywhere" security property.

The migration is designed so that an agency brand configured today continues
to render identically after Phase 0, just flowing through a longer (but
still single-path) chain.
