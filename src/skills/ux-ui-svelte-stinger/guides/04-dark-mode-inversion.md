# 04: Dark-mode inversion (OSPRY is dark-first), Option A

> **Resolved (decision owner, 2026-06-30): Option A.** Keep `:root` as the dark
> theme (matching OSPRY's existing `tokens.css`); carry the light theme under
> the `[data-theme="light"]` attribute selector (the convention `tokens.css`
> already uses). This guide is now prescriptive, not exploratory.

**Research:** `../research/shadcn-svelte-dark-mode.md` (the `.dark` class
strategy, `mode-watcher`, OSPRY inversion analysis), `../research/shadcn-svelte-theming.md`.

## The mismatch, and how Option A resolves it

shadcn-svelte's convention (per `../research/shadcn-svelte-dark-mode.md`):

- `:root` carries the LIGHT theme tokens.
- `.dark` (a class on `<html>` or an ancestor) carries the DARK theme tokens.
- `mode-watcher` toggles the `.dark` class and persists preference.

OSPRY's reality (per `apps/portal/src/lib/styles/tokens.css`):

- `:root` carries the DARK theme tokens (`--bg-canvas: #0A0B0D`, etc.).
- The LIGHT theme lives under `[data-theme="light"]` (the attribute selector
  `tokens.css` already uses: see lines 326-437).
- The default paint IS dark; light is the opt-in secondary state.

**Option A reconciles them by inverting shadcn-svelte's convention to match
OSPRY's existing `tokens.css` shape:**

```css
@import "tailwindcss";

/* OSPRY INVERSION: :root IS the dark theme (PRD-071 dark-first). */
@custom-variant dark (&:is([data-theme="dark"] *, [data-theme="dark"]));

:root,
[data-theme="dark"] {
  /* DARK theme — the OSPRY default */
  --background: var(--bg-canvas);
  --foreground: var(--text-primary);
  /* ... the full dark mapping from 02-token-bridge.md ... */
}

/* LIGHT theme — opted into via data-theme="light" on <html>
 * (matches the selector tokens.css already uses). */
[data-theme="light"] {
  --background: var(--bg-canvas);   /* tokens.css swaps --bg-canvas under this attribute */
  --foreground: var(--text-primary);
  /* ... same mapping; the PRD-071 token VALUES swap because [data-theme="light"]
   *     redefines them in tokens.css. The bridge references stay identical. ... */
}
```

**Why Option A over Option B:**

- OSPRY's `tokens.css` already encodes the dark theme in `:root` and the light
  theme in `[data-theme="light"]`. Option A reuses that exact structure: no
  re-deriving of any token.
- The bridge references (`var(--bg-canvas)` etc.) are IDENTICAL in both blocks
  because the PRD-071 tokens themselves swap under `[data-theme="light"]`. The
  bridge does not need to know which theme is active.
- The default paint is dark with zero JS: no flash-of-wrong-theme (FOWT), no
  `mode-watcher` inline-script race.

## The `dark:` variant under Option A

shadcn-svelte copy-in components use `dark:` variants sparingly (they mostly
rely on the token swap). Re-declare the variant to fire when
`data-theme="dark"` (or the default) is present:

```css
@custom-variant dark (&:is([data-theme="dark"] *, [data-theme="dark"]));
```

Because `:root` is dark and OSPRY's default theme attribute is `dark`, this
fires by default. To opt into light, set `data-theme="light"` on `<html>`. No
inline-script class toggling needed.

## The FOWT concern

OSPRY's dark-first default means there is NO flash-of-wrong-theme on initial
paint: the SSR'd HTML carries the dark tokens in `:root`, and the first paint
is dark. This is better than the light-first convention, where `mode-watcher`'s
inline script must run before paint to swap to dark.

If a user opts into light and reloads, the SSR should set `data-theme="light"`
on `<html>` at request time (read from the persisted preference / cookie), so
the first paint is already light. No client-side swap, no FOWT.

## When light mode is actually needed

Today, OSPRY is dark-only in practice. Light mode is a future surface (some
agency white-labels may want it, some marketing pages on `apps/web` may want
it). Until then:

- Do not wire a theme toggle unless a concrete need appears.
- Do not author `dark:` / `light:` variants preemptively.
- Keep the `[data-theme="light"]` bridge block in `app.css` (it costs nothing
  and keeps the path open), but the real light token values already live in
  `tokens.css`.

When a real light-mode need lands, author it as a deliberate addition: wire
the SSR-side attribute, add the toggle, test for FOWT.

## Common dark-mode mistakes

- **Bridging `:root` to light tokens** because "shadcn-svelte does it that way."
  No. OSPRY is dark-first; `:root` is dark.
- **Using `.light` / `.dark` classes instead of `data-theme`**: OSPRY's
  `tokens.css` uses `[data-theme="light"]`. Match it; do not introduce a parallel
  class-based selector.
- **Adding `mode-watcher` by default** when there is no light theme to toggle
  to: dead weight and a FOWT risk.
- **Using `dark:bg-foo` variants to "fix" a token that should swap via the
  `[data-theme]` blocks**: the token swap is the mechanism; `dark:` variants
  are for one-off overrides only.
- **Forgetting to re-declare the `dark:` `@custom-variant`** so it fires under
  `data-theme="dark"`: without it, copy-in components' `dark:` variants stay
  dark when the user opts into light.
