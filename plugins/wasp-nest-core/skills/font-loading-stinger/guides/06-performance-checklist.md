# 06 - Font Performance Checklist (2026)

Use this guide to audit an existing font setup or verify a new implementation before shipping.

---

## 2026 Performance Targets

| Metric | Target | Critical threshold |
|---|---|---|
| Font payload per family (after subsetting) | < 50 kB | > 100 kB = investigate |
| Total font payload (all families combined) | < 120 kB | > 200 kB = optimize |
| Number of preload hints | ≤ 3 | > 3 = priority inversion risk |
| CLS contribution from fonts | 0.0 | > 0.05 = fix immediately |
| Number of font requests on first load | ≤ 3 | > 5 = audit critically |
| FOIT on slow connection (Fast 3G) | None | Any = fix font-display |
| Double-fetch of same font file | None | Any = fix crossorigin |

---

## Section 1: font-display audit

- [ ] Every `@font-face` rule has an explicit `font-display` declaration
- [ ] No `@font-face` rule uses `font-display: auto` or omits the property
- [ ] No `@font-face` rule uses `font-display: block` for body text or headings
- [ ] Body text uses `font-display: optional` or `font-display: swap` + metric-matched fallback
- [ ] Heading fonts that are LCP elements use `font-display: swap` + metric-matched fallback
- [ ] All `@font-face` rules for the same font family use the same `font-display` value

**How to check:** Open DevTools → Elements → `<head>` → look for `<style>` tags or linked CSS containing `@font-face`. Use the CSS Computed tab to verify `font-display` for any element rendering web fonts.

---

## Section 2: preload audit

- [ ] Critical fonts (above-the-fold text, LCP) have `<link rel="preload" as="font">` hints
- [ ] All preload hints include `crossorigin="anonymous"` attribute
- [ ] All preload hints include `type="font/woff2"` attribute
- [ ] Total preload hints for fonts: ≤ 3
- [ ] No duplicate preload hints for the same font file
- [ ] No preload hints for below-the-fold or non-critical fonts

**How to check:** Open DevTools → Network → filter by "Font". Verify each font has a single request initiated by the preload (Priority: Highest, Initiator: `<link>`). If a font appears twice, the `crossorigin` attribute is missing.

---

## Section 3: font payload audit

- [ ] All self-hosted fonts are WOFF2 format (not TTF, OTF, or WOFF)
- [ ] Variable fonts are subsetted to the required character ranges
- [ ] Self-hosted font files are ≤ 50 kB per file after subsetting
- [ ] Font files are served with `Cache-Control: public, max-age=31536000, immutable` headers
- [ ] `unicode-range` descriptors are present on `@font-face` rules when multiple subsets are needed

**How to check:** DevTools → Network → filter "Font" → check Size column. Sort by Size descending. Any file over 80 kB for a Latin-only subset needs investigation.

---

## Section 4: CLS audit

- [ ] CLS from fonts is 0.0 (verified in DevTools Performance panel or CrUX)
- [ ] All `font-display: swap` declarations are paired with metric-matched `@font-face` fallbacks
- [ ] Chrome DevTools Layout Shift Clusters shows no font-caused shifts
- [ ] Verified on slow network (Fast 3G throttling) to ensure swap timing is realistic

**How to check:** DevTools → Lighthouse → run with throttling enabled → check CLS score. OR: Performance recording → filter for Layout Shift events → check "Sources" panel for font-caused shifts.

---

## Section 5: next/font project checklist (Next.js projects only)

- [ ] Fonts are declared via `next/font/google` or `next/font/local`, not manual `<link>` tags
- [ ] Font declarations are in `app/fonts.ts` (or root layout), not inside individual components
- [ ] Font variables are applied to `<html>` tag in root layout via `className`
- [ ] `display` option is specified explicitly (not relying on default `'swap'`)
- [ ] `subsets` array includes only the required character sets (e.g., `['latin']`)
- [ ] `preload: true` for above-the-fold fonts (default; verify it's not overridden to `false`)
- [ ] `fallback` array is specified with appropriate system fonts
- [ ] `adjustFontFallback` is set for `next/font/local` fonts (triggers metric-override generation)
- [ ] Generated CSS in browser contains `size-adjust` on fallback `@font-face` (verify in DevTools)

---

## Section 6: double-fetch detection

A double-fetch occurs when the browser initiates a font request twice: once without CORS headers (preload) and once with CORS headers (`@font-face`). The two requests are different and the preload is wasted.

**How to detect:**

1. DevTools → Network → filter "Font"
2. Look for the same font filename appearing twice
3. Check the Initiator column: one should be `<link rel="preload">` and one should be the stylesheet

**Fix:** Add `crossorigin="anonymous"` to the preload `<link>` tag (see `guides/02-preload-strategy.md`).

---

## Section 7: FOIT / FOUT spot-check

To trigger and observe font loading behavior on a warm cache:

1. DevTools → Network → check "Disable cache"
2. DevTools → Network → Throttling: Fast 3G
3. Reload and observe text rendering:
   - Invisible text during load = FOIT (fix: change `font-display` to `swap`, `optional`, or `fallback`)
   - Visible text that shifts = FOUT + CLS (fix: metric-matched fallback)
   - Correct text, no shift = correct behavior

---

## References

- All preceding guides in this Stinger
- `examples/happy-path-nextjs-inter.md`: reference implementation that passes this checklist
- `examples/edge-case-self-hosted-variable.md`: self-hosted implementation that passes this checklist
- `research/external/`: web.dev font best practices, Chrome DevTools font rendering, CLS spec
