# Font Performance Checklist

*Sources: `research/external/2026-05-20-font-performance-preload.md`, `research/external/2026-05-20-web-dev-font-best-practices.md`, `research/external/2026-05-20-foit-fout-font-display.md`*

---

## The 2026 font performance targets

From `research/external/2026-05-20-font-performance-preload.md` (WebPerf Clinic, February 2026):

| Metric | Target |
|--------|--------|
| Total font payload | Under 50 KB (after subsetting + WOFF2) |
| Font requests on critical path | No more than 1-2 |
| Font-related CLS | Zero (via `size-adjust` + metric matching) |
| Cache-Control header | `public, max-age=31536000, immutable` |
| Font load start | Before First Contentful Paint |

---

## Audit checklist

Work through this list in order. Each section links to the relevant guide.

### 1. Format and compression

- [ ] All font files are WOFF2 format. No WOFF, TTF, or OTF on production.
- [ ] Variable fonts are used where the typeface supports them (one file replaces 4-6 static weight files).
- [ ] Font files are subsetted to Unicode ranges in use. Latin-only subset for English/Western European projects.
- [ ] Total font payload is under 50 KB after subsetting. Measure in Chrome DevTools > Network > Font.

**Tools:** `pyftsubset` (Python fonttools), `glyphhanger`, or `next/font`'s automatic build-time subsetting.

---

### 2. font-display

- [ ] Every `@font-face` rule has an explicit `font-display` declaration.
- [ ] Body text uses `font-display: optional` (+ preload) or `font-display: swap` (+ `size-adjust`).
- [ ] Icon fonts use `font-display: block` or have been replaced with SVG icons.
- [ ] `font-display: auto` is not in use anywhere.

See `guides/00-principles.md` for the full decision matrix.

---

### 3. Preloading

- [ ] At most 1-2 font files are preloaded (over-preloading delays other critical resources).
- [ ] Only the font file(s) used above the fold are preloaded.
- [ ] Preload `<link>` tags include `crossorigin` attribute. Omitting this causes a double download.
- [ ] Preload `href` exactly matches the `src` URL in the `@font-face` rule (including path and filename).
- [ ] Only WOFF2 format is preloaded (do not preload legacy formats).

**Correct preload syntax:**
```html
<link
  rel="preload"
  href="/fonts/inter-latin-variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

**Common mistake:** using `crossorigin="anonymous"` vs. bare `crossorigin` - both work, but bare `crossorigin` is canonical.

---

### 4. CLS from font swapping

- [ ] If using `font-display: swap`, the fallback font has matching metrics via `size-adjust` + override descriptors.
- [ ] If using `next/font`, confirm that the auto-generated fallback metrics are applied (`next/font` does this automatically).
- [ ] Run Lighthouse > CLS audit and verify font-related layout shifts are under 0.1.

**Metric matching pattern:**
```css
@font-face {
  font-family: "Inter Fallback";
  src: local("Arial");
  size-adjust:      107%;
  ascent-override:   90%;
  descent-override:  22%;
  line-gap-override:  0%;
}

body {
  font-family: "Inter", "Inter Fallback", Arial, sans-serif;
}
```

---

### 5. No render-blocking requests

- [ ] No `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` in `<head>`. This is synchronously render-blocking.
- [ ] If using Google Fonts directly (not `next/font`), DNS prefetch `fonts.googleapis.com` and preconnect to `fonts.gstatic.com`.
- [ ] Custom fonts are served from the same origin as the page (or a CDN with preconnect).

**Acceptable Google Fonts loading (without next/font):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap">
```

**Preferred:** Use `next/font` which eliminates the CDN request entirely.

---

### 6. Caching

- [ ] Font files are served with long-lived cache headers: `Cache-Control: public, max-age=31536000, immutable`.
- [ ] Font file URLs include a content hash for cache busting (handled automatically by `next/font` and most build tools).
- [ ] Fonts hosted on your own CDN have a cache hit rate above 95% for returning users (verify in CDN analytics).

---

### 7. Coverage audit (Chrome DevTools)

Use Chrome DevTools to find unused glyph ranges in loaded fonts:

1. Open DevTools > Coverage panel (Ctrl+Shift+P > "Show Coverage")
2. Reload the page
3. Click the font files in the Coverage results
4. View unused byte percentage - high unused% indicates over-wide subset or wrong font variant loaded

Target: under 20% unused bytes in loaded font files.

---

### 8. LCP font impact

- [ ] Run Lighthouse and verify font load is not on the LCP critical path.
- [ ] If Lighthouse flags "Eliminate render-blocking resources" for a font file, add a preload hint for that file.
- [ ] If LCP element contains custom font text, ensure that font file is preloaded.

**Checking in DevTools:**
- Performance tab > Record > expand "Timings" row
- Find "LCP" marker
- Check if font load start is before LCP render start

---

## Quick-run audit command (Lighthouse CLI)

```bash
npx lighthouse https://your-site.com \
  --output=json \
  --quiet \
  --chrome-flags="--headless" \
  | node -e "
    const r = JSON.parse(require('fs').readFileSync('/dev/stdin'));
    const audits = ['render-blocking-resources','uses-text-compression','font-display'];
    audits.forEach(a => {
      const audit = r.lhResult?.audits?.[a];
      if (audit) console.log(audit.id, audit.score, audit.displayValue || '');
    })
  "
```

---

## next/font automatic optimizations

`next/font` handles items 2, 3, 4, and 5 automatically at build time. For Next.js App Router projects, verify that `next/font` is in use before running the manual checklist above - most items will already be passing.

See `guides/01-hosting-strategy.md` and `examples/happy-path-nextjs-font.md` for the full `next/font` setup pattern.
