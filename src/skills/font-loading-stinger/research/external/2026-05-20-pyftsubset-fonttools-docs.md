---
source_url: https://fonttools.readthedocs.io/en/latest/subset/index.html
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: critical
topic: subsetting
stinger: font-loading-stinger
---

# pyftsubset - OpenType font subsetter (fonttools docs)

## Summary
Official documentation for `pyftsubset`, the reference command-line font
subsetter included in the `fonttools` Python library. Accepts TTF, CFF-OTF,
and WOFF inputs. Supports subsetting by glyph IDs, glyph names, text string,
unicode range, or unicode file. Key options include `--layout-features` for
preserving OpenType features, `--flavor=woff2` for WOFF2 output, and
`--prune-unicode-ranges` for updating the OS/2 range bits.

## Key quotations / statistics

- Install: `pip install fonttools` plus `pip install brotli` for `--flavor=woff2`

- Usage: `pyftsubset font-file [glyph...] [--option=value]...`

- Basic Latin + Latin-1 Supplement subset by unicode range:
  ```bash
  pyftsubset example.ttf \
    --unicodes=U+0000-007F,U+00A0-00FF \
    --output-file=subsetted.ttf
  ```

- Subset by text: `pyftsubset example.ttf --text="Hello, World!" --output-file=subsetted.ttf`

- Preserve all OpenType layout features (ligatures, kerning):
  ```bash
  pyftsubset font.ttf \
    --unicodes="U+0020-0025" \
    --layout-features=*
  ```

- Without `--layout-features=*`, ligatures and kerning for retained characters
  may be stripped.

- `--prune-unicode-ranges` (default): updates OS/2 ulUnicodeRange bits after
  subsetting to match the retained codepoints.

- WOFF2 output: `pyftsubset font.ttf --unicodes="U+0000-00FF" --flavor=woff2`

## Annotations for stinger-forge

- This is the **canonical source** for the pyftsubset CLI commands in
  `guides/03-variable-font-subsetting.md`.
- The `--layout-features=*` warning (ligatures stripped without it) is a
  critical gotcha that must appear as a callout in the guide.
- The WOFF2 output flag (`--flavor=woff2`) and its Brotli dependency are
  important for the "production output" step.
- The unicode range examples (U+0000-007F for Basic Latin, U+0000-00FF for
  Latin + Latin-1) map directly to the `unicode-range` CSS descriptor values
  in `guides/03-variable-font-subsetting.md`.
- Template `templates/font-face-block.md` should include the pyftsubset
  command alongside the resulting `@font-face` CSS.
