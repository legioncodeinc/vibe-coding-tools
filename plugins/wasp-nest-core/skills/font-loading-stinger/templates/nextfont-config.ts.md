# Template: `app/fonts.ts`, next/font Configuration

Replace all `{{...}}` placeholders. See `guides/04-nextjs-font.md` for complete API reference.

---

## Google Font (variable, recommended)

```typescript
// app/fonts.ts
import { {{InterOrOtherGoogleFont}} } from 'next/font/google';

export const primaryFont = {{InterOrOtherGoogleFont}}({
  subsets: ['latin'],             // Required: character set to download
  display: '{{optional|swap}}',  // optional=zero CLS; swap=immediate text + metric fallback needed
  variable: '--font-{{name}}',   // CSS custom property for Tailwind integration
  preload: true,                  // Emit <link rel="preload"> automatically
  fallback: ['{{system-ui}}', '{{-apple-system}}', '{{sans-serif}}'],
});
```

## Local/self-hosted font (variable)

```typescript
import localFont from 'next/font/local';

export const brandFont = localFont({
  src: [
    {
      path: '../public/fonts/{{font-name}}-variable.woff2',
      style: 'normal',
      weight: '100 900',  // Variable font range
    },
    {
      path: '../public/fonts/{{font-name}}-italic-variable.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
  display: 'swap',
  variable: '--font-{{name}}',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',    // Triggers automatic size-adjust + metric override generation
  preload: true,
});
```

## Usage in root layout

```typescript
// app/layout.tsx
import { primaryFont } from './fonts';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={primaryFont.variable}>
      <body className={primaryFont.className}>
        {children}
      </body>
    </html>
  );
}
```

## Tailwind v4 wiring

```css
/* app/globals.css */
@import 'tailwindcss';

@theme {
  --font-sans: var(--font-{{name}});
}
```
