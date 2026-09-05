# Upgrade guide - Getting started
- URL: https://tailwindcss.com/docs/upgrade-guide
- Fetched: 2026-08-14
- Source type: official docs
- Component: migration

Upgrading your Tailwind CSS projects from v3 to v4.

Tailwind CSS v4.0 is a new major version of the framework, so while the team worked hard to minimize breaking changes, some updates are necessary. This guide outlines all the steps required to upgrade projects from v3 to v4.

Tailwind CSS v4.0 is designed for Safari 16.4+, Chrome 111+, and Firefox 128+. If you need to support older browsers, stick with v3.4 until your browser support requirements change.

## Using the upgrade tool

If you'd like to upgrade a project from v3 to v4, use the upgrade tool to do the vast majority of the heavy lifting:

```
npx @tailwindcss/upgrade
```

For most projects, the upgrade tool will automate the entire migration process including updating dependencies, migrating the configuration file to CSS, and handling any changes to template files.

The upgrade tool requires Node.js 20 or higher. Run it in a new branch, then carefully review the diff and test the project in the browser to make sure all of the changes look correct. You may need to tweak a few things by hand in complex projects, but the tool saves a ton of time either way.

## Upgrading manually

### Using PostCSS

In v3, the `tailwindcss` package was a PostCSS plugin, but in v4 the PostCSS plugin lives in a dedicated `@tailwindcss/postcss` package. In v4 imports and vendor prefixing are handled automatically, so `postcss-import` and `autoprefixer` can be removed if present.

### Using Vite

If using Vite, migrate from the PostCSS plugin to the dedicated Vite plugin for improved performance and best developer experience:

