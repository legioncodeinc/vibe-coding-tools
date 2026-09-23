# TLS depth and payment-path integrity: gap disclosure template

Copy-ready. This pair's scope explicitly names "TLS... payment-path integrity" (PRD-014 overview), but this Stinger's raw research archive documents neither at the depth its own scope implies. Distilled research section 6 states this directly: "Nothing in any of the four raw sources documents TLS/certificate configuration checks (cipher suites, certificate chain validation, expiry monitoring) beyond OWASP's one-line HSTS warning... Nothing in any of the four raw sources addresses payment-path integrity... at all." Per conduct rule 5 (confidence stated, not implied), this template is how those gaps get reported: honestly, as unresolved, never papered over with an invented finding.

## TLS: what this pair CAN check, and what it explicitly cannot

`shared/scripts/security-headers.py` performs one coarse check: does the HTTPS handshake complete with the default trust store, and what does the certificate's `notAfter` field say. This is not a TLS audit. Use this section's wording verbatim, filling only the evidence fields:

```markdown
### TLS: coarse check only

**What was checked:** HTTPS handshake success against the default system trust store, and the certificate's stated expiry date.
**Result:** {handshake_ok}, certificate expires {certificate_not_after}.
**What was NOT checked, and why:** Cipher-suite strength, full certificate-chain intermediate validation, revocation status (OCSP/CRL), and TLS protocol-version enforcement (e.g. whether TLS 1.0/1.1 are still accepted). This Stinger's research archive does not document TLS/certificate-configuration testing methodology beyond OWASP's single-sentence HSTS/lapsed-certificate warning (distilled-web-security-posture.md section 6). Report this as an explicit unresearched gap requiring a dedicated primary source before it can be scored with the same confidence as the header checklist, not as a passed or failed checkpoint.
```

## Payment-path integrity: what this pair CANNOT check from this archive

```markdown
### Payment-path integrity: unresearched, do not score

This Stinger's raw research archive contains no source addressing checkout-flow script-integrity monitoring, PCI-DSS-relevant header or script controls (e.g. Subresource Integrity on payment-form scripts, PCI DSS 4.0's script-inventory and change-detection requirements), or payment-form injection detection. Do not assign a 0-6 score to a "payment-path integrity" leaf from this archive alone; that would misrepresent an unresearched claim as a sourced one.

**What this pass did instead, at a passive/observational level only (PRD-014 goal, "no real payment instrument, no order placement"):**
- Confirmed (or did not confirm) that any checkout/payment page in `site-data/` is served over HTTPS.
- Cross-referenced `01-recon/vendor-inventory.md` for any payment-adjacent third-party script (payment-gateway SDK, buy-button widget) and noted its presence, per `client-side-injection-and-vendor-crossref-template.md`.
- Did NOT enter a real payment instrument or place an order (PRD-014 AC-3, opt-in-only).

**Recommendation to the engagement's auditor of record:** treat payment-path integrity as requiring a dedicated follow-up sweep against PCI DSS 4.0 client-side script requirements before this line item can be scored with sourced confidence.
```

## Where these go

Both sections land in `07-security/tls-and-payment-path.md`. Do not fold an unscored gap silently into the findings table as if it were a normal N/A (N/A means "genuinely not applicable to this site," not "we didn't research this"); keep it in its own clearly-labelled section instead.
