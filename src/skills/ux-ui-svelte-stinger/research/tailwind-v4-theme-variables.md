# Tailwind v4: Theme variables (raw dump)

> **Source:** https://tailwindcss.com/docs/theme (Tailwind v4.3 docs)
> **Fetched:** 2026-06-29
> **Method:** Browser extraction (Firecrawl-scrape equivalent)
> **Why kept:** This is the canonical reference for the `@theme` directive, which
> is the OSPRY token-bridge mechanism (ADR-007 Decision C). Do not paraphrase;
> cite the exact syntax when writing guides.

---

# Theme variables

Using utility classes as an API for your design tokens.

## Overview

Tailwind is a framework for building custom designs, and different designs need different typography, colors, shadows, breakpoints, and more.

These low-level design decisions are often called design tokens, and in Tailwind projects you store those values in theme variables.

## What are theme variables?

Theme variables are special CSS variables defined using the @theme directive that influence which utility classes exist in your project.

For example, you can add a new color to your project by defining a theme variable like --color-mint-500:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --color-mint-500: oklch(0.72 0.11 178);
}
```

Now you can use utility classes like `bg-mint-500`, `text-mint-500`, or `fill-mint-500` in your HTML:

```html
<div class="bg-mint-500">
  <!-- ... -->
</div>
```

Tailwind also generates regular CSS variables for your theme variables so you can reference your design tokens in arbitrary values or inline styles:

```html
<div style="background-color: var(--color-mint-500)">
  <!-- ... -->
</div>
```

## Why @theme instead of :root?

Theme variables aren't just CSS variables; they also instruct Tailwind to create new utility classes that you can use in your HTML.

Since they do more than regular CSS variables, Tailwind uses special syntax so that defining theme variables is always explicit. Theme variables are also required to be defined top-level and not nested under other selectors or media queries, and using a special syntax makes it possible to enforce that.

Defining regular CSS variables with `:root` can still be useful in Tailwind projects when you want to define a variable that isn't meant to be connected to a utility class. **Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes.**

## Relationship to utility classes

Some utility classes in Tailwind like `flex` and `object-cover` are static, and are always the same from project to project. But many others are driven by theme variables, and only exist because of the theme variables you've defined.

For example, theme variables defined in the `--font-*` namespace determine all of the font-family utilities that exist in a project:

```css
/* ./node_modules/tailwindcss/theme.css */
@theme {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, Men, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* ... */
}
```

The `font-sans`, `font-serif`, and `font-mono` utilities only exist by default because Tailwind's default theme defines the `--font-sans`, `--font-serif`, and `--font-mono` theme variables.

## Relationship to variants

Some theme variables are used to define variants rather than utilities. For example theme variables in the `--breakpoint-*` namespace determine which responsive breakpoint variants exist in your project:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --breakpoint-3xl: 120rem;
}
```

Now you can use the `3xl:*` variant to only trigger a utility when the viewport is 120rem or wider.

## Theme variable namespaces

Theme variables are defined in namespaces and each namespace corresponds to one or more utility class or variant APIs.

Defining new theme variables in these namespaces will make new corresponding utilities and variants available in your project:

| Namespace | Utility classes |
|---|---|
| `--color-*` | Color utilities like `bg-red-500`, `text-sky-300`, and many more |
| `--font-*` | Font family utilities like `font-sans` |
| `--text-*` | Font size utilities like `text-xl` |
| `--font-weight-*` | Font weight utilities like `font-bold` |
| `--tracking-*` | Letter spacing utilities like `tracking-wide` |
| `--leading-*` | Line height utilities like `leading-tight` |
| `--tab-size-*` | Tab size utilities like `tab-github` |
| `--breakpoint-*` | Responsive breakpoint variants like `sm:*` |
| `--container-*` | Container query variants like `@sm:*` and size utilities like `max-w-md` |
| `--spacing-*` | Spacing and sizing utilities like `px-4`, `max-h-16`, and many more |
| `--radius-*` | Border radius utilities like `rounded-sm` |
| `--shadow-*` | Box shadow utilities like `shadow-md` |
| `--inset-shadow-*` | Inset box shadow utilities like `inset-shadow-xs` |
| `--drop-shadow-*` | Drop shadow filter utilities like `drop-shadow-md` |
| `--blur-*` | Blur filter utilities like `blur-md` |
| `--perspective-*` | Perspective utilities like `perspective-near` |
| `--zoom-*` | Zoom utilities like `zoom-compact` |
| `--aspect-*` | Aspect ratio utilities like `aspect-video` |
| `--ease-*` | Transition timing function utilities like `ease-out` |
| `--animate-*` | Animation utilities like `animate-spin` |

## Customizing your theme

### Extending the default theme

Use `@theme` to define new theme variables and extend the default theme:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --font-script: Great Vibes, cursive;
}
```

### Overriding the default theme

Override a default theme variable value by redefining it within `@theme`:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --breakpoint-sm: 30rem;
}
```

