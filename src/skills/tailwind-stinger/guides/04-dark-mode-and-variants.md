# Dark mode and custom variants

## Default behavior needs no setup

Out of the box, `dark:` follows `prefers-color-scheme`. If a project only needs to respect the OS preference, there is nothing to configure. [raw/05-dark-mode-custom-variant.md]

```html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  <!-- follows OS preference automatically -->
</div>
```

## Class-based toggle

Most product UIs want a manual light/dark/system toggle, which means overriding the `dark` variant to key off a class instead:

```css
/* app.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black"><!-- ... --></div>
  </body>
</html>
```

[raw/05-dark-mode-custom-variant.md]

## Data-attribute toggle

Same idea, keyed off an attribute instead of a class (useful when a class is already reserved for something else, or the design system prefers `data-theme`):

```css
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

[raw/05-dark-mode-custom-variant.md]

## Three-way toggle (light / dark / system)

```js
// Inline in <head> to avoid a flash of unstyled content
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
// User explicitly picks light
localStorage.theme = "light";
// User explicitly picks dark
localStorage.theme = "dark";
// User explicitly picks "match system"
localStorage.removeItem("theme");
```

Pair this with the class-based `@custom-variant dark` above. [raw/05-dark-mode-custom-variant.md]

## Multiple selector rules in one custom variant

The shorthand `@custom-variant dark (&:where(...));` only supports a single selector rule. If a project needs to combine a data-attribute override with a `prefers-color-scheme` fallback in one variant (matching a v3 `darkMode: ['variant', [...]]` array config), use the block form with `@slot`:

```css
@custom-variant dark {
  &:where([data-theme='dark'] *, [data-theme='dark']) {
    @slot;
  }

  @media (prefers-color-scheme: dark) {
    &:not(html[data-theme='light'] *, [data-theme='light']) {
      @slot;
    }
  }
}
```

[raw/05-dark-mode-custom-variant.md]

## Custom variants beyond dark mode

`@custom-variant` isn't dark-mode-specific. Any named condition can become a variant:

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

```html
<button class="theme-midnight:bg-black">...</button>
```

For a variant that needs to nest multiple rules (not just a single selector), use the block form:

```css
@custom-variant any-hover {
  @media (any-hover: hover) {
    &:hover {
      @slot;
    }
  }
}
```

[raw/07-functions-and-directives.md]

## The #1 failure mode

Toggling a `.dark` class on `<html>` and seeing nothing change. This happens when `@custom-variant dark` was never declared, the project is still on the default `prefers-color-scheme` strategy, so a class toggle is inert. Check the CSS entry file for the `@custom-variant dark` line before debugging anything else. [raw/05-dark-mode-custom-variant.md]

## Out of scope

OSPRY is dark-first (inverted from shadcn-svelte's light-first default) and has its own `--brand-*` white-label chain layered on top of dark mode. That inversion and chain are `ux-ui-svelte-stinger`'s `guides/04-dark-mode-inversion.md` and `guides/05-white-label-preservation.md`, not this guide.
