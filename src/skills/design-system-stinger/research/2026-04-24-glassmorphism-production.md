# Glassmorphism in Production: Performance, Fallbacks, Accessibility

**Sources:**
- https://pixcode.io/en/blog/css-glassmorphism-2025/ (2025-07-14)
- https://nineproo.com/blog/css-glassmorphism-guide/ (2026-02-07)
- https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- https://developer.apple.com/design/human-interface-guidelines/materials
- https://medium.com/@shashidj206/liquid-glass-in-ios-part-3-depth-light-refraction-7d01f0d653e8 (2026-04-07)
- https://www.liquid-glass.org/

**Retrieved:** 2026-04-24

## Summary

`backdrop-filter` (and `-webkit-backdrop-filter`) is at ~96% global browser
support (2025). Production-quality glass requires:

1. **Three cues, not one.** Apple's iOS Liquid Glass and the
   `glass-on-beige` starter kit compose **top-edge highlight + direct
   shadow + ambient shadow**. Backdrop blur alone looks flat.
2. **Blur radius ≤ 20px for most uses.** Above 30px the background becomes
   noise, performance drops. Reference uses 20px on pinned nav shells only.
3. **`@supports` fallback.** Older Chromium/enterprise environments still
   fail. Always ship an opaque fallback:
   ```css
   @supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
     .glass-surface { background-color: var(--color-card); }
   }
   ```
4. **Never animate `backdrop-filter`.** The blur kernel recomputes per-frame
   at O(radius^2) cost. Animate `opacity` or `background` alpha instead.
5. **Don't stack.** Each overlapping glass layer multiplies the blur cost.
   One glass card on top of a glass nav shell on top of a glass modal = 3x
   GPU cost. Designate which layer carries the glass.
6. **Touch/text legibility.** Glass must not reduce text contrast below 4.5:1.
   The solution (used by Apple HIG, reference system) is: keep backgrounds
   near-opaque (90-94% card color), reserve the blur for the *rim*.

## Apple HIG / Liquid Glass (2025-2026)

iOS 26, iPadOS 26, macOS Tahoe 26, and visionOS converge on "Liquid Glass":
semi-transparent material with real-time refraction, adaptive colorization,
and explicit depth layering. Core properties Apple calls out:

- **Depth.** Separation from background is load-bearing: flat glass reads
  as flat.
- **Light interaction.** Top-edge highlight + ambient rim simulate light
  hitting the glass.
- **Content-aware colorization.** Glass tints toward the content beneath.

The `glass-on-beige` starter kit captures all three in CSS via
`--color-top-edge-light`, `color-mix()`-tinted shadows, and backdrop-filter
on pinned surfaces only.

## Relevance to this stinger

- `guides/04-authoring-utility-layer.md` teaches the three-cue recipe
  verbatim and mandates the `@supports` fallback block.
- `starter-kits/glass-on-beige/` uses the reference implementation as its
  seed.
- The Bee should refuse to ship a "glass" aesthetic that uses backdrop
  blur alone: missing top-edge highlight = not glass.
- Performance budget: ≤ 2 blurred glass surfaces visible simultaneously on
  mobile. `guides/04-authoring-utility-layer.md` documents this.
