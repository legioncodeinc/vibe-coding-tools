# Guide 00: Icon Library Selection Matrix

Source: `research/external/heroicons-tabler-phosphor.md`, `research/external/lucide-react.md`, `research/external/iconify-react.md`

## Decision table

| Criterion | Lucide | Heroicons | Tabler | Phosphor | Iconify |
|---|---|---|---|---|---|
| **Icon count** | 1400+ | ~292 | 5500+ | 1300+ | 200,000+ (all libraries) |
| **Design style** | Clean, modern | Tailwind-native | Uniform 2px stroke | Multi-weight | Varies by set |
| **Tree-shaking** | Full (named ESM) | Full (path imports by variant) | Full (named ESM) | Full (named ESM, weight is a prop) | Full (static mode) or CDN |
| **TypeScript** | `LucideProps` interface | `@heroicons/react` typings | `TablerIconsProps` | `IconProps` | `IconifyIcon` type |
| **RSC compatible** | Yes | Yes | Yes | Yes | Static mode only |
| **Dynamic loading** | Static map approach | Static map approach | Static map approach | Static map approach | Native (Iconify API) |
| **License** | ISC | MIT | MIT | MIT | Mixed (per icon set) |
| **Bundle (10 icons, gzip)** | ~4KB | ~3KB | ~4KB | ~4KB | ~8KB overhead + per-icon |

## Decision tree

```
Does the project use Tailwind CSS and need a curated, small set?
  YES → Heroicons (aligns with Tailwind design language; 292 icons is usually enough)

Does the project need 500+ icons (admin UI, comprehensive dashboard)?
  YES → Tabler (5500+ icons; consistent stroke)

Does the project require icon weight variants (thin/light/bold/fill)?
  YES → Phosphor (6 weights; weight is a prop, not a separate import)

Does the project mix icons from multiple libraries OR need on-demand loading
for a very large set?
  YES → Iconify (meta-library; use static mode for RSC; CDN mode for admin tools only)

Otherwise → Lucide (default; best DX; most examples; ESM-only since v0.400+)
```

## Installation reference

### Lucide
```bash
npm install lucide-react
```
```tsx
import { ArrowRight, ChevronDown } from 'lucide-react';
```

### Heroicons
```bash
npm install @heroicons/react
```
```tsx
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
```

### Tabler
```bash
npm install @tabler/icons-react
```
```tsx
import { IconArrowRight } from '@tabler/icons-react';
```

### Phosphor
```bash
npm install @phosphor-icons/react
```
```tsx
import { ArrowRight } from '@phosphor-icons/react';
<ArrowRight weight="bold" size={24} />
```

### Iconify (static mode)
```bash
npm install @iconify/react @iconify/icons-lucide
```
```tsx
import { Icon } from '@iconify/react';
import arrowRight from '@iconify/icons-lucide/arrow-right';

<Icon icon={arrowRight} />
```

## Common mistakes

- **Picking Iconify for a single-library project.** Iconify adds ~8KB overhead; use the native library instead.
- **Using Heroicons when you need 400+ icons.** Heroicons v2 stops at ~292 icons; switch to Tabler or Lucide.
- **Importing Phosphor at multiple weights.** Weight is a prop in v2, not a separate module; no duplication risk.
