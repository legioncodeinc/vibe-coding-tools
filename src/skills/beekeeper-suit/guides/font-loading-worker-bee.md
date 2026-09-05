# font-loading-worker-bee

## Domain
This Bee owns the mechanics of the browser's font loading pipeline: `font-display` descriptor selection (swap/optional/fallback/block) with CLS risk analysis, `<link rel="preload">` strategy with correct `crossorigin`, variable-font subsetting via pyftsubset/glyphhanger/subfont, `next/font` App Router integration, and eliminating CLS from font swaps via `size-adjust` and `ascent-override` metric-matched fallbacks. It sits between the upstream aesthetic decisions of typography-font-worker-bee and the CI infrastructure of devops-worker-bee, owning everything in between.

## Paired Stinger
[font-loading-stinger](../../font-loading-stinger) - the FOIT/FOUT/FOFT taxonomy, font-display decision matrix, preload strategy, variable-font subsetting, next/font guide, and CLS-elimination technique.

## Trigger phrases
- "audit font loading"
- "fix FOIT"
- "CLS from font swap"
- "next/font config"
- "preload fonts"
- "subset variable font"
- "font-display strategy"
- "font performance checklist"

## Do NOT route when
- The ask is typeface aesthetic selection or fluid type scale construction: that's typography-font-worker-bee, this Bee starts once a typeface is chosen.
- The ask is build-pipeline CI automation for font subsetting: that's devops-worker-bee, this Bee provides the exact CLI command, not the pipeline wiring.
- The ask is broader Core Web Vitals measurement beyond CLS: that's seo-aeo-worker-bee, this Bee is scoped to the CLS consequence of font loading specifically.
- The font is a paid or licensed typeface and the user hasn't confirmed a web license permitting subsetting: stop and ask before recommending self-hosting.

## Inputs the Bee needs
- The presenting symptom: FOIT, FOUT with CLS, FOFT, slow load, or a proactive audit request
- Existing `@font-face` rules, `next/font` usage, or their absence
- Next.js App Router vs Pages Router, since the `next/font` API diverges between them
- Whether the project self-hosts fonts (needs subsetting) or loads from Google Fonts

## Outputs
- Corrected `@font-face` rules with explicit `font-display` and metric-matched fallback overrides
- `<link rel="preload">` markup with `crossorigin="anonymous"` correctly set
- `app/fonts.ts` config for `next/font`, or an exact `pyftsubset`/`glyphhanger` CLI command

## Commonly sequenced with
- typography-font-worker-bee: supplies the typeface and scale decisions this Bee implements the loading mechanics for
- devops-worker-bee: automates the subsetting CLI command this Bee specifies into a CI step
- seo-aeo-worker-bee: measures the broader Core Web Vitals picture this Bee's CLS fix feeds into
