# 03: Authoring the Token Layer

`01-master-tokens.css` is the lowest layer. Every other file references
it. Get this right and the rest falls into place.

> Template: `../templates/master-tokens.css` (pulled from starter kit).
> Research backing: `../research/2026-04-24-tailwind-v4-theme.md`,
> `../research/2026-04-24-oklch-color-space.md`,
> `../research/2026-04-24-design-tokens-dtcg.md`.

## File structure

```css
/* =====================================================
 * 01-master-tokens.css
 * Master token layer for <Product>.
 * Keep in sync with 00-design-brief.md.
 * =================================================== */

@theme {
  /* Tenant-themable brand ------------------------------ */
  --color-primary: var(--tenant-primary, #<hex>);
  --color-accent:  var(--tenant-accent,  #<hex>);
}

@theme inline {
  /* Semantic state colors ------------------------------ */
  --color-green: ...;  --color-red: ...;  /* etc */

  /* Surfaces ------------------------------------------- */
  --color-background: ...;
  --color-card:       ...;
  /* ... */

  /* Text hierarchy (5 stops) --------------------------- */
  --color-text-strong:  ...;
  --color-text-primary: ...;
  --color-text-body:    ...;
  --color-text-muted:   ...;
  --color-text-quiet:   ...;

  /* Typography ----------------------------------------- */
  /* Spacing -------------------------------------------- */
  /* Radii ---------------------------------------------- */
  /* Shadows -------------------------------------------- */
  /* Motion --------------------------------------------- */
}

/* Force light mode unless dark-mode is explicit ---- */
:root { color-scheme: light only; }

/* Dark-mode token overrides (if in scope) ---------- */
@media (prefers-color-scheme: dark) {
  :root { /* redefine surfaces + text tokens */ }
}
```

## The `@theme` vs `@theme inline` split

- `@theme { ... }`: tokens that MUST reach through to Tailwind v4 utility
  generation AND allow runtime tenant overrides. Use the
  `var(--tenant-*, fallback)` pattern.
- `@theme inline { ... }`: fixed tokens that Tailwind inlines at build
  time. No runtime override. Use for everything that doesn't change per
  tenant: semantic state colors, surfaces, text, spacing, radii, shadows,
  motion.

Rule of thumb: brand colors → `@theme`. Everything else → `@theme inline`.

## Color tokens

### Surfaces (the stage)

Always define at least:
- `--color-background`: the page.
- `--color-card`: the floating surface.
- `--color-card-secondary`: nested surface (sub-rows, sub-tree).
- `--color-border`: 1px divider.
- `--color-border-light`: inner hairline.
- `--color-top-edge-light`: rim highlight (for glass aesthetics).

### Brand (the accents)

- `--color-primary`: brand primary.
- `--color-primary-deep`, `--color-primary-light`: hover/pressed.
- `--color-accent`: brand accent.
- `--color-accent-dark`, `--color-accent-light`.
- `--color-accent-ink`: a readable-on-cream/white dark variant for
  text use. Bright accents almost always fail contrast on light
  backgrounds for body copy: the "accent-ink" token is the fix.

### Text hierarchy (5 stops minimum)

- `--color-text-strong`: major numbers, card titles.
- `--color-text-primary`: body copy.
- `--color-text-body`: secondary paragraph copy.
- `--color-text-muted`: metadata, hint text. This is the contrast
  floor: 4.5:1 on background.
- `--color-text-quiet`: timestamps, ghosts.

### OKLCH vs hex

- Brand colors the user gave you → keep as hex (tenant round-trip,
  Figma-matched).
- Derived shades (hover, pressed, disabled) → `oklch()` or
  `color-mix()`. Example:
  ```css
  --color-primary-hover: color-mix(in srgb, var(--color-primary) 92%, black);
  ```
- New palette colors you chose (greys, semantic greens/reds) → `oklch()`
  for perceptual uniformity.

