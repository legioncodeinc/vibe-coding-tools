# Audit procedure

End-to-end procedure for one engagement. Read this guide in full before starting a pass.

## 1. Preconditions

- `site-data/` exists and is non-empty (written by `site-crawler-wasp-drone` in W4).
- `01-recon/vendor-inventory.md` exists (written by `vendor-inventory-wasp-drone` in W1b). If either is missing, stop and report a blocking dependency failure; do not fabricate a header scan or a vendor cross-reference from an absent source.
- This Drone is read-only and passive by default, per conduct rule 1 and PRD-014's non-goal: no exploitation, no authentication bypass, no file-upload testing, no order placement, unless the engagement's run explicitly opts into interactive mode (default OFF).

## 2. Run the header scan

```
python3 shared/scripts/security-headers.py --url <landing_page_url> --out <workspace>/07-security/header-scan-findings.json
```

Optionally pass `--urls-file` with a handful of additional crawled URLs from `site-data/` (a checkout page, a login page) since header configuration can differ by route. This script performs read-only HEAD/GET requests only, per its own docstring's conduct-rule compliance.

## 3. Walk the header checklist

Open `references/templates/security-headers-scoring-checklist.md`, reconcile it against the script's raw output, and add any manual judgment the script cannot make (e.g. a present-but-syntactically-weak CSP). Read `guides/02-header-checklist-and-scoring.md` for depth on any specific header, and `guides/03-csp-strategy-nonce-vs-hash.md` before judging a CSP's actual strength, not just its presence.

## 4. Cross-reference the vendor inventory for injection surface

Read `01-recon/vendor-inventory.md` and work through `references/templates/client-side-injection-and-vendor-crossref-template.md`. This is where GTM's script-source unpredictability and any content-injection tool (Search Atlas OTTO Pixel or peers) get evaluated specifically for security-posture risk, not re-inventoried. Read `guides/04-client-side-injection-and-vendor-crossreference.md` first.

## 5. Disclose the TLS and payment-path gaps honestly

Fill `references/templates/tls-and-payment-path-gap-disclosure-template.md` exactly as written; do not invent a scored finding for either scope item beyond what the coarse TLS check in `security-headers.py`'s own output supports. Read `guides/05-tls-cookies-and-payment-path-unresearched-gaps.md` first.

## 6. Apply the critical-security-override check

Any leaf scoring 1 in this pass triggers the build plan's critical-security-override (section 4.3, Question 9 adopted): the final letter grade caps at C regardless of arithmetic. Fill `references/templates/critical-security-override-flag-template.md`, triggered or not, per `guides/06-critical-security-override-and-grade-cap.md`.

## 7. Write output and hand off

Follow `guides/08-report-and-handoff-to-scoring.md` for the exact files, their locations, and the evidence-index update. Before considering the pass complete, read `guides/07-relationship-to-internal-security-stinger.md` and confirm nothing in the output duplicates `security-stinger`'s internal-repo catalog rather than cross-linking it.
