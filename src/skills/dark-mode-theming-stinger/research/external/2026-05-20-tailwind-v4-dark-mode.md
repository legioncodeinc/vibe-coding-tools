---
source_type: framework_docs
authority: high
relevance: high
topic: Tailwind v4 dark mode configuration, Oxide engine, @custom-variant
date_retrieved: 2026-05-20
url: https://tailwindcss.com/docs/dark-mode
---

# Tailwind v4 Dark Mode (2026)

## v4 vs v3 key difference

In Tailwind v3, dark mode was configured via `tailwind.config.js`:
```js
module.exports = { darkMode: 'class' }
```

In Tailwind v4 (Oxide engine), the configuration moves into CSS via `@custom-variant`:

```css
/* app/globals.css */
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

This means dark mode variants like `dark:bg-gray-900` continue to work, but the selector logic is now defined in CSS, not JS config. The `darkMode` key in `tailwind.config.js` still works for backward compat but is soft-deprecated.

## Selector strategies in v4

| Strategy | CSS selector | Use when |
|----------|-------------|----------|
| `class` (v3 default) | `.dark .element` | Class on `<html>` via next-themes |
| `selector` (v4 stable) | `[data-theme="dark"] .element` | `data-theme` attribute on `<html>` |
| `media` (v3/v4) | `@media (prefers-color-scheme: dark)` | System-only, no manual override |

For `next-themes` with `attribute="class"`, use `@custom-variant dark (&:where(.dark, .dark *))`.
For `next-themes` with `attribute="data-theme"`, use `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *))`.

## Oxide engine compatibility

- All `dark:` variants continue to work without modification in v4.
- Third-party UI libraries targeting Tailwind v3 class conventions should still work; test before upgrade.
- PostCSS config changes in v4: `@tailwindcss/postcss` replaces the old plugin setup.

## Multi-brand theming with Tailwind v4

Tailwind v4 does not have a built-in multi-brand system. The recommended pattern is to use `data-brand` attribute selectors alongside `dark:` variants:

```css
[data-brand="acme"] {
  --color-primary: #0070f3;
  --color-primary-dark: #3291ff;
}
[data-brand="globex"] {
  --color-primary: #10b981;
  --color-primary-dark: #34d399;
}
```

Then in Tailwind utility classes, reference `var(--color-primary)` via `text-[var(--color-primary)]` or a custom token.
