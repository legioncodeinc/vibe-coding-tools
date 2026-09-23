# Guide 01: Tree-Shake vs SVG Sprite

Source: `research/external/icon-sprite-patterns.md`, `research/external/lucide-react.md`

## Decision matrix

| Project profile | Recommended strategy |
|---|---|
| Single app, <200 icons, defined set | Named ESM imports (tree-shaking) |
| Single app, 200-500 icons, dynamic set | Named ESM imports + lazy loading for rarely-used icons |
| Micro-frontend / multiple bundles sharing the same icons | SVG sprite sheet |
| Non-React rendering (email, server HTML, CMS) | SVG sprite sheet |
| Admin tool with 500+ icons, few per page | Iconify on-demand (CDN) mode |

## Named ESM imports (default)

Modern bundlers (Vite, Webpack 5+, Rollup) tree-shake ESM packages by removing unused named exports. For Lucide React v0.400+, Heroicons v2, Tabler v4, and Phosphor v2, named imports are tree-shaken correctly.

```tsx
// Correct — only ArrowRight and ChevronDown are bundled
import { ArrowRight, ChevronDown } from 'lucide-react';

// Wrong — attempts to import all icons (may be caught by bundler, may not)
import * as Icons from 'lucide-react';
const Icon = Icons[name]; // Dynamic property access defeats static analysis
```

### Bundle size reference (approximate, gzipped)
| Icon count (Lucide) | Bundle size |
|---|---|
| 10 | ~4KB |
| 50 | ~18KB |
| 100 | ~35KB |
| Full set (1400+) | ~500KB+ |

## SVG sprite strategy

An SVG sprite stores all icons as `<symbol>` elements in a single SVG file. Icons are referenced with `<use href="#icon-id" />`.

### When sprites win
- The same icon set is needed across 3+ separate JS bundles (avoids per-bundle duplication).
- Icons are needed in non-React contexts (email templates, server-rendered HTML pages).
- SSR performance matters and minimizing hydration JS is a priority.

### Generating a sprite with SVGO + svg-sprite
```bash
npm install --save-dev svgo svg-sprite
```

Use a build script to extract SVG files from the icon library package and concatenate them into a sprite. The sprite lives in `public/sprite.svg` and is never part of the JS bundle.

```html
<!-- Usage in any HTML/React context -->
<svg aria-hidden="true" width="24" height="24">
  <use href="/sprite.svg#arrow-right" />
</svg>
```

### Sprite in Vite (SVGR approach for React components)
```bash
npm install --save-dev vite-plugin-svgr
```
Note: SVGR converts SVG files to React components (inline SVG), not sprite entries. Use `svg-sprite` CLI for true sprite generation.

### Sprite in Next.js (Webpack)
```js
// next.config.js — for SVG-as-React-component
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```
For Next.js 15+ with Turbopack, consult the Turbopack SVGR plugin docs; the Webpack approach does not apply.

## Anti-patterns to flag

- **Importing the icon library index** (`import * as LucideIcons from 'lucide-react'`) for non-dynamic use: defeats tree-shaking unless the bundler can prove which icons are used.
- **Serving the SVG sprite inline** (embedded in HTML `<body>`): defeats HTTP caching; serve as a separate file from `public/`.
- **Using Iconify CDN in production for above-the-fold content**: CDN requests add latency; use static bundled mode instead.
