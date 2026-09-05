# Principles: FOIT, FOUT, FOFT, and font-display

*Sources: `research/external/2026-05-20-foit-fout-font-display.md`, `research/external/2026-05-20-mdn-font-display.md`, `research/external/2026-05-20-web-dev-font-best-practices.md`*

---

## The three loading problems

When a browser encounters text before the custom font is available, it exhibits one of three behaviours. Understanding which one you have is prerequisite to fixing it.

### FOIT - Flash of Invisible Text

**What:** Text is invisible (zero opacity) for the duration of the font's block period. The user sees blank space where text should be.

**When it happens:** `font-display: block` or the browser default (equivalent to `block`). Block period is typically 3 seconds in modern browsers.

**Fix:** Use any other `font-display` value. FOIT is almost never desirable in production.

### FOUT - Flash of Unstyled Text

**What:** Text renders in the fallback (system) font first, then swaps to the custom font when it loads. Users see a visible relayout/repaint - a "flash."

**When it happens:** `font-display: swap`. Infinite swap period; the browser shows fallback text indefinitely until the custom font loads or fails.

**Fix for CLS from swap:** Use `size-adjust`, `ascent-override`, `descent-override`, and `line-gap-override` in the fallback `@font-face` declaration to match the custom font's metrics. This eliminates layout shift while still showing text. See `research/external/2026-05-20-foit-fout-font-display.md` for the CSS pattern.

### FOFT - Flash of Faux Text

**What:** The browser synthesizes a faux bold or faux italic from the regular weight when the bold/italic variant is not yet loaded. Faux bold looks noticeably different from true bold.

**When it happens:** When a font is loaded in multiple weights but only the regular weight is present at render time, and `font-synthesis: weight` is not disabled.

**Fix:** Either preload the critical weights (bold for headings, regular for body), or disable synthesis with `font-synthesis: none` and accept FOUT for those weights.

---

## The font-display decision matrix

`font-display` has five values. The MDN spec (Baseline Widely Available) defines three periods for each: block period (invisible text), swap period (fallback text), and failure period (no font loading attempt).

| Value | Block period | Swap period | Best for |
|-------|-------------|-------------|----------|
| `auto` | Browser-determined (usually 3s) | Usually infinite | Avoid: unpredictable |
| `block` | 3 seconds | Infinite | Icon fonts where FOUT would break icon rendering |
| `swap` | Very short (100ms) | Infinite | Body text where readability > zero CLS |
| `fallback` | Very short (100ms) | 3 seconds | Balanced: shows text quickly, does not swap late |
| `optional` | Very short (100ms) | None | Performance-first: uses font only if cached; no swap |

**Opinionated defaults for 2026 (from `research/external/2026-05-20-web-dev-font-best-practices.md`):**

- **Body text:** `font-display: optional` + preload. Best for LCP and CLS. Users on slow connections see the system font; returning users see the custom font from cache. This is the `next/font` default.
- **Heading/display text:** `font-display: swap` + `size-adjust` override on the fallback. Ensures text is always visible; the swap is tolerated if metric-matched.
- **Icon fonts:** `font-display: block` with a very short custom block period, or switch to SVG icons.

> **Open question (Q3 from research):** Does your project prioritize brand consistency (use `swap`) or Core Web Vitals (use `optional`)? The stinger defaults to `optional` + preload for `next/font` projects and `swap` + `size-adjust` for self-hosted fonts. Override this in the hosting guide for your project type.

---

## The "type system is a design system" thesis

Typography decisions are not isolated CSS choices. They propagate through every component, every screen, and every brand expression in the product. Treating the type scale, font token file, and font-loading strategy as infrastructure (not styling) has three consequences:

1. **Token-first:** Every size, weight, and family reference in component code must route through a CSS custom property. Raw values create drift the worker-bee cannot audit.
2. **Scale-first:** Sizes should be derived from a consistent scale (modular or fluid), not chosen ad-hoc. Ad-hoc sizes proliferate quickly and are never consistent.
3. **Performance-first:** Font loading strategy is a performance engineering decision, not a font picker configuration. Every font added to the stack must justify its payload in measured impact on LCP and FID.

See `guides/05-font-token-layer.md` for the token architecture and `guides/06-performance-checklist.md` for the performance audit loop.
