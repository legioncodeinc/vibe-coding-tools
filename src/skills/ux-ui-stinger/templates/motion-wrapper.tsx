// components/<product>/Motion.tsx
//
// Canonical Motion wrapper over Framer Motion (package: motion/react).
// See guides/07-framer-motion.md and guides/03-motion-rules.md.

import * as React from 'react'
import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'

// Bucket catalog — imported from motion/buckets.ts in your product.
// Each bucket is a Framer Motion `variants` object.
// See guides/03-motion-rules.md for the bucket definitions.
import * as buckets from '@/motion/buckets'

export type MotionBucket = keyof typeof buckets

type DivProps = HTMLMotionProps<'div'>

export interface MotionProps extends Omit<DivProps, 'variants'> {
  bucket: MotionBucket
}

// Opacity-only fallback used when prefers-reduced-motion is active.
const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

export const Motion = React.forwardRef<HTMLDivElement, MotionProps>(
  ({ bucket, initial, animate, exit, ...props }, ref) => {
    const reduced = useReducedMotion()
    const chosen = buckets[bucket]

    const variants = reduced ? reducedVariants : chosen

    return (
      <motion.div
        ref={ref}
        variants={variants}
        initial={initial ?? 'initial'}
        animate={animate ?? 'animate'}
        exit={exit ?? 'exit'}
        {...props}
      />
    )
  }
)

Motion.displayName = 'Motion'
