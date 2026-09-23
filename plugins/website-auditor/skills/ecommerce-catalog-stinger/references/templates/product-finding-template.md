# Per-product finding template

Copy this block once per sampled product (up to 25, across distinct categories, per PRD-019 AC-2). Metadata completeness is quantified; copy and conversion-potential are `[subjective]`. Keep both axes in their own labelled subsections, per this Stinger's conduct rule, never blend a quantified count into a subjective sentence or vice versa.

```markdown
### {N}. {Product name} ({category})

- **URL:** {url}
- **Category:** {category label used for the sampling spread, see `guides/01-detection-and-sampling.md`}

**Metadata completeness (quantified)**

| Check | Result | Source |
|---|---|---|
| `name` | {present/absent} | on-page JSON-LD |
| `image` count and quality | {count}, {pass/fail against the 5-image floor and resolution checks} | [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md] |
| Alt text (sample) | {N}/{sample size} descriptive | [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md] |
| Structured-data score, product snippet surface | {present}/{total} required fields | `product-schema-checklist.py` |
| Structured-data score, merchant listing surface | {present}/{total} required fields | `product-schema-checklist.py` |
| Missing required fields (either surface) | {list, or "None"} | `product-schema-checklist.py` |
| Missing recommended fields (either surface) | {list, or "None"} | `product-schema-checklist.py` |
| Price/availability on-page vs. JSON-LD agreement | {match/mismatch, with the two values quoted} | `guides/02-metadata-completeness-scoring.md` |
| Meta title/description uniqueness | {unique/templated-duplicate} | [raw/www-anglera-com-blog-enriched-data-to-page-checklist.md] |

**[subjective] Copy and conversion-potential analysis**

- **Title:** {does it use the buyer's likely search term, or only an internal/brand name - give the actual title text and, if failing, what a better title would look like} [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]
- **Description opening:** {leads with concrete specs, or leads with marketing language - quote the actual opening clause} [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]
- **Whole-page architecture check** (against the DTCskills 9-section framework, read as a pattern to check for, not a mandatory template, see `guides/03-copy-and-conversion-subjective-analysis.md`): {which of Hook / Social proof / Feature-benefit bridges / Objection handling / Trust signals / CTA are present, which are missing} [raw/dtcskills-com-blog-shopify-product-page-copywriting.md]
- **Variant/out-of-stock UX:** {swatches vs. dropdown, sold-out handling, default-variant selection if checkable} [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]
- **Conversion-potential read:** {1-2 sentence overall judgment, explicitly labelled as a judgment, not a score}

Platform caveat: if this storefront is not Shopify, say so here and note which of the above checks are platform-agnostic (structured data, on-page technical checks) versus Shopify-specific UX/copy checklist items that have not been verified to transfer, per this Stinger's research gap (see `references/research/distilled-ecommerce-catalog.md` section 7).
```
