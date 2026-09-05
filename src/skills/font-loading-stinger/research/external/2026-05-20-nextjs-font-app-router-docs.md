---
source_url: https://nextjs.org/docs/app/getting-started/fonts
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: nextjs-font
stinger: font-loading-stinger
---

# Font Optimization - Next.js (App Router docs)

## Summary
Official Next.js App Router documentation for the `next/font` module. Covers
Google Fonts self-hosting pattern, local fonts via `next/font/local`, variable
font recommendation, multi-file `src` array, `className` and `variable` usage
patterns, and `display` option. Confirms that `next/font` eliminates external
network requests and prevents layout shift. The App Router API imports from
`next/font/google` and `next/font/local`; fonts are scoped to the component
they're used in.

## Key quotations / statistics

- "The `next/font` module automatically optimizes your fonts and removes external
  network requests for improved privacy and performance. It includes built-in
  self-hosting for any font file. This means you can optimally load web fonts
  with no layout shift."

- Recommended App Router pattern (`app/layout.tsx`):
  ```tsx
  import { Geist } from 'next/font/google'
  const geist = Geist({ subsets: ['latin'] })
  export default function Layout({ children }) {
    return (
      <html lang="en" className={geist.className}>
        <body>{children}</body>
      </html>
    )
  }
  ```

- Local font pattern:
  ```tsx
  import localFont from 'next/font/local'
  const myFont = localFont({ src: './my-font.woff2' })
  ```

- Multi-weight local font via `src` array:
  ```js
  const roboto = localFont({
    src: [
      { path: './Roboto-Regular.woff2', weight: '400', style: 'normal' },
      { path: './Roboto-Bold.woff2', weight: '700', style: 'normal' },
    ],
  })
  ```

- "We recommend using variable fonts for the best performance and flexibility."

- "Fonts are scoped to the component they're used in. To apply a font to your
  entire application, add it to the Root Layout."

## Annotations for stinger-forge

- This is the **primary source** for `guides/04-nextjs-font.md` App Router
  section.
- The App Router pattern places font config on `<html>` className vs Pages
  Router which uses `<main>` or `<body>`: this difference must be explicit
  in the guide.
- The multi-weight `src` array pattern is the standard approach for self-hosted
  fonts with multiple weights.
- `variable` vs `className` mode is not fully covered here; supplement with the
  Font API reference source (see `2026-05-20-nextjs-font-api-reference.md`).
- Template `templates/nextfont-config.ts.md` should show both `className` and
  `variable` patterns side-by-side.
