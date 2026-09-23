# 02. Metadata completeness scoring (quantified)

The quantified half of this Drone's job: structured-data field completeness and on-page metadata checks. Kept strictly separate from the `[subjective]` copy/conversion read in [03-copy-and-conversion-subjective-analysis.md](03-copy-and-conversion-subjective-analysis.md), per PRD-019's own conduct rules.

## Phase 1 - run the structured-data completeness script

For each sampled product's crawled page, run `references/scripts/product-schema-checklist.py`:

```
python3 references/scripts/product-schema-checklist.py --site-data <run-workspace>/site-data --out <run-workspace>/12-ecommerce/schema-completeness.json
```

The script extracts every `Product`-typed JSON-LD node and checks it against the exact required/recommended field lists for both Google surfaces (product snippet, merchant listing), transcribed from `references/research/distilled-ecommerce-catalog.md` section 3, itself citing [raw/patrickstox-com-technical-seo-on-page-structured-data-commerce-product-schema.md] and [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md], with property definitions corroborated against [raw/schema-org-product.md]. Report the per-surface `present/total` score and missing-field lists exactly as the script returns them, do not hand-recompute or round them.

## Phase 2 - the script checks presence, not truthfulness, that's a manual step

A field being present in JSON-LD does not mean it is accurate. Cross-check, for each sampled product:

- **Price and availability agreement.** Does the JSON-LD `price`/`availability` match what a human shopper would actually see rendered on the page? [raw/patrickstox-com-technical-seo-on-page-structured-data-commerce-product-schema.md] and [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] both flag this reconciliation as a distinct, separately-checked concern from vocabulary validity, not something JSON-LD presence alone can confirm. A mismatch here is a quantified finding (the two values are objectively different), report both values quoted.
- **Single-product scoping.** Per Google's own guidance (quoted via patrickstox.com): "product rich results only support pages that focus on a single product (or multiple variants of the same product)." A category/listing page marked up as one `Product` is invalid; a genuine variant line should use `ProductGroup`/`isVariantOf` rather than duplicating one `Product` block per variant on a single URL. [raw/patrickstox-com-technical-seo-on-page-structured-data-commerce-product-schema.md] [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] Flag any violation the script's raw JSON-LD extraction surfaces (e.g. a page whose Product node's `name` reads like a category name, not a specific item).

## Phase 3 - on-page technical checks not covered by the script

These are still quantified (pass/fail or count-based), just not automatable from a single page fetch in this pass, check manually against the crawled `.html`/rendered content:

| Check | Requirement | Source |
|---|---|---|
| Image count | At least 5 images per product as a floor | [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md] |
| Alt text presence/quality | Sample 10 images at random; if more than 2 fail (missing, or filename-as-alt like "IMG_4521"), flag the whole catalog, not just the sampled product | [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md] |
| Meta title/description uniqueness | Not templated so tightly every variant reads identically | [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] |
| Canonical tag | Self-referencing, present in the original HTML (not JS-injected only) | [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] |
| Rendering check | Verify enriched content is present in raw HTML via `view-source:`/`curl`-equivalent read of the already-crawled page, not a post-render DOM assumption, since most AI crawlers (GPTBot, ClaudeBot, PerplexityBot, named specifically) do not execute JavaScript | [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] |
| Lazy-loading on hero image | Flag if `loading="lazy"` is set on the primary product image specifically | [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] |

Core Web Vitals thresholds (LCP < 2.5s, INP < 200ms, CLS < 0.1) are named in this Stinger's research as the current bar [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md], but live CWV measurement is `performance-cwv-wasp-drone`'s scope (wave W5), not this Drone's, cross-reference that Drone's `09-performance/` output rather than re-measuring here.

## Reporting

Every row in `references/templates/product-finding-template.md`'s "Metadata completeness (quantified)" table must cite its source, either the script's own output or a `[raw/...]` citation from the list above. A quantified finding with no traceable source is not ready to report.
