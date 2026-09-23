# Theme and tokens

Full syntax reference: `references/theme-directive-reference.md`. This guide covers the decision-making, not just the syntax.

## Deciding: `@theme` or `:root`?

Use `@theme` when a value should become a utility class. Use plain `:root { --foo: ...; }` when it's a variable other CSS needs to read but should never itself become a class like `foo-value`. [raw/01-theme-directive.md]

```css
@import "tailwindcss";

@theme {
  /* Generates bg-brand, text-brand, border-brand, etc */
  --color-brand: oklch(0.6 0.2 250);
}

:root {
  /* A layout constant with no utility-class use case */
  --header-height: 64px;
}
```

## Extending vs. overriding vs. resetting

- **Extend**: add a new variable name in an existing namespace. Adds a class, doesn't touch defaults.
- **Override**: redefine an existing default variable name (e.g. `--breakpoint-sm`). Changes behavior for every use of that utility/variant project-wide.
- **Reset a namespace**: `--color-*: initial;` then redefine only what you want. Removes every default color utility; only your replacements exist.
- **Reset everything**: `--*: initial;` at the top of `@theme`, then build the whole token set from scratch. Use for a fully bespoke design system with no Tailwind defaults bleeding through.

Full syntax for each: `references/theme-directive-reference.md`. Source: [raw/01-theme-directive.md].

## `inline` is not optional when a token references another variable

If a `@theme` variable's value is `var(--something-else)`, add `inline`:

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

Without `inline`, the generated utility class references the theme variable by name rather than resolving its value, and depending on where in the DOM `--font-inter` actually gets defined, the utility can silently fall back to the wrong value. This is the single most common "why doesn't my custom font work" bug in v4 projects. [raw/01-theme-directive.md]

## Keyframes travel with their `--animate-*` token

```css
@theme {
  --animate-fade-in-scale: fade-in-scale 0.3s ease-out;

  @keyframes fade-in-scale {
    0% { opacity: 0; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
}
```

If the keyframes need to ship even when the `--animate-*` token isn't referenced by a used utility, define `@keyframes` outside `@theme` instead; Tailwind only emits used CSS variables by default. [raw/01-theme-directive.md]

## Design-token sprawl signal

If the same arbitrary value (`bg-[#1c1f26]`, `top-[117px]`) shows up more than once or twice across a codebase, that's the signal to promote it into `@theme` rather than keep copy-pasting the bracket syntax. Tailwind frames arbitrary values explicitly as a pixel-perfect escape hatch, not a parallel design system. [raw/08-arbitrary-values-and-custom-styles.md], [raw/01-theme-directive.md]

## Multi-project token sharing

Because tokens are just CSS, a monorepo or design-system package can ship a `theme.css` with `--*: initial;` plus the full custom palette, and every app imports it after the Tailwind import:

```css
@import "tailwindcss";
@import "../../packages/brand/theme.css";
```

[raw/01-theme-directive.md]

## Out of scope here

The OSPRY PRD-071 token names, the `--brand-*` white-label contract, and which specific `@theme inline` mappings apps/portal/web/wl should use are not covered by this guide. That's `ux-ui-svelte-stinger`'s `guides/02-token-bridge.md`.
