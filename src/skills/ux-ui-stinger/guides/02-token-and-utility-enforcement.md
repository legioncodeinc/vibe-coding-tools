# 02 — Token and Utility Enforcement

The token layer is the contract. The utility layer is the shorthand. Neither can be bypassed.

## The token layer

A token is any design primitive with a name: a color, radius, shadow, spacing step, duration, easing curve, z-index, or typography scale. All tokens live in the product's master-tokens file (commonly `01-master-tokens.css`) as CSS custom properties under `:root` (or under Tailwind v4's `@theme` directive — see `research/2026-04-24-tailwind-v4-theme-tokens.md`).

```css
:root {
  --color-brand: oklch(0.74 0.16 55);
  --color-gold-ink: oklch(0.50 0.14 70);
  --radius-badge: 4px;
  --dur-fast: 140ms;
  --ease-out-subtle: cubic-bezier(0.2, 0.7, 0.2, 1);
}
```

## Rule 1 — Hex literals where a token exists are bugs

When reviewing a diff, search for:

- `#[0-9a-fA-F]{3,8}` — hex literals.
- `rgb\(|rgba\(|hsl\(|oklch\(` — inline color calls.
- Raw pixel values for radii, shadows, durations, z-indices, typography sizes.

For each hit, identify whether the value is expressible as an existing token. If yes, flag and propose the token. If no, *add the token first*, then use it.

## Rule 2 — Inline utility re-implementations are bugs

Search for common re-implementations:

| Pattern | Utility |
| --- | --- |
| `backdrop-filter: blur(...)` + `background: rgba(...)` | `.glass-surface` |
| `box-shadow: 0 1px 2px ...` short stack | `.depth-1` |
| `box-shadow: 0 4px 12px ...` stack | `.depth-2` |
| `box-shadow: 0 16px 40px ...` stack | `.depth-3` |
| `transform: scale(0.97)` on `:active` | `.press-scale` |

Each hit is a review finding: "Line X re-implements `.glass-surface`; replace inline styles with `className="glass-surface depth-1"`."

## Rule 3 — Adding a new token

Before adding a token, audit:

1. Is this genuinely new, or is there a close-enough existing token? (Brutal — "close enough" is the default answer.)
2. Does the new token belong in the base layer (raw value) or the semantic layer (purpose-driven)? Follow the product's token hierarchy. See `research/2026-04-24-tailwind-v4-theme-tokens.md` for the three-layer pattern: base → semantic → component.
3. Does the new token need a tenant-theme override path? If so, register the `[data-tenant="..."]` selector alongside the base.

Commit message: `ux-ui-worker-bee: tokens: add --<name>` (or whatever convention the deploying product's knowledge-base specifies).

## Rule 4 — Tenant theming goes through overridable tokens

Product-level tokens are the base. Tenant overrides are scoped selectors:

```css
[data-tenant="acme"] {
  --color-brand: oklch(0.68 0.19 25);
}
```

If a PR hard-codes a tenant's brand color instead of routing through `var(--color-brand)`, it's a bug — the product no longer supports multi-tenant theming correctly.

## Rule 5 — Dark mode goes through color-scheme tokens

Dark mode is a scheme-scoped override, not a separate codebase:

```css
@media (prefers-color-scheme: dark) {
  :root { --color-surface: ...; }
}
```

If a component uses `dark:` Tailwind variants on raw hex values instead of schema-aware tokens, it's a bug. The fix is to map the variable itself across schemes, so component code has no knowledge of "dark mode".

## Rule 6 — RTL and logical properties

Components use CSS logical properties (`padding-inline-start`, not `padding-left`) so right-to-left flips work automatically. Tailwind v4 exposes logical property utilities (`ps-4`, `pe-4`, `ms-auto`). Raw `pl-4` / `margin-left` in a new component is a flag.

---

*Worked example:* `examples/review-output-example.md` includes a hex-literal-with-token-available violation.

*Source:* `research/2026-04-24-tailwind-v4-theme-tokens.md`.
