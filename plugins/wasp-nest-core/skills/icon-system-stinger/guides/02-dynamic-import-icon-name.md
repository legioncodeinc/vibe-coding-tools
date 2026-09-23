# Guide 02: Dynamic Import by Icon Name

Source: `research/external/lucide-react.md`, `research/external/iconify-react.md`

The dynamic-import-by-name pattern lets a component accept an icon name as a string prop and render the correct icon without bundling every icon.

## The three approaches

### Approach A: Static map (recommended for Lucide, Heroicons, Tabler, Phosphor)

Import all icons at build time into a record keyed by name. Bundlers tree-shake unused icons when the map is consumed via a typed key.

```tsx
// icons/lucide-map.ts — create a curated map of only the icons you use
import {
  ArrowRight, ChevronDown, X, Check, Settings, Search,
  // ... add only the icons your app actually uses
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const lucideIconMap: Record<string, LucideIcon> = {
  ArrowRight,
  ChevronDown,
  X,
  Check,
  Settings,
  Search,
};
```

```tsx
// components/Icon.tsx
import { lucideIconMap } from '@/icons/lucide-map';
import type { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export function Icon({ name, ...props }: IconProps) {
  const IconComponent = lucideIconMap[name];
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Icon "${name}" not found in lucide-map.ts`);
    }
    return null;
  }
  return <IconComponent aria-hidden="true" focusable="false" {...props} />;
}
```

**TypeScript safety tip:** Use a union type for the name prop if the icon set is small and stable:
```tsx
type IconName = keyof typeof lucideIconMap;
interface IconProps extends LucideProps {
  name: IconName;
}
```

**RSC compatibility:** Yes. The static map contains no browser APIs and works in Server Components.

### Approach B: Full-library map (use only if the entire Lucide set is needed)

```tsx
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

function Icon({ name, ...props }: { name: string } & LucideProps) {
  const IconComponent = (LucideIcons as Record<string, LucideIcon>)[name];
  if (!IconComponent) return null;
  return <IconComponent aria-hidden="true" focusable="false" {...props} />;
}
```

**Warning:** This approach bundles all 1400+ Lucide icons (~500KB gzip). Only use it if the icon name is truly unpredictable at build time (e.g., CMS-driven icon fields) and the bundle cost is acceptable.

### Approach C: Iconify on-demand (admin tools only)

```tsx
'use client'; // Required — uses browser fetch
import { Icon } from '@iconify/react';

function DynamicIcon({ name }: { name: string }) {
  return <Icon icon={name} aria-hidden="true" />;
}
// Usage: <DynamicIcon name="lucide:arrow-right" />
```

**Limitations:**
- Requires `"use client"` boundary in Next.js App Router.
- Not suitable for SSR-critical content (adds CDN latency and hydration mismatch risk).
- Use only in admin panels or dev tools where CDN latency is acceptable.

## RSC boundary guidance

| Approach | RSC compatible? | Notes |
|---|---|---|
| Static curated map (A) | Yes | Pure data; no browser APIs |
| Full-library map (B) | Yes | Large bundle; otherwise RSC-safe |
| Iconify static bundled | Yes | Import `@iconify/icons-*` directly |
| Iconify CDN (C) | No | Requires `"use client"` |

## Above-the-fold rule

Do NOT use dynamic-by-name for icons that appear on the initial viewport render (hero sections, navigation, primary CTAs). Use static named imports for those to:

1. Avoid layout shift (no loading state for the icon)
2. Avoid hydration mismatches (SSR renders icon; client re-renders identically)
3. Keep the critical-path JS chunk predictable

> See `research/research-summary.md` open question #1 for the RSC boundary edge case with large icon sets.
