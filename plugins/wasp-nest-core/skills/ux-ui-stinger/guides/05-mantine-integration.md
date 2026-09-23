# 05 — Mantine Integration

Mantine 7.x ships a fuller kit than shadcn: date pickers, rich forms, notifications, complex tables, hooks (`useHotkeys`, `useDisclosure`, `useDebouncedValue`, many others). Use it where rebuilding would cost weeks; keep it out of the product's core visual surfaces.

Research: `research/2026-04-24-mantine-theme-tokens.md`.

## Decision tree

Adopt Mantine for:

- **Date / time pickers** (complex calendar logic, timezones, ranges).
- **Rich forms** (`@mantine/form` — field-level validation, conditional fields).
- **Notifications** (`@mantine/notifications` — positioning, stacking, auto-dismiss).
- **Complex tables** with virtualization.
- **Hooks** (the `@mantine/hooks` library is high-quality and orthogonal to styling).

**Do not** adopt Mantine for:

- Buttons, Cards, Badges, Navs — these are the product's primary surfaces and belong in the custom design system.
- Modals / Dialogs if you already use Radix/shadcn's Dialog. One dialog primitive per product.
- Layout primitives (`Stack`, `Group`) — Tailwind is your layout language.

Mixing two component libraries for the same component class is a smell.

## MantineProvider setup

```tsx
// app/providers.tsx
import { MantineProvider, createTheme } from '@mantine/core'

const theme = createTheme({
  primaryColor: 'brand',
  other: {
    // Product's custom tokens — anything not in Mantine's canonical theme shape
    glassSurface: 'var(--color-surface-glass)',
    depthOne: 'var(--shadow-depth-1)',
  },
})

// cssVariablesResolver mirrors Mantine's expected CSS vars to product tokens
const cssVariablesResolver = (theme) => ({
  variables: {
    '--mantine-primary-color-filled': 'var(--color-brand)',
    '--mantine-primary-color-filled-hover': 'var(--color-brand-hover)',
    '--mantine-color-text': 'var(--color-text-primary)',
    '--mantine-radius-default': 'var(--radius-card)',
    // ... mirror each Mantine var that your components touch
  },
  light: {},
  dark: {},
})

export function Providers({ children }) {
  return (
    <MantineProvider theme={theme} cssVariablesResolver={cssVariablesResolver}>
      {children}
    </MantineProvider>
  )
}
```

**Key:** the product's `01-master-tokens.css` stays canonical. Mantine reads through a variable-alias layer. Never duplicate palette values into `theme.colors` — alias them.

## Wrapping Mantine components

Feature code imports a product wrapper, same as shadcn. Example — wrapping `DatePickerInput`:

```tsx
// components/<product>/DatePickerInput.tsx
import { DatePickerInput as MantineDatePickerInput } from '@mantine/dates'
import { forwardRef } from 'react'
import { cva, VariantProps } from 'class-variance-authority'

const pickerVariants = cva('glass-surface depth-1', {
  variants: {
    size: { sm: 'text-sm', md: 'text-base' },
  },
  defaultVariants: { size: 'md' },
})

type Props = React.ComponentProps<typeof MantineDatePickerInput> &
  VariantProps<typeof pickerVariants>

export const DatePickerInput = forwardRef<HTMLInputElement, Props>(
  ({ className, size, ...props }, ref) => (
    <MantineDatePickerInput
      ref={ref}
      classNames={{ input: pickerVariants({ size, className }) }}
      {...props}
    />
  )
)
```

The wrapper:

- Forwards ref.
- Spreads props.
- Applies product utilities (`.glass-surface`, `.depth-1`).
- Exposes product-shaped props (`size`) via CVA.
- Doesn't expose Mantine-specific props that don't align with the product.

## Styling integration

Mantine 7 uses `classNames` for fine-grained overrides:

```tsx
<Notification classNames={{ root: 'glass-surface depth-2', title: 'text-body' }} />
```

Prefer `classNames` over inline `styles` so utilities stay the source of truth.

## Common violations

- Using Mantine's `Button` alongside shadcn's `Button` in feature code. → Fix: one Button primitive per product.
- Registering a parallel palette in `theme.colors` instead of aliasing product tokens. → Fix: use `cssVariablesResolver` to point Mantine vars at product vars.
- Importing `@mantine/core`'s component in feature code directly. → Fix: wrap in `components/<product>/*`.

---

*Worked example:* see `examples/wrapper-spec-example.md` for the canonical shape (shadcn-based); the Mantine pattern is the same with the library swapped.

*Template:* `templates/component-wrapper.tsx`.
