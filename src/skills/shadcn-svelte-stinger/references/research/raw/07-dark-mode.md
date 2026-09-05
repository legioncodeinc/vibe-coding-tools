# Dark Mode - shadcn-svelte

- URL: https://shadcn-svelte.com/docs/dark-mode
- Fetched: 2026-08-14
- Source type: official docs
- Component: theming

Dark Mode - shadcn-svelte. Adding dark mode to your site.

Note: the fetched page rendered only the title/tagline through the Exa extractor ("Adding dark mode to your site."); the body content (the mode-watcher-based implementation walkthrough) was not captured in this fetch. The community source below (fullstacksveltekit.com) independently documents the same mode-watcher-based pattern and cross-confirms the mechanism. Gap: the full official dark-mode page body (any framework-specific setup tabs, e.g. SvelteKit vs Vite) was not retrieved verbatim; the walkthrough below is sourced from a secondary community write-up, not the shadcn-svelte docs page body itself.

---

# shadcn-svelte in SvelteKit: setup, theming, and components (dark mode section)

- URL: https://fullstacksveltekit.com/blog/shadcn-svelte-sveltekit
- Fetched: 2026-08-14
- Source type: blog
- Component: theming

Published: 2026-05-25.

## Dark mode without the flash

Dark mode is the part most setups get subtly wrong. The naive version reads the saved theme in `onMount`, which runs after hydration, so the page paints light, then snaps to dark. shadcn-svelte avoids that with `mode-watcher`, which sets the theme before the app renders.

Drop `ModeWatcher` into your root layout once:

```svelte
<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
```

Then toggle the theme from anywhere with `toggleMode`:

```svelte
<script lang="ts">
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<Button onclick={toggleMode} variant="ghost" size="icon">
	<SunIcon class="size-4 dark:hidden" />
	<MoonIcon class="hidden size-4 dark:block" />
	<span class="sr-only">Toggle theme</span>
</Button>
```

`ModeWatcher` writes the `.dark` class before paint, so there is no flash of the wrong theme, which is the bug a hand-rolled toggle almost always ships with.

## Theming shadcn-svelte with CSS variables (context)

Your colors are CSS custom properties, defined once for light and once for dark. shadcn-svelte uses oklch values, which keep lightness perceptually even across hues:

```css
:root {
	--background: oklch(1 0 0);
	--foreground: oklch(0.145 0 0);
	--primary: oklch(0.205 0 0);
	/* ...the rest of the tokens */
}

.dark {
	--background: oklch(0.145 0 0);
	--foreground: oklch(0.985 0 0);
	--primary: oklch(0.922 0 0);
}
```

Components reference these tokens (`bg-background`, `text-foreground`, `bg-primary`), so rebranding the whole UI means changing the variables, not the components.

Theme once, at the token layer. Never reach into individual components to recolor them.

## Troubleshooting: the dark-mode flash

If the page flickers from light to dark on load, `ModeWatcher` was mounted but left out of the root layout, or theme logic was put in `onMount` instead. `ModeWatcher` is the piece that runs before paint.

## Svelte 5 compatibility note

"Is shadcn-svelte compatible with Svelte 5? Yes, and this trips people up because of timing. shadcn-svelte was ported to Svelte 5 and runes; the components ship as runes-native files using `$props`, snippets, and `onclick` (not `on:click`). The confusion in old forum threads dates from the migration window, which closed long ago. Current shadcn-svelte is Svelte 5-native."
