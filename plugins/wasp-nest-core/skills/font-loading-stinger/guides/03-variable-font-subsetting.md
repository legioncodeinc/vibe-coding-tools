# 03 - Variable Font Subsetting Pipeline

## Why subsetting is mandatory

An unsubsetted variable font file includes every glyph in the font's character set: Latin, Greek, Cyrillic, Vietnamese, math symbols, currency symbols, arrows, and more. For Inter (a common production font), the full variable font is approximately 300-800 kB. For English-only web products, 95%+ of those glyphs will never be rendered.

A properly subsetted Latin + Basic Latin variable font is typically 20-60 kB: an 80-95% reduction.

**Always subset before recommending self-hosting.** If a user is self-hosting an unsubsetted variable font, flag it as a critical performance issue.

---

## Tool selection

| Tool | Best for | Requires | Output |
|---|---|---|---|
| `pyftsubset` (fonttools) | Local font files; full control | Python; local font file | Subsetted WOFF2 |
| `glyphhanger` | URL-based crawl; auto-detects used glyphs | Node.js; network access | Subsetted WOFF2 |
| `subfont` | Automated multi-font projects; zero config | Node.js | Inlined `@font-face` |
| Online tools (FontSquirrel, Transfonter) | Quick one-off; no CLI required | Browser only | WOFF2 + CSS |

**Recommendation for 2026:** Use `pyftsubset` for production pipelines (maximum control, repeatable, CI-friendly). Use `glyphhanger` when you want automatic glyph detection from a live URL. Use `subfont` for automated pipelines where you want zero config.

---

## `pyftsubset`: the production tool

### Installation

```bash
pip install fonttools brotli
```

`brotli` is required for WOFF2 output.

### Basic Latin subset command

```bash
pyftsubset input-font.ttf \
  --output-file="output-font-latin.woff2" \
  --flavor=woff2 \
  --layout-features="*" \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
              U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

**Key flags:**

| Flag | Purpose |
|---|---|
| `--flavor=woff2` | Output WOFF2 format (required for web) |
| `--layout-features="*"` | Preserve all OpenType features (ligatures, kerning, etc.) |
| `--unicodes="..."` | The character ranges to include |

**For variable fonts (preserving axes):**

```bash
pyftsubset input-font-variable.ttf \
  --output-file="output-font-variable-latin.woff2" \
  --flavor=woff2 \
  --layout-features="*" \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
              U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --retain-gids
```

**Important:** Do NOT use `--axes="wght"` alone without specifying the full range. Instead, let the default axis range be preserved by simply not restricting it. The `--retain-gids` flag is required for some variable fonts to maintain proper glyph metrics.

### Checking the output

```bash
# Verify the subsetted file is significantly smaller
ls -lh output-font-variable-latin.woff2

# Verify axes are preserved in the variable font
python3 -c "from fontTools.ttLib import TTFont; f=TTFont('output-font-variable-latin.woff2'); print([a.axisTag for a in f['fvar'].axes])"
```

---

## `glyphhanger`: URL-based auto-detection

`glyphhanger` crawls a URL, detects all characters actually used on the page, and produces a subsetted font with only those glyphs.

```bash
npm install --global glyphhanger

# Subset by crawling a URL
glyphhanger https://example.com \
  --formats=woff2 \
  --subset=input-font.ttf
```

**Use case:** When you want to ensure maximum subsetting for a specific page's actual character usage (no wasted glyphs). Less suitable for sites with dynamic content (e.g., user-generated text in foreign scripts).

---

## `subfont`: zero-config automation

`subfont` analyzes your HTML, finds font references, downloads and subsets them, and replaces the `@font-face` with self-hosted references.

```bash
npm install --global subfont

subfont --recursive --in-place --output dist/ dist/index.html
```

**Use case:** Drop-in automation for build pipelines. Handles multiple fonts and pages without manual configuration.

---

## Unicode-range splitting

For fonts used across multiple scripts, split into separate `@font-face` declarations with `unicode-range`. The browser only downloads the file whose range matches the characters on the page.

```css
/* Latin subset — downloaded for English content */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable-latin.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: optional;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                 U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                 U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Latin Extended — only downloaded if these glyphs appear on the page */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable-latin-ext.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: optional;
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
                 U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
```

Google Fonts does this automatically when you embed via their CDN. When self-hosting, you need to replicate this split. The `pyftsubset` approach above produces one file per range: repeat the command with different `--unicodes` values.

---

## Axis preservation: the critical check

When subsetting a variable font, verify that the `wght` (weight) axis range is preserved:

```bash
python3 -c "
from fontTools.ttLib import TTFont
f = TTFont('inter-variable-latin.woff2')
for axis in f['fvar'].axes:
    print(f'{axis.axisTag}: {axis.minValue} - {axis.maxValue} (default: {axis.defaultValue})')
"
```

Expected output for Inter: `wght: 100 - 900 (default: 400)`

If the axis range is missing or collapsed, the variable font will not animate weight correctly. Re-run the subset command with `--retain-gids`.

---

## File size targets (2026)

| Scope | Target size |
|---|---|
| Basic Latin subset (variable font) | 20-50 kB |
| Latin + Latin Extended (variable) | 40-80 kB |
| Latin + Greek + Cyrillic (variable) | 80-150 kB |
| Unsubsetted variable font (full glyph set) | 300-800 kB |

If a self-hosted font file is larger than 80 kB after subsetting for Latin-only content, investigate whether the subsetting worked correctly.

---

## References

- `guides/01-font-display-decision-matrix.md`: `font-display` values to use in the `@font-face` rules produced by subsetting
- `guides/06-performance-checklist.md`: file size targets and subsetting verification steps
- `examples/edge-case-self-hosted-variable.md`: full pipeline: pyftsubset + @font-face + metric-matched fallback
- `research/external/`: variable font subsetting sources, fonttools documentation
