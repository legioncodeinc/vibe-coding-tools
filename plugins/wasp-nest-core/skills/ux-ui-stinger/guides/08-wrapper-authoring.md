# 08 — Wrapper Authoring

The canonical shape of a library-wrapper component. Any component in `components/<product>/*` that wraps a shadcn / Radix / Mantine / Lucide primitive follows this pattern.

Research: `research/2026-04-24-cva-variant-architecture.md`, `research/2026-04-24-radix-primitives-composition.md`.

## Purpose of wrapping

A wrapper exists to encode **three** translations:

1. **Product tokens** — the wrapper is where product CSS tokens apply (via utilities or via Tailwind `@theme`-mapped classes).
2. **Product variants** — the wrapper exposes the product's vocabulary (e.g., `variant: 'primary' | 'secondary' | 'outline' | 'ghost'`), not the library's.
3. **Product motion** — the wrapper applies the right motion bucket to the primitive's interaction states.

If a wrapper does not do at least one of these, it is a needless layer. Delete it.

## The canonical shape

```tsx
// components/<product>/Button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base: tokens + utilities every Button shares
  'inline-flex items-center justify-center rounded-[var(--radius-button)] glass-surface press-scale focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus-ring)] disabled:opacity-50 disabled:pointer-events-none transition-[transform,opacity] duration-[var(--dur-fast)]',
  {
    variants: {
      variant: {
        primary:
          'bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] depth-2',
        secondary:
          'bg-[color:var(--color-surface-secondary)] text-[color:var(--color-text-primary)] depth-1',
        outline:
          'bg-transparent text-[color:var(--color-text-primary)] border border-[color:var(--color-border-subtle)]',
        ghost:
          'bg-transparent text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-hover)]',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-11 px-4 text-base',
        lg: 'h-12 px-5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { buttonVariants }
```

## The six wrapper-authoring rules

1. **`forwardRef` + spread `...props`.** Non-negotiable. Radix's composition model depends on both, and removing either breaks `asChild`.

2. **Expose `asChild` when the wrapper is likely to be composed into Radix / shadcn primitives.** Backed by `@radix-ui/react-slot`. Lets `<DialogTrigger asChild><Button>...</Button></DialogTrigger>` work.

3. **CVA factory with `defaultVariants`.** Every variant has a default; invalid combinations are either impossible by typing or short-circuited via `compoundVariants`.

4. **Base classes are utilities + tokens; variant classes are utilities + tokens.** No hex literals, no inline shadow stacks, no bespoke durations. The wrapper is the *last* place raw values could hide — they must not.

5. **Don't re-export library-specific props the product doesn't want.** If shadcn's Button has a `destructive` variant and the brief doesn't authorize it, the wrapper's types do not expose it.

6. **`displayName` is set** — it's a two-line affordance for React DevTools that pays off every PR review.

## The wrapper's component spec

Every wrapper has an accompanying markdown doc in `<design-system-folder>/03-components/<component>.md`. Use the template `templates/component-brief-with-wrap.md`. The doc captures:

- **Purpose.** What the component does in the product's terms.
- **Contract.** Props and variants, typed.
- **Why wrap.** Which of the three translations (tokens / variants / motion) this wrapper performs.
- **Built on.** Library name and version pinned in `research/library-versions.md`.
- **Replaces (in current code).** Paths that should migrate to this wrapper.
- **Accessibility.** APG pattern (if any), focus-ring behavior, keyboard expectations.

## Testing a wrapper

Minimum tests:

- Renders with default variants.
- Forwards ref.
- Spreads `onClick` / `className`.
- `asChild` composes with a `Slot`-consuming parent.
- Default `variant` / `size` produces the base class list.

---

*Worked example:* `examples/wrapper-spec-example.md`.

*Templates:*
- `templates/component-wrapper.tsx`
- `templates/component-brief-with-wrap.md`
