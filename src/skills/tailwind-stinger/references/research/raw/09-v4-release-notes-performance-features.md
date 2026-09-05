# Tailwind CSS v4.0 (release announcement)
- URL: https://tailwindcss.com/blog/tailwindcss-v4
- Fetched: 2026-08-14
- Source type: official docs (release notes / blog, Tailwind Labs)
- Component: performance, migration, container-queries

Published: 2025-01-22, by Adam Wathan.

Tailwind CSS v4.0 is an all-new version of the framework optimized for performance and flexibility, with a reimagined configuration and customization experience, taking full advantage of the latest web platform capabilities. Headline changes:

- New high-performance engine: full builds up to 5x faster, incremental builds over 100x faster, measured in microseconds.
- Designed for the modern web: built on cascade layers, registered custom properties with `@property`, and `color-mix()`.
- Simplified installation: fewer dependencies, zero configuration, one line of CSS.
- First-party Vite plugin for maximum performance and minimum configuration.
- Automatic content detection: template files discovered automatically, no configuration required.
- Built-in import support: no extra tooling needed to bundle multiple CSS files.
- CSS-first configuration: customize and extend the framework directly in CSS instead of a JavaScript config file.
- CSS theme variables: all design tokens exposed as native CSS variables.
- Dynamic utility values and variants: values no longer need to be guessed or pre-configured in the spacing scale.
- Modernized P3 color palette.
- Container queries: first-class APIs for styling elements based on container size, no plugin required.
- New 3D transform utilities.
- Expanded gradient APIs: radial and conic gradients, interpolation modes, and more.
- `@starting-style` support for enter/exit transitions without JavaScript.
- `not-*` variant.
- New utilities/variants for `color-scheme`, `field-sizing`, complex shadows, `inert`, and more.

## New high-performance engine

Tailwind CSS v4.0 is a ground-up rewrite. Benchmarked against the Catalyst UI kit codebase, median build times:

| | v3.4 | v4.0 | Improvement |
| --- | --- | --- | --- |
| Full build | 378ms | 100ms | 3.78x |
| Incremental rebuild with new CSS | 44ms | 5ms | 8.8x |
| Incremental rebuild with no new CSS | 35ms | 192µs | 182x |

"The most impressive improvement is on incremental builds that don't actually need to compile any new CSS, these builds are over 100x faster and complete in microseconds. And the longer you work on a project, the more of these builds you run into because you're just using classes you've already used before, like `flex`, `col-span-2`, or `font-bold`."

## Designed for the modern web

v4.0 leans on modern CSS features:

```css
@layer theme, base, components, utilities;
@layer utilities {
  .mx-6 { margin-inline: calc(var(--spacing) * 6); }
  .bg-blue-500\/50 { background-color: color-mix(in oklab, var(--color-blue-500) 50%, transparent); }
}
@property --tw-gradient-from {
  syntax: "<color>";
  inherits: false;
  initial-value: #0000;
}
```

- Native cascade layers for more control over rule interaction.
- Registered custom properties (`@property`) enabling gradient animation and improving performance on large pages.
- `color-mix()` for adjusting opacity of any color value, including CSS variables and `currentColor`.
- Logical properties, simplifying RTL support and reducing generated CSS size.

## Simplified installation

```
npm i tailwindcss @tailwindcss/postcss
```

```js
// postcss.config
export default { plugins: ["@tailwindcss/postcss"] };
```

```css
@import "tailwindcss";
```

- One line of CSS: no more `@tailwind` directives.
- Zero configuration: no template path configuration required to start.
- No external plugins required: `@import` rules and Lightning CSS (vendor prefixing, modern syntax transforms) are bundled.

## First-party Vite plugin

```ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [tailwindcss()],
});
```

"Tailwind CSS v4.0 is incredibly fast when used as a PostCSS plugin, but you'll get even better performance using the Vite plugin."

## Automatic content detection

Tailwind v4 automatically detects heuristically which files to scan, ignoring anything covered by `.gitignore` and all binary extensions (images, videos, zip files, etc). Add an explicitly-excluded source with `@source`:

```css
@import "tailwindcss";
@source "../node_modules/@my-company/ui-lib";
```

## Built-in import support

Before v4.0, inlining other CSS files via `@import` required a separate plugin like `postcss-import`. This is now handled out of the box and tightly integrated with the engine for speed.

## CSS-first configuration

Customizations are configured directly in the CSS file that imports Tailwind, instead of `tailwind.config.js`:

```css
@import "tailwindcss";
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 1920px;
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
}
```

## CSS theme variables

All design tokens are made available as CSS variables by default under `:root`, referenceable at runtime, e.g. for inline styles or animation libraries like Motion.

## Dynamic utility values and variants

v4.0 simplifies utility/variant behavior by effectively allowing certain arbitrary-value-like flexibility without configuration or the bracket syntax, e.g. arbitrary-size grids work out of the box.
