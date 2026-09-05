// components/<product>/{{ComponentName}}.tsx
//
// Canonical product-wrapper template. Replace {{placeholders}} and wire to
// the shadcn/Radix/Mantine primitive of your choice. See
// guides/08-wrapper-authoring.md for the six rules this template embodies.

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 1. CVA factory — base + variants + defaultVariants (shadcn convention).
const {{componentName}}Variants = cva(
  // Base classes — tokens and utilities only, no raw values.
  '{{base-utilities-and-token-classes}}',
  {
    variants: {
      variant: {
        primary: '{{primary-classes}}',
        secondary: '{{secondary-classes}}',
        outline: '{{outline-classes}}',
        ghost: '{{ghost-classes}}',
      },
      size: {
        sm: '{{size-sm-classes}}',
        md: '{{size-md-classes}}',
        lg: '{{size-lg-classes}}',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

// 2. Props extend native element props + VariantProps + optional asChild.
export interface {{ComponentName}}Props
  extends React.{{HtmlElementAttrs}}<HTML{{ElementName}}Element>,
    VariantProps<typeof {{componentName}}Variants> {
  asChild?: boolean
}

// 3. forwardRef + spread ...props is non-negotiable (Radix composition).
export const {{ComponentName}} = React.forwardRef<
  HTML{{ElementName}}Element,
  {{ComponentName}}Props
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : '{{native-element}}'
  return (
    <Comp
      ref={ref}
      className={cn({{componentName}}Variants({ variant, size }), className)}
      {...props}
    />
  )
})

{{ComponentName}}.displayName = '{{ComponentName}}'

export { {{componentName}}Variants }