To completely override an entire namespace in the default theme, set the entire namespace to initial using the special asterisk syntax:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-purple: #3f3cbb;
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
  --color-bermuda: #78dcca;
}
```

When you do this, all of the default utilities that use that namespace (like `bg-red-500`) will be removed, and only your custom values (like `bg-midnight`) will be available.

### Using a custom theme

To completely disable the default theme and use only custom values, set the global theme variable namespace to initial:

```css
/* app.css */
@import "tailwindcss";
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
  --color-coral: oklch(0.74 0.17 40.24);
}
```

## Defining animation keyframes

Define the `@keyframes` rules for your `--animate-*` theme variables within `@theme` to include them in your generated CSS:

```css
@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;
  @keyframes fade-in-scale {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
}
```

## Referencing other variables: the `inline` option

**[OSPRY-CRITICAL: this is how the brand.css `--brand-*` contract bridges in.]**

When defining theme variables that reference other variables, use the `inline` option:

```css
/* app.css */
@import "tailwindcss";
@theme inline {
  --font-sans: var(--font-inter);
}
```

Using the `inline` option, the utility class will use the theme variable value instead of referencing the actual theme variable:

```css
/* dist.css */
.font-sans {
  font-family: var(--font-inter);
}
```

**Without using `inline`, your utility classes might resolve to unexpected values because of how variables are resolved in CSS.** For example, this text will fall back to `sans-serif` instead of using `Inter` like you might expect:

```html
<div id="parent" style="--font-sans: var(--font-inter, sans-serif);">
  <div id="child" style="--font-inter: Inter; font-family: var(--font-sans);">
    This text will use the sans-serif font, not Inter.
  </div>
</div>
```

This happens because `var(--font-sans)` is resolved where `--font-sans` is defined (on `#parent`), and `--font-inter` has no value there since it's not defined until deeper in the tree (on `#child`).

## Generating all CSS variables: the `static` option

By default only used CSS variables will be generated in the final CSS output. If you want to always generate all CSS variables, you can use the `static` theme option:

```css
@import "tailwindcss";
@theme static {
  --color-primary: var(--color-red-500);
  --color-secondary: var(--color-blue-500);
}
```

## Sharing across projects

**[OSPRY-CRITICAL: this is the monorepo pattern for sharing tokens across portal/web/wl.]**

Since theme variables are defined in CSS, sharing them across projects is just a matter of throwing them into their own CSS file that you can import in each project:

```css
/* ./packages/brand/theme.css */
@theme {
  --*: initial;
  --spacing: 4px;
  --font-body: Inter, sans-serif;
  --color-lagoon: oklch(0.72 0.11 221.19);
}
```

Then you can use `@import` to include your theme variables in other projects:

```css
/* ./packages/admin/app.css */
@import "tailwindcss";
@import "../brand/theme.css";
```

You can put shared theme variables like this in their own package in monorepo setups or even publish them to NPM and import them just like any other third-party CSS files.

## Using your theme variables

All of your theme variables are turned into regular CSS variables when you compile your CSS:

```css
/* dist.css */
:root {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "...";
  --color-red-50: oklch(0.971 0.013 17.38);
  /* ... */
}
```

### With custom CSS

```css
@import "tailwindcss";
@layer components {
  .typography {
    p {
      font-size: var(--text-base);
      color: var(--color-gray-700);
    }
    h1 {
      font-size: var(--text-2xl--line-height);
      font-weight: var(--font-weight-semibold);
      color: var(--color-gray-950);
    }
  }
}
```

### With arbitrary values

```html
<div class="relative rounded-xl">
  <div class="absolute inset-px rounded-[calc(var(--radius-xl)-1px)]">
    <!-- ... -->
  </div>
</div>
```

### Referencing in JavaScript

```js
let styles = getComputedStyle(document.documentElement);
let shadow = styles.getPropertyValue("--shadow-xl");
```

## Default theme variable reference

The full default theme (color palette in oklch, fonts, spacing, breakpoints,
radii, shadows, easings, animations) is imported from `node_modules/tailwindcss/theme.css`.
Key namespace defaults relevant to OSPRY's dark-first token system:

- `--spacing: 0.25rem` (the single spacing multiplier; all `p-*`, `m-*`, `gap-*` scale off it)
- Breakpoints: `--breakpoint-sm: 40rem` (640px), `md: 48rem` (768px), `lg: 64rem` (1024px), `xl: 80rem` (1280px), `2xl: 96rem` (1536px)
- Radii: `xs: 0.125rem` through `4xl: 2rem`
- Colors: full oklch palette per hue (red/orange/amber/yellow/lime/green/emerald/teal/cyan/sky/blue/indigo/violet/purple/fuchsia/pink/rose + the slate/gray/zinc/neutral/stone/mauve/olive/mist/taupe neutrals), each 50-950
- Shadows: `2xs` through `2xl` (Tailwind's own shadow scale; OSPRY's PRD-071 three-cue shadow stack lives in `tokens.css` and is bridged, not replaced)

See https://tailwindcss.com/docs/theme for the exhaustive list.
