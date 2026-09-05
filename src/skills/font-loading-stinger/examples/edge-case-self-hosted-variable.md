# Example: Self-Hosted Variable Font with pyftsubset + Metric-Matched Fallback

**Scenario:** A project uses a paid/licensed variable font that cannot be served from Google Fonts or Fontsource. It must be self-hosted. The font is 450 kB unsubsetted and the product serves English-only content.

**Result:** 42 kB WOFF2, zero CLS, correct preload, works in any framework (not Next.js-specific).

---

## Step 1: Subset the font with pyftsubset

### Install fonttools

```bash
pip install fonttools brotli
```

### Run subsetting command

```bash
pyftsubset BrandFont-Variable.ttf \
  --output-file="brand-font-variable-latin.woff2" \
  --flavor=woff2 \
  --layout-features="*" \
  --retain-gids \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,\
              U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

### Verify output

```bash
ls -lh brand-font-variable-latin.woff2
# Target: < 50 kB (450 kB → 42 kB is typical for Latin subset)

python3 -c "
from fontTools.ttLib import TTFont
f = TTFont('brand-font-variable-latin.woff2')
for axis in f['fvar'].axes:
    print(f'{axis.axisTag}: {axis.minValue}-{axis.maxValue} default:{axis.defaultValue}')
"
# Expected: wght: 100-900 default:400
```

Move the output file to your project's public font directory:

```bash
mv brand-font-variable-latin.woff2 public/fonts/
```

---

## Step 2: Calculate metric-matched fallback values with fontpie

```bash
npm install --global fontpie

fontpie public/fonts/brand-font-variable-latin.woff2 \
  --name "Brand Font" \
  --style normal \
  --weight 400
```

Example output:

```
Fallback font:  Arial
size-adjust:    101.2%
ascent-override:  93%
descent-override: 24%
line-gap-override: 0%
```

---

## Step 3: Write the `@font-face` rules

```css
/* styles/fonts.css */

/* Web font */
@font-face {
  font-family: 'Brand Font';
  src: url('/fonts/brand-font-variable-latin.woff2') format('woff2-variations');
  font-weight: 100 900;       /* Variable weight range */
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                 U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                 U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* Metric-matched fallback — uses Arial with Brand Font's metrics */
@font-face {
  font-family: 'Brand Font Fallback';
  src: local('Arial');
  size-adjust: 101.2%;
  ascent-override: 93%;
  descent-override: 24%;
  line-gap-override: 0%;
}
```

---

## Step 4: Add preload hint to `<head>`

```html
<head>
  <link
    rel="preload"
    href="/fonts/brand-font-variable-latin.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
</head>
```

---

## Step 5: Apply the font stack

```css
/* styles/globals.css */
body {
  font-family: 'Brand Font', 'Brand Font Fallback', Arial, sans-serif;
  /*
   * 1. 'Brand Font' — web font (loads after initial render)
   * 2. 'Brand Font Fallback' — Arial with metric overrides (renders immediately)
   * 3. Arial — plain fallback without overrides (last resort)
   * 4. sans-serif — system sans-serif (absolute fallback)
   */
}
```

The browser renders in `Brand Font Fallback` (metric-matched Arial) until `Brand Font` loads. The swap is visually invisible because the metrics are identical.

---

## Step 6: Verify zero CLS in Chrome DevTools

1. Open DevTools → Performance
2. Record with **Fast 3G** throttling and **Disable cache**
3. Look at the **Layout Shift** track
4. Expand any Layout Shift events and check Sources
5. No font-caused layout shifts should appear

Also run Lighthouse (Fast 3G preset):
- CLS score: 0.0
- Avoid invisible text: Pass
- Preload key requests: Pass (font preload detected)

---

## File size before vs after

| Stage | File size |
|---|---|
| Original `.ttf` (unsubsetted) | 450 kB |
| After `pyftsubset` (Latin WOFF2) | ~42 kB |
| Reduction | ~91% |

---

## For Next.js projects using `next/font/local`

If you move this to a Next.js project, replace the manual `@font-face` + preload with:

```typescript
// app/fonts.ts
import localFont from 'next/font/local';

export const brandFont = localFont({
  src: '../public/fonts/brand-font-variable-latin.woff2',
  display: 'swap',
  variable: '--font-brand',
  fallback: ['Arial', 'sans-serif'],
  adjustFontFallback: 'Arial',  // next/font generates metric overrides automatically
  weight: '100 900',
});
```

The subsetting in Step 1 still applies. `next/font/local` does not subset local font files.

---

## Guides referenced by this example

- `guides/03-variable-font-subsetting.md`: pyftsubset commands and axis verification
- `guides/05-cls-elimination.md`: fontpie and metric-matched fallback technique
- `guides/02-preload-strategy.md`: preload markup with crossorigin
- `guides/01-font-display-decision-matrix.md`: why swap + metric-matched fallback for heading fonts
- `guides/06-performance-checklist.md`: verification steps
