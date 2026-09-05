# dark-mode-theming-worker-bee

## Domain
This Bee owns the runtime theming layer for React/Next.js apps in this repo: the surface that turns design tokens into theme-aware CSS variables and wires them to user preference. That spans `prefers-color-scheme` detection, `next-themes` integration, flash-of-wrong-theme (FOWT) prevention scripting, SSR hydration safety, Tailwind v4 dark-mode configuration, and multi-brand or white-label runtime theme swapping via CSS variable overrides.

## Paired Stinger
[dark-mode-theming-stinger](../../dark-mode-theming-stinger) - the token architecture, next-themes wiring, FOWT prevention, and SSR hydration guides, plus the six non-negotiables checklist.

## Trigger phrases
- "set up dark mode"
- "next-themes keeps flashing"
- "dark mode on SSR"
- "multi-brand theming"
- "CSS variable token layer"
- "Tailwind v4 dark mode"
- "suppress hydration warning"
- "FOWT fix"

## Do NOT route when
- The ask is creating a color palette or picking brand colors from scratch: that's design-system-worker-bee, which owns token source-of-truth.
- The ask is which token to apply to a specific component's visual state: that's ux-ui-svelte-worker-bee.
- The ask is designing the `user_preferences.theme` database schema: that's db-worker-bee.
- The ask is validating a `data-brand` value pulled from user input: that's security-worker-bee.
- The ask is auth-gated per-user theme with RBAC: that's auth-worker-bee plus db-worker-bee.

## Inputs the Bee needs
- The existing token layer file (`globals.css` or `tokens.css`) if one exists
- `app/layout.tsx` / `pages/_document.tsx` and `pages/_app.tsx`
- Any existing `ThemeProvider` wrapper and Tailwind config version (v3 vs v4)
- Whether multi-brand or white-label theming is in scope

## Outputs
- Updated or new CSS token layer with semantic and primitive variables
- `ThemeProvider` wiring code and FOWT-prevention inline script
- An audit report scoring the setup against the six non-negotiables

## Commonly sequenced with
- design-system-worker-bee: supplies the palette and token source of truth this Bee wires into runtime theming
- ux-ui-svelte-worker-bee: decides which token applies to which component state
- security-worker-bee: reviews any brand or tenant value sourced from user input before it drives a CSS override
