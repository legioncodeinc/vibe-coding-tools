# SvelteKit 2 + Vite setup for Tailwind v4

Exact config for wiring `@tailwindcss/vite` into a SvelteKit 2 project using Svelte 5 runes. Grounded in distillation §6; primary sources [raw/03-vite-plugin-installation.md] and [raw/04-sveltekit-install-guide.md].

## 1. Install

```bash
npm install tailwindcss @tailwindcss/vite
```

No `tailwind.config.js`, no `postcss.config.js`, no `autoprefixer` needed for this baseline setup. [raw/04-sveltekit-install-guide.md]

## 2. `vite.config.ts`

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit(),
  ],
});
```

This is the order given in the official SvelteKit installation guide. [raw/04-sveltekit-install-guide.md] A community discussion thread reports the reverse order (`[sveltekit(), tailwindcss()]`) also working; if the official order ever produces a build issue, that's the documented fallback to try, not the default to reach for first. [raw/04-sveltekit-install-guide.md]

If the Tailwind CSS classes don't apply after this config, and `tailwindcss()` is confirmed present in `plugins`, some projects have needed:

```ts
export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  css: {
    transformer: 'lightningcss',
  },
});
```

Treat this as a conditional fix, not a required baseline step. [raw/04-sveltekit-install-guide.md]

## 3. `src/app.css`

```css
@import "tailwindcss";
```

Add project-level `@theme`, `@custom-variant`, and `@source` blocks here as needed. See `theme-directive-reference.md` for token syntax and `guides/04-dark-mode-and-variants.md` for the `@custom-variant dark` pattern.

## 4. `src/routes/+layout.svelte` (Svelte 5 runes)

```svelte
<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

{@render children()}
```

This is the official example and it is already Svelte 5 idiom: `$props()` rune destructuring and the `{@render children()}` snippet call, not a v4-style `<slot />`. [raw/04-sveltekit-install-guide.md]

## 5. Using Tailwind inside a `.svelte` component's scoped `<style>` block

Scoped `<style>` blocks in a `.svelte` file are compiled separately from `app.css`, so they don't automatically see the project's theme, custom utilities, or custom variants. Import them for reference without duplicating the output CSS:

```svelte
<h1 class="text-3xl font-bold underline">Hello world!</h1>

<style>
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
```

If the project has customized `@theme`, point `@reference` at the actual entry file instead of bare `tailwindcss`:

```svelte
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold;
  }
</style>
```

Prefer reading the CSS variable directly over `@apply` when possible, it's one less processing step and works identically:

```svelte
<style>
  h1 {
    color: var(--color-gray-950);
  }
</style>
```

Source for this whole section: [raw/04-sveltekit-install-guide.md], [raw/02-v3-to-v4-upgrade-guide.md], [raw/07-functions-and-directives.md].

## 6. Scaffolding shortcut

```bash
npx sv add tailwindcss
```

Scaffolds the Vite plugin, `app.css`, `+layout.svelte` wiring, and Prettier integration automatically for both new and existing SvelteKit projects. [raw/04-sveltekit-install-guide.md]

## 7. Lightning CSS optimize flag (production tuning)

`@tailwindcss/vite` auto-enables Lightning CSS optimization based on `NODE_ENV` in production builds. Override explicitly if needed:

```ts
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    tailwindcss({
      // Keep Lightning CSS on, but skip minification (useful for debugging a prod build)
      optimize: { minify: false },
    }),
  ],
});
```

Source: [raw/03-vite-plugin-installation.md].

## Scope note

This file covers the generic Tailwind v4 + SvelteKit + Vite wiring only. It does not cover the OSPRY-specific `apps/portal`/`apps/web`/`apps/wl` Phase 0 install procedure, the PRD-071 token bridge, or the white-label brand contract, those live in `ux-ui-svelte-stinger`'s `guides/01-installation-phase-0.md` and `guides/02-token-bridge.md`.
