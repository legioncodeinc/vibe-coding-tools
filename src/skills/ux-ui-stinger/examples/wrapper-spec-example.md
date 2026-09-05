# Example — wrapping a shadcn primitive (Button)

> A worked example of `guides/04-shadcn-ui-integration.md` and `guides/08-wrapper-authoring.md`. Scenario: the product is adopting shadcn/ui's Button and Dialog primitives. Before feature code can touch them, we author the wrapper and its spec.

---

# Button

**Built on:** shadcn/ui Button (CLI-installed source in `components/ui/button.tsx`) + Radix Slot — see `research/library-versions.md` for pinned versions.
**Source:** `components/<product>/Button.tsx`.
**Primitive wrapped:** `@/components/ui/button`.

## Purpose

Button is the single button primitive in the product. Every click-affordance in feature code renders through it. Alternating CTA pairs (e.g., "Cancel" / "Save") are always `secondary` on the left and `primary` on the right.

## Contract

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | Visual weight. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height/padding. Defaults to 44-px tall for touch-target compliance. |
| `asChild` | `boolean` | `false` | Renders as `@radix-ui/react-slot`'s `Slot`, enabling composition into Radix triggers. |
| `...rest` | `React.ButtonHTMLAttributes<HTMLButtonElement>` | — | Spread onto the root. |

### Variants (token mapping)

- `primary` — `bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] depth-2`.
- `secondary` — `bg-[color:var(--color-surface-secondary)] text-[color:var(--color-text-primary)] depth-1`.
- `outline` — `bg-transparent border border-[color:var(--color-border-subtle)] text-[color:var(--color-text-primary)]`.
- `ghost` — `bg-transparent text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-hover)]`.

### Size map

- `sm` — `h-8 px-3 text-sm`.
- `md` — `h-11 px-4 text-base`.
- `lg` — `h-12 px-5 text-base`.

## Why wrap

This wrapper exists because:

- **Tokens:** shadcn's default Button uses `bg-primary`, `bg-secondary`, etc. Those Tailwind classes must resolve to the product's token values. The Tailwind v4 `@theme` mapping in `globals.css` does that resolution; the wrapper's base classes add product-specific utilities (`glass-surface`, `press-scale`, focus-ring).
- **Variants:** shadcn's default set includes `destructive` and `link`. The brief authorizes four variants only. The wrapper's CVA factory exposes only those four.
- **Motion:** the wrapper adds `.press-scale` and `transition-[transform,opacity] duration-[var(--dur-fast)]` to every variant — every Button participates in the fast motion bucket without per-consumer work.

## Accessibility

- **APG pattern:** https://www.w3.org/WAI/ARIA/apg/patterns/button/ — this wrapper is a native `<button>` element, so APG semantics are free. When `asChild` is true, it's the consumer's responsibility to pass a component with `role="button"` semantics.
- **Focus ring:** `focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)]`.
- **Keyboard:** Enter / Space activation (native).
- **Disabled:** `disabled:opacity-50 disabled:pointer-events-none`.

## Implementation

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-[var(--radius-button)] glass-surface press-scale focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--color-focus-ring)] disabled:opacity-50 disabled:pointer-events-none transition-[transform,opacity] duration-[var(--dur-fast)]',
  {
    variants: {
      variant: {
        primary: 'bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)] depth-2',
        secondary: 'bg-[color:var(--color-surface-secondary)] text-[color:var(--color-text-primary)] depth-1',
        outline: 'bg-transparent text-[color:var(--color-text-primary)] border border-[color:var(--color-border-subtle)]',
        ghost: 'bg-transparent text-[color:var(--color-text-primary)] hover:bg-[color:var(--color-surface-hover)]',
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

## Example usage

```tsx
// Standard CTA pair — secondary-left / primary-right per brief §7.2.
<div className="flex justify-end gap-2">
  <Button variant="secondary" onClick={onCancel}>Cancel</Button>
  <Button variant="primary" onClick={onSave}>Save</Button>
</div>

// Composed into a Radix Dialog trigger via asChild.
<Dialog.Trigger asChild>
  <Button variant="outline">Open details</Button>
</Dialog.Trigger>
```

## Replaces (in current code)

- `src/components/legacy/BlueButton.tsx` — bespoke button with `#1f3a5f` hard-coded.
- `src/components/legacy/SecondaryButton.tsx` — bespoke secondary variant, drifting shadow stack.
- Inline `<button className="...">` usages at: `src/app/onboarding/Step1.tsx:87`, `src/app/billing/Plan.tsx:132`, `src/app/settings/Profile.tsx:219`.

## Related

- `dialog.md` — composes with Button via `asChild`.
- `icon.md` — icons inside buttons are `<Icon tone="inherit" size="sm" />`.

## Changelog

- 2026-04-24 — initial author (ux-ui-worker-bee). Commit: `ux-ui: components: add button wrapper over shadcn`.
