# 07 — Framer Motion (Motion)

Framer Motion is the declarative React animation library. It's powerful — and therefore easy to ship bespoke garbage with. Discipline: every motion uses a named bucket; reduced-motion is the default posture.

Research: `research/2026-04-24-framer-motion-reduced-motion.md`.

> **Note on naming:** Framer Motion was rebranded to **Motion** (package `motion`, import path `motion/react`). The conceptual APIs are unchanged. This guide uses "Framer Motion" and "Motion" interchangeably.

## App-root configuration

At the application root, wrap the tree in `MotionConfig` with `reducedMotion="user"`:

```tsx
import { MotionConfig } from 'motion/react'

export function AppRoot({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
```

With `reducedMotion="user"`, every `motion` component automatically disables transform and layout animations when the user prefers reduced motion, while preserving opacity / color / background animations. That gives the product a safe default with one line.

## Bucket-keyed variants

Named buckets from `guides/03-motion-rules.md` translate into Framer Motion `variants` objects, referencing motion tokens:

```ts
// motion/buckets.ts
export const fast = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.14, ease: [0.2, 0.7, 0.2, 1] },
  },
}

export const sheetIn = {
  initial: { y: 16, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.24, ease: [0.2, 0.7, 0.2, 1] },
  },
  exit: { y: 16, opacity: 0, transition: { duration: 0.16 } },
}
```

*The duration numbers and easing arrays are the resolved values of `--dur-fast`, `--dur-default`, and `--ease-*`. JS can't directly read CSS custom properties cheaply at animation time, so the brief authorizes duplicating the values in a single `motion/buckets.ts` file. When a bucket token changes, update both the CSS and the TS file — same commit.*

## The `<Motion>` wrapper

Feature code uses a `<Motion bucket="sheet-in">` wrapper, not raw `motion.div` everywhere:

```tsx
// components/<product>/Motion.tsx
import { motion, useReducedMotion } from 'motion/react'
import { forwardRef } from 'react'
import * as buckets from '@/motion/buckets'

export type MotionBucket = keyof typeof buckets

type Props = Omit<React.ComponentProps<typeof motion.div>, 'variants'> & {
  bucket: MotionBucket
}

export const Motion = forwardRef<HTMLDivElement, Props>(
  ({ bucket, ...props }, ref) => {
    const reduced = useReducedMotion()
    const chosen = buckets[bucket]

    // On reduced-motion, downgrade transform variants to opacity-only
    const safe = reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.15 } },
          exit: { opacity: 0, transition: { duration: 0.1 } },
        }
      : chosen

    return (
      <motion.div
        ref={ref}
        variants={safe}
        initial="initial"
        animate="animate"
        exit="exit"
        {...props}
      />
    )
  }
)
```

## Rule 1 — Prefer CSS transitions for simple interactions

Hover / focus / press scale is a CSS transition, not a Framer Motion component. Reserve Framer Motion for:

- Orchestrated sequences (stagger, cascading children).
- Layout animations (`layout`, `LayoutGroup`).
- Enter/exit with `AnimatePresence`.
- Gesture-driven interactions (drag, pan).

Wrapping a `motion.button` just to do `whileHover={{ scale: 1.02 }}` is overkill — CSS `transform: scale(1.02)` on `:hover` is faster, cheaper, and doesn't need reduced-motion logic because it's already opt-out by OS.

## Rule 2 — `useReducedMotion()` for bespoke logic

When a feature animation can't fit a bucket (rare; extend the brief first), the bespoke code paths go through `useReducedMotion()` and gate transform paths behind it.

## Rule 3 — Never animate layout on long lists without `layoutId`

`layout` animations on unkeyed list items trigger expensive full re-layouts. Use `layoutId` on keyed items, or don't animate.

## Rule 4 — Orb drifts use CSS keyframes, not Framer Motion

Ambient background motion (the "JS-driven beautiful orbs" pattern) is a CSS keyframe on a pseudo-element, not a `motion` component. That keeps it off the React render tree and avoids paint storms.

## Common violations

- `<motion.div animate={{ opacity: 1 }} transition={{ duration: 0.237 }}>` — bespoke duration. → Fix: use a bucket variant.
- `<motion.button whileHover={{ scale: 1.05 }}>` without reduced-motion gating. → Fix: use CSS hover state (reduced-motion is implicit on CSS transitions via `@media`).
- Custom `cubic-bezier` inside a `transition`. → Fix: use a motion-token easing.
- `AnimatePresence` without `mode="popLayout"` on overlapping sheets. → Fix: pick the right `mode`.

---

*Worked example:* `examples/review-output-example.md` catches a bespoke Framer Motion duration.

*Template:* `templates/motion-wrapper.tsx`.
