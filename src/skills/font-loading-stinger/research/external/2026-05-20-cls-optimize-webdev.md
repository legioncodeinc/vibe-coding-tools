---
source_url: https://web.dev/articles/optimize-cls
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: cls
stinger: font-loading-stinger
---

# Optimize Cumulative Layout Shift | web.dev

## Summary
Google's authoritative guide for CLS optimization, with a dedicated "Web fonts"
section. Documents the four CSS properties for fallback font metric override
(`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) and
links to the "Improved font fallbacks" technique. Confirms CLS target of < 0.1
for good UX.

## Key quotations / statistics

- "For the best user experience, every page should aim to have a CLS score lower
  than **0.1**."

- Web fonts CLS causes and mitigations:
  - "`font-display: optional` can avoid a re-layout as the web font is only used
    if it is available by the time of initial layout."
  - "Ensure the appropriate fallback font is used. For example, using
    `font-family: 'Google Sans', sans-serif;` will ensure the browser's
    `sans-serif` fallback font is used... Not specifying a fallback using just
    `font-family: 'Google Sans'` will mean the default font is used, which on
    Chrome is 'Times': a serif font which is a worse match than `sans-serif`."
  - "Minimize the size differences between the fallback font and the web font
    using the new `size-adjust`, `ascent-override`, `descent-override`, and
    `line-gap-override` APIs."
  - "Load critical web fonts as early as possible using `<link rel=preload>`.
    A preloaded font will have a higher chance to meet the first paint, in which
    case there's no layout shifting."

- "A highly effective technique for keeping CLS scores low is to ensure your web
  pages are eligible for the back/forward cache (bfcache)."

## Annotations for stinger-forge

- This source is the **canonical CLS target** citation: < 0.1 belongs in
  `guides/06-performance-checklist.md` as the CLS budget.
- The "fallback font family class matters" note (sans-serif vs serif default
  behavior in Chrome) is a practical tip for `guides/05-cls-elimination.md`
  when recommending fallback font selection.
- The four metric override properties are named here; the detailed implementation
  technique is in the Chrome DevTools framework tools source and the DebugBear
  CLS source.
