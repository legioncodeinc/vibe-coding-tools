# Install Tailwind CSS with SvelteKit
- URL: https://tailwindcss.com/docs/guides/sveltekit
- Fetched: 2026-08-14
- Source type: official docs
- Component: vite-plugin

Setting up Tailwind CSS in a SvelteKit project.

## Steps

1. **Create your project.** Start with a new SvelteKit project (`npx sv create my-project`, then `cd my-project`) if one doesn't already exist, per the SvelteKit docs.

2. **Install Tailwind CSS.** Install `@tailwindcss/vite` and its peer dependencies via npm:

```
npm install tailwindcss @tailwindcss/vite
```

3. **Configure Vite Plugin.** Add the `@tailwindcss/vite` plugin to the Vite configuration:

```ts
// vite.config.ts
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

4. **Import Tailwind CSS.** Create `./src/app.css` and add an `@import` that imports Tailwind CSS:

```css
/* app.css */
@import "tailwindcss";
```

5. **Import the CSS file.** Create `./src/routes/+layout.svelte` and import the newly-created `app.css` file:

```svelte
<script>
  let { children } = $props();
  import "../app.css";
</script>
{@render children()}
```

6. **Start the build process.** Run `npm run dev`.

7. **Start using Tailwind in the project.** Use Tailwind's utility classes to style content, making sure to import the Tailwind CSS theme for any `<style>` blocks that need to be processed by Tailwind:

```svelte
<!-- +page.svelte -->
<h1 class="text-3xl font-bold underline">Hello world!</h1>
<style lang="postcss">
  @reference "tailwindcss";
  :global(html) {
    background-color: theme(--color-gray-100);
  }
</style>
```

Note: this official guide example already uses Svelte 5's `let { children } = $props()` and `{@render children()}` rune-idiom syntax in `+layout.svelte`, not Svelte 4 slots.

## Svelte CLI tailwindcss add-on
- URL: https://svelte.dev/docs/cli/tailwind
- Fetched: 2026-08-14
- Source type: official docs (Svelte CLI docs)
- Component: vite-plugin

```
npx sv add tailwindcss
```

This scaffolds:
- Tailwind setup following the Tailwind for SvelteKit guide
- Tailwind Vite plugin
- Updated `layout.css` and `+layout.svelte` (for SvelteKit) or `app.css` and `App.svelte` (for non-SvelteKit Vite apps)
- Integration with `prettier` if that package is present

## Community troubleshooting notes
- URL: https://github.com/tailwindlabs/tailwindcss/discussions/13417
- Fetched: 2026-08-14
- Source type: community (GitHub Discussions, tailwindlabs org repo)
- Component: vite-plugin

Working `vite.config.ts` reported by multiple users for Tailwind v4 + SvelteKit + Svelte 5:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [sveltekit(), tailwindcss()]
});
```

```svelte
<!-- src/routes/+layout.svelte, Svelte 5 runes -->
<script lang="ts">
    import '../app.css'

    const { children } = $props();
</script>

{@render children()}
```

Some users report needing `css: { transformer: 'lightningcss' }` in `vite.config.ts` to resolve build issues with the Tailwind v4 Vite plugin on certain SvelteKit setups, though this is not required in the official guide's baseline configuration. Order of plugins in the `plugins` array (`tailwindcss()` before or after `sveltekit()`) has been reported both ways as working; the official guide lists `tailwindcss()` before `sveltekit()`.
