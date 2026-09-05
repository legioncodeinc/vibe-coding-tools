---
name: "typography-font-stinger"
description: "Typography and font-loading specialist for web products: variable fonts, Google Fonts vs Fontsource vs self-host, the FOIT/FOUT/FOFT loading story, font-display semantics, fluid type scales via clamp(), vertical rhythm, and the type-token architecture. Use when the user says \\\\\\\\\\\\\\\"set up fonts\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"audit our typography\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"fix FOIT/FOUT\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"build a type scale\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"migrate to next/font\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"self-host fonts\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"fluid type\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"variable fonts\\\\\\\\\\\\\\\", \\\\\\\\\\\\\\\"font performance\\\\\\\\\\\\\\\", or when typography-font-worker-bee is invoked. Do NOT use for typeface selection or brand identity decisions (design-system-worker-bee), per-component application of type tokens (ux-ui-svelte-worker-bee), build pipeline font optimization (devops-worker-bee), or persisted user font preferences (db-worker-bee)."
license: MIT
---

# Typography Font Stinger

Typography is the invisible infrastructure of every UI. Font loading choices directly impact Core Web Vitals (LCP, CLS), accessibility (WCAG 1.4.4 text resize), and brand consistency. Getting it right in 2026 means navigating variable font subsetting, the `font-display` decision matrix, fluid `clamp()` type scales, and the growing split between `next/font`, Fontsource, and full self-hosting pipelines.

This Stinger encodes the 2026 state-of-the-art for the full technical typographic stack: font loading strategy, variable font configuration, fluid type scale arithmetic, vertical rhythm, and the font-token layer. Read `SKILL.md` for task routing; follow the specific guide for implementation depth.

---

## Task routing

| Task | Guide |
|------|-------|
| Understand FOIT, FOUT, FOFT, and font-display semantics | `guides/00-principles.md` |
| Choose font hosting strategy (next/font vs Fontsource vs self-host) | `guides/01-hosting-strategy.md` |
| Configure variable fonts and subsetting | `guides/02-variable-fonts.md` |
| Build a fluid type scale with clamp() | `guides/03-fluid-type-scale.md` |
| Establish vertical rhythm and line-height | `guides/04-vertical-rhythm.md` |
| Author a font token CSS layer | `guides/05-font-token-layer.md` |
| Audit and improve font loading performance | `guides/06-performance-checklist.md` |
| Happy-path: Next.js + next/font + Tailwind | `examples/happy-path-nextjs-font.md` |
| Edge-case: self-hosted variable font with manual subsetting | `examples/edge-case-self-hosted-variable.md` |
| CSS typography token skeleton | `templates/typography.css.template.md` |
| next/font config template | `templates/next-font-config.ts.template.md` |

---

## The seven non-negotiables

From the Command Brief, repeated here as guardrails for every implementation:

1. **Always specify `font-display` on every `@font-face` rule.** Browser defaults vary; omitting it causes unpredictable FOIT/FOUT/FOFT across Chrome, Safari, and Firefox. See `guides/00-principles.md`.
2. **Never reference raw px font sizes in component code.** All sizes must route through the fluid type-scale token layer. See `guides/05-font-token-layer.md`.
3. **Distinguish FOIT, FOUT, and FOFT.** Each has a different `font-display` remedy; conflating them leads to wrong values. See `guides/00-principles.md`.
4. **Always subset variable fonts.** Unsubsetted variable fonts are 300-800 kB; a Latin subset is typically 20-60 kB. See `guides/02-variable-fonts.md`.
5. **Validate next/font usage against the App Router API, not Pages Router.** The two APIs differ in import path, options object, and class/variable application. See `guides/01-hosting-strategy.md`.
6. **Express fluid type steps as `clamp()` expressions, not media-query breakpoint steps.** `clamp()` provides smooth interpolation that breakpoints cannot replicate. See `guides/03-fluid-type-scale.md`.
7. **Keep the font-token file as the single source of truth.** Font decisions scattered across globals, components, and Tailwind config produce a system that cannot be audited holistically. See `guides/05-font-token-layer.md`.

---

## Scope boundary

| In scope | Out of scope - route to |
|----------|------------------------|
| Font loading strategy (next/font, Fontsource, self-host) | Typeface aesthetic selection - `design-system-worker-bee` |
| Variable font axes, subsetting, `@font-face` config | Build pipeline subsetting CI steps - `devops-worker-bee` |
| `font-display` semantics and FOIT/FOUT/FOFT remediation | Per-component type token application - `ux-ui-svelte-worker-bee` |
| Fluid `clamp()` type scale arithmetic | LCP font impact analysis in broader CWV audit - `seo-aeo-worker-bee` |
| Vertical rhythm and `line-height` tokens | Persisted user font preference schema - `db-worker-bee` |
| Font-token CSS layer (`--font-*` custom properties) | Brand identity and palette decisions - `design-system-worker-bee` |

---

## Quick-start checklist

For a standard Next.js 15 App Router + `next/font` + Tailwind v4 stack:

- [ ] Font loading: `next/font/google` or `next/font/local` configured in `app/fonts.ts`
- [ ] Font variables applied to `:root` via `className` or `variable` prop on `<html>`
- [ ] No render-blocking `<link rel="stylesheet">` for Google Fonts in `<head>`
- [ ] `font-display` declared (or confirmed via `next/font`'s automatic `optional`)
- [ ] Variable font configured with `wght` axis range, not discrete weights
- [ ] Fluid type scale: all sizes expressed as `clamp()` CSS custom properties in `tokens/typography.css`
- [ ] Vertical rhythm: `line-height` multiples stored as tokens
- [ ] No raw px font sizes in any `.tsx` or `.css` component file
- [ ] Font subset: Latin-only for non-multilingual projects (`subset: ['latin']` in next/font)

---

*Research trail: `research/research-summary.md` | Command Brief: `ai-tools/command-briefs/typography-font-worker-bee-command-brief.md`*
