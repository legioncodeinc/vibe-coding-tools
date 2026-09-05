# Liquid Glass (macOS / iOS 26+): raw research dump

> **Source:** EXA search, 2026-06-30. Apple's Liquid Glass design language
> (introduced WWDC 2025, refined through iOS 26 / macOS Tahoe / iOS 27 "Golden
> Gate") and how the web community recreates it in CSS.
> **Why kept:** the decision owner wants the shadcn-svelte reverse brand guide
> elevated to a polished, soft, glass-forward aesthetic in the macOS/iOS mold:
> thin/no bezels, soft fluid surfaces, comfortable. This dump is the source for
> the techniques layered onto OSPRY's existing `--glass-*` token system.

## What Liquid Glass actually is (Apple's framing)

- A "digital meta-material" that **refracts** (bends light) and **adapts** to
  the content beneath, not just frosts it. (Apple newsroom; WWDC25 session 219)
- Composed of three layers working together: **highlight** (light casting +
  movement), **shadow** (depth/separation), **illumination** (the material's
  flexible properties). (CSS-Tricks; WWDC25)
- Two variants: **Regular** (default, legible anywhere, adaptive) and **Clear**
  (more transparent, no adaptive behavior, REQUIRES a dimming layer for
  legibility, only use when content underneath is rich). (WWDC25)
- Intended for **navigation and controls**, NOT everywhere. Apple explicitly
  forbids glass-on-glass stacking (causes blur artifacts, conflicting lighting,
  muddy colors). (wolfnhare; CSS-Tricks)
- Honors `prefers-reduced-transparency` (frostier), `prefers-increased-contrast`
  (black/white + contrast border), `prefers-reduced-motion` (no elastic/shimmer).

## The 2026 web consensus on how to build it

### The "frosted glass" base (works everywhere, 97%+ browser support)

The foundation is `backdrop-filter: blur() saturate()`: this is frosted glass,
not true refraction, but it's the performant baseline Apple's own guidelines say
to use for "bulk UI glass." (Ken Sorrell; dev.to/kevinbism; Lucky Graphics)

```css
.glass {
  position: relative;
  background: rgba(255, 255, 255, 0.10);
  backdrop-filter: blur(8px) saturate(180%) brightness(1.1);
  -webkit-backdrop-filter: blur(8px) saturate(180%) brightness(1.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 1rem;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.55),
    inset 0 -1px 1px rgba(255, 255, 255, 0.30);
}
```

Key knobs (consensus values from multiple sources):

| Knob | Recommended range | Why |
|---|---|---|
| `blur` | **8-16px** for controls; up to 24px for nav bars | Above 25px hurts mobile FPS (dev.to/wahab_shahg) |
| `saturate` | **150-200%** (180% is the Apple-ish sweet spot) | Without it the blur looks washed-out grey |
| Background opacity | **0.08-0.18** | Above 30% loses the glass look |
| Border alpha | **0.10-0.25** | The edge highlight; too high reads as a bezel |

### The specular sheen (the "lit pane" feel)

A `::after` pseudo-element with a diagonal gradient in `mix-blend-mode: screen`
makes the surface read as glossy, not flat:

```css
.glass::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: linear-gradient(135deg,
    rgba(255,255,255,0.45),
    rgba(255,255,255,0.08) 40%,
    transparent 58%);
  mix-blend-mode: screen;
}
```
(webtricks.dev)

### The convex "lit bezel" (4 inset shadows)

Apple's signature: a bright edge just inside the rounded border, asymmetric so
the glass reads as convex (top highlight brighter than bottom shadow):

```css
box-shadow:
  inset 0 0 0 1px rgba(255, 255, 255, 0.06),     /* 1px ring */
  inset 0 0 6px 0 rgba(255, 255, 255, 0.04),     /* feathered glow */
  inset 0 2px 4px -2px rgba(255, 255, 255, 0.18), /* top specular */
  inset 0 -2px 4px -2px rgba(0, 0, 0, 0.25);     /* bottom shadow */
```

The top:bottom opacity ratio of ~1 : 1.4 is what makes it read as **convex**.
Invert for concave; equal for flat. (sohumsuthar/liquid-glass)

### Refraction (the real "liquid" part, Chromium-only, opt-in)

True refraction (background warps at the edges) needs an SVG `feDisplacementMap`
filter fed by `feTurbulence`. **Only Chromium ships this for `backdrop-filter`;
Safari and Firefox ignore it.** Gate behind `@supports`:

```css
@supports (backdrop-filter: url(#liquid)) {
  .liquid-glass { backdrop-filter: blur(2px) url(#liquid); }
}
```

Reserve the full refraction treatment for **one or two signature interactive
elements**: it's expensive. Use plain `backdrop-filter` for bulk UI.
(Ken Sorrell; webtricks.dev)

## Performance and accessibility rules (load-bearing)

- **Cap concurrent glass panels at ~3.** Every `backdrop-filter` forces a GPU
  screen-buffer copy + kernel blur + paste. 50 of them crashes mobile browsers.
  (Lucky Graphics)
- **Lower blur + higher saturation > high blur.** 8-16px blur with 180%+ saturate
  is cheaper and looks better than 32px blur.
- **`prefers-reduced-transparency`** → fall back to solid opaque backgrounds.
- **`prefers-reduced-motion`** → disable hover/active elastic/shimmer.
- **`prefers-increased-contrast`** → near-black/white fills + contrast border.
- **Never stack glass on glass.** Apple forbids it; it causes visual noise and
  muddy colors. Use spacing/shadows/elevation for depth instead.
- **Legibility is the hard part.** Apple adjusted Liquid Glass transparency
  multiple times during iOS 26 beta after legibility complaints. Dimming layers
  under text/icons on Clear variant are mandatory, not optional.

## How this maps to OSPRY's existing tokens (the key finding)

OSPRY's `tokens.css` ALREADY defines a complete glass system; this is not a
build-from-scratch, it's an elevation:

| Existing OSPRY token | Liquid Glass role |
|---|---|
| `--glass-bg: rgba(28,31,38,0.55)` | The translucent dark fill (Regular variant) |
| `--glass-bg-strong` / `--glass-bg-faint` | Strong (nav bars) / faint (subtle surfaces) |
| `--glass-blur: 22px` | A touch high vs the 8-16px consensus; consider 16px for controls, keep 22px for panels |
| `--glass-border: rgba(255,255,255,0.10)` | The thin/no-bezel edge highlight (already thin) |
| `--glass-hairline: rgba(255,255,255,0.07)` | Even subtler edge |
| `--glass-sheen` (gradient) | The specular sheen: already present, needs the diagonal/mix-blend treatment |
| `--glass-tint` (radial) | The localized color wash |
| `--glass-shadow` (3-layer) | Depth: already a good multi-layer shadow |
| `--glass-edge-blue/violet/orange/green` | The intentional accent edges (one per meaningful surface) |
| `--glass-blur` already wired into `.panel`/`.glass-card` with `saturate(150%)` | The frosted base: bump saturate toward 180% |
| `@media reduced-transparency` fallback already exists (base.css:1678) | Accessibility honored |

**The opportunity:** the reverse brand guide currently renders shadcn-svelte
primitives as flat opaque surfaces. Elevating it means:
1. Making the Card surface a glass surface (`--glass-bg` + blur + sheen).
2. Adding the convex "lit bezel" (4 inset shadows) to Cards and inputs.
3. Using the diagonal specular sheen on primary surfaces.
4. Bumping `saturate(150%)` → `saturate(180%)` for the vivid Studio-display quality.
5. Keeping buttons mostly opaque (Apple keeps controls more solid for legibility) but adding a subtle sheen.
6. A hero aurora background so the glass has something interesting to refract.

Sources:
- https://developer.apple.com/videos/play/wwdc2025/219/ (Meet Liquid Glass)
- https://developer.apple.com/videos/play/wwdc2025/323/ (Build a SwiftUI app with the new design)
- https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/
- https://css-tricks.com/getting-clarity-on-apples-liquid-glass/
- https://www.sorrell.info/blog/liquid-glass-lens-effect
- https://dev.to/kevinbism/recreating-apples-liquid-glass-effect-with-pure-css-3gpl
- https://webtricks.dev/blog/liquid-glass-css
- https://github.com/sohumsuthar/liquid-glass
- https://github.com/Tontoon7/liquidglass-tailwind
- https://wolfnhare.com/design-tokens-for-liquid-glass-color-blur-and-lighting-parameters-on-apple
- https://lucky.graphics/learn/liquid-glass-css-glassmorphism-tutorial/
- https://dev.to/wahab_shahg/how-i-built-a-css-glassmorphism-generator-and-what-i-learned-about-backdrop-filter-3h5j
- https://www.joshwcomeau.com/css/backdrop-filter/
