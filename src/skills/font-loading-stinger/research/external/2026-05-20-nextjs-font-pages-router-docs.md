---
source_url: https://nextjs.org/docs/pages/getting-started/fonts
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: nextjs-font
stinger: font-loading-stinger
---

# Font Optimization - Next.js (Pages Router docs)

## Summary
Official Next.js Pages Router documentation for `next/font`. The API is
identical to App Router for the font configuration object, but the application
point differs: Pages Router applies fonts in `pages/_app.tsx` via `<main>`
className, while App Router uses `app/layout.tsx` via `<html>` className. This
is the key distinction the Command Brief flags as critical.

## Key quotations / statistics

- Pages Router application pattern:
  ```tsx
  import { Geist } from 'next/font/google'
  import type { AppProps } from 'next/app'
  const geist = Geist({ subsets: ['latin'] })
  export default function MyApp({ Component, pageProps }: AppProps) {
    return (
      <main className={geist.className}>
        <Component {...pageProps} />
      </main>
    )
  }
  ```

- Compare to App Router which applies on `<html>` element in `app/layout.tsx`

- Local font in Pages Router:
  ```tsx
  import localFont from 'next/font/local'
  const myFont = localFont({ src: './my-font.woff2' })
  ```

- "We recommend using variable fonts for the best performance and flexibility."

## Annotations for stinger-forge

- This source is paired with the App Router docs to document the API difference.
- The key difference: Pages Router uses `pages/_app.tsx` → `<main className>`,
  App Router uses `app/layout.tsx` → `<html className>`.
- `guides/04-nextjs-font.md` must include a **dedicated comparison table** or
  side-by-side code block for App Router vs Pages Router to avoid the runtime
  errors the Command Brief warns about.
- Same font object API (`subsets`, `display`, `weight`, etc.) works in both
  routers: the difference is only the application file and HTML element.
