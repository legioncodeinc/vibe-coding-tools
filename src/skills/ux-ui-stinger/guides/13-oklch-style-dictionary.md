# 13 — OKLCH color tokens + Style Dictionary multi-platform export

The product's master tokens already use OKLCH (see `guides/02-token-and-utility-enforcement.md` line 11–12 examples and `research/2026-04-24-tailwind-v4-theme-tokens.md`). This guide explains **why** OKLCH is the picking space, **how** to do it well (gamut, contrast, dark-mode), and how to ship the same tokens to non-CSS surfaces (iOS, Android, React Native, Figma) via **Style Dictionary**.

The Angel reviews against this guide whenever:

- A new color token is proposed for `01-master-tokens.css`.
- A request comes in for non-web export (mobile app, Figma sync, marketing-site brand snippet).
- A PR introduces an inline `oklch(...)` / `rgb(...)` / `hsl(...)` / hex literal in feature code (these violate `guides/02-token-and-utility-enforcement.md` regardless of color space).

Sources:

- Style Dictionary docs <https://styledictionary.com/> and repo <https://github.com/style-dictionary/style-dictionary>.
- W3C Design Tokens Format Module 2025.10 (DTCG) — referenced indirectly via Style Dictionary v5 + tooling.
- OKLCH-palette repo <https://github.com/graemegeorge/oklch-palette> (Aug 2025) — perceptual scale generation.
- `research/2026-04-25-oklch-style-dictionary.md` (this Stinger's research note).

---

## Why OKLCH is the picking space

### Perceptual uniformity

OKLCH's lightness axis (`L`) is **perceptually uniform** — equal numeric steps in `L` look like equal steps in apparent brightness. HSL is not: `hsl(60, 100%, 50%)` (yellow) looks dramatically brighter than `hsl(240, 100%, 50%)` (blue) even though both are "50% lightness." Human vision disagrees with HSL math.

Practical consequences for a token system:

- **Color scales (50, 100, 200, …, 900) have predictable contrast progression.** OKLCH lightness step = perceptual step. A 12-step scale with `L` running from ~99 to ~25 produces visually even gradations regardless of hue.
- **Theme-aware tokens (light + dark) can swap by remapping `L` while holding `C` and `H`.** A semantic `--color-text` of `oklch(0.20 0.02 250)` in light flips to `oklch(0.95 0.02 250)` in dark with the hue/chroma intact.
- **Contrast ratios are easier to hit.** APCA-style contrast tooling correlates well with OKLCH `L` deltas.

### P3 wide gamut

Modern displays (most laptops since ~2020, all iPhones since X, most external monitors past ~$400) render the **Display P3** gamut, which is roughly 25% wider than sRGB. OKLCH is gamut-agnostic — the same `oklch(L C H)` literal renders P3 colors when the browser supports `display-p3` and falls back to sRGB on legacy displays.

What the Angel checks for:

1. The token layer **emits `oklch()` strings as the primary value** (so modern browsers get the wider gamut "for free").
2. There is a **gamut-clamping fallback**: when a token's chroma exceeds sRGB at a given `L` and `H`, the build pipeline maps it to the nearest displayable sRGB hex for older browsers. Style Dictionary + the `culori` library handles this — see "Build pipeline" below.
3. Optional: explicit P3 overrides under `@supports (color: color(display-p3 1 1 1))` + `@media (color-gamut: p3)` for cases where the difference between sRGB-clamped and P3 matters (e.g., a brand red that looks dull when clamped). Most products don't need this layer.

### What OKLCH is NOT good for

- **Memorizing values from memory.** Designers don't read OKLCH the way they read hex. The token *name* (`--color-brand`, `--color-success-9`) is the human-facing API — the OKLCH literal lives in one place (`01-master-tokens.css`) and is consumed by name.
- **Accessibility judgement.** OKLCH lightness correlates with perceived contrast but is not a contrast-ratio computation. Run `--color-text` against `--color-background` through APCA / WCAG contrast tools at definition time, not at use time.

---

## How to author an OKLCH color scale (12-step pattern)

This is the canonical pattern. The product can deviate, but if it deviates the deviation is documented in `01-master-tokens.css` first.

```css
/* primitive scale — keep H constant, sweep L on a smooth curve, adapt C */
@theme {
  --brand-1:  oklch(0.985 0.01  55);   /* near-white tint, low chroma */
  --brand-2:  oklch(0.95  0.02  55);
  --brand-3:  oklch(0.90  0.04  55);
  --brand-4:  oklch(0.83  0.08  55);
  --brand-5:  oklch(0.74  0.14  55);
  --brand-6:  oklch(0.66  0.18  55);
  --brand-7:  oklch(0.58  0.20  55);   /* primary surface */
  --brand-8:  oklch(0.50  0.18  55);   /* primary ink */
  --brand-9:  oklch(0.42  0.16  55);
  --brand-10: oklch(0.34  0.13  55);
  --brand-11: oklch(0.26  0.10  55);
  --brand-12: oklch(0.20  0.07  55);   /* near-black, low chroma */
}
```

Notes:

- `H` (hue) is constant — that's how the scale stays "the same color" at every step.
- `L` walks a smooth curve from ~0.985 to ~0.20. The OKLCH-palette repo recommends a sigmoid rather than a linear ramp to avoid over-bright highlights and dull midtones.
- `C` (chroma) is **trimmed at the extremes** (steps 1–3 and 10–12) and **boosted in the middle** (steps 5–8). This is the perceptual-tweak that distinguishes a hand-tuned scale from a naive linear sweep.
- For a dark-mode counterpart, **invert the `L` sweep** (~0.14 → ~0.93) while holding `H` and adjusting `C` only at the extremes. The `H` carries the brand identity through both modes.

### Tooling that does this for you

- **<https://oklch.com>** — interactive OKLCH picker that previews P3 vs. sRGB clamping live.
- **<https://huetone.ardov.me/>** — chromaticity-controlled scale generation.
- **`@graemegeorge/oklch-palette`** (`npm i oklch-palette`) — `makePalette(seed, { steps: 12, mode: 'both', gamut: 'srgb' })` returns the L/C/H sweep + light/dark variants. Use it once at design-system bootstrap, then commit the literal scale.

---

## Style Dictionary — multi-platform export

When the product targets only the web, the OKLCH literals in `01-master-tokens.css` are sufficient. When the product targets **iOS / Android / React Native / Figma / a marketing site running on a different framework / brand snippets in third-party email tools**, the same tokens must reach those surfaces. **Style Dictionary** is the tooling pattern.

### What Style Dictionary does

A Style Dictionary takes design tokens defined in JSON (or DTCG-format `.tokens.json`) and exports them, via per-platform formatters, to:

- CSS custom properties (the web target — what `01-master-tokens.css` already is).
- Sass / Less variables.
- iOS Swift / `UIColor` extensions.
- Android XML `colors.xml`.
- React Native `theme.ts`.
- Tailwind preset / config.
- JSON / TypeScript objects for documentation tools.
- Figma Variables (via plugin or DTCG-aware sync).

### Recommended pipeline shape

```
tokens/
├── primitives/
│   ├── color.tokens.json        (DTCG-format, OKLCH source values)
│   ├── space.tokens.json
│   ├── radius.tokens.json
│   └── duration.tokens.json
├── semantic/
│   ├── light.tokens.json        ($extends primitives)
│   └── dark.tokens.json         ($extends primitives, mode: dark)
└── components/
    └── button.tokens.json       (composes semantic)

build/
├── web/
│   ├── variables.css            (light)
│   ├── variables.dark.css       (dark)
│   └── tailwind.preset.js
├── ios/
│   ├── Colors.swift
│   └── Colors+P3.swift          (P3 overrides where supported)
├── android/
│   └── colors.xml
└── react-native/
    └── theme.ts
```

Source-of-truth JSON, Style Dictionary builds, every platform consumes from `build/`.

### Key Style Dictionary v5 conventions (as of 2026)

- **DTCG 2025.10 format**: `$value` and `$type` keys, sRGB color objects (`{ "colorSpace": "srgb", "components": [r, g, b] }`) or string `oklch(L C H)`. Tooling like `style-dictionary-dlite` <https://github.com/hopetambala/style-dictionary-dlite> demonstrates the pattern.
- **`$extends` for theme inheritance**: `semantic/light.tokens.json` extends `primitives/color.tokens.json`; `semantic/dark.tokens.json` does the same with `$extensions.mode = "dark"` overrides.
- **Custom transforms**: `value/dtcg-color` converts a DTCG sRGB color object → CSS `oklch(...)` literal for web, → hex literal for iOS, → `@color/...` ref for Android XML.
- **Per-brand tier prefix**: `name/brand-tier-kebab` produces `--brand-primitive-blue-7` style names so multi-brand systems don't collide.

### Gamut handling at build time

`culori` (used internally by many Style Dictionary OKLCH transforms) handles two clamping levels:

1. **Mathematical clamping (`clampOklch`)** — keeps `L`, `C`, `H` in valid ranges; prevents NaN propagation.
2. **Gamut clamping** — at hex export time, an out-of-sRGB-gamut OKLCH gets mapped to the nearest displayable sRGB value. CSS users keep the `oklch()` string, so modern P3 displays still get the wider color; iOS / Android targets get the safe sRGB hex.

For projects that need explicit P3 export to web, emit a second CSS file under `@supports (color: color(display-p3 1 1 1))` with the unclamped `oklch()` values; the cascade handles fallback.

### When Style Dictionary is overkill

- **Single-platform products** (web only, no native, no marketing-site framework split) — keep `01-master-tokens.css` as the source of truth and skip the build step. Adding Style Dictionary adds maintenance burden without benefit.
- **Tiny token sets** (≤30 tokens, no multi-mode) — JSON-to-CSS hand-export is fine.

The Angel does NOT push Style Dictionary on a product that doesn't have a multi-platform need. It surfaces the option when:

- The user mentions an iOS / Android / React Native target.
- The user mentions Figma Variables sync.
- The user has more than two front-end surfaces (e.g., main app + marketing site + admin tool) on different frameworks.

---

## What the Angel reviews against this guide

For new color tokens:

- **Picking space:** the new color is added in OKLCH form to `01-master-tokens.css`, with named scale steps if a scale is needed (not a one-off literal).
- **Gamut behavior documented:** if the new color's chroma exceeds sRGB at its target `L`/`H`, note this in the token comment. Flag whether a P3 override is required.
- **Contrast checked at definition time:** the new color is run against the relevant pair (`--color-text` on it, or it on `--color-background`) through an APCA or WCAG contrast tool. Result is recorded in the token comment.
- **No inline literals in feature code:** any `oklch(...)`, `hsl(...)`, `rgb(...)`, `hsla(...)`, `rgba(...)`, or hex value in `src/app/**` or `src/components/**` is a violation per `guides/02-token-and-utility-enforcement.md`.

For multi-platform requests:

- **Source-of-truth JSON exists** under `tokens/` — not regenerated from CSS.
- **Style Dictionary config is committed** — `style-dictionary.config.cjs` or equivalent.
- **Build artifacts are generated, not hand-edited** — the Angel rejects PRs that hand-edit `build/ios/Colors.swift`.
- **The CI runs `style-dictionary build`** and fails the build if `build/` is dirty (a token changed but the artifact didn't).

---

## Cross-references

- `guides/02-token-and-utility-enforcement.md` — the no-inline-color rule that this guide reinforces.
- `guides/04-shadcn-ui-integration.md` — Tailwind v4 `@theme` directive that consumes these tokens.
- `research/2026-04-24-tailwind-v4-theme-tokens.md` — why `@theme` plays well with OKLCH literals.
- `research/2026-04-25-oklch-style-dictionary.md` — research note backing this guide.

---

*Cited sources:* Style Dictionary docs (<https://styledictionary.com/info/tokens/>), Style Dictionary repo (<https://github.com/style-dictionary/style-dictionary/>), `oklch-palette` (<https://github.com/graemegeorge/oklch-palette>), `style-dictionary-dlite` (<https://github.com/hopetambala/style-dictionary-dlite>), Sveltopia colors architecture commit (perceptual-uniformity rationale, <https://github.com/sveltopia/colors/commit/525979ea23d4804455978a322e1fa73c53c2a3da>), and the user-uploaded research doc (`cursor-subagent-research-combined.md`, "UX & UI Best Practices" section).
