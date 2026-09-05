# 04: Authoring the Utility Layer

The utility layer (`02-<aesthetic>.css`) sits between the tokens and the
components. It composes tokens into named utilities that deliver the
product's look. For a glass aesthetic, this file is named
`02-glass-and-depth.css`. For a flat aesthetic it might be
`02-surfaces-and-borders.css`. The name follows the aesthetic.

> Template: `../templates/utility-layer.css`.
> Research backing: `../research/2026-04-24-glassmorphism-production.md`.

## File structure

```css
/* =====================================================
 * 02-<aesthetic>.css
 * Utility layer for <Product>.
 * Reads 01-master-tokens.css.
 * =================================================== */

@layer utilities {
  /* Surface utilities ---------------------------------- */
  /* Depth tiers ---------------------------------------- */
  /* Nav / indicator utilities -------------------------- */
  /* Press / hover helpers ------------------------------ */
  /* Prose / typographic helpers ------------------------ */

  /* Reduced motion ------------------------------------- */
  @media (prefers-reduced-motion: reduce) {
    /* dampen transitions, disable transforms */
  }
}
```

Wrap the entire layer in `@layer utilities {}` so component styles win
cleanly without `!important` games.

## The three-cue glass recipe (for glass aesthetics)

If the aesthetic is glass or translucent materials, every floating
surface composes three shadow cues:

1. **Top-edge highlight**: `inset 0 1px 0 var(--color-top-edge-light)`
   (the rim of light).
2. **Direct shadow**: tight, 1px offset, darker tint.
3. **Ambient shadow**: soft, wide, lighter tint.

```css
.glass-surface {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);  /* composed in tokens */
  color: var(--color-text-primary);
}
```

**Missing any cue = not glass.** This is the test.

## Backdrop filter: if used at all

For pinned nav shells, modal backdrops, or any surface where real
translucency matters:

```css
.glass-surface--pinned {
  background-color: color-mix(in srgb, var(--color-card) 84%, transparent);
  -webkit-backdrop-filter: saturate(140%) blur(20px);
          backdrop-filter: saturate(140%) blur(20px);
}

@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .glass-surface--pinned { background-color: var(--color-card); }
}
```

### Rules

- Blur radius ≤ 20px for most uses. Above 30px = noise + performance
  drop.
- Never animate `backdrop-filter`. Animate `opacity` or `background`
  alpha instead.
- Never stack multiple blurred layers on the same z-axis.
- Always ship the `@supports` fallback (opaque card color).
- Mobile budget: ≤ 2 blurred surfaces visible simultaneously.

## Depth tiers

Name the depth tiers explicitly. The reference system uses four:

```css
.depth-0 { box-shadow: none; }                  /* flush */
.depth-1 { box-shadow: var(--shadow-card); }    /* cards, rows */
.depth-2 { box-shadow: /* stronger */; }        /* nav, popovers */
.depth-3 { box-shadow: /* strongest */; }       /* modals, hero */
```

A flat-modern aesthetic might have `depth-0` and `depth-1` only, where
`depth-1` is a crisp 1px border and no shadow.

## Active-state / indicator utilities

Patterns most design systems need:

```css
.nav-indicator-left,
.nav-indicator-right,
.nav-indicator-top,
.nav-indicator-bottom {
  position: relative; isolation: isolate;
}
.nav-indicator-left::before { /* ... */ }
/* ... active state */
```

Name them by direction so components stay declarative.

## Press / hover helpers

```css
.press-scale {
  transition:
    transform var(--dur-instant) var(--ease-out-subtle),
    opacity   var(--dur-instant) var(--ease-out-subtle);
}
.press-scale:active {
  transform: scale(0.97);
  opacity: 0.92;
}
```

`.press-scale` is the canonical press feedback. Use it everywhere
something is tappable. Under reduced motion, suppress the transform.

## Prose helpers

```css
.prose-tight p + p   { margin-top: calc(var(--space-paragraph) * 0.75); }
.prose-regular p + p { margin-top: var(--space-paragraph); }
.prose-loose p + p   { margin-top: calc(var(--space-paragraph) * 1.25); }
```

Three density variants. Components scope them explicitly.

## Reduced motion

Always end the file with:

```css
@media (prefers-reduced-motion: reduce) {
  .press-scale                       { transition-duration: 80ms; }
  .press-scale:active                { transform: none; }
  .nav-indicator-left::before,
  .nav-indicator-right::before,
  .nav-indicator-top::before,
  .nav-indicator-bottom::before      { transition-duration: 80ms; }
}
```

Generic rule: every transition ≤ 80ms, every transform suppressed.

## Naming conventions

- **Kebab-case, dot-free.** `.glass-surface` not `.GlassSurface` or
  `.glass.surface`.
- **BEM-ish modifiers.** `.glass-surface--pinned`, `.nav-row--active`.
- **No utility namespacing.** Don't prefix with `.ds-` or `.app-`. The
  `@layer utilities` wrapper handles specificity.
- **Verbs for state.** `.press-scale`, not `.press-scaler`.
- **Direction-bearing names.** `.nav-indicator-left`, not `.ind-1`.

## What the utility layer is NOT

- A replacement for Tailwind. If Tailwind v4 is in use, its utilities
  coexist with these. Use this layer only for the PRODUCT-SPECIFIC
  named recipes that Tailwind can't express in one line.
- A component. A utility is a single visual or behavioral cue. If it
  starts needing slots and children, it's a component: promote it to
  `03-components/`.
- A semantic class. `.glass-surface` is visual; `.card-header` would be
  semantic. Keep them separate; the component brief uses both.

## Edge case: flat aesthetics

If the product rejects depth (Linear/Vercel vibe), the utility layer
mostly consists of border and typography helpers:

```css
.surface          { background: var(--color-card); border: 1px solid var(--color-border); border-radius: var(--radius-card); }
.surface--muted   { background: var(--color-card-secondary); }
.divider-hairline { border-top: 1px solid var(--color-border-light); }
```

No shadows, no backdrop-filter. The terseness is the aesthetic.
