# 04 - next/font Integration (App Router)

## Why next/font is the correct default for Next.js projects

`next/font` (introduced in Next.js 13, stable in Next.js 14+) handles the entire font loading pipeline automatically:

- Downloads and self-hosts font files at build time (no runtime CDN dependency)
- Automatically subsets fonts to the requested character sets
- Generates optimal `@font-face` rules with correct `font-display` and `unicode-range`
- Adds `<link rel="preload">` with correct `crossorigin` attribute
- Adds preconnect hints for Google Fonts origins
- Generates CSS variables or class names for use in components

For any Next.js project (App Router), `next/font` is the single correct answer. Manual Google Fonts `<link>` tags, manual preload, and raw Fontsource imports in Next.js App Router are all suboptimal.

---

## App Router vs Pages Router: critical difference

Before generating any code, confirm which router the project uses. The APIs differ significantly.

| Aspect | App Router | Pages Router |
|---|---|---|
| Import path | `next/font/google` or `next/font/local` | Same |
| Where fonts are declared | `app/fonts.ts` (or any layout file) | `pages/_app.tsx` or `pages/_document.tsx` |
| How font classes are applied | Root layout: add `className` or `variable` to `<html>` | `_app.tsx`: add `className` to `main` or body |
| CSS variable usage | `variable: '--font-inter'` then `var(--font-inter)` in CSS | Same, but applied via `_app.tsx` wrapper |

**Mixing the two causes runtime errors.** Always confirm the router before generating code.

---

## App Router canonical setup: `app/fonts.ts`

Create `app/fonts.ts` as a dedicated font configuration module:

```typescript
// app/fonts.ts
import { Inter, Geist } from 'next/font/google';
import localFont from 'next/font/local';

// Google Font with CSS variable (recommended for Tailwind integration)
export const inter = Inter({
  subsets: ['latin'],           // Only download the Latin subset
  display: 'optional',          // No CLS; accept system font on first cold load
  variable: '--font-inter',     // Creates a CSS variable
  preload: true,                // Add preload hint (true by default)
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});

// Secondary heading font
export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',              // Use swap for headings (LCP element)
  variable: '--font-geist',
  preload: true,
  fallback: ['Arial', 'Helvetica Neue', 'sans-serif'],
});

// Self-hosted local font
export const brandFont = localFont({
  src: [
    { path: '../public/fonts/brand-variable.woff2', style: 'normal' },
    { path: '../public/fonts/brand-italic.woff2',  style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-brand',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});
```

---

## Apply fonts in the root layout

```typescript
// app/layout.tsx
import { inter, geist } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geist.variable}`}  // Apply CSS variables to <html>
    >
      <body className={inter.className}>  // Apply default font class to body
        {children}
      </body>
    </html>
  );
}
```

**Why `variable` mode on `<html>` and `className` on `<body>?`**

- The `variable` prop (e.g., `--font-inter`) makes the font available as a CSS custom property across the entire document, including Tailwind config
- The `className` prop applies the font directly to the body via a generated CSS class
- Using `variable` on `<html>` and then `className` on `<body>` provides both: global CSS variable access AND direct font application

---

## Tailwind v3 integration

```javascript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],     // References the CSS variable from next/font
        heading: ['var(--font-geist)'],
      },
    },
  },
};

export default config;
```

Then in components:

```tsx
<h1 className="font-heading">Hello</h1>   // uses Geist
<p className="font-sans">Body text</p>    // uses Inter
```

---

## Tailwind v4 integration

In Tailwind v4, add font families in your CSS config file:

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-inter);
  --font-heading: var(--font-geist);
}
```

---

## `display` option guide

| Value | When to use with next/font |
|---|---|
| `'optional'` | Body copy where zero CLS is the priority |
| `'swap'` | Heading fonts (LCP elements); pair with metric-matched fallback in `fallback` array |
| `'fallback'` | Secondary fonts; bounded swap window |

**Default behavior:** `next/font` defaults to `display: 'swap'` if not specified. Always specify explicitly.

**Note about `next/font` and metric-matched fallbacks:** Next.js 14+ generates `size-adjust` overrides for the fallback fonts you specify in the `fallback` array automatically when the font metrics are known. This is a significant advantage over manual `@font-face` configuration. Verify in the generated CSS that `size-adjust` is present on the fallback `@font-face` rule.

---

## `next/font/local` for self-hosted fonts

```typescript
import localFont from 'next/font/local';

export const brandFont = localFont({
  src: [
    {
      path: '../public/fonts/brand-variable.woff2',
      style: 'normal',
      weight: '100 900',  // Variable font weight range
    },
    {
      path: '../public/fonts/brand-italic-variable.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
  display: 'swap',
  variable: '--font-brand',
  fallback: ['Georgia', 'serif'],
  preload: true,
  adjustFontFallback: 'Times New Roman',  // Next.js 14+: metric-matched fallback generation
});
```

`adjustFontFallback` triggers automatic `size-adjust` and metric-override generation for the specified fallback font. Available in Next.js 14+ for local fonts.

---

## Common mistakes to audit

| Mistake | Impact | Fix |
|---|---|---|
| Using `<link href="fonts.googleapis.com/...">` in `app/layout.tsx` | CDN dependency, no subsetting, no auto-preload | Replace with `next/font/google` import |
| Declaring `next/font` inside a component (not in a layout or `fonts.ts`) | Font re-instantiated on every render | Move to `app/fonts.ts` or root layout |
| Using `className` mode instead of `variable` mode then trying to use it in Tailwind config | Tailwind can't reference a class-based font | Use `variable` mode for Tailwind integration |
| Using App Router API (`variable` prop) in Pages Router | Pages Router doesn't support CSS variable injection from font object | Use `className` mode for Pages Router |
| Specifying `preload: false` without `display: 'optional'` | No preload hint AND potential FOIT | Either set `preload: true` or use `display: 'optional'` |

---

## References

- `guides/01-font-display-decision-matrix.md`: `display` option selection
- `guides/05-cls-elimination.md`: how `adjustFontFallback` works under the hood; when to add manual overrides
- `guides/06-performance-checklist.md`: verifying next/font output in the browser
- `examples/happy-path-nextjs-inter.md`: complete Next.js 15 + Inter setup with zero CLS
- `research/external/`: Next.js font optimization docs, Fontsource comparison
