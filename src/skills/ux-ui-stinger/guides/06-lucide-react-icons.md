# 06 — Lucide-react Icons

Lucide-react is the default icon library. Clean, consistent, stroke-based, tree-shakeable. Every Lucide icon is a 24×24 SVG with default `strokeWidth={2}`.

Research: `research/2026-04-24-lucide-react-icons.md`.

## The Icon wrapper

Feature code imports `<Icon>` from the product, never `import { Check } from 'lucide-react'` directly. The wrapper is the enforcement seam for stroke rules, sizing, and nav-zone color logic.

```tsx
// components/<product>/Icon.tsx
import * as Lucide from 'lucide-react'
import { forwardRef } from 'react'

type LucideName = keyof typeof Lucide

export type IconProps = {
  name: LucideName
  tone?: 'left-nav' | 'top-nav' | 'bottom-nav' | 'focus' | 'inherit'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 16, md: 20, lg: 24 }
const toneMap = {
  'left-nav': { color: 'var(--color-icon-muted)', strokeWidth: 1.75 },
  'top-nav': { color: 'var(--color-navy)', strokeWidth: 2 },
  'bottom-nav': { color: 'var(--color-icon-light)', strokeWidth: 2 },
  'focus': { color: 'white', strokeWidth: 2.25 },
  'inherit': { color: 'currentColor', strokeWidth: 2 },
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, tone = 'inherit', size = 'md', className }, ref) => {
    const Cmp = Lucide[name] as React.ComponentType<Lucide.LucideProps>
    const { color, strokeWidth } = toneMap[tone]
    return (
      <Cmp
        ref={ref}
        size={sizeMap[size]}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
        color={color}
        className={className}
      />
    )
  }
)
```

## Rule 1 — Always `absoluteStrokeWidth`

Without it, stroke scales with size. A 16px icon and a 32px icon then have visually different stroke weights, which is inconsistent. `absoluteStrokeWidth` keeps the rendered stroke width stable across sizes.

## Rule 2 — Pinned size presets

Three sizes: `sm` (16), `md` (20), `lg` (24). Feature code uses the preset — never `size={18}`. If a new size is needed, extend the preset list in the wrapper (and update the brief).

## Rule 3 — Tone maps to nav zone

The `tone` prop encodes the deploying product's nav-zone rules. The exact tones come from the product's design brief at `library/knowledge-base/<product>-ux-ui/00-design-brief.md`; if the brief declares them as non-negotiable, treat them as such. Generic products typically have at least:

- `inherit` — follows `currentColor`. Default for body text adjacency.
- `muted` — for left-rail icons or de-emphasized contexts.
- `primary` — for brand-accented CTAs / active states.

## Rule 4 — The AI / focus slot has identity

If the deploying product has a special "AI" / "focus" slot (e.g., a white glyph on an accent FAB), that icon tone stays constant regardless of tenant theme. Tenant-theming tokens do not override the focus slot.

## Rule 5 — Never fill

Lucide is stroke-based by design. Adding `fill` to Lucide icons breaks their visual system. If a filled icon is required, use a different library (e.g., `@phosphor-icons/react` with weight="fill") and document the exception in the component doc.

## Common violations

- `import { Check } from 'lucide-react'` in feature code. → Fix: use `<Icon name="Check" />`.
- `strokeWidth={3}` inline. → Fix: route through `tone` in the wrapper.
- `size={22}` (off-preset). → Fix: use `size="md"` (20) or `size="lg"` (24).
- Filled icon. → Fix: stroke-only, or use a different library and document the exception.

---

*Worked example:* `examples/component-spec-example.md` authors a nav component that uses the Icon wrapper.

*Template:* `templates/icon-wrapper.tsx`.
