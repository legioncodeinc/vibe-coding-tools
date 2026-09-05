# next/font Configuration Template

*Copy this file to `app/fonts.ts` (App Router) and adapt to your typefaces.*

---

## Google Fonts variable font (recommended)

```typescript
// app/fonts.ts
import { Inter } from 'next/font/google'

/**
 * Primary body + heading font.
 * Using CSS variable mode so `tokens/typography.css` can reference
 * --font-inter without coupling the token file to next/font import paths.
 */
export const inter = Inter({
  subsets: ['latin'],          // Required: specify unicode subsets
  display: 'swap',             // 'swap' | 'optional' | 'fallback' | 'block'
  variable: '--font-inter',    // Exposes as CSS custom property on <html>
  // weight: ['400', '700'],   // Only for non-variable fonts; omit for variable
  // style: ['normal', 'italic'], // Only needed for non-variable italic variants
  // preload: true,            // default true; set false for fonts loaded lazily
  // adjustFontFallback: true, // default true; auto-generates size-adjust fallback
})
```

---

## Google Fonts static weights (non-variable font)

```typescript
import { Roboto } from 'next/font/google'

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],    // Must specify weights for non-variable fonts
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-roboto',
})
```

---

## Multiple fonts (body + heading + mono)

```typescript
import { Inter, Lora, JetBrains_Mono } from 'next/font/google'

// Sans-serif body (variable weight)
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

// Serif headings (variable weight)
export const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

// Monospace code (variable weight)
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'optional',    // Code blocks are not LCP elements
  variable: '--font-mono',
})
```

---

## Local font (self-hosted / paid typeface)

```typescript
import localFont from 'next/font/local'

// Single variable font file
export const myFont = localFont({
  src: './fonts/myfont-variable-latin.woff2',
  display: 'swap',
  variable: '--font-primary',
  weight: '100 900',            // Range for variable fonts
  // adjustFontFallback: 'Arial', // Base font for metric-matching
})

// Multiple static weight files
export const myFontMultiWeight = localFont({
  src: [
    { path: './fonts/myfont-regular.woff2',    weight: '400', style: 'normal' },
    { path: './fonts/myfont-bold.woff2',       weight: '700', style: 'normal' },
    { path: './fonts/myfont-italic.woff2',     weight: '400', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-primary',
})
```

---

## Root layout application (App Router)

```tsx
// app/layout.tsx
import { inter, jetbrainsMono } from './fonts'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      /**
       * Applying font.variable (not font.className) sets the CSS custom
       * property (--font-inter, --font-mono) on :root so tokens/typography.css
       * can reference them without being coupled to next/font import paths.
       */
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

---

## tokens/typography.css reference (after fonts.ts)

```css
/* tokens/typography.css */
:root {
  /* Reference the CSS variables set by next/font on <html> */
  --font-family-body:    var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-family-code:    var(--font-mono), "Fira Code", Consolas, monospace;
}
```

---

## font.className vs font.variable

| Mode | How applied | When to use |
|------|-------------|-------------|
| `font.className` | Adds a class to the element; font only applies inside that class | Scoping a font to one component |
| `font.variable` | Sets a CSS custom property on the element | Sharing font across the whole document via tokens |

For the token architecture pattern, always use `font.variable` on the root `<html>` element.

---

## display option guide

| Value | Block period | Swap period | Use when |
|-------|-------------|-------------|----------|
| `swap` | 100ms | Infinite | Body text, headings: text always visible |
| `optional` | 100ms | None | Performance-first: font only if cached |
| `fallback` | 100ms | 3 seconds | Balanced: text visible, but stops late swapping |
| `block` | 3 seconds | Infinite | Avoid: produces FOIT |

`next/font` default is `optional` when no `display` option is set. Explicitly specify `swap` for headings and body text in most projects.
