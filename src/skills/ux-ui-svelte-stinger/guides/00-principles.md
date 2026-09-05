# 00: Principles

> Scope boundary, philosophy, and the critical directives for the SvelteKit
> UI standard adopted in ADR-007. Read this first; every other guide assumes it.

## What this Stinger owns

The enforcement and implementation of the **shadcn-svelte 1.x + Tailwind v4**
UI standard across the OSPRY SvelteKit apps (portal, web, wl), as decided in
[ADR-007](../../../../library/knowledge/private/architecture/ADR-007-shadcn-svelte-and-tailwind-v4-as-ui-standard.md).

Concretely:

- The phased rollout: Tailwind v4 adoption, the `@theme` token bridge, the
  white-label brand contract preservation, and the surface-by-surface copy-in
  migration.
- Per-surface rulings: when to copy in a shadcn-svelte component, when to stay
  hand-rolled, when to escalate.
- The token-bridge discipline: how OSPRY's PRD-071 tokens map into shadcn-svelte's
  fixed vocabulary.

## What this Stinger does NOT own

- **Bootstrapping a new design system from scratch.** OSPRY already has a design
  system (the PRD-071 token system). This Stinger enforces and extends it, it
  does not invent one. That is `design-system-worker-bee` territory.
- **The CMS admin UI.** `apps/cms` is Next.js + Payload and renders Payload's own
  chrome (`@payloadcms/ui`). It is explicitly out of scope per ADR-007.
- **The CMP bundle.** `apps/cmp` is a vendored vanilla-cookieconsent build. Out
  of scope.
- **The edge workers.** `apps/edge/*` have no UI. Out of scope.
- **React-flavored UI work.** The sibling `ux-ui-svelte-stinger` (React) is for React
  surfaces. This Stinger is Svelte only.

## The five core principles

### 1. Tokens are the source of truth, not components

shadcn-svelte components are written against a **fixed token vocabulary**
(`--background`, `--primary`, `--card`, `--border`, etc.). To re-skin the entire
library, you change the tokens in one place; you do not edit each component.
This is why the token bridge (ADR-007 Decision C) is the load-bearing piece of
the whole rollout, not the components. See `02-token-bridge.md`.

### 2. Open the source-of-truth folder first

Before any UI ruling, read the relevant section of:

- `library/knowledge/private/architecture/ADR-007-shadcn-svelte-and-tailwind-v4-as-ui-standard.md`
- `apps/portal/src/lib/styles/tokens.css` (the PRD-071 token system)
- `apps/portal/src/lib/styles/brand.css` (the white-label contract)
- `apps/<app>/src/app.css` (the Tailwind v4 + token-bridge layer, once Phase 0 lands)

Never rule on UI from memory. Quote the governing section.

### 3. Components are copy-in, not dependencies

shadcn-svelte components live in `$lib/components/ui/` as project-owned source
files. They are not in `node_modules`. You edit them, theme them, and they
survive `npm install`. This is what makes the phased rollout possible. But it
also means **you own the sync discipline**: see `06-surface-migration.md` for
the upstream-refresh procedure.

### 4. The white-label contract is non-negotiable

The `brand.css` `--brand-*` contract and the `render-guard.ts` server gate are
the bounded surface for agency theming. No new raw-CSS or free-text-style
surface is introduced by shadcn-svelte. The agency brand flows through the
bridged tokens, not through a parallel path. See `05-white-label-preservation.md`.

### 5. The bridge is the migration, not a teardown

Tailwind v4 is adopted **alongside** the existing hand-rolled CSS, not as a
teardown. The two coexist during the phased rollout. The legacy `base.css`,
`shell.css`, and bespoke `<style>` blocks are retired surface by surface, not
in one cut. See `01-installation-phase-0.md` for the coexistence rule.

## Critical directives (always in force)

- **Open the source-of-truth folder first, every time.** No off-the-cuff UI
  rulings.
- **Never bypass the token bridge.** A hex literal or arbitrary-value utility
  (`bg-[#1c1f26]`) where a token exists is a bug. See `07-violations-and-guardrails.md`.
- **Never introduce a new raw-CSS surface for theming.** The `--brand-*`
  contract is the only brand sink. No `style="background: <agency color>"`.
- **Components are owned source, not a black box.** When a copy-in component
  needs OSPRY behavior, edit it in place; do not wrap-it-and-forget.
- **The green-scarce rule survives.** PRD-071's discipline (green appears once
  per visible region, for verified/identified + success) is preserved by the
  token bridge pointing `--primary` at `--interactive` (blue), NOT at
  `--brand-primary` (green).
- **System-level changes escalate to `design-system-worker-bee`.** This Stinger
  enforces an existing system; it does not redesign one.

## The ADR-007 phasing (the map)

- **Phase 0 (prerequisite):** adopt Tailwind v4, author the `@theme` token
  bridge, re-point shadcn-svelte's theme tokens at OSPRY tokens, verify
  white-label. See `01-installation-phase-0.md` and `02-token-bridge.md`.
- **Phase 1+:** migrate one primitive at a time (Button → Input → Dialog →
  Toast…), each on real screens, retiring bespoke `<style>` blocks as each
  surface flips. See `06-surface-migration.md`.

Throughout: new screens and components adopt shadcn-svelte primitives from
Phase 0 forward; legacy surfaces migrate opportunistically.
