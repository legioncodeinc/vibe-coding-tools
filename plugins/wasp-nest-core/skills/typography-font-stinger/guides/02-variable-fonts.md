# Variable Fonts: Configuration and Subsetting

*Sources: `research/external/2026-05-20-variable-fonts-production.md`, `research/external/2026-05-20-variable-font-subsetting.md`, `research/external/2026-05-20-fontsource-manual-fontface.md`*

---

## What are variable fonts?

Variable fonts encode multiple design variants (weights, widths, optical sizes) in a single file using design axes. This means one file replaces what used to be separate Regular, Bold, Italic, etc. files.

**Common axes:**

| Axis tag | Name | Range example |
|----------|------|---------------|
| `wght` | Weight | 100 to 900 |
| `ital` | Italic | 0 (upright) to 1 (italic) |
| `wdth` | Width | 75 (condensed) to 125 (expanded) |
| `opsz` | Optical size | 8 to 144 |
| `GRAD` | Grade | -50 to 150 (custom, capital = proprietary) |

Axes starting with lowercase are registered (standard); axes starting with uppercase are custom/proprietary.

---

## @font-face declaration for variable fonts

```css
/* Variable font with weight axis */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable-latin.woff2') format('woff2');
  font-weight: 100 900;       /* declare the full range, not a single weight */
  font-style: normal;
  font-display: optional;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* latin subset */
}

/* Variable font with italic axis (separate file or combined) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable-italic-latin.woff2') format('woff2');
  font-weight: 100 900;
  font-style: italic;
  font-display: optional;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
```

**Critical: declare `font-weight: <min> <max>` (range), not `font-weight: 400`.** A single-value declaration disables the weight axis interpolation.

---

## @supports fallback for non-variable-font browsers

Although variable font support is now ~97% globally (Baseline Widely Available), you may need a fallback for legacy environments:

```css
/* Fallback for browsers without variable font support */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@supports (font-variation-settings: normal) {
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-variable-latin.woff2') format('woff2');
    font-weight: 100 900;
    font-style: normal;
    font-display: optional;
  }
}
```

**Source:** `research/external/2026-05-20-variable-fonts-production.md`

---

## font-variation-settings vs. shorthand

Prefer shorthand properties (`font-weight`, `font-style`) over `font-variation-settings` where possible:

```css
/* PREFERRED - uses standard properties, cascades correctly */
h1 { font-weight: 700; }

/* ONLY when axis has no standard shorthand */
.display { font-variation-settings: 'GRAD' 100, 'opsz' 32; }
```

`font-variation-settings` does not cascade partially: if you set two axes in a rule and then override in a child, you must repeat all axes. See `research/external/2026-05-20-variable-fonts-production.md` for the cascade pitfall detail.

---

## Subsetting variable fonts (critical for performance)

**The problem:** A full variable font like Inter contains glyphs for hundreds of Unicode ranges. The full file is 300-800 kB. A Latin-only subset used by most Western projects is 20-60 kB.

**The solution:** Subset using `pyftsubset` from the `fonttools` Python library.

### Installation

```bash
pip install fonttools brotli
```

### Latin subset command

```bash
pyftsubset \
  Inter[wght].ttf \
  --output-file=inter-variable-latin.woff2 \
  --flavor=woff2 \
  --layout-features='kern,liga,calt,ccmp' \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

**Result:** Inter goes from ~300 kB to ~35 kB. Source: `research/external/2026-05-20-variable-font-subsetting.md` (Botmonster, April 2026).

### CI integration pattern

Add to your build pipeline (GitHub Actions, Vercel build step, or npm prebuild script):

```yaml
# .github/workflows/fonts.yml
- name: Subset fonts
  run: |
    pip install fonttools brotli
    pyftsubset source-fonts/Inter[wght].ttf \
      --output-file=public/fonts/inter-variable-latin.woff2 \
      --flavor=woff2 \
      --layout-features='kern,liga,calt' \
      --unicodes="U+0000-00FF,U+0131,U+0152-0153"
```

### size-adjust fallback matching (eliminate CLS on swap)

After subsetting, add metric overrides to the system-font fallback to match the variable font's dimensions. This eliminates CLS when the font swaps in:

```css
@font-face {
  font-family: 'Inter-Fallback';
  src: local('Arial');
  size-adjust: 107%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: 'Inter', 'Inter-Fallback', system-ui, sans-serif;
}
```

The override values are font-specific. Use https://deploy-preview-27205--next-site.netlify.app/font-metrics to generate them for your font, or derive them from font metrics in `pyftsubset --verbose` output.

**Source:** `research/external/2026-05-20-foit-fout-font-display.md`
