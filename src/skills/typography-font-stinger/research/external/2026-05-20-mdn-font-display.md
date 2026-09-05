---
source_type: docs
authority: high
relevance: high
topic: font-display semantics and timeline
url: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
retrieved: 2026-05-20
---

# MDN - font-display CSS @font-face descriptor

## Summary

The MDN reference for the `font-display` descriptor defines the exact block/swap/failure period semantics for each of the five values. This is the authoritative specification reference for the FOIT/FOUT tradeoff decision.

## Key quotations / statistics

- "The font-display descriptor for the @font-face at-rule determines how a font face is displayed based on whether and when it is downloaded and ready to use."
- Marked as **Baseline Widely Available** - "well established and works across many devices and browser versions, available across browsers since January 2020."

## The font display timeline (three periods)

1. **Font block period** - If font not loaded, element renders with _invisible fallback_ (FOIT). If font loads during this period, it is used normally.
2. **Font swap period** - If font not loaded, element renders with _visible fallback_. If font loads during swap period, it swaps in (FOUT).
3. **Font failure period** - If font not loaded, browser treats it as failed load and uses normal font fallback permanently for that page load.

## Values and their period durations

| Value | Block Period | Swap Period | Behavior |
|---|---|---|---|
| `auto` | Browser-defined | Browser-defined | Unpredictable across engines |
| `block` | Short (~2-3s) | Infinite | FOIT then permanent swap |
| `swap` | Extremely short | Infinite | Immediate FOUT, always swaps |
| `fallback` | Extremely short (~100ms) | Short (~3s) | Brief FOIT, limited swap window |
| `optional` | Extremely short | None | No swap - uses fallback if font misses ~100ms window |

## Formal syntax

```css
font-display: auto | block | swap | fallback | optional;
```

## Example

```css
@font-face {
  font-family: "ExampleFont";
  src: url("/path/to/fonts/example-font.woff2") format("woff2");
  font-weight: normal;
  font-style: normal;
  font-display: fallback;
}
```

## Annotations for stinger-forge

- This is the specification anchor for `guides/00-principles.md` - all font-display explanations should cite this reference.
- The three-period model (block, swap, failure) is the conceptual framework that stinger-forge should use to explain FOIT vs FOUT to developers.
- `optional` has no swap period - it is the only value that guarantees zero CLS from font loading. This makes it the optimal choice when paired with preloading.
- Firefox allows configuration of period durations via `gfx.downloadable_fonts.fallback_delay` prefs - note as an edge case.
- The "Baseline Widely Available" marker confirms `font-display` can be used in production without polyfills.
