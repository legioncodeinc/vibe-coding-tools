---
source_type: internal
authority: high
relevance: medium
topic: Peer stinger boundary notes for dark-mode-theming-stinger
date_retrieved: 2026-05-20
---

# Peer Stinger Boundary Notes

## ux-ui-svelte-stinger

`ux-ui-svelte-stinger` governs per-component visual specs: spacing, typography, shadow depth, focus rings. `dark-mode-theming-stinger` governs the token layer those specs reference. The handoff: `dark-mode-theming-stinger` produces the CSS variable surface; `ux-ui-svelte-stinger` tells components which tokens to use for which visual role.

Do NOT overlap: `dark-mode-theming-stinger` should not write per-component CSS rules. `ux-ui-svelte-stinger` should not write the `:root`/`.dark` block: that is this stinger's territory.

## design-system-stinger

`design-system-stinger` interviews the user, picks a palette, and produces the token file (master tokens CSS). `dark-mode-theming-stinger` receives that file and splits it into the `:root` (light) and `.dark` (dark) variable layers. If the token file does not already have semantic/primitive separation, `dark-mode-theming-worker-bee` should propose a refactor but defer to `design-system-worker-bee` for the final token names.

## db-stinger

`db-stinger` owns the schema for server-side persisted preference: the `user_preferences` table, the `theme` column, and the RLS policy. `dark-mode-theming-stinger` documents how to read that preference at request time (middleware cookie) and wire it to the HTML attribute, but does not design the schema.

## security-stinger

`security-stinger` should audit the multi-brand injection path: if a `data-brand` value is ever derived from user-controlled input (URL param, tenant slug), it must be validated against a server-side allowlist before being applied to the DOM. `dark-mode-theming-stinger` flags this boundary in `guides/06-multi-brand-runtime-swap.md`.
