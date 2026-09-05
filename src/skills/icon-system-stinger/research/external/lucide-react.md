# Lucide React: Research Note

**Source type:** official-docs + GitHub releases  
**Authority:** high  
**Relevance:** high  
**Topic:** Lucide React ESM exports, tree-shaking, 2026 API

## Key findings (2026)

### ESM-only status
Lucide React v0.400+ (late 2025) ships ESM-only packages. Each icon is exported as a named ESM export from the package root. Bundlers (Vite, Next.js/Webpack, Rollup) correctly tree-shake these because each icon module has no side effects.

### Correct import pattern
```tsx
// Named import — tree-shaken correctly by all modern bundlers
import { ArrowRight, ChevronDown } from 'lucide-react';
```

There is no longer any need for path imports (`lucide-react/dist/esm/icons/arrow-right`) in Vite or Next.js 15+ projects using Lucide v0.400+.

### TypeScript types
Every icon component accepts `LucideProps` which extends `SVGProps<SVGSVGElement>`. Key props:
- `size` (number | string, default 24)
- `color` (string, default "currentColor")
- `strokeWidth` (number, default 2)
- `absoluteStrokeWidth` (boolean)

### RSC compatibility
Lucide React icons are pure SVG components with no browser-side effects. They are compatible with React Server Components.

### Dynamic import note
Because each icon is a separate named export, a dynamic icon map can be built with a static `Record<string, LucideIcon>` object. Avoid `React.lazy` per-icon for above-the-fold usage; use static imports for those.

## Caveats

- Lucide drops icon names occasionally between minor versions. Pin to a minor version in production if icon stability is critical.
- `absoluteStrokeWidth` prop normalizes stroke width relative to icon size; use it when mixing icon sizes in a single design.
