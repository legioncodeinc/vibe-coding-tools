# 00 - Principles: FOIT, FOUT, FOFT, and the font-display Period Model

## The three failure modes

Before prescribing a remedy, classify the symptom. The three failure modes are distinct and have different fixes.

### FOIT: Flash of Invisible Text

The browser hides text until the web font arrives. Users see a blank where content should be. LCP is delayed because the text paint is blocked. Caused by `font-display: block` (default in most browsers before this descriptor existed) or when no `font-display` is specified and the browser defaults to a block period.

**Symptom:** Content exists in the DOM but is not visible. The page appears to have white gaps or missing sections during load.

**Fix:** Use `font-display: swap`, `fallback`, or `optional`. Never use `block` for body text.

### FOUT: Flash of Unstyled Text

The browser renders text immediately in a fallback (system) font, then swaps in the web font when it arrives. The swap causes a reflow: the fallback metrics differ from the web font metrics, shifting surrounding content. This reflow is the primary cause of CLS from fonts.

**Symptom:** Text is visible immediately but jumps or shifts layout when the web font loads. CLS score is elevated. Identifiable in Chrome DevTools Layout Shift attribution as "font swap."

**Fix:** Use `font-display: optional` (eliminates the swap entirely on slow connections) or use `swap` + metric-matched fallback overrides (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) to make the reflow invisible.

### FOFT: Flash of Faux Text

The browser synthesizes bold or italic variants (using CSS transforms) before the actual bold/italic web font files arrive. Synthesized bold looks heavier; synthesized italic looks slanted. The visual quality is poor and distracting.

**Symptom:** Headings or emphasized text looks wrong (too bold, or oblique instead of true italic) during load. FOFT only occurs when multiple weights or styles of the same family are loaded as separate font files.

**Fix:** Use variable fonts to serve the entire weight axis in a single file. If variable fonts are not available, load the critical weights first and defer supplementary ones.

---

## The font-display period model

Every `font-display` value defines three periods for the browser:

| Period | Description |
|---|---|
| **Block period** | Browser blocks rendering for up to N ms. Text is invisible (FOIT). |
| **Swap period** | If the font hasn't arrived, the browser swaps in a fallback. Text is visible. |
| **Failure period** | If the font hasn't arrived by end of swap period, the browser abandons it for this page load. |

Period lengths per `font-display` value (see `guides/01-font-display-decision-matrix.md` for the decision logic):

| Value | Block period | Swap period |
|---|---|---|
| `auto` | Browser-default (usually ~3s) | Browser-default |
| `block` | Short (~3s) | Infinite |
| `swap` | Extremely short (~0ms) | Infinite |
| `fallback` | Extremely short (~100ms) | Short (~3s) |
| `optional` | Extremely short (~100ms) | None (0s) |

**Key insight for 2026:** `font-display: swap` has an infinite swap period, meaning the font can still arrive 30 seconds later and cause a layout shift. This is why `swap` alone is not safe for CLS: you must pair it with metric-matched fallback overrides (see `guides/05-cls-elimination.md`).

---

## Browser defaults (2026)

When no `font-display` is specified in `@font-face`, browsers apply their own defaults:

- **Chrome/Edge:** `font-display: auto` → effectively 3s block, then swap (equivalent to `block` behavior)
- **Firefox:** `font-display: auto` → 3s block, then swap
- **Safari:** Longest FOIT period of the three; can block up to 3s then fall back

**Conclusion:** Never rely on browser defaults. Always declare `font-display` explicitly on every `@font-face` rule. Cross-browser behaviour is undefined without it.

---

## The CLS → font-swap consequence chain

```
font-display: swap (infinite swap period)
  → web font arrives late
    → browser reflows text with new metrics
      → surrounding elements shift
        → CLS score increases
          → Core Web Vitals "Needs improvement" or "Poor"
```

The only two escape paths are:

1. **`font-display: optional`**: eliminates the swap entirely; font is used only if it loads before the block period ends. Zero CLS, but first-load may render system font permanently on slow connections.

2. **`font-display: swap` + metric-matched fallback**: the swap happens but the visual delta is zero because the fallback font is configured to match the web font's metrics exactly. See `guides/05-cls-elimination.md`.

---

## When to read this guide

- Before diagnosing any FOIT/FOUT/FOFT complaint
- Before recommending any `font-display` value
- As the conceptual foundation for `guides/01-font-display-decision-matrix.md` and `guides/05-cls-elimination.md`

*Cites: `research/external/`: FOIT/FOUT/FOFT sources, MDN font-display spec, web.dev font best practices*
