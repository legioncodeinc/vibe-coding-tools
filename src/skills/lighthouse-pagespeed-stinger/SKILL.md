---
name: "lighthouse-pagespeed-stinger"
description: "Runs Lighthouse and PageSpeed Insights for React/Next.js: CI setup (LHCI), audit categories, performance budgets, lab-vs-CrUX gap. Use when setting up or debugging Lighthouse CI."
---

# lighthouse-pagespeed-stinger

Opinionated playbook for running Lighthouse and PageSpeed Insights correctly: in CI, locally, and as part of a long-term performance tracking strategy. Synthesized from the Lighthouse 12.6.1 + LHCI 0.15.x canon, the web.dev lab-vs-field framework, and 2025-2026 practitioner patterns.

**Read first:** `guides/00-runner-selection.md`: the decision tree for which tool to use before you touch any config.

---

## When to use this skill

Load this skill when `lighthouse-pagespeed-worker-bee` is invoked. Trigger phrases:

- "Set up Lighthouse CI / LHCI"
- "Add a performance budget to our CI pipeline"
- "My Lighthouse score is 90 but CrUX says I'm failing LCP"
- "Configure Lighthouse for GitHub Actions"
- "What's the difference between TBT and INP?"
- "Compare Treo vs SpeedCurve for monitoring"
- "Write a custom Lighthouse plugin"
- "Audit this URL with Lighthouse"
- "Set a performance budget"

Do NOT load for:
- SEO content strategy, keyword research, or metadata optimization (route to `seo-aeo-worker-bee`)
- Core Web Vitals implementation fixes like image optimization or JS bundle reduction (route to `react-worker-bee` or `performance-optimizer`)
- Accessibility design decisions beyond Lighthouse-flagged technical issues
- CI/CD pipeline topology beyond the Lighthouse-specific configuration step (route to `devops-worker-bee`)

---

## Critical directives

These are non-negotiables. They protect reproducibility, team trust, and the lab-vs-field mental model.

- **Always specify throttling and form-factor explicitly.** A mobile simulation at 4x CPU / 1.6 Mbps and a desktop no-throttle run produce completely different scores; mixing them corrupts trend data. See `guides/00-runner-selection.md`.

- **Run at least three passes; report the median.** LHCI defaults to three runs for this reason (`numberOfRuns: 3`). A single Lighthouse run has high variance due to non-deterministic CPU and network simulation. See `guides/01-lhci-configuration.md`.

- **Always present both lab scores and CrUX field data when PSI API data is available.** Lab data reflects ideal conditions; field data (p75) reflects real users. The gap between them is often the most actionable signal. See `guides/02-lab-vs-field.md`.

- **Never set a score budget below the current production baseline without a remediation plan.** Measure first (`lhci autorun` without assertions), document baselines, then add a 10-20% buffer. A budget that gates CI on day one with no remediation plan blocks deploys without unblocking the team. See `guides/01-lhci-configuration.md`.

- **TBT is an imperfect proxy for INP. A good TBT does not guarantee a good INP.** INP measures full interaction latency (delay + processing + presentation). TBT only captures blocking tasks during load. A page can have TBT < 200ms and INP > 500ms. Always check field INP separately. See `guides/02-lab-vs-field.md`.

- **Scope custom plugins to audits that existing Lighthouse audits cannot cover.** Plugins cannot access custom Gatherers; they can only read existing artifacts (`ImageElements`, `ScriptElements`, `devtoolsLogs`, etc.). If you need custom page data, you need a full custom config. See `guides/05-custom-plugins.md`.

---

## Lighthouse 12 / LHCI 0.15.x facts (encoded from research)

> Source: `research/external/2026-05-20-lighthouse-performance-scoring.md`

**Current version:** Lighthouse 12.6.1 (LHCI 0.15.x). Node 18+ required.

**Four categories (not five: PWA removed in LH12, May 2024):**
- Performance
- Accessibility
- Best Practices
- SEO

**Performance score weights (unchanged from LH10):**

| Metric | Weight |
|--------|--------|
| Total Blocking Time (TBT) | 30% |
| Largest Contentful Paint (LCP) | 25% |
| Cumulative Layout Shift (CLS) | 25% |
| First Contentful Paint (FCP) | 10% |
| Speed Index (SI) | 10% |

**INP is NOT in the Lighthouse Performance score.** INP replaced FID as a Core Web Vital (March 12, 2024), but INP is a field-only metric. TBT is its lab proxy. TTI was removed from the score in Lighthouse 10.

**Score color bands:** 0-49 red (Poor), 50-89 orange (Needs Improvement), 90-100 green (Good). Reaching 90+ means being in the top 8% of HTTP Archive sites for that metric.

---

## Guide map

Each guide is a self-contained instruction set. Read in order on first use; jump directly to the relevant guide for targeted tasks.

| Guide | When to read |
|-------|-------------|
| `guides/00-runner-selection.md` | First: before choosing any tool |
| `guides/01-lhci-configuration.md` | Setting up `lighthouserc.json`/yaml, `collect`/`assert`/`upload` |
| `guides/02-lab-vs-field.md` | Reconciling Lighthouse scores vs CrUX / PSI field data |
| `guides/03-ci-integration.md` | GitHub Actions workflow, LHCI setup, score gating |
| `guides/04-performance-tracking.md` | Treo, SpeedCurve, self-hosted LHCI server |
| `guides/05-custom-plugins.md` | Authoring custom Lighthouse audit plugins |
| `guides/06-audit-category-glossary.md` | Understanding individual audits and their score weights |

---

## Templates

- `templates/lighthouserc-starter.yaml`: Annotated production-ready LHCI config
- `templates/custom-plugin-starter.js`: Scaffold for a custom Lighthouse plugin

## Examples

- `examples/happy-path-lhci-setup.md`: End-to-end LHCI setup from zero to CI-gating a Next.js app
- `examples/lab-field-reconciliation.md`: Walking through a case where Lighthouse scores 90 but CrUX INP fails

## Reports

- `reports/README.md`: Report template and location convention for audit reports

---

*Command Brief: `ai-tools/command-briefs/lighthouse-pagespeed-worker-bee-command-brief.md`*
*Research: `research/research-summary.md` (normal depth, 9 sources, May 2026)*
*Forged by `stinger-forge` as part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama)*
