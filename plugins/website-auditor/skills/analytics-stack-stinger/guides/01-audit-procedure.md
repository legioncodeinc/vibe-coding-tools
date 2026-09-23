# 01. Audit procedure

Read this guide first on every invocation. Grounded in this pair's PRD ([prd-015-analytics-stack](../../../library/requirements/backlog/prd-015-analytics-stack/prd-015-analytics-stack-index.md)) and the build plan's scoring rubric and conduct rules.

## Sequencing

This Stinger equips `analytics-stack-wasp-drone`, which runs in wave W5, the nine-wide parallel wave. It starts only after `site-crawler-wasp-drone` has finished (site-data/ exists), and it depends specifically on two earlier outputs, not on the other eight W5 Drones:

1. `01-recon/vendor-inventory.md`, written by `vendor-inventory-wasp-drone` in wave W1b.
2. `02-positioning/`, written by `icp-positioning-wasp-drone` in wave W2.

Read both before doing anything else. If either is missing or incomplete, stop and report the gap rather than guessing at a vendor census or a niche.

## Procedure

1. **Load inputs.** Read `01-recon/vendor-inventory.md` in full. Read `02-positioning/` for niche, ICP, and buyer-stage context.
2. **Classify each vendor.** For every vendor `vendor-inventory.md` tags as analytics- or tracking-related (or that a Tier A/B/C signature in `references/templates/vendor-classification-table.md` matches during a spot-check), assign it to one of: foundational analytics, industry-specific analytics, de-anonymization/visitor-identification, or "not this Stinger's scope" (e.g. a pure content-injection vendor, which stays with `vendor-inventory-wasp-drone`). Load `guides/02-foundational-analytics-coverage.md`, `guides/03-industry-specific-analytics.md`, and `guides/04-deanonymization-and-jurisdiction.md` as needed for each bucket.
3. **Cross-check the tag-management layer.** If Google Tag Manager is present per `vendor-inventory.md` or a Tier A signature match, load `guides/05-tag-manager-and-injection-cross-check.md` before finalizing scores, GTM is commonly the delivery mechanism for exactly the vendors this Stinger scores.
4. **Score.** Apply the plugin-wide zero-to-six scale (0 = N/A/no-op, 1 = F/critical, ... 6 = A/none, boolean checkpoints resolve only to 6 or 1) to each of the three leaves: foundational (5% of the Analytics and insight category), industry-specific (4%), de-anonymization (3%). Every score carries a numeric value, an evidence pointer, and a one-line justification, per the build plan's scoring rules. A score without all three is rejected by `audit-scoring-wasp-drone` and returned.
5. **Flag, do not adjudicate, jurisdiction.** For any de-anonymization tooling detected, follow `guides/04-deanonymization-and-jurisdiction.md`'s flagging discipline. This Stinger never renders a compliance verdict, per this pair's PRD non-goal; it flags what's present and defers the legal read to the customer's own counsel and to `web-security-posture-wasp-drone`'s broader posture read.
6. **Log rejected/reframed candidates.** Any candidate finding that fails verification (a Tier C name match with no corroborating evidence, a suspected foundational tool that turns out to be something else) is recorded in the run's verification log with the reason, not silently dropped, per conduct rule 4.
7. **Write the report.** Populate `references/templates/analytics-findings-template.md` and write it to `08-analytics/analytics-findings.md`. Load `guides/06-report-format.md` for the exact convention. Update `_shared/evidence-index.md` with every artifact this pass produced.

## Evidence discipline

Capture evidence at the moment of finding, an artifact path, a script src string, a raw HTTP response, or a screenshot, never reconstructed from memory later, per conduct rule 2. Subjective judgments (e.g. "industry-appropriate tooling" inferred rather than fingerprint-confirmed) are labelled `[subjective]` and kept separate from quantified findings, per conduct rule 3.

## What this Drone does not do

- It does not re-detect vendors from scratch; `vendor-inventory-wasp-drone` already did the census. This Stinger classifies and scores what that census found, plus a targeted de-anonymization/foundational cross-check where the census's own signatures don't cover this Stinger's specific scoring buckets.
- It does not score consent-banner adequacy, cookie-mechanics compliance, or render any GDPR/CCPA verdict. Flag presence and jurisdiction, nothing more, per `guides/04-deanonymization-and-jurisdiction.md`.
- It does not score the content-injection/write-back risk class (e.g. Search Atlas OTTO Pixel). That is `vendor-inventory-wasp-drone`'s and `web-security-posture-wasp-drone`'s finding; this Stinger only cross-references it when a vendor overlaps both classes.
