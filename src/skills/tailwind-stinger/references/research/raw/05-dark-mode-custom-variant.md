# Dark mode - Core concepts
- URL: https://tailwindcss.com/docs/dark-mode
- Fetched: 2026-08-14
- Source type: official docs
- Component: dark-mode

Using variants to style your site in dark mode.

## Overview

Now that dark mode is a first-class feature of many operating systems, it's becoming more common to design a dark version of a website to go along with the default design.

Tailwind includes a `dark` variant that lets you style a site differently when dark mode is enabled:

```html
<div class="bg-white dark:bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
  <div>
    <span class="inline-flex items-center justify-center rounded-md bg-indigo-500 p-2 shadow-lg">
      <svg class="h-6 w-6 stroke-white">...</svg>
    </span>
  </div>
  <h3 class="text-gray-900 dark:text-white mt-5 text-base font-medium tracking-tight">Writes upside-down</h3>
  <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
    The Zero Gravity Pen can be used to write in any orientation, including upside-down. It even works in outer space.
  </p>
</div>
```

By default this uses the `prefers-color-scheme` CSS media feature, but sites can also support toggling dark mode manually by overriding the `dark` variant.

## Toggling dark mode manually

If the dark theme should be driven by a CSS selector instead of the `prefers-color-scheme` media query, override the `dark` variant with `@custom-variant`:

```css
/* app.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

Now instead of `dark:*` utilities being applied based on `prefers-color-scheme`, they're applied whenever the `dark` class is present earlier in the HTML tree:

```html
<html class="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

How the `dark` class gets added to the `html` element is up to the project. A common approach is JavaScript that updates the `class` attribute and syncs the preference to `localStorage`.

### Using a data attribute

To use a data attribute instead of a class, override the `dark` variant with an attribute selector:

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));
```

```html
<html data-theme="dark">
  <body>
    <div class="bg-white dark:bg-black">
      <!-- ... -->
    </div>
  </body>
</html>
```

### With system theme support

To build three-way theme toggles (light, dark, system), use a custom dark mode selector and the `window.matchMedia()` API to detect the system theme and update the `html` element when needed:

```js
// On page load or when changing themes, best to add inline in head to avoid FOUC
document.documentElement.classList.toggle(
  "dark",
  localStorage.theme === "dark" ||
    (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),
);
// Whenever the user explicitly chooses light mode
localStorage.theme = "light";
// Whenever the user explicitly chooses dark mode
localStorage.theme = "dark";
// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem("theme");
```

This can be managed however desired, even storing the preference server-side and rendering the class on the server.

## Multiple selector rules for @custom-variant
- URL: https://timomeh.de/posts/upgrading-to-tailwind-v4
- Fetched: 2026-08-14
- Source type: blog (community, migration experience report)
- Component: dark-mode

The shorthand `@custom-variant dark (&:where(...));` syntax only supports a single rule. To combine multiple selector rules (e.g. both a data-attribute override and a prefers-color-scheme fallback, as was possible with the v3 `darkMode: ['variant', [...]]` array config), use the long-form block syntax with `@slot`:

```css
/* v3 JS config equivalent */
module.exports = {
  darkMode: [
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(html[data-theme=light] *, [data-theme=light]) }',
      '&:is([data-theme=dark] *, html[data-theme=dark])',
    ],
  ]
}
```

```css
/* v4 long-form @custom-variant with multiple rules */
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

## Common failure mode reported in GitHub Discussions
- URL: https://github.com/tailwindlabs/tailwindcss/discussions/18207
- Fetched: 2026-08-14
- Source type: community (GitHub Discussions, tailwindlabs org repo)
- Component: dark-mode

If a `dark` class toggle on `<html>` isn't reflecting styles, the most common cause reported is forgetting to add `@custom-variant dark (&:where(.dark, .dark *));` to the CSS entry file. By default Tailwind v4 uses the `prefers-color-scheme` media query, not a class toggle, so a bare `.dark` class on `<html>` does nothing unless the custom variant is declared.
