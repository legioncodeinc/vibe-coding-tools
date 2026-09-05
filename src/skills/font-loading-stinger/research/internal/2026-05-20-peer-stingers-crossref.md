---
source_url: internal
retrieved_on: 2026-05-20
source_type: blog
authority: official
relevance: medium
topic: cross-reference
stinger: font-loading-stinger
---

# Internal Cross-References: font-loading-stinger Peer Stingers

## Summary
Cross-reference notes mapping the boundary between `font-loading-stinger` and its
neighboring stingers in the Hive. These boundaries are
documented in the Command Brief and define what the Bee owns vs defers.

## Peer Stinger Boundaries

### typography-font-worker-bee / typography-font-stinger
- **Location:** `.claude/skills/typography-font-stinger/`
- **Owns:** Typeface selection, fluid type scale (`clamp()`), font tokens
  (CSS custom properties for `--font-body`, `--font-heading`), FOUT/FOIT/FOFT
  general overview, `next/font` self-hosting overview, `font-display: swap`
  general recommendation.
- **font-loading-worker-bee takes over at:** The specific `@font-face` descriptor
  choices, preload strategy, subsetting pipeline, metric-override CLS
  elimination technique, and the measurable performance audit.
- **Handoff point:** `font-loading-worker-bee` produces the `@font-face` rules
  and fallback stacks; `typography-font-worker-bee` wraps them into the CSS token
  layer that references the loaded families.

### seo-aeo-worker-bee / seo-aeo-stinger
- **Location:** `.claude/skills/seo-aeo-stinger/`
- **Owns:** CLS Core Web Vitals score impact on SEO ranking, LCP attribution,
  PageSpeed Insights score interpretation.
- **font-loading-worker-bee feeds:** CLS score improvement from font-swap
  elimination, LCP improvement from font preloading, the audit report numbers
  that feed into an SEO CWV report.

### devops-worker-bee / devops-stinger
- **Location:** `.claude/skills/devops-stinger/`
- **Owns:** CI/CD subsetting pipeline automation (running `pyftsubset` as a
  build step, font optimization in the build system).
- **font-loading-worker-bee feeds:** The exact CLI commands and unicode-range
  values that the CI pipeline should run. `devops-worker-bee` wires them; 
  `font-loading-worker-bee` defines the commands.

### lighthouse-pagespeed-worker-bee / lighthouse-pagespeed-stinger
- **Location:** `.claude/skills/lighthouse-pagespeed-stinger/`
- **Owns:** Running Lighthouse CI, interpreting audit scores, performance
  budgets in CI.
- **font-loading-worker-bee feeds:** The "Ensure text remains visible during
  webfont load" audit (font-display), the CLS attribution panel, font payload
  size as a performance budget item.

## Annotations for stinger-forge

- The peer stinger boundaries define the `## Out of Scope` section in `SKILL.md`.
- The handoff to `typography-font-worker-bee` (produces `@font-face` rules; peer
  wraps them into token layer) should be the closing line in several guides.
- The `seo-aeo-worker-bee` relationship means CLS scores from font fixes should
  be measurable and reportable: include a "measuring the result" section in
  `guides/06-performance-checklist.md`.
