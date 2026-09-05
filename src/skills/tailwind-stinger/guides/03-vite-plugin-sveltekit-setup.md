# Vite plugin and SvelteKit setup

Full copy-paste config: `references/sveltekit-vite-setup.md`. This guide is the "why" and the decision points.

## Vite plugin over PostCSS, when Vite is already in play

If the build tool is Vite (which SvelteKit 2 uses), install `@tailwindcss/vite` instead of the PostCSS plugin. The official migration guide recommends this explicitly "for improved performance and the best developer experience," and it removes the need for a separate `postcss.config` entry for Tailwind. [raw/02-v3-to-v4-upgrade-guide.md], [raw/03-vite-plugin-installation.md]

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

## The CSS entry file is the whole config surface

```css
/* src/app.css */
@import "tailwindcss";
```

Everything project-specific (tokens, custom variants, custom utilities, `@source` overrides) gets added to this one file. There is no separate config file to keep in sync with it.

## Root layout import, Svelte 5 runes idiom

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

{@render children()}
```

This is the exact example from the official SvelteKit installation guide, and it's already Svelte 5 syntax (`$props()` destructuring, `{@render children()}`), not the Svelte 4 `<slot />` form. Never write `export let children` or `<slot />` for this in a Svelte 5 project. [raw/04-sveltekit-install-guide.md]

## Scoped component styles need `@reference`

A `.svelte` file's `<style>` block compiles independently from `app.css`. If a component needs `@apply` or the `theme()` function inside its scoped styles, it must explicitly reference the entry file (or bare `tailwindcss` if the theme is unmodified):

```svelte
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold;
  }
</style>
```

Default to reading the generated CSS variable directly instead of `@apply` where practical, since it skips a processing step and needs no `@reference` for values already defined in `@theme`:

```svelte
<style>
  h1 {
    color: var(--color-gray-950);
  }
</style>
```

[raw/04-sveltekit-install-guide.md], [raw/07-functions-and-directives.md]

## Fallback if styles aren't applying

1. Confirm `tailwindcss()` is actually present in the Vite `plugins` array.
2. Confirm `app.css` is imported somewhere that actually loads on every route (the root `+layout.svelte` is correct; a leaf `+page.svelte` is not).
3. Restart the dev server, Vite plugin changes aren't always picked up by HMR.
4. As a last resort, some SvelteKit + Tailwind v4 setups have needed `css: { transformer: 'lightningcss' }` in `vite.config.ts`. This is not part of the official baseline and should be treated as a targeted fix, not a default addition. [raw/04-sveltekit-install-guide.md]

## Scaffold shortcut

```bash
npx sv add tailwindcss
```

Does steps 1-3 above automatically, plus Prettier plugin wiring, for both new and existing SvelteKit projects. [raw/04-sveltekit-install-guide.md]

## Out of scope

This guide is the generic wiring only. OSPRY's Phase 0 install procedure (which also wires shadcn-svelte, `components.json`, and the token bridge) lives in `ux-ui-svelte-stinger`'s `guides/01-installation-phase-0.md`, read that instead if the task is standing up Tailwind inside `apps/portal`, `apps/web`, or `apps/wl` specifically.
