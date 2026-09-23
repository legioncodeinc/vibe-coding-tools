---
name: "font-loading-stinger"
description: "Fix web font loading performance. Use for FOIT/FOUT, preload, subsetting, metric-matched fallbacks, or font-swap CLS. Read README.md for the guide map."

license: AGPL-3.0-or-later
---

# font-loading-stinger

Start with [README.md](README.md) for the workflow map and detailed references.

You are `font-loading-wasp-drone`'s arsenal. Your job is to encode the 2026 production-consensus patterns for web font loading performance so the Drone can audit, implement, and advise with precision rather than approximation.

Read `SKILL.md` first. Then open the specific guide that matches the task. When the task spans multiple guides, read them in order.

---

## Task router

| Presenting symptom or request | Primary guide |
|---|---|
| "What `font-display` value should I use?" | `guides/01-font-display-decision-matrix.md` |
| "Invisible text on first load" (FOIT) | `guides/00-principles.md` + `guides/01-font-display-decision-matrix.md` |
| "Text shifts when font loads" (FOUT + CLS) | `guides/01-font-display-decision-matrix.md` + `guides/05-cls-elimination.md` |
| "Font loads slowly" / "font is blocking render" | `guides/02-preload-strategy.md` |
| "Variable font file is too large" | `guides/03-variable-font-subsetting.md` |
| "next/font config" / "App Router fonts" | `guides/04-nextjs-font.md` |
| "CLS from font swap" / "layout shift after font loads" | `guides/05-cls-elimination.md` |
| "Font performance checklist" / "audit font setup" | `guides/06-performance-checklist.md` |
| Full audit | All guides in order; see `examples/full-audit.md` |
| Next.js Inter setup from scratch | `guides/04-nextjs-font.md` + `examples/happy-path-nextjs-inter.md` |
| Self-hosted variable font from scratch | `guides/03-variable-font-subsetting.md` + `examples/edge-case-self-hosted-variable.md` |

---

## Critical directives (summary)

These are non-negotiable. Full rationale in each guide.

1. **Always specify `font-display` on every `@font-face` rule.** Browser defaults differ across Chrome, Safari, and Firefox; omitting it produces non-deterministic FOIT/FOUT/FOFT behaviour.
2. **Never recommend `font-display: swap` without also implementing metric-matched fallback overrides.** `swap` trades FOIT for FOUT-with-CLS; the CLS is only eliminated when fallback metrics (`size-adjust`, `ascent-override`) match the web font.
3. **Always add `crossorigin="anonymous"` to `<link rel="preload" as="font">`.** Font fetches are CORS requests; omitting `crossorigin` causes a double-fetch and the preload is wasted.
4. **Never preload more than 2-3 font files.** Each preload raises fetch priority to Highest; over-preloading inverts the fetch-priority queue and can delay LCP images.
5. **Distinguish `next/font` App Router API from Pages Router API before generating code.** Import path, options object shape, and where className/variable is applied differ significantly; mixing them causes runtime errors.
6. **Always subset variable fonts before recommending self-hosting.** Unsubsetted variable fonts are 300-800 kB; a Latin + Basic Latin subset is typically 20-60 kB.

---

## Scope boundaries

`font-loading-wasp-drone` is the **loading mechanics layer**. Stay in-lane:

- **Upstream (not ours):** Typeface selection, aesthetic decisions, fluid type scale, CSS token architecture (`typography-font-wasp-drone`)
- **Downstream (not ours):** CWV measurement loop, LCP attribution, SEO impact of CLS score (`seo-aeo-wasp-drone`)
- **Infrastructure (not ours):** CI/CD subsetting pipelines, automated `glyphhanger` in build jobs (`devops-wasp-drone`)

When a request crosses into a peer domain, complete the font-loading portion and then name the peer Drone explicitly.

---

## References

Read the guides in this order for a full-scope audit:

- `guides/00-principles.md`: FOIT/FOUT/FOFT taxonomy, font-display period model, browser defaults
- `guides/01-font-display-decision-matrix.md`: when to use swap/optional/fallback/block/auto
- `guides/02-preload-strategy.md`: preload hints, crossorigin, over-preloading anti-pattern
- `guides/03-variable-font-subsetting.md`: pyftsubset, glyphhanger, subfont, unicode-range
- `guides/04-nextjs-font.md`: next/font App Router vs Pages Router, fonts.ts patterns
- `guides/05-cls-elimination.md`: size-adjust, ascent-override, fontpie, capsizefitter
- `guides/06-performance-checklist.md`: 2026 targets: payload, preloads, CLS, zero double-fetches

Examples:

- `examples/happy-path-nextjs-inter.md`: Next.js 15 + Inter variable + zero CLS (most common pattern)
- `examples/edge-case-self-hosted-variable.md`: paid font self-hosted with pyftsubset + metric override

Templates:

- `templates/font-face-block.md`: canonical `@font-face` template with all required descriptors
- `templates/preload-link.md`: correct `<link rel="preload">` markup
- `templates/nextfont-config.ts.md`: `app/fonts.ts` starter templates

Research trail:

- `research/research-summary.md`: executive summary from scripture-historian
- `research/research-plan.md`: depth tier, queries, page budget
- `research/index.md`: manifest of all source files
