// components/<product>/Icon.tsx
//
// Canonical Icon wrapper over Lucide-react.
// See guides/06-lucide-react-icons.md for rules.

import * as Lucide from 'lucide-react'
import * as React from 'react'

type LucideName = keyof typeof Lucide

export type IconTone =
  | 'left-nav'
  | 'top-nav'
  | 'bottom-nav'
  | 'focus' // identity-locked regardless of tenant theme; e.g. white glyph on accent FAB
  | 'inherit'

export type IconSize = 'sm' | 'md' | 'lg'

export interface IconProps {
  name: LucideName
  tone?: IconTone
  size?: IconSize
  className?: string
  'aria-label'?: string
}

// Size presets — pinned. Extending requires a brief update.
const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
}

// Tone presets — map nav zone to color + stroke weight.
// Adjust values for the deploying product; the exact tones come
// from that product's design brief at
// `library/knowledge-base/<product>-ux-ui/00-design-brief.md`.
const toneMap: Record<IconTone, { color: string; strokeWidth: number }> = {
  'left-nav': { color: 'var(--color-icon-muted)', strokeWidth: 1.75 },
  'top-nav': { color: 'var(--color-navy)', strokeWidth: 2 },
  'bottom-nav': { color: 'var(--color-icon-light)', strokeWidth: 2 },
  focus: { color: '#ffffff', strokeWidth: 2.25 }, // identity-locked
  inherit: { color: 'currentColor', strokeWidth: 2 },
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, tone = 'inherit', size = 'md', className, ...rest }, ref) => {
    const Cmp = Lucide[name] as React.ForwardRefExoticComponent<
      Lucide.LucideProps & React.RefAttributes<SVGSVGElement>
    >
    const { color, strokeWidth } = toneMap[tone]
    return (
      <Cmp
        ref={ref}
        size={sizeMap[size]}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
        color={color}
        className={className}
        aria-hidden={rest['aria-label'] ? undefined : true}
        {...rest}
      />
    )
  }
)

Icon.displayName = 'Icon'
