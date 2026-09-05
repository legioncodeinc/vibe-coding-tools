# Template: Phase 0 done-checklist (per app)

> Copy this file into the ADR-007 follow-up PRD (or a per-app tracking doc) and
> fill it in as Phase 0 progresses for each SvelteKit app. Phase 1 cannot
> start until every box is checked.

**App:** `apps/<portal|web|wl>` (circle one)
**Date started:** ______
**Date completed:** ______

## Floor verification (per `guides/01-installation-phase-0.md` Step 1)

- [ ] `svelte` is `^5.33` or higher in `apps/<app>/package.json`
- [ ] `@sveltejs/kit` is `^2.21` or higher
- [ ] `vite` is `^6.3` or higher
- [ ] Tailwind NOT previously present (greenfield v4 adoption)

## Tailwind v4 wired (Step 2)

- [ ] `npx sv add tailwind` ran successfully
- [ ] `tailwindcss`, `@tailwindcss/vite`, `tailwind-merge`, `clsx`,
      `tailwind-variants` are in dependencies
- [ ] `vite.config.ts` has `tailwindcss()` AND all pre-existing plugins
      (sentrySvelteKit, copyErrorGifsPlugin, etc.)
- [ ] `src/app.css` exists with `@import "tailwindcss";`
- [ ] `src/routes/+layout.svelte` imports `./app.css`

## shadcn-svelte initialized (Step 3)

- [ ] `npx shadcn-svelte@latest init` ran with OSPRY answers
- [ ] `$lib/utils.ts` exports `cn()`
- [ ] `components.json` exists at app root
- [ ] `src/app.css` has the `:root`, `.dark` (or `.light`), `@theme inline`,
      and `@layer base` blocks

## Token bridge authored (Step 4, per `guides/02-token-bridge.md`)

- [ ] `:root` block re-points every shadcn-svelte token at a PRD-071 token
      (table in `guides/02-token-bridge.md`)
- [ ] `--primary` points at `--interactive` (NOT `--brand-primary`, green-scarce)
- [ ] `--ring` points at `--border-focus` (WCAG 2.4.11)
- [ ] `--destructive` is the one allowed literal (`oklch(0.577 0.245 27.325)`)
- [ ] `@theme inline` block is UNCHANGED from `init` output (the `inline`
      keyword is preserved)
- [ ] `@layer base` block is UNCHANGED from `init` output
- [ ] Dark-first inversion (`guides/04-dark-mode-inversion.md`) chosen and
      documented in `app.css` comments

## Import order (per `guides/01-installation-phase-0.md`)

- [ ] `+layout.svelte` imports in this order:
      `tokens.css` → `brand.css` → `base.css` → `shell.css` → `app.css`
- [ ] No import order regressions for existing stylesheets

## Verification (Step 5)

- [ ] A copy-in `<Button variant="default">` renders OSPRY blue (`--interactive`)
- [ ] The button picks up a resolved agency brand via `--brand-accent`
- [ ] Default paint is dark (no FOWT)
- [ ] Legacy `base.css` / `shell.css` surfaces render unchanged
- [ ] Manual check of: shell, nav, one representative dashboard screen
- [ ] No existing surface visually regressed

## Resolved decisions (ratified 2026-06-30, carry into the PRD as-is)

- [x] Dark-mode inversion: **Option A** (`:root` = dark, `[data-theme="light"]` = light)
- [x] Token mapping: see the reverse brand guide at
      `references/design-system/ospry-shadcn-svelte-token-bridge-guide.html`
- [x] Upstream-sync cadence: **monthly** for behavior/accessibility patches,
      **same-day** for security advisories
- [x] Escape-hatch enforcement: **lint rule** in CI (arbitrary-value colors,
      literals in `tv()` factories, `style={` interpolations)

## Sign-off

- [ ] Phase 0 complete for this app; ready for Phase 1 surface migration
