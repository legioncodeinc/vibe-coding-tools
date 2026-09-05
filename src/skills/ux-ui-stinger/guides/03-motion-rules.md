# 03 — Motion Rules

Motion is the surface that sells the aesthetic. It is also the surface most likely to ship inconsistency. This guide is uncompromising.

## Named motion buckets

The design brief must enumerate every motion pattern the product uses, as a named bucket. Typical buckets:

| Bucket | Duration | Easing | Use for |
| --- | --- | --- | --- |
| `fast` | `--dur-fast` (120–160 ms) | `--ease-out-subtle` | hover, tap, focus flashes, press-scale |
| `default` | `--dur-default` (220–280 ms) | `--ease-spring-soft` | sheet / tray in-out, dropdown open-close, modal fade |
| `slow` | `--dur-slow` (400–500 ms) | `--ease-in-out-smooth` | page transitions, route-level cross-fades |
| `orb-drift` | 20s loop | `--ease-linear` | ambient radial-gradient background motion |

Every new animation — CSS or Framer Motion — uses one of these buckets. Authoring a new bucket requires a brief update (see Rule 3 below).

## Rule 1 — Reject bespoke durations and curves

`duration: 237ms` is a bug. `cubic-bezier(0.07, 0.91, 0.29, 0.99)` is a bug. Replace with the closest bucket:

- 237ms is closest to `--dur-default`. Use that.
- The bespoke spring curve is closest to `--ease-spring-soft`. Use that.

If the author insists the bucket doesn't fit, it's a brief-update request — extend the brief with a new bucket, then use it.

## Rule 2 — `prefers-reduced-motion` is honored by default

Every animation honors `prefers-reduced-motion: reduce`:

- **CSS:** wrap keyframe / transition declarations in `@media (prefers-reduced-motion: no-preference)` or use `@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }`.
- **Framer Motion:** at the app root, `<MotionConfig reducedMotion="user">` disables transform/layout animations automatically, preserving opacity/color. For bespoke components, call `useReducedMotion()` and gate transform-heavy paths.

See `guides/07-framer-motion.md` and `research/2026-04-24-framer-motion-reduced-motion.md`.

## Rule 3 — Adding a new bucket requires a brief update

When a new animation pattern needs its own bucket (not expressible as an existing one), update the brief first:

1. Open `00-design-brief.md` §14 (motion section).
2. Add the bucket with name, duration token, easing token, and intended use.
3. Add the duration/easing tokens to `01-master-tokens.css` if they don't exist.
4. Commit: `ux-ui-worker-bee: motion: add <bucket-name>` (or whatever convention the deploying product's knowledge-base specifies).
5. *Then* implement the animation.

## Rule 4 — The three-cue shadow stack applies to motion too

Surfaces that animate (sheets, trays, modals, FABs) must retain the three-cue shadow stack throughout the animation. A sheet that loses its ambient shadow during transform is a bug. Use `will-change: transform` and animate only the transform — keep the shadow layers on a separate pseudo-element if needed to avoid paint cost.

## Rule 5 — Ambient background motion (when the brief calls for it)

Some product briefs include ambient background motion (e.g., subtle radial-gradient "orbs", drifting noise fields, slow gradient pans behind hero cards). When the deploying product's `00-design-brief.md` declares such an effect, the rules of thumb:

- Render as absolutely-positioned background layers behind hero cards, never on top of interactive content.
- Keep opacity low (typically 0.05–0.10) — ambient, not foreground.
- Use long durations (10–30s) and a linear ease so the motion reads as drift, not animation.
- Pause the animation or drop opacity to 0 under `prefers-reduced-motion: reduce`.
- Never let the effect push the surface above its three-cue shadow stack — ambient layers stay ambient.

If the brief does not declare ambient background motion, do not invent it.

## Rule 6 — Interactive-surface transitions

Every interactive element uses `--dur-fast` / `--ease-out-subtle` for hover/focus/press unless a brief section declares otherwise. Sheets/trays/modals use `--dur-default` / `--ease-spring-soft`.

---

*Worked example:* `examples/review-output-example.md` includes a bespoke-duration violation callout.

*Sources:* `research/2026-04-24-framer-motion-reduced-motion.md`; W3C `prefers-reduced-motion` spec at https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion.
