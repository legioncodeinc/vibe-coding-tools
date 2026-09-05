---
source_type: community
authority: medium
relevance: high
topic: data-attribute theme switching, multi-tenant CSS variable overrides, zero-JS brand swap
date_retrieved: 2026-05-20
url: https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/
---

# Multi-Brand CSS Runtime Swap (2026)

## The CSS variable override pattern

The canonical multi-brand pattern uses `data-brand` (or `data-tenant`) attribute on `<html>` or a root wrapper. Each brand block overrides the semantic token layer without touching primitive tokens or component styles:

```css
/* globals.css */
:root {
  /* semantic tokens — default brand (or empty for override-only approach) */
  --color-primary: #3b82f6;
  --color-primary-dark: #bfdbfe;
  --brand-logo-url: url('/logos/default.svg');
}

[data-brand="acme"] {
  --color-primary: #0070f3;
  --color-primary-dark: #3291ff;
  --brand-logo-url: url('/logos/acme.svg');
}

[data-brand="globex"] {
  --color-primary: #10b981;
  --color-primary-dark: #34d399;
  --brand-logo-url: url('/logos/globex.svg');
}
```

The brand attribute is set once at the root and inherits down: no JS re-renders required.

## Setting the brand attribute at runtime

```tsx
// In ThemeProvider or a custom BrandProvider
useEffect(() => {
  document.documentElement.setAttribute("data-brand", tenant.brandKey);
}, [tenant.brandKey]);
```

Or, for SSR match, inject from middleware:

```tsx
// layout.tsx (server component)
const brand = (await headers()).get("x-brand") ?? "default";
return <html data-brand={brand} suppressHydrationWarning> ... </html>;
```

## Combining dark mode + multi-brand

The two selectors compose without conflict:

```css
/* Dark overrides for a specific brand */
[data-brand="acme"].dark,
[data-brand="acme"] .dark {
  --color-primary: #93c5fd; /* acme dark primary */
}
```

Or use a nested selector for clarity:

```css
[data-brand="acme"] {
  &.dark, & .dark {
    --color-primary: #93c5fd;
  }
}
```

## Isolation rule

**Never let one brand's `data-brand` block inherit into a nested brand context.** If an app can render widgets from multiple brands simultaneously, scope each widget with its own `data-brand` wrapper rather than placing it on `<html>`.

## Performance

CSS variable overrides are instantaneous (no re-render, no layout recalculation) because they only change custom property inheritance. The browser resolves the new values in the next paint cycle without triggering JavaScript. This is the primary reason to prefer CSS variables over JS state for theming.
