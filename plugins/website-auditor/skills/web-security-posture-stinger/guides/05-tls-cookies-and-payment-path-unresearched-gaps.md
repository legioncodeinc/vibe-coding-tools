# TLS, cookies, and payment-path: what is and is not researched

Read this before scoring anything in these three scope areas; it is the single most important honesty check in this pair's procedure, since PRD-014's own overview names all three as in-scope while this Stinger's archive only actually supports one of them at header-checklist depth.

## 1. Cookies: covered, via the header checklist

Cookie flag evaluation (Secure/HttpOnly/SameSite) is covered by `guides/02-header-checklist-and-scoring.md` section 4 and `security-headers.py`'s per-cookie evidence output. This scope item is adequately supported by this pair's archive; score it normally.

## 2. TLS depth: NOT covered beyond one coarse check

Nothing in this Stinger's raw archive documents cipher-suite strength, certificate-chain validation depth, revocation checking, or TLS protocol-version enforcement, beyond OWASP's single-sentence warning that a long HSTS `max-age` combined with a lapsed certificate can lock out legitimate users. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] `security-headers.py`'s `coarse_tls_check` function confirms only that a standard client's default trust store accepts the certificate right now, and reports the stated expiry. Use `references/templates/tls-and-payment-path-gap-disclosure-template.md`'s TLS section verbatim; do not extend this coarse check into a scored 0-6 finding on cipher strength or chain depth, since no source supports that specific claim.

## 3. Payment-path integrity: NOT covered at all

No source in this pair's archive addresses checkout-flow script-integrity monitoring, PCI-DSS-relevant header or script controls, or payment-form injection detection, at any depth. [raw/cheatsheetseries-owasp-org-cheatsheets-http-headers-cheat-sheet-html.md] [raw/web-dev-articles-security-headers.md] [raw/searchatlas-com-otto-pixel.md] [raw/sme-mapree-dev-stack-tech-google-tag-manager.md] This is named explicitly in distilled research section 6 as a total gap, not a thin one. Do not assign a 0-6 score to a "payment-path integrity" leaf from this archive. Use `references/templates/tls-and-payment-path-gap-disclosure-template.md`'s payment-path section verbatim, at the passive/observational level PRD-014's goal describes: confirm HTTPS on any checkout page, cross-reference the vendor inventory for payment-adjacent scripts, and stop there. Never enter a real payment instrument or place an order; PRD-014 AC-3 requires explicit per-run opt-in for that, defaulting OFF.

## 4. Report the gap as a gap, not as a passed check

An unresearched scope item is not the same as an N/A (0) leaf. N/A means "this genuinely does not apply to this site" (build plan section 4.1); an unresearched item means "this Stinger's archive cannot support a sourced score here yet." Conflating the two would either silently drop a real scope item from the denominator (if scored N/A) or fabricate a passing score from no evidence (if scored 6). Keep both scope items in their own explicitly-labelled section, per the gap-disclosure template, distinct from both N/A leaves and scored leaves.
