# Example: Dynamic Icon Loader (CMS-driven icon names)

**Demonstrates:** `guides/02-dynamic-import-icon-name.md`, `guides/03-accessibility-contract.md`

## Scenario

A content management system stores icon names as strings (e.g., `"ArrowRight"`, `"Bell"`, `"Check"`). A React component must render the correct icon based on this runtime string without bundling all 1400+ Lucide icons.

## Problem

The naive approach defeats tree-shaking:

```tsx
// WRONG — bundles all Lucide icons
import * as LucideIcons from 'lucide-react';
const Icon = LucideIcons[props.name]; // dynamic property access
```

Even if the bundler technically supports tree-shaking of ESM, dynamic property access on an imported namespace prevents static analysis.

## Solution A: Curated static map

Build a map of only the icons your app actually uses. See `examples/lucide-icon-component.md` for the full typed implementation. This is the recommended default.

**Bundle impact:** Only icons in `LUCIDE_ICONS` are included. Updating the map requires a code change, which is the desired behavior, because new icons should be a deliberate addition to the bundle.

## Solution B: Large icon set with full-library map

When the icon set is genuinely unpredictable at build time (admin tool where end users can configure icons from the full Lucide set):

```tsx
// components/DynamicIconFull.tsx
'use server'; // or 'use client' depending on context

import * as LucideIcons from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

interface DynamicIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
  label?: string;
}

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon | undefined>;

export function DynamicIconFull({ name, label, ...props }: DynamicIconProps) {
  const LucideComponent = iconRegistry[name];
  if (!LucideComponent || typeof LucideComponent !== 'function') {
    return null;
  }

  const a11yProps = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  return <LucideComponent focusable="false" {...a11yProps} {...props} />;
}
```

**Warning:** This bundles ~500KB gzip of icons. Only use it in an admin tool or internal dashboard where bundle size is not a user-facing concern. Add a bundle analyzer check to prevent this from leaking into the public-facing app bundle.

## Solution C: Iconify CDN (admin tool, client-side only)

```tsx
'use client';
import { Icon } from '@iconify/react';

interface DynamicIconProps {
  /** Iconify icon name, e.g. "lucide:arrow-right" or "mdi:account" */
  name: string;
  size?: number;
  label?: string;
}

export function DynamicIconCloud({ name, size = 24, label }: DynamicIconProps) {
  if (label) {
    return <Icon icon={name} width={size} height={size} aria-label={label} role="img" />;
  }
  return <Icon icon={name} width={size} height={size} aria-hidden="true" />;
}
```

**Limitations:**
- Requires `"use client"`: not compatible with RSC.
- Fetches icons from Iconify CDN at runtime; adds latency for the first render of each new icon.
- Not suitable for icons in SSR-critical content.

## Choosing the right approach

| Scenario | Use |
|---|---|
| Known icon set, <200 icons, SSR compatible | Solution A (curated map) |
| Admin tool, full Lucide set, bundle budget irrelevant | Solution B (full-library map) |
| Admin tool, multi-library icons, CDN acceptable | Solution C (Iconify CDN) |
| Above-the-fold icon with dynamic name | Static named import; do not use dynamic loading |
