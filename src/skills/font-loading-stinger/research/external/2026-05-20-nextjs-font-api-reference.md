---
source_url: https://nextjs.org/docs/app/api-reference/components/font
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: nextjs-font
stinger: font-loading-stinger
---

# Components: Font | Next.js API Reference (App Router)

## Summary
Official Next.js Font API reference documenting all `next/font/google` and
`next/font/local` options including `subsets`, `display`, `weight`, `style`,
`variable`, `fallback`, `preload`, and the critical `adjustFontFallback` option.
Confirms that `adjustFontFallback` is **enabled by default** (`true`) for
`next/font/google`, automatically generating metric-adjusted fallback fonts to
reduce CLS.

## Key quotations / statistics

- `fallback` option:
  - "The fallback font to use if the font cannot be loaded. An array of strings
    of fallback fonts with no default. Optional."
  - Example: `fallback: ['system-ui', 'arial']`

- `adjustFontFallback` option (answers the open question from Command Brief):
  - **For `next/font/google`**: "A boolean value that sets whether an automatic
    fallback font should be used to reduce Cumulative Layout Shift. The default
    is **`true`**. Next.js automatically sets your fallback font to either
    `Arial` or `Times New Roman` depending on the font type (serif vs
    sans-serif respectively)."
  - **For `next/font/local`**: "A string or boolean `false` value. The possible
    values are `'Arial'`, `'Times New Roman'` or `false`. The default is
    `'Arial'`."

- Multiple fonts via `app/fonts.ts` utility pattern:
  ```ts
  import { Inter, Roboto_Mono } from 'next/font/google'
  export const inter = Inter({ subsets: ['latin'], display: 'swap' })
  export const roboto_mono = Roboto_Mono({ subsets: ['latin'], display: 'swap' })
  ```

- CSS variable pattern for Tailwind integration:
  ```css
  html { font-family: var(--font-inter); }
  h1 { font-family: var(--font-roboto-mono); }
  ```

- "Every time you call the `localFont` or Google font function, that font is
  hosted as one instance. If you load the same font function in multiple files,
  multiple instances of the same font are hosted. Recommended: call the font
  loader function in one shared file and export it as a constant."

## Annotations for stinger-forge

- **Critical finding for Command Brief open question**: `next/font` (v13+,
  including v15) handles `size-adjust` fallback generation **automatically** via
  `adjustFontFallback: true` (the default). No manual metric calculation is
  needed for Google Fonts users or `next/font/local` users.
- The `fonts.ts` shared utility pattern must be the recommended pattern in
  `guides/04-nextjs-font.md`: it prevents multiple font instances.
- The `display: 'swap'` in `fonts.ts` is the explicit way to set font-display;
  without it, `next/font` uses its own default (likely `optional` for cached
  self-hosted fonts).
- Template `templates/nextfont-config.ts.md` must include the `fonts.ts` export
  pattern plus the `adjustFontFallback` default note.
- The App Router `variable` pattern (CSS variable injection) is covered here
  and should be contrasted with `className` in the guide.