```ts
// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

### Using Tailwind CLI

In v4, Tailwind CLI lives in a dedicated `@tailwindcss/cli` package.

## Changes from v3

### Browser requirements

Tailwind CSS v4.0 targets Safari 16.4, Chrome 111, and Firefox 128 because it depends on modern CSS features like `@property` and `color-mix()`. It will not work in older browsers. Stick with v3.4 for older browser support.

### Removed @tailwind directives

In v4 Tailwind is imported using a regular CSS `@import` statement, not the `@tailwind` directives from v3:

```css
/* v3 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* v4 */
@import "tailwindcss";
```

### Removed deprecated utilities

| Deprecated | Replacement |
| --- | --- |
| `bg-opacity-*` | Use opacity modifiers like `bg-black/50` |
| `text-opacity-*` | Use opacity modifiers like `text-black/50` |
| `border-opacity-*` | Use opacity modifiers like `border-black/50` |
| `divide-opacity-*` | Use opacity modifiers like `divide-black/50` |
| `ring-opacity-*` | Use opacity modifiers like `ring-black/50` |
| `placeholder-opacity-*` | Use opacity modifiers like `placeholder-black/50` |
| `flex-shrink-*` | `shrink-*` |
| `flex-grow-*` | `grow-*` |
| `overflow-ellipsis` | `text-ellipsis` |
| `decoration-slice` | `box-decoration-slice` |
| `decoration-clone` | `box-decoration-clone` |

### Renamed utilities

| v3 | v4 |
| --- | --- |
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

The "bare" versions still work for backward compatibility, but the `-sm` utilities look different unless updated to their `-xs` versions.

#### Renamed outline utility

`outline` now sets `outline-width: 1px` by default to be more consistent with border and ring utilities. All `outline-*` utilities default `outline-style` to `solid`. `outline-none` previously didn't actually set `outline-style: none` (it set an invisible outline for forced-colors accessibility). It has been renamed `outline-hidden`, and a new `outline-none` now actually sets `outline-style: none`.

#### Default ring width change

In v3 `ring` added a 3px ring; in v4 it's 1px. Replace `ring` with `ring-3` to preserve v3 look, and add `ring-blue-500` explicitly since the default ring color changed from `blue-500` to `currentColor`.

### Space-between and divide selectors

The selectors for `space-x-*`/`space-y-*` and `divide-x-*`/`divide-y-*` changed to address performance issues on large pages:

```css
/* Before */
.space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
/* Now */
.space-y-4 > :not(:last-child) { margin-bottom: 1rem; }
```

If this causes issues, migrate to flex/grid with `gap` instead.

### Using variants with gradients

In v3, overriding part of a gradient with a variant "reset" the entire gradient. In v4, values are preserved. Use `via-none` to explicitly unset a three-stop gradient back to two-stop in a specific state.

### Container configuration

In v3, the `container` utility had config options like `center` and `padding`. In v4, customize it with the `@utility` directive:

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

### Default border and ring color

In v3, `border-*`/`divide-*` defaulted to `gray-200`. In v4 the default is `currentColor`, matching browser defaults. Specify a color explicitly, or add compatibility base styles:

```css
@layer base {
  *, ::after, ::before, ::backdrop, ::file-selector-button {
    border-color: var(--color-gray-200, currentColor);
  }
}
```

To preserve v3 ring defaults:

```css
@theme {
  --default-ring-width: 3px;
  --default-ring-color: var(--color-blue-500);
}
```

Note: these variables are only supported for compatibility and are not idiomatic v4.0 usage.

### Preflight changes

- Placeholder text now uses current text color at 50% opacity instead of `gray-400`.
- Buttons use `cursor: default` instead of `cursor: pointer` to match browser default.
- Dialog margins are reset (add `dialog { margin: auto; }` to restore centering).
- Display classes like `block`/`flex` no longer override the `hidden` attribute.

### Using a prefix

Prefixes now look like variants and sit at the beginning of the class name: `tw:flex tw:bg-red-500 tw:hover:bg-red-600`. Configure theme variables as if not using a prefix; generated CSS variables get the prefix automatically (`--tw-color-avocado-100`, etc).

### The important modifier

In v3, `!` went at the start of the utility name (after variants). In v4, place `!` at the very end: `flex! bg-red-500! hover:bg-red-600/50!`. The old placement is still supported but deprecated.

### Adding custom utilities

In v3, classes in `@layer utilities`/`@layer components` were automatically picked up as true utilities working with variants. In v4, native cascade layers are used, so the `@utility` API replaces this:

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

Custom utilities are now sorted by the number of properties they define, so component-style utilities like `.btn` can be overridden by other Tailwind utilities without extra configuration.

### Variant stacking order

In v3, stacked variants applied right to left. In v4, they apply left to right (matches CSS syntax more closely). Reverse the order of order-sensitive stacked variants, e.g. `first:*:pt-0` becomes `*:first:pt-0`.

### Variables in arbitrary values

v3 allowed CSS variables as arbitrary values without `var()`. v4 changes the syntax to parentheses: `bg-[--brand-color]` becomes `bg-(--brand-color)`.

### Arbitrary values in grid and object-position utilities

Commas are no longer replaced with spaces automatically in `grid-cols-*`, `grid-rows-*`, and `object-*` arbitrary values (v2 compatibility behavior removed). Use underscores: `grid-cols-[max-content,auto]` becomes `grid-cols-[max-content_auto]`.

### Hover styles on mobile

v4 wraps `hover:` in `@media (hover: hover)` so it doesn't fire on touch-emulated hover. Override with `@custom-variant hover (&:hover);` if the old touch-triggered behavior is required.

### Transitioning outline-color

`transition`/`transition-colors` now include `outline-color`. Set the outline color unconditionally, or explicitly for both states, to avoid an unwanted color transition from the default.

### Individual transform properties

`rotate-*`, `scale-*`, `translate-*` are now based on individual CSS properties. `transform-none` no longer resets them; reset the individual properties instead (e.g., `scale-none`). If customizing `transition-[...]` property lists, include the individual properties (`opacity,scale`) instead of `transform`.

### Disabling core plugins

The v3 `corePlugins` option to disable utilities is no longer supported in v4.

### Using the theme() function

v4 includes CSS variables for all theme values; prefer those over `theme()`. Where `theme()` is still needed (e.g. media queries), use the CSS variable name instead of dot notation: `theme(screens.xl)` becomes `theme(--breakpoint-xl)`.

### Using a JavaScript config file

JS config files are still supported for backward compatibility but are no longer auto-detected. Load explicitly:

```css
@config "../../tailwind.config.js";
```

`corePlugins`, `safelist`, and `separator` options from JS config are not supported in v4.0. Use `@source inline()` to safelist utilities.

### Theme values in JavaScript

The v3 `resolveConfig` export has been removed. Use CSS variables directly, or `getComputedStyle` to read a resolved value in JS.

### Using @apply with Vue, Svelte, or CSS modules

Stylesheets bundled separately from the main CSS file (CSS modules, `<style>` blocks in Vue/Svelte/Astro) do not have access to theme variables, custom utilities, and custom variants defined elsewhere. Use `@reference` to import them without duplicating CSS in the bundle:

```html
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

Alternatively, use CSS theme variables directly instead of `@apply`, which also improves performance since Tailwind doesn't need to process those styles.

### Using Sass, Less, and Stylus

Tailwind CSS v4.0 is not designed to be used with CSS preprocessors. Tailwind CSS itself is the preprocessor; it is not possible to use Sass, Less, or Stylus for stylesheets or `<style>` blocks in Vue, Svelte, Astro, etc.
