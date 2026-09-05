# 01 - font-display Decision Matrix

## Quick-reference table

| Value | Block period | Swap period | FOIT risk | CLS risk | Use when |
|---|---|---|---|---|---|
| `swap` | ~0ms | Infinite | None | **High** (unless metric-matched) | Body text where immediate visibility is critical and you will implement metric-matched fallbacks |
| `optional` | ~100ms | None | Minimal | **Zero** | Non-critical text; acceptable if first-load users see system font |
| `fallback` | ~100ms | ~3s | Minimal | Low-Medium | Balanced; font is "nice to have" but not critical |
| `block` | ~3s | Infinite | **High** | Medium | Icon fonts only (never body text or headings) |
| `auto` | Browser default | Browser default | Unpredictable | Unpredictable | **Never.** Do not use; it produces undefined cross-browser behavior |

---

## Decision logic (step-by-step)

Work through these questions in order. Stop at the first match.

### Q1: Is this an icon font?

Use `font-display: block`. Icon fonts rely on codepoint-to-glyph mapping; fallback system fonts will render literal letters instead of icons. The FOIT is acceptable because the icon is invisible rather than wrong.

> Exception: If you are using SVG icons or Lucide-style component icons, this question does not apply. Icon fonts are increasingly discouraged; see `guides/06-performance-checklist.md`.

### Q2: Is this font above-the-fold body text or a heading that drives LCP?

Use `font-display: swap` **plus** metric-matched fallback overrides (see `guides/05-cls-elimination.md`).

Rationale: LCP requires visible text. `block` or `fallback` with a 100ms block period delays LCP on slow connections. `swap` with `size-adjust` + `ascent-override` gives you immediate visible text with zero CLS.

Prerequisite: You must implement the metric overrides. Recommending `swap` without the overrides produces CLS.

### Q3: Is this a web font for body copy where first-load CLS is the primary concern?

Use `font-display: optional`.

Rationale: `optional` tells the browser to use the font only if it's available within the block period (~100ms). On first load with a cold cache, most users will see the system font permanently. On repeat visits, the font is cached and served instantly. This is the lowest-CLS, lowest-risk option.

Trade-off: First-load users may see the system font. If brand consistency requires the web font on first load, this is not the right choice.

### Q4: Is this a secondary font (non-critical, supplementary style)?

Use `font-display: fallback`.

Rationale: `fallback` balances visibility (100ms block, then system font) with a short swap window (3s). If the font arrives within 3 seconds, it swaps in. If not, the browser gives up for this page load. Moderate CLS risk (lower than `swap` because the swap window is bounded).

---

## The 2026 recommended defaults by text role

| Text role | Recommended `font-display` | Notes |
|---|---|---|
| Hero heading (LCP element) | `swap` + metric-matched fallback | See `guides/05-cls-elimination.md` |
| Body copy (primary) | `optional` | Accept system font on first cold load |
| Navigation / UI labels | `optional` or `fallback` | Usually short strings; system font acceptable |
| Subheadings | `fallback` | Not LCP-critical; bounded swap window |
| Monospace / code | `swap` + metric-matched fallback | Code blocks look wrong with non-monospace fallback |
| Icon font | `block` | Never use for body text |

---

## Code: canonical `@font-face` with explicit font-display

```css
/* body text — optional strategy */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: optional;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                 U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                 U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* heading font — swap + metric-matched fallback */
@font-face {
  font-family: 'Geist';
  src: url('/fonts/geist-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF;
}

/* metric-matched fallback for heading font — see guides/05-cls-elimination.md */
@font-face {
  font-family: 'Geist-fallback';
  src: local('Arial');
  font-display: swap;
  size-adjust: 99.3%;
  ascent-override: 96%;
  descent-override: 21%;
  line-gap-override: 0%;
}
```

---

## Anti-patterns to flag

- **No `font-display` on any `@font-face` rule**: browser defaults produce FOIT on all major browsers
- **`font-display: block` on body text**: causes multi-second FOIT on slow connections
- **`font-display: swap` without metric-matched fallback**: guaranteed CLS on every page view
- **`font-display: auto`**: undefined cross-browser behavior; treat same as "no declaration"
- **Different `font-display` values for the same font family at different weights**: produces visible swap artifacts as weights arrive at different times

---

## References

- `guides/00-principles.md`: FOIT/FOUT/FOFT definitions and the period model underlying this matrix
- `guides/05-cls-elimination.md`: how to implement metric-matched fallbacks for `swap`
- `research/external/`: MDN font-display spec, web.dev font best practices, Chrome DevTools font rendering
- `examples/happy-path-nextjs-inter.md`: shows `optional` for body + `swap` for headings in practice
