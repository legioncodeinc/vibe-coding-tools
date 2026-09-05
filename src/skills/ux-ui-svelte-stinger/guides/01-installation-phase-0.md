# 01: Phase 0: Tailwind v4 + shadcn-svelte installation

> The prerequisite phase. Before any shadcn-svelte component lands, the app
> must have Tailwind v4 wired and the `@theme` token bridge in place. This
> guide is the install procedure per app.

**Research:** `../research/shadcn-svelte-installation-sveltekit.md` (canonical
flow), `../research/tailwind-v4-upgrade-guide.md` (the `@tailwindcss/vite`
plugin, the `@reference` coexistence rule), `../research/shadcn-svelte-cli.md`
(what `init` writes).

## Scope of Phase 0

Run this for each SvelteKit app independently: **portal first** (the highest
component count, the most standardization pain), then **web**, then **wl**. The
bridge (Phase 0's hard part) is shared logic, so once portal is proven the
others are mechanical.

Out of scope: `apps/cms`, `apps/cmp`, `apps/edge/*` (per ADR-007).

## The five-step procedure

### Step 1: Verify the floor is met

The SvelteKit apps already meet the floor. Confirm before starting:

```bash
# apps/<app>/package.json
grep -E '"(svelte|@sveltejs/kit|vite|tailwind)"' apps/<app>/package.json
```

Expected: `svelte: ^5.33`, `@sveltejs/kit: ^2.21`, `vite: ^6.3`. Tailwind should
NOT yet be present. See `../research/library-versions.md` for the version pins.

### Step 2: Add Tailwind v4 via the `sv` CLI

```bash
cd apps/<app>
npx sv add tailwind
```

What this does (per `../research/shadcn-svelte-installation-sveltekit.md`):

- Installs `tailwindcss` + `@tailwindcss/vite` + `tailwind-merge` + `clsx` + `tailwind-variants`.
- Adds the `@tailwindcss/vite` plugin to `vite.config.ts`.
- Creates `src/app.css` with `@import "tailwindcss";`.
- Imports `./app.css` in `src/routes/+layout.svelte`.

Verify the resulting `vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
// ... existing plugins (sentrySvelteKit, copyErrorGifsPlugin in portal) ...
export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), /* ... */],
});
```

**Keep existing plugins.** The portal's `vite.config.ts` has `sentrySvelteKit`
and `copyErrorGifsPlugin`; do not let `sv add` clobber them. Read the file
before and after, restore anything lost.

### Step 3: Run `shadcn-svelte init`

```bash
npx shadcn-svelte@latest init
```

Accept the defaults, with these OSPRY-specific answers:

- **Style:** Default.
- **Base color:** Slate (closest to OSPRY's dark neutral base; will be re-pointed anyway).
- **CSS variables:** Yes.
- **Components alias:** `$lib/components`.
- **Utils alias:** `$lib/utils`.
- **CSS file:** `src/app.css`.

What `init` writes (per `../research/shadcn-svelte-cli.md`):

- `$lib/utils.ts` with the `cn()` helper (clsx + tailwind-merge).
- Updates `src/app.css` with the `:root` / `.dark` token blocks, the `@theme inline` block, and the `@layer base` block.
- `components.json` at the app root.

**Do not run `init --force` over an existing `components.json`** without reading
it first.

### Step 4: Author the token bridge

This is the OSPRY-specific step. The `init` above produced a default-themed
`app.css`. Now re-point its `:root` and `.dark` token blocks at OSPRY's
PRD-071 tokens.

Full procedure in `02-token-bridge.md`. The short version: replace the
shadcn-svelte default color values in `:root` with references to `tokens.css`
variables (`var(--bg-canvas)`, `var(--text-primary)`, `var(--interactive)`,
etc.), and confirm `tokens.css` and `brand.css` are still imported in
`+layout.svelte` BEFORE `app.css` so the cascade resolves correctly.

### Step 5: Verify white-label and dark-first

Before declaring Phase 0 done:

1. **White-label:** resolve an agency brand server-side, confirm the SSR'd
   `<head>` still emits the `--brand-accent` override, and confirm a
   shadcn-svelte component (test with a single copy-in Button) renders with
   the agency color. See `05-white-label-preservation.md`.
2. **Dark-first:** confirm the default paint is the OSPRY dark theme (not a
   flash of light). See `04-dark-mode-inversion.md` for the inversion choice.
3. **Coexistence:** confirm the existing hand-rolled `base.css` / `shell.css`
   / bespoke `<style>` blocks still render. Tailwind v4 does not tear them down;
   if a specific surface looks wrong, it is a cascade-order issue, not a
   destruction.

## The coexistence rule (critical during rollout)

Tailwind v4 and the hand-rolled CSS coexist. Two specifics from
`../research/tailwind-v4-upgrade-guide.md`:

1. **Import order in `+layout.svelte`:**
   ```svelte
   <script>
     import "$lib/styles/tokens.css";   // PRD-071 tokens (lowest layer)
     import "$lib/styles/brand.css";    // white-label contract
     import "$lib/styles/base.css";     // legacy hand-rolled base
     import "$lib/styles/shell.css";    // legacy hand-rolled shell
     import "./app.css";                // Tailwind v4 + token bridge (top)
   </script>
   ```
   The token bridge in `app.css` references `tokens.css` variables, so
   `tokens.css` must load first. Tailwind's `@layer base` adds body styles on
   top, which is correct.

2. **Svelte `<style>` blocks and `@apply`:** per the upgrade guide, a Svelte
   component's own `<style>` block does NOT have access to theme variables
   defined in `app.css`. Two options when a migrating component needs theme
   tokens in its `<style>`:
   - Add `@reference "../../app.css";` at the top of the `<style>` block, then
     use `@apply`.
   - **Preferred:** reference the CSS variables directly (`color:
     var(--color-primary);`) instead of `@apply`. Faster, no Tailwind
     processing needed, and it works because `@theme inline` emits the
     `--color-*` variables to `:root`.

## Done-ness for Phase 0

Phase 0 is complete for an app when:

- [ ] `vite.config.ts` has `tailwindcss()` and all pre-existing plugins.
- [ ] `src/app.css` exists with `@import "tailwindcss";`, the token-bridge
      `:root`/`.dark` blocks, the `@theme inline` block, and `@layer base`.
- [ ] `+layout.svelte` imports `tokens.css`, `brand.css`, the legacy styles,
      then `app.css` in that order.
- [ ] `$lib/utils.ts` exports `cn()`.
- [ ] `components.json` exists at the app root.
- [ ] A single copy-in `<Button>` renders with the OSPRY dark theme and picks
      up a resolved agency brand.
- [ ] No existing surface visually regressed (manual check of the shell, nav,
      one representative dashboard screen).

Only then is the app ready for Phase 1 component migration
(`06-surface-migration.md`).
