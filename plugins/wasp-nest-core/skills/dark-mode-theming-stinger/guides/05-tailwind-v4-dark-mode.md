# Tailwind v4 Dark Mode: dark-mode-theming-stinger

*Covers: `@custom-variant dark`, selector strategy, Oxide engine compatibility, v3 → v4 migration, `darkMode` config deprecation.*

*Sources: `research/external/2026-05-20-tailwind-v4-dark-mode.md`*

---

## Tailwind v4 dark mode setup

In Tailwind v4 (Oxide engine), dark mode configuration moves from `tailwind.config.js` into CSS:

```css
/* app/globals.css */
@import "tailwindcss";

/* For class-based dark mode (next-themes with attribute="class") */
@custom-variant dark (&:where(.dark, .dark *));
```

This replaces the v3 pattern:
```js
// tailwind.config.js (v3, still works but soft-deprecated in v4)
module.exports = { darkMode: 'class' }
```

After adding the `@custom-variant`, all existing `dark:*` utilities continue to work without modification:

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  ...
</div>
```

---

## Variant by strategy

| `next-themes` `attribute` | `@custom-variant` in `globals.css` |
|---------------------------|-----------------------------------|
| `"class"` | `@custom-variant dark (&:where(.dark, .dark *));` |
| `"data-theme"` | `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` |

Both are valid; `"class"` is the more common convention for Tailwind projects.

---

## Preferring CSS variables over Tailwind dark utilities

While `dark:*` utilities work correctly, the recommended pattern for 2026 is to use CSS variables exclusively and avoid `dark:` prefixes in component code:

```tsx
// ✓ Preferred — CSS variable, no Tailwind dark: prefix needed
<div className="bg-[var(--color-background)] text-[var(--color-text-primary)]">
```

```tsx
// ✓ Also acceptable — Tailwind utilities for non-themed values
<div className="rounded-lg p-4 bg-[var(--color-surface)]">
```

```tsx
// ⚠ Works but less preferred — Tailwind dark: utilities duplicate token logic
<div className="bg-white dark:bg-gray-900">
```

**Why prefer CSS variables:** Tailwind `dark:` utilities hard-code the dark value in the component, duplicating logic that belongs in the token layer. CSS variables keep the theming contract in one place.

---

## v3 → v4 migration path

| v3 | v4 |
|----|----|
| `darkMode: 'class'` in `tailwind.config.js` | `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` |
| `darkMode: 'media'` | `@custom-variant dark (@media (prefers-color-scheme: dark))` |
| `darkMode: ['class', '[data-mode="dark"]']` | `@custom-variant dark (&:where([data-mode=dark], [data-mode=dark] *))` |
| PostCSS `@tailwindcss/postcss` plugin | Same: install `@tailwindcss/postcss` |

---

## Third-party library compatibility

> TODO: open question, some component libraries (shadcn/ui, Radix UI, Mantine) may generate Tailwind utilities that assume v3 class conventions. Test the following before migrating to v4:
> 1. Dark mode utilities from the component library render correctly
> 2. `dark:` prefixes from the library resolve to the v4 `@custom-variant` selector
> 3. No duplicate specificity conflicts between library dark styles and app token overrides

If a library is not yet compatible with v4's Oxide engine, pin Tailwind to v3.x until the library updates.

---

## `prefers-reduced-motion` + dark mode transitions

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

`next-themes`'s `disableTransitionOnChange` disables transitions during the switch but does not permanently respect `prefers-reduced-motion`. Add the media query above to `globals.css` to handle motion sensitivity independently.

*Example demonstrating this guide: `examples/happy-path-app-router.md`*
