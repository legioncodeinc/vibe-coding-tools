# 10 — Common Violations

Catalog of the violations this Angel sees most often, with canonical fixes. When you spot one, cite this file's row and the root-cause guide.

## 1. Hex literal where a token exists

**Smell:**
```tsx
<div className="bg-[#f5f0e6]">
```

**Cause:** author didn't open `01-master-tokens.css`; didn't know the token existed.

**Fix:**
```tsx
<div className="glass-surface">
```
*(or, if raw color is needed, `bg-[color:var(--color-surface-base)]`).*

**Governing guide:** `guides/02-token-and-utility-enforcement.md`.

## 2. Inline utility re-implementation

**Smell:**
```tsx
<div style={{
  backdropFilter: 'blur(12px)',
  background: 'rgba(255,255,255,0.65)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
}}>
```

**Cause:** author didn't know `.glass-surface` / `.depth-1` exists.

**Fix:**
```tsx
<div className="glass-surface depth-1">
```

**Governing guide:** `guides/02-token-and-utility-enforcement.md`.

## 3. Bespoke motion duration / curve

**Smell:**
```tsx
<motion.div transition={{ duration: 0.237, ease: [0.07, 0.91, 0.29, 0.99] }}>
```

**Cause:** author picked values "that felt right"; no bucket reference.

**Fix:** use a named bucket (`fast` / `default` / `sheet-in` / etc.) from `motion/buckets.ts`. If no bucket fits, extend the brief first.

**Governing guide:** `guides/03-motion-rules.md`.

## 4. Raw primitive import in feature code

**Smell:**
```tsx
// src/app/dashboard/page.tsx
import { Button } from '@/components/ui/button'
import * as Dialog from '@radix-ui/react-dialog'
```

**Cause:** wrapper doesn't exist, or author skipped the wrapper.

**Fix:**
```tsx
import { Button } from '@/components/<product>/Button'
import { Dialog } from '@/components/<product>/Dialog'
```

If the wrapper doesn't exist, author it per `guides/08-wrapper-authoring.md` before the PR can merge.

**Governing guide:** `guides/08-wrapper-authoring.md`.

## 5. Hard-coded tenant color

**Smell:**
```tsx
<div className="text-[#1f3a5f]">
```

**Cause:** author baked in one tenant's navy.

**Fix:**
```tsx
<div className="text-[color:var(--color-navy)]">
```

*(and `[data-tenant="X"] { --color-navy: ... }` lives in `01-master-tokens.css` for every tenant that overrides).*

**Governing guide:** `guides/02-token-and-utility-enforcement.md`.

## 6. Missing three-cue shadow stack

**Smell:**
```tsx
<div className="bg-white rounded-lg shadow-md">
```
(one shadow cue, not three)

**Cause:** author used Tailwind's default `shadow-md` without wiring the product's shadow stack.

**Fix:**
```tsx
<div className="glass-surface depth-1">
```
*(or `depth-2` / `depth-3` per elevation).*

**Governing guide:** `guides/01-enforcement-procedure.md` step 8; `guides/02-token-and-utility-enforcement.md`.

## 7. Lucide icon imported directly

**Smell:**
```tsx
import { Check } from 'lucide-react'
```

**Cause:** wrapper not known; wrapper not used.

**Fix:**
```tsx
import { Icon } from '@/components/<product>/Icon'
<Icon name="Check" tone="inherit" size="md" />
```

**Governing guide:** `guides/06-lucide-react-icons.md`.

## 8. Missing `prefers-reduced-motion` handling

**Smell:** a transform animation with no reduced-motion path.

**Cause:** forgotten; or `<MotionConfig reducedMotion="user">` not installed at root.

**Fix:** install `<MotionConfig reducedMotion="user">` at the tree root; for bespoke code, gate transform paths behind `useReducedMotion()`.

**Governing guide:** `guides/03-motion-rules.md`, `guides/07-framer-motion.md`.

## 9. Wrapper that drops `forwardRef`

**Smell:**
```tsx
export function Button({ variant, ...props }: ButtonProps) {
  return <button className={buttonVariants({ variant })} {...props} />
}
```

**Cause:** author didn't know Radix needs ref; `asChild` composition will break.

**Fix:** wrap in `React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => ...)`. Set `displayName`.

**Governing guide:** `guides/08-wrapper-authoring.md`.

## 10. Exposing a library-shape variant the product doesn't authorize

**Smell:**
```tsx
<Button variant="destructive">Delete</Button>
```
(when the brief only authorizes `primary | secondary | outline | ghost`)

**Cause:** author copy-pasted shadcn's default variant list into the wrapper's CVA.

**Fix:** remove `destructive` from the wrapper's CVA variants. Destructive intent in the product is encoded some other way (e.g., a confirm dialog, or a `tone="danger"` prop if the brief authorizes it).

**Governing guide:** `guides/04-shadcn-ui-integration.md`, `guides/08-wrapper-authoring.md`.

## 11. Using `pl-4` instead of `ps-4`

**Smell:** physical properties in a new component (`pl-4`, `mr-auto`).

**Cause:** muscle memory from pre-RTL-aware codebases.

**Fix:** logical properties (`ps-4`, `ms-auto`). Tailwind v4 provides these natively.

**Governing guide:** `guides/02-token-and-utility-enforcement.md` (Rule 6).

## 12. Off-preset icon size

**Smell:** `<Icon name="Check" size="sm" />` with `sm = 18` somewhere inline-overridden, or raw `<Check size={18} />`.

**Cause:** author had a pixel-perfect constraint that didn't match the presets.

**Fix:** use the nearest preset. If the constraint genuinely doesn't fit, extend the preset list in the Icon wrapper with a brief note, not a one-off.

**Governing guide:** `guides/06-lucide-react-icons.md`.

---

## Future enhancement: token drift scanner

The Command Brief asks whether a `scripts/` scanner could walk the codebase, extract hex literals and inline utility re-implementations, and report replaceable hits. Not built in this Stinger's first pass; would live at `scripts/scan-drift.ts` and emit a drift report into the host repo's `library/qa/ux-ui/<date>-token-drift.md`. Add when this Angel proves itself at scale and the volume justifies the tooling.

---

*Worked example that hits several of these rows:* `examples/review-output-example.md`.
