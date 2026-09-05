# Research note — OKLCH color tokens + Style Dictionary multi-platform export

**Date:** 2026-04-25
**Backs guide:** `guides/13-oklch-style-dictionary.md`.

---

## Source A — User-uploaded research doc

`cursor-subagent-research-combined.md`:

- "UX & UI Best Practices" section (~line 188): "Trending 2025–2026 tech: WCAG 2.2 (focus appearance, 24x24 target size, drag alternatives), OKLCH color + theme-aware tokens, Style Dictionary, Stark/axe DevTools/WAVE, …"
- "CSS engines, design tokens, and theming" section (~line 865): "Tailwind v4 + OKLCH tokens is the default; Panda/vanilla-extract give type-safe atomic CSS for larger teams. … Style Dictionary (multi-platform tokens)."

This drove the research pass for guide #13.

---

## Source B — Style Dictionary repo

URL: <https://github.com/style-dictionary/style-dictionary/>
First published: 2016-11; still actively maintained, now at v5 (2026-era).

Confirms positioning:

> A Style Dictionary uses design tokens to define styles once and use those styles on any platform or language. It provides a single place to create and edit your styles, and exports these tokens to all the places you need - iOS, Android, CSS, JS, HTML, sketch files, style documentation, etc.

Confirms: design tokens are atomic key/value pairs with a name, a value, optional metadata. JSON / JavaScript files; static assets allowed.

---

## Source C — Style Dictionary docs (Tokens page)

URL: <https://styledictionary.com/info/tokens/>

Key technical detail:

> A design token is transformed for use in different platforms, languages, and contexts. A simple example is color. A color can be represented in many ways, all of these are the same color: `#ffffff`, `rgb(255,255,255)`, `hsl(0,0,1)`.

Custom parsers allow YAML / TOML token files. Inline tokens or file-based tokens.

---

## Source D — `style-dictionary-dlite` (multi-brand pattern, 2026-03)

URL: <https://github.com/hopetambala/style-dictionary-dlite>

Demonstrates the **W3C Design Tokens Format Module 2025.10 spec + DTCG 2025.10 Color Module (sRGB object format)** with Style Dictionary v5.

Pattern referenced in guide #13:

- **Primitives + Semantic + Global + Brand layers**.
- **Co-located dark-mode values** via `$extensions.mode`.
- **`$extends` for theme inheritance** (deep merge per W3C spec §6.4).
- **Brand-specific theme overrides** layered on top.
- Custom transforms named: `name/brand-tier-kebab`, `value/dtcg-color`, `value/shadow-css`.

---

## Source E — `oklch-palette` (Aug 2025)

URL: <https://github.com/graemegeorge/oklch-palette>

Confirms:

> OKLCH is perceptually uniform, so equal steps look even. This package creates predictable scales for **light** and **dark** themes and emits CSS vars (and a Tailwind preset) you can drop in.

Algorithm shape (referenced in guide):

- Convert seed to OKLCH(L, C, H).
- Hold H nearly constant.
- 12-step L sweep along a smooth curve (light: ~99 → ~25; dark: ~14 → ~93).
- Adapt C to avoid neon highlights and dull midtones (boost very low-chroma seeds slightly; trim C near extremes).
- Clamp into sRGB for safety; still emit `oklch()` strings.

API summary referenced as the recommended seed-to-scale tool.

---

## Source F — Sveltopia/colors architecture commit

URL: <https://github.com/sveltopia/colors/commit/525979ea23d4804455978a322e1fa73c53c2a3da>
Published: 2026-03-08.

Backs the perceptual-uniformity rationale verbatim:

> HSL and RGB are not perceptually uniform — `hsl(60, 100%, 50%)` (yellow) looks dramatically brighter than `hsl(240, 100%, 50%)` (blue), even though both are "50% lightness." Human vision disagrees with the math.

And the gamut-clamping pattern:

> OKLCH can describe colors no screen can display. … The library handles this at two levels:
> - Mathematical clamping (`clampOklch`) — keeps L, C, H in valid ranges (prevents NaN propagation)
> - Gamut clamping (via Culori's `formatHex`) — maps out-of-gamut colors to nearest displayable sRGB value at export time

Confirms P3 wide-gamut export pattern:

> The export pipeline produces both sRGB hex values and P3 `oklch()` CSS values. P3 output is optional (`includeP3`, defaults to `true`) — consumers targeting only sRGB displays can disable it to reduce CSS bundle size. CSS cascading handles fallback.

CSS pattern referenced:

> Optional P3 wide gamut overrides in `@supports (color: color(display-p3 1 1 1))` + `@media (color-gamut: p3)` block, using `oklch()` notation.

---

## Cross-checks against existing stinger

- `guides/02-token-and-utility-enforcement.md` already shows `oklch(0.74 0.16 55)` example tokens. Confirmed; guide #13 deepens that without duplicating.
- `research/2026-04-24-tailwind-v4-theme-tokens.md` covers Tailwind v4's `@theme` directive consuming OKLCH. Confirmed; guide #13 references it.
- `research/library-versions.md` lists Tailwind 4.x with "`@theme` directive; CSS-first; OKLCH default color space."

No duplication. The novel content in guide #13 is:

1. **Why** OKLCH (perceptual uniformity, P3 — articulated for the Angel's review reasoning).
2. **How** to author a 12-step scale (L sweep + C trim + H constant pattern).
3. **Multi-platform** export via Style Dictionary, with a recommended folder shape and DTCG 2025.10 conventions.
4. **When NOT** to add Style Dictionary (single-platform products).

---

## Operational decisions made for the guide

1. **Don't push Style Dictionary on web-only products.** Surface it when iOS / Android / RN / Figma / multi-framework needs appear.
2. **Recommend `oklch-palette` for bootstrap, then commit literals.** The runtime dep isn't needed once the scale is emitted.
3. **Keep gamut-clamping invisible by default** — modern browsers get `oklch()`, older browsers get the build-time hex. Only add P3 overrides for products where the brand-color difference between sRGB and P3 visibly matters.
4. **Tie this guide back to `guides/02`** — the no-inline-color rule applies regardless of color space. OKLCH literals in feature code are still bugs.

---

## Open questions

- Should the Stinger ship a starter `style-dictionary.config.cjs` template? Defer until a real product asks.
- Should the Angel review for tokens that drift between modes (light brand vs. dark brand differing in `H`)? Yes — added to guide review checklist as a tightening of the "hold H constant across modes" rule.
- Tailwind v4 theme inheritance — does Style Dictionary need to know about `@theme` blocks to avoid double emission? Defer; current pattern is "Style Dictionary writes the same `01-master-tokens.css` Tailwind reads."
