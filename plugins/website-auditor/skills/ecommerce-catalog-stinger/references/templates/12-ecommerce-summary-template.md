# `12-ecommerce/` run output template

This is the roll-up file this Drone writes to the run workspace's `12-ecommerce/` folder (per the build plan's shared-workspace spec and PRD-019's shared-workspace contract: reads `site-data/` and `_shared/target-profile.json`, writes `12-ecommerce/`). One copy per run, one `### {N}. {Product name}` block per sampled product using `product-finding-template.md`.

```markdown
# Ecommerce catalog audit

**Commerce platform detected:** {yes | no} - {Shopify | Magento | headless-commerce | other, per `_shared/target-profile.json`}

If **no**: stop here. Per PRD-019 AC-1, this checkpoint resolves to 0/N/A and is excluded from the score. State plainly what signal (or absence of one) in `_shared/target-profile.json` led to this conclusion, and stop. Do not sample zero products and call it a pass.

If **yes**, continue:

- **Products sampled:** {count, up to 25} across {N} categories
- **Sampling method:** {see `guides/01-detection-and-sampling.md`; state the actual allocation used this run, e.g. "5 categories x 5 products, one best-seller/one mid-tier/one long-tail per category where category size allowed" - this Stinger's own devised method, not sourced, per its research's own flagged gap}
- **Platform-specific caveat:** {state whether the platform is Shopify (full checklist coverage) or another platform (structured-data/technical checks apply, UX/copy-checklist items unverified to transfer, see distilled research section 7)}

## Per-product findings

{One block per product, using `product-finding-template.md`, numbered 1 through however many were sampled.}

## Cross-catalog observations [subjective]

{Optional, 2-4 sentences max. Patterns across the sample only, e.g. "structured-data completeness is materially worse on the {category} category than elsewhere" or "every sampled product uses a text dropdown rather than swatches for color variants." Still labelled `[subjective]` if it involves judgment beyond a plain count.}

## Verification log

{Any candidate finding that was rejected or reframed during this pass, with the reason, per this pair's conduct rules (PRD-019). Not silently dropped.}

- {finding candidate} - {rejected/reframed} - {reason}

## Evidence index

{Every artifact this pass produced or relied on: `product-schema-checklist.py` output path, each product's page path from `site-data/`, `_shared/target-profile.json`, and the distilled-research file(s) any subjective-axis claim traced to.}
```
