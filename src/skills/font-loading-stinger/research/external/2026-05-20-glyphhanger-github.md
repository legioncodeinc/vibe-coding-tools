---
url: https://github.com/zachleat/glyphhanger/
fetched: 2026-05-20
source_type: official-docs
authority: medium
relevance: high
topic: subsetting
---

# glyphhanger: zachleat/glyphhanger (GitHub)

## Summary

Glyphhanger is Zach Leatherman's web font subsetting utility that wraps `pyftsubset`. It automatically detects unicode ranges used on websites (by crawling URLs) and subsets fonts accordingly. It generates TTF, WOFF, and WOFF2 format outputs. The tool requires `pyftsubset` as a prerequisite. It can be run against a list of URLs or against local HTML files, making it ideal for automated build-time subsetting pipelines.

## Key quotations / statistics

- Requires `pyftsubset` as a prerequisite: "You'll need `pyftsubset` installed."
- Can generate TTF, WOFF, and WOFF2 formats.
- URL-based crawling: Detects which unicode characters are actually used on a page, then subsets the font to only those characters.
- "glyphhanger is a web font utility that wraps pyftsubset, automatically detecting unicode-ranges used on websites and subsetting fonts accordingly."

## Annotations for stinger-forge

- Glyphhanger is the tool to recommend when: (a) the developer wants to automate subset generation from actual page content, or (b) the developer doesn't know in advance which characters they need. For known Latin-only use cases, pyftsubset directly is simpler.
- The URL-crawl approach is powerful but has a limitation: it only subsets for characters found at crawl time. Dynamic content not rendered at crawl time may be missing glyphs.
- `subfont` (Munter/subfont) is an alternative that integrates into build tools and is more suitable for static site generators. The stinger should present glyphhanger and subfont as complementary tools.
- The three-tool recommendation for `guides/03-variable-font-subsetting.md`: pyftsubset (manual/scripted), glyphhanger (URL-crawl automation), subfont (build-tool integration).
- Note: glyphhanger is maintained by Zach Leatherman (Eleventy author), giving it practitioner authority in the web performance community.
