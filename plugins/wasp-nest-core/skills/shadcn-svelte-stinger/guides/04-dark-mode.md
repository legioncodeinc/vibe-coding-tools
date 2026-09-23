# Dark mode

Generic shadcn-svelte dark-mode mechanics. This does not cover OSPRY's dark-first inversion (where dark is the default, not light); that's `ux-ui-svelte-stinger`'s domain, see its `guides/04-dark-mode-inversion.md`.

## The mechanism: mode-watcher

shadcn-svelte's documented dark-mode implementation uses the `mode-watcher` package. Mount `<ModeWatcher />` once, in the root layout:

```svelte
<script lang="ts">
	import { ModeWatcher } from "mode-watcher";
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}
```

Toggle from anywhere with `toggleMode()`:

```svelte
<script lang="ts">
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import { toggleMode } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<Button onclick={toggleMode} variant="ghost" size="icon">
	<SunIcon class="size-4 dark:hidden" />
	<MoonIcon class="hidden size-4 dark:block" />
	<span class="sr-only">Toggle theme</span>
</Button>
```

[research/raw/07-dark-mode.md]

## Why not a hand-rolled `onMount` toggle

The naive approach reads a saved theme preference inside `onMount`, which runs after hydration. The page paints light, then snaps to dark a moment later, a visible flash of the wrong theme. `ModeWatcher` avoids this by writing the `.dark` class before paint [research/raw/07-dark-mode.md]. If you see a flash-of-wrong-theme bug report, the fix is almost always one of: `ModeWatcher` isn't mounted in the root layout, or theme logic got moved into `onMount` somewhere downstream [research/raw/07-dark-mode.md]. Treat a hand-rolled `onMount`-based dark mode toggle as a must-fix in review.

## What dark mode changes

Only the CSS variable values in `.dark`: the components themselves don't have separate dark-mode markup or logic. `bg-background`, `text-foreground`, `bg-primary`, etc. all resolve to whatever `.dark` currently defines, because the `@custom-variant dark (&:is(.dark *));` line (see [guides/03-theming-and-css-variables.md](03-theming-and-css-variables.md)) makes `.dark` context flip every `dark:`-prefixed utility class simultaneously [research/raw/06-tailwind-v4-migration.md].

## Gap flagged in research

The official `/docs/dark-mode` page's full body (any framework-specific setup tabs) was not fully captured in this skill's research archive; the walkthrough above is sourced from a corroborating community write-up (fullstacksveltekit.com), not verified verbatim against the official page body [research/raw/07-dark-mode.md]. If a project needs framework-specific dark-mode setup nuance beyond the `mode-watcher` pattern above, verify against the live docs page rather than assuming this guide is exhaustive.

## Svelte 5 compatibility note

Current shadcn-svelte, including its dark-mode tooling, is fully Svelte 5-native (`$props()`, snippets, `onclick`). Any forum thread suggesting otherwise predates the migration window, which closed well before this research was conducted [research/raw/07-dark-mode.md].
