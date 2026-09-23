# 03. Route: identify visual and code inconsistencies

Finds where an app's UI drifts from itself: near-identical colors that should be one token, sprawling type and spacing scales, one component rendered several ways, contrast failures, and the code patterns that cause them. Read `00-foundation.md` first.

## Inputs

| Input | Source | Needed for |
| --- | --- | --- |
| `_raw/` state JSONs, `groups.json`, `tokens-raw.json` | Route 02 stages 1 to 3 (code only, no AI cost) | Visual audit |
| `ledger.json` inconsistencies | Route 02 stage 6 (optional) | Component-level judgment |
| Source tree | The app's repository | Code audit |
| Screenshots | `screenshots.mjs` | Evidence in the report |

A visual audit does not need the describe and merge stages. Run extract, cluster, and tokens, then audit.

## Part A: visual audit

```bash
RAW=library/design/_raw OUT=library/requirements/reports/2026-09-15-visual-audit node <skill>/scripts/audit/audit-visual.mjs
```

### What it checks

| Check | Rule | Grounding |
| --- | --- | --- |
| Near-duplicate colors | Within one role (text, background, border) and the same alpha band, colors within CIEDE2000 2.0 of each other with 5+ combined uses are flagged as one token rendered inconsistently | Delta E below 1 is imperceptible, about 1 to 2 is a just noticeable difference, 2 and above is clearly different [raw/visual--ciede2000-deltae-culori.md]. Raw hex equality misses this class of drift [raw/visual--design-system-drift-community.md] |
| Scale sprawl | More than 8 distinct font sizes, radii, or spacing values; values under 1% of uses; values off a 4px spacing or 2px radius grid | Metric families mirror Project Wallace's analyzer (unique colors, font sizes, families, shadows, z-indexes) [raw/visual--project-wallace-css-analyzer.md] |
| Font families | More than 3 stacks | same |
| Elevation | More than 5 distinct box shadows | same |
| Component drift | A fuzzy group with 3+ variants whose examples differ in 2+ of background, radius, font, padding | Drift taxonomy (token, component, pattern drift) [raw/visual--design-system-drift-community.md] (community source) |

The threshold is a defensible default, not a spec value: the archived color source does not publish numeric cut points [raw/visual--ciede2000-deltae-culori.md]. Expose it (`DE=`) and say so in the report.

### Contrast: use axe, do not hand-roll

WCAG 2.2 requires 4.5:1 for normal text and 3:1 for large text (SC 1.4.3) [raw/visual--wcag22-contrast-minimum.md], and 3:1 for UI components and meaningful graphics (SC 1.4.11) [raw/visual--wcag22-non-text-contrast.md]. Computing this from captured styles is unreliable because the effective background depends on ancestors, overlays, gradients, and images. Run axe-core's `color-contrast` rule in the same authenticated session per route instead, and report its incomplete results as needing manual review [raw/visual--axe-core-color-contrast-rule.md].

### Pixel diffs are a different job

Pixel comparison (pixelmatch threshold 0 to 1, anti-aliasing detection) [raw/visual--pixelmatch-readme.md] and `toHaveScreenshot` (`threshold` default 0.2, `maxDiffPixels`, `maxDiffPixelRatio`) [raw/visual--playwright-tohavescreenshot.md] detect change over time between two captures of the same screen. They do not find inconsistency within one capture. "Threshold" means different things across these tools; name the tool whenever quoting one. For ongoing regression review, hosted services such as Argos [raw/visual--argos-ci-playwright.md], Chromatic [raw/visual--chromatic-visual-tests.md], Percy [raw/visual--percy-playwright-sdk.md], or self-hosted BackstopJS [raw/visual--backstopjs-readme.md] fit better than this skill. Hand CI wiring to `ci-release-wasp-drone`.

## Part B: code audit

```bash
SRC=<repo> OUT=library/requirements/reports/2026-09-15-code-ui-audit node <skill>/scripts/audit/audit-code.mjs
```

### What the dependency-free scan reports

| Signal | Why it matters |
| --- | --- |
| Hardcoded hex and functional color literals outside variable definitions | Literal values instead of semantic tokens [raw/code--duplicate-ui-components-detection.md] |
| Tailwind arbitrary values (`text-[11px]`, `bg-[#316ff6]`) | Values outside the theme scale [raw/code--tailwindcss-v4-arbitrary-values.md]. Heuristic only: no dedicated linter is archived (research gap) |
| Arbitrary values wrapping variables (`text-[var(--x)]`) | Token-backed but bypassing `@theme`; promote the variable |
| Inline styles, `!important`, z-index literals of 100+ | Styling outside the system and specificity fights |
| Long class lists repeated 3+ times | Copy-pasted components that should be one component [raw/code--duplicate-ui-components-detection.md] |
| CSS variables defined but never referenced | Dead or misspelled tokens |

Bracketed state selectors such as `data-[state=checked]` and `aria-[...]` are variants rather than one-off values, so the scan excludes them (a design choice of this skill).

### Deepen with established tools (recommend, do not install silently)

| Tool | Use | Grounding |
| --- | --- | --- |
| Stylelint | `color-no-hex`, `color-named`, `unit-allowed-list`, `font-family-no-duplicate-names`, `declaration-property-value-allowed-list` | [raw/code--stylelint-rule-color-no-hex.md] [raw/code--stylelint-rule-color-named.md] [raw/code--stylelint-rule-unit-allowed-list.md] [raw/code--stylelint-rule-font-family-no-duplicate-names.md] [raw/code--stylelint-rule-declaration-property-value-allowed-list.md] |
| stylelint-declaration-strict-value | Require variables for color and z-index | [raw/code--stylelint-declaration-strict-value-plugin.md] |
| jscpd | Clone detection across component files (`--min-tokens`, `--similarity`) as machine evidence of duplicate components | [raw/code--jscpd-readme.md] |
| prettier-plugin-tailwindcss | Normalize class order so ordering is not mistaken for a real difference | [raw/code--prettier-plugin-tailwindcss-readme.md] |
| Knip | Unused files and exports (purpose-level research only; do not quote flags) | [raw/code--knip-readme.md] |

Adding any of these to the repository is a code change: it goes through the Ship Gate and the user's approval.

## Part C: connect visual findings to code

For each medium or higher visual finding, find the cause in source:

1. Near-duplicate colors: grep the hex values and the CSS variables that resolve to them (`tokens-raw.json` lists them per value).
2. Component drift: take the group's routes and sample text, find the components rendering them, compare their class lists or styles.
3. Redundant variables (several names, one value): list the definitions and usages.

A finding with both a screenshot and a file and line is actionable; a finding with only one is a lead.

## Report

Write to `library/requirements/reports/<YYYY-MM-DD>-ui-inconsistency-report.md` (Library Schema v2 routine reports), or the relevant PRD's `qa/` folder when tied to a plan. Structure:

1. Scope: routes, states, theme, commit or build, thresholds used.
2. Summary table: severity, area, finding, evidence count.
3. Findings, most severe first, each with: what, where (routes, components, files and lines), evidence (values, counts, screenshot crops), recommended token or consolidation, and effort.
4. Blind spots not audited (closed shadow roots, cross-origin iframes, interaction-only UI, contrast results axe marked incomplete).
5. Suggested lint rules to prevent recurrence.

Severity guide: high for accessibility failures and inconsistent destructive-action treatments; medium for token duplicates with many uses, component drift, and scale sprawl; low for rare values and cosmetic redundancy.

## Hand off

When a component library exists, rerun `inventory/design-handoff.mjs` after the audit so the Claude Design zip carries the newest findings (guide 02, stage 8).
