# Adding custom styles - Core concepts
- URL: https://tailwindcss.com/docs/adding-custom-styles
- Fetched: 2026-08-14
- Source type: official docs
- Component: arbitrary-values

Best practices for adding custom styles in Tailwind projects.

## Using arbitrary values

While most designs can be built with a constrained set of design tokens, occasionally something needs to break out of those constraints to get pixel-perfect. Use square bracket notation to generate a class on the fly with any arbitrary value:

```html
<div class="top-[117px]">
  <!-- ... -->
</div>
```

This is basically like inline styles, but combinable with interactive modifiers like `hover` and responsive modifiers like `lg`:

```html
<div class="top-[117px] lg:top-[344px]">
  <!-- ... -->
</div>
```

Works for background colors, font sizes, pseudo-element content, and more:

```html
<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">
  <!-- ... -->
</div>
```

If referencing a CSS variable as an arbitrary value, use the custom property syntax (parentheses), which is shorthand for wrapping in `var()`:

```html
<div class="fill-(--my-brand-color) ...">
  <!-- ... -->
</div>
```

### Arbitrary properties

Write completely arbitrary CSS with square bracket notation for a property Tailwind doesn't have a utility for:

```html
<div class="[mask-type:luminance]">
  <!-- ... -->
</div>
```

Works with modifiers too: `[mask-type:luminance] hover:[mask-type:alpha]`, and for CSS variables that need to change conditionally: `[--scroll-offset:56px] lg:[--scroll-offset:44px]`.

### Arbitrary variants

Arbitrary variants do on-the-fly selector modification directly in a class name, like built-in pseudo-class variants (`hover:`) or responsive variants (`md:`) but with square bracket notation: `lg:[&:nth-child(-n+3)]:hover:underline`.

### Handling whitespace

When an arbitrary value needs a space, use an underscore instead; Tailwind converts it to a space at build time: `grid-cols-[1fr_500px_2fr]`. Where underscores are legitimately needed but ambiguous, escape with a backslash, or in JSX use `String.raw`.

### Resolving ambiguities

Utilities sharing a namespace but mapping to different CSS properties (e.g. `text-lg` is font-size, `text-black` is color) are usually resolved automatically by value shape. For ambiguous cases like CSS variables, hint the type: `text-(length:--my-var)` vs `text-(color:--my-var)`.

## Using custom CSS

Nothing stops writing plain CSS when needed:

```css
@import "tailwindcss";
.my-custom-style {
  /* ... */
}
```

### Adding base styles

Add classes directly to `html`/`body` for page-level defaults, or use `@layer base` for default styles on specific elements:

```css
@layer base {
  h1 { font-size: var(--text-2xl); }
  h2 { font-size: var(--text-xl); }
}
```

### Adding component classes

Use the `components` layer for reusable classes still meant to be overridable by utility classes (traditionally `.card`, `.btn`, `.badge`):

```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-xl);
  }
}
```

Because these are in the `components` layer, utility classes can still override them: `<div class="card rounded-none">`. The official guidance: "Using Tailwind you probably don't need these types of classes as often as you think" — see the managing-duplication guidance.

### Using variants in custom CSS

Use `@variant` inside a custom rule:

```css
.my-element {
  background: white;
  @variant dark {
    background: black;
  }
}
```

Stack variants with `@variant hover:focus { ... }`, or apply the same styles to multiple variants by separating with commas: `@variant hover, focus { ... }`.

## Reusing styles and managing duplication (@apply is a last resort)
- URL: https://v3.tailwindcss.com/docs/reusing-styles
- Fetched: 2026-08-14
- Source type: official docs (v3 doc; the utility-first philosophy is unchanged in v4)
- Component: anti-patterns

Tailwind encourages a utility-first workflow, implementing designs using only low-level utility classes, as a way to avoid premature abstraction.

Recommended order of preference for handling duplication:

1. **Multi-cursor editing / loops within a single file.** A lot of apparent duplication doesn't exist because markup is rendered once inside a loop, or is localized enough that multi-cursor editing handles it with no abstraction needed.
2. **Components or template partials** for styles reused across multiple files (React, Svelte, Vue components; Blade/ERB/Twig/Nunjucks partials). This is the primary recommended mechanism: "Components and template partials solve this problem much better than CSS-only abstractions because a component can encapsulate the HTML and the styles."
3. **`@apply`, only for small, highly reusable primitives** (buttons, form controls) and only when a template partial "feels heavy-handed" (e.g., in a non-component templating language). Explicit warning: "Whatever you do, don't use `@apply` just to make things look 'cleaner'." Overusing `@apply` throws away Tailwind's workflow and maintainability advantages:
   - You have to think up class names constantly.
   - You have to jump between multiple files to make changes.
   - Changing styles becomes scarier because CSS is global.
   - The CSS bundle grows.

## @apply is not for copying utility internals into custom CSS
- URL: https://github.com/tailwindlabs/tailwindcss/discussions/19195
- Fetched: 2026-08-14
- Source type: community (GitHub Discussions, tailwindlabs org repo, includes maintainer reply)
- Component: anti-patterns

A maintainer response to a question about copying generated utility CSS (including internal `--tw-*` custom properties) into hand-written CSS: "The Tailwind paradigm is to keep the class names and don't copy anything to CSS. If you need to reuse this, consider converting it to a component in your templating language." The recommended approach for a repeated complex utility combination is component extraction using Tailwind's own design tokens (CSS variables) for anything hand-written, not copying internal implementation variables like `--tw-divide-y-reverse`.
