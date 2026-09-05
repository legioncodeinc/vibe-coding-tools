# Research Plan: design-system-stinger

**Forged:** 2026-04-24
**Bee:** `design-system-worker-bee`

## Purpose

This plan captures the research queries, authoritative sources, and open
questions used to forge the `design-system-stinger` Cursor skill. It is the
audit trail for every factual claim in the guides.

## Queries to execute

Pulled from the Command Brief's REFERENCE MATERIAL section and from the open
questions in IDEAS, SUGGESTIONS, QUESTIONS.

1. "design system folder structure 2025 token utility component screen layering"
2. "Tailwind CSS v4 @theme custom properties oxide engine"
3. "oklch color space design systems production usage"
4. "Design Tokens Community Group W3C spec JSON format"
5. "glassmorphism production implementation backdrop-filter fallbacks"
6. "tenant theming CSS custom properties multi-tenant SaaS"
7. "motion design tokens duration curve conventions named buckets"
8. "design system documentation component contract shape"
9. "Refactoring UI principles Adam Wathan Steve Schoger hierarchy"
10. "Stripe design system discipline CSS-Tricks depth glass"
11. "Apple Human Interface Guidelines depth materials glass language"
12. "Material Design 3 elevation system surface tonal elevation"
13. "Radix UI primitives unstyled accessible component patterns"
14. "shadcn ui copy paste component patterns tailwind"
15. "prefers-reduced-motion prefers-color-scheme prefers-contrast CSS"

## Authoritative sources to consult directly

- https://cursor.com/docs/skills: Cursor skill spec (already in references)
- https://tailwindcss.com: Tailwind v4 @theme, CSS-first config
- https://m3.material.io: Material Design 3 elevation + tokens
- https://developer.apple.com/design/human-interface-guidelines: Apple HIG
  depth, materials, glass
- https://www.radix-ui.com/primitives: Radix patterns
- https://ui.shadcn.com: shadcn component shape
- https://www.designtokens.org: W3C Design Tokens Community Group
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch: oklch()
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix: color-mix()
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://refactoringui.com: Refactoring UI by Adam Wathan + Steve Schoger

## Open questions the Stinger must answer

1. **Tailwind bridge.** Should the Bee emit a starter `@theme` block so tokens
   are usable from Tailwind v4 utilities without a second source-of-truth?
   Decision: **yes**, include a bridge section in `guides/03-authoring-tokens.md`
   and ship a sample `@theme` block in each starter kit.
2. **Sizing envelope for a new product's design system.** Decision: **800-1500
   lines for the master brief, 8-15 component briefs, 5-10 screen briefs,
   200-400 lines for tokens CSS, 150-300 lines for utility CSS.** Surface this
   as a sizing table in `guides/02-authoring-design-brief.md`.
3. **Migration from ad-hoc CSS.** Decision: **yes**, author a dedicated edge
   case in `examples/02-migration-from-ad-hoc.md` that walks through extracting
   a messy Tailwind/inline-style codebase into the seven-artifact structure.
4. **Design Tokens JSON round-trip.** Decision: **out of scope for bootstrap
   v1**. Note in `guides/03-authoring-tokens.md` that the token layer is
   translatable to DTCG JSON later via a small script, but the canonical source
   remains `01-master-tokens.css`.

## Internal reference: the gold standard

`/sessions/gifted-nice-dijkstra/mnt/uploads/ux-ui.zip` (183 KB, 32 files)
unzipped to `/tmp/ux-ui-extract/ux-ui/` for inspection:

- `00-design-brief.md` (545 lines)
- `01-master-tokens.css` (183 lines)
- `02-glass-and-depth.css` (165 lines)
- `03-components/` (11 component briefs)
- `04-screens/` (5 screen briefs)
- `05-html-examples/` (7 HTML + `_shared.css` at 183 lines)
- `README.md` (39 lines)

This is the structure the Bee reproduces. Every guide in the Stinger either
teaches a layer of that folder or the procedure that assembles it.
