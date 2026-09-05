# Font Hosting Strategy Decision Tree

*Sources: `research/external/2026-05-20-nextjs-font-optimization.md`, `research/external/2026-05-20-fontsource-docs.md`, `research/external/2026-05-20-fontsource-manual-fontface.md`, `research/external/2026-05-20-web-dev-font-best-practices.md`*

---

## Decision tree

```
Is this a Next.js project?
├── YES → Is the font available on Google Fonts or locally?
│   ├── Google Fonts → Use next/font/google (Branch A)
│   └── Custom/local font → Use next/font/local (Branch B)
└── NO → Is this a React/Vite/Node project?
    ├── YES → Is zero-JS SSR-safe import required?
    │   ├── YES → Use Fontsource npm import (Branch C)
    │   └── NO (CSR-only) → Use Fontsource npm import (Branch C)
    └── NO → Use self-hosted @font-face with subsetting (Branch D)
```

---

## Branch A: next/font/google (recommended for Next.js + Google Fonts)

`next/font/google` downloads the font at build time, self-hosts it automatically, and eliminates the Google Fonts network request. There are no privacy concerns at runtime and no render-blocking requests.

```typescript
// app/fonts.ts
import { Inter, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'optional', // default; best for LCP
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
  display: 'swap',
});
```

```typescript
// app/layout.tsx
import { inter, playfair } from './fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then reference in CSS via the CSS variable:

```css
body { font-family: var(--font-inter), system-ui, sans-serif; }
h1   { font-family: var(--font-playfair), Georgia, serif; }
```

**Key options:**
- `subsets`: Always specify. `['latin']` for most Western projects. Reduces download size significantly.
- `variable`: Use `--font-<name>` convention. Lets you reference the font family without importing the next/font object in CSS.
- `display`: `'optional'` (default) is best for LCP. Use `'swap'` for heading fonts where brand consistency > CLS.
- `weight`: For static fonts, specify the weights you use. For variable fonts, omit (all weights included in the range).
- `adjustFontFallback`: `true` by default. Generates size-adjust/metric-override CSS for the fallback font to minimize CLS.

**Source:** `research/external/2026-05-20-nextjs-font-optimization.md`

---

## Branch B: next/font/local (Next.js + custom/local font)

Use when the font is not on Google Fonts, or when you have a locally licensed variable font file.

```typescript
// app/fonts.ts
import localFont from 'next/font/local';

export const brandFont = localFont({
  src: [
    { path: '../public/fonts/BrandFont-Regular.woff2', weight: '400' },
    { path: '../public/fonts/BrandFont-Bold.woff2', weight: '700' },
  ],
  variable: '--font-brand',
  display: 'swap',
  preload: true,
});

// For a variable font file:
export const brandVariable = localFont({
  src: '../public/fonts/BrandFont-Variable.woff2',
  variable: '--font-brand',
  display: 'optional',
});
```

Place font files in `public/fonts/`. Use `.woff2` format exclusively for modern browsers.

**Source:** `research/external/2026-05-20-nextjs-font-optimization.md`

---

## Branch C: Fontsource npm import (non-Next.js React/Vite)

Fontsource self-hosts Google Fonts (and many others) as npm packages. Install the package, import the CSS, and reference via `font-family`.

```bash
npm install @fontsource-variable/inter
```

```typescript
// src/main.ts or src/index.ts
import '@fontsource-variable/inter';
// or for non-variable with specific weights:
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
```

```css
body { font-family: 'Inter Variable', system-ui, sans-serif; }
```

**Advanced: manual @font-face to reduce declarations**

The default Fontsource import includes ~12 `@font-face` rules covering many subsets and weights. Roy Portas (March 2026) documents reducing this to 3 manual declarations for a 60% reduction in CSS payload (`research/external/2026-05-20-fontsource-manual-fontface.md`):

```css
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+2020, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

Use the manual pattern when you need precise control over which subsets are loaded.

**Source:** `research/external/2026-05-20-fontsource-docs.md`, `research/external/2026-05-20-fontsource-manual-fontface.md`

---

## Branch D: Full self-hosting with subsetting pipeline

Use when: custom licensed font not available on Fontsource, maximum control required, or font file must be served from the same CDN as the app.

Steps:
1. Subset the font with `pyftsubset` (from `fonttools`) or `glyphhanger`. See `guides/02-variable-fonts.md` for subsetting.
2. Convert to `.woff2` using `woff2_compress`.
3. Place in `public/fonts/` or your CDN.
4. Write `@font-face` declarations with explicit `font-display`, `unicode-range`, and `font-variation-settings`.
5. Add `<link rel="preload">` in `<head>` for the critical font file.

**Source:** `research/external/2026-05-20-variable-font-subsetting.md`, `research/external/2026-05-20-web-dev-font-best-practices.md`

---

## Privacy note

Google Fonts loads fonts from Google's CDN at runtime, which sends the user's IP address to Google. In GDPR-relevant deployments, this may require a cookie consent layer or switching to a self-hosted option. `next/font/google` eliminates this concern by downloading at build time.
