# 06. Report format

## Where the report goes

Write the populated `references/templates/performance-findings-template.md` to `09-performance/performance-findings.md` in the shared audit workspace (per `plan/website-auditor-build-plan.md` section 3, this pair's declared write target per its PRD's shared workspace contract). Do not write anywhere else, and do not write to this plugin's own `library/` directory, that directory holds this plugin's own build documentation, not per-run audit findings.

## Required fields on every score

Every leaf score (CDN presence, caching-header strategy, Core Web Vitals) carries three mandatory fields, per the build plan's scoring rules:

1. The numeric value (0-6; CDN presence resolves only to 6 or 1, the plugin-wide boolean-checkpoint rule; the other two leaves use the full scale).
2. The evidence pointer: an artifact path to a raw header capture (from `references/scripts/cdn-header-scan.py`) or a lab-run/CrUX-PSI capture.
3. A one-line justification.

`audit-scoring-wasp-drone` rejects and returns any score missing one of these three.

## Evidence index

Append every artifact this pass produces (the populated findings file, raw header captures, lab-run output) to `_shared/evidence-index.md`, per the build plan's shared-artifact convention: "every artifact, what produced it, when."

## Verification log

Any candidate finding rejected or reframed during this pass is recorded with the reason in the run's verification log, not silently dropped, per conduct rule 4.

## Labelling subjective findings

Any judgment call beyond presence/absence and internal consistency, most notably a caching-strategy adequacy opinion this Stinger's current archive does not ground, is labelled `[subjective]` inline and kept separate from quantified findings, per conduct rule 3.

## The cross-link line

Every findings file this Stinger produces should carry the cross-link note from `references/templates/performance-findings-template.md`'s header: general Lighthouse/PageSpeed methodology and CWV threshold provenance are `lighthouse-pagespeed-stinger`'s territory, this report covers only what's specific to an external, unauthenticated audit of a site the customer does not necessarily control the infrastructure of. Do not drop this note, it is what keeps a reader (especially the auditor report's technical reader) from assuming this Stinger duplicated or contradicted that Stinger's work.
