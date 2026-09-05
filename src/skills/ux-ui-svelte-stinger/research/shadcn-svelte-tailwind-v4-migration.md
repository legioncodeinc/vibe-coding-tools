# shadcn-svelte: Tailwind v4 migration (raw dump)

> **Source:** https://www.shadcn-svelte.com/docs/migration/tailwind-v4
> **Fetched:** 2026-06-29
> **Method:** Firecrawl-scrape-equivalent web reader
> **Why kept:** Documents the v4-era `@theme inline` shape that shadcn-svelte
> expects in `app.css`, plus the Svelte 5 + Tailwind v4 requirements.
>
> **OSPRY caveat:** Like the Tailwind upgrade guide, this targets projects
> coming OFF v3 / Svelte 4. OSPRY is greenfield for Tailwind, so the
> "migrate" steps don't apply, but the **destination shape** of `app.css`
> described here is exactly what OSPRY's `app.css` should look like after
> Phase 0.

---

# Tailwind v4

How to use shadcn-svelte with Tailwind v4 and Svelte 5.

## Requirements

- **Svelte 5+** (shadcn-svelte 1.x is Svelte 5 native; the Svelte 4 version lives
  at the legacy `svelte-4.shadcn-svelte.com` docs).
- **Tailwind CSS v4** (the `@latest` CLI initializes with Tailwind v4 + Svelte 5).
- **`tailwind-merge` v2.6+** (v4-compatible).
- **`tailwind-variants`** (the variant engine; Svelte equivalent of React's CVA).

## The `app.css` destination shape  **[OSPRY: THIS IS THE TEMPLATE]**

After Tailwind v4 + shadcn-svelte are initialized, `src/app.css` looks like:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

/* --- :root = the LIGHT theme token set --- */
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 3.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 3.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 3.9%);
  --primary: hsl(240 5.9% 10%);
  --primary-foreground: hsl(0 0% 98%);
  --secondary: hsl(240 4.8% 95.9%);
  --secondary-foreground: hsl(240 5.9% 10%);
  --muted: hsl(240 4.8% 95.9%);
  --muted-foreground: hsl(240 3.8% 46.1%);
  --accent: hsl(240 4.8% 95.9%);
  --accent-foreground: hsl(240 5.9% 10%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 5.9% 90%);
  --input: hsl(240 5.9% 90%);
  --ring: hsl(240 10% 3.9%);
  --radius: 0.5rem;
}

/* --- .dark = the DARK theme token set --- */
.dark {
  --background: hsl(240 10% 3.9%);
  --foreground: hsl(0 0% 98%);
  /* ... mirrored ... */
}

/* --- The @theme inline block maps tokens to Tailwind utilities --- */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* Base layer: wire tokens to native CSS props */
@layer base {
  * {
    border-color: var(--color-border);
  }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}
```

## The three-layer pattern  **[OSPRY-CRITICAL: understand before bridging]**

shadcn-svelte v4 theming is three layers stacked:

1. **`:root` / `.dark`**: define the theme token *values* (the `--background`,
   `--primary`, etc. variables). This is where light/dark differ.
2. **`@theme inline { ... }`**: maps those tokens into Tailwind's *color
   namespace* so utilities like `bg-background`, `text-primary`, `border-border`
   exist. The `inline` keyword is essential: it makes the utility resolve the
   token *value* (so it tracks theme switches), not reference the variable at a
   fixed DOM location.
3. **`@layer base`**: applies tokens to native CSS (`body { background-color:
   var(--color-background) }`).

**This is exactly the bridge OSPRY needs.** OSPRY's `tokens.css` already defines
its own `--bg-canvas`, `--text-primary`, `--interactive` tokens. The ADR-007
token bridge sets the shadcn-svelte `:root`/`.dark` values to reference OSPRY
tokens:

```css
:root {
  /* OSPRY is dark-first; the default :root IS the dark theme */
  --background: var(--bg-canvas);          /* from tokens.css */
  --foreground: var(--text-primary);
  --primary: var(--interactive);           /* the OSPRY blue */
  --ring: var(--border-focus);
  /* ... etc ... */
}
```

The `@theme inline` and `@layer base` blocks stay exactly as shadcn-svelte
generated them.

## Why `@custom-variant dark (&:is(.dark *))`

Tailwind v4 removed the built-in `dark:` variant (it relied on `prefers-color-scheme`
by default and the `darkMode: 'class'` JS config). shadcn-svelte re-declares the
`dark:` variant to look for the `.dark` class on an ancestor, matching the
`mode-watcher` helper's behavior.

For OSPRY (dark-first), this is mostly defensive (the default theme IS dark),
but it keeps the `dark:` variant working for any light-mode surfaces.
