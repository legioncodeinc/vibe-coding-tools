# Functions and directives - Core concepts
- URL: https://tailwindcss.com/docs/functions-and-directives
- Fetched: 2026-08-14
- Source type: official docs
- Component: directives

A reference for the custom functions and directives Tailwind exposes to CSS.

## Directives

Directives are custom Tailwind-specific at-rules usable in CSS that offer special functionality for Tailwind CSS projects.

### @import

Use `@import` to inline import CSS files, including Tailwind itself:

```css
@import "tailwindcss";
```

### @theme

Use `@theme` to define a project's custom design tokens, like fonts, colors, and breakpoints:

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}
```

### @source

Use `@source` to explicitly specify source files that aren't picked up by Tailwind's automatic content detection:

```css
@source "../node_modules/@my-company/ui-lib";
```

### @utility

Use `@utility` to add custom utilities that work with variants like `hover`, `focus`, and `lg`:

```css
@utility tab-4 {
  tab-size: 4;
}
```

### @variant

Use `@variant` to apply a Tailwind variant to styles inside custom CSS:

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

### @custom-variant

Use `@custom-variant` to add a custom variant to a project:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

This enables `theme-midnight:bg-black` and `theme-midnight:text-white` in markup.

### @apply

Use `@apply` to inline existing utility classes into custom CSS:

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
.select2-search {
  @apply rounded border border-gray-300;
}
```

Useful when writing custom CSS (e.g. to override a third-party library) while still using design tokens and familiar syntax.

### @reference

To use `@apply` or `@variant` inside a Vue or Svelte component's `<style>` block, or in CSS modules, import theme variables, custom utilities, and custom variants so they're available in that context, without duplicating CSS in the output:

```html
<style>
  @reference "../../app.css";
  h1 {
    @apply text-2xl font-bold text-red-500;
  }
</style>
```

If only using the default theme with no customizations, `@reference "tailwindcss";` is enough.

### Subpath imports

When using the CLI, Vite, or PostCSS, `@import`, `@reference`, `@plugin`, and `@config` all support subpath imports, similar to bundler/TypeScript path aliases, via the `imports` field in `package.json`.

## Functions

### --alpha()

Adjusts the opacity of a color:

```css
.my-element {
  color: --alpha(var(--color-lime-300) / 50%);
}
/* compiles to */
.my-element {
  color: color-mix(in oklab, var(--color-lime-300) 50%, transparent);
}
```

### --spacing()

Generates a spacing value based on the theme:

```css
.my-element {
  margin: --spacing(4);
}
/* compiles to */
.my-element {
  margin: calc(var(--spacing) * 4);
}
```

Useful in arbitrary values combined with `calc()`: `class="py-[calc(--spacing(4)-1px)]"`.

## Compatibility (v3.x compatibility only)

The `@config` and `@plugin` directives may be used alongside `@theme`, `@utility`, and other CSS-driven features, to incrementally move theme, configuration, utilities, variants, and presets to CSS. Things defined in CSS merge where possible and otherwise take precedence over configs/presets/plugins.

### @config

Loads a legacy JavaScript-based configuration file:

```css
@config "../../tailwind.config.js";
```

The `corePlugins`, `safelist`, and `separator` options from JS config are not supported in v4.0. Use `@source inline()` to safelist utilities in v4.

### @plugin

Loads a legacy JavaScript-based plugin (package name or local path):

```css
@plugin "@tailwindcss/typography";
```

### theme()

Access theme values using dot notation. Deprecated; use CSS theme variables instead.

```css
.my-element {
  margin: theme(spacing.12);
}
```

## Adding custom utilities (functional utility syntax detail)
- URL: https://tailwindcss.com/docs/adding-custom-styles
- Fetched: 2026-08-14
- Source type: official docs
- Component: directives

### Simple utilities

```css
@utility content-auto {
  content-visibility: auto;
}
```

Usable directly (`content-auto`) or with variants (`hover:content-auto`). Custom utilities are automatically inserted into the `utilities` layer alongside built-in utilities.

### Complex utilities

Use nesting when a custom utility is more complex than a single class:

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar {
    display: none;
  }
}
```

### Functional utilities

Register functional utilities accepting an argument using the `-*` suffix and the `--value()` function:

```css
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

- **Matching theme values:** `--value(--tab-size-*)` resolves against `@theme` keys like `--tab-size-2`, `--tab-size-4`.
- **Bare values:** `--value(integer)` matches `tab-1`, `tab-76`. Available bare types: `number`, `integer`, `ratio`, `percentage`.
- **Literal values:** `--value("inherit", "initial", "unset")` matches `tab-inherit`, etc (note quotes).
- **Arbitrary values:** `--value([integer])` matches `tab-[1]`. Available arbitrary types: `absolute-size`, `angle`, `bg-size`, `color`, `family-name`, `generic-name`, `image`, `integer`, `length`, `line-width`, `number`, `percentage`, `position`, `ratio`, `relative-size`, `url`, `vector`, `*`.
- **Combining all three:** multiple `--value()` declarations in one rule; failed resolutions are omitted from output.
- **Default values:** `--value(integer, --default(4))` makes bare `tab` resolve to the default.
- **Negative values:** register separate `@utility inset-*` and `@utility -inset-*` declarations.
- **Modifiers:** `--modifier()` works like `--value()` but operates on a modifier (e.g. `text-lg/7`).
- **Fractions:** relying on the CSS `ratio` data type, e.g. `aspect-ratio: --value(--aspect-ratio-*, ratio, [ratio]);` matches `aspect-square`, `aspect-3/4`, `aspect-[7/9]`.

### Rules and constraints (per community mirror of the source)
- URL: https://tailwindlabs-tailwindcss.mintlify.app/advanced/custom-utilities
- Fetched: 2026-08-14
- Source type: community (documentation mirror)
- Component: directives

- `@utility` must be defined at the top level (not nested inside another rule).
- Utility names must be alphanumeric and start with a lowercase letter (`/` and `%` allowed as special cases).
- Functional utilities must end with `-*`, and the wildcard must appear only once, at the end.
- Utility definitions must contain at least one property.
- If a utility is defined more than once, the latest definition wins (later `@utility` blocks with the same name override earlier ones, matching cascade-layer merge behavior).

## Adding custom variants
- URL: https://tailwindcss.com/docs/adding-custom-styles
- Fetched: 2026-08-14
- Source type: official docs
- Component: directives

```css
@custom-variant theme-midnight {
  &:where([data-theme="midnight"] *) {
    @slot;
  }
}
```

Shorthand syntax when nesting isn't required:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

Multiple rules can be nested within each other:

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```
