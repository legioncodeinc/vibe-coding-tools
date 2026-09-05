# Tailwind v4 - shadcn-svelte

- URL: https://shadcn-svelte.com/docs/migration/tailwind-v4
- Fetched: 2026-08-14
- Source type: official docs
- Component: theming

How to use shadcn-svelte with Tailwind v4 and Svelte 5.

## What's New

- The `@latest` CLI can now initialize projects with Tailwind v4 and Svelte 5.
- Full support for the new `@theme` directive and `@theme inline` option.
- All components are updated for Tailwind v4 and Svelte 5.
- Every primitive that renders an element now has a `data-slot` attribute for styling.
- Buttons now use the default cursor.
- Deprecating the `default` style; new projects use `new-york`.
- HSL colors are now converted to OKLCH.

Note: this is non-breaking. Existing apps with Tailwind v3 continue to work. New components added to a v3 project still install in v3 style (per `components.json`) until upgraded. Only new projects start with Tailwind v4.

## Upgrade steps (Svelte 5 + Tailwind 3 -> Tailwind v4)

### 1. Follow the Tailwind v4 upgrade guide

Upgrade to Tailwind v4 via the official guide (tailwindcss.com/docs/upgrade-guide) and run the `@tailwindcss/upgrade` codemod to remove deprecated utility classes and update the tailwind config.

### 2. Replace PostCSS with Vite

Delete `postcss.config.js`, uninstall `@tailwindcss/postcss`, install `@tailwindcss/vite`:

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
});
```

### 3. Update app.css

Replace `tailwindcss-animate` with `tw-animate-css`:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));
```

Remove the Tailwind v3 border-color compatibility shim (`@layer base { *, ::after, ::before... { border-color: var(--color-gray-200, currentcolor); } }`) since it becomes dead code once the CSS variables are wrapped properly.

Move CSS variables to `:root` / `.dark`, wrap color values in `hsl()`, and set up `@theme inline` to replace the Tailwind v3 config file. Final `app.css` shape:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  /* ...full palette... */
  --radius: 0.5rem;
}

.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  /* ...full palette... */
}

@theme inline {
  /* Radius (for rounded-*) */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Colors */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-ring: var(--ring);
  --color-radius: var(--radius);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
```

Once verified, remove the `tailwind.config.ts` file entirely.

### 4. Use new size-* utility

The `size-*` utility (added in Tailwind v3.4) is now fully supported by `tailwind-merge`. Replace `w-* h-*` pairs with `size-*`:

```
- w-4 h-4
+ size-4
```

### 5. Update dependencies

```
pnpm i bits-ui@latest @lucide/svelte@latest tailwind-variants@latest tailwind-merge@latest clsx@latest svelte-sonner@latest paneforge@next vaul-svelte@next formsnap@latest
```

### 6. Update utils.ts (optional)

Previously some simple type helpers were imported from `bits-ui`. These have moved into `utils.ts`:

```ts
// utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
```

Then incrementally replace imports in existing components, e.g.:

```svelte
<script lang="ts">
-	import type { WithElementRef } from "bits-ui";
+	import type { WithElementRef } from "$lib/utils.js";
</script>
```

### 7. Update colors (optional)

Dark mode colors were revisited for accessibility. To adopt the new OKLCH dark-mode values:

1. Commit any changes first (the CLI will overwrite existing components).
2. Run `pnpm dlx shadcn-svelte@latest add --all --overwrite` to update components.
3. Update the dark mode colors in `app.css` to the new OKLCH values (see raw/05-theming-tokens.md for the Base Colors reference).
4. Review and re-apply any hand-made changes to components using git diffs. "Updating your components will overwrite your existing components."

## Key quote on the upgrade philosophy

"One of the major advantages of using shadcn-svelte is that the code you end up with is exactly what you'd write yourself. There are no hidden abstractions. This means when a dependency has a new release, you can just follow the official upgrade paths."
