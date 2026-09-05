---
url: https://botmonster.com/posts/variable-fonts-subsetting-web-performance/
fetched: 2026-05-20
source_type: blog
authority: medium
relevance: high
topic: subsetting
---

# Variable Font Subsetting: Cut Payload by 90% with Variable Fonts (Botmonster Tech)

## Summary

A 2026 practitioner article covering the modern variable font subsetting pipeline. Confirms that as of 2026 all major browsers support variable fonts by default (Chrome 124+, Firefox 130+, Safari 18+, Edge 124+), Google Fonts serves variable fonts by default, and the toolchain uses `pyftsubset` from the fonttools library as the standard. Demonstrates a dramatic size reduction: Inter variable font from ~310 KB WOFF2 to ~35 KB with Latin-only subsetting (89% reduction). The article establishes `pip install fonttools[woff]` (Python 3.10+) as the standard entry point.

## Key quotations / statistics

- Inter variable font: "310 KB WOFF2 drops to ~35 KB with Latin subsetting — an 89% reduction."
- JetBrains Mono: "reduced from 300 KB to 45 KB (6x smaller) when stripped of unused character sets."
- Browser support 2026: "All major browsers (Chrome 124+, Firefox 130+, Safari 18+, Edge 124+) fully support variable fonts with no meaningful holdouts."
- "Google Fonts now serves variable fonts by default."
- Install: `pip install fonttools[woff]` (requires Python 3.10+); add `brotli` for WOFF2 compression, `zopfli` for WOFF.
- Typical pipeline flags: `--unicodes` for character ranges, `--flavor=woff2` for output format, `--layout-features` to control OpenType features.
- "Modern CSS properties like `font-palette`, `font-variant-emoji`, `size-adjust`, and `font-synthesis-weight` work alongside variable fonts to optimize performance further."

## Annotations for stinger-forge

- This is the primary source for `guides/03-variable-font-subsetting.md`. The size reduction numbers (89%, 6x) are persuasive benchmarks to include in the guide's motivation section.
- The canonical install command `pip install fonttools[woff]` plus the three flag patterns (`--unicodes`, `--flavor=woff2`, `--layout-features`) form the core CLI recipe.
- The 2026 browser support table confirms the practical elimination of WOFF (non-2) fallback needs. The stinger should recommend WOFF2-only delivery.
- The `unicode-range` CSS descriptor plus subset WOFF2 files is the full pipeline: subset the file → reference it with the correct unicode-range → let the browser download only needed subsets.
- Cross-reference with glyphhanger (zachleat/glyphhanger) which wraps pyftsubset with URL-crawling automation (see separate source note).
