# 01. Detection and sampling

How to confirm commerce is actually present before doing any audit work, and how to pick which up to 25 products get analyzed.

## Phase 0 - confirm commerce is detected

Per PRD-019 AC-1, this Drone's checkpoints resolve to 0/N/A, excluded from the score, whenever no commerce platform is detected. Read `_shared/target-profile.json` (written earlier in the run by `stack-fingerprint-wasp-drone`) for a platform signal: Shopify, Magento, or headless-commerce, per the PRD's own detection scope. If that field is absent or inconclusive, corroborate against `site-data/` directly: product-schema JSON-LD (`@type: Product`), `/products/` or `/collections/` path segments (Shopify-shaped), `/catalog/product/` (Magento-shaped), or a cart/checkout endpoint discovered during crawl. If none of these signals are present, write the `12-ecommerce/` summary's "no commerce detected" branch (per `references/templates/12-ecommerce-summary-template.md`) and stop.

## Phase 1 - platform-specific coverage caveat, stated up front

This Stinger's research (`references/research/distilled-ecommerce-catalog.md`) is strongest for Shopify specifically: two of its five sources (craftshift's 30-point checklist and DTCskills' conversion-copy architecture) are Shopify-only in their worked examples and UX/copy checklist items. The other three sources (schema.org, patrickstox.com, Anglera) are platform-agnostic for the structured-data and technical layer. If `_shared/target-profile.json` indicates a non-Shopify platform (Magento, WooCommerce, BigCommerce, a custom/headless cart), say so explicitly in the run summary and flag which checklist items are verified to transfer (structured data, on-page technical checks) versus which are Shopify-specific and unverified for this platform (swatch-vs-dropdown UX claims, the "Rubik Combined Listings" app-specific colorway-linking recommendation, `product.selected_or_first_available_variant` Liquid-specific default-variant guidance). This is a real, named gap in this Stinger's own research, not an oversight to paper over.

## Phase 2 - sampling methodology (this Stinger's own devised method, not sourced)

This Stinger's research explicitly flags that no source specifies how to allocate an "up to 25 products across categories" sample; the closest available guidance (craftshift's own methodology) recommends 3 products (a top seller, mid-tier, and long-tail product) as a MINIMUM starting sample, not a ceiling, a narrower scope than this Drone's 25-product budget. Because no source fills this gap, this guide states the sampling method explicitly so it is applied consistently rather than improvised per run:

1. Enumerate the distinct product categories visible in the crawled `site-data/` (from a category/collection navigation structure, breadcrumbs, or category-path segments).
2. Divide 25 by the number of categories found, rounding down, to get a per-category quota; if that yields fewer than 3 categories worth of coverage (i.e. very few categories exist), sample more per category rather than leaving the budget unused.
3. Within each category, prefer a spread across position in the category's own listing/sort order (a proxy for popularity/recency where the storefront doesn't expose an explicit best-seller signal) rather than the first N products alphabetically.
4. Never sample all 25 from a single category, per PRD-019's explicit "across categories" requirement, even if one category is much larger than the others.
5. State the actual allocation used in `12-ecommerce/`'s summary (`references/templates/12-ecommerce-summary-template.md`'s "Sampling method" field) so the choice is auditable, not hidden inside the per-product list.

## Phase 3 - hand off to scoring

Once the sample is fixed, move to [02-metadata-completeness-scoring.md](02-metadata-completeness-scoring.md) for the quantified axis and [03-copy-and-conversion-subjective-analysis.md](03-copy-and-conversion-subjective-analysis.md) for the `[subjective]` axis, run both per product before the run-level roll-up in [04-report-and-workspace-output.md](04-report-and-workspace-output.md).
