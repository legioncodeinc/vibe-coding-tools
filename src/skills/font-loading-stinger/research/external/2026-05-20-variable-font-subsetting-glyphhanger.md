---
source_url: https://github.com/zachleat/glyphhanger/
retrieved_on: 2026-05-20
source_type: github-readme
authority: official
relevance: critical
topic: subsetting
stinger: font-loading-stinger
---

# glyphhanger - web font utility belt (GitHub)

## Summary
Official README for glyphhanger by Zach Leatherman. Covers subsetting web
fonts by crawling URLs to detect character usage, generating unicode-ranges
automatically, and producing TTF/WOFF/WOFF2 subsets via `pyftsubset`. Requires
`fonttools` as a prerequisite. Supports whitelist characters, Latin shortcut,
US-ASCII shortcut, and CSS output with `@font-face` blocks.

## Key quotations / statistics

- Install command: `npm install -g glyphhanger`

- Prerequisite: `pip install fonttools` (plus `brotli` for WOFF2, `zopfli` for
  compressed WOFF)

- Subset output example:
  ```
  glyphhanger --subset=*.ttf
  # LatoLatin-Regular.ttf: 145.06 KB → 70.25 KB (TTF)
  # → 36.51 KB (WOFF with zopfli)
  # → 28.73 KB (WOFF2)
  ```

- Subset to a URL: `glyphhanger ./test.html --subset=*.ttf`
  Result: `145.06 KB → 24 KB (TTF), 11.37 KB (WOFF2)`

- With CSS output: `glyphhanger https://example.com --subset=*.ttf --css`
  Writes a CSS file with `@font-face` blocks and `unicode-range` descriptors.

- Latin shortcut: `glyphhanger https://google.com --LATIN`

- US-ASCII shortcut: `glyphhanger https://google.com --US_ASCII`

- Manual subset workflow via pyftsubset:
  ```bash
  glyphhanger ./test.html > glyphhanger_output
  pyftsubset FONTFILENAME.ttf --unicodes-file=glyphhanger_output --flavor=woff2
  ```

## Annotations for stinger-forge

- This is the **primary source** for the "URL crawl approach" section in
  `guides/03-variable-font-subsetting.md`.
- The three-step manual workflow (crawl → unicode file → pyftsubset) should be
  presented as the "automation path" alongside the direct pyftsubset approach.
- The WOFF2 size reduction (145 KB → 11 KB from a URL crawl) is a compelling
  statistic for the stinger's introduction.
- Note that glyphhanger generates the unicode-range descriptor automatically
  with `--css`: this bridges to the `unicode-range` guide section.
- Flag: glyphhanger may be somewhat older tooling; `subfont` is a more
  modern alternative for automated build pipelines. Both should be covered.
