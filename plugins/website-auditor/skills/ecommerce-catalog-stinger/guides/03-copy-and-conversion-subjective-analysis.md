# 03. Copy and conversion-potential analysis (subjective)

The `[subjective]` half of this Drone's job, per PRD-019: on-page copy quality and conversion-potential, kept separate from the quantified metadata-completeness axis in [02-metadata-completeness-scoring.md](02-metadata-completeness-scoring.md).

## Title and description

- **Title:** should contain the buyer's likely search term, not only an internal/brand product name. The research's own worked contrast: an internal name like "Sarah Bra" versus what a customer actually searches, "Sarah High-Support Sports Bra," pairing brand, category, and key attribute. [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md] Quote the product's actual title and, if it fails this check, name what a better title would look like.
- **Description opening:** should lead with concrete specifications (materials, dimensions, key features), not marketing language. Worked contrast: "40L waterproof hiking backpack with laptop compartment" (passes) versus "Adventure Day Pack" (fails), on the reasoning that both human readers and AI shopping agents lose the marketing-fluff opener; personality copy can follow the specs, it should not precede them. [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]

## Whole-page conversion architecture

Check the product page against the DTCskills 9-section framework, read as a pattern to look for, not a mandatory template every page must match verbatim, since this Drone's scope spans arbitrary storefronts and categories, not only DTC-style Shopify pages: [raw/dtcskills-com-blog-shopify-product-page-copywriting.md]

1. **Hook** - does the opening stop the scroll by naming a problem/outcome, or does it just restate the product name?
2. **Social proof (first touch)** - is a star rating, review count, or short quote visible before the full description?
3. **Feature-benefit bridges** - are 3-5 features translated into buyer outcomes ("which means... so you can..."), or is it a bare feature list?
4. **Mechanism** - is there any explanation of why the product works differently than alternatives?
5. **Objection handling** - are the likely reasons people don't buy addressed anywhere on the page?
6. **Authority** - any credibility signal beyond reviews (press, certifications, expert endorsement)? (Note: this section's full detail was not captured in this Stinger's own archived research, treat absence-of-evidence here as a research gap, not grounds for a harsher score than the covered sections.)
7. **Secondary social proof** - a full review section (photos, verified-purchase badges, specific result quotes), distinct from the single first-touch quote in step 2?
8. **Risk reversal** - any guarantee, free returns, or trial-period language? (Same research-gap caveat as Authority above.)
9. **CTA** - one clear primary action, price and any bundle savings stated cleanly?

Report which sections are present and which are missing, do not force a numeric score onto this checklist, it's a pattern-presence read, not a points system.

## Variant and stock UX

- **Variant picker:** color presented as visual swatches (recommended, reduces clicks and outperforms dropdowns on conversion per the source's own summary claim, no specific study cited in the archived text, treat as the source's opinion, not a sourced statistic) versus a plain text dropdown. [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]
- **Swatch color fidelity:** does a named color (e.g. "Forest Green") render as the actual product's hex, or a generic CSS-named color? [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]
- **Out-of-stock handling:** sold-out variants struck through or fully hidden (both acceptable) versus an ambiguous grey-with-no-indicator treatment (flagged as confusing); a default-selected sold-out variant is an immediate-fix issue. [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]
- **Size/fit guidance:** present for apparel/footwear/accessories categories specifically (chart, modal, or inline), claimed to reduce returns and improve first-visit conversion. [raw/craftshift-com-shopify-product-page-30-point-audit-2026.md]

## Platform-specificity discipline

Several of the checks above (swatch UX claims, the Shopify `product.selected_or_first_available_variant` Liquid guidance, the "Rubik Combined Listings" colorway-linking recommendation) are Shopify-specific in their sourcing. If the sampled storefront is on a different platform, still apply the underlying principle (is color variant selection usable, is a sold-out product's default state broken) but say explicitly that the Shopify-specific implementation detail hasn't been verified to transfer, per `guides/01-detection-and-sampling.md`'s Phase 1 caveat.

## Writing the conversion-potential read

One to two sentences, explicitly labelled as a judgment, synthesizing the above rather than restating every bullet. Do not present it as a numeric conversion-rate prediction, this Stinger's research contains no data that would support one; it is a qualitative read of whether the page architecture and copy work toward or against a purchase decision.
