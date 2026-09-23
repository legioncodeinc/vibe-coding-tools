# font-loading-wasp-drone

## Domain
This Drone owns the mechanics of the browser's font loading pipeline: `font-display` descriptor selection (swap/optional/fallback/block) with CLS risk analysis, `<link rel="preload">` strategy with correct `crossorigin`, variable-font subsetting via pyftsubset/glyphhanger/subfont, `next/font` App Router integration, and eliminating CLS from font swaps via `size-adjust` and `ascent-override` metric-matched fallbacks. It sits between the upstream aesthetic decisions of typography-font-wasp-drone and the CI infrastructure of devops-wasp-drone, owning everything in between.

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
- The ask is typeface aesthetic selection or fluid type scale construction: that's typography-font-wasp-drone, this Drone starts once a typeface is chosen.
- The ask is build-pipeline CI automation for font subsetting: that's devops-wasp-drone, this Drone provides the exact CLI command, not the pipeline wiring.
- The ask is broader Core Web Vitals measurement beyond CLS: that's seo-aeo-wasp-drone, this Drone is scoped to the CLS consequence of font loading specifically.
- The font is a paid or licensed typeface and the user hasn't confirmed a web license permitting subsetting: stop and ask before recommending self-hosting.

## Inputs the Drone needs
- The presenting symptom: FOIT, FOUT with CLS, FOFT, slow load, or a proactive audit request
- Existing `@font-face` rules, `next/font` usage, or their absence
- Next.js App Router vs Pages Router, since the `next/font` API diverges between them
- Whether the project self-hosts fonts (needs subsetting) or loads from Google Fonts

## Outputs
- Corrected `@font-face` rules with explicit `font-display` and metric-matched fallback overrides
- `<link rel="preload">` markup with `crossorigin="anonymous"` correctly set
- `app/fonts.ts` config for `next/font`, or an exact `pyftsubset`/`glyphhanger` CLI command

## Commonly sequenced with
- typography-font-wasp-drone: supplies the typeface and scale decisions this Drone implements the loading mechanics for
- devops-wasp-drone: automates the subsetting CLI command this Drone specifies into a CI step
- seo-aeo-wasp-drone: measures the broader Core Web Vitals picture this Drone's CLS fix feeds into
