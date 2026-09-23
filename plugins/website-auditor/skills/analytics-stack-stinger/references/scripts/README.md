Most deterministic scripts for this plugin live in the shared `shared/scripts/` folder at the plugin root, per the build plan's "shared where the use case is genuinely shared" instruction. See that folder's README for the full centrally-planned list.

None of the eleven centrally-planned shared scripts is this Stinger's own detection layer: `vendor-census.py` belongs to `vendor-inventory-stinger` and produces `01-recon/vendor-inventory.md`, which this Stinger reads as an input rather than re-detecting from scratch, per this pair's PRD (`01-recon/vendor-inventory.md`, `02-positioning/` are its declared reads).

This folder carries one local script specific to this pair's own scoring layer:

| Script | Purpose |
|---|---|
| `analytics-vendor-classify.py` | Classifies vendors already surfaced in `vendor-inventory.md` (or a raw `site-data/` sweep) into this Stinger's three buckets: foundational analytics, de-anonymization candidates, and a content-injection cross-reference flag. Tiered by grounding strength: Tier A (Google Tag Manager, cited to this Stinger's raw research), Tier B (common foundational-analytics platform signatures, general public knowledge, not archive-sourced), Tier C (de-anonymization vendor name matches, unconfirmed candidates only, no fingerprint exists in this archive). See `references/templates/vendor-classification-table.md` for the full tier explanation and `guides/04-deanonymization-and-jurisdiction.md` for how a Tier C match should be handled before it becomes a reported finding. |

Do not add a de-anonymization vendor fingerprint to this script from general knowledge or an LLM's training data. Per this Stinger's own research gap note (`references/research/distilled-analytics-stack.md`, section 6), no primary source in this archive documents one; a dedicated research pass is required first.
