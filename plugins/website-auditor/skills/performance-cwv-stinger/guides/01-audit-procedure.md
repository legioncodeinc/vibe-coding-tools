# 01. Audit procedure

Read this guide first on every invocation. Grounded in this pair's PRD ([prd-016-performance-cwv](../../../library/requirements/backlog/prd-016-performance-cwv/prd-016-performance-cwv-index.md)) and the build plan's scoring rubric and conduct rules.

## Sequencing

This Stinger equips `performance-cwv-wasp-drone`, which runs in wave W5, the nine-wide parallel wave. It starts only after `site-crawler-wasp-drone` has finished and `site-data/` exists, that's its one declared read per this pair's PRD's shared workspace contract.

## Procedure

1. **Load inputs.** Read `site-data/` to build the sampled page set. Use the same page set (or a documented, representative subset of it) that other Wave 5 Drones are working from, so findings stay comparable across the audit.
2. **Capture CDN and caching headers.** Run `references/scripts/cdn-header-scan.py` against the sampled URLs, this is a fresh, read-only HEAD (or fallback GET) request at run time, not a re-read of the static crawl, because `site-data/`'s HTML/Markdown capture does not preserve HTTP response headers. Evidence is captured at the moment of finding, per conduct rule 2. Load `guides/02-cdn-and-caching-headers.md` for header interpretation.
3. **Collect Core Web Vitals.** Use the shared `cwv-collect.py` script (per `shared/scripts/README.md`) once implemented for lab data; use PageSpeed Insights/CrUX for field data where coverage exists for the domain. Load `guides/03-core-web-vitals-thresholds.md` for the three published thresholds and `guides/04-inp-diagnosis.md` for INP specifically, the metric with the most audit-relevant nuance.
4. **Score.** Apply the plugin-wide zero-to-six scale to the three leaves under "Technical deployment" (11% of the final grade): CDN presence (3%), caching-header strategy (4%), Core Web Vitals (4%). Every score carries a numeric value, an evidence pointer, and a one-line justification.
5. **Do not re-derive Lighthouse/PageSpeed methodology.** For anything beyond this Stinger's own external-audit-specific scope, cross-link `lighthouse-pagespeed-stinger` rather than duplicating its research. Load `guides/05-external-audit-vs-lighthouse-ci.md` for the exact boundary and how to phrase the cross-link in a finding.
6. **Log rejected/reframed candidates** to the run's verification log, per conduct rule 4.
7. **Write the report.** Populate `references/templates/performance-findings-template.md` and write it to `09-performance/performance-findings.md`. Load `guides/06-report-format.md` for the exact convention. Update `_shared/evidence-index.md`.

## Evidence discipline

Capture evidence at the moment of finding, a raw HTTP response header capture, a lab-run artifact path, or a CrUX/PSI API response, never reconstructed from memory later, per conduct rule 2. Any judgment beyond presence/absence of a caching header (adequacy of a specific `max-age` value for a specific page type) is a documented research gap in this Stinger's archive, label it `[subjective]` and keep it separate from quantified findings, per conduct rule 3.

## What this Drone does not do

- It does not run a CI-integrated Lighthouse pass on a repository the customer owns. That's `lighthouse-pagespeed-wasp-drone`'s job, on a different subject entirely (an owned repo, not an external target). See `guides/05-external-audit-vs-lighthouse-ci.md`.
- It does not assert that a specific caching configuration is "correct" for a specific page type beyond presence, absence, and internal consistency. That adequacy judgment is unresearched in this archive, see `guides/02-cdn-and-caching-headers.md`.
- It does not treat a missing CrUX/PSI field-data record as a failing score. Low-traffic domains legitimately have no CrUX coverage; note it as a limitation, not a defect.
