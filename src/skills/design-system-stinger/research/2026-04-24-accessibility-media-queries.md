# Accessibility Media Queries: prefers-reduced-motion, prefers-color-scheme, prefers-contrast

**Sources:**
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
- https://www.w3.org/TR/mediaqueries-5/

**Retrieved:** 2026-04-24

## Summary

Three user-agent-exposed media queries define the accessibility surface
every design system must handle. Supporting them is not optional: WCAG 2.2
references them and they ship in every evergreen browser.

### `prefers-reduced-motion: reduce`

Triggered when the OS/user requests minimal motion. Must disable:
- Parallax, auto-play carousels, ambient animations, decorative transitions.
- Any animation over ~80ms duration.

Keep: state-confirmation feedback (focus rings, press scale at low duration,
instant fades). A typical pattern is to drop press-scale and shorten all
transitions to 80ms under reduced motion.

```css
@media (prefers-reduced-motion: reduce) {
  .press-scale { transition-duration: 80ms; }
  .press-scale:active { transform: none; }
}
```

### `prefers-color-scheme: dark | light`

Triggered by OS theme. Design systems that support dark mode define a
parallel set of surface/text tokens. The Bee ships dark-mode variants in
the token layer, not in component code.

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0F1115;
    --color-card:       #181B22;
    /* ... */
  }
}
```

### `prefers-contrast: more | less`

Triggered by accessibility contrast settings. Under `more`, the design
system boosts border widths, darkens muted text, increases shadow opacity.
Many teams ship this later; it is on the accessibility road map but not
v1-critical.

## Relevance to this stinger

- `guides/00-principles.md` lists these three media queries as the
  accessibility floor: every system honors `prefers-reduced-motion`; dark
  mode is in-scope when the product spec says so; `prefers-contrast` is
  optional v1 but must be reachable via the token layer (i.e., don't bake
  contrast values into component CSS).
- `guides/03-authoring-tokens.md` mandates dark-mode token duplication at
  the token layer, never at the component layer.
- `guides/04-authoring-utility-layer.md` mandates the reduced-motion block
  at the bottom of the utility CSS file.
- The `SUBAGENT CRITICAL DIRECTIVES` in the Command Brief call out "motion
  is systemic, not ad-hoc": reduced-motion enforcement is the operational
  consequence.
