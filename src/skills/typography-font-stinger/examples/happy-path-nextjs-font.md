# Happy Path: Next.js 15 App Router + next/font + Tailwind v4

This example shows the complete, production-ready typography setup for a Next.js 15 App Router project using Inter as the primary typeface (variable font via `next/font/google`) and a fluid type scale in `tokens/typography.css`.

---

## Project structure produced

```
app/
  fonts.ts              <- font instances
  layout.tsx            <- applies font CSS variable to <html>
  globals.css           <- imports tokens, wires Tailwind v4 @theme
tokens/
  typography.css        <- all font token custom properties
tailwind.config.ts      <- Tailwind v4 plugin config (if v3 path used)
```

---

## Step 1: Configure fonts in app/fonts.ts

```typescript
// app/fonts.ts
import { Inter, JetBrains_Mono } from 'next/font/google'

// Variable weight Inter (100-900) - Latin subset only
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',   // exposes as CSS variable
})

// JetBrains Mono for code blocks
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-mono',
})
```

**Notes:**
- `variable` prop exposes the font as a CSS custom property on `<html>`, not just a class.
- `display: 'swap'` on the display font (Inter); `display: 'optional'` on the mono font (code blocks are not LCP elements).
- `subsets: ['latin']` - essential for keeping font payload under 50 KB.

---

## Step 2: Apply CSS variables to the root layout

```tsx
// app/layout.tsx
import { inter, jetbrainsMono } from './fonts'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
```

The `className` application sets `--font-inter` and `--font-mono` CSS variables on `:root`, making them available everywhere in the document.

---

## Step 3: Author tokens/typography.css

```css
/* tokens/typography.css */
:root {
  /* --- Family tokens (reference next/font CSS variables) --- */
  --font-family-body:    var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-family-heading: var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-family-code:    var(--font-mono), "Fira Code", Consolas, monospace;

  /* --- Fluid scale (Major Third, 320px-1440px) --- */
  /* Generate custom values at https://utopia.fyi/type/calculator/ */
  --step--2: clamp(0.64rem, 0.62rem + 0.11vw, 0.72rem);
  --step--1: clamp(0.80rem, 0.77rem + 0.14vw, 0.90rem);
  --step-0:  clamp(1.00rem, 0.96rem + 0.18vw, 1.13rem);
  --step-1:  clamp(1.25rem, 1.20rem + 0.23vw, 1.41rem);
  --step-2:  clamp(1.56rem, 1.50rem + 0.28vw, 1.76rem);
  --step-3:  clamp(1.95rem, 1.88rem + 0.35vw, 2.20rem);
  --step-4:  clamp(2.44rem, 2.35rem + 0.43vw, 2.75rem);
  --step-5:  clamp(3.05rem, 2.94rem + 0.54vw, 3.44rem);

  /* --- Semantic size tokens --- */
  --font-size-caption: var(--step--2);
  --font-size-small:   var(--step--1);
  --font-size-body:    var(--step-0);
  --font-size-large:   var(--step-1);
  --font-size-h6:      var(--step-1);
  --font-size-h5:      var(--step-2);
  --font-size-h4:      var(--step-2);
  --font-size-h3:      var(--step-3);
  --font-size-h2:      var(--step-4);
  --font-size-h1:      var(--step-5);

  /* --- Weight tokens --- */
  --font-weight-body:    400;
  --font-weight-strong:  600;
  --font-weight-heading: 700;
  --font-weight-ui:      500;

  /* --- Line height tokens --- */
  --line-height-body:    1.6;
  --line-height-heading: 1.15;
  --line-height-subhead: 1.3;
  --line-height-ui:      1.1;
  --line-height-caption: 1.45;
  --line-height-code:    1.65;

  /* --- Letter spacing tokens --- */
  --letter-spacing-tight:  -0.025em;
  --letter-spacing-normal:  0em;
  --letter-spacing-wide:    0.025em;
  --letter-spacing-widest:  0.1em;

  /* --- Rhythm tokens --- */
  --rhythm:     1.6;      /* matches --line-height-body */
  --rhythm-rem: 1.5rem;   /* base spacing unit */
}
```

---

## Step 4: Wire into globals.css

```css
/* app/globals.css */
@import "tailwindcss";                  /* Tailwind v4 */
@import "../tokens/typography.css";

/* Base document styles */
html {
  font-family: var(--font-family-body);
  font-size:   var(--font-size-body);
  line-height: var(--line-height-body);
}

h1 { font-size: var(--font-size-h1);  line-height: var(--line-height-heading); font-weight: var(--font-weight-heading); letter-spacing: var(--letter-spacing-tight); }
h2 { font-size: var(--font-size-h2);  line-height: var(--line-height-heading); font-weight: var(--font-weight-heading); letter-spacing: var(--letter-spacing-tight); }
h3 { font-size: var(--font-size-h3);  line-height: var(--line-height-subhead); font-weight: var(--font-weight-strong); }
h4 { font-size: var(--font-size-h4);  line-height: var(--line-height-subhead); font-weight: var(--font-weight-strong); }
h5 { font-size: var(--font-size-h5);  line-height: var(--line-height-subhead); font-weight: var(--font-weight-ui); }
h6 { font-size: var(--font-size-h6);  line-height: var(--line-height-subhead); font-weight: var(--font-weight-ui); }

code, kbd, samp {
  font-family: var(--font-family-code);
  font-size:   0.875em;
  line-height: var(--line-height-code);
}
```

---

## Verification checklist

After completing the setup, verify:

- [ ] No `<link rel="stylesheet" href="fonts.googleapis.com/...">` in the rendered HTML (use browser DevTools > Network > Doc).
- [ ] Font files appear in Network > Font tab, served from `/_next/static/media/`.
- [ ] `--font-inter` CSS variable is visible on `:root` in Elements > Computed.
- [ ] Lighthouse CLS for fonts is 0.
- [ ] No raw `px` font sizes in any component file (`grep -r "font-size:[[:space:]]*[0-9]*px" src/`).
