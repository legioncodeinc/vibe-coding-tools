---
source_type: blog
authority: high
relevance: high
topic: manual @font-face rules for variable fonts Fontsource
url: https://royportas.com/posts/variable-fonts-manual-font-face
retrieved: 2026-05-20
---

# Roy Portas - Manual @font-face Rules for Variable Fonts (March 2026)

## Summary

A 2026 practitioner article documenting the optimization of writing manual `@font-face` rules instead of using Fontsource's default import, to reduce the number of registered `@font-face` declarations from ~12 to 3 by selecting only the Latin subset. Also covers font preloading in TanStack Start (Vite-based).

## Key quotations / statistics

- "Each of those imports injects a stylesheet with multiple @font-face rules, one per Unicode subset the package supports. For Archivo that includes latin, latin-extended, and vietnamese. For an English-only site, the latin-extended and vietnamese subsets will never match any characters on the page."
- "Counting them up: Archivo ships 3 subsets (6 @font-face rules when you include the weight range declarations), Newsreader adds another 3 × 2 for normal and italic, so you end up with around 10–12 @font-face declarations when you only need 3."
- "The main win is dropping from ~12 @font-face rules to 3. It removes rules the browser was registering and never using."
- On preloading: "@font-face declarations are discovered lazily, and the browser only fetches a font file once it encounters text that needs it. For above-the-fold content this is too late, and you get a flash of unstyled text while the font loads. Preload hints fix this."
- "The crossorigin: 'anonymous' attribute is required for font preloads. Without it the browser fetches the font twice."

## The optimization: manual @font-face from Fontsource files

Instead of:
```js
import "@fontsource-variable/archivo";  // Injects ~12 @font-face rules
```

Use:
```css
@font-face {
  font-family: "Archivo Variable";
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url("../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2")
    format("woff2-variations");
  unicode-range: U+0000-00FF, U+0131, ...;
}
```

This uses only the Latin subset file directly from the Fontsource package, giving the developer full control while still using Fontsource as the source of truth for font files.

## Preload implementation (TanStack Start / Vite)

```js
import archivoFont from "@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2?url";

export const fontPreloadLinks = [
  {
    rel: "preload",
    href: archivoFont,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous"
  }
];
```

The `?url` suffix in Vite resolves the hashed output path at build time, ensuring the preload href matches the actual deployed font URL (a common mismatch footgun).

## Key insight: where subset files live in Fontsource packages

Inside `node_modules/@fontsource-variable/archivo/` there are individual subset CSS files:
- `archivo-latin.css`
- `archivo-latin-ext.css`
- etc.

And the actual font files in `files/`:
- `archivo-latin-wght-normal.woff2`
- `archivo-latin-wght-italic.woff2`

Developers can reference these directly rather than using the auto-injected stylesheets.

## Annotations for stinger-forge

- Include this as an advanced optimization pattern in `guides/01-hosting-strategy.md` under "Fontsource - manual @font-face optimization."
- The `?url` Vite import pattern for getting the hashed font URL is important for preload correctness - include in `guides/06-performance-checklist.md`.
- The 12 → 3 `@font-face` reduction is a concrete, measurable optimization worth highlighting.
- This approach keeps Fontsource as the dependency (maintaining version locking and offline benefits) while eliminating unnecessary subset declarations.
- The `crossOrigin: "anonymous"` requirement on preload links (causes double download without it) should be highlighted as a critical footgun in the performance checklist.
