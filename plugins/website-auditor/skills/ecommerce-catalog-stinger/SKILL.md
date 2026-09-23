---
name: "ecommerce-catalog-stinger"
description: "Bonus, conditional ecommerce audit: up to 25 products, schema.org Product metadata completeness (quantified) plus subjective copy/conversion quality, kept separate. Wave W6b."
license: AGPL-3.0-or-later
compatibility: "Claude Code, Cursor, ChatGPT Codex, Claude Cowork."
metadata:
  hive-tier: stinger
  hive-drone: ecommerce-catalog-wasp-drone
  research-window: "2026-08-18 (three-round sweep, same day)"
  primary-surface: external-website-audit
---

# Ecommerce Catalog Stinger

> **Forge status:** stages 1-6 complete (Topic, Research, Distillation, References, Guides, Component authorship). Stage 7 (Register: pair registration in `pest-controller-suit`, deploy, sync references) has not run yet. Every claim below traces to `references/research/raw/` or to this repo's own plan/PRD documents, cited inline; the platform-coverage and sampling-allocation gaps named in `references/research/distilled-ecommerce-catalog.md` section 7 carry through and are flagged wherever they matter rather than silently papered over.

## Purpose

Equips **ecommerce-catalog-wasp-drone** to run a bonus, conditional audit of up to 25 products, sampled across distinct categories, on a target commerce site. Splits findings into a quantified metadata-completeness axis (schema.org `Product` field presence by Google surface, on-page technical checks) and a `[subjective]` on-page copy and conversion-potential axis, kept strictly separate per this pair's conduct rules. Full scope and acceptance criteria: [prd-019-ecommerce-catalog](../../library/requirements/backlog/prd-019-ecommerce-catalog/prd-019-ecommerce-catalog-index.md).

Every factual claim traces to a downloaded primary source in `references/research/raw/`: five sources covering a Shopify-specific UX/conversion checklist, a platform-agnostic technical/structured-data checklist, schema.org's own canonical `Product` vocabulary, an independent Google-surface required/recommended breakdown, and a whole-page conversion-copy architecture. Two named gaps carry through every guide and template that touches them: non-Shopify platforms are not directly sourced for the UX/copy checklist items, and no source specifies how to allocate the 25-product sample, this Stinger states its own sampling method explicitly for exactly that reason.

## When to use

- Wave W6b, and ONLY when a commerce platform (Shopify, Magento, or headless-commerce) was detected during crawl or fingerprinting, corroborated via `_shared/target-profile.json` and/or `site-data/` structured-data signals. This is a conditional-activation Stinger: if no commerce platform is detected, this Drone's checkpoints resolve to 0/N/A and are excluded from the score, per PRD-019 AC-1.
- Any request specifically about product-page metadata completeness, structured-data eligibility, or product-copy conversion quality on a target commerce site.

## When not to use

- The site has no commerce platform detected. Confirm this first per [guides/01-detection-and-sampling.md](guides/01-detection-and-sampling.md) Phase 0, then stop.
- Live Core Web Vitals measurement, that's `performance-cwv-stinger`'s scope, this Stinger only names the CWV thresholds as context and cross-references that Drone's output.
- General on-page technical SEO unrelated to product schema (robots.txt, sitemap, canonical strategy site-wide), that's `technical-seo-stinger`'s scope.
- Blog or content-marketing analysis, that's `blog-content-stinger`'s scope, this Stinger's sibling in wave W6.
- Placing an order, adding to cart, or any state-creating interaction with the target, that requires an explicit per-run opt-in that defaults OFF and is out of this Stinger's default read-only scope.

## Procedure

1. Confirm commerce is detected and state the platform-specific coverage caveat up front (Shopify-strong research versus platform-agnostic technical layer only). If not detected, write the honest N/A branch and stop. See [guides/01-detection-and-sampling.md](guides/01-detection-and-sampling.md) Phase 0-1.
2. Sample up to 25 products across distinct categories using this Stinger's own stated allocation method, and record the actual allocation used. See [guides/01-detection-and-sampling.md](guides/01-detection-and-sampling.md) Phase 2.
3. Run `references/scripts/product-schema-checklist.py` against each sampled product's crawled page for the quantified structured-data completeness score by Google surface, then apply the manual truthfulness/scoping/on-page technical checks the script cannot perform. See [guides/02-metadata-completeness-scoring.md](guides/02-metadata-completeness-scoring.md).
4. For each sampled product, write the `[subjective]` copy and conversion-potential read: title/description quality, the DTCskills whole-page architecture check, variant/stock UX, kept separate from the quantified findings. See [guides/03-copy-and-conversion-subjective-analysis.md](guides/03-copy-and-conversion-subjective-analysis.md).
5. Assemble the run's `12-ecommerce/` output using `references/templates/12-ecommerce-summary-template.md` and `references/templates/product-finding-template.md`, including the verification log and evidence index. See [guides/04-report-and-workspace-output.md](guides/04-report-and-workspace-output.md).
6. Hand off. This Drone does not score or assemble the final customer/auditor report, `audit-scoring-wasp-drone` and `audit-reporting-wasp-drone` consume `12-ecommerce/` downstream.

## References map

- `references/research/distilled-ecommerce-catalog.md`, load when verifying any metadata-completeness or copy-quality claim fast, or resolving where a required/recommended field split came from.
- `references/research/raw/`, load when tracing a distilled claim back to its primary source (five files: craftshift's Shopify checklist, Anglera's technical/agent-readability checklist, schema.org's own `Product` page, patrickstox.com's Google-surface breakdown, DTCskills' conversion-copy architecture).
- `references/templates/product-finding-template.md`, load when writing any single product's finding, the exact required shape for the quantified table and the `[subjective]` section.
- `references/templates/12-ecommerce-summary-template.md`, load when assembling the run-level `12-ecommerce/` output.
- `references/scripts/product-schema-checklist.py`, run once per sampled product's page against `site-data/`, see `references/scripts/README.md`.
- `guides/01-detection-and-sampling.md` through `guides/04-report-and-workspace-output.md`, load in order for a first pass, or individually once familiar with the procedure.

## Related drones and stingers

- [blog-content-stinger](../blog-content-stinger) - sibling bonus/conditional Stinger, runs in parallel in wave W6a when a blog is detected; no data dependency between the two.
- [performance-cwv-stinger](../performance-cwv-stinger) - live Core Web Vitals measurement in wave W5; consult for the actual LCP/INP/CLS numbers this Stinger's research only names as a threshold, not measures.
- [technical-seo-stinger](../technical-seo-stinger) - site-wide technical SEO in wave W5; consult for canonical/robots/sitemap findings outside the product-page structured-data scope this Stinger owns.
- [blog-content-wasp-drone](../../agents/blog-content-wasp-drone.md) - this Stinger's sibling Drone; the orchestrator dispatches both in parallel when their respective content types are detected.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [blog-content-stinger](../blog-content-stinger) - sibling bonus/conditional Stinger, wave W6a.

## Ship Gate decision

Ship Gate removed: research-only Stinger. This Drone never commits, edits, or pushes code, it reads an already-crawled `site-data/` corpus (and `_shared/target-profile.json`) and writes audit findings to the run's own external workspace folder (`12-ecommerce/`), never to this repository's tracked source. `security-stinger`, `quality-stinger`, and `github-repo-health-stinger` gate work that touches this repository's own codebase; this Stinger produces no such diff, and by conduct rule never places an order or creates cart/checkout state on the target without an explicit per-run opt-in that defaults OFF, so the Ship Gate does not apply.
