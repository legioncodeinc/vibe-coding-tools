# Tailwind CSS v4 `@theme`: CSS-First Configuration

**Sources:**
- https://tailwindcss.com/docs/configuration (retrieved 2026-04-24)
- https://v3.tailwindcss.com/docs/v4-beta (retrieved 2026-04-24)
- https://dev.to/whoffagents/tailwind-css-v4-what-actually-changed-and-how-to-migrate-2ieh (2026-04-20)
- https://aura-ui.com/blog/tailwind-css-4-theme-customization-css-custom-properties (2026-02-22)

**Retrieved:** 2026-04-24

## Summary

Tailwind v4 kills `tailwind.config.js`. All customization moves into CSS via
the `@theme` directive. Tokens declared inside `@theme` become both CSS custom
properties (reachable as `var(--color-brand-500)`) and utility classes
(`bg-brand-500`). This means the Bee's `01-master-tokens.css` can double as
the Tailwind config: one source of truth.

## Key patterns

```css
@import "tailwindcss";

@theme {
  --color-brand-500: oklch(55% 0.2 250);
  --font-display:    "Satoshi", "sans-serif";
  --radius-card:     14px;
  --ease-out-subtle: cubic-bezier(0.2, 0.7, 0.3, 1);
  --dur-fast:        180ms;
}
```

- Values MUST be declared top-level (not nested under `:root` or `@media`).
- Tokens become utilities automatically: `--color-brand-500` generates
  `bg-brand-500`, `text-brand-500`, `border-brand-500`, etc.
- `--*: initial;` inside `@theme` nukes the default theme, useful when a
  product wants only its own tokens.
- Use `:root { --some-var: ... }` for runtime-overridable values that
  shouldn't generate utility classes (tenant overrides live here).

## `@theme` vs `@theme inline`

A typical multi-tenant glass-on-beige product uses BOTH:

- `@theme { ... }`: tenant-themable brand tokens that wrap values in
  `var(--tenant-primary, #1B2B4B)` so runtime tenant overrides cascade.
- `@theme inline { ... }`: fixed tokens (semantic state colors, spacing,
  radii, shadows) that should be inlined at build time, not resolved at
  runtime.

This split is the pattern for multi-tenant SaaS products. Tenant-themable
brand colors go under `@theme`; everything else under `@theme inline`.

## Relevance to this stinger

- `guides/03-authoring-tokens.md` teaches the `@theme` pattern as the
  canonical token layer.
- Each `starter-kits/*/01-master-tokens.css` uses `@theme` so it works as a
  drop-in Tailwind v4 config.
- The Bee should flag a design system that declares tokens OUTSIDE
  `@theme` as a drift: tokens must be discoverable by the utility generator.
