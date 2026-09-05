# Multi-Brand Runtime Theme Swap: dark-mode-theming-stinger

*Covers: `data-brand` attribute strategy, CSS variable override injection, zero-JS swap, dark mode + brand composition, tenant isolation, security note.*

*Sources: `research/external/2026-05-20-multi-brand-css-runtime-swap.md`, `research/external/2026-05-20-css-variables-dark-mode.md`*

---

## Core pattern

Multi-brand theming uses a `data-brand` (or `data-tenant`) attribute on `<html>` combined with CSS variable override blocks. Each brand block overrides only the semantic tokens it changes:

```css
/* globals.css */

/* Default (no brand override needed — inherits from :root / .dark) */

[data-brand="acme"] {
  --color-primary:           #0070f3;
  --color-primary-hover:     #005bb5;
  --color-primary-foreground:#ffffff;
  --brand-logo-src:          url('/brands/acme/logo.svg');
  --brand-font-family:       'Söhne', sans-serif;
}

[data-brand="acme"].dark,
[data-brand="acme"] .dark {
  --color-primary:           #3291ff;
  --color-primary-hover:     #60a5fa;
}

[data-brand="globex"] {
  --color-primary:           #10b981;
  --color-primary-hover:     #059669;
  --color-primary-foreground:#ffffff;
  --brand-logo-src:          url('/brands/globex/logo.svg');
}

[data-brand="globex"].dark,
[data-brand="globex"] .dark {
  --color-primary:           #34d399;
  --color-primary-hover:     #6ee7b7;
}
```

---

## Setting the brand attribute

**Client-side (SPA/React):**

```tsx
"use client";
import { useEffect } from "react";
import { useTenant } from "@/hooks/use-tenant";

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const { brandKey } = useTenant();

  useEffect(() => {
    document.documentElement.setAttribute("data-brand", brandKey);
    return () => document.documentElement.removeAttribute("data-brand");
  }, [brandKey]);

  return <>{children}</>;
}
```

**Server-side (App Router, SSR match):**

```tsx
// app/layout.tsx
import { headers } from "next/headers";

export default async function RootLayout({ children }) {
  const brand = (await headers()).get("x-tenant-brand") ?? "default";
  return (
    <html lang="en" data-brand={brand} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
```

The tenant brand is resolved in middleware from the subdomain, JWT claim, or cookie, then forwarded as a request header.

---

## Combining with `next-themes` (dark mode + brand)

Both attributes are set independently; they compose without conflict:

```tsx
// app/layout.tsx
<html
  lang="en"
  data-brand={brand}           // brand: "acme" | "globex" | "default"
  suppressHydrationWarning     // for dark class mismatch from next-themes
>
```

CSS selectors pick up the combination automatically:
```css
/* Applies when brand is acme AND user is in dark mode */
[data-brand="acme"].dark { --color-primary: #3291ff; }
```

---

## Zero-JS brand swap

Because `data-brand` is an attribute on `<html>` and the overrides are pure CSS, changing the brand requires only:

```js
document.documentElement.setAttribute("data-brand", newBrand);
```

No state updates. No re-renders. The browser resolves the new CSS variable values in the next paint cycle. This is the primary performance advantage of CSS variable theming over JS-state-based theming.

---

## Tenant isolation rule

**Never let one brand's CSS bleed into a nested brand context.** If the application renders widgets from multiple tenants simultaneously (e.g., a dashboard showing cards from different brands):

```tsx
// ✓ Correct — scoped to the widget
<div data-brand="acme" className="widget">
  <WidgetContent />
</div>

// ❌ Wrong — data-brand on html will not scope to just this widget
```

Scope `data-brand` to the nearest common ancestor of the brand-specific content, not always `<html>`. Reserve `<html>` for the primary/active brand.

---

## Security: input validation

> **Security note:** If the `data-brand` value is derived from user-controlled input (URL parameter, tenant slug, query string), it MUST be validated against a server-side allowlist before being applied to the DOM. An unvalidated `data-brand` value could be used to inject unexpected CSS selectors or trigger unintended style overrides if the CSS contains wildcard-matched attribute selectors.

```ts
// middleware.ts — CORRECT: allowlist validation
const ALLOWED_BRANDS = ["default", "acme", "globex"] as const;
type BrandKey = (typeof ALLOWED_BRANDS)[number];

function resolveBrand(rawSlug: string): BrandKey {
  return ALLOWED_BRANDS.includes(rawSlug as BrandKey) ? (rawSlug as BrandKey) : "default";
}
```

Route to `security-worker-bee` if the brand value comes from untrusted input.

---

## Theming tokens to override per brand

Minimum set for a credible brand override:

| Token | Description |
|-------|-------------|
| `--color-primary` | Primary action color |
| `--color-primary-hover` | Primary hover state |
| `--color-primary-foreground` | Text/icon on primary background |
| `--brand-logo-src` | Logo image URL (CSS `content` or background) |
| `--brand-font-family` | Primary typeface (if brand uses a distinct font) |

Optional:
- `--color-destructive` (if brand uses a non-red danger color)
- `--color-surface` (for brands with distinct background hues)
- `--border-radius` (if brand uses sharper or rounder corners)

*Example demonstrating this guide: `examples/happy-path-app-router.md`*
