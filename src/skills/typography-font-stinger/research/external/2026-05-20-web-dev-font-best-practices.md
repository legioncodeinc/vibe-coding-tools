---
source_type: docs
authority: high
relevance: high
topic: font performance best practices
url: https://web.dev/articles/font-best-practices
retrieved: 2026-05-20
---

# Google web.dev - Optimize Web Fonts for Core Web Vitals

## Summary

Google's canonical font best-practices guide covers the complete font lifecycle: loading, delivery, and rendering. The guide is authored by Katie Hempenius and Barry Pollard and focuses on font impact on Core Web Vitals (FCP, LCP, CLS). It is the authoritative reference for production font optimization in 2026.

## Key quotations / statistics

- "In fact, we think it is also time to proclaim: Use only WOFF2 and forget about everything else." (Bram Stein, 2022 Web Almanac) - WOFF2 compresses 30% better than WOFF using Brotli.
- "A common misconception is that a font is requested when a @font-face declaration is encountered. This is false. By itself, @font-face declaration doesn't trigger font download. Rather, a font is downloaded only if it's referenced by styling that is used on the page."
- Font-display values decision table: Auto (varies), Block (2-3s block + infinite swap), Swap (0ms block + infinite swap), Fallback (100ms block + 3s swap), Optional (100ms block + no swap).
- "Most sites would strongly benefit from inlining font declarations and other critical styling in the `<head>` of the main document rather than including them in an external stylesheet."
- "font-display: auto, font-display: block, font-display: swap, and font-display: fallback all have the potential to cause layout shifts when the font is swapped. However, of these approaches, font-display: swap delays text render the least."
- For CLS reduction: "you can use the `size-adjust` attributes" to match fallback font metrics to web font metrics.
- On variable fonts: "Sites that will see the largest improvement from using variable fonts are those that use (and need to use) a variety of font styles and weights."

## Font loading: key best practices

1. **Inline @font-face declarations** in `<head>` to allow early discovery without waiting for external stylesheet.
2. **Preconnect** to third-party font origins (add `crossorigin` attribute for font file requests due to CORS requirements).
3. **Use `preload` cautiously** - it bypasses browser content negotiation and takes bandwidth from other critical resources. Only preload the single most important font.
4. **Self-hosted fonts** eliminate extra DNS + TCP for third-party origins but require a CDN and HTTP/2 to match third-party performance.
5. **Use WOFF2 only** - universal browser support, 30% better compression than WOFF via Brotli.
6. **Subset fonts** with `unicode-range` descriptor. CJK fonts can have 10,000+ glyphs vs 100-1000 for Latin.

## Font rendering: font-display strategy matrix

| Priority | Strategy | Value |
|---|---|---|
| Performance (best CWV) | 100ms block max, no swap | `font-display: optional` |
| Show text fast + use web font | Render fallback immediately, swap when ready | `font-display: swap` |
| Ensure web font renders | Short delay tolerated | `font-display: block` |

- Combining strategies: use `swap` for branding/hero elements, `optional` for body text.
- Icon fonts: avoid swap strategies entirely - use SVG instead.

## Annotations for stinger-forge

- This source should be the primary reference for `guides/00-principles.md` (font-display decision matrix) and `guides/06-performance-checklist.md` (the complete optimization checklist).
- The @font-face loading mechanics explanation (font not requested until used in styling) is essential for developers who don't understand why their fonts load late.
- The inline font declarations technique is often missed - include it in the hosting strategy guide.
- The CORS requirement for crossorigin on preload is a common footgun - highlight in guides/06.
