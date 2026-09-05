---
source_type: blog
authority: high
relevance: high
topic: FOIT FOUT FOFT font-display decision
url: https://www.jamesrossjr.com/blog/font-loading-optimization
retrieved: 2026-05-20
---

# James Ross Jr. - Font Loading Optimization: Eliminating Layout Shift and Invisible Text (March 2026)

## Summary

A developer-focused 2026 guide that clearly differentiates FOIT, FOUT, and FOFT, explains fallback font metric matching with CSS override descriptors, and contrasts the Next.js automated solution with manual self-hosting. This is the strongest source for clearly explaining the three-way FOIT/FOUT trade-off.

## Key quotations / statistics

- "FOIT (Flash of Invisible Text): The browser blocks text rendering until the web font has downloaded. Users see blank spaces where text should be. On a slow connection, critical content like headlines can be invisible for 2-3 seconds."
- "FOUT (Flash of Unstyled Text): The browser renders text immediately using a fallback system font, then swaps to the web font when it downloads. This causes the text to visibly shift in size and position — a layout shift event that accumulates into your CLS score."
- On `block` value: "Block text rendering for up to 3 seconds, then swap. This is the default behavior — maximum FOIT, no FOUT. Appropriate for critical icon fonts where rendering the wrong symbol is worse than no symbol."
- On `swap` value: "Render immediately with fallback font, swap to web font when available. Zero FOIT, potential FOUT. This is the right default for most body text."
- "When a browser swaps from a fallback font to a web font, the text reflows if the two fonts have different metrics. The text takes up more or less space, changes height, and everything shifts."
- "Next.js: The next/font package handles font self-hosting, subsetting, and fallback metric generation automatically at build time. It generates the size-adjust and override values. This is the easiest way to get optimal font loading in a Next.js project."
- Target: "zero CLS attributable to font loading, zero FOIT, and web fonts loaded within 1 second of page start on a good connection."

## FOIT vs FOUT vs FOFT defined

| Flash | What user sees | Cause | Remediation |
|---|---|---|---|
| FOIT | Invisible text (blank space) | `font-display: block` or browser default | Use `font-display: swap` or `optional` |
| FOUT | Unstyled fallback text, then swap | `font-display: swap` with metric mismatch | Fix fallback metrics with `size-adjust` |
| FOFT | Faux bold/italic rendered by browser | Loading regular weight only first | Progressive loading / Critical FOFT strategy |

## Fallback metric override pattern

```css
@font-face {
  font-family: "Geist Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: "Geist", "Geist Fallback", Arial, sans-serif;
}
```

The override descriptors tell the browser to render Arial with the same metrics as Geist. When Geist loads and swaps in, the text occupies the same space - no layout shift.

## font-display value guide

| Value | FOIT risk | FOUT risk | CLS risk | Use case |
|---|---|---|---|---|
| `block` | High (2-3s) | None | Medium | Icon fonts only |
| `swap` | None | High | High without metric matching | Body text (most common) |
| `fallback` | Low (100ms) | Medium | Low | Middle ground |
| `optional` | None (100ms) | None | None | Body text (CWV priority) |

## Critical FOFT (Zach Leatherman technique)

For maximum performance: load one optimized subset of the Roman font first (preloaded, 15-25 kB), then use the Font Loading API to swap in the full family. This reduces initial font payload from 200-400 kB to a single file while delivering full typographic richness within seconds.

## Annotations for stinger-forge

- Primary source for `guides/00-principles.md` FOIT/FOUT/FOFT section.
- The three-row table distinguishing FOIT, FOUT, and FOFT should be included verbatim or adapted in the guide.
- The `size-adjust` + override pattern is the standard manual approach; cross-reference with `2026-05-20-variable-font-subsetting.md` which also covers this.
- The Critical FOFT technique is worth a brief mention as an advanced pattern for high-performance sites.
- The next/font automated approach (which handles all this automatically) should be positioned as the "take the easy path" option.
- Contradictions with `web.dev/font-best-practices`: web.dev says "use preload cautiously" while this guide says preloading is critical for `optional` to work. The reconciliation: preload is cautious (max 1-2 fonts), but it IS required for the `optional` strategy to work reliably.
