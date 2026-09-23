# 06. Report format

## Where the report goes

Write the populated `references/templates/analytics-findings-template.md` to `08-analytics/analytics-findings.md` in the shared audit workspace (per `plan/website-auditor-build-plan.md` section 3, this pair's declared write target per its PRD's shared workspace contract). Do not write anywhere else, and do not write to this plugin's own `library/` directory, that directory holds this plugin's own build documentation, not per-run audit findings.

## Required fields on every score

Every leaf score (foundational, industry-specific, de-anonymization) carries three mandatory fields, per the build plan's scoring rules:

1. The numeric value (0-6, boolean checkpoints resolve only to 6 or 1).
2. The evidence pointer: a file path (e.g. into `01-recon/vendor-inventory.md`), a script src string, a raw HTTP response captured this run, or a screenshot reference.
3. A one-line justification.

`audit-scoring-wasp-drone` rejects and returns any score missing one of these three.

## Evidence index

Append every artifact this pass produces (the populated findings file, any raw captures taken during a spot-check) to `_shared/evidence-index.md`, per the build plan's shared-artifact convention: "every artifact, what produced it, when."

## Verification log

Any candidate finding rejected or reframed during this pass (a Tier C name match with no corroboration, a suspected foundational tool that turned out to be something else) is recorded with the reason in the run's verification log, not silently dropped, per conduct rule 4. `audit-reporting-wasp-drone` decides, per the technical/non-technical register split, whether the verification log appears in the customer-facing report; it always appears in the auditor report.

## Labelling subjective findings

Any judgment call (industry-fit inference, a "materially broken" correctness call without a hard evidence pointer) is labelled `[subjective]` inline and kept in a visually separate block from quantified, fingerprint-confirmed findings, per conduct rule 3. This matters downstream: `audit-scoring-wasp-drone`'s rubric and `audit-reporting-wasp-drone`'s two-register report both treat subjective and quantified findings differently.

## Legal-gray-area flags

Any de-anonymization finding carrying a legal-gray-area flag (`references/templates/analytics-findings-template.md` section 3) is never softened into a pass/fail score claim. State what was detected and why it's flagged, and stop. `web-security-posture-wasp-drone` and the customer's own counsel own any legal read beyond that.
