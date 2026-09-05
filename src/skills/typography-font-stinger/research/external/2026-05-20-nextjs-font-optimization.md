---
source_type: docs
authority: high
relevance: high
topic: next/font App Router API
url: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
retrieved: 2026-05-20
---

# Next.js - Optimizing Fonts with next/font (App Router)

## Summary

The official Next.js documentation for the `next/font` module covers automatic font self-hosting for both Google Fonts and local fonts via the App Router API. `next/font` eliminates external network requests, generates optimized font files at build time, and automatically inserts preload hints and fallback metric overrides to eliminate layout shift.

## Key quotations / statistics

- "The `next/font` module automatically optimizes your fonts and removes external network requests for improved privacy and performance. It includes built-in self-hosting for any font file. This means you can optimally load web fonts with no layout shift."
- "We recommend using variable fonts for the best performance and flexibility."
- "Fonts are scoped to the component they're used in. To apply a font to your entire application, add it to the Root Layout."
- "Fonts are included stored as static assets and served from the same domain as your deployment, meaning no requests are sent to Google by the browser when the user visits your site."

## API patterns (App Router)

### Google Fonts
```tsx
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

### Local fonts (single file)
```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})
```

### Local fonts (multiple weights in one family)
```js
const roboto = localFont({
  src: [
    { path: './Roboto-Regular.woff2', weight: '400', style: 'normal' },
    { path: './Roboto-Bold.woff2', weight: '700', style: 'normal' },
  ],
})
```

### Static weight (non-variable font)
```tsx
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})
```

## Critical differences: App Router vs Pages Router API

- App Router: import from `next/font/google` or `next/font/local`, apply via `className` prop.
- Pages Router (older): different import path and configuration object. The two APIs are NOT interchangeable.
- Critical directive from Command Brief: "Validate next/font usage with the App Router API, not the Pages Router API. The two APIs differ significantly in import path, options object, and where the class/variable is applied; mixing them causes runtime errors."

## What next/font does automatically

1. Downloads and serves fonts from the same domain (no Google Fonts CDN requests at runtime).
2. Subsets fonts to specified Unicode subsets at build time.
3. Generates preload hints for above-the-fold font files.
4. Generates fallback font metric overrides (`size-adjust`, `ascent-override`, etc.) to eliminate CLS from font swapping.
5. Applies `font-display: swap` by default (configurable via `display` option).

## Annotations for stinger-forge

- This is the primary source for `guides/01-hosting-strategy.md`, specifically the "next/font path" section.
- The App Router vs Pages Router distinction must be called out explicitly - it is the most common source of `next/font` bugs.
- Emphasize that `next/font` is the zero-configuration path for Next.js projects that eliminates FOIT/FOUT/CLS concerns at build time.
- The `className` vs CSS variable usage pattern (`variable` option) should be documented in the template.
- Contradicts self-hosting from Fontsource for pure Next.js projects - `next/font` is simpler and more automated.
