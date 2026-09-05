# Framer Motion — reduced-motion handling

**Sources:**
- https://motion.dev/docs/react-accessibility
- https://motion.dev/docs/react-use-reduced-motion
- https://www.framer.com/motion/use-reduced-motion/
- https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-motion

**Retrieved:** 2026-04-24
**Queries used:** "Framer Motion useReducedMotion prefers-reduced-motion best practices 2026"

## Summary

Framer Motion (now rebranded as Motion, package `motion`, current major 11.x+) provides two reduced-motion entry points: the `MotionConfig` prop `reducedMotion="user"` (site-wide auto-disable of transform/layout animations while preserving opacity/color) and the `useReducedMotion()` hook for per-component bespoke logic. The CSS media query `@media (prefers-reduced-motion: reduce)` is the underlying spec signal. The Stinger-level rule: **every `<Motion>` wrapper and every named motion bucket respects reduced-motion by default** — authors don't opt in; they opt out (deliberately) when documented.

## Key quotations

> "By setting `reducedMotion` to 'user', all motion components will automatically disable transform and layout animations, while preserving the animation of other values like opacity and backgroundColor."

> "In any component, call `useReducedMotion` to check whether the device's Reduced Motion setting is enabled."

> "You can replace potentially motion-sickness inducing x/y animations with opacity, disable the autoplay of background videos, or turn off parallax motion."

## Integration pattern for this Stinger

1. At app root: `<MotionConfig reducedMotion="user">`.
2. Author a small set of **named motion buckets** in the design brief (e.g., `fast`, `default`, `sheet-in`, `orb-drift`). Each maps to a Framer Motion `variants` object with its durations and eases referencing the product's motion tokens (`--dur-fast`, `--ease-out-subtle`, etc.).
3. The `<Motion>` wrapper accepts `bucket="default"` and internally applies the right variants, wrapping in `useReducedMotion()` to downgrade transform animations to opacity.
4. Bespoke durations / custom curves in feature code are violations — flag with citation to the closest bucket.

## Relevance to this Stinger

- `guides/03-motion-rules.md` — named buckets, custom-curve rejection, reduced-motion default.
- `guides/07-framer-motion.md` — library-specific integration: `MotionConfig`, `useReducedMotion`, variants tied to buckets.
- `templates/motion-wrapper.tsx` — the `<Motion>` wrapper.
