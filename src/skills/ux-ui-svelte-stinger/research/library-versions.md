# Library versions (research snapshot)

> The version pins this research corpus was gathered against, 2026-06-29. These
> are the "current 2026" versions cited by the official docs at research time.

## The decision stack (ADR-007)

| Library | Version (2026-06) | Role |
|---|---|---|
| Svelte | 5.x (runes stable) | The runtime; shadcn-svelte 1.x requires Svelte 5 |
| SvelteKit | 2.x | The app framework (portal, web, wl all run this) |
| **shadcn-svelte** | **1.x** (CLI 1.3.0 at research time) | The copy-in component layer |
| Tailwind CSS | **v4** (v4.3 at research time) | CSS-first utility layer; the `@theme` token bridge |
| `@tailwindcss/vite` | matches v4 | The dedicated Vite plugin (replaces PostCSS plugin) |
| Bits UI | v2 (headless primitives) | What shadcn-svelte is built on; appears in copy-in source |
| Melt UI | current | What Bits UI is built on (lowest layer; rarely touched directly) |
| `tailwind-variants` (`tv`) | current | The variant engine shadcn-svelte uses (Svelte equivalent of React's CVA) |
| `clsx` + `tailwind-merge` | current | The `cn()` merge utility dependencies |
| `mode-watcher` | current | The dark-mode helper shadcn-svelte recommends |

## Why these versions matter for OSPRY

- The portal/web/wl apps already run **Svelte 5.33+ and SvelteKit 2.21+** (per
  `apps/*/package.json`), so the Svelte 5 / SvelteKit 2 floor is already met.
- The repo has **zero Tailwind today**, so there is no v3-to-v4 migration to
  run. We adopt Tailwind v4 natively. This is simpler than the shadcn-svelte
  "Tailwind v4 migration" guide assumes (that guide targets projects coming off
  v3 + Svelte 4).
- The `@tailwindcss/vite` plugin is the install path for Vite-based SvelteKit
  apps (portal uses `@sveltejs/vite-plugin-svelte` + Vite 6 already).

## Drift policy

When a major version of shadcn-svelte, Tailwind, or Bits UI ships:

1. Write a fresh `YYYY-MM-DD-<library>-vX-migration.md` note here.
2. Update this file.
3. Update the affected guide(s) under `../guides/`.
