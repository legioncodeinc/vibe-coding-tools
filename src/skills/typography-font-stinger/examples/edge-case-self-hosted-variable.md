# Edge Case: Self-Hosted Variable Font with Manual Subsetting

This example covers the full manual pipeline for self-hosting a variable font outside of `next/font`: useful when the typeface is a paid/licensed font not available on Google Fonts, or when the project is not Next.js.

---

## When to use this path

| Condition | Use this path |
|-----------|---------------|
| Paid/licensed font (Graphik, Söhne, GT Walsheim, etc.) | Yes |
| Non-Next.js project (Astro, SvelteKit, Vite SPA, etc.) | Yes |
| Need full control over subset ranges | Yes |
| Google Fonts typeface + Next.js project | No - use `next/font/google` (see happy-path example) |
| Google Fonts typeface + non-Next.js project | Consider Fontsource (`npm install @fontsource/inter`) |

---

## Prerequisites

Install Python fonttools for subsetting:

```bash
pip install fonttools brotli zopfli
```

---

## Step 1: Subset the variable font

Start with the purchased variable font in TTF or OTF format. Subset to Latin Unicode range only:

```bash
# Subset the variable font to Latin characters with glyph sets
pyftsubset "MyFont-Variable.ttf" \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD" \
  --layout-features="kern,liga,calt,sups,sinf,c2sc,smcp" \
  --flavor=woff2 \
  --with-zopfli \
  --output-file="public/fonts/myfont-variable-latin.woff2"
```

**Key flags:**
- `--flavor=woff2` - output WOFF2 (required for production)
- `--with-zopfli` - better compression than brotli for most fonts
- `--layout-features` - preserve OpenType features (kerning, ligatures, etc.)
- `--unicodes` - the Latin Unicode range; add other ranges for multilingual support

**Size expectations:**
- Before subsetting: 200-800 KB (variable font has all language data)
- After Latin subsetting: 20-60 KB

---

## Step 2: Author the @font-face rule

```css
/* public/fonts/fonts.css OR globals.css */

/* Fallback for browsers without variable font support (97%+ have it, but belt-and-suspenders) */
@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont-regular-latin.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

/* Variable font enhancement */
@supports (font-variation-settings: normal) {
  @font-face {
    font-family: "MyFont";
    src: url("/fonts/myfont-variable-latin.woff2") format("woff2");
    font-weight: 100 900;      /* Full weight range */
    font-style: normal;
    font-display: optional;    /* Best for LCP - no FOIT, no swap for late loads */
    unicode-range:
      U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
      U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
      U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
}
```

---

## Step 3: Add metric-matched fallback to eliminate CLS

When `font-display: swap` is needed (instead of `optional`), prevent CLS by matching the fallback font's metrics to the variable font. Use the `local()` system font as the swap target.

To find the right adjustment values for your specific font, use the [Font Style Matcher](https://meowni.ca/font-style-matcher/) tool or measure manually in DevTools.

```css
/* Metric-matched fallback for zero-CLS swapping */
@font-face {
  font-family: "MyFont Fallback";
  src: local("Arial");               /* Use a system font */
  size-adjust:      107%;            /* Adjust to match MyFont's x-height */
  ascent-override:  88%;
  descent-override: 22%;
  line-gap-override: 0%;
}

body {
  font-family: "MyFont", "MyFont Fallback", Arial, system-ui, sans-serif;
}
```

---

## Step 4: Preload the above-fold font file

```html
<!-- In <head>, before render-blocking CSS -->
<link
  rel="preload"
  href="/fonts/myfont-variable-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

**Critical:** The `crossorigin` attribute is mandatory - without it, the preloaded resource is discarded and the font is fetched again, doubling the request.

---

## Step 5: Verify in Chrome DevTools

1. **Network tab > Font:** confirm `myfont-variable-latin.woff2` loads once (no double request from missing `crossorigin`).
2. **Coverage tab:** reload page; click the font file; check unused% is under 20%.
3. **Performance tab:** confirm font load starts before LCP element renders.
4. **Elements > Computed > font-family:** verify the variable font is the active family (not the fallback).

---

## Step 6: Wire to the token layer

After setting up `@font-face`, reference the family name in `tokens/typography.css`:

```css
:root {
  --font-family-body:    "MyFont", "MyFont Fallback", Arial, system-ui, sans-serif;
  --font-family-heading: "MyFont", "MyFont Fallback", Arial, system-ui, sans-serif;
}
```

Never reference `"MyFont"` directly in component CSS - always go through the token.

---

## Cache-Control for self-hosted fonts

Ensure your server (Next.js, Nginx, Caddy, or CDN) sends long-lived cache headers for font files:

```
Cache-Control: public, max-age=31536000, immutable
```

For Next.js, add to `next.config.ts`:

```typescript
// next.config.ts
export default {
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```
