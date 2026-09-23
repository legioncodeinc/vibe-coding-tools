# Report writing and handoff to audit-scoring-wasp-drone

Final step of every pass. Read `references/templates/security-findings-output-template.md` alongside this guide.

## 1. Write order

1. `07-security/header-scan-findings.json`, the unmodified `security-headers.py` output.
2. `07-security/header-checklist-results.md`, reconciled against manual judgment.
3. `07-security/client-side-injection.md`, the vendor cross-reference.
4. `07-security/tls-and-payment-path.md`, the honest gap disclosure.
5. `07-security/critical-override.md`, triggered or not.
6. `07-security/summary.md`, last, since it references all five prior files and leads with the override banner if triggered.

## 2. What `audit-scoring-wasp-drone` needs from this Drone

Every leaf score in `summary.md`'s findings table carries a numeric 0-6 value, an evidence pointer, and a one-line justification, or `audit-scoring-wasp-drone` rejects it back to this Drone (PRD-020 AC-5). Security is the single highest-weighted category in the entire rollup (20%, build plan section 4.2); an incomplete or unevidenced leaf here has more downstream impact on the final grade than the same gap in any other category. Re-read the findings table before considering a pass complete and confirm no row has an empty evidence or justification cell.

## 3. The override banner leads, everything else follows appearance order

Per `guides/06-critical-security-override-and-grade-cap.md` section 5, a triggered critical-override banner goes at the top of `summary.md`, ahead of the full findings table, regardless of where its underlying leaf appears in the checklist.

## 4. Explicit gaps stay explicit

`summary.md`'s "Explicit unresearched gaps" section carries the TLS-depth and payment-path items from `guides/05`, distinct from both the scored leaves and any N/A leaves. Do not let this section quietly disappear if both gaps happen to have nothing new to report that engagement; the section itself, even with a short entry, is the record that the gap was considered rather than skipped.

## 5. Update the evidence index

Append all six files above to `_shared/evidence-index.md`: path, what produced it, and the timestamp of when it was written.

## 6. Definition of done for this pass

- Every scored leaf has a 0-6 value, evidence pointer, and justification.
- The critical-override check ran and its result (triggered or not) is recorded and, if triggered, leads the summary.
- The vendor cross-reference ran against the actual `01-recon/vendor-inventory.md` for this engagement, not a generic restatement.
- The TLS and payment-path gaps are disclosed explicitly, not scored from unsupported inference.
- Nothing in the output duplicates `security-stinger`'s internal-repo catalog without cross-linking it instead, per `guides/07`.
- The rejected/reframed candidates table is present, even if empty.
- `_shared/evidence-index.md` was updated.

Only then is the pass complete and ready for `audit-scoring-wasp-drone` to read `07-security/` in wave W7.
