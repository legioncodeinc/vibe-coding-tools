---
source_url: https://font-converters.com/news/font-subsetting-60-percent-smaller
retrieved_on: 2026-05-20
source_type: blog
authority: practitioner
relevance: high
topic: subsetting
stinger: font-loading-stinger
---

# Font Subsetting Now Cuts File Sizes 60-75%: Here's the Data (2026)

## Summary
Data-driven 2026 article quantifying font subsetting impact with concrete
file-size statistics. Explains the four-step subsetting process (identify
characters, remove glyphs, rebuild tables, compress to WOFF2). Covers
unicode-range CSS descriptor mechanics, multi-script splitting, Google Fonts
automatic CJK subsetting, and production subset CLI example. Published
February 2026.

## Key quotations / statistics

- "A full Latin font contains 600+ glyphs. English content needs ~100.
  Removing unused glyphs, plus associated kerning data, reduces file size by
  **60-75%** with no visible quality difference."

- CLI example (WOFF2, basic Latin):
  ```bash
  pyftsubset font.ttf \
    --unicodes="U+0000-00FF" \
    --layout-features="*" \
    --flavor=woff2
  ```

- Unicode range usage guide:
  - English-only site: `U+0000-007F` → 65%+ reduction. One `@font-face`, no
    `unicode-range` needed.
  - Western European: `U+0000-00FF`. Add `U+0100-024F` for Polish, Czech, Romanian.
  - Multi-script: split into per-script subsets with `unicode-range`.

- CSS multi-subset example:
  ```css
  @font-face {
    src: url('/fonts/myfont-latin.woff2') format('woff2');
    font-display: swap;
    unicode-range: U+0000-007F;
  }
  @font-face {
    src: url('/fonts/myfont-latin-ext.woff2') format('woff2');
    unicode-range: U+0080-024F, U+1E00-1EFF;
  }
  ```

- "When browsers encounter `@font-face` with `unicode-range`, it inspects the
  characters on the page. If none of those characters fall within the declared
  range, the font file is never downloaded."

- Warning: "Always include the `--layout-features="*"` flag (pyftsubset) to
  preserve OpenType features for retained glyphs. Without it, ligatures like
  'fi' and 'fl' and kerning between retained characters may be stripped."

## Annotations for stinger-forge

- The 60-75% reduction statistic is the headline figure for
  `guides/03-variable-font-subsetting.md` introduction and
  `guides/06-performance-checklist.md`.
- The four-step process (identify, remove, rebuild, compress) is the basis for
  the guide's workflow section.
- The per-language unicode range table (English/Western European/multi-script)
  is production-ready content for the guide.
- The multi-subset CSS example with `unicode-range` is the template for
  `templates/font-face-block.md`.
- Published February 2026, current data.