See `../research/2026-04-24-oklch-color-space.md`.

## Spacing

One ladder. Nine stops. A typical glass-on-beige product:

```css
--space-0:  0;
--space-1:  4px;
--space-2:  8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-7: 32px;
--space-8: 48px;
```

Plus `--space-paragraph` for inter-paragraph gap in prose blocks.

**Forbidden:** arbitrary margin/padding values in component code. If
you need `13px`, add a token or use the closest stop.

## Radii

One vocabulary. The reference uses seven:

```css
--radius-badge:   4px;
--radius-input:  10px;
--radius-button: 12px;
--radius-card:   14px;
--radius-card-lg:18px;
--radius-tile:   20px;
--radius-pill:   9999px;
```

Pick whichever radii your product needs; keep it under ~7 tokens.

## Shadows

For a glass/depth aesthetic, expose the three-cue recipe AS TOKENS so
utility classes can compose them:

```css
--shadow-edge:    inset 0 1px 0 var(--color-top-edge-light);
--shadow-direct:  0 1px 2px color-mix(in srgb, var(--color-primary) 10%, transparent);
--shadow-ambient: 0 6px 20px color-mix(in srgb, var(--color-primary) 8%, transparent);

--shadow-card:     var(--shadow-edge), var(--shadow-direct), var(--shadow-ambient);
--shadow-elevated: var(--shadow-edge), /* ... */;
--shadow-hero:     var(--shadow-edge), /* ... */;
```

For a flat aesthetic, shadows are sparser or absent, but every shadow
that exists is a token, never an inline value.

## Motion

```css
--ease-out-subtle:  cubic-bezier(0.2, 0.7, 0.3, 1);
--ease-in-out-ui:   cubic-bezier(0.4, 0,   0.2, 1);
--ease-spring-soft: cubic-bezier(0.32, 0.72, 0, 1);

--dur-instant: 120ms;
--dur-fast:    180ms;
--dur-default: 240ms;
--dur-slow:    320ms;
```

Three curves, four durations. Components compose them:
`transition: transform var(--dur-fast) var(--ease-out-subtle);`

## Typography tokens

```css
--font-display: "Playfair Display", Georgia, serif;
--font-sans:    "Inter", system-ui, -apple-system, sans-serif;

--text-10: 0.625rem;  --text-10--line-height: 1.35;
--text-12: 0.75rem;   --text-12--line-height: 1.45;
/* ... up to --text-48 */
```

Using Tailwind v4's `--text-{size}--line-height` companion variable
auto-wires line-height to font size.

## Dark mode

If in scope, duplicate surface and text tokens under a media query:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0F1115;
    --color-card:       #181B22;
    --color-text-strong:  #F5F6F8;
    --color-text-primary: #E1E4EB;
    /* etc */
  }
}
```

Radii, spacing, motion do NOT change in dark mode.

## Tenant theming bridge

If the product is multi-tenant:

```css
:root {
  /* default values — get overwritten by <style> injection at runtime */
  --tenant-primary: #1B2B4B;
  --tenant-accent:  #C5A44E;
}

[data-tenant="acme"] {
  --tenant-primary: #0066CC;
  --tenant-accent:  #FF6600;
}
```

Token layer consumes via `var(--tenant-primary, #1B2B4B)`.

## Design Tokens (DTCG) bridge

The canonical source of truth is the CSS file, not DTCG JSON. If the
product needs DTCG for Figma sync, emit it from the CSS via a small
script. See `../research/2026-04-24-design-tokens-dtcg.md`.

## Common mistakes

- **Hex values in component CSS.** Every hex belongs in the token layer.
- **Motion values inline.** Every duration and curve is a named token.
- **New tokens per component.** If a token is used once, question
  whether it's a token at all. Tokens are the shared vocabulary.
- **Mixing dark-mode logic into components.** Dark mode lives in the
  token layer; components reference semantic tokens only.
