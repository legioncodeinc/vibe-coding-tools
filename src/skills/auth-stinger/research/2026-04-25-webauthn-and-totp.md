# WebAuthn / Passkeys + TOTP

**Sources:**
- https://www.w3.org/TR/webauthn-3/ (WebAuthn Level 3)
- https://datatracker.ietf.org/doc/html/rfc6238 (TOTP)
- https://simplewebauthn.dev (SimpleWebAuthn library docs)
- https://passkeys.dev (passkeys community resource)

**Retrieved:** 2026-04-25

## Summary

In 2026, passkeys (WebAuthn discoverable credentials) are the strongest second factor and increasingly the **first** factor: phishing-resistant, hardware-bound, biometric or PIN unlock. TOTP remains the universal fallback. SMS is recovery-only due to SIM-swap risk.

## Factor hierarchy

1. **Passkeys / WebAuthn**: phishing-resistant. Best default.
2. **TOTP (RFC 6238)**: universal fallback when passkeys aren't available.
3. **Email magic link / one-time code**: identity-verification, not a real second factor.
4. **Push to authenticator app**: Duo, MS Authenticator. Phishing-vulnerable.
5. **SMS / voice OTP**: recovery only.

## WebAuthn flow

- **Registration**: server generates `challenge`, user agent creates a credential bound to the RP ID, server stores `credentialId` + `publicKey` + `counter` + `transports`.
- **Authentication**: server generates `challenge`, user agent signs with the credential, server verifies signature against stored `publicKey`.
- **Conditional UI**: discoverable credentials enable browser autofill UX on the username field.
- **Library**: `@simplewebauthn/server` + `@simplewebauthn/browser` (Node). Equivalents in Python (`py_webauthn`), Go (`webauthn`), Rust (`webauthn-rs`).

## TOTP flow

- **Enrollment**: generate base32 secret (≥32 chars), build `otpauth://` URI, render as QR.
- **Verification**: verify code with ±1 30-second window standard.
- **Storage**: encrypt-at-rest. Never log.

## Recovery codes

- 10 single-use codes generated at MFA enrollment.
- Display once; hash before persist (bcrypt).
- Mark `used_at`; reject reuse.
- Re-prompt to regenerate after redemption.

## Magic links

- Single-use, short TTL (5-15 min), bound to email, hashed at rest.
- Token in URL is fine; never in fragment (browser-history exposure).

## SMS: recovery only

SIM-swap is the dominant attack. Rate-limit aggressively (3/hr per phone, 5/day). Never use SMS as the primary second factor.

## Relevance

- `guides/08-mfa-and-passkeys.md`: full deep dive.
- `guides/00-principles.md` Principle 4: recovery is part of MFA.
