# Tailwind CSS v4 — `@theme` and design tokens

**Sources:**
- https://tailwindcss.com/blog/tailwindcss-v4
- https://tailwindcss.com/docs/theme
- https://tailwindcss.com/docs/adding-custom-styles
- https://www.maviklabs.com/blog/design-tokens-tailwind-v4-2026

**Retrieved:** 2026-04-24
**Queries used:** "Tailwind CSS v4 @theme directive design tokens 2026"

## Summary

Tailwind v4 flipped to CSS-first configuration. The `@theme { --color-brand: ...; }` directive in `globals.css` both registers the CSS custom property *and* generates utility classes (`bg-brand`, `text-brand`, etc.). The browser exposes every theme value as a native CSS variable, so designers, code, and third-party styles read from the same source. Runtime theme switching (dark mode, tenant theming) happens by overriding the variables at a selector — no rebuild required. OKLCH is the default color space for perceptual evenness.

## Key quotations

> "Theme variables are special CSS variables defined using the `@theme` directive that influence which utility classes exist in your project."

> "Tailwind v4 fundamentally changed how design tokens work by moving from JavaScript configuration to a CSS-first approach."

> "Because theme tokens are CSS custom properties, runtime theme switching no longer requires a rebuild. Override the `@theme` variables at a selector level and every Tailwind utility using those tokens updates automatically."

> "Use three token layers: base (raw values), semantic (purpose-driven), component (variants)."

## Integration pattern for this Stinger

- The product's `01-master-tokens.css` lives as `@theme { --color-...; --radius-...; --dur-...; }` — that's the *single* place tokens are registered.
- Tenant/theme overrides go under scoped selectors (e.g., `[data-tenant="acme"] { --color-brand: oklch(...); }`).
- shadcn/ui's default `tailwind.config` variables map directly onto `@theme` custom properties — the product's token names win, and shadcn's defaults are overridden by mapping.

## Relevance to this Stinger

- `guides/02-token-and-utility-enforcement.md` — the canonical token layer pattern.
- `guides/04-shadcn-ui-integration.md` — how shadcn's Tailwind defaults are mapped to product tokens via `@theme`.
