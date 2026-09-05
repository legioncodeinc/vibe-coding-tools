---
source_type: blog
authority: high
relevance: high
topic: variable font subsetting with pyftsubset
url: https://botmonster.com/posts/variable-fonts-subsetting-web-performance/
retrieved: 2026-05-20
---

# Botmonster - Web Font Subsetting: Cut Payload 90% with Variable Fonts (April 2026)

## Summary

A detailed 2026 production guide for subsetting variable fonts using `pyftsubset` (from the `fonttools` Python library) to reduce payload from 300 kB to under 40 kB while keeping full weight and italic axis support. Includes CI integration via GitHub Actions.

## Key quotations / statistics

- "By subsetting a variable font with pyftsubset to include only the Unicode ranges and OpenType features your site actually needs, you can reduce web font payload by 70-85%."
- "A typical setup drops a 300 KB variable font to under 40 KB while keeping full weight and italic axis support for every glyph you actually use."
- "Variable fonts have gone from experimental to the default choice for most web projects. All major browsers - Chrome 124+, Firefox 130+, Safari 18+, Edge 124+ - fully support variable fonts."
- After optimization: "A single subsetted variable Inter file at 35 KB in one HTTP request, with CLS of 0.00-0.02 using size-adjust and font-display: swap. That is a 90% reduction in font payload and near-zero layout shift."
- "For font-display, use swap for body text. For decorative or non-essential fonts, optional prevents any layout shift at the cost of sometimes not showing the web font at all on slow connections."

## The subsetting process

1. **Install pyftsubset** from `fonttools` Python package: `pip install fonttools brotli`
2. **Run subsetting**:
```bash
pyftsubset inter-variable.ttf \
  --output-file=inter-variable-latin.woff2 \
  --flavor=woff2 \
  --layout-features=kern,liga,calt \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```
3. **Use `unicode-range` CSS descriptor** to tell browser when to download the subset.
4. **Preload the primary subset** (Latin only) - don't preload Cyrillic/Greek subsets as that defeats the purpose.

## CSS with size-adjust fallback to eliminate CLS

```css
/* Fallback font with matched metrics */
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-latin.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153...;
}

body {
  font-family: "Inter", "Inter Fallback", Arial, sans-serif;
}
```

## GitHub Actions CI integration

```yaml
- name: Subset fonts
  run: |
    pip install fonttools brotli
    pyftsubset fonts/inter-variable.ttf \
      --output-file=public/fonts/inter-latin.woff2 \
      --flavor=woff2 \
      --unicodes="U+0000-00FF..."
```

## Budget enforcement in CI

```bash
# Fail build if subsetted font exceeds 50KB
SIZE=$(wc -c < public/fonts/inter-latin.woff2)
if [ $SIZE -gt 51200 ]; then
  echo "Font file exceeds 50KB budget: ${SIZE} bytes"
  exit 1
fi
```

## Alternative tool: glyphhanger

For more aggressive optimization, `glyphhanger` (by Zach Leatherman) scans built HTML files to find exactly which Unicode characters appear, enabling perfectly tailored subsets.

## Annotations for stinger-forge

- Critical source for `guides/06-performance-checklist.md` and `guides/01-hosting-strategy.md` (self-hosting section).
- The `size-adjust` + `ascent-override` + `descent-override` pattern for fallback metric matching is the 2026 recommended approach for eliminating CLS with `font-display: swap`. Include this as a template.
- The target byte budgets (35 kB Latin subset, <50 kB total) should be used as benchmarks in the performance checklist.
- Note the boundary with `devops-stinger`: this guide specifies WHAT to subset; the CI integration step is the `devops-stinger` boundary.
- `pyftsubset` is the canonical tool, but `glyphhanger` is worth mentioning for advanced per-page optimization.
