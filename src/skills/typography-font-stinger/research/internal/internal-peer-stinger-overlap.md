---
source_type: internal
authority: high
relevance: high
topic: peer stinger boundaries and handoff surfaces
url: .claude/skills/design-system-stinger/ and .claude/skills/ux-ui-svelte-stinger/
retrieved: 2026-05-20
---

# Peer Stinger Overlap Notes

## Summary

Three peer Stingers share boundary surfaces with `typography-font-stinger`. Understanding the handoff points is critical to ensuring guides do not over-reach or leave gaps.

## 1. design-system-stinger (upstream)

**Owns:** typeface selection (aesthetic rationale, brand alignment), master design brief, primitive token definitions (color palette, spacing base, etc.).

**Handoff to typography-font-stinger:** The design brief provides the chosen typeface name(s), licensing status, and variable font availability. `typography-font-stinger` then implements the technical loading and token layer. The font-token file `tokens/typography.css` is typography's output that design-system-stinger references as its typographic source-of-truth.

**Overlap risk:** Token naming conventions. Ensure `--font-family-*`, `--font-size-*`, `--line-height-*`, `--letter-spacing-*`, `--font-weight-*` naming in `tokens/typography.css` matches the token naming schema that `design-system-stinger` established for the project. The typography stinger does NOT invent token naming from scratch - it aligns with the existing schema.

## 2. ux-ui-svelte-stinger (downstream)

**Owns:** per-component application of type tokens, pixel-perfect component specifications against design brief.

**Receives from typography-font-stinger:** The `tokens/typography.css` file with `--font-size-*`, `--line-height-*`, `--letter-spacing-*`, `--font-weight-*` variables. `ux-ui-svelte-stinger` uses these as `var()` references in component styles, never hardcoding raw sizes.

**Overlap risk:** Component-specific type overrides. If a component needs a non-standard type treatment (e.g., a display heading at 90px), `ux-ui-svelte-stinger` should define a component-scoped token that references a primitive in `tokens/typography.css`, not bypass the token layer.

## 3. devops-stinger (adjacent)

**Owns:** build pipeline configuration, CI/CD steps, font subsetting tooling in CI.

**Handoff surface:** `typography-font-stinger` specifies _what_ to subset (Unicode ranges, axes, OpenType features, target byte budget). `devops-stinger` implements _how_ the subsetting runs in the pipeline (e.g., `glyphhanger` in GitHub Actions, Vercel font optimization flags). The stinger's `guides/06-performance-checklist.md` should note this boundary explicitly.

## 4. seo-aeo-stinger (cross-reference)

**Cross-reference only:** web font loading affects LCP, which is a Core Web Vitals signal that `seo-aeo-stinger` monitors. `guides/06-performance-checklist.md` should explicitly reference the `font-display: optional` + preload combination as the recommended pattern for LCP-sensitive fonts, and note that `seo-aeo-stinger` owns the broader LCP optimization context.

## Annotations for stinger-forge

- Write `guides/05-font-token-layer.md` with explicit sections on "How to name tokens to align with design-system-stinger output" and "How ux-ui-svelte-stinger consumes these tokens."
- Write `guides/06-performance-checklist.md` with a dedicated section on "Build pipeline boundary - what typography-font-stinger specifies vs. what devops-stinger implements."
- In `SKILL.md`, include a "Peer Stinger boundaries" section that lists these four stingers and their handoff points.
