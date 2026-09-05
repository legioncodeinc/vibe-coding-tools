# Guide 04: Building the Branded PDF

## The pipeline

Author a single self-contained HTML file (inline CSS, base64-embedded logo SVGs, Google Fonts `@import` if the environment has network access, which the standard cloud workspace does), then render it to PDF with headless Chromium via Playwright:

```python
await page.goto(f"file://{html_path}")
await page.evaluate("document.fonts.ready")
await page.wait_for_timeout(500)
await page.pdf(path=out_path, print_background=True, width="8.5in", height="11in",
                margin={"top": "0", "bottom": "0", "left": "0", "right": "0"})
```

Use `@page { size: letter; margin: 0; }` in the stylesheet and handle all spacing via padding on a `.page` wrapper per printed page, with `page-break-after: always` on every page section except the last.

## Brand kit discovery, before writing any CSS

1. Locate the connected or referenced brand/marketing repo.
2. Read whatever top-level brand guide or README exists, and CONFIRM the product name inside it matches the subject company. A connected marketing repo is not guaranteed single-product; brand kits for sibling products or a parent company routinely live in the same repo. If the top-level guide belongs to a different product, look for a nested `products/<name>/` or similarly scoped folder before assuming no brand kit exists.
3. If genuinely ambiguous, ask the user rather than guessing which brand identity to apply; building a fully-branded deliverable with the wrong company's identity is a worse failure mode than asking one clarifying question.
4. Extract: logo SVG files (note whether they use `fill="currentColor"` and need recoloring, see Defect 1 below), the categorical/chart-series color set if the brand doc names one, the print/PDF-specific palette if the brand doc states one (many dark-native brands specify a light palette for print artifacts specifically; follow that literally), and the type family.

Full narrative: `../references/research/distilled-competitive-research.md`, section 4.

## Four defects to actively guard against (all field-verified)

### 1. Invisible logo (black-on-black or white-on-white)
An SVG that sets `fill="currentColor"` in more than one place (commonly the root `<svg>` tag AND a body `<path>`) needs every occurrence replaced when recoloring it for embedding in a data-URI `<img>` tag, because `currentColor` has no CSS context to resolve against inside an embedded SVG document. A count-limited string replace is the classic bug:

```python
# WRONG: only fixes the first occurrence, body silently stays black
svg = svg.replace('fill="currentColor"', f'fill="{color}"', 1)

# RIGHT: fixes every occurrence
svg = svg.replace('fill="currentColor"', f'fill="{color}"')
```

### 2. Orphaned blank page from footer overflow
A footer pinned with `margin-top: auto` inside a `flex-direction: column` page wrapper with `min-height: 11in` is fragile the moment content height approaches the page boundary. When content overflows past 11in, the auto margin collapses to zero and the print engine slices the footer alone onto the next physical page, an entirely blank-looking page except for a footer line.

Guard against it by budgeting vertical space defensively: reduce row/cell padding on any data table whose row count is data-driven (largest category, not a fixed assumption), and after every build, render every page to PNG and visually check page count and content against expectations. Do not trust "the PDF built without an error" as evidence of correctness.

A cheap automated pre-screen for a large page count: rasterize every page and compute the fraction of near-white pixels per page; anything above roughly 0.98 that is not a legitimately sparse page (e.g. a single-row table) should get a manual look before delivery.

### 3. Banned punctuation surviving into final copy
If the user or the target brand's own voice guide bans a specific character (the em dash is the most common), grep explicitly for it as a final step before delivery, both the literal character and its HTML entity form (`&mdash;`), rather than trusting it was avoided while drafting. This applies to every page of prose, including narrative/insight sections, not just the obvious cover copy.

### 4. A brand's own "categorical" palette is not automatically colorblind-safe
Before building any chart that shows more than one hue simultaneously (a market map, a multi-series bar chart), run the palette through the `dataviz` skill's validator:

```bash
node <dataviz-skill-path>/scripts/validate_palette.js "<hex,hex,hex,hex>" --mode light --pairs all
```

Always pass `--pairs all`, not the default (which only checks adjacent pairs in list order); a chart showing all colors simultaneously needs every pair to be distinguishable, not just neighbors in an arbitrary list. If the palette fails and cannot be re-stepped within the brand's own approved hues, do not force it. Facet into single-hue charts instead, one color per chart panel, which sidesteps the categorical-distinction requirement entirely and is the dataviz skill's own sanctioned fallback for this exact situation.

## Standard report structure

See `../references/pdf-report-outline.md` for the page-by-page sequence used in the reference build (cover, executive summary, market pattern analysis with computed statistics and charts, one page per competitor category, sales battlecards, feature roadmap). Adapt the sequence to what the user actually asked for; do not pad a report with sections nobody requested.

## Verification checklist before delivery

Full checklist: `05-market-insights-and-battlecards.md` covers content quality; `06-qa-checklist.md` is the final mechanical pass. At minimum before ANY branded PDF ships: every page rendered to PNG and visually inspected, page count matches expectation, logo visibly renders on every page it appears on, no banned punctuation present, and any multi-hue chart's palette has been run through the validator.
