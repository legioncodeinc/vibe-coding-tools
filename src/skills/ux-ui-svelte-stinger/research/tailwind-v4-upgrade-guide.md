# Tailwind v4: Upgrade guide (raw dump)

> **Source:** https://tailwindcss.com/docs/upgrade-guide (Tailwind v4.3 docs)
> **Fetched:** 2026-06-29
> **Method:** Browser extraction
> **Why kept:** Documents the `@tailwindcss/vite` plugin (the install path for
> the OSPRY SvelteKit apps), the `@reference` rule for Svelte `<style>` blocks
> (critical for coexisting with hand-rolled CSS during the phased rollout), and
> the renamed utilities the model must use.
>
> **OSPRY caveat:** This guide targets projects **upgrading from v3**. OSPRY has
> zero Tailwind today, so most of this guide does NOT apply: we adopt v4
> natively. The relevant sections for OSPRY are: "Using Vite", "Using @apply
> with Svelte", and "Removed/Renamed utilities" (so we use the right names from
> day one).

---

# Upgrade guide

Upgrading your Tailwind CSS projects from v3 to v4.

Tailwind CSS v4.0 is designed for Safari 16.4+, Chrome 111+, and Firefox 128+. If you need to support older browsers, stick with v3.4.

## Using the upgrade tool

```bash
$ npx @tailwindcss/upgrade
```

Requires Node.js 20+. Run in a new branch, review the diff, test in browser.

## Using PostCSS

In v3 the `tailwindcss` package was a PostCSS plugin; in v4 the PostCSS plugin lives in `@tailwindcss/postcss`. Imports and vendor prefixing are now automatic; remove `postcss-import` and `autoprefixer`:

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Using Vite  **[OSPRY: THIS IS THE INSTALL PATH]**

**[The portal/web/wl SvelteKit apps are Vite-based, so use this, not PostCSS.]**

If you're using Vite, migrate from the PostCSS plugin to the dedicated Vite plugin for improved performance and the best developer experience:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
});
```

## Using Tailwind CLI

```bash
npx @tailwindcss/cli -i input.css -o output.css
```

## Removed @tailwind directives  **[OSPRY: relevant: v4 import syntax]**

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

## Removed deprecated utilities

| Deprecated | Replacement |
|---|---|
| `bg-opacity-*` | `bg-black/50` (opacity modifiers) |
| `flex-shrink-*` | `shrink-*` |
| `flex-grow-*` | `grow-*` |
| `overflow-ellipsis` | `text-ellipsis` |

## Renamed utilities  **[OSPRY: use the v4 names from day one]**

| v3 | v4 |
|---|---|
| `shadow-sm` | `shadow-xs` |
| `shadow` | `shadow-sm` |
| `drop-shadow-sm` | `drop-shadow-xs` |
| `drop-shadow` | `drop-shadow-sm` |
| `blur-sm` | `blur-xs` |
| `blur` | `blur-sm` |
| `backdrop-blur-sm` | `backdrop-blur-xs` |
| `backdrop-blur` | `backdrop-blur-sm` |
| `rounded-sm` | `rounded-xs` |
| `rounded` | `rounded-sm` |
| `outline-none` | `outline-hidden` |
| `ring` | `ring-3` |
| `bg-gradient-to-*` | `bg-linear-to-*` |

## Default border color

In v3 `border-*`/`divide-*` defaulted to `gray-200`. In v4 it defaults to `currentColor`. Always specify a border color:

```html
<div class="border border-gray-200 px-2 py-3">
```

## Default ring width and color

`ring` is now 1px (was 3px in v3) and defaults to `currentColor` (was `blue-500`). Use `ring-3` for the old width and specify a color explicitly:

```html
<button class="focus:ring-3 focus:ring-blue-500">
```

## Preflight changes

- **Placeholder color:** defaults to current text color at 50% opacity (was `gray-400`).
- **Button cursor:** `cursor: default` now (was `cursor: pointer`). Add base styles to restore pointer if desired.
- **Dialog margins removed.**

## The important modifier

Place `!` at the END of the class name in v4 (was at the start in v3):

```html
<div class="flex! bg-red-500! hover:bg-red-600/50!">
```

## Adding custom utilities  **[OSPRY: `@utility` replaces `@layer utilities`]**

v4 uses native cascade layers and the new `@utility` API:

```css
/* v3 */
@layer utilities {
  .tab-4 { tab-size: 4; }
}

/* v4 */
@utility tab-4 {
  tab-size: 4;
}
```

## Variables in arbitrary values  **[OSPRY: bracket syntax changed]**

CSS variables in arbitrary values use parentheses, not square brackets:

```html
<!-- v3 -->
<div class="bg-[--brand-color]"></div>
<!-- v4 -->
<div class="bg-(--brand-color)"></div>
```

## Using @apply with Vue, Svelte, or CSS modules  **[OSPRY-CRITICAL: the coexistence rule]**

**[This is the rule that lets Tailwind v4 coexist with OSPRY's existing hand-rolled `<style>` blocks during the phased rollout.]**

In v4, stylesheets bundled separately from your main CSS file (CSS modules files, `<style>` blocks in Vue/Svelte/Astro) **do not have access to theme variables, custom utilities, and custom variants defined in other files**.

To make these definitions available in these contexts, use `@reference` to import them without duplicating any CSS:

```svelte
<!-- Svelte component with its own <style> block -->
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

**Alternatively, use the CSS theme variables directly instead of `@apply` at all (this also improves performance since Tailwind won't need to process these styles):**

```svelte
<style>
  h1 {
    color: var(--text-red-500);
  }
</style>
```

## Using Sass, Less, and Stylus

**[OSPRY: the portal's hand-rolled CSS is plain CSS, so this is not a blocker. Flag it only if a Svelte component's `<style>` is preprocessed.]**

Tailwind CSS v4.0 is not designed to be used with CSS preprocessors like Sass, Less, or Stylus. You cannot use them for stylesheets or `<style>` blocks in Vue/Svelte/Astro. Think of Tailwind itself as your preprocessor.
