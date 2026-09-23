# Example: Lucide Icon Component with Accessibility Contract

**Demonstrates:** `guides/00-library-selection-matrix.md`, `guides/03-accessibility-contract.md`

## Scenario

A React/Next.js project uses Lucide React. The team wants a single `<Icon>` component that:
1. Accepts an icon name as a string prop (for CMS-driven icon fields)
2. Enforces the accessibility contract at the API level
3. Is type-safe for the curated icon set

## Implementation

```tsx
// icons/lucide-map.ts
import {
  ArrowRight, ArrowLeft, ChevronDown, ChevronUp,
  X, Check, Settings, Search, Bell, User, Home,
  ExternalLink, Download, Upload, Edit, Trash, Plus,
  type LucideIcon,
} from 'lucide-react';

export const LUCIDE_ICONS = {
  ArrowRight, ArrowLeft, ChevronDown, ChevronUp,
  X, Check, Settings, Search, Bell, User, Home,
  ExternalLink, Download, Upload, Edit, Trash, Plus,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof LUCIDE_ICONS;
```

```tsx
// components/Icon.tsx
import type { LucideProps } from 'lucide-react';
import { LUCIDE_ICONS, type IconName } from '@/icons/lucide-map';

interface IconProps extends Omit<LucideProps, 'ref'> {
  /** Icon name from the curated LUCIDE_ICONS map */
  name: IconName;
  /**
   * Accessible label for semantic (standalone) icons.
   * When provided, adds role="img" and aria-label to the SVG.
   * Omit for decorative icons (those with adjacent visible text).
   */
  label?: string;
}

export function Icon({ name, label, ...props }: IconProps) {
  const LucideComponent = LUCIDE_ICONS[name];

  const a11yProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  return (
    <LucideComponent
      focusable="false"
      {...a11yProps}
      {...props}
    />
  );
}
```

## Usage examples

### Decorative icon (with adjacent text)
```tsx
<button>
  <Icon name="ArrowRight" size={16} />
  Continue
</button>
// SVG gets aria-hidden="true" automatically
```

### Semantic icon (standalone)
```tsx
<Icon name="Bell" size={20} label="Notifications" />
// SVG gets role="img" aria-label="Notifications"
```

### Icon button
```tsx
<button type="button" aria-label="Close dialog" onClick={onClose}>
  <Icon name="X" size={20} />
</button>
// aria-label is on the <button>; SVG gets aria-hidden="true"
```

## Type safety benefit

Because `name` is typed as `keyof typeof LUCIDE_ICONS`, TypeScript will error if an icon not in the curated map is requested:

```tsx
<Icon name="NonExistentIcon" /> // TS error: "NonExistentIcon" is not assignable to type IconName
```

This prevents runtime "icon not found" silent failures.

## axe-core result

Running this pattern through axe-core produces zero violations for all three usage scenarios above.
