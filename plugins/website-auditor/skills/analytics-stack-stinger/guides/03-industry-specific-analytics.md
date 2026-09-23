# 03. Industry-specific analytics

Scores the 4%-weighted leaf under the Analytics and insight category. This is the leaf with the thinnest grounding in this Stinger's current research archive: no raw source here catalogs "what analytics tooling a given industry typically runs." Every judgment on this leaf is inference from `02-positioning/`'s niche/ICP determination plus what `01-recon/vendor-inventory.md` actually found, not a fingerprint-confirmed fact. Label findings on this leaf `[subjective]` per conduct rule 3, unless a specific vendor's stated purpose (from its own product description, not this Stinger's guesswork) makes the industry fit self-evident.

## Procedure

1. Read `02-positioning/` for the site's niche, ICP, and buyer-stage classification. This is the hard gate's output, `icp-positioning-wasp-drone` already determined it; do not re-derive it here.
2. Ask: given this niche, is there a category of analytics tooling a comparable site would typically run beyond foundational (GA4-class) coverage? Examples of the reasoning pattern, not a exhaustive or archive-sourced list:
   - An e-commerce site would typically pair foundational analytics with commerce-specific attribution or platform-native analytics (e.g. a Shopify store's own Shopify Analytics).
   - A SaaS/product site would typically pair foundational analytics with a product-analytics tool tracking in-app events, not just page views.
   - A local-service business's "industry-specific" bar is lower, foundational coverage plus basic conversion tracking (form fills, click-to-call) may be the reasonable ceiling; do not penalize a local-service site for lacking product analytics it has no use for.
3. Check whether `01-recon/vendor-inventory.md` shows anything matching that expectation. If nothing does, that's the finding, not an assumption that the tool must be present.
4. Score using the plugin-wide 0-6 scale. Because this leaf's expectation itself is inferred, be conservative: a 1 (critical/F) requires a clear, defensible case that the site's own stated goals (from `02-positioning/`) depend on tooling that is visibly absent, not just "most sites like this have X."

## Scoring guidance

- **0 (N/A):** The niche has no meaningful industry-specific analytics category beyond foundational coverage, e.g. a simple informational/brochure site with no commerce or product surface. Excluded from both numerator and denominator, never a failure.
- **1-2 (F/D):** A clear industry-specific tooling gap exists relative to the site's own stated conversion actions or business model from `02-positioning/`.
- **3 (C):** Baseline industry-appropriate tooling present.
- **4-6 (B minus through A):** Industry-appropriate tooling present and, where determinable, correctly scoped to the site's actual conversion actions.

## Honesty requirement

Every finding on this leaf must state its inference basis in the justification line, e.g. "inferred from 02-positioning/niche.md's e-commerce classification, not from a vendor-specific fingerprint." Do not present an inference as a fingerprint-confirmed fact. If `audit-reporting-wasp-drone` later needs to distinguish subjective from quantified findings in the customer report, the `[subjective]` label is what makes that possible.
